# 为 Squad 做贡献

欢迎参与 Squad 开发。本指南介绍如何构建、测试和贡献代码。

## 前置要求

- **Node.js** ≥20.0.0
- **npm** ≥10.0.0（用于工作区支持）
- **Git** 并配置 SSH agent（用于包解析）
- **gh CLI**（用于 GitHub 集成测试）

## Monorepo 结构

Squad 是一个 npm 工作区 monorepo，包含两个包：

```
squad/
├── packages/squad-cli/       # CLI 工具 (@bradygaster/squad-cli)
├── packages/squad-sdk/       # 运行时 SDK (@bradygaster/squad-sdk)
├── src/                      # 旧版 CLI 代码（正在迁移到 packages/）
├── dist/                     # 编译输出
├── .squad/                   # 团队状态和智能体历史
├── docs/                     # 文档和提案
└── test-fixtures/            # 测试数据
```

### 包独立性

- **squad-sdk**：核心运行时、智能体编排、工具注册表。无 CLI 依赖。
- **squad-cli**：命令行界面。依赖 squad-sdk。

每个包通过 changesets 进行独立版本管理。对 squad-sdk 的更改可能只提升 squad-sdk 的版本；对 CLI 的更改只提升 squad-cli 的版本。

## 开始使用

### 1. 克隆并安装

**第一步：在 GitHub 上 Fork 仓库**

访问 https://github.com/bradygaster/squad 并点击 "Fork" 创建你自己的副本。

**第二步：克隆你的 Fork**

```bash
git clone git@github.com:{你的用户名}/squad.git
cd squad
```

**第三步：添加上游远程仓库**

```bash
git remote add upstream git@github.com:bradygaster/squad.git
```

**第四步：获取 dev 分支**

```bash
git fetch upstream dev
```

**第五步：安装依赖**

```bash
npm install
```

npm 工作区会自动链接本地包。`@bradygaster/squad-cli` 可以在不发布的情况下从 `@bradygaster/squad-sdk` 导入。

### 2. 构建

```bash
# 将 TypeScript 编译到 dist/
npm run build

# 构建并打包 CLI（包含 esbuild）
npm run build:cli

# 监听模式（变更时自动重新编译）
npm run dev
```

### 3. 测试

```bash
# 运行所有测试（Vitest）
npm test

# 监听模式
npm run test:watch
```

### 4. 代码检查

```bash
# 仅类型检查（不生成文件）
npm run lint
```

### 5. 保持 Fork 同步

在打开或更新 PR 之前，将你的分支 rebase 到最新的上游 dev 分支：

```bash
git fetch upstream
git rebase upstream/dev
git push origin your-branch --force-with-lease
```

在打开或更新 PR 之前始终进行 rebase，以确保你的更改基于最新的集成分支。

## 开发工作流

### 创建功能分支

遵循 `.squad/decisions.md` 中的分支命名约定：

```bash
# 面向用户的工作，使用 user_name/issue-number-slug 格式
git checkout -b bradygaster/217-readme-help-update
# 或
git checkout -b keaton/210-resolution-api

# 团队内部工作，使用 agent_name/issue-number-slug
git checkout -b mcmanus/documentation
git checkout -b edie/refactor-router
```

### 提交前

1. **编译：** `npm run build`（或 `npm run dev` 监听模式）
2. **测试：** `npm test`
3. **类型检查：** `npm run lint`

提交前所有检查必须通过。

### 提交信息格式

保持信息清晰简洁。引用 issue 编号：

```
变更的简要描述

如需可添加更详细的说明。引用 #210、#217 等。

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

所有提交都必须包含 Co-authored-by 署名（由 Copilot CLI 添加）。

### 拉取请求流程

1. 添加 changeset：`npx changeset add`（PR 合并前必需 —— 参见 Changesets 部分）
2. 推送你的分支：`git push origin {你的用户名}/217-readme-help-update`
3. 创建 PR，明确指定 base 和 head：`gh pr create --base dev --repo bradygaster/squad --head {你的用户名}:your-branch`
4. 关联 issue：在 PR 描述中添加 `Closes #217`
5. 等待 CI 检查通过
6. 向团队请求审查（智能体会通过评论响应）

## 代码风格与约定

Squad 遵循严格的 TypeScript 约定：

- **类型安全：** `strict: true`、`noUncheckedIndexedAccess: true`
- **禁止使用 `@ts-ignore`** —— 如果存在类型错误，修复代码
- **仅 ESM** —— 不使用 CommonJS，不分发包
- **Async/await** —— 对流使用异步迭代器
- **错误处理：** 使用 `fatal()`、`error()`、`warn()`、`info()` 的结构化错误
- **文档中不要夸大** —— 仅陈述事实，有据可查的声明（语调上限）

## 文档

