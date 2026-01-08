/**
 * 解码字符串中的 Unicode 转义序列
 * @param str 包含 Unicode 转义序列的字符串（如 '\u5411 AI \u63D0\u95EE'）
 * @returns 解码后的字符串（如 '向 AI 提问'）
 * @example
 * decodeUnicodeEscapes("'\\u5411 AI \\u63D0\\u95EE'") // => "'向 AI 提问'"
 */
export function decodeUnicodeEscapes(str: string): string {
  return str.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
    return String.fromCharCode(Number.parseInt(match.replace('\\u', ''), 16))
  })
}
