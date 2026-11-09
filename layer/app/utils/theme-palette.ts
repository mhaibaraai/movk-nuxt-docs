import colors from 'tailwindcss/colors'

export const PALETTE_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

export type PaletteShade = (typeof PALETTE_SHADES)[number]
export type PaletteAlias = 'primary' | 'neutral'
export type PaletteVars = Record<string, string>

/** 与 main.css 中 `@plugin "@nuxt/ui/colors"` 的配置保持一致 */
export const DEFAULT_PALETTES: Record<PaletteAlias, string> = {
  primary: 'vermilion',
  neutral: 'paper'
}

/** main.css 在 `@theme static` 中声明的色板，`--color-<name>-<shade>` 必然输出 */
export const CUSTOM_PALETTES = ['vermilion', 'paper'] as const

/** 自定义 neutral 色阶的首尾色，与 main.css 保持一致，供 theme-color meta 使用（不能是 CSS 变量） */
const CUSTOM_NEUTRAL_EDGES: Record<string, Record<50 | 950, string>> = {
  paper: { 50: '#faf9f5', 950: '#141413' }
}

const tailwindPalettes = colors as unknown as Record<string, Record<PaletteShade, string> | string | undefined>

function isCustomPalette(palette: string): boolean {
  return (CUSTOM_PALETTES as readonly string[]).includes(palette)
}

/**
 * 色板某一色阶的 CSS 值。自定义色板引用 `@theme static` 变量；Tailwind 内置色板取字面值，
 * 因为 v5 把 `--color-neutral-*` 指向了 `--ui-color-neutral-*`，引用变量会自我循环
 */
export function paletteShade(palette: string, shade: PaletteShade): string | undefined {
  if (isCustomPalette(palette)) return `var(--color-${palette}-${shade})`
  const shades = tailwindPalettes[palette]
  return shades && typeof shades === 'object' ? shades[shade] : undefined
}

/** 选中色板对应的 `--ui-color-<alias>-<shade>` 变量表，未知或未选择的色板不产生变量 */
export function resolvePaletteVars(selection: Partial<Record<PaletteAlias, string | null>>): PaletteVars {
  return Object.fromEntries(Object.entries(selection).flatMap(([alias, palette]) => {
    if (!palette || !paletteShade(palette, 500)) return []
    return PALETTE_SHADES.map(shade => [`--ui-color-${alias}-${shade}`, paletteShade(palette, shade)!])
  }))
}

/** 以内联样式写入色板变量，并移除上一次写入但本次不再需要的变量 */
export function applyPaletteVars(
  el: { style: Pick<CSSStyleDeclaration, 'setProperty' | 'removeProperty'> },
  next: PaletteVars,
  prev: PaletteVars = {}
): void {
  for (const key of Object.keys(prev)) {
    if (!(key in next)) el.style.removeProperty(key)
  }
  for (const [key, value] of Object.entries(next)) {
    el.style.setProperty(key, value)
  }
}

/** 浏览器 theme-color：亮色取 neutral-50，暗色取 neutral-950 */
export function resolveThemeColor(neutral: string, mode: string): string | undefined {
  const shade = mode === 'dark' ? 950 : 50
  return isCustomPalette(neutral) ? CUSTOM_NEUTRAL_EDGES[neutral]?.[shade] : paletteShade(neutral, shade)
}

const PALETTE_VAR_RE = /^--ui-color-(primary|neutral)-\d{2,3}$/

export function colorsStorageKey(name: string): string {
  return `${name}-ui-colors`
}

/** 读取 localStorage 中的色板变量表，只保留 `--ui-color-{primary,neutral}-<shade>` 字符串项 */
export function parsePaletteVars(raw: string | null): PaletteVars {
  try {
    const vars: unknown = JSON.parse(raw || 'null')
    if (!vars || typeof vars !== 'object') return {}
    return Object.fromEntries(Object.entries(vars).filter(([key, value]) => PALETTE_VAR_RE.test(key) && typeof value === 'string'))
  } catch {
    return {}
  }
}

/** 首屏前把已保存的色板变量写到 `<html>` 内联样式，避免切换过的主色 / 中性色闪烁 */
export function createColorRestoreScript(name: string): string {
  return `(function () {
    try {
      var vars = JSON.parse(localStorage.getItem(${JSON.stringify(colorsStorageKey(name))}) || 'null');
      if (!vars || typeof vars !== 'object') return;
      for (var key in vars) {
        if (${PALETTE_VAR_RE}.test(key) && typeof vars[key] === 'string') {
          document.documentElement.style.setProperty(key, vars[key]);
        }
      }
    } catch (e) {}
  })();`.replace(/\s+/g, ' ')
}
