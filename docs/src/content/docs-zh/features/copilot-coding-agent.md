# Copilot 编码智能体 (@copilot)

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

将 GitHub Copilot 编码智能体作为自治团队成员添加到你的 Squad。它获取问题、创建分支、打开 PR —— 所有这些都无需 Copilot 聊天会话。

---

## 前置条件

在 Squad 上启用 @copilot 之前，确保：

1. 仓库上启用了 **Copilot 编码智能体**（Settings → Copilot → Coding agent）
2. `.github/` 中存在 **`copilot-setup-steps.yml`**（定义智能体的环境）
3. 仓库上启用了 **GitHub Actions**

---

## 快速开始

```bash
# 1. 将 @copilot 添加到你的 squad，带自动分配
squad copilot --auto-assign

# 2. 为自动分配创建经典 PAT（见下文）
#    https://github.com/settings/tokens/new → 勾选 "repo" 范围

# 3. 作为仓库 secret 添加 PAT
gh secret set COPILOT_ASSIGN_TOKEN

# 4. 提交并推送
git add .github/ .squad/ && git commit -m "feat: 添加 copilot 到 squad" && git push

# 5. 测试 —— 用 squad:copilot 标记任何 issue
gh issue edit <number> --add-label "squad:copilot"
```

> **为什么我不能使用 `gh issue edit --add-assignee "@copilot"`？** 机器人账户不能像人类用户那样通过 GitHub CLI 分配。改用基于标签的分配。详情参见 [FAQ：为什么 gh issue edit --add-assignee "@copilot" 不起作用？](../guide/faq.md#why-doesnt-gh-issue-edit---add-assignee-copilot-work)。

---

## 启用 @copilot

### 在对话中（推荐）

说类似：
- **"我想将 copilot 添加到 squad"**
- **"雇佣 copilot 到 squad"**
- **"添加团队成员 copilot"**

协调器会将 @copilot 添加到花名册并询问自动分配。

> **注意：** 如果你的项目有名为 "copilot" 的功能（例如 Copilot 扩展），协调器可能将短语误解为项目工作。在这种情况下使用 CLI 回退。

### 在团队设置期间（新项目）

Squad 在 `init` 期间询问是否要在团队中包含编码智能体。说 **是**，它就被添加到花名册，带有默认能力档案。

### 通过 CLI（回退）

```bash
# 将 @copilot 添加到团队
squad copilot

# 添加并启用自动分配
squad copilot --auto-assign

# 从团队移除
squad copilot --off
```

---

## COPILOT_ASSIGN_TOKEN（自动分配所需）

`squad-issue-assign` 工作流需要**经典个人访问令牌**来将 `copilot-swe-agent[bot]` 分配给 issues。默认 `GITHUB_TOKEN` 无法做到这一点。

### 创建令牌

1. 前往 https://github.com/settings/tokens/new
2. **Note：** `squad-copilot-assign`
3. **Expiration：** 90 天（或你的偏好）
4. **Scopes：** 勾选 **`repo`**（完全控制私有仓库）
5. 点击 **Generate token**

### 作为仓库 secret 添加

```bash
gh secret set COPILOT_ASSIGN_TOKEN --repo owner/repo
```

> **为什么用经典 PAT？** 细粒度 PAT 对此端点返回 `403 Resource not accessible`。为 `copilot-swe-agent[bot]` 分配的 REST API 需要带有 `repo` 范围的经典 PAT。`GITHUB_TOKEN` 静默忽略分配。

---

## @copilot 与其他成员有何不同

| | AI 智能体 | 人类成员 | @copilot |
|---|----------|-------------|----------|
