interface CloudflareAssets {
  fetch: (request: Request) => Promise<Response>
}

export default defineEventHandler(async (event) => {
  const cloudflare = event.context.cloudflare as { request: Request, env: { ASSETS: CloudflareAssets } } | undefined
  if (!cloudflare?.env.ASSETS || (event.method !== 'GET' && event.method !== 'HEAD')) {
    return
  }

  // Exact asset paths are handled by Nitro's Worker entrypoint. Resolve the HTML
  // representation here after negotiation for extensionless page URLs.
  const url = new URL(cloudflare.request.url)
  if (!/^\/(?:$|(?:en|docs|releases|templates)(?:\/|$))/.test(url.pathname) || /\.[^/]+$/.test(url.pathname)) {
    return
  }

  const response = await cloudflare.env.ASSETS.fetch(cloudflare.request)
  if (response.status === 404) {
    return
  }

  const vary = getResponseHeader(event, 'vary')
  if (!vary) {
    return sendWebResponse(event, response)
  }
  const html = new Response(response.body, response)
  html.headers.append('vary', String(vary))
  return sendWebResponse(event, html)
})
