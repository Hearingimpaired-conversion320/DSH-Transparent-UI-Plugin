# @deepseek-ai/dsh-client-ui-aqua

English | [中文](README.zh.md)

Aqua is a deep-sea glassmorphism theme layered over the DeepSeek Harness web UI. The header, sidebar, composer, stats line, and trajectory view all become panes of frosted glass floating over a slowly moving water backdrop, with the occasional fish and bubble drifting past. Dark mode is a blue-black sea; light mode is a cool blue-white. Everything sits behind a single toggle — switch it off and the stock UI comes back exactly, with no source changes to DSH itself. Install it and look under Settings → Plugins.

![](assets/1.png)

![](assets/2.png)

![](assets/3.png)

![](assets/4.png)

## Installation


### Windows (one command)

```powershell
powershell -ExecutionPolicy Bypass -Command "Invoke-WebRequest 'https://github.com/WYH66666666/DSH/raw/main/install.ps1' -OutFile install.ps1; .\install.ps1"
```

No git needed — the installer falls back to a plain zip download. It links the plugin into the profile's `node_modules` and registers `ui-aqua` in `cordis.patch.yml` (idempotent — safe to run again). Reload the web UI and it is on.

### macOS / Linux (manual, three steps)

```sh
git clone https://github.com/WYH66666666/DSH.git
ln -s "$PWD/DSH" "$DSH_HOME/profiles/node_modules/@deepseek-ai/dsh-client-ui-aqua"
```

then append to `$DSH_HOME/profiles/web/cordis.patch.yml`:

```yaml
- insert:
    - id: ui-aqua
      name: '@deepseek-ai/dsh-client-ui-aqua'
```

Reload the web UI. Aqua is **on by default**; toggle it from **Settings → Plugins → Aqua**.
