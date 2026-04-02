import { themeIcons } from '../utils/theme'

export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()
    const site = useSiteConfig()

    if (import.meta.client) {
      const primary = localStorage.getItem(`${site.name}-ui-primary`)
      if (primary) appConfig.ui.colors.primary = primary

      const neutral = localStorage.getItem(`${site.name}-ui-neutral`)
      if (neutral) appConfig.ui.colors.neutral = neutral

      const icons = localStorage.getItem(`${site.name}-ui-icons`)
      if (icons) appConfig.ui.icons = themeIcons[icons as keyof typeof themeIcons] as any
    }

    if (import.meta.server) {
      useHead({
        script: [{
          innerHTML: `
            var colorsEl = document.querySelector('style#nuxt-ui-colors');
            if (colorsEl) {
              let html = colorsEl.innerHTML;
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

              colorsEl.innerHTML = html;
            }
            `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            if (localStorage.getItem('${site.name}-ui-radius')) {
              document.getElementById('${site.name}-ui-radius').innerHTML = ':root { --ui-radius: ' + localStorage.getItem('${site.name}-ui-radius') + 'rem; }';
            }
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            if (localStorage.getItem('${site.name}-ui-black-as-primary') === 'true') {
              document.getElementById('${site.name}-ui-black-as-primary').innerHTML = ':root { --ui-primary: black; } .dark { --ui-primary: white; }';
            } else {
              document.getElementById('${site.name}-ui-black-as-primary').innerHTML = '';
            }
          `.replace(/\s+/g, ' ')
        }, {
          innerHTML: [
            `if (localStorage.getItem('${site.name}-ui-font')) {`,
            `var font = localStorage.getItem('${site.name}-ui-font');`,
            `document.getElementById('${site.name}-ui-font').innerHTML = ':root { --font-sans: \\'' + font + '\\', sans-serif; }';`,
            `if (font !== 'Alibaba PuHuiTi' && ['Alibaba PuHuiTi', 'Public Sans', 'DM Sans', 'Geist', 'Inter', 'Poppins', 'Outfit', 'Raleway'].includes(font)) {`,
            `var lnk = document.createElement('link');`,
            `lnk.rel = 'stylesheet';`,
            `lnk.href = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(font) + ':wght@400;500;600;700&display=swap';`,
            `lnk.id = 'font-' + font.toLowerCase().replace(/\\s+/g, '-');`,
            `document.head.appendChild(lnk);`,
            `}}`
          ].join(' ')
        }]
      })
    }
  }
})
