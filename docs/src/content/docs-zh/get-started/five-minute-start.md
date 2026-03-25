# 快速开始

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

你与 Squad 的前 5 分钟。在了解任何东西之前先证明它有效。

---

## 前置要求

- **Node.js 20+** —— 用 `node --version` 检查
- **Git 仓库** —— 新的或现有的

---

## 安装

```bash
npm install --save-dev @bradygaster/squad-cli
```

然后初始化：

```bash
npx squad init
```

你会看到：

```
✅ Squad 已安装。
   .github/agents/squad.agent.md —— 协调智能体
   .squad/templates/ —— 11 个模板文件

打开 GitHub Copilot 并从智能体列表中选择 Squad。
```

---

## 验证

检查 Squad 是否创建了你的团队目录：

```bash
ls .squad/
```

你应该看到：`team.md`、`routing.md`、`decisions.md`、`agents/` 等。

确认 Squad 已就绪：

```bash
npx squad status
```

---

## 尝试

在终端或 VS Code 中打开 GitHub Copilot。从智能体列表中选择 **Squad**（CLI 中使用 `/agent Squad` 或 VS Code 中使用 `/agents`）。

说些简单的：

```
> 我正在构建一个 React 和 Node.js 的任务管理应用。
> 用户可以创建、更新和删除任务。
```

Squad 形成你的团队并回复智能体名称和角色。说 yes，或者直接给出第一个任务：

```
> 团队，创建一个带有 /health 端点的基本 Express 服务器。
```

Squad 生成智能体并完成工作。

---

## 刚才发生了什么？

Squad 读取你的描述，形成一个专家团队，将他们的 charter 写入 `.squad/agents/`，并协调并行工作。查看 `.squad/decisions.md` 了解他们决定了什么。

---

## 下一步

[**你的首次会话**](first-session) —— 并行工作、决策和记忆的逐步导览。
