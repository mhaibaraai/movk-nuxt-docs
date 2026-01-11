import { field, group } from '@nuxt/content/preview'

export default defineNuxtSchema({
  appConfig: {
    vercelAnalytics: group({
      title: 'Vercel Analytics',
      description: 'Vercel Analytics 配置',
      icon: 'i-lucide-activity',
      fields: {
        enable: field({
          type: 'boolean',
          title: '启用 Analytics',
          description: '是否启用 Vercel Analytics',
          icon: 'i-lucide-toggle-right',
          default: false
        }),
        debug: field({
          type: 'boolean',
          title: '调试模式',
          description: '是否启用调试模式',
          icon: 'i-lucide-bug',
          default: false
        })
      }
    }),

    seo: group({
      title: 'SEO',
      description: 'SEO 相关配置',
      icon: 'i-lucide-search',
      fields: {
        titleTemplate: field({
          type: 'string',
          title: '标题模板',
          description: '页面标题模板，使用 %s 作为占位符',
          icon: 'i-lucide-layout-template',
          default: '%s'
        }),
        title: field({
          type: 'string',
          title: '站点标题',
          description: '网站的默认标题',
          icon: 'i-lucide-heading',
          default: ''
        }),
        description: field({
          type: 'string',
          title: '站点描述',
          description: '网站的默认描述',
          icon: 'i-lucide-text',
          default: ''
        })
      }
    }),

    header: group({
      title: 'Header',
      description: '页面头部配置',
      icon: 'i-lucide-layout-dashboard',
      fields: {
        title: field({
          type: 'string',
          title: '标题',
          description: 'Header 中显示的标题',
          icon: 'i-lucide-type',
          default: ''
        }),
        avatar: field({
          type: 'string',
          title: '头像',
          description: '头像图片 URL',
          icon: 'i-lucide-user-circle',
          default: ''
        }),
        to: field({
          type: 'string',
          title: '链接地址',
          description: '点击标题跳转的地址',
          icon: 'i-lucide-link',
          default: '/'
        }),
        search: field({
          type: 'boolean',
          title: '搜索功能',
          description: '是否显示搜索框',
          icon: 'i-lucide-search',
          default: true
        }),
        colorMode: field({
          type: 'boolean',
          title: '主题切换',
          description: '是否显示主题切换按钮',
          icon: 'i-lucide-sun-moon',
          default: true
        }),
        links: field({
          type: 'array',
          title: 'Header 链接',
          description: 'Header 中显示的导航链接按钮',
          icon: 'i-lucide-link',
          default: []
        })
      }
    }),

    footer: group({
      title: 'Footer',
      description: '页面底部配置',
      icon: 'i-lucide-layout-footer',
      fields: {
        credits: field({
          type: 'string',
          title: '版权信息',
          description: 'Footer 中显示的版权信息',
          icon: 'i-lucide-copyright',
          default: ''
        }),
        socials: field({
          type: 'array',
          title: '社交媒体链接',
          description: 'Footer 中显示的社交媒体链接按钮',
          icon: 'i-lucide-share-2',
          default: []
        })
      }
    }),

    toc: group({
      title: 'TOC',
      description: '目录配置',
      icon: 'i-lucide-list-tree',
      fields: {
        title: field({
          type: 'string',
          title: '目录标题',
          description: '目录区域的标题',
          icon: 'i-lucide-heading',
          default: '目录'
        }),

        bottom: group({
          title: '底部配置',
          description: '目录底部区域配置',
          icon: 'i-lucide-align-vertical-distribute-end',
          fields: {
            title: field({
              type: 'string',
              title: '底部标题',
              description: '目录底部区域的标题',
              icon: 'i-lucide-heading',
              default: ''
            }),
            links: field({
              type: 'array',
              title: '底部链接',
              description: '目录底部显示的链接按钮',
              icon: 'i-lucide-link',
              default: []
            })
          }
        })
      }
    }),

    github: group({
      title: 'GitHub',
      description: 'GitHub 仓库配置',
      icon: 'i-lucide-github',
      fields: {
        owner: field({
          type: 'string',
          title: '仓库所有者',
          description: 'GitHub 仓库所有者用户名',
          icon: 'i-lucide-user',
          default: ''
        }),
        name: field({
          type: 'string',
          title: '仓库名称',
          description: 'GitHub 仓库名称',
          icon: 'i-lucide-folder-git',
          default: ''
        }),
        url: field({
          type: 'string',
          title: '仓库 URL',
          description: 'GitHub 仓库完整 URL',
          icon: 'i-lucide-link',
          default: ''
        }),
        branch: field({
          type: 'string',
          title: '分支',
          description: '默认分支名称',
          icon: 'i-lucide-git-branch',
          default: 'main'
        }),
        rootDir: field({
          type: 'string',
          title: '根目录',
          description: '文档在仓库中的根目录',
          icon: 'i-lucide-folder',
          default: ''
        }),
        commitPath: field({
          type: 'string',
          title: 'Commit 路径',
          description: 'GitHub commit 页面路径模板',
          icon: 'i-lucide-git-commit',
          default: '/commit'
        }),
        since: field({
          type: 'string',
          title: '开始日期',
          description: '获取提交记录的开始日期',
          icon: 'i-lucide-calendar',
          default: ''
        }),
        suffix: field({
          type: 'string',
          title: '文件后缀',
          description: '文档文件的后缀',
          icon: 'i-lucide-file',
          default: '.md'
        }),
        per_page: field({
          type: 'number',
          title: '每页数量',
          description: '每页显示的 commit 数量',
          icon: 'i-lucide-hash',
          default: 30
        }),
        until: field({
          type: 'string',
          title: '结束日期',
          description: '获取提交记录的结束日期',
          icon: 'i-lucide-calendar',
          default: ''
        }),
        author: field({
          type: 'string',
          title: '作者',
          description: '过滤特定作者的提交',
          icon: 'i-lucide-user',
          default: ''
        }),
        casing: field({
          type: 'string',
          title: '文件命名格式',
          description: '文件命名格式：auto（自动）、kebab（短横线）、camel（驼峰）、pascal（帕斯卡）',
          icon: 'i-lucide-case-sensitive',
          default: 'auto'
        }),

        dateFormat: group({
          title: '日期格式化',
          description: '日期格式化配置',
          icon: 'i-lucide-calendar-clock',
          fields: {
            locale: field({
              type: 'string',
              title: 'Locale',
              description: '日期的地区设置（如 zh-CN、en-US）',
              icon: 'i-lucide-globe',
              default: 'zh-CN'
            }),
            options: field({
              type: 'object',
              title: '格式化选项',
              description: 'Intl.DateTimeFormat 的配置选项（JSON 对象）',
              icon: 'i-lucide-settings',
              default: {}
            })
          }
        })
      }
    }),

    aiChat: group({
      title: 'AI Chat',
      description: 'AI 聊天助手配置',
      icon: 'i-lucide-sparkles',
      fields: {
        floatingInput: field({
          type: 'boolean',
          title: '浮动输入框',
          description: '在文档页面底部显示浮动输入框',
          icon: 'i-lucide-message-square',
          default: true
        }),
        explainWithAi: field({
          type: 'boolean',
          title: '用 AI 解释',
          description: '在文档侧边栏中显示「用 AI 解释」按钮',
          icon: 'i-lucide-brain',
          default: true
        }),
        faqQuestions: field({
          type: 'array',
          title: 'FAQ 问题',
          description: '显示的常见问题解答问题。支持简单格式（字符串数组）或分类格式（对象数组）',
          icon: 'i-lucide-help-circle',
          default: []
        }),

        shortcuts: group({
          title: '快捷键',
          description: '键盘快捷键配置',
          icon: 'i-lucide-keyboard',
          fields: {
            focusInput: field({
              type: 'string',
              title: '聚焦输入框',
              description: '快捷键用于聚焦浮动输入框',
              icon: 'i-lucide-focus',
              default: 'meta_i'
            })
          }
        }),

        texts: group({
          title: '文本配置',
          description: 'UI 文本配置',
          icon: 'i-lucide-languages',
          fields: {
            title: field({
              type: 'string',
              title: '标题',
              description: 'AI 聊天面板的标题文本',
              icon: 'i-lucide-heading',
              default: 'AI 助手'
            }),
            collapse: field({
              type: 'string',
              title: '折叠按钮',
              description: '折叠按钮的文本',
              icon: 'i-lucide-chevron-up',
              default: '折叠'
            }),
            expand: field({
              type: 'string',
              title: '展开按钮',
              description: '展开按钮的文本',
              icon: 'i-lucide-chevron-down',
              default: '展开'
            }),
            clearChat: field({
              type: 'string',
              title: '清除聊天记录',
              description: '清除聊天记录按钮的文本',
              icon: 'i-lucide-trash-2',
              default: '清除聊天记录'
            }),
            close: field({
              type: 'string',
              title: '关闭按钮',
              description: '关闭按钮的文本',
              icon: 'i-lucide-x',
              default: '关闭'
            }),
            loading: field({
              type: 'string',
              title: '加载中',
              description: '加载时的提示文本',
              icon: 'i-lucide-loader',
              default: 'Loading...'
            }),
            askAnything: field({
              type: 'string',
              title: '询问提示',
              description: '询问任何事情的文本',
              icon: 'i-lucide-message-circle',
              default: '问我任何事情...'
            }),
            askMeAnythingDescription: field({
              type: 'string',
              title: '询问提示描述',
              description: '询问任何事情的描述文本',
              icon: 'i-lucide-info',
              default: '我可以帮助您浏览文档、解释概念并回答您的问题。'
            }),
            faq: field({
              type: 'string',
              title: 'FAQ 建议',
              description: 'FAQ 建议标题文本',
              icon: 'i-lucide-help-circle',
              default: 'FAQ 建议'
            }),
            placeholder: field({
              type: 'string',
              title: '输入占位符',
              description: '浮动输入框的占位符文本',
              icon: 'i-lucide-type',
              default: '输入你的问题...'
            }),
            lineBreak: field({
              type: 'string',
              title: '换行提示',
              description: '换行的提示文本',
              icon: 'i-lucide-corner-down-left',
              default: '换行'
            }),
            trigger: field({
              type: 'string',
              title: '触发按钮',
              description: 'AI 聊天面板触发按钮的提示文本',
              icon: 'i-lucide-sparkles',
              default: '与 AI 聊天'
            }),
            streaming: field({
              type: 'string',
              title: '思考中',
              description: '思考时的提示文本',
              icon: 'i-lucide-brain',
              default: '思考中...'
            }),
            streamed: field({
              type: 'string',
              title: '思考完成',
              description: '思考后的提示文本',
              icon: 'i-lucide-check-circle',
              default: '思考过程'
            }),
            explainWithAi: field({
              type: 'string',
              title: '用 AI 解释按钮',
              description: '用 AI 解释按钮的文本',
              icon: 'i-lucide-brain',
              default: '用 AI 解释此页面'
            })
          }
        }),

        icons: group({
          title: '图标配置',
          description: 'UI 图标配置',
          icon: 'i-lucide-icon',
          fields: {
            loading: field({
              type: 'string',
              title: '加载图标',
              description: '加载时的图标',
              icon: 'i-lucide-loader',
              default: 'i-lucide-loader'
            }),
            trigger: field({
              type: 'string',
              title: '触发图标',
              description: 'AI 聊天触发按钮的图标',
              icon: 'i-lucide-sparkles',
              default: 'i-lucide-sparkles'
            }),
            explain: field({
              type: 'string',
              title: '解释图标',
              description: '「用 AI 解释」按钮的图标',
              icon: 'i-lucide-brain',
              default: 'i-lucide-brain'
            }),
            streaming: field({
              type: 'string',
              title: '思考图标',
              description: '思考时的图标',
              icon: 'i-lucide-chevron-down',
              default: 'i-lucide-chevron-down'
            }),
            clearChat: field({
              type: 'string',
              title: '清除图标',
              description: '清除聊天记录按钮的图标',
              icon: 'i-lucide-trash-2',
              default: 'i-lucide-trash-2'
            }),
            close: field({
              type: 'string',
              title: '关闭图标',
              description: '关闭按钮的图标',
              icon: 'i-lucide-x',
              default: 'i-lucide-x'
            }),
            providers: field({
              type: 'object',
              title: 'AI 提供商图标',
              description: '用于映射不同 AI 提供商的图标（JSON 对象，键为提供商名称，值为图标名称）',
              icon: 'i-lucide-layout-grid',
              default: {}
            })
          }
        })
      }
    })
  }
})