- **README.md** —— 面向用户的指南、快速开始、架构概述
- **CONTRIBUTING.md** —— 本文件
- **docs/proposals/** —— 重大变更的设计文档（代码之前必需）
- **.squad/agents/[name]/history.md** —— 智能体学习和项目上下文

v1 中的所有文档**仅限内部**。v2 之前没有公共文档站点。

## 本地开发版本控制

在本地开发 Squad 时，将包版本设置为 `{next-version}-preview`。例如，如果最后一个发布的版本是 `0.8.5.1`，本地开发版本应该是 `0.8.6-preview`。

此约定使 `squad version` 在本地显示预览标签，清楚地表明你正在运行未发布的源代码，而不是已发布的 npm 包。发布智能体将在发布时将其提升到最终版本，然后立即回到下一个预览版本以继续开发。

### 使 `squad` 命令使用你的本地构建

要使 `squad` CLI 命令全局可用并指向你的本地开发构建：

```bash
npm run build -w packages/squad-sdk && npm run build -w packages/squad-cli
npm link -w packages/squad-cli
```

此后，`squad version` 将显示 `0.8.6-preview`（或当前预览版本）。当你进行代码更改并重新构建时，`squad` 命令会自动获取更改——无需重新安装。要验证你的本地构建是否处于活动状态，版本输出应包含 `-preview` 标签。

要恢复到全局安装的 npm 包版本，请运行：

```bash
npm unlink -w packages/squad-cli
```

## Changesets：独立版本管理

Squad 使用 [@changesets/cli](https://github.com/changesets/changesets) 进行独立包版本管理。

### 添加 Changeset

在你的 PR 被合并之前，添加一个描述你更改的 changeset：

```bash
npx changeset add
```

这将提示：
1. 哪些包发生了更改？（squad-sdk、squad-cli 或两者）
2. 什么类型？（patch、minor、major）
3. 变更的简要摘要

在 `.changeset/` 中创建一个文件，随你的 PR 一起合并。

### Changeset 示例

```markdown
---
"@bradygaster/squad-sdk": patch
"@bradygaster/squad-cli": patch
---

更新帮助文本和 README 以进行 npm 分发。将 squad status 命令添加到文档。
```

### 发布工作流

团队在 `dev` 分支上运行 changesets（通过 GitHub Actions）：

```bash
npx changeset publish
```

这将：
1. 提升 `package.json` 中的版本
2. 生成 `CHANGELOG.md` 条目
3. 发布到 npm
4. 创建 GitHub 发布

你无需手动管理版本 —— changesets 会处理。

## 分支策略

- **main** —— 稳定、已发布的版本。所有合并都包含 changesets。
- **insider** —— 预发布功能、边缘情况。将发布标记为 `@insider`。
- **bradygaster/dev** —— 集成分支。**来自 Fork 的所有 PR 必须针对此分支**，而不是 `main`。
- **user/issue-slug** —— 来自用户或智能体的功能分支。

## 持续集成

GitHub Actions 在每次推送时运行：

1. **构建：** `npm run build` 和 `npm run build:cli`
2. **测试：** `npm test`
3. **代码检查：** `npm run lint`
4. **Changeset 状态：** `npm run changeset:check`（确保 PR 包含 changeset）

所有检查必须在合并前通过。

## 常见任务

### 添加 CLI 命令

1. 在 `src/cli/commands/[name].js` 中创建命令文件
2. 在 `src/index.ts` 中添加路由（`main()` 函数）
3. 在 `--help` 处理程序中更新帮助文本
4. 在 `test/cli/commands/[name].test.ts` 中添加测试
5. 在 README.md 中记录

### 添加 SDK 导出

1. 在 `src/[module]/` 中实现功能
2. 从 `src/index.ts` 导出
3. 添加测试
4. 在 README.md 的 SDK 部分记录

### 迁移旧代码

`src/` 目录包含正在迁移到 `packages/squad-cli/` 和 `packages/squad-sdk/` 的旧代码。移动代码时：

1. 在目标包中创建新文件
2. 更新两处的导入
3. 确保测试随文件一起移动
4. 所有引用更新后删除旧的 `src/` 文件
5. 在 `.squad/agents/[name]/history.md` 中记录迁移

## 关键文件

- **src/index.ts** —— CLI 入口点和路由
- **src/resolution.ts** —— Squad 路径解析（仓库 vs 全局）
- **.squad/decisions.md** —— 团队决策和约定
- **.squad/agents/[name]/charter.md** —— 智能体身份和专长
- **package.json** —— 工作区和脚本定义

## 有问题？

打开 issue 或在 `.squad/` 讨论频道中提问。团队随时为你提供帮助。

## 许可证

所有贡献均采用 MIT 许可证。通过提交 PR，你同意此许可证。
