# AWMate rebrand tracking

This document tracks every change made to transform the opencode fork into
AWMate. It is the single source of truth for what was renamed, why, and what
was deliberately left pointing at upstream infrastructure.

## Principles

1. Rename anything that is *our* identity: package scope, package names, CLI
   binary, config file/dir names, env vars, wire headers, deep links, desktop
   app ids, service tags, UI/README labels.
2. Do NOT break the running platform. External infrastructure we do not own
   keeps its real URL/name so install, upgrade, model catalog, and OAuth
   keep working: `opencode.ai`, `models.opencode.ai`, npm `opencode-ai`,
   `@gitlab/opencode-gitlab-auth`, `opencode-gitlab-auth`,
   `opencode-poe-auth`, brew/choco/scoop `opencode`, `anomalyco/opencode`.
3. External distribution surfaces (`github/` action, `sdks/vscode`) stay
   pinned to upstream artifacts until AWMate has its own published packages.

## Naming map

| Source                | Target       |
| --------------------- | ------------ |
| `@opencode-ai/...`    | `@awmate/...`|
| `OpenCode`            | `AWMate`     |
| `OPENCODE_...`        | `AWMATE_...` |
| `Opencode...`         | `AWMate...`  |
| `opencode`            | `awmate`     |
| `x-opencode-directory`| `x-awmate-directory` |
| `opencode://`         | `awmate://`  |
| `ai.opencode.desktop` | `ai.awmate.desktop` |

## Waves

### Wave 0 — inventory
- Ran `script/inventory.ts` baseline counts (before any change):
  - scope `@opencode-ai`: 4881 occ / 1383 files
  - display `OpenCode`: 12028 occ / 985 files
  - uppercase `OPENCODE`: 2576 occ / 452 files
  - domain `opencode.ai`: 5041 occ / 700 files
  - `models.opencode.ai`: 9 occ / 6 files
  - lowercase `opencode`: 27947 occ / 2611 files
- Confirmed `bun install --ignore-scripts` works after native builds failed
  (no VS C++ toolchain), baseline `packages/schema` typecheck passes.

### Wave 1 — package scope and package names
Status: done
- Wrote and ran `script/rebrand.ts` (the log of every edit is on the `dev`
  branch): 38144 replacements across 2684 files.
- Package scopes renamed `@opencode-ai/*` -> `@awmate/*` in every
  `package.json` and in source imports/re-exports (`@awmate/core`,
  `@awmate/client`, `@awmate/plugin`, `@awmate/server`, `@awmate/schema`,
  `@awmate/protocol`, `@awmate/sdk`, `@awmate/ui`, `@awmate/tui`,
  `@awmate/opencode`, `@awmate/app`, `@awmate/session-ui`, `@awmate/desktop`).
- TS identifiers renamed: `OpencodeClient` -> `AWMateClient`,
  `OpenCodeEvent` -> `AWMateEvent`, namespaces `OpenCode` -> `AWMate`,
  `OpencodePlugin` -> `AWMatePlugin`, plus `createOpenCodeClient` ->
  `createAWMateClient` etc.
- Env vars renamed `OPENCODE_*` -> `AWMATE_*`; registry keys/buckets/table
  prefixes renamed; wire headers renamed `x-opencode-directory` ->
  `x-awmate-directory`; deep link scheme `opencode://` -> `awmate://`;
  desktop app id `ai.opencode.desktop` -> `ai.awmate.desktop`.
- CLI binary and everywhere user-facing now `awmate`.

### Wave 2 — working tree reconciliation after bulk rename
Status: done
- Repaired two broken symlinks (`custom-elements.d.ts`, `enterprise`) so
  the tree typechecks.
- Fixed `@awmate/tui` provider module import, `@awmate/ui` theme files,
  and `@awmate/sdk-next` self-references broken by the scope rename.

### Wave 3 — vendored client tarball + external auth plugin types
Status: done
- `packages/app/vendor/opencode-ai-client-1.17.13-v2.tgz` was renamed and
  repacked as `packages/app/vendor/awmate-client-1.17.13-v3.tgz` with:
  - `package.json` `name` -> `@awmate/client`
  - dist `.d.ts`/`.js` internal re-exports of `@opencode-ai/protocol` and
    `@opencode-ai/schema` -> `@awmate/protocol` / `@awmate/schema`
  - exported identifiers `OpenCodeClient` -> `AWMateClient`,
    `OpenCodeEvent` -> `AWMateEvent`, `export * as OpenCode` -> `AWMate`
- `packages/app/package.json` and `packages/session-ui/package.json`
  reference the new tarball.
