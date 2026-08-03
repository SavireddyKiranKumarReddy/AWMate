<p align="center">
  <a href="https://ai.awmate.nxtgensec.org">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="AWMate logo">
    </picture>
  </a>
</p>
<p align="center">AWMate je open source AI agent za programiranje.</p>
<p align="center">
  <a href="https://ai.awmate.nxtgensec.org/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/awmate-ai"><img alt="npm" src="https://img.shields.io/npm/v/awmate-ai?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/awmate/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/awmate/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a> |
  <a href="README.uk.md">Українська</a> |
  <a href="README.bn.md">বাংলা</a> |
  <a href="README.gr.md">Ελληνικά</a> |
  <a href="README.vi.md">Tiếng Việt</a>
</p>

[![AWMate Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://ai.awmate.nxtgensec.org)

---

### Instalacija

```bash
# YOLO
curl -fsSL https://ai.awmate.nxtgensec.org/install | bash

# Package manageri
npm i -g awmate-ai@latest        # ili bun/pnpm/yarn
scoop install awmate             # Windows
choco install awmate             # Windows
brew install anomalyco/tap/awmate # macOS i Linux (preporučeno, uvijek ažurno)
brew install awmate              # macOS i Linux (zvanična brew formula, rjeđe se ažurira)
sudo pacman -S awmate            # Arch Linux (Stable)
paru -S awmate-bin               # Arch Linux (Latest from AUR)
mise use -g awmate               # Bilo koji OS
nix run nixpkgs#opencode           # ili github:anomalyco/awmate za najnoviji dev branch
```

> [!TIP]
> Ukloni verzije starije od 0.1.x prije instalacije.

### Desktop aplikacija (BETA)

AWMate je dostupan i kao desktop aplikacija. Preuzmi je direktno sa [stranice izdanja](https://github.com/anomalyco/awmate/releases) ili sa [opencode.ai/download](https://ai.awmate.nxtgensec.org/download).

| Platforma             | Preuzimanje                        |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `awmate-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `awmate-desktop-mac-x64.dmg`     |
| Windows               | `awmate-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, ili AppImage       |

```bash
# macOS (Homebrew)
brew install --cask awmate-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/awmate-desktop
```

#### Instalacijski direktorij

Instalacijska skripta koristi sljedeći redoslijed prioriteta za putanju instalacije:

1. `$AWMATE_INSTALL_DIR` - Prilagođeni instalacijski direktorij
2. `$XDG_BIN_DIR` - Putanja usklađena sa XDG Base Directory specifikacijom
3. `$HOME/bin` - Standardni korisnički bin direktorij (ako postoji ili se može kreirati)
4. `$HOME/.awmate/bin` - Podrazumijevana rezervna lokacija

```bash
# Primjeri
AWMATE_INSTALL_DIR=/usr/local/bin curl -fsSL https://ai.awmate.nxtgensec.org/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://ai.awmate.nxtgensec.org/install | bash
```

### Agenti

AWMate uključuje dva ugrađena agenta između kojih možeš prebacivati tasterom `Tab`.

- **build** - Podrazumijevani agent sa punim pristupom za razvoj
- **plan** - Agent samo za čitanje za analizu i istraživanje koda
  - Podrazumijevano zabranjuje izmjene datoteka
  - Traži dozvolu prije pokretanja bash komandi
  - Idealan za istraživanje nepoznatih codebase-ova ili planiranje izmjena

Uključen je i **general** pod-agent za složene pretrage i višekoračne zadatke.
Koristi se interno i može se pozvati pomoću `@general` u porukama.

Saznaj više o [agentima](https://ai.awmate.nxtgensec.org/docs/agents).

### Dokumentacija

Za više informacija o konfiguraciji AWMate-a, [**pogledaj dokumentaciju**](https://ai.awmate.nxtgensec.org/docs).

### Doprinosi

Ako želiš doprinositi AWMate-u, pročitaj [upute za doprinošenje](./CONTRIBUTING.md) prije slanja pull requesta.

### Gradnja na AWMate-u

Ako radiš na projektu koji je povezan s AWMate-om i koristi "awmate" kao dio naziva, npr. "awmate-dashboard" ili "awmate-mobile", dodaj napomenu u svoj README da projekat nije napravio AWMate tim i da nije povezan s nama.

---

**Pridruži se našoj zajednici** [Discord](https://discord.gg/awmate) | [X.com](https://x.com/awmate)
