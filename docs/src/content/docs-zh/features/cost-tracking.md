# Token 使用和成本跟踪

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

Squad 可以跟踪每次智能体生成的 token 使用情况和估计成本，按会话汇总数据，并通过编排日志、终端摘要和遥测后端展示。

---

## 概述

- Squad 跟踪每次智能体生成的 token 使用量（输入/输出 token）和估计成本
- 使用数据记录在编排日志中，可通过 `squad cost` CLI 获取
- 可以配置每个智能体或每个会话的可选预算限制

---

## 如何工作

- `CostTracker` 类（`packages/squad-sdk/src/runtime/cost-tracker.ts`）累积 token 数据
- 每个编排日志条目包含一个 **Token 使用** 行
- 当启用遥测时，发出 OTel 指标（`squad.tokens.input`、`squad.tokens.output`、`squad.tokens.cost`）

编排日志模板将使用情况存储在 markdown 表格行中，如下所示：

```md
| **Token 使用** | 12,450 入 / 3,200 出 —— $0.0234 |
```

---

## 查看成本

```bash
squad cost                 # 当前会话成本
squad cost --all           # 所有历史成本
squad cost --agent fenster # 特定智能体的成本
```

**示例输出：**

```text
=== Squad 成本摘要 ===
总输入 token：  12,450
总输出 token： 3,200
估计成本：      $0.0234

--- 按智能体 ---
  fenster: 12,450入 / 3,200出 ($0.0234) [1 轮, 模型: claude-sonnet-4.5]

--- 按会话 ---
  session-abc123: 12,450入 / 3,200出 ($0.0234) [1 轮]
```

---

## 预算配置

```typescript
import { defineSquad, defineAgent, defineBudget } from '@bradygaster/squad-sdk';

export default defineSquad({
  defaults: {
    budget: defineBudget({
      perAgentSpawn: 50000,
      perSession: 500000,
      warnAt: 0.8,
    }),
  },
  agents: [
    defineAgent({
      name: 'fenster',
      role: 'Core Dev',
      budget: defineBudget({ perAgentSpawn: 100000 }),
    }),
  ],
});
```

- `perAgentSpawn` 限制单个智能体调用
- `perSession` 限制协调器会话的总预算
