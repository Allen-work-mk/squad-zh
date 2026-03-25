# 首次会话教程

首次使用 Squad 的逐步导览。在终端中跟随操作。

---

## 1. 安装 Squad

从 git 仓库开始（新的或现有的）：

```bash
mkdir my-app && cd my-app
git init
npm install -g @bradygaster/squad-cli
squad init
```

你会看到：

```
✅ Squad 已安装。
   .github/agents/squad.agent.md —— 协调智能体
   .github/workflows/            —— 5 个 GitHub 工作流（心跳、分流、CI 等）
   .squad/templates/             —— 11 个模板文件

打开 GitHub Copilot 并从智能体列表中选择 Squad。
```

---

## 2. 打开 Copilot —— 你的团队形成

启动 Copilot CLI：

```bash
copilot
```

从 `/agent` 列表（CLI）或 `/agents`（VS Code）中选择 **Squad**。Squad 会通过名字问候你（从 `git config user.name` 获取）：

```
嘿 Brady，你在构建什么？
```

描述你的项目：

```
> 我正在构建一个 React 和 Node.js 的食谱分享应用。用户可以
> 发布食谱、按食材搜索并收藏。
```

Squad 会提议一个团队。名字来自虚构宇宙 —— 确切的宇宙取决于你的项目形状和历史。它可能看起来像这样：

```
这是你的团队：

🏗️  Hicks    —— 组长          范围、决策、代码评审
⚛️  Ripley   —— 前端开发      React、UI、组件
🔧  Dallas   —— 后端开发      Node.js、API、数据库
🧪  Lambert  —— 测试          测试、质量、边界情况
📋  Scribe   ——（静默）       记忆、决策、会话日志

看起来对吗？说 yes、添加某人或更改角色。
（或者直接给我任务开始！）
```

---

## 3. 确认并给出第一个任务

你可以说 "yes" 或直接跳到任务（这是隐式确认）：

```
> 是的。Dallas，设置 Express 服务器和基本路由。
```

Squad 创建 `.ai-team/` 目录结构（团队花名册、路由规则、选角状态、仪式配置、智能体 charter 和历史 —— 都根据你的项目上下文初始化）。然后生成 Dallas。

```
🔧 Dallas —— 正在设置 Express 服务器和路由

Dallas 正在处理 —— 现在正在构建 Express 服务器。
```

---

## 4. 并行展开 —— 启动表

现在给一个大任务来看并行工作：

```
> 团队，构建食谱列表页面。我们需要一个返回食谱的 API 端点
> 和一个显示它们的 React 组件。
```

Squad 分解工作并同时启动智能体：

```
🏗️ Hicks   —— 评审需求，定义 API 契约
⚛️ Ripley  —— 构建 RecipeList 组件
🔧 Dallas  —— 创建 GET /api/recipes 端点
🧪 Lambert —— 根据需求编写测试用例
📋 Scribe  —— 记录会话
```

所有五个智能体在单独的上下文窗口中同时工作。测试人员在实现构建时根据需求编写测试用例 —— 无需等待。

---

## 5. 按智能体标记的结果

当智能体完成时，你会看到标记每个智能体身份的结果：

```
🏗️ Hicks —— 定义 API 契约：GET /api/recipes 返回
   { recipes: [{ id, title, ingredients, prepTime }] }。
   决定对大结果集使用基于游标的分页。

⚛️ Ripley —— 在 src/components/RecipeList.tsx 构建 RecipeList 组件。
   使用 React Query 进行数据获取。卡片布局包含标题、
   准备时间和食材数量。

🔧 Dallas —— 在 src/routes/recipes.ts 创建 GET /api/recipes 端点。
   连接到 MongoDB。根据 Hicks 的规范支持 ?cursor= 分页。
   还添加了 GET /api/recipes/:id 用于详情视图（主动）。

🧪 Lambert —— 在 test/recipes.test.ts 中编写了 8 个测试用例：
   📌 主动：在 Dallas 构建时根据需求编写。
   一旦实现完成可能需要调整。
   - 列表返回分页结果
   - 空数据库返回空数组
   - 无效游标返回 400
   - 详情端点对缺失食谱返回 404
   [+4 更多]
```

