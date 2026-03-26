---
name: "git-workflow"
description: "Squad 分支模型：以 dev 为先的工作流，带内测预览通道"
domain: "version-control"
confidence: "high"
source: "team-decision"
---

## 上下文

Squad 使用三分支模型。**所有功能工作从 `dev` 开始，不是 `main`。**

| 分支 | 目的 | 发布 |
|--------|---------|-----------|
| `main` | 已发布、已标记、在 npm 中的代码 | 标签上的 `npm publish` |
| `dev` | 集成分支 —— 所有功能工作落在这里 | 合并时的 `npm publish --tag preview` |
| `insiders` | 早期访问通道 —— 从 dev 同步 | 同步时的 `npm publish --tag insiders` |

## 分支命名约定

Issue 分支必须使用：`squad/{issue-number}-{kebab-case-slug}`

示例：
- `squad/195-fix-version-stamp-bug`
- `squad/42-add-profile-api`

## Issue 工作工作流

1. **从 dev 分支：**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b squad/{issue-number}-{slug}
   ```

2. **标记 issue 进行中：**
   ```bash
   gh issue edit {number} --add-label "status:in-progress"
   ```

3. **创建针对 dev 的草稿 PR：**
   ```bash
   gh pr create --base dev --title "{description}" --body "Closes #{issue-number}" --draft
   ```

4. **做工作。** 进行更改、编写测试、用 issue 引用提交。

5. **推送并标记就绪：**
   ```bash
   git push -u origin squad/{issue-number}-{slug}
   gh pr ready
   ```

6. **合并到 dev 后：**
   ```bash
   git checkout dev
   git pull origin dev
   git branch -d squad/{issue-number}-{slug}
   git push origin --delete squad/{issue-number}-{slug}
   ```

## 并行多 Issue 工作（Worktrees）

当协调器同时路由多个 issues 时（例如，"修复 bug X、Y 和 Z"），使用 `git worktree` 给每个智能体一个隔离的工作目录。无文件系统冲突，无分支切换开销。

### 何时使用 Worktrees vs 顺序

| 场景 | 策略 |
|----------|----------|
| 单个 issue | 上述标准工作流 —— 无需 worktree |
| 同一仓库中 2+ 同时 issues | Worktrees —— 每个 issue 一个 |
| 跨越多个仓库的工作 | 作为兄弟的单独克隆（见下面的多仓库） |

### 设置

从主克隆（必须在 dev 或任何分支上）：

```bash
# 确保 dev 是最新的
git fetch origin dev

# 为每个 issue 创建 worktree —— 主克隆的兄弟
git worktree add ../squad-195 -b squad/195-fix-stamp-bug origin/dev
git worktree add ../squad-193 -b squad/193-refactor-loader origin/dev
```

**命名约定：** `../{repo-name}-{issue-number}`（例如 `../squad-195`、`../squad-pr-42`）。

每个 worktree：
- 有自己的工作目录和索引
- 在自己的 `squad/{issue-number}-{slug}` 分支上，从 dev 分出
- 共享相同的 `.git` 对象存储（磁盘高效）

### 每个 Worktree 的智能体工作流

每个智能体在其 worktree 内完全像单 issue 工作流一样操作：

```bash
cd ../squad-195

# 正常工作 —— 提交、测试、推送
git add -A && git commit -m "fix: stamp bug (#195)"
git push -u origin squad/195-fix-stamp-bug

# 创建针对 dev 的 PR
gh pr create --base dev --title "fix: stamp bug" --body "Closes #195" --draft
```

所有 PR 独立针对 `dev`。智能体永远不会相互干扰对方的文件系统。

### Worktrees 中的 .squad/ 状态

`.squad/` 目录在每个 worktree 中作为副本存在。这是安全的，因为：
- `.gitattributes` 在仅限追加的文件（history.md、decisions.md、logs）上声明 `merge=union`
- 每个智能体追加到自己的部分；合并时在 PR 合并到 dev 时进行联合合并协调
- **规则：** 永不在 worktree 中重写或重新排序 `.squad/` 文件 —— 仅限追加

### 合并后清理

在 worktree 的 PR 合并到 dev 后：

```bash
# 从主克隆
git worktree remove ../squad-195
git worktree prune          # 清理过时的元数据
git branch -d squad/195-fix-stamp-bug
git push origin --delete squad/195-fix-stamp-bug
```

如果 worktree 被手动删除（rm -rf），`git worktree prune` 会恢复状态。

---

## 多仓库下游场景

当工作跨越多个仓库时（例如，squad-cli 更改需要 squad-sdk 更改，或用户的应用依赖 squad）：

### 设置

将下游仓库克隆为主仓库的兄弟：

```
~/work/
  squad-pr/          # 主仓库
  squad-sdk/         # 下游依赖
  user-app/          # 消费者项目
```

每个仓库获得自己的 issue 分支，遵循自己的命名约定。如果下游仓库也使用 Squad 约定，使用 `squad/{issue-number}-{slug}`。

### 协调的 PRs

- 在每个仓库独立创建 PR
- 在 PR 描述中链接它们：
  ```
  Closes #42

  **依赖于：** squad-sdk PR #17（此功能需要的 squad-sdk 更改）
  ```
- 合并顺序：依赖项先（例如 squad-sdk），然后依赖方（例如 squad-cli）

### 测试的本地链接

在推送之前，验证跨仓库更改一起工作：

```bash
# Node.js / npm
cd ../squad-sdk && npm link
cd ../squad-pr && npm link squad-sdk

# Go
# 在 go.mod 中使用 replace 指令：
# replace github.com/org/squad-sdk => ../squad-sdk

# Python
cd ../squad-sdk && pip install -e .
```

**重要：** 提交前移除本地链接。`npm link` 和 `go replace` 仅用于开发 —— CI 必须使用发布的包或 PR 特定的引用。

### Worktrees + 多仓库

这些自然组合。你可以有：
- 主仓库中的多个 worktrees（并行 issues）
- 下游仓库的单独克隆
- 每种组合独立运行

---

## 反模式

- ❌ 从 main 分支（从 dev 分支）
- ❌ PR 直接针对 main（针对 dev）
- ❌ 不符合规范的分支名称（必须是 squad/{number}-{slug}）
- ❌ 直接提交到 main 或 dev（使用 PR）
- ❌ worktrees 激活时在主克隆中切换分支（改用 worktrees）
- ❌ 对跨仓库工作使用 worktrees（使用单独克隆）
- ❌ PR 合并后留下陈旧的 worktrees（立即清理）

## 晋升管道

- dev → insiders：绿色构建时自动同步
- dev → main：准备好稳定发布时手动合并，然后标记
- 热修复：从 main 分支为 `hotfix/{slug}`，PR 到 dev，如果紧急 cherry-pick 到 main
