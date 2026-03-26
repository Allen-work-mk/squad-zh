---
name: "client-compatibility"
description: "CLI vs VS Code vs 其他界面的平台检测和自适应生成"
domain: "orchestration"
confidence: "high"
source: "extracted"
---

## 上下文

Squad 在多个 Copilot 界面上运行（CLI、VS Code、JetBrains、GitHub.com）。协调器必须检测其平台并相应调整生成行为。不同平台上有不同的工具可用，需要智能体生成、SQL 使用和响应时间的条件逻辑。

## 模式

### 平台检测

在生成智能体之前，通过检查可用工具确定平台：

1. **CLI 模式** —— `task` 工具可用 → 完整生成控制。使用带 `agent_type`、`mode`、`model`、`description`、`prompt` 参数的 `task`。通过 `read_agent` 收集结果。

2. **VS Code 模式** —— `runSubagent` 或 `agent` 工具可用 → 条件行为。使用带任务提示的 `runSubagent`。删除 `agent_type`、`mode` 和 `model` 参数。一轮中的多个子智能体并发运行（相当于后台模式）。结果自动返回 —— 无需 `read_agent`。

3. **回退模式** —— `task` 和 `runSubagent`/`agent` 都不可用 → 内联工作。不要道歉或解释限制。直接执行任务。

如果 `task` 和 `runSubagent` 都可用，优先使用 `task`（更丰富的参数表面）。

### VS Code 生成适配

在 VS Code 模式时，协调器以这些方式更改行为：

- **生成工具：** 使用 `runSubagent` 而不是 `task`。提示是唯一必需的参数 —— 传递完整的智能体提示（charter、身份、任务、卫生、响应顺序），完全像在 CLI 上一样。
- **并行性：** 在**单轮**中生成**所有**并发智能体。它们自动并行运行。这替代了 `mode: "background"` + `read_agent` 轮询。
- **模型选择：** 接受会话模型。不要尝试每次生成模型选择或回退链 —— 它们只在 CLI 上工作。在第 1 阶段，所有子智能体使用用户在 VS Code 模型选择器中选择的任何模型。
- **书记员：** 不能即发即弃。将书记员批处理为任何并行组中的**最后一个**子智能体。书记员是轻工作（仅文件操作），所以阻塞是可容忍的。
- **启动表：** 跳过它。结果随响应到达，不是分开的。到协调器说话时，工作已经完成。
- **`read_agent`：** 完全跳过。结果在子智能体完成时自动返回。
- **`agent_type`：** 删除它。所有 VS Code 子智能体默认具有完整工具访问权限。子智能体继承父级的工具。
- **`description`：** 删除它。智能体名称已经在提示中。
- **提示内容：** 保留所有提示结构 —— charter、身份、任务、卫生、响应顺序块与界面无关。

### 功能降级表

| 功能 | CLI | VS Code | 降级 |
|---------|-----|---------|-------------|
| 并行展开 | `mode: "background"` + `read_agent` | 一轮中的多个子智能体 | 无 —— 等效并发 |
| 模型选择 | 每次生成 `model` 参数（4层层次结构） | 仅会话模型（第1阶段） | 接受会话模型，记录意图 |
| 书记员即发即弃 | 后台，永不读取 | 同步，必须等待 | 与最后一组并行批处理 |
| 启动表 UX | 显示表 → 稍后结果 | 跳过表 → 结果随响应 | 仅 UX —— 结果是正确的 |
| SQL 工具 | 可用 | 不可用 | 避免 SQL 跨平台代码路径 |
| 响应顺序 bug | 关键变通 | 可能需要（未验证） | 保留块 —— 如果不必要无害 |

### SQL 工具警告

`sql` 工具是**仅 CLI**。它在 VS Code、JetBrains 或 GitHub.com 上不存在。任何依赖 SQL 的协调器逻辑或智能体工作流（待办跟踪、批处理、会话状态）在非 CLI 界面上将静默失败。跨平台代码路径不能依赖 SQL。对必须在任何地方工作的任何内容使用基于文件系统的状态（`.squad/` 文件）。

## 示例

**示例 1：CLI 并行生成**
```typescript
// 协调器检测 task 工具可用 → CLI 模式
task({ agent_type: "general-purpose", mode: "background", model: "claude-sonnet-4.5", ... })
task({ agent_type: "general-purpose", mode: "background", model: "claude-haiku-4.5", ... })
// 稍后：读取两者
```

**示例 2：VS Code 并行生成**
```typescript
// 协调器检测 runSubagent 可用 → VS Code 模式
runSubagent({ prompt: "...Fenster charter + task..." })
runSubagent({ prompt: "...Hockney charter + task..." })
runSubagent({ prompt: "...Scribe charter + task..." }) // 组中最后一个
// 结果自动返回，无需 read_agent
```

**示例 3：回退模式**
```typescript
// task 和 runSubagent 都不可用 → 内联工作
// 协调器直接执行任务而不生成
```

## 反模式

- ❌ 在跨平台工作流中使用 SQL 工具（在 VS Code/JetBrains/GitHub.com 上中断）
- ❌ 在 VS Code 上尝试每次生成模型选择（第 1 阶段 —— 只有会话模型有效）
- ❌ 在 VS Code 上即发即弃书记员（必须作为最后一个子智能体批处理）
- ❌ 在 VS Code 上显示启动表（结果已经内联）
- ❌ 向用户道歉或解释平台限制
- ❌ 只有 `runSubagent` 可用时使用 `task`
- ❌ 在非 CLI 平台上删除提示结构（charter/身份/任务）
