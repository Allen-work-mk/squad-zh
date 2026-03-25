# Squad 远程控制

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

通过安全 WebSocket 隧道从手机控制 Copilot CLI。非常适合演示、移动设备配对或从任何地方监控运行。

```bash
squad start --tunnel
# 显示二维码 → 用手机扫描 → 终端出现在浏览器中
```

---

## 它做什么

`squad start` 在伪终端（PTY）中生成 Copilot CLI 并通过以下方式实时镜像输出到你的手机：

1. **PTY** —— Copilot 在完整的交互式终端中运行
2. **WebSocket 服务器** —— 终端 I/O 通过 WebSocket 实时流式传输
3. **devtunnel** —— 带认证的安全公共 URL（可选）
4. **手机浏览器** —— xterm.js 终端在你的手机上渲染

架构图：

```
[PTY 中的 Copilot CLI] 
    ↓ （终端输出/输入）
[WebSocket 服务器]
    ↓ （双向）
[devtunnel]（可选，提供公共 URL）
    ↓ （HTTPS + 私有认证）
[手机浏览器（xterm.js）]
    ↓ （移动键盘快捷键，重放缓冲区）
[你的手机]
```

---

## 前置条件

### 必需

- **devtunnel CLI**（用于 `--tunnel` 模式）
  ```bash
  # Windows（winget）
  winget install Microsoft.devtunnel

  # macOS（Homebrew）
  brew install devtunnel

  # 或通过 GitHub 发布
  # https://github.com/microsoft/devtunnel/releases
  ```

- **devtunnel 认证**（首次使用前需要）
  ```bash
  devtunnel user login
  # 浏览器打开 → 认证 → 成功
  ```

### 可选

- **Node.js 18+**（用于 CLI）
- 手机上的**现代浏览器**（iOS Safari、Chrome、Firefox）

---

## 使用示例

### 基础：本地 PTY 终端

无隧道，无手机访问 —— 只需在 PTY 中运行 Copilot：

```bash
squad start
# 输出：已启动 PTY 终端（PID: 12345）
#         Copilot 在本地运行
```

### 带手机访问（devtunnel + QR）

创建隧道，显示二维码，让手机扫描并连接：

```bash
squad start --tunnel
# 输出：已启动 devtunnel 会话
#         会话 ID: abc123xyz
#         二维码: [████████████████]
#         URL: https://abc123xyz-dev.devtunnels.ms
#         
#         在手机上点击或扫描二维码 → 终端出现
```

用手机相机扫描二维码。打开浏览器 → 终端用 xterm.js 渲染。

### 自定义端口

指定 WebSocket 服务器端口：
