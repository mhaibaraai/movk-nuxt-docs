let _prettier
let _plugins

self.onmessage = async function (event) {
  try {
    self.postMessage({
      uid: event.data.uid,
      message: await handleMessage(event.data.message)
    })
  } catch (error) {
    self.postMessage({
      uid: event.data.uid,
      error: error.message || String(error)
    })
  }
}

function handleMessage(message) {
  switch (message.type) {
    case 'format':
      return handleFormatMessage(message)
  }
}

async function handleFormatMessage(message) {
  if (!_prettier) {
    const [prettierModule, ...plugins] = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/prettier@3.8.3/standalone.mjs'),
      import('https://cdn.jsdelivr.net/npm/prettier@3.8.3/plugins/babel.mjs'),
      import('https://cdn.jsdelivr.net/npm/prettier@3.8.3/plugins/estree.mjs'),
      import('https://cdn.jsdelivr.net/npm/prettier@3.8.3/plugins/html.mjs'),
      import('https://cdn.jsdelivr.net/npm/prettier@3.8.3/plugins/markdown.mjs'),
      import('https://cdn.jsdelivr.net/npm/prettier@3.8.3/plugins/typescript.mjs')
    ])
    _prettier = prettierModule
    _plugins = plugins
  }

  const { options, source } = message
  return _prettier.format(source, {
    parser: 'markdown',
    plugins: _plugins,
    ...options
  })
}
