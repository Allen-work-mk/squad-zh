# Squad SubSquads

通过将工作划分为带标签的 SubSquads，在多个 Codespaces 中扩展 Squad。

## 什么是 SubSquads？

**SubSquad** 是 Squad 项目中工作的命名分区。每个 SubSquad 针对特定的 GitHub 标签（例如 `team:ui`、`team:backend`），并可选地将智能体限制到某些目录。多个 Squad 实例 —— 每个在自己的 Codespace 中运行 —— 可以各自激活不同的 SubSquad，实现跨团队的并行工作。

## 为什么用 SubSquads？

Squad 最初设计为每个仓库一个团队。随着项目增长，单个 Codespace 成为瓶颈：

- **模型速率限制** —— 一个 Codespace 达到 API 限制会减慢整个团队
- **上下文过载** —— Ralph 获取所有 issues，不只是相关的
- **文件夹冲突** —— 多个智能体编辑相同文件导致合并痛苦

SubSquads 通过给每个 Codespace 项目的限定视图来解决这个问题。

## 配置

### 1. 创建 `.squad/streams.json`

```json
{
  "workstreams": [
    {
      "name": "ui-team",
      "labelFilter": "team:ui",
      "folderScope": ["apps/web", "packages/ui"],
      "workflow": "branch-per-issue",
      "description": "前端团队 —— React、CSS、组件"
    },
    {
      "name": "backend-team",
      "labelFilter": "team:backend",
      "folderScope": ["apps/api", "packages/core"],
      "workflow": "branch-per-issue",
      "description": "后端团队 —— API、数据库、服务"
    },
    {
      "name": "infra-team",
      "labelFilter": "team:infra",
      "folderScope": [".github", "infrastructure"],
      "workflow": "direct",
      "description": "基础设施 —— CI/CD、部署、监控"
    }
  ],
  "defaultWorkflow": "branch-per-issue"
}
```

### 2. 激活 SubSquad

有三种方式告诉 Squad 使用哪个 SubSquad：

#### 环境变量（Codespaces 推荐）

```bash
export SQUAD_TEAM=ui-team
```

在你的 Codespace 环境或 devcontainer.json 中设置：

```json
{
  "containerEnv": {
    "SQUAD_TEAM": "ui-team"
  }
}
```

#### .squad-workstream 文件（本地激活）

```bash
squad subsquads activate ui-team
```

这会写入一个 `.squad-workstream` 文件（gitignored），所以设置是本地到你的机器。

#### 自动选择（单个 SubSquad）

如果 `streams.json` 只包含一个 SubSquad，它会自动选择。

### 3. 解析优先级

1. `SQUAD_TEAM` 环境变量（最高）
2. `.squad-workstream` 文件
3. 单-SubSquad 自动选择
4. 无 SubSquad（经典单 squad 模式）

## SubSquad 定义字段

| 字段 | 必需 | 描述 |
|-------|----------|-------------|
| `name` | 是 | 唯一 SubSquad 标识符（kebab-case） |
| `labelFilter` | 是 | 筛选 issues 的 GitHub 标签 |
| `folderScope` | 否 | 此 SubSquad 可以修改的目录 |
| `workflow` | 否 | `branch-per-issue`（默认）或 `direct` |
| `description` | 否 | 人类可读的目的 |
