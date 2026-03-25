# 可移植性与扩展

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

你的 squad 不会锁定在一个仓库、一个编辑器或一组工具中。导出一个训练好的团队并在其他地方导入。安装插件以获得即时专长。从上游仓库继承组织范围实践。连接 MCP 服务器让智能体可以与任何东西对话。

---

## 试试这个

```
将我的团队导出到文件 —— 我想在另一个项目上使用他们
```

```
安装 AWS 部署插件
```

```
将平台团队的仓库添加为上游源
```

---

## 如何工作

Squad 设计为**默认可移植**。四个系统使这成为可能：

| 系统 | 它做什么 |
|--------|-------------|
| **导出/导入** | 将你的整个团队快照到 JSON 文件，随处导入 |
| **插件** | 安装智能体模板、技能和最佳实践的社区捆绑包 |
| **上游继承** | 从其他仓库继承技能、决策和路由 |
| **MCP 服务器** | 用外部服务扩展智能体（GitHub、Trello、通知） |

```
你的仓库 (.squad/)
    ↑ 继承自
上游源（组织仓库、兄弟仓库、导出快照）
    ↑ 增强自
插件（社区市场）
    ↑ 连接到
MCP 服务器（GitHub、Teams、Trello、Aspire 等）
```

---

## 导出与导入

Squad 团队是可移植的。将你的训练好的智能体、选角状态、技能和决策导出到单个 JSON 文件。

### 导出

```bash
squad export                          # 创建 squad-export.json
squad export --out ./backups/team.json  # 自定义路径
```

### 包含什么

| 数据 | 包含 |
|------|----------|
| 智能体 charter | ✅ |
| 智能体历史 | ✅（分为可移植 vs 项目特定） |
| 选角状态 | ✅ |
| 技能 | ✅ `.squad/skills/` 中的所有 earned 技能 |
| 决策 | ✅ |

技能完全可移植 —— 它们以完美的保真度导出和导入。

### 导入

```bash
squad import squad-export.json
```

如果 `.squad/` 已存在，Squad 警告你并停止。使用 `--force` 归档现有团队并替换它：

```bash
squad import squad-export.json --force
```

不会删除任何内容 —— 当前团队移动到存档。

### 历史分割

导入期间，智能体历史分为：

- **可移植知识** —— 跨项目转移的一般模式和约定
- **项目特定学习** —— 与原始仓库绑定的上下文标记条目

导入的智能体带来他们的技能和一般知识，而不假设你的项目以相同方式工作。

---

## 插件

插件是智能体模板、技能和最佳实践的社区策划捆绑包。安装一个，你的智能体就获得即时专长。

### 插件里有什么

- **智能体模板** —— 专业角色 charter（例如 "AWS DevOps"、"Python 数据科学"）
- **技能** —— 可复用的 `.squad/skills/SKILL.md` 文件
- **指令** —— 约定和路由的 `decisions.md` 片段
- **示例提示** —— 激活插件功能的即用型提示

### 可用市场

| 市场 | 里面有什么 |
|-------------|--------------|
| **awesome-copilot** | 前端框架、后端技术栈、部署模式 |
| **anthropic-skills** | Claude 优化模式、提示工程、RAG |
| **azure-cloud-dev** | Azure VM、App Service、Cosmos DB、GitHub Actions |
| **security-hardening** | OWASP、输入验证、密钥管理 |

### 安装插件

```
从 awesome-copilot 安装 react-component-library 插件
```

或使用命令：

```
/plugin install awesome-copilot/react-component-library
```

Squad 下载捆绑包，将智能体模板合并到 `.squad/agents/`，添加技能到 `.squad/skills/`，更新 `decisions.md`，并用新知识植入智能体。

### 管理市场

```
/plugin marketplace add github/awesome-copilot       # 注册
/plugin marketplace browse awesome-copilot            # 浏览
/plugin marketplace remove awesome-copilot            # 注销
```

移除市场后已安装的插件保留 —— 你只是无法从中安装新的。

### 创建你自己的市场

插件市场只是具有特定结构的 GitHub 仓库：

```
my-team-plugins/
├── awesome-patterns/
│   ├── charter.md
│   ├── skills/
│   │   └── awesome-skill.md
│   └── decisions.md
├── microservices-template/
│   ├── charter.md
│   └── skills/
│       ├── service-discovery.md
│       └── fault-tolerance.md
└── README.md
```

用 `squad` 注册它，你的团队就可以从它安装。

---

## 上游继承

声明外部 Squad 源并在会话开始时自动继承他们的上下文。知识从组织 → 团队 → 仓库向下流动，无需重复配置。

### 三种源类型

| 类型 | 示例 | 用例 |
|------|---------|----------|
| **本地** | `../org-practices/.squad/` | 兄弟仓库、monorepo 包 |
| **git** | `https://github.com/acme/platform-squad.git` | 公共或私人组织仓库 |
| **导出** | `./exports/snapshot.json` | 离线使用或版本固定 |

### 继承什么

