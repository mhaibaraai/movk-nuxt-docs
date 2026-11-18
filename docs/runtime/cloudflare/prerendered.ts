interface CloudflareAssets {
  fetch: (request: Request) => Promise<Response>
}

export default defineEventHandler(async (event) => {
  const cloudflare = event.context.cloudflare as { request: Request, env: { ASSETS: CloudflareAssets } } | undefined
  const vary = getResponseHeader(event, 'vary')
  if (!cloudflare?.env.ASSETS || !vary || (event.method !== 'GET' && event.method !== 'HEAD')) {
    return
  }

  const response = await cloudflare.env.ASSETS.fetch(cloudflare.request)
  if (response.status === 404) {
    return
  }

  const html = new Response(response.body, response)
  html.headers.append('vary', String(vary))
  return sendWebResponse(event, html)
})
