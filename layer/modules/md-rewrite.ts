import { defineNuxtModule } from 'nuxt/kit'

const AGENT_UA_PATTERN
  = '.*(ClaudeBot|Claude-Web|anthropic-ai|GPTBot|ChatGPT-User|OAI-SearchBot|Google-Extended|Google-CloudVertexBot|Meta-ExternalAgent|Meta-ExternalFetcher|PerplexityBot|YouBot|DeepSeekBot|Amazonbot|cohere-ai|AI2Bot|Applebot-Extended|Bytespider).*'

export default defineNuxtModule((_options, nuxt) => {
  nuxt.hooks.hook('nitro:init', (nitro) => {
    if (nitro.options.dev || !nitro.options.preset.includes('vercel')) {
      return
    }
    nitro.hooks.hook('compiled', async () => {
      const { resolve } = process.getBuiltinModule('node:path')
      const { readFile, writeFile }
        = process.getBuiltinModule('node:fs/promises')
      const vcJSON = resolve(nitro.options.output.dir, 'config.json')
      const vcConfig = JSON.parse(await readFile(vcJSON, 'utf8'))
      vcConfig.routes.unshift(
        // Rewrite /docs/*.md URLs to the raw markdown handler
        {
          src: '^/docs/(.*)\\.md$',
          dest: '/raw/docs/$1.md'
        },
        // Serve markdown for the homepage when Accept: text/markdown is requested
        {
          src: '^/$',
          dest: '/raw/index.md',
          has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
          check: true
        },
        // Serve markdown for the homepage to known AI agent user agents
        {
          src: '^/$',
          dest: '/raw/index.md',
          has: [{ type: 'header', key: 'user-agent', value: AGENT_UA_PATTERN }],
          check: true
        },
        // Serve markdown when Accept: text/markdown is requested
        {
          src: '^/docs/(.*)$',
          dest: '/raw/docs/$1.md',
          has: [{ type: 'header', key: 'accept', value: '(.*)text/markdown(.*)' }],
          check: true
        },
        // Serve markdown to known AI agent user agents
        {
          src: '^/docs/(.*)$',
          dest: '/raw/docs/$1.md',
          has: [{ type: 'header', key: 'user-agent', value: AGENT_UA_PATTERN }],
          check: true
        }
      )
      await writeFile(vcJSON, JSON.stringify(vcConfig, null, 2), 'utf8')
    })
  })
})