- **技能** —— 所有 `.squad/skills/*/SKILL.md` 文件
- **决策** —— `.squad/decisions.md`
- **智慧** —— `.squad/identity/wisdom.md`
- **选角政策** —— `.squad/casting/policy.json`
- **路由** —— `.squad/routing.md`

### 就近获胜解析

```
组织级上游
    ↓
团队级上游
    ↓
仓库配置（本地 .squad/）
    ↓
智能体实例
```

上游按 `upstream.json` 中的顺序读取 —— **较晚条目覆盖较早条目** 对于相同内容类型。你的本地 `.squad/` 总是获胜。

### 快速开始

```bash
# 本地上游
squad upstream add ../org-practices/.squad --name org

# Git 上游
squad upstream add https://github.com/acme/platform-squad.git --name platform --ref main

# 导出快照
squad upstream add ./exports/snapshot.json --name snapshot

# 列出配置的上游
squad upstream list

# 同步 git 上游
squad upstream sync
```

Git 上游克隆到 `.squad/_upstream_repos/{name}`（自动添加到 `.gitignore`）。本地和导出上游在会话开始时实时读取 —— 无需同步。

---

## MCP 设置

MCP（模型上下文协议）服务器用外部服务扩展 Squad。智能体自动发现和使用 MCP 工具 —— 无需每个智能体配置。

### 配置

| 平台 | 配置文件 |
|----------|------------|
| **Copilot CLI** | `.copilot/mcp-config.json` |
| **VS Code** | `.vscode/settings.json`（在 `copilot.mcp.servers` 下） |

### 示例：GitHub MCP

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/absolute/path/to/github-mcp.js"],
      "env": {
        "GITHUB_TOKEN": "$GITHUB_TOKEN"
      }
    }
  }
}
```

使用环境变量而不是硬编码 token：

```bash
export GITHUB_TOKEN=$(gh auth token)
```

### 其他集成

| 服务 | 智能体能做什么 |
|---------|-------------------|
| **GitHub** | 列出 issues/PRs、创建分支、发布评论 |
| **Trello** | 创建卡片、在列表间移动、更新描述 |
| **通知** | 在 Teams、Discord、iMessage、webhooks 上 ping 你 |
| **Aspire** | 监控 .NET 部署、检查服务健康 |

智能体在生成时发现工具并在工作中自然使用它们。有关通知如何连接到你的工作流，参见 [GitHub 集成](github-workflow.md)。

---

## VS Code 集成

Squad 在 VS Code 中完全相同地运行 —— 相同的 `.squad/` 状态、相同的智能体、相同的决策。用 CLI 初始化，在 VS Code 中打开，一切正常工作。

### 与 CLI 的关键差异

| 功能 | CLI | VS Code |
|---------|-----|---------|
| 每次生成模型选择 | ✅ | ❌（使用会话模型） |
| 智能体执行 | 后台 + 轮询 | 并行同步（结果一起到达） |
| SQL 工具 | ✅ | ❌（使用基于文件的状态） |
| 文件写入 | 自动 | 可能提示批准（一次） |

### 什么是相同的

- 相同的 `.squad/` 目录和状态
- 相同的团队花名册、技能和决策
- 并行工作有效（每轮多个智能体）
- MCP 工具从工作区配置继承

### 技巧

- 使用单根工作区（多根有路径解析 bug）
- 接受一次文件修改批准 —— 后续写入自动
- 对于繁重的并行工作（5+ 智能体）、SQL 工作流或每次生成模型选择 → 使用 CLI
- 如果智能体看起来慢，检查模型选择器 —— 切换到 Haiku 以节省成本

---

## 技巧

- 在运行 `upgrade` 之前导出 —— 它是你的回滚点。
- 导出 JSON 是人类可读的 —— 检查它以准确看到你的团队知道什么。
- 导入的智能体保留他们的名称和宇宙选角。
- 导入后提交 `.squad/` 以便每个克隆仓库的人都能获得团队。
- `upstream.json` 中的顺序很重要 —— 较晚条目覆盖较早条目。使用 `remove` + `add` 重新排序。

---

## 示例提示

```
导出当前团队
```

创建整个团队的 `squad-export.json` 快照。

```
将 squad-export.json 导入此仓库
```

将团队快照导入当前项目的 `.squad/` 目录。

```
为 DevOps 智能体安装 azure-infrastructure 插件
```

下载 Azure 插件并用云专业知识植入 DevOps 智能体。

```
展示 React 开发的所有可用插件
```

搜索所有配置的市场以获取 React 相关插件。

```
将平台团队的仓库添加为上游源
```

从共享的组织仓库继承技能、决策和路由。

```
展示所有配置的 MCP 服务器以及哪些正常工作
```

测试每个 MCP 服务器并报告状态。

```
squad upstream sync
```

更新所有 git 上游克隆并验证本地/导出路径。

```
将我们当前的 React 约定打包到名为 react-best-practices 的插件中
```

将你的相关技能和决策导出到可复用的插件捆绑包中以供分享。
