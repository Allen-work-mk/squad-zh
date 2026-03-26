---
name: history-hygiene
description: 将最终结果记录到 history.md，而不是中间请求或反转的决策
domain: documentation, team-collaboration
confidence: high
source: earned (Kobayashi v0.6.0 事件, team intervention)
---

## 上下文

History 文件（跟踪决策、生成、结果的 .md 文件）被未来的智能体冷读取。陈旧或不正确的条目会在下游毒化决策。Kobayashi 事件证明了这一点：history 说 "Brady 决定 v0.6.0"，而 Brady 已将其反转为 v0.8.17。未来的生成读取了错误的真相并重复了错误。

## 模式

- **记录最终结果**，不是初始请求。
- **等待确认**后再写入 history —— 不要记录中间状态。
- **如果决策反转**，立即更新条目 —— 不要留下陈旧数据。
- **一次读取 = 一个真相。** 未来的智能体应该永远不需要交叉引用其他文件来理解实际发生了什么。

## 示例

✓ **正确：**
- "迁移目标：v0.8.17（最初讨论为 v0.6.0，由 Brady 更正）"
- "根据 Brady 在 2024-01-15 的明确要求恢复为 Node 18"

✗ **错误：**
- "Brady 指导 v0.6.0"（当后来反转时）
- 记录*请求的*而不是*实际发生的*
- 在结果确认前记录条目

## 反模式

- 将中间或"暂时"状态写入磁盘
- 在没有确认最终方向的情况下归因决策
- 将 history 视为草稿 —— history 是真相来源
- 假设读者会交叉引用或验证；他们不会