- Root `package.json` override `"@opencode-ai/plugin":
  "workspace:packages/plugin"` so external `opencode-gitlab-auth@2.1.0`
  and `opencode-poe-auth@0.0.1` (which still depend on published
  `@opencode-ai/plugin`) unify types with our workspace plugin instead of
  pulling the distinct published type bundle.

### Wave 4 — verification
Status: done
- Full repo `bun run typecheck` is green (all packages, EXIT 0).
- `bun run lint` (oxlint): 4914 findings; 4913 warnings and 1 error which
  is a pre-existing upstream false positive (`no-octal` reading the CSS
  escape `\200B` in a Tailwind `content-['\200B']` class string in
  `packages/session-ui/src/v2/components/prompt-input/index.tsx`). The
  file content matches the upstream baseline exactly; it is unrelated to
  the rebrand.

### Wave 5 — working tree + config/config-path reconciliation
Status: done
- Repo's own tool config dir renamed `.opencode/` -> `.awmate/` (39 tracked
  files: agents, commands, glossary, skills, tools, plugins, themes,
  `tui.json`, `awmate.jsonc`). Required because the CLI now only discovers
  `.awmate` config dirs (`config/paths.ts`, `config/config.ts`), so the
  previous name silently orphaned the project's own agents/commands.
  Main config file renamed `opencode.jsonc` -> `awmate.jsonc` inside it.
- Nix surface reconciled with the workspace rename:
  - `nix/opencode.nix` -> `nix/awmate.nix` (`git mv`; `flake.nix` already
    referenced `./nix/awmate.nix`, so the file was missing before).
  - `.github/workflows/nix-eval.yml`: `PACKAGES="awmate"`,
    `OPTIONAL_PACKAGES="awmate-desktop"`.
  - `nix/node_modules.nix`: `pname = "awmate-node_modules"`; stale comment
    `@opencode-ai/script` -> `@awmate/script`.
  - `nix/desktop.nix`: verified its `ai.awmate.desktop` metainfo/icon
    paths are generated at build time by copy scripts
    (`copy-metainfo.ts` writes `resources/ai.awmate.desktop.metainfo.xml`
    per channel), so they are consistent.
- Installer curl-method detection fixed: `installation/index.ts` now detects
  binaries under `$HOME/.awmate/bin` (the install script's `INSTALL_DIR`)
  instead of stale `.opencode/bin`. This was a real mismatch introduced by
  the rename: `install` was already `INSTALL_DIR=$HOME/.awmate/bin` and
  `uninstall.ts` matched `.awmate/bin`, but the curl detection still checked
  `.opencode/bin`.
- Confirmed deliberately-kept upstream surfaces (do not touch):
  - `github/` action and `sdks/vscode/` stay pinned to upstream published
    artifacts (README / manifest / marketplace IDs / `~/.opencode/bin`
    install path in `github/action.yml`).
  - `.github/*` CI workflows referencing `opencode` (publish, generate,
    docs-*, nix-hashes, pr-management, triage, review, `opencode.yml`,
    setup-git-committer inputs) are upstream infra and stay.
  - `packages/opencode/src/installation` keeps brew/choco/scoop/npm name
    checks (`opencode` / `opencode-ai`) and `opencode.ai` URLs by design.
  - Cosmetics: `packages/console/app` brand asset filenames
    (`opencode-logo-*`, `opencode-wordmark-*`, `preview-opencode-*`,
    lander images, `opencode-brand-assets.zip`) and repository/workflow
    file names still use `opencode`; these are binary assets / not-yet-
    re-authored artwork, deferred to a dedicated asset pass.
  - Repo's `install` script download URLs and README install snippets still
    use `https://opencode.ai/install` (protected upstream).
- `packages/client` generated code (`src/generated`, `src/generated-effect`)
  is clean of opencode identifiers (only doc-comment URLs remain) and will
  be regenerated via `bun run generate` from `packages/client` when the
  upstream Protocol/HttpApi changes.
- Smoke-tested the renamed CLI: `bun run ./src/index.ts --version` and
  `--help` from `packages/opencode` both exit 0 and report version `local`
  under the awmate binary. Full native `bun run build` (Bun.compile) is
  heavy (>10 min) and was not completed on this machine.

## Remaining work (not yet started)

- External distribution surfaces (`github/` action, `sdks/vscode`) still
  pinned to upstream and not yet wired to AWMate published packages.
- Cosmetics: AWMate-branded logo/wordmark assets to replace the upstream
  `opencode-*` asset files in `packages/console/app` (binary artwork,
  deferred).
- `packages/client` generated code must be regenerated via
  `bun run generate` from `packages/client` after any Protocol/HttpApi
  change; generated files are checked in under `src/generated` and
  `src/generated-effect`.