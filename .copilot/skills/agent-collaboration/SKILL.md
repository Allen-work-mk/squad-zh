---
name: "agent-collaboration"
description: "所有 squad 智能体的标准协作模式 —— worktree 感知、决策、跨智能体通信"
domain: "team-workflow"
confidence: "high"
source: "从 charter 样板中提取 —— 18+ 个智能体 charter 中的相同内容"
---

## 上下文

团队上的每个智能体遵循相同的协作模式进行 worktree 感知、决策记录和跨智能体通信。这些以前在每个 charter 的协作部分重复（~300 字节 × 18 个智能体 = ~5.4KB 冗余上下文）。现在集中在这里。

协调器的生成提示已经指示智能体读取 decisions.md 和他们的 history.md。此技能添加了写入决策和请求帮助的模式。

## 模式

### Worktree 感知
使用生成提示中提供的 `TEAM ROOT` 路径。所有 `.squad/` 路径都是相对于此根目录的。如果没有提供 TEAM ROOT（罕见），运行 `git rev-parse --show-toplevel` 作为回退。永远不要假设 CWD 是仓库根目录。

### 决策记录
在做出影响其他团队成员的决策后，将其写入：
`.squad/decisions/inbox/{your-name}-{brief-slug}.md`

格式：
```
### {date}: {decision title}
**By:** {Your Name}
**What:** {the decision}
**Why:** {rationale}
```

### 跨智能体通信
如果你需要另一个团队成员的输入，在你的响应中说明。协调器会带他们进来。不要尝试做你域外的工作。

### 审查员协议
如果你有审查员权限并拒绝工作：原始作者被锁定不能修订该工件。不同的智能体必须拥有修订权。在你的拒绝响应中说明谁应该修订。

## 反模式
- 不要阅读所有智能体 charter —— 你只需要自己的上下文 + decisions.md
- 不要直接写入 `.squad/decisions.md` —— 总是使用收件箱投递箱
- 不要修改其他智能体的 history.md 文件 —— 那是书记员的工作
- 不要假设 CWD 是仓库根目录 —— 总是使用 TEAM ROOT
