# 发布手册

这份动态手册记录如何向 npm 发布 Squad 版本。尽可能遵循推荐的 CI 路径；仅在紧急情况下使用手动发布作为后备方案。

## 概述

Squad 发布两个 npm 包：
- `@bradygaster/squad-sdk` —— 核心 SDK
- `@bradygaster/squad-cli` —— CLI 工具（依赖 SDK）

**包顺序很重要：** 始终先发布 SDK，然后发布 CLI。CLI 声明对 SDK 的版本范围依赖，npm 注册表需要时间在 CLI 可以安全引用之前传播 SDK。

存在两个发布渠道：
- **稳定版：** 由 GitHub Release 触发（推荐路径）
- **内测版：** 由推送到 `insider` 分支触发（用于测试预发布构建）

## 飞行前检查清单

在任何发布尝试之前完成以下检查：

- [ ] 所有测试通过：`npm test`（预期 3,900+ 个测试）
- [ ] 任何 `packages/*/package.json` 中没有 `file:` 引用
  - 检查：`grep -r "file:" packages/*/package.json` 应该返回空
- [ ] 所有 `package.json` 版本使用有效的 semver（发布版本没有 `-preview` 后缀）
  - 发布版本：`1.2.3`
  - 预发布版本：`1.2.3-preview.1`
- [ ] `packages/squad-cli/package.json` 中的 SDK 依赖是版本范围，而不是 `file:../squad-sdk`
  - 有效示例：`"@bradygaster/squad-sdk": "^0.9.2"`
- [ ] 构建成功：`npm run build`（无 TypeScript 错误）
- [ ] 包验证通过：
  ```bash
  npm -w packages/squad-sdk pack --dry-run
  npm -w packages/squad-cli pack --dry-run
  ```
- [ ] Git 标签与版本匹配：`git tag` 显示 `v<版本>`
- [ ] `CHANGELOG.md` 已为此版本更新
- [ ] GitHub Release 草稿已创建并包含说明

## 通过 CI 发布（推荐路径）

**这是所有版本的标准路径。**

### 步骤

1. 在 GitHub UI 中，转到 **Releases** → **Draft**
2. 完善发布说明并点击 **Publish Release**
3. 这将自动触发 `squad-npm-publish.yml`

### 工作流的作用

工作流按顺序运行四个任务：

1. **预检** —— 验证不存在 `file:` 依赖
2. **冒烟测试** —— 运行 `npm pack --dry-run` 和 CLI 集成测试
3. **发布 SDK** —— 使用来源证明发布 `@bradygaster/squad-sdk`
4. **发布 CLI** —— 等待 SDK 成功后，发布 `@bradygaster/squad-cli`

每个发布步骤：
- 验证版本与发布标签匹配
- 使用 `npm -w packages/<pkg> publish --access public --provenance`
- 最多重试 5 次注册表验证（15 秒间隔）以考虑传播延迟

### 监控工作流

转到 **Actions** → **Squad npm Publish** → 选择最新运行。所有任务必须通过。如果任何任务失败，请参阅下面的"故障排除"。

## 通过 workflow_dispatch 发布（手动触发）

**当你需要重新发布而不创建新的 GitHub Release 时使用此选项。**

### 步骤

1. 转到 **Actions** → **Squad npm Publish**
2. 点击 **Run workflow**
3. 输入版本字符串（例如 `0.9.2`）
4. 点击 **Run workflow**

与上述相同的工作流运行。在短暂的 npm 注册表问题后使用此选项重试。

## 内测渠道

**仅用于预发布测试。**

推送到 `insider` 分支自动触发 `squad-insider-publish.yml`，它会：
- 使用 `--tag insider` 发布 SDK 和 CLI
- 跳过预检任务（内测构建可能有实验性依赖）
- 使用 `insider` 标签而不是 `latest`

使用以下命令安装内测构建：
```bash
npm install -g @bradygaster/squad-cli@insider
```

用户默认看到最新的 `latest` 标签；他们明确选择加入 `insider`。

## 工作区发布策略

**永远不要从仓库根目录使用 `npm publish`。**

在没有工作区范围的情况下使用 `npm publish` 会发布根 `package.json` 而不是预期的包。这会破坏一切。

**始终使用：**
```bash
npm -w packages/squad-sdk publish --access public
npm -w packages/squad-cli publish --access public
```

CI 工作流通过 lint 规则自动强制执行此操作。如果你向工作流添加任何发布步骤，它将在 CI 门禁处被捕获。

