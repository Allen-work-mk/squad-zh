# Squad — 产品指南

## 什么是 Squad？

Squad 通过 GitHub Copilot 为你提供一支 AI 开发团队。你描述正在构建的内容，Squad 会提议一个专家团队 —— 组长、前端、后端、测试 —— 它们以文件形式存在于你的仓库中。每个智能体在自己的上下文窗口中运行，读取自己的知识，并将学到的内容写回。它们在会话间持久存在，共享决策，并且用得越多就越聪明。

它不是一个戴着不同帽子的聊天机器人。每个团队成员都是作为具有自己工具、自己记忆和自己专长领域的真实子智能体生成的。

---

## 应该使用哪个 CLI？

**日常使用使用 GitHub Copilot CLI。** 它是与你的 Squad 交互的推荐界面 —— 完整的智能体生成、模型选择和所有功能的对话式访问。

**设置和操作使用 Squad CLI：**
- 初始设置：`squad init`
- 从配置构建：`squad build`
- 诊断：`squad doctor`
- 交互式 shell：`squad shell`
- 持续分流：`squad triage --interval 10`
- 监视模式：`squad watch`
- Aspire 仪表板：`squad aspire`
- 导出/导入：`squad export` 和 `squad import`
- 插件管理：`squad plugin install <name>`

**常见工作流：**
```bash
# 终端 1：运行持续分流（Squad CLI）
squad triage --interval 10

# 终端 2：与你的团队一起工作（GitHub Copilot CLI）
gh copilot
> @squad 哪些 issue 可以开始工作？
```

