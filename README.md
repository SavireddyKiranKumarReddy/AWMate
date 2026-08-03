<h1 align="center">AWMate</h1>

<p align="center">
  An open-source AI development companion for working with real projects from a desktop app, terminal, or web interface.
</p>

<p align="center">
  <a href="https://github.com/nxtgensec/awmate/releases"><img alt="GitHub release" src="https://img.shields.io/github/v/release/nxtgensec/awmate?style=flat-square" /></a>
  <a href="https://github.com/nxtgensec/awmate/actions/workflows/typecheck.yml"><img alt="Typecheck" src="https://img.shields.io/github/actions/workflow/status/nxtgensec/awmate/typecheck.yml?branch=main&style=flat-square&label=typecheck" /></a>
  <a href="./LICENSE"><img alt="License" src="https://img.shields.io/github/license/nxtgensec/awmate?style=flat-square" /></a>
</p>

## What is AWMate?

AWMate is an AI coding workspace designed to understand and operate on the project you select. It combines conversation, code exploration, file editing, command execution, and development workflows in one interface.

The project includes a native Electron desktop application, a terminal interface, a shared web UI, an API server, and reusable SDK packages.

## Highlights

- Project-aware conversations that stay scoped to the selected folder
- Desktop, terminal, and web experiences backed by the same core
- Build and plan agents for implementation and read-only analysis
- Integrated file, search, terminal, and development tools
- Multiple sessions and project tabs
- Windows and WSL integration
- Extensible provider, plugin, protocol, and SDK packages
- Open-source and self-hostable

## Install the desktop app

Download the latest installer from [GitHub Releases](https://github.com/nxtgensec/awmate/releases).

| Platform    | Package                        |
| ----------- | ------------------------------ |
| Windows x64 | `awmate-desktop-win-x64.exe`   |
| macOS       | `.dmg`                         |
| Linux       | `.AppImage`, `.deb`, or `.rpm` |

> Releases are the official distribution source for this repository. Availability depends on the artifacts published for each version.

### Automatic updates

Production desktop builds check the public AWMate GitHub Releases feed automatically. When a newer version is available, AWMate downloads it in the background and installs it during the next normal app exit. This avoids interrupting active work or asking users to download another installer.

Users of older development builds must install one updater-enabled production release manually. Updates after that release are automatic.

## Run from source

### Requirements

- [Git](https://git-scm.com/)
- [Bun 1.3 or newer](https://bun.sh/)

```bash
git clone https://github.com/nxtgensec/awmate.git
cd awmate
bun install
```

Start the desktop application:

```bash
bun run dev:desktop
```

Other development modes:

```bash
bun run dev          # CLI/TUI
bun run dev:web      # Web interface
bun run dev:desktop  # Electron desktop app
```

## Build the Windows installer

From the repository root:

```bash
bun install
bun run --cwd packages/desktop build
bun run --cwd packages/desktop package:win
```

The installer is written to:

```text
packages/desktop/dist/awmate-desktop-win-x64.exe
```

Platform-specific packaging commands are also available:

```bash
bun run --cwd packages/desktop package:mac
bun run --cwd packages/desktop package:linux
```

## Repository structure

| Path                | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `packages/desktop`  | Electron desktop application and installers |
| `packages/app`      | Shared application interface                |
| `packages/ui`       | Reusable UI components and styling          |
| `packages/core`     | Core domain services                        |
| `packages/client`   | API client implementation                   |
| `packages/protocol` | Public protocol definitions                 |
| `packages/sdk`      | SDK packages and generated clients          |

## Development checks

Run checks from the package you changed, as described in [AGENTS.md](./AGENTS.md). Common examples:

```bash
bun typecheck
bun test
```

Tests must not be run from the repository root.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or pull request.

Please use conventional commit messages, keep changes focused, and include package-level verification where practical.

## Security

For security guidance and vulnerability reporting, see [SECURITY.md](./SECURITY.md).

## License

AWMate is available under the [MIT License](./LICENSE).
