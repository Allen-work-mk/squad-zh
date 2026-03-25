# VS Code 中的 Squad

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

Squad 在 VS Code 中完全受支持（v0.4.0+）。你的团队与 CLI 相同地运行，具有相同的 `.squad/` 状态、相同的智能体、相同的决策 —— 但带有 VS Code 特定的工具和约束。

本指南涵盖不同之处、相同之处，以及何时使用 CLI vs VS Code。

---

## 开始

### 前置条件

- **VS Code** — 最新版本
- **GitHub Copilot 扩展** — `GitHub.copilot`（已安装、已认证）
- **工作区信任** — 你的工作区必须受信任（VS Code 安全）
- **Node.js 20+ (LTS)** — 如果运行 CLI 初始化 Squad
- **Squad 已安装** — 仓库中已存在（来自 CLI），或通过智能体选择器全新初始化

### 初始设置

**选项 A：用 CLI 初始化（推荐）**

```bash
npm install -g @bradygaster/squad-cli
```

创建 `.github/agents/squad.agent.md` 和 `.squad/templates/`。然后在 VS Code 中打开并从智能体选择器中选择 **Squad**。

**选项 B：在 VS Code 中全新开始**

在 VS Code 中打开 Copilot，从 `/agents` 中选择 **Squad**。Squad 检测它在 VS Code 中运行并正常引导。`.squad/` 目录在首次运行时创建。

---

## 如何工作

Squad 自动检测 VS Code 并调整其生成机制：

- **在 CLI 中：** 使用具有完全控制的 `task` 工具（模型选择、智能体类型、后台模式）
- **在 VS Code 中：** 使用 **并行同步执行** 的 `runSubagent`

当你分配工作给智能体时，协调器在 VS Code 中将其生成为子智能体。在**同一轮中生成的多个子智能体**以**并行**方式运行。每个完成后，你一次性获得所有结果 —— 不像 CLI 显示中间"启动表"反馈。

---

## 与 CLI 的不同之处

### 无每次生成模型选择

VS Code 接受会话模型（你的 Copilot 模型选择器）。无每次生成动态选择。成本优化推迟 —— 通过模型选择器使用 Haiku 进行更便宜的运行。

### 子智能体同步运行（但并行）

智能体在同轮中启动并并行运行，但作为一个组阻塞。结果一次性到达 —— 没有启动表或 `read_agent` 轮询。

### SQL 工具不可用

VS Code 智能体中 SQL 不可用。需要 SQL 的工作流应保留在 CLI 中，或使用基于文件的状态（`.squad/state/` 中的 JSON）。

### 文件写入可能提示批准

VS Code 安全功能：通过"始终允许在此工作区"一次性批准文件修改。

---

## 相同之处

### 相同的 `.squad/` 状态

在 CLI 中初始化，在 VS Code 中使用，或反之亦然。团队花名册、决策、历史在两者间完全相同。

### 相同的团队，相同的技能

Charter、历史、智能体角色持久保留。在 CLI 中做出的决策在 VS Code 中可见。

### 并行执行有效
