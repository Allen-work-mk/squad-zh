# 选择你的界面

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

Squad 跨多个界面工作。选择适合你工作流的。

---

## 试试这个：

```bash
# 与你的 squad 日常工作
copilot --agent squad

# 设置和诊断
squad init
squad doctor
```

---

## 使用 Squad 的方式有哪些？

Squad 在多种模式和多个平台上运行：

### GitHub Copilot CLI (`copilot` 命令)

对话式终端界面。由 GitHub Copilot CLI 提供支持，这是日常使用 Squad 的推荐方式。

```bash
copilot --agent squad
```

读取 `.squad/` 并使用 `squad.agent.md` 协调你的团队。完整功能集 —— 子智能体生成、每次生成模型选择、后台执行、SQL 工具、并行展开。

### VS Code（编辑器中的 GitHub Copilot）

Squad 通过 GitHub Copilot 在 VS Code 中完全相同地工作。相同的 `.squad/` 目录、相同的智能体、相同的决策。完整的文件访问、并行执行、MCP 工具继承。详情参见 [VS Code 中的 Squad](../features/vscode.md)。

### Squad CLI (`squad` 命令)

Squad CLI 提供设置、诊断和自动化命令。不是对话式的 —— 将此用于安装、验证和操作任务。

```bash
# 设置
squad init

# 验证
squad doctor

# 监控
squad watch

# 可观测性
squad aspire
```

所有命令参见 [CLI 参考](../reference/cli.md)。

### 交互式 shell (`squad start` / `squad shell`)

通过 Squad CLI 直接进行对话式交互的 REPL 模式。输入无参数的 `squad` 启动持久 shell 会话。参见 [交互式 Shell 指南](../guide/shell.md)。

这有效，但 **推荐使用 GitHub Copilot CLI** —— 更丰富的智能体体验、更好的工具、完整的 MCP 集成。

### SDK (`@bradygaster/squad-sdk`)

用于在 Squad 之上构建工具的编程访问。类型化 API、路由配置、智能体生命周期钩子。

```bash
npm install @bradygaster/squad-sdk
```

```typescript
import { resolveSquad, loadConfig, SquadCoordinator } from '@bradygaster/squad-sdk';
```

完整 API 参见 [SDK 参考](../reference/sdk.md)。

### Copilot Coding Agent (`@copilot`)

自治 GitHub 机器人，获取标记的 issues 并打开草稿 PR。无需人工干预即可在整个组织内工作。Issue 被标记 → 智能体获取 → PR 被打开 → 人工评审。

设置参见 [Copilot Coding Agent](../features/copilot-coding-agent.md)。

---

## 我应该使用哪个？

| 你想... | 使用 | 原因 |
|----------------|-----|-----|
| **与你的 squad 日常工作** | **GitHub Copilot CLI** 或 **VS Code** | 对话式界面、完整的智能体生成、并行执行。与团队协作最自然的方式。 |
| **在新仓库中设置 Squad** | **Squad CLI** (`squad init`) | 一个命令初始化 `.squad/` 目录和所有配置。 |
| **检查 Squad 是否工作** | **Squad CLI** (`squad doctor`) | 验证目录结构、智能体、配置完整性。 |
| **24/7 监控工作** | **Squad CLI** (`squad watch`) | 对新 issues 的持续轮询、自动分流、智能体分配。 |
| **查看 OpenTelemetry 追踪** | **Squad CLI** (`squad aspire`) | 启动 Aspire 仪表板进行可观测性。 |
| **自治处理 issues** | **Copilot Coding Agent** | GitHub Actions 工作流监视标记的 issues 并分派 `@copilot`。 |
| **在 Squad 之上构建工具** | **SDK** | 类型化 API、配置加载、智能体生命周期钩子。 |

---

## 功能可用性矩阵

不是每个功能在所有地方都有效。以下是各处的可用情况：

| 功能 | GitHub Copilot CLI | VS Code | Squad CLI | SDK |
|---------|:------------------:|:-------:|:---------:|:---:| |
| 智能体生成 | ✅ | ✅ | ✅（通过 shell） | ✅ |
| Ralph / 工作监控 | ✅ | ✅ | ✅ (`squad watch`) | ✅ |
| 每次生成模型选择 | ✅ | ⚠️（仅会话模型） | ✅ | ✅ |
| 后台执行 | ✅ | ⚠️（并行同步） | ✅ | ✅ |
| SQL 工具 | ✅ | ❌ | ✅ | ✅ |
| Aspire 仪表板 | ❌ | ❌ | ✅ | ❌ |
| `squad doctor` 诊断 | ❌ | ❌ | ✅ | ✅ |
| Issue 分配给 `@copilot` | ❌ | ❌ | ✅（设置） | ❌ |

**图例：**
- ✅ 完全支持
- ⚠️ 有限或受限
- ❌ 不可用

有关 VS Code 约束和 CLI 一致性的详细分解，参见 [客户端兼容性矩阵](../scenarios/client-compatibility.md)。

---

## 常见工作流

### "我所有事情都使用 GitHub Copilot CLI"

```bash
# 终端 1：与 Squad 一起工作
copilot --agent squad

# 让 Squad 在需要时调用 `squad` 命令（doctor、watch、aspire）
```

这是推荐的工作流。CLI 在需要时自动调用 Squad CLI 命令。

### "我在一个终端运行 squad watch，在另一个使用 GitHub Copilot CLI"

```bash
# 终端 1：监控（持久）
squad watch --interval 10

# 终端 2：与 Squad 一起工作
copilot --agent squad
```

在后台保持 Ralph 监控 issues，同时你进行对话式工作。

### "我使用带 Copilot 的 VS Code 编码，使用 Squad CLI 设置"

```bash
# 一次性设置
squad init
squad doctor

# 打开 VS Code，从智能体选择器中选择 Squad
# 相同的 .squad/ 目录，相同的团队
```

使用 CLI 初始化，在 VS Code 中工作。

---

## 另请参阅

- [安装](installation.md) —— 安装 Squad CLI、SDK 或在 VS Code 中使用
- [首次会话](first-session.md) —— 开始你的第一次 Squad 对话
- [客户端兼容性矩阵](../scenarios/client-compatibility.md) —— 跨平台的完整功能比较
- [CLI 参考](../reference/cli.md) —— 所有 Squad CLI 命令
- [VS Code 中的 Squad](../features/vscode.md) —— VS Code 特定指南
- [SDK 参考](../reference/sdk.md) —— 编程 API
