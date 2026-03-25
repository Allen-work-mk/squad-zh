# 你的首次会话

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

从安装到并行展开的逐步导览。在终端中跟随操作。

---

## 试试这个：

```bash
mkdir my-app && cd my-app && git init
squad
```

然后告诉你的团队你在构建什么。

---

## 1. 安装 Squad

从 git 仓库开始 —— 新的或现有的：

```bash
mkdir my-app && cd my-app
git init
squad
```

你会看到：

```
✅ Squad 已安装。
   .github/agents/squad.agent.md —— 协调智能体
   .squad/templates/ —— 11 个模板文件

打开 GitHub Copilot 并从智能体列表中选择 Squad。
```

---

## 2. 打开 Copilot —— 你的团队形成

启动 Copilot CLI：

```bash
copilot
```

从 `/agent` 列表（CLI）或 `/agents`（VS Code）中选择 **Squad**。Squad 会通过名字问候你：

```
嘿 Brady，你在构建什么？
```

描述你的项目：

```
> 我正在构建一个 React 和 Node.js 的食谱分享应用。用户可以
> 发布食谱、按食材搜索并收藏。
```

Squad 提议一个团队。协调器分析你的描述并建议专家：

```
这是你的团队：

🏗️  Hicks    —— 组长          范围、决策、代码评审
⚛️  Ripley   —— 前端开发      React、UI、组件
🔧  Dallas   —— 后端开发      Node.js、API、数据库
🧪  Lambert  —— 测试          测试、质量、边界情况
📋  Scribe   ——（静默）       记忆、决策、会话日志

**Scribe** 和 **Ralph** 始终在每台阵容上 —— 你不用管理它们。

看起来对吗？说 yes、添加某人或更改角色。
（或者直接给我任务开始！）
```

---

## 3. 确认并给出第一个任务

说 "yes" 或直接跳到任务（这是隐式确认）：

```
> 是的。Dallas，设置 Express 服务器和基本路由。
```

Squad 创建 `.squad/` 目录结构 —— 团队花名册、路由规则、选角状态、仪式配置、智能体 charter 和历史 —— 都根据你的项目上下文初始化。每个智能体生成以完成他们的工作。

### .squad/ 里面有什么？

| 文件/目录 | 用途 |
|---|---|
| `team.md` | 团队花名册、角色和成员信息 |
| `routing.md` | 工作路由规则（哪个智能体处理什么） |
| `decisions.md` | 团队决策 —— 所有智能体在工作前阅读 |
| `agents/` | 每个智能体的 charter 和历史（他们的记忆） |
