# Squad 的 MCP 设置指南

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

**试试这个发现可用集成：**
```
展示哪些 MCP 服务器可用
```

**试试这个启用特定服务：**
```
配置 GitHub MCP 服务器
```

MCP（模型上下文协议）服务器用外部服务扩展 Squad —— GitHub、通知、部署、Trello 等。智能体自动发现和使用 MCP 工具。

---

## MCP 对 Squad 意味着什么

MCP 桥接 Squad 智能体和外部服务。智能体使用 MCP 工具发送通知、查询 GitHub、监控部署、与 Trello 集成等。你定义哪些服务可用；智能体自动发现和使用它们。

---

## MCP 配置文件

有两个地方可以配置 MCP，取决于你的平台：

| 平台 | 配置文件 | 如何编辑 | 启动 |
|----------|------------|-----------|---------|
| **Copilot CLI** | `.copilot/mcp-config.json` | 文本编辑器 | 添加到 shell 初始化（`~/.bashrc`、`~/.zshrc` 等） |
| **VS Code** | `.vscode/settings.json` | VS Code 设置 GUI 或 JSON 编辑器 | 内置；重启 Copilot 扩展 |

本指南涵盖两者。选择匹配你工作流的那个。

---

## 逐步：CLI 设置

### 第 1 步：创建 `.copilot` 目录和配置文件

打开你的终端：

```bash
mkdir -p ~/.copilot
touch ~/.copilot/mcp-config.json
```

### 第 2 步：添加你的第一个 MCP 服务器

在你的编辑器中打开 `~/.copilot/mcp-config.json`：

```bash
# macOS/Linux
nano ~/.copilot/mcp-config.json

# Windows（PowerShell）
notepad $PROFILE\..\mcp-config.json
```

粘贴此基础结构：

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/absolute/path/to/github-mcp.js"],
      "env": {
        "GITHUB_TOKEN": "your-github-token-here"
      }
    }
  }
}
```

将 `/absolute/path/to/github-mcp.js` 替换为你的 MCP 服务器脚本的实际路径。`env` 对象向服务器传递环境变量。

### 第 3 步：添加你的 GitHub 令牌

如果你已经运行了 `gh auth login`，你的令牌位于 `~/.config/gh/hosts.yml`（macOS/Linux）或 `%APPDATA%\GitHub CLI\hosts.yml`（Windows）。

不要将令牌直接粘贴到配置文件中，**使用环境变量**：

```bash
# macOS/Linux：添加到 ~/.bashrc 或 ~/.zshrc
export GITHUB_TOKEN=$(gh auth token)

# Windows PowerShell：添加到你的配置文件
$env:GITHUB_TOKEN = $(gh auth token)
```

然后在你的配置中引用它：

```json
"env": {
  "GITHUB_TOKEN": "$GITHUB_TOKEN"
}
```