两个 CLI 都读取和写入相同的 `.squad/` 目录，因此状态保持同步。更多详情，请参阅 [FAQ：我应该使用哪个 CLI？](guide/faq.md#which-cli-should-i-use) 和 [客户端兼容性矩阵](scenarios/client-compatibility.md)。

---

## 支持的平台

Squad 跨多个界面工作 —— GitHub Copilot CLI、VS Code、Squad CLI、SDK 和 Copilot Coding Agent。选择适合你工作流的：

- **GitHub Copilot CLI** —— 与 squad 的日常对话式工作（推荐）
- **VS Code** —— 相同的体验，集成在编辑器中
- **Squad CLI** —— 设置、诊断、监控（`squad init`、`squad doctor`、`squad watch`）
- **SDK** —— 使用 `squad.config.ts` 在 Squad 之上构建工具
- **Copilot Coding Agent** —— 通过 `@copilot` 自动处理 issue

**多平台支持：** Squad 还通过可插拔的平台适配器与 Azure DevOps（工作项、PR）、GitLab Issues 和 Microsoft Planner 一起工作。详情参见 [企业平台](features/enterprise-platforms.md)。

不确定使用哪个？请参阅 [选择你的界面](get-started/choose-your-interface.md) 获取完整比较和决策树。

---

## 安装

```bash
npm install -g @bradygaster/squad-cli
```

**要求：**
- Node.js 20+ (LTS)
- GitHub Copilot（CLI、VS Code、Visual Studio 或 Coding Agent）
- 一个 git 仓库（Squad 将团队状态存储在 `.squad/` 中）
- **`gh` CLI** —— GitHub Issues、PR、Ralph 和 Project Boards 所需（[安装](https://cli.github.com/)）

运行 `squad init` 会创建 `.squad/` 目录结构，将 `squad.agent.md` 复制到 `.github/agents/`，并将 GitHub Actions 工作流安装到 `.github/workflows/`。你的团队在第一次与 Squad 对话时在运行时创建。

**注意：** 当你从智能体选择器中选择 Squad 时，你会在名称中看到版本号（例如 "Squad (v0.8.25)"）。这有助于你确认安装的版本。

### GitHub CLI 认证

Squad 使用 `gh` CLI 进行所有 GitHub API 操作 —— issues、PR、labels、project boards 和 Ralph 的工作监控。在使用任何这些功能之前必须进行认证。

**快速开始：**

```bash
gh auth login
```

选择 **GitHub.com**、**HTTPS**，并使用浏览器或 Personal Access Token (PAT Classic) 进行认证。

**验证是否成功：**

```bash
gh auth status
```

**额外权限范围** —— 某些功能需要默认范围之外的权限：

| 功能 | 所需权限 | 命令 |
|---------|---------------|---------|
| Issues、PRs、Ralph | `repo`（默认包含） | — |
| Project Boards | `project` | `gh auth refresh -s project` |

`gh auth refresh` 命令向你的现有 token 添加权限 —— 大约需要 10 秒，你只需执行一次。

**故障排除：**

| 问题 | 解决方案 |
|-------|---------|
| `gh: command not found` | 安装 [GitHub CLI](https://cli.github.com/) |
| `could not resolve to a Repository` | 在 git 仓库中运行 `git init` |
| `HTTP 401: Bad credentials` | 运行 `gh auth login` 重新认证 |

---

## 快速开始（5 分钟）

### 1. 创建项目

```bash
mkdir my-project && cd my-project
git init
```

### 2. 安装 Squad

```bash
npm install -g @bradygaster/squad-cli
squad init
```

**验证：** 检查 `.squad/team.md` 是否存在。

### 3. 打开 Copilot 并开始

```bash
copilot
```

选择 **Squad** 智能体并描述你的项目：

```
> 我正在构建一个 React 和 Node.js 的食谱分享应用。
> 用户可以发布食谱、按食材搜索并收藏。
```

Squad 会提议一个团队。输入 `yes` 确认 —— 他们就绪。

### 4. 给你的团队任务

```
> 团队，构建登录页面
```

Squad 同时启动多个智能体。每个都处理自己专长领域的部分。

---

## 核心概念

### 智能体（Agents）

智能体是 Squad 的核心。每个智能体都有：

- **Charter** —— 身份、专长和个性（`.squad/agents/{name}/charter.md`）
- **History** —— 对你的项目的持久学习（`.squad/agents/{name}/history.md`）
- **Tools** —— 根据专长量身定制的特定功能
- **Memory** —— 会话间保持的上下文

智能体作为子进程生成，每个都有自己的上下文窗口。它们并行工作，并通过共享文件同步。

### 团队（Team）

团队是协同工作的智能体集合。团队结构记录在：

- `.squad/team.md` —— 花名册，谁负责什么
- `.squad/routing.md` —— 消息如何路由到智能体
- `.squad/decisions.md` —— 团队共享的决策

### 仪式（Ceremonies）

仪式是结构化的团队活动：

- **设计评审** —— 在开始构建前评审架构
- **代码评审** —— 在合并前评审实现
- **回顾** —— 评审已完成的工作并获取反馈
- **规划** —— 将史诗分解为可管理的任务

通过说 `"运行设计评审"` 或 `"我们开一个回顾会议"` 来运行仪式。

### 指令（Directives）

指令是适用于所有未来工作的持久规则：

```
> 始终使用 Zod 进行 API 输入验证
```

Squad 捕获它并写入 `.squad/decisions.md`。每个智能体在下次生成时都会看到它。

---

## 常用命令

### 团队管理

```bash
squad status                    # 显示活跃团队和状态
squad export                    # 导出团队为 JSON
squad import <file>            # 从导出文件导入团队
```

### 监控与运维

```bash
squad triage --interval 10      # 每 10 分钟监视 issues
squad watch                     # 监视工作并自动处理
squad doctor                    # 诊断设置问题
squad aspire                    # 打开 Aspire 仪表板
```

### 交互式 Shell

```bash
squad                           # 进入交互式 shell
> @hicks 评审架构              # 向特定智能体发送消息
> 团队，构建登录页             # 向整个团队发送消息
> /status                       # 检查团队状态
> /agents                       # 列出所有智能体
> /quit                         # 退出 shell
```

---

## 工作流模式

### 模式 1：绿色领域开发（从零开始）

```
你：团队，构建一个登录系统

🏗️ 组长 — 评审需求，定义 API 契约
⚛️ 前端 — 构建登录表单
🔧 后端 — 设置认证端点
🧪 测试 — 编写测试用例
```

所有智能体并行工作。完成后，决策已记录，历史已更新。

### 模式 2：现有代码工作

```
你：@dallas，向 recipes API 添加分页

🔧 Dallas 读取 decisions.md 和历史
🔧 检查现有模式
🔧 实现与架构决策一致的分页
```

智能体读取团队共享的知识并遵循既定模式。

### 模式 3：Issue 分流

```bash
squad triage --interval 10
```

Squad 监视 GitHub issues，自动分类并分配给团队成员。新 issues 被路由到正确的智能体。

### 模式 4：仪式驱动开发

```
你：运行设计评审，讨论新的支付功能

🏗️ 组长 — 引导评审
⚛️ 前端 — 评审 UI 影响
🔧 后端 — 评审 API 设计
🧪 测试 — 评审可测试性
```

团队一起评审设计、提出问题、记录决策，然后才开始构建。

---

## 下一步

- **[首次会话教程](tour-first-session.md)** —— 完整的第一会话导览
- **[GitHub Issues 教程](tour-github-issues.md)** —— 连接到你的 issue 跟踪器
- **[示例提示](sample-prompts.md)** —— 可复制的有效提示
- **[技巧和窍门](tips-and-tricks.md)** —— 高级用法模式

---

## 获取帮助

- **GitHub Issues：** https://github.com/bradygaster/squad/issues
- **讨论：** https://github.com/bradygaster/squad/discussions
- **文档：** 运行 `squad` 并输入 `/help`
