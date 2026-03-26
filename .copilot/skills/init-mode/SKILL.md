---
name: "init-mode"
description: "团队初始化流程（第1阶段提议 + 第2阶段创建）"
domain: "orchestration"
confidence: "high"
source: "extracted"
tools:
  - name: "ask_user"
    description: "使用可选菜单确认团队花名册"
    when: "第1阶段提议 —— 需要显式用户确认"
---

## 上下文

当初始化模式在以下情况激活：`.squad/team.md` 不存在，或存在但 `## Members` 下没有花名册条目。协调器提议一个团队（第1阶段），等待用户确认，然后创建团队结构（第2阶段）。

## 模式

### 第1阶段：提议团队

尚无团队存在。提议一个 —— 但**在用户确认之前不要创建任何文件。**

1. **识别用户。** 运行 `git config user.name` 了解你在与谁合作。在对话中使用他们的名字（例如 *"嘿 Brady，你在构建什么？"*）。将他们的名字（不是电子邮件）存储在 `team.md` 的项目上下文中。**永远不要读取或存储 `git config user.email` —— 电子邮件地址是 PII，不得写入提交的文件。**
2. 询问：*"你在构建什么？（语言、技术栈、用途）"*
3. **选角团队。** 在提议名字之前，运行选角与持久命名算法（见该部分）：
   - 确定团队规模（通常 4–5 人 + Scribe）。
   - 从用户的项目描述确定分配形状。
   - 从会话和仓库上下文推导共鸣信号。
   - 选择一个宇宙。如果是自定义宇宙，从 `.squad/templates/casting/` 目录中找到的相关列表中分配该宇宙的角色名字。如果有可用时优先使用自定义宇宙。
   - Scribe 始终是 "Scribe" —— 免选角。
   - Ralph 始终是 "Ralph" —— 免选角。
4. 用他们的选角名字提议团队。示例（名字会因选角而异）：

```
🏗️  {CastName1}  —— 组长          范围、决策、代码审查
⚛️  {CastName2}  —— 前端开发      React、UI、组件
🔧  {CastName3}  —— 后端开发      API、数据库、服务
🧪  {CastName4}  —— 测试人员        测试、质量、边界情况
📋  Scribe       ——（静默）       记忆、决策、会话日志
🔄  Ralph        ——（监控器）     工作队列、积压、保活
```

5. 使用 `ask_user` 工具确认花名册。提供选择让用户看到可选菜单：
   - **question:** *"看起来对吗？"*
   - **choices:** `["是的，雇佣这个团队", "添加某人", "更改角色"]`

**⚠️ 停止。你的响应到此结束。不要进入第2阶段。不要创建任何文件或目录。等待用户回复。**

### 第2阶段：创建团队

**触发：** 用户回复第1阶段并确认（"是"、"看起来不错"或类似的肯定），或者用户对第1阶段的回复是任务（视为隐式"是"）。

> 如果用户说"添加某人"或"更改角色"，返回第1阶段第3步并重新提议。直到用户确认前不要进入第2阶段。

6. 创建 `.squad/` 目录结构（格式指南参见 `.squad/templates/` 或使用标准结构：team.md、routing.md、ceremonies.md、decisions.md、decisions/inbox/、casting/、agents/、orchestration-log/、skills/、log/）。

**选角状态初始化：** 将 `.squad/templates/casting-policy.json` 复制到 `.squad/casting/policy.json`（或从默认值创建）。创建 `registry.json`（条目：persistent_name、universe、created_at、legacy_named: false、status: "active"）和 `history.json`（带有 unique assignment_id 的首次分配快照）。

**植入：** 每个智能体的 `history.md` 以项目描述、技术栈和用户名开始，以便他们拥有第1天的上下文。智能体文件夹名称是小写的选角名字（例如 `.squad/agents/ripley/`）。Scribe 的 charter 包括维护 `decisions.md` 和跨智能体上下文共享。

**Team.md 结构：** `team.md` 必须包含一个标题完全为 `## Members` 的部分（不是"## Team Roster"或其他变体）包含花名册表格。此标题在 GitHub 工作流（`squad-heartbeat.yml`、`squad-issue-assign.yml`、`squad-triage.yml`、`sync-squad-labels.yml`）中是硬编码的，用于标签自动化。如果标题缺失或标题不同，标签路由会中断。

**仅限追加文件的合并驱动器：** 在仓库根目录创建或更新 `.gitattributes` 以启用跨分支的 `.squad/` 状态无冲突合并：
```
.squad/decisions.md merge=union
.squad/agents/*/history.md merge=union
.squad/log/** merge=union
.squad/orchestration-log/** merge=union
```
`union` 合并驱动器保留两边的所有行，这对仅限追加的文件是正确的。这使得 worktree-本地策略在分支合并时无缝工作 —— 来自所有分支的决策、记忆和日志自动组合。

7. 说：*"✅ 团队已雇佣。试试：'{FirstCastName}, 设置项目结构'"*

8. **设置后输入源**（可选 —— 在团队创建后询问，不是在选角期间）：
   - PRD/规范：*"你有 PRD 或规范文档吗？（文件路径、粘贴，或跳过）"* → 如果提供，遵循 PRD 模式流程
   - GitHub issues：*"有我应该从中拉取的 GitHub 仓库吗？（owner/repo，或跳过）"* → 如果提供，遵循 GitHub Issues 模式流程
   - 人类成员：*"有任何人类加入团队吗？（姓名和角色，或暂时只有 AI）"* → 如果提供，按人类团队成员部分添加
   - Copilot 智能体：*"想要包含 @copilot 吗？它可以自主获取问题。（是/否）"* → 如果是，遵循 Copilot 编码智能体成员部分并询问自动分配
   - 这些是附加的。不要阻塞 —— 如果用户跳过或给出任务，立即继续。

## 示例

**示例流程：**
1. 协调器检测没有 team.md → 初始化模式
2. 运行 `git config user.name` → "Brady"
3. 询问：*"嘿 Brady，你在构建什么？"*
4. 用户：*"带 GitHub API 集成的 TypeScript CLI 工具"*
5. 协调器运行选角算法 → 选择 "The Usual Suspects" 宇宙
6. 提议：Keaton（组长）、Verbal（提示）、Fenster（后端）、Hockney（测试人员）、Scribe、Ralph
7. 使用 `ask_user` 和选择 → 用户选择 "是的，雇佣这个团队"
8. 协调器创建 `.squad/` 结构，初始化选角状态，植入智能体
9. 说：*"✅ 团队已雇佣。试试：'Keaton, 设置项目结构'"*

## 反模式

- ❌ 在用户确认第1阶段之前创建文件
- ❌ 在同一选角中混合来自不同宇宙的智体
- ❌ 跳过 `ask_user` 工具并假设确认
- ❌ 当用户说"添加某人"或"更改角色"时进入第2阶段
- ❌ 使用 `## Team Roster` 而不是 `## Members` 作为标题（会破坏 GitHub 工作流）
- ❌ 忘记初始化 `.squad/casting/` 状态文件
- ❌ 读取或存储 `git config user.email`（PII 违规）
