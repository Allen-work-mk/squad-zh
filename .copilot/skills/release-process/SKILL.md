---
name: "release-process"
description: "Squad 的逐步发布检查清单 —— 防止 v0.8.22 式灾难"
domain: "release-management"
confidence: "high"
source: "team-decision"
---

## 上下文

这是 Squad 的**权威发布运行手册**。诞生于 v0.8.22 发布灾难（4 部分 semver 被 npm 损坏、草稿发布从未触发发布、错误的 NPM_TOKEN 类型、6+ 小时的损坏 `latest` dist-tag）。

**规则：** 没有智能体在遵循此检查清单的情况下发布 Squad。没有例外。没有即兴发挥。

---

## 发布前验证

在开始任何发布工作之前，验证以下内容：

### 1. 版本号验证

**规则：** 只有 3 部分 semver（major.minor.patch）或预发布（major.minor.patch-tag.N）是有效的。4 部分版本（0.8.21.4）不是有效的 semver，npm 会损坏它们。

```bash
# 检查版本是否为有效 semver
node -p "require('semver').valid('0.8.22')"
# 输出：'0.8.22' = 有效
# 输出：null = 无效，停止

# 对于预发布版本
node -p "require('semver').valid('0.8.23-preview.1')"
# 输出：'0.8.23-preview.1' = 有效
```

**如果 `semver.valid()` 返回 `null`：** 停止。修复版本。不要继续。

### 2. NPM_TOKEN 验证

**规则：** NPM_TOKEN 必须是 **Automation 令牌**（不需要 2FA）。带 2FA 的 User 令牌将在 CI 中失败并出现 EOTP 错误。

```bash
# 检查令牌类型（需要 npm CLI 认证）
npm token list
```

查找：
- ✅ 不需要 2FA 的 `read-write` 令牌 = Automation 令牌（正确）
- ❌ 需要 OTP 的令牌 = User 令牌（错误，将在 CI 中失败）

**如何创建 Automation 令牌：**
1. 前往 npmjs.com → Settings → Access Tokens
2. 点击 "Generate New Token"
3. 选择 **"Automation"**（不是 "Publish"）
4. 复制令牌并保存为 GitHub 密钥：`NPM_TOKEN`

**如果使用 User 令牌：** 停止。首先创建 Automation 令牌。

### 3. 分支和标签状态

**规则：** 从 `main` 分支发布。确保干净状态，无未提交更改，来自 origin 的最新代码。

```bash
# 确保在 main 上且干净
git checkout main
git pull origin main
git status  # 应该显示："nothing to commit, working tree clean"

# 检查标签是否已存在
git tag -l "v0.8.22"
# 输出应该为空。如果标签存在，发布已完成或存在冲突。
```

**如果标签存在：** 停止。要么发布已完成，要么存在冲突。在继续之前调查。

### 4. 禁用 bump-build.mjs

**规则：** `bump-build.mjs` 仅用于开发构建。在发布构建期间不得运行（它递增构建号，创建 4 部分版本）。

```bash
# 设置环境变量以跳过 bump-build.mjs
export SKIP_BUILD_BUMP=1

# 验证已设置
echo $SKIP_BUILD_BUMP
# 输出：1
```

**对于 Windows PowerShell：**
```powershell
$env:SKIP_BUILD_BUMP = "1"
```

**如果未设置：** `bump-build.mjs` 将运行并变异版本。这会导致灾难（参见 v0.8.22）。

---

## 发布工作流

### 第 1 步：版本升级

以锁定步骤更新所有 3 个 package.json 文件中的版本（根目录 + 两个工作区）。

```bash
# 设置目标版本（无 'v' 前缀）
VERSION="0.8.22"

# 在继续之前验证它是有效 semver
node -p "require('semver').valid('$VERSION')"
# 必须输出版本字符串，不是 null

# 更新所有 3 个 package.json 文件
npm version $VERSION --workspaces --include-workspace-root --no-git-tag-version

# 验证所有 3 个匹配
grep '"version"' package.json packages/squad-sdk/package.json packages/squad-cli/package.json
# 所有 3 个都应该显示："version": "0.8.22"
```

**检查点：** 所有 3 个 package.json 文件具有相同版本。再次运行 `semver.valid()` 以确保。

### 第 2 步：提交和打标签

```bash
# 提交版本升级
git add package.json packages/squad-sdk/package.json packages/squad-cli/package.json
git commit -m "chore: bump version to $VERSION

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# 创建标签（带 'v' 前缀）
git tag -a "v$VERSION" -m "Release v$VERSION"

# 推送提交和标签
git push origin main
git push origin "v$VERSION"
```

**检查点：** 标签已创建并推送。用 `git tag -l "v$VERSION"` 验证。

### 第 3 步：创建 GitHub 发布

**关键：** 发布必须是 **已发布**，不是草稿。草稿发布不会触发 `publish.yml` 工作流。

