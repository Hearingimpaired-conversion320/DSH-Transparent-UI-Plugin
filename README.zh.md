# @deepseek-ai/dsh-client-ui-aqua

[English](README.md) | 中文

Aqua 是一层套在 DeepSeek Harness 网页端外面的深海主题。它把整块界面换成深海里玻璃的质感——顶栏、侧边栏、输入框、统计行、轨迹视图都成了浮在水里的玻璃片，背后有一片缓慢流动的水，偶尔有几条鱼和气泡游过。深色模式是一片蓝黑的海，浅色模式是偏冷的蓝白。整层效果都藏在一个开关后面，随时可以关掉回到原生界面，不会改到 DSH 的任何一行源码。装上之后去「设置 → 插件」就能看到它。

![](assets/1.png)

![](assets/2.png)

![](assets/3.png)

![](assets/4.png)

## 安装

不用 npm、不用账号、不用构建 —— 仓库自带预构建好的 `lib/`，一个脚本搞定。

### Windows（一条命令）

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1 https://github.com/WYH66666666/DSH-Transparent-UI-Plugin.git
```

脚本会克隆仓库、把插件链接进 profile 的 `node_modules`、并在 `cordis.patch.yml` 里登记 `ui-aqua`（幂等，重复跑不会重复登记）。刷新 Web 界面即可。

### macOS / Linux（手动，三步）

```sh
git clone https://github.com/WYH66666666/DSH-Transparent-UI-Plugin.git
ln -s "$PWD/DSH-Transparent-UI-Plugin" "$DSH_HOME/profiles/node_modules/@deepseek-ai/dsh-client-ui-aqua"
```

然后往 `$DSH_HOME/profiles/web/cordis.patch.yml` 追加：

```yaml
- insert:
    - id: ui-aqua
      name: '@deepseek-ai/dsh-client-ui-aqua'
```

刷新 Web 界面。Aqua **默认开启**；在 **设置 → 插件 → Aqua** 中开关。