在幕后，Scribe 将每个智能体的决策合并到 `decisions.md` 并记录会话。

---

## 6. 询问"我们在哪里？"—— 即时状态

在任何时候，你都可以检查状态：

```
> 我们在哪里？
```

这是直接模式响应 —— 不生成智能体，只是协调器读取最近的日志：

```
上次会话：食谱列表页面（15 分钟前）

谁工作了：
- Hicks 定义了 API 契约（游标分页）
- Ripley 构建了 RecipeList 组件
- Dallas 创建了 recipes 端点 + 详情端点
- Lambert 编写了 8 个测试用例

关键决策：
- 食谱列表使用基于游标的分页
- 前端数据获取使用 React Query
- MongoDB 作为数据库

decisions.md 中有 3 个决策，4 个智能体历史条目已更新。
```

---

## 7. 跟进任务 —— 观看决策累积

给一个跟进任务：

```
> 现在添加一个搜索功能。用户应该能够
> 按食材名称搜索食谱。
```

Squad 看到这涉及多个领域并再次展开：

```
🔧 Dallas  —— 添加带食材过滤的搜索端点
⚛️ Ripley  —— 构建带食材输入的搜索 UI
🧪 Lambert —— 编写搜索测试用例
📋 Scribe  —— 记录会话
```

完成后，检查决策：

```
> 给我看决策
```

```
### 2025-07-15: 食谱列表使用基于游标的分页
**由：** Hicks
**内容：** 所有列表端点使用基于游标的分页
**原因：** 对于不断增长的数据集，比偏移分页扩展性更好

### 2025-07-15: 使用 React Query 进行数据获取
**由：** Ripley
**内容：** 所有 API 调用使用 React Query 和 stale-while-revalidate
**原因：** 内置缓存、重新获取和加载状态

### 2025-07-15: 通过 MongoDB 文本索引进行全文搜索
**由：** Dallas
**内容：** 搜索在食谱标题和食材数组上使用 $text 索引
**原因：** MongoDB 原生能力，无需外部搜索服务
```

每个智能体在工作前都会读取这些决策。随着列表增长，团队自我对齐 —— 智能体尊重彼此的架构选择，无需你重复。

---

## 8. 设置指令

你注意到想要标准化的事情：

```
> 始终使用 Zod 进行 API 输入验证
```

Squad 将其作为指令捕获 —— 无需生成智能体：

```
📌 已捕获。所有 API 输入验证必须使用 Zod。
```

这通过收件箱写入 `decisions.md`。每个智能体在下次生成时都会看到它。

---

## 9. 导出你的 Squad

在高效的会话后，导出你的团队以便携带：

```bash
squad export
```

```
✅ 已导出到 squad-export.json
   5 个智能体、3 个技能、6 个决策
```

此快照包含所有内容 —— charter、历史、选角状态、技能和决策。你可以稍后将其导入另一个仓库：

```bash
cd ../other-project
npm install -g @bradygaster/squad-cli
squad init
squad import ../my-app/squad-export.json
```

---

## 接下来尝试什么

- **添加团队成员：** `"我需要一个 DevOps 人员"`
- **运行仪式：** `"在我们开始认证系统之前运行设计评审"`
- **指导智能体：** `"Lambert，运行测试套件并告诉我什么失败了"`
- **移除某人：** `"移除设计师 —— 我们不再需要他们了"`
- **连接到 issues：** `"连接到 myorg/myrepo"`（参见 [GitHub Issues 教程](tour-github-issues.md)）

---

## 技巧

- **第一次会话最慢。** 智能体还没有历史。经过 2-3 次会话后，它们了解你的约定，不再问已经回答过的问题。
- **提交 `.ai-team/`。** 它是你团队的大脑。任何克隆的人都会获得团队及其所有知识。
- **对大任务说"团队"。** "团队"一词触发跨多个智能体的并行展开。
- **对专注工作命名智能体。** `"Dallas，修复登录 bug"` 将工作发送给一个特定智能体。
- **指令是粘性的。** 一旦捕获，它们在所有未来会话中持久存在。