```bash
# 创建 GitHub 发布（不是草稿）
gh release create "v$VERSION" \
  --title "v$VERSION" \
  --notes "Release notes go here" \
  --latest

# 验证发布是已发布（不是草稿）
gh release view "v$VERSION"
# 输出不应包含 "(draft)"
```

**如果输出包含 `(draft)`：** 停止。删除发布并在没有 `--draft` 标志的情况下重新创建。

```bash
# 如果你不小心创建了草稿，修复它：
gh release edit "v$VERSION" --draft=false
```

**检查点：** 发布已发布（不是草稿）。`release: published` 事件已触发并启动了 `publish.yml`。

### 第 4 步：监控工作流

`publish.yml` 工作流应在发布创建后 10 秒内自动启动。

```bash
# 监视工作流运行
gh run list --workflow=publish.yml --limit 1

# 获取详细状态
gh run view --log
```

**预期流程：**
1. `publish-sdk` 作业运行 → 发布 `@bradygaster/squad-sdk`
2. 验证步骤使用重试循环运行（最多 5 次尝试，15 秒间隔）以确认 SDK 在 npm 注册表上
3. `publish-cli` 作业运行 → 发布 `@bradygaster/squad-cli`
4. 验证步骤使用重试循环运行以确认 CLI 在 npm 注册表上

**如果工作流失败：** 检查日志。常见问题：
- EOTP 错误 = 错误的 NPM_TOKEN 类型（使用 Automation 令牌）
- 验证步骤超时 = npm 传播延迟（重试循环应处理此问题，但传播在罕见情况下可能需要长达 2 分钟）
- 版本不匹配 = package.json 版本与标签不匹配

**检查点：** 两个作业都成功。工作流显示绿色对勾。

### 第 5 步：验证 npm 发布

手动验证两个包都在 npm 上，带有正确的 `latest` dist-tag。

```bash
# 检查 SDK
npm view @bradygaster/squad-sdk version
# 输出：0.8.22

npm dist-tag ls @bradygaster/squad-sdk
# 输出应显示：latest: 0.8.22

# 检查 CLI
npm view @bradygaster/squad-cli version
# 输出：0.8.22

npm dist-tag ls @bradygaster/squad-cli
# 输出应显示：latest: 0.8.22
```

**如果版本不匹配：** 出了问题。检查工作流日志。在 npm 正确之前不要继续 GitHub 发布公告。

**检查点：** 两个包都显示正确版本。`latest` dist-tags 指向新版本。

### 第 6 步：测试安装

验证包可以从 npm 安装（真实世界的冒烟测试）。

```bash
# 创建临时目录
mkdir /tmp/squad-release-test && cd /tmp/squad-release-test

# 测试 SDK 安装
npm init -y
npm install @bradygaster/squad-sdk
node -p "require('@bradygaster/squad-sdk/package.json').version"
# 输出：0.8.22

# 测试 CLI 安装
npm install -g @bradygaster/squad-cli
squad --version
# 输出：0.8.22

# 清理
cd -
rm -rf /tmp/squad-release-test
```

**如果安装失败：** npm 注册表问题或包元数据损坏。在此工作之前不要宣布发布。

**检查点：** 两个包都干净安装。版本匹配。

### 第 7 步：将 dev 同步到下一个预览版

main 发布后，将 dev 同步到下一个预览版本。

```bash
# 检出 dev
git checkout dev
git pull origin dev

# 升级到下一个预览版本（例如，0.8.23-preview.1）
NEXT_VERSION="0.8.23-preview.1"

# 验证 semver
node -p "require('semver').valid('$NEXT_VERSION')"
# 必须输出版本字符串，不是 null

# 更新所有 3 个 package.json 文件
npm version $NEXT_VERSION --workspaces --include-workspace-root --no-git-tag-version

# 提交
git add package.json packages/squad-sdk/package.json packages/squad-cli/package.json
git commit -m "chore: bump dev to $NEXT_VERSION

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# 推送
git push origin dev
```

**检查点：** dev 分支现在显示下一个预览版本。未来的 dev 构建将发布到 `@preview` dist-tag。

---

## 手动发布（回退）

如果 `publish.yml` 工作流失败或需要绕过，使用 `workflow_dispatch` 手动触发发布。

```bash
# 触发手动发布
gh workflow run publish.yml -f version="0.8.22"

# 监视运行
gh run watch
```

**规则：** 仅当自动发布失败时使用。始终调查为什么自动化失败并为下次发布修复它。

---

## 回滚程序

如果发布已损坏需要回滚：

### 1. 从 npm 取消发布（核选项）

**警告：** npm 取消发布有时间限制（24 小时）并留下已烧毁的版本槽。仅在版本严重损坏时使用。

```bash
# 取消发布（需要 npm 所有者权限）
npm unpublish @bradygaster/squad-sdk@0.8.22
npm unpublish @bradygaster/squad-cli@0.8.22
```

### 2. 在 npm 上弃用（首选）

**首选方法：** 将版本标记为已弃用，发布热修复。

