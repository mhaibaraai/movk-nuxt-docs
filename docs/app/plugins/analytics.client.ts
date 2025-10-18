import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
import { createApp, h } from 'vue'

export default defineNuxtPlugin({
  name: 'vercel-analytics',
  enforce: 'post',
  hooks: {
    'app:mounted': () => {
      if (import.meta.dev) return

      const container = document.createElement('div')
      container.id = 'vercel-analytics'
      document.body.appendChild(container)

      const app = createApp({
        render: () => h('div', { style: 'display: none;' }, [
          h(Analytics, { debug: false }),
          h(SpeedInsights, { debug: false })
        ])
      })

      app.mount(container)
    }
  }
})
