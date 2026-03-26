---
name: "ci-validation-gates"
description: "防御性 CI/CD 模式：semver 验证、令牌检查、重试逻辑、草稿检测 —— 来自 v0.8.22"
domain: "ci-cd"
confidence: "high"
source: "从 Drucker 和 Trejo charter 中提取 —— 来自 v0.8.22 发布事件的 earned 知识"
---

## 上下文

CI 工作流必须是防御性的。这些模式是从 v0.8.22 发布灾难中学到的，其中无效的 semver、错误的令牌类型、缺失的重试逻辑和草稿发布导致了数小时的中断。Drucker（CI/CD）和 Trejo（发布经理）都在他们的 charter 中携带了这些知识 —— 现在集中在这里。

## 模式

### Semver 验证门禁
每个发布工作流在 `npm publish` 之前必须验证版本格式。4 部分版本（例如 0.8.21.4）不是有效的 semver —— npm 会损坏它们。

```yaml
- name: 验证 semver
  run: |
    VERSION="${{ github.event.release.tag_name }}"
    VERSION="${VERSION#v}"
    if ! npx semver "$VERSION" > /dev/null 2>&1; then
      echo "❌ 无效的 semver: $VERSION"
      echo "只有 3 部分版本（X.Y.Z）或预发布（X.Y.Z-tag.N）是有效的。"
      exit 1
    fi
    echo "✅ 有效的 semver: $VERSION"
```

### NPM 令牌类型验证
NPM_TOKEN 必须是 Automation 令牌，不是带 2FA 的 User 令牌：
- User 令牌需要 OTP —— CI 无法提供它 → EOTP 错误
- 在 npmjs.com → Settings → Access Tokens → Automation 创建 Automation 令牌
- 在任何工作流中首次发布前验证

### npm 注册表传播的重试逻辑
npm 注册表使用最终一致性。`npm publish` 成功后，包可能无法立即查询。
- 传播：通常 5-30 秒，罕见情况下长达 2 分钟
- 所有验证步骤：5 次尝试，15 秒间隔
- 记录每次尝试："尝试 1/5：检查包..."
- 成功时退出循环，最大尝试后失败

```yaml
- name: 验证包（带重试）
  run: |
    MAX_ATTEMPTS=5
    WAIT_SECONDS=15
    for attempt in $(seq 1 $MAX_ATTEMPTS); do
      echo "尝试 $attempt/$MAX_ATTEMPTS：检查 $PACKAGE@$VERSION..."
      if npm view "$PACKAGE@$VERSION" version > /dev/null 2>&1; then
        echo "✅ 包已验证"
        exit 0
      fi
      [ $attempt -lt $MAX_ATTEMPTS ] && sleep $WAIT_SECONDS
    done
    echo "❌ $MAX_ATTEMPTS 次尝试后无法验证"
    exit 1
```

### 草稿发布检测
草稿发布不会发出 `release: published` 事件。工作流必须：
- 在 `release: published` 上触发（不是 `created`）
- 如果使用 workflow_dispatch：通过 GitHub API 验证发布已发布再继续

### 构建脚本保护
在任何发布构建之前设置 `SKIP_BUILD_BUMP=1`（或在 Windows 上 `$env:SKIP_BUILD_BUMP = "1"`）。bump-build.mjs 仅用于开发构建 —— 它静默变异版本。

## 已知故障模式（v0.8.22 事件）

| # | 发生了什么 | 根本原因 | 预防 |
|---|---------------|-----------|------------|
| 1 | 发布了 4 部分版本，npm 损坏它 | 没有 semver 验证门禁 | 每次发布前的 `npx semver` 检查 |
| 2 | CI 失败 5+ 次，出现 EOTP | 带 2FA 的 User 令牌 | 仅 Automation 令牌 |
| 3 | 验证返回 false 404 | 没有传播的重试逻辑 | 5 次尝试，15 秒间隔 |
| 4 | 工作流从未触发 | 草稿发布不发出事件 | 永不创建草稿发布 |
| 5 | 发布期间版本变异 | bump-build.mjs 在发布中运行 | SKIP_BUILD_BUMP=1 |

## 反模式
- ❌ 没有 semver 验证门禁的发布
- ❌ 没有重试的单次验证
- ❌ 工作流中的硬编码密钥
- ❌ 静默 CI 失败 —— 每个错误都需要带有补救措施的可操作输出
- ❌ 假设 npm publish 可立即查询
