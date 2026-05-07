import { themeIcons } from '../utils/theme'
import { kebabCase } from '@movk/core'

export default defineNuxtPlugin({
  enforce: 'post',
  setup() {
    const appConfig = useAppConfig()
    const site = useSiteConfig()
    const name = kebabCase(site.name)

    if (import.meta.client) {
      const primary = localStorage.getItem(`${name}-ui-primary`)
      if (primary) appConfig.ui.colors.primary = primary

      const neutral = localStorage.getItem(`${name}-ui-neutral`)
      if (neutral) appConfig.ui.colors.neutral = neutral

      const icons = localStorage.getItem(`${name}-ui-icons`)
      if (icons) appConfig.ui.icons = themeIcons[icons as keyof typeof themeIcons] as any
    }

    if (import.meta.server) {
      useHead({
        script: [{
          innerHTML: `
            (function() {
              var primaryColor = localStorage.getItem('${name}-ui-primary');
              var neutralColor = localStorage.getItem('${name}-ui-neutral');
              if (!primaryColor && !neutralColor) return;
              function swapColors(el) {
                var html = el.innerHTML;
                if (primaryColor && primaryColor !== 'black') {
                  html = html.replace(
                    /(--ui-color-primary-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.primary}(-\\d{2,3}.*?\\))/g,
                    \`$1\${primaryColor}$2\`
                  );
                }
                if (neutralColor) {
                  html = html.replace(
                    /(--ui-color-neutral-\\d{2,3}:\\s*var\\(--color-)${appConfig.ui.colors.neutral}(-\\d{2,3}.*?\\))/g,
                    \`$1\${neutralColor === 'neutral' ? 'old-neutral' : neutralColor}$2\`
                  );
                }
                el.innerHTML = html;
              }
              var colorsEl = document.querySelector('style#nuxt-ui-colors');
              if (colorsEl) {
                swapColors(colorsEl);
              } else {
                var obs = new MutationObserver(function(mutations) {
                  for (var i = 0; i < mutations.length; i++) {
                    for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                      var node = mutations[i].addedNodes[j];
                      if (node.id === 'nuxt-ui-colors') {
                        swapColors(node);
                        obs.disconnect();
                        return;
                      }
                    }
                  }
                });
                obs.observe(document.head, { childList: true });
              }
            })();
            `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            var r = localStorage.getItem('${name}-ui-radius');
            if (r) document.documentElement.style.setProperty('--ui-radius', r + 'rem');
          `.replace(/\s+/g, ' '),
          type: 'text/javascript',
          tagPriority: -1
        }, {
          innerHTML: `
            if (localStorage.getItem('${name}-ui-black-as-primary') === 'true') {
              var isDark = document.documentElement.classList.contains('dark');
              document.documentElement.style.setProperty('--ui-primary', isDark ? 'white' : 'black');
            }
          `.replace(/\s+/g, ' ')
        }, {
          innerHTML: [
            `if (localStorage.getItem('${name}-ui-font')) {`,
            `var font = localStorage.getItem('${name}-ui-font');`,
            `var fontEl = document.querySelector('style#nuxt-ui-font');`,
            `if (fontEl) { fontEl.innerHTML = ':root { --font-sans: \\'' + font + '\\', sans-serif; }'; }`,
            `var lnk = document.createElement('link');`,
            `lnk.rel = 'stylesheet';`,
            `lnk.href = font === 'Alibaba PuHuiTi' ? 'https://cdn.mhaibaraai.cn/fonts/alibaba-puhuiti.css' : 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(font) + ':wght@400;500;600;700&display=swap';`,
            `lnk.id = 'font-' + font.toLowerCase().replace(/\\s+/g, '-');`,
            `document.head.appendChild(lnk);`,
            `}`
          ].join(' ')
        }]
      })
    }
  }
})
