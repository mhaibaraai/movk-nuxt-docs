// 关闭全部可选功能，验证空实现与按需安装逻辑
export default defineNuxtConfig({
  extends: ['@movk/nuxt-docs'],

  compatibilityDate: 'latest',

  aiChat: {
    enabled: false
  },

  movkNuxtDocs: {
    componentDocs: false,
    mcp: false,
    ogImage: false,
    mermaid: false,
    a11y: false
  }
})