```bash
# 弃用损坏的版本
npm deprecate @bradygaster/squad-sdk@0.8.22 "Broken release, use 0.8.22.1 instead"
npm deprecate @bradygaster/squad-cli@0.8.22 "Broken release, use 0.8.22.1 instead"

# 发布热修复版本
# （使用版本 0.8.22.1 遵循此运行手册）
```

### 3. 删除 GitHub 发布和标签

```bash
# 删除 GitHub 发布
gh release delete "v0.8.22" --yes

# 删除本地和远程标签
git tag -d "v0.8.22"
git push origin --delete "v0.8.22"
```

### 4. 在 main 上恢复提交

```bash
# 恢复版本升级提交
git checkout main
git revert HEAD
git push origin main
```

**检查点：** 标签和发布已删除。main 分支已恢复。npm 包已弃用或未发布。

---

## 常见故障模式

### EOTP 错误（需要 npm OTP）

**症状：** 工作流失败并出现 `EOTP` 错误。  
**根本原因：** NPM_TOKEN 是启用了 2FA 的 User 令牌。CI 无法提供 OTP。  
**修复：** 将 NPM_TOKEN 替换为 Automation 令牌（无 2FA）。参见上面的 "NPM_TOKEN 验证"。

### 验证步骤 404（npm 传播延迟）

**症状：** 即使发布成功，验证步骤也失败并出现 404。  
**根本原因：** npm 注册表传播延迟（5-30 秒）。  
**修复：** 验证步骤现在有重试循环（5 次尝试，15 秒间隔）。应自动解决。如果没有，等待 2 分钟并重新运行工作流。

### 版本不匹配（package.json ≠ tag）

**症状：** 验证步骤失败并出现 "Package version (X) does not match target version (Y)"。  
**根本原因：** package.json 版本与标签版本不匹配。  
**修复：** 确保所有 3 个 package.json 文件在第 1 步中已更新。如果需要，重新运行 `npm version`。

### 4 部分版本被 npm 损坏

**症状：** npm 上发布的版本与 package.json 不匹配（例如，0.8.21.4 变成了 0.8.2-1.4）。  
**根本原因：** 4 部分版本不是有效的 semver。npm 的解析器误解它们。  
**修复：** 永远不要使用 4 部分版本。只有 3 部分（0.8.22）或预发布（0.8.23-preview.1）。在任何提交之前运行 `semver.valid()`。

### 草稿发布未触发工作流

**症状：** 发布已创建但 `publish.yml` 从未运行。  
**根本原因：** 发布被创建为草稿。草稿发布不会发出 `release: published` 事件。  
**修复：** 编辑发布并更改为已发布：`gh release edit "v$VERSION" --draft=false`。工作流应立即触发。

---

## 验证检查清单

在开始任何发布之前，确认：

- [ ] 版本是有效 semver：`node -p "require('semver').valid('VERSION')"` 返回版本字符串（不是 null）
- [ ] NPM_TOKEN 是 Automation 令牌（无 2FA）：`npm token list` 显示不带 OTP 要求的 `read-write`
- [ ] 分支是干净的：`git status` 显示 "nothing to commit, working tree clean"
- [ ] 标签不存在：`git tag -l "vVERSION"` 返回空
- [ ] `SKIP_BUILD_BUMP=1` 已设置：`echo $SKIP_BUILD_BUMP` 返回 `1`

在创建 GitHub 发布之前：

- [ ] 所有 3 个 package.json 文件具有匹配版本：`grep '"version"' package.json packages/*/package.json`
- [ ] 提交已推送：`git log origin/main..main` 返回空
- [ ] 标签已推送：`git ls-remote --tags origin vVERSION` 返回标签 SHA

在 GitHub 发布之后：

- [ ] 发布已发布（不是草稿）：`gh release view "vVERSION"` 输出不包含 "(draft)"
- [ ] 工作流正在运行：`gh run list --workflow=publish.yml --limit 1` 显示 "in_progress"

在工作流完成后：

- [ ] 两个作业都成功：工作流显示绿色对勾
- [ ] SDK 在 npm 上：`npm view @bradygaster/squad-sdk version` 返回正确版本
- [ ] CLI 在 npm 上：`npm view @bradygaster/squad-cli version` 返回正确版本
- [ ] `latest` 标签正确：`npm dist-tag ls @bradygaster/squad-sdk` 显示 `latest: VERSION`
- [ ] 包安装：`npm install @bradygaster/squad-cli` 成功

在 dev 同步后：

- [ ] dev 分支具有下一个预览版本：`git show dev:package.json | grep version` 显示下一个预览

---

## 事后分析参考

此技能是在 v0.8.22 发布灾难后创建的。完整回顾：`.squad/decisions/inbox/keaton-v0822-retrospective.md`

**关键教训：**
1. 没有运行手册的发布 = 即兴发挥 = 灾难
2. Semver 验证是强制性的 —— 4 部分版本破坏 npm
3. NPM_TOKEN 类型很重要 —— 带 2FA 的 User 令牌在 CI 中失败
4. 草稿发布是陷阱 —— 它们不会触发自动化
5. 重试逻辑是必要的 —— npm 传播需要时间

**永不再犯。**
