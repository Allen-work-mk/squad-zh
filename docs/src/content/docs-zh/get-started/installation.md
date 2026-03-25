# 安装

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

三种方式运行 Squad。选择适合你的。

---

## 试试这个：

```bash
npm install -g @bradygaster/squad-cli
squad
```

就这样。你已进入。

---

## 1. CLI（推荐）

CLI 是从任何终端使用 Squad 的最快方式。

### 全局安装

```bash
npm install -g @bradygaster/squad-cli
```

现在随处可用：

```bash
squad init
squad status
squad watch
```

### 使用 npx 一次性运行

无需安装 —— 直接运行最新版本：

```bash
npx @bradygaster/squad-cli init
npx @bradygaster/squad-cli status
```

### 验证

```bash
squad --version
```

### 更新

```bash
npm install -g @bradygaster/squad-cli@latest
```

---

## 我应该使用哪种方法？

根据你在做什么选择：

| **你想...** | **使用** | **原因** |
|--------------------|---------|---------|
| 快速尝试 Squad | 带 `npx` 的 **CLI** | 无需安装。运行 `npx @bradygaster/squad-cli init` 即可测试。 |
| 在所有项目中使用 Squad | 带 `--global` 的 **CLI** | 一次安装。随处工作。从任何终端运行 `squad`。 |
| 在 VS Code 中工作 | **VS Code**（只需打开项目） | 已经在使用 Copilot？Squad 直接可用。与 CLI 相同的 `.squad/` 目录。 |
| 在 Squad 之上构建工具 | **SDK** | 类型化 API、路由配置、智能体生命周期钩子。对一切的编程访问。 |

无法决定？→ 从 **CLI** 开始。你随时可以在以后添加 VS Code 或 SDK。你的 `.squad/` 目录在所有地方都完全相同地工作。

---

## 2. VS Code

Squad 通过 GitHub Copilot 在 VS Code 中工作。你的 `.squad/` 目录在 CLI 和 VS Code 中完全相同 —— 相同的智能体、相同的决策、相同的记忆。

> **提示：** 使用 CLI 初始化你的团队（`squad`），然后在 VS Code 中打开项目以继续使用相同的 squad。

---

## 3. SDK

在 Squad 之上构建自己的工具？将 SDK 安装为项目依赖：

```bash
npm install @bradygaster/squad-sdk
```

然后导入你需要的内容：

```typescript
import { defineConfig, loadConfig, resolveSquad } from '@bradygaster/squad-sdk';
```

SDK 为你提供类型化配置、路由、模型选择和完整的智能体生命周期 API。详情参见 [SDK 参考](../reference/sdk.md)。

---

### 个人 squad（跨项目）

想在所有项目中使用相同的智能体？

```bash
squad init --global
```

这会创建你的个人 squad 目录 —— 任何项目都可以继承的个人团队根目录。详情参见 [上游继承](../features/upstream-inheritance.md)。

**各平台的个人 squad 位置：**

| 平台 | 路径 |
|----------|------|
| Linux | `~/.config/squad/` |
| macOS | `~/Library/Application Support/squad/` |
| Windows | `%APPDATA%\squad\` |

---

## 首次设置

安装后，在你的项目中初始化 Squad：

```bash
cd your-project
squad init
```

这会创建：

```
.github/agents/squad.agent.md  —— 协调智能体
.squad/                        —— 团队状态目录
```

### 配置（可选）

对于类型化配置，在你的项目根目录创建 `squad.config.ts`：

```typescript
import { defineConfig } from '@bradygaster/squad-sdk';

export default defineConfig({
  team: {
    name: 'my-squad',
    root: '.squad',
    description: 'My project team',
  },
});
```

`defineConfig()` 给你完整的自动完成和验证。但入门时不需要它 —— Squad 开箱即用，带有合理的默认值。

---

## 故障排除

### `squad: command not found`

你的 npm 全局 bin 不在 PATH 中。修复：

```bash
# 检查是否已安装
npm list -g @bradygaster/squad-cli

# 如果已安装但未找到，检查 PATH：
echo $PATH | grep npm          # macOS/Linux
echo %PATH% | findstr npm      # Windows
```

### `Cannot find .squad/ directory`

在项目根目录运行 `squad init`，或对个人 squad 运行 `squad init --global`。

### CLI 和 SDK 之间的版本不匹配

同时更新两者：

```bash
npm install -g @bradygaster/squad-cli@latest
npm install @bradygaster/squad-sdk@latest
```

---

## 准备学习？

Squad 新手？查看 [**Tamir 的 Squad 技能工作坊**](https://github.com/tamirdresher/squad-skills/tree/main/workshop) 获取实践学习和实用模式。

---

## 下一步

→ [你的首次会话](first-session.md)
