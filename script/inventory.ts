const fs = require("fs")
const path = require("path")

const root = process.cwd()
const ignore = ["node_modules", ".git", "dist", ".turbo", "bun.lock", ".bun", "artifacts"]
const categories = {
  "scope @opencode-ai": /@opencode-ai/g,
  "display OpenCode": /OpenCode/g,
  "uppercase OPENCODE": /OPENCODE/g,
  "domain opencode.ai": /opencode\.ai/g,
  "models.dev models.opencode.ai": /models\.opencode\.ai/g,
  "lowercase opencode": /opencode/g,
}
const results = {}
for (const key of Object.keys(categories)) results[key] = { count: 0, files: 0 }

function walk(dir) {
  let entries
  try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
  for (const e of entries) {
    if (ignore.includes(e.name)) continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) walk(full)
    else {
      const ext = path.extname(e.name).toLowerCase()
      if (!/\.(ts|tsx|js|jsx|json|mjs|cjs|md|mdx|html|css|yml|yaml|toml|txt|svg|nix|sh|cjs|d\.ts|tsx|json5)$/.test(ext)) continue
      let content
      try { content = fs.readFileSync(full, "utf8") } catch { return }
      for (const key of Object.keys(categories)) {
        const m = content.match(categories[key])
        if (m) { results[key].count += m.length; results[key].files++ }
      }
    }
  }
}
walk(root)
for (const key of Object.keys(results)) console.log(`${key}: ${results[key].count} occ in ${results[key].files} files`)