有关此策略的更多详情，请参阅 `.github/workflows/squad-ci.yml` → `publish-policy` 任务。

## 手动本地发布（紧急后备）

**仅在 CI 损坏且你必须立即发布时使用此选项。**

前置条件：
- 已完成 `npm login`（或设置了来自 npmjs.com 的 token 的 `NPM_TOKEN` 环境变量）
- 本地构建成功：`npm run build`
- 飞行前检查清单通过

### 步骤

1. 安装依赖并构建：
   ```bash
   npm ci && npm run build
   ```

2. 手动运行飞行前检查清单（上文）

3. 发布 SDK：
   ```bash
   cd packages/squad-sdk
   npm publish --access public --otp=<代码>
   cd ../..
   ```
   将 `<代码>` 替换为你认证器应用中的 2FA 代码。

4. 验证 SDK 已上线（等待最多 60 秒以使注册表传播）：
   ```bash
   npm view @bradygaster/squad-sdk@<版本> version
   ```

5. 发布 CLI：
   ```bash
   cd packages/squad-cli
   npm publish --access public --otp=<代码>
   cd ../..
   ```

6. 验证 CLI 已上线：
   ```bash
   npm view @bradygaster/squad-cli@<版本> version
   ```

### 关键规则

**始终先发布 SDK 再发布 CLI。** CLI 声明对 SDK 的依赖，npm 需要 SDK 版本存在于注册表中。

### 如果 SDK 成功但 CLI 失败

不要取消发布 SDK。修复 CLI 问题并重新发布 CLI。两个版本已经递增；重新运行发布是安全的。

## 422 竞争条件和 npm 错误

在 v0.9.1 发布期间，npm 返回 422 错误（"版本已存在"），即使该版本尚未发布。这是由混淆版本检查的 `file:` 依赖引起的。

### 错误：422 "版本已存在"

**首先，验证包是否实际已发布：**
```bash
npm view @bradygaster/squad-<pkg>@<版本> version
```

- **如果 npm 返回版本：** 发布成功了。422 是竞争条件。继续。
- **如果 npm 返回 "404 Not Found"：** 发布失败。提升版本，修复根本问题，然后重新发布。

### 错误：403 "Forbidden"

你的 `NPM_TOKEN` 已过期或丢失。在 npmjs.com → **Access Tokens** → **Generate New Token**（Automation，无过期时间）重新生成。

### 错误：ETARGET "无匹配版本"

你发布了 SDK，但 CLI 在注册表中找不到 SDK 版本。**等待 60 秒**然后重试。CI 工作流自动重试 5 次，间隔 15 秒。

### npm 注册表传播

npm 需要 15-60 秒将新包版本传播到所有边缘缓存。CI 工作流通过重试逻辑考虑到了这一点。如果手动发布，等待后重试 CLI 发布。

## 发布后验证

发布完成后（通过 CI 或手动），验证两个包都已上线：

```bash
npm view @bradygaster/squad-sdk@<版本> version
npm view @bradygaster/squad-cli@<版本> version
npx @bradygaster/squad-cli@<版本> --version
```

第三条命令会全新安装并从 npm 测试 CLI。这确认了构建、打包和 CLI 入口点都正常工作。

检查 GitHub Releases 并确认该版本被标记为 **Latest**。

## 发布后版本提升

稳定发布后，提升仓库版本以继续开发：

1. 将所有 `package.json` 文件更新到下一个预览版本：
   - `package.json`（根目录）
   - `packages/squad-sdk/package.json`
   - `packages/squad-cli/package.json`
   - 格式：`<主版本>.<次版本>.<补丁+1>-preview.1`

2. 提交到 dev 分支（不是 main）：
   ```bash
   git add package.json packages/squad-sdk/package.json packages/squad-cli/package.json
   git commit -m "chore: 提升到下一个预览版本"
   git push origin dev
   ```

示例：如果你刚刚发布了 `0.9.2`，提升到 `0.9.3-preview.1`。

## 旧版发布脚本（已弃用）

仓库包含版本特定的发布脚本：
- `publish-0.8.21.ps1`
- `publish-0.8.22.ps1`
- `publish-0.9.1.ps1`

这些脚本**已弃用。**它们是版本特定的，不再维护。

**不要创建新的版本特定发布脚本。** CI 工作流是标准路径。现有脚本可能在未来的清理中被删除。
