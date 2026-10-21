#!/usr/bin/env bash
# 用本地 layer 打包产物安装并构建指定模板，验证模板在发布前可用
# 用法：scripts/test-template.sh <default|i18n|module>
set -euo pipefail

template="${1:?请指定模板名：default | i18n | module}"
root="$(cd "$(dirname "$0")/.." && pwd)"
src="$root/templates/$template"
[[ -d "$src" ]] || { echo "模板不存在：$template" >&2; exit 1; }

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

pnpm --dir "$root/layer" pack --pack-destination "$work" >/dev/null
tarball="$(ls "$work"/*.tgz)"

cp -R "$src" "$work/site"
cd "$work/site"
node -e 'const fs=require("fs");const p=JSON.parse(fs.readFileSync("package.json","utf8"));p.dependencies["@movk/nuxt-docs"]="file:"+process.argv[1];fs.writeFileSync("package.json",JSON.stringify(p,null,2)+"\n")' "$tarball"

pnpm install --no-frozen-lockfile
pnpm exec nuxt build 2>&1 | tee build.log
# layer 预渲染开启 failOnError: false，死链只会输出日志，这里显式拦截
if grep -q "\[request error\]" build.log; then
  echo "模板 $template 预渲染存在失败路由：" >&2
  grep "\[request error\]" build.log >&2
  exit 1
fi

if node -e 'process.exit(require("./package.json").scripts?.typecheck ? 0 : 1)'; then
  pnpm run typecheck
fi

echo "模板 $template 构建通过"
