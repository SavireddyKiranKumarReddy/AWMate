/**
 * AWMate rebrand renamer.
 *
 * Waves defined in rebrand.md are applied by this script as ordered,
 * exclusion-aware replacements. Protected tokens preserve external infra
 * (opencode.ai domain, npm/brew/choco/scoop package names, upstream artifacts)
 * so the platform keeps working. Files that are external distribution
 * surfaces get scope-only renaming (see GENERIC_EXCLUDE).
 *
 * Run: bun script/rebrand.ts
 */

import { spawnSync } from "child_process"
import { parseArgs } from "util"

const { values } = parseArgs({
  args: process.argv.slice(2),
  options: {
    dirs: { type: "string", default: "" },
    files: { type: "string", default: "" },
    dry: { type: "boolean", default: false },
    quiet: { type: "boolean", default: false },
  },
})

// ---------------------------------------------------------------------------
// External infrastructure that MUST stay byte-identical (we don't own it).
// Protected tokens are holdered before transforms and restored after.
// ---------------------------------------------------------------------------
const PROTECTED: Array<[RegExp, string]> = [
  [/https:\/\/opencode\.ai\/json-schema/g, "@@OCSCHEMA@@"],
  [/opencode\.ai/g, "@@OCDOMAIN@@"],
  [/(?<!@)opencode-ai/g, "@@OCNPM@@"],
  [/opencode-gitlab-auth/g, "@@OCGLA@@"],
  [/opencode-poe-auth/g, "@@OCPOE@@"],
  [/anomalyco\/tap\/opencode/g, "@@OCTAP@@"],
  [/anomalyco\/opencode/g, "@@OCREPO@@"],
  [/formulae\.brew\.sh\/api\/formula\/opencode\.json/g, "@@OCBREW@@"],
  [/community\.chocolatey\.org[^`"'\s]*opencode/g, "@@OCCHOCO@@"],
  [/ScoopInstaller\/Main\/master\/bucket\/opencode\.json/g, "@@OCSCOOP@@"],
  [/opencode-github-action/g, "@@OCACTION@@"],
  [/social-cards\.sst\.dev\/opencode-share/g, "@@OCCARD@@"],
  [/oh-my-opencode@[0-9.]+/g, "@@OCPLUGIN@@"],
  [/packages\/opencode/g, "@@OCPACKAGEDIR@@"],
]

// ---------------------------------------------------------------------------
// Transform rules. Order matters (specific before general). Each file folds
// every matching rule. A file in GENERIC_EXCLUDE is excluded ONLY from the
// generic lowercase `opencode` rule, so scope/pascal/env renames still apply.
// ---------------------------------------------------------------------------
const TRANSFORMS: Array<[RegExp, string]> = [
  [/ai\.opencode\.desktop/g, "ai.awmate.desktop"],
  [/opencode:\/\//g, "awmate://"],
  [/x-opencode-directory/g, "x-awmate-directory"],
  [/x-opencode-workspace/g, "x-awmate-workspace"],
  [/opencode-theme-id/g, "awmate-theme-id"],
  [/opencode-theme-css-light/g, "awmate-theme-css-light"],
  [/opencode-theme-css-dark/g, "awmate-theme-css-dark"],
  [/opencode-theme/g, "awmate-theme"],
  [/\@opencode-ai/g, "@awmate"], // scope (covers @opencode-ai/...)
  [/\@opencode\//g, "@awmate/"],
  [/OPENCODE_/g, "AWMATE_"],
  [/OpenCode/g, "AWMate"],
  [/Opencode/g, "AWMate"],
]

const GENERIC_EXCLUDE = [
  // External distribution surfaces / install internals (lowercase opencode is
  // tied to published npm/brew artifacts, marketplace command IDs, install paths).
  "github/",
  "sdks/vscode/",
  "packages/opencode/src/installation/",
  "packages/opencode/bin/",
  // Docker publish + release manifest must match upstream artifacts.
  "packages/opencode/Dockerfile",
  "packages/opencode/script/publish.ts",
  ".github/workflows/publish.yml",
]

const SKIP_PARTS = ["node_modules", "vendor/opencode"]

const isBinary = (buf: Buffer) => buf.subarray(0, 8000).includes(0)

function trackedFiles(): string[] {
  const res = spawnSync("git", ["ls-files", "-z"], { encoding: "buffer", maxBuffer: 1 << 30 })
  if (res.status !== 0) throw new Error("git ls-files failed")
  return res.stdout
    .toString()
    .split("\0")
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
}

function holderOf(re: RegExp): string {
  return (PROTECTED.find(([r]) => r === re) ?? [])[1]
}

function transformText(text: string, generic: boolean): { out: string; count: number } {
  let out = text
  let count = 0
  const holders: string[] = []

  for (const [re, holder] of PROTECTED) {
    if (new RegExp(re.source, "g").test(out)) holders.push(holder)
    out = out.replace(new RegExp(re.source, "g"), holder)
  }

  for (const [re, to] of TRANSFORMS) {
    let n = 0
    out = out.replace(re, () => {
      n += 1
      return to
    })
    count += n
  }
  if (generic) {
    let n = 0
    out = out.replace(/opencode/g, () => {
      n += 1
      return "awmate"
    })
    count += n
  }

  const map: Record<string, string> = {
    "@@OCSCHEMA@@": "https://opencode.ai/json-schema",
    "@@OCDOMAIN@@": "opencode.ai",
    "@@OCNPM@@": "opencode-ai",
    "@@OCGLA@@": "opencode-gitlab-auth",
    "@@OCPOE@@": "opencode-poe-auth",
    "@@OCTAP@@": "anomalyco/tap/opencode",
    "@@OCREPO@@": "anomalyco/opencode",
    "@@OCBREW@@": "formulae.brew.sh/api/formula/opencode.json",
    "@@OCCHOCO@@": "community.chocolatey.org/api/v2/Packages?$filter=Id%20eq%20%27opencode",
    "@@OCSCOOP@@": "ScoopInstaller/Main/master/bucket/opencode.json",
    "@@OCACTION@@": "opencode-github-action",
    "@@OCCARD@@": "social-cards.sst.dev/opencode-share",
    "@@OCPLUGIN@@": "oh-my-opencode@2.4.3",
    "@@OCPACKAGEDIR@@": "packages/opencode",
  }
  for (const holder of holders) out = out.replaceAll(holder, map[holder] ?? holder)

  return { out, count }
}

let total = 0
let changed = 0

for (const file of trackedFiles()) {
  if (SKIP_PARTS.some((p) => file.includes(p))) continue
  if (values.files && !file.match(new RegExp(values.files))) continue
  if (values.dirs && !file.startsWith(values.dirs)) continue
  if (file.endsWith("script/rebrand.ts") || file === "rebrand.md" || file === "bun.lock") continue

  const generic = !GENERIC_EXCLUDE.some((p) => file.includes(p))
  const raw = await Bun.file(file).arrayBuffer()
  const buf = Buffer.from(raw)
  if (isBinary(buf)) continue

  const text = buf.toString("utf8")
  const { out, count } = transformText(text, generic)
  total += count
  if (out !== text) {
    changed += 1
    if (!values.dry) await Bun.write(file, out)
    if (!values.quiet) console.log(`  ${file}`)
  }
}

console.log(`\noccurrences replaced: ${total}, files changed: ${changed}`)