import { themeIcons } from '../utils/theme'

export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()
    const site = useSiteConfig()

    if (import.meta.client) {
      function updateColor(type: 'primary' | 'neutral') {
        const color = localStorage.getItem(`${site.name}-ui-${type}`)
        if (color) {
          appConfig.ui.colors[type] = color
        }
      }

      function updateRadius() {
        const radius = localStorage.getItem(`${site.name}-ui-radius`)
        if (radius) {
          appConfig.theme.radius = Number.parseFloat(radius)
        }
      }

      function updateBlackAsPrimary() {
        const blackAsPrimary = localStorage.getItem(`${site.name}-ui-black-as-primary`)
        if (blackAsPrimary) {
          appConfig.theme.blackAsPrimary = blackAsPrimary === 'true'
        }
      }

      function updateFont() {
        const font = localStorage.getItem(`${site.name}-ui-font`)
        if (font) {
          appConfig.theme.font = font
        }
      }

      updateColor('primary')
      updateColor('neutral')
      updateRadius()
      updateBlackAsPrimary()
      updateFont()
    }

    onNuxtReady(() => {
      function updateIcons() {
        const icons = localStorage.getItem(`${site.name}-ui-icons`)
        if (icons) {
          appConfig.theme.icons = icons
          appConfig.ui.icons = themeIcons[icons as keyof typeof themeIcons] as any
        }
      }

      updateIcons()
    })

    if (import.meta.server) {
      useHead({
        script: [{
          innerHTML: `
            let html = document.querySelector('style#nuxt-ui-colors').innerHTML;

            if (localStorage.getItem('${site.name}-ui-primary')) {
              const primaryColor = localStorage.getItem('${site.name}-ui-primary');
              if (primaryColor !== 'black') {
                html = html.replace(
                  /(--ui-color-primary-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.primary}(-\\d{2,3}.*?\\))/g,
                  \`$1\${primaryColor}$2\`
                );
              }
            }
            if (localStorage.getItem('${site.name}-ui-neutral')) {
              let neutralColor = localStorage.getItem('${site.name}-ui-neutral');
              html = html.replace(
                /(--ui-color-neutral-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.neutral}(-\\d{2,3}.*?\\))/g,
                \`$1\${neutralColor === 'neutral' ? 'old-neutral' : neutralColor}$2\`
              );
            }

            document.querySelector('style#nuxt-ui-colors').innerHTML = html;
            `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            if (localStorage.getItem('${site.name}-ui-radius')) {
              document.querySelector('style#nuxt-ui-radius').innerHTML = ':root { --ui-radius: ' + localStorage.getItem('${site.name}-ui-radius') + 'rem; }';
            }
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            if (localStorage.getItem('${site.name}-ui-black-as-primary') === 'true') {
              document.querySelector('style#nuxt-ui-black-as-primary').innerHTML = ':root { --ui-primary: black; } .dark { --ui-primary: white; }';
            } else {
              document.querySelector('style#nuxt-ui-black-as-primary').innerHTML = '';
            }
          `.replace(/\s+/g, ' ')
        }, {
          innerHTML: `
            if (localStorage.getItem('${site.name}-ui-font')) {
              const font = localStorage.getItem('${site.name}-ui-font');
              document.querySelector('style#nuxt-ui-font').innerHTML = ':root { --font-sans: \\'' + font + '\\', sans-serif; }';
            }
          `.replace(/\s+/g, ' ')
        }]
      })
    }
  }
})
