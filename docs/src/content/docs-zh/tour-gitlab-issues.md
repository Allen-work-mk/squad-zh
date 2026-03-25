# GitLab Issues 教程

> **🧪 实验性。** GitLab Issues 模式是新的。命令、行为和集成细节可能会变化。[欢迎反馈。](https://github.com/bradygaster/squad/issues)

Squad 的 GitLab Issues 工作流逐步导览。这将把你的团队连接到 GitLab 仓库的问题跟踪器，以便智能体可以获取 issues、创建分支、打开合并请求并处理审查反馈。

**前置条件：** 必须安装并认证 [`glab` CLI](https://docs.gitlab.com/cli/issue/)（官方 GitLab CLI）（`glab auth login`）。

---

## 1. 连接到仓库

告诉 Squad 要跟踪哪个 GitLab 仓库：

```
> 连接到 GitLab https://gitlab.example.com/acme/recipe-app
```

Squad 将问题源存储在团队状态中：

```
✅ 问题源已存储：https://gitlab.example.com/acme/recipe-app (GitLab)
   使用 glab CLI 进行问题跟踪。
```

从现在开始，Squad 可以从该仓库读取 issues 并针对它创建分支和 MR。

---

## 2. 查看积压工作

要求查看开放 issues：

```
> 显示积压工作
```

Squad 通过 `glab issue list`（默认开放）拉取开放 issues 并显示它们：

```
┌─────┬──────────────────────────────────────────┬───────────┬────────────┐
│  #  │ 标题                                    │ 标签      │ 负责人     │
├─────┼──────────────────────────────────────────┼───────────┼────────────┤
│  12 │ 添加食材搜索                            │ feature   │ —          │
│  15 │ 修复食谱列表分页                        │ bug       │ —          │
│  18 │ 添加用户个人资料页                      │ feature   │ —          │
│  21 │ API 端点速率限制                        │ security  │ —          │
│  23 │ 移动端响应式布局                        │ ui        │ —          │
└─────┴──────────────────────────────────────────┴───────────┴────────────┘
5 个开放 issues
```

---

## 3. 处理 Issue

选择一个问题让智能体处理：

```
> 处理 #12
```

Squad 读取问题详情，将其路由给正确的智能体，并启动工作流：

```
🔧 Dallas —— 正在处理 #12（添加食材搜索）

Dallas 正在阅读问题并开始工作。
```

在幕后，智能体：

1. **创建分支** —— 根据问题描述命名（例如 `12-add-ingredient-search`）
2. **执行实现工作** —— 编写代码、测试、问题所需的任何内容
3. **打开合并请求** —— 链接回问题 #12，描述完成的内容

当智能体完成时：

```
🔧 Dallas —— 已完成 #12（添加食材搜索）
   分支：12-add-ingredient-search
   MR：!24 已打开 —— "添加食材搜索（#12）"
   文件变更：
   - src/routes/recipes.ts（添加搜索端点）
   - src/models/recipe.ts（添加文本索引）
   - test/search.test.ts（6 个测试用例）
```

---

## 4. 并行处理多个 Issues

你可以同时分配多个 issues：

```
> 处理 #15 和 #23
```

```
🔧 Dallas  —— 正在处理 #15（修复食谱列表分页）
⚛️ Ripley  —— 正在处理 #23（移动端响应式布局）
📋 Scribe  —— 记录会话
```

每个智能体创建自己的分支并独立工作。如果你的仓库支持 worktree，Squad 可以同时处理多个分支。

---

## 5. 处理审查反馈

MR 打开后，审查者可能会留下评论。当你看到反馈时：

```
> MR !24 有审查反馈
```

Squad 将审查路由给打开 MR 的智能体：

```
🔧 Dallas —— 正在阅读 MR !24 的审查评论

Dallas 正在处理反馈。
```

智能体阅读审查评论，进行请求的更改，并将新提交推送到同一分支：

```
🔧 Dallas —— 已处理 MR !24 的审查反馈
   - 为搜索查询添加输入清理（审查者关注）
   - 为 SQL 注入尝试添加测试用例
   - 向 12-add-ingredient-search 推送 2 个新提交
```

---

## 6. 合并完成的工作

当 MR 获批并准备好时：

```
> 合并 MR !24
```

```
✅ MR !24 已合并 —— "添加食材搜索（#12）"
   问题 #12 已关闭。
   分支 12-add-ingredient-search 已删除。
```

当 MR 合并时，问题会自动关闭（如果 MR 正文包含 `Closes #12`）。

---

## 7. 让 Squad 监视 Issues（Ralph）

设置 Squad 持续监视新 issues：

```
> Ralph，开始监视 issues
```

Ralph（监控智能体）每 10 分钟轮询一次 issues：

```
📡 Ralph —— 正在监视 GitLab 的问题
        每 10 分钟检查一次。
        将标记为 `squad:` 的问题分派给团队成员。
```

当新 issues 到达时：

```
📡 Ralph —— 新问题 #27（添加食谱分类）
        标记为 squad:，分配给 ⚛️ Ripley
```

---

## 8. 分流模式

你可以在 issues 上使用标签来控制路由：

| 标签 | 路由到 |
|--------|------------|
| `squad:frontend` | 前端智能体 |
| `squad:backend` | 后端智能体 |
| `squad:security` | 安全专家 |
| `squad:docs` | 文档编写者 |

```
> 在 #18 上添加标签 squad:frontend
```

当 Ralph 看到标签时，它会相应地路由。

---

## 完整工作流示例

以下是端到端工作流：

```
> 连接到 GitLab https://gitlab.example.com/acme/recipe-app
> Ralph，开始监视

[稍后]

📡 Ralph —— 新问题 #30（用户报告登录错误）
        标记为 squad:backend，分配给 🔧 Dallas

🔧 Dallas —— 正在处理 #30
        创建分支 30-fix-login-error
        实施修复...
        打开 MR !31

[稍后]

> MR !31 有审查反馈

🔧 Dallas —— 正在处理反馈
        推送更新...

[稍后]

> 合并 MR !31

✅ 已合并，问题 #30 已关闭
```

---

## 接下来

- [技巧和窍门](tips-and-tricks.md) —— 高级提示模式和最佳实践
- [GitHub Issues 教程](tour-github-issues.md) —— 相同的工作流，用于 GitHub
