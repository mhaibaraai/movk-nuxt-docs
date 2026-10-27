import type { ExtendedButtonProps } from './types'

export default defineAppConfig({
  i18n: {
    locale: 'zh-CN'
  },
  toaster: {
    position: 'bottom-right' as const,
    duration: 5000,
    max: 5,
    expand: true
  },
  theme: {
    radius: 0.25,
    blackAsPrimary: false,
    icons: 'lucide',
    font: 'editorial' as 'editorial' | 'sans',
    grain: false
  },
  ui: {
    colors: {
      primary: 'vermilion',
      neutral: 'paper'
    },
    // 去掉树形竖线与选中底色：当前项墨色，左侧朱红指示条由 DocsAsideLeftBody 统一绘制并滑动
    contentNavigation: {
      slots: {
        list: 'mx-0 mt-0',
        listWithChildren: 'ms-3 border-s-0',
        link: 'ps-3 pe-0 py-1.5 before:hidden text-[0.9rem]',
        linkTrailingBadge: 'font-mono text-[10px] uppercase tracking-wider'
      },
      variants: {
        active: {
          true: {
            link: 'text-highlighted font-medium'
          },
          false: {
            link: 'text-muted hover:text-highlighted'
          }
        }
      }
    },
    // ⌘K：高亮项与侧栏当前项一致，墨色文字 + 左侧朱红短条
    commandPalette: {
      slots: {
        label: 'text-xs font-medium text-muted',
        item: 'before:rounded-none data-highlighted:after:absolute data-highlighted:after:start-0 data-highlighted:after:inset-y-1.5 data-highlighted:after:w-0.5 data-highlighted:after:bg-primary'
      },
      variants: {
        active: {
          false: {
            item: 'data-highlighted:not-data-disabled:before:bg-muted'
          }
        }
      }
    },
    contentToc: {
      slots: {
        root: 'bg-default lg:bg-transparent backdrop-blur-none',
        container: 'border-solid',
        trigger: 'text-[13px] font-semibold text-highlighted',
        listWithChildren: 'ms-4',
        link: 'py-1.5 text-[13px]'
      }
    },
    // 上下篇：去卡片，细线分栏 + kicker + 衬线标题
    contentSurround: {
      slots: {
        root: 'gap-0 border-t border-inverted',
        link: 'px-0 py-6 sm:even:ps-8 sm:odd:pe-8 sm:even:border-s border-default rounded-none border-0 hover:bg-transparent',
        linkLeading: 'p-0 mb-3 bg-transparent ring-0 rounded-none group-hover:bg-transparent',
        linkLeadingIcon: 'size-4 text-muted group-hover:text-primary',
        linkTitle: 'font-display text-xl font-bold mb-1.5 group-hover:text-primary transition-colors',
        linkDescription: 'text-sm text-muted'
      }
    },
    pageLinks: {
      slots: {
        title: 'text-[13px] font-semibold text-highlighted',
        link: 'text-[13px] text-muted hover:text-highlighted'
      }
    },
    pageHeader: {
      slots: {
        root: 'pt-10 pb-8',
        headline: 'mb-5',
        title: '[view-transition-name:page-title] font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-balance',
        description: 'text-lg/relaxed sm:text-xl/relaxed text-toned max-w-3xl'
      }
    },
    prose: {
      h1: {
        slots: { base: 'font-display font-bold tracking-tight' }
      },
      // 衬线 + 上方细线：快速滚动时的分节锚点
      h2: {
        slots: {
          base: 'font-display font-bold tracking-tight text-[1.75rem] leading-tight mt-14 pt-6 border-t border-default first:mt-0 first:pt-0 first:border-t-0',
          leading: 'top-7'
        }
      },
      h3: {
        slots: { base: 'font-semibold' }
      },
      a: {
        base: 'border-primary/40'
      },
      pre: {
        slots: {
          header: 'border-muted bg-muted border-b border-dashed px-4 py-2',
          filename: 'font-mono text-xs text-muted',
          copy: 'inline-flex items-center gap-1.5 top-2 end-2 px-2 py-1 bg-muted font-mono text-[11px] uppercase tracking-[0.12em] transition-[color,opacity]',
          base: 'bg-muted'
        }
      },
      // 左侧色线代替整块着色，正文保持默认墨色
      code: {
        base: 'border-0! bg-muted rounded-sm px-1.5 py-px text-[0.875em] font-normal'
      },
      card: {
        slots: {
          base: 'rounded-none bg-transparent border-default hover:border-inverted p-5 sm:p-5',
          icon: 'size-5 mb-4 text-primary',
          title: 'font-display text-lg font-bold',
          externalIcon: 'end-3 top-3'
        }
      },
      callout: {
        slots: {
          base: 'rounded-none! border-0! border-s-2! border-solid! bg-transparent! text-default! ps-4 py-1'
        },
        variants: {
          color: {
            primary: { base: 'border-primary' },
            secondary: { base: 'border-secondary' },
            info: { base: 'border-info' },
            success: { base: 'border-success' },
            warning: { base: 'border-warning' },
            error: { base: 'border-error' },
            important: { base: 'border-important' },
            neutral: { base: 'border-inverted' }
          }
        }
      },
      table: {
        slots: {
          root: 'rounded-none',
          base: 'rounded-none'
        }
      },
      th: {
        base: 'border-0 border-b border-inverted first:border-s-0 px-4 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted'
      },
      td: {
        base: 'border-0 border-b border-default first:border-s-0 px-4'
      },
      codeGroup: {
        slots: {
          list: 'border-muted bg-muted p-0 gap-0 border-b border-dashed',
          indicator: 'inset-y-auto bottom-0 h-0.5 bg-primary rounded-none shadow-none',
          trigger: 'rounded-none px-4 py-2 hover:bg-transparent font-mono text-xs text-muted data-[state=active]:text-highlighted'
        }
      }
    }
  },
  header: {
    to: '/',
    search: true,
    colorMode: true,
    links: [] as ExtendedButtonProps[]
  },
  footer: {
    credits: `Copyright © 2024 - ${new Date().getFullYear()}`,
    socials: [] as ExtendedButtonProps[]
  },
  toc: {
    bottom: {
      links: [] as ExtendedButtonProps[]
    }
  },
  aside: {
    filter: {
      enabled: false,
      threshold: 10,
      shortcut: '/'
    }
  },
  github: {
    rootDir: '',
    dateFormat: {
      locale: 'zh-CN',
      options: {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    }
  },
  aiChat: {
    floatingInput: true,
    explainWithAi: true,
    shortcuts: {
      focusInput: 'meta_i'
    },
    icons: {
      trigger: 'i-custom-ai',
      explain: 'i-lucide-bot-message-square',
      reasoning: 'i-lucide-brain',
      close: 'i-lucide-panel-right-close',
      clearChat: 'i-lucide-list-x',
      providers: {
        openai: 'i-simple-icons-openai',
        anthropic: 'i-simple-icons-anthropic',
        deepseek: 'i-hugeicons-deepseek',
        alibaba: 'i-hugeicons-qwen',
        zai: 'i-custom-zai',
        moonshotai: 'i-hugeicons-kimi-ai',
        xai: 'i-hugeicons-grok-02'
      }
    }
  }
})
