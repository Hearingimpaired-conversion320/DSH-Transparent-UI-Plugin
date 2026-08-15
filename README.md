# @deepseek-ai/dsh-client-ui-aqua

English | [中文](README.zh.md)

Aqua is a highly customizable glassmorphism theme for the DeepSeek Harness web UI. The header, sidebar, composer, stats line, and trajectory view all become panes of frosted glass. Two modes are built in: Floating Glass restyles the layout into floating cards, while Compatibility Mode keeps the stock layout untouched and only swaps the material to glass — so other plugins' UI gets the same treatment automatically. Glass blur, frost amount, and the backdrop are all adjustable from the settings card — pick a living fluid or drop in your own wallpaper (with its own blur and frost). Switch it off and the stock UI comes back exactly, with no source changes to DSH itself.

![](assets/1.png)

![](assets/2.png)

![](assets/3.png)

![](assets/4.png)

## Installation


### Windows (one command)

```powershell
powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest 'https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/raw/main/install.ps1' -OutFile install.ps1; .\install.ps1"
```

Installs the **latest release** by default. No git needed — the installer falls back to a plain zip download. It links the plugin into the profile's `node_modules` and registers `ui-aqua` in `cordis.patch.yml` (idempotent — safe to run again). Reload the web UI and it is on.

Pin a version or track the dev branch:

```powershell
.\install.ps1 -Version 'v1.0.1'   # a specific release
.\install.ps1 -Version 'main'     # the development branch
```

### macOS / Linux (manual, three steps)

```sh
git clone --depth 1 --branch v1.0.1 https://github.com/WYH66666666/DSH-Transparent-UI-Plugin.git
ln -s "$PWD/DSH" "$DSH_HOME/profiles/node_modules/@deepseek-ai/dsh-client-ui-aqua"
```

then append to `$DSH_HOME/profiles/web/cordis.patch.yml`:

```yaml
- insert:
    - id: ui-aqua
      name: '@deepseek-ai/dsh-client-ui-aqua'
```

Reload the web UI. Aqua is **on by default**; the master switch lives in **Settings → Plugins → Glass theme** (same shape as the other plugin cards), and every other control sits directly under **Settings → General → Appearance** (no title of its own). With the master switch off, the whole control block under Appearance is hidden.
