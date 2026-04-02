import { defineFontProvider } from 'unifont'
import type { FontFaceData } from 'unifont'

const WEIGHT_MAP: Record<string, string> = {
  100: 'Thin',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Heavy',
  950: 'Black'
}

const FONT_FAMILY = 'Alibaba PuHuiTi'

export function createAlibabaPuHuiTiProvider(cdnBase: string) {
  return defineFontProvider('alibaba-puhuiti', () => ({
    async resolveFont(fontFamily, options) {
      if (fontFamily !== FONT_FAMILY) return undefined

      const weights = options.weights?.length
        ? options.weights.filter(w => WEIGHT_MAP[w])
        : Object.keys(WEIGHT_MAP)

      const fonts: FontFaceData[] = weights.map(weight => ({
        src: [{ url: `${cdnBase}/AlibabaPuHuiTi-${WEIGHT_MAP[weight]}.woff2`, format: 'woff2' }],
        weight,
        style: 'normal'
      }))

      return { fonts }
    }
  }))
}
