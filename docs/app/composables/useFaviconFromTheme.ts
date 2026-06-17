import { watch } from 'vue'
import FaviconSvg from '../../public/icon.svg?raw'

export function useFaviconFromTheme() {
  const colorMode = useColorMode()
  const favicon = useFavicon()

  // var() 仅在真实属性引用时求值，用探针元素解析出具体 rgb() 颜色
  function resolvePrimaryColor() {
    const probe = document.createElement('span')
    probe.style.color = 'var(--ui-primary)'
    probe.style.display = 'none'
    document.body.appendChild(probe)
    const color = getComputedStyle(probe).color
    probe.remove()
    return color
  }

  function generateFaviconSvg(color: string) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(FaviconSvg, 'image/svg+xml')
    const svg = doc.documentElement

    svg.querySelectorAll('rect').forEach((rect) => {
      rect.setAttribute('fill', color)
    })

    return new XMLSerializer().serializeToString(svg)
  }

  function updateFavicon() {
    const color = resolvePrimaryColor()
    if (!color) return

    const svg = generateFaviconSvg(color)
    favicon.value = `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  function setupMutationObserver() {
    const styleTag = document.getElementById('nuxt-ui-colors')
    if (!styleTag) return

    const observer = new MutationObserver(() => {
      updateFavicon()
    })

    observer.observe(styleTag, {
      characterData: true,
      subtree: true,
      childList: true
    })
  }

  onNuxtReady(() => {
    watch(colorMode, () => {
      updateFavicon()
    }, {
      immediate: true,
      flush: 'post'
    })

    setupMutationObserver()
  })
}
