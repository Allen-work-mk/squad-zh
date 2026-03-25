# 标签分类法

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

**试试这个应用工作流标签：**
```
将 go:yes 标签应用到 issue #42 并针对 v0.5.0
```

**试试这个按优先级筛选：**
```
展示所有带 priority:p0 的 issues
```

**试试这个将工作路由给特定智能体：**
```
将 squad:fenster 添加到 issue #23
```

Squad 使用结构化的、命名空间的标签作为状态机。标签驱动工作流自动化 —— 不只是标签。五个命名空间控制生命周期、优先级、所有权和发布目标。

---

## 五个命名空间

| 命名空间 | 目的 | 值 | 互斥性 |
|-----------|---------|--------|-------------------|
| `go:` | 裁决 —— 是/否/需要研究 | `go:yes`、`go:no`、`go:needs-research` | ✅ 每个 issue 一个 |
| `release:` | 发布目标 | `release:v0.4.0`、`release:v0.5.0`、`release:backlog` | ✅ 每个 issue 一个 |
| `type:` | 问题类别 | `type:feature`、`type:bug`、`type:spike`、`type:docs`、`type:chore`、`type:epic` | ✅ 每个 issue 一个 |
| `priority:` | 紧急程度 | `priority:p0`、`priority:p1`、`priority:p2` | ✅ 每个 issue 一个 |
| `squad:{member}` | 智能体分配 | `squad:fenster`、`squad:mcmanus`、`squad:hockney` | ❌ 可以有多个（配对工作） |

## 互斥规则

在 `go:`、`release:`、`type:` 和 `priority:` 命名空间内，**只允许一个标签**。应用同一命名空间中的第二个标签会自动移除第一个。

示例：
- Issue 有 `go:needs-research`
- 你应用 `go:yes`
- 结果：`go:needs-research` 被移除，`go:yes` 被应用

`squad:{member}` 命名空间允许多个标签用于协作工作：
- `squad:fenster` + `squad:hockney` = 结对编程或交接

## 工作流自动化

标签驱动四个自动化层：

### 1. 执行（互斥）

GitHub Actions 工作流 `label-enforcement.yml` 监视标签更改。如果同一命名空间应用了多个标签，它会移除除最近一个之外的所有标签。

### 2. 同步（跨命名空间一致性）

某些标签更改触发级联更新：
- `go:no` 应用 → 自动添加 `release:backlog`，移除其他发布目标
- `priority:p0` 应用 → 确保设置 `go:yes`（p0 意味着已批准）

### 3. 分流（自动分配）

Ralph（工作监控器）使用标签路由工作：
- `squad:fenster` → Fenster 获取它
- 没有 `squad:*` + `type:bug` → 基于 routing.md 路由给测试人员或组长
- `go:needs-research` → 路由给组长进行调查

### 4. 心跳（定期检查）

`squad-heartbeat.yml` 工作流每 30 分钟运行一次并：
- 查找带有 `squad` 标签但没有 `squad:{member}` 的 issues → 自动分流
- 查找 `go:yes` + `squad:{member}` 但没有负责人的 → 生成智能体
- 查找陈旧的 `go:needs-research`（>7 天）→ 升级给组长

## 状态机流程

```
新问题 → squad 标签 → 分流
                            ↓
                       组长分配 go:* + type:* + priority:*
```
