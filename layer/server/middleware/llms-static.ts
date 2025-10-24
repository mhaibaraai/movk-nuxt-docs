export default defineEventHandler((event) => {
  const path = event.path

  if (path === '/llms.txt' || path === '/llms-full.txt') {
    if (process.env.NODE_ENV === 'production') {
      event.node.res.setHeader('X-Served-By', 'static')
      return
    }
  }
})
