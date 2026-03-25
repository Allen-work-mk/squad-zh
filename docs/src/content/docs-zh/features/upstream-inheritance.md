# 上游继承

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

上游继承允许你声明外部 Squad 源（来自仓库、本地目录或导出）并在会话开始时自动继承他们的上下文。跨团队、组织和项目分享实践，无需重复配置。

## 如何工作

在会话开始时，协调器从 `upstream.json` 读取所有声明的上游，并使他们的上下文对每个智能体可用：

- **技能** — `.squad/skills/*/SKILL.md`
- **决策** — `.squad/decisions.md`
- **智慧** — `.squad/identity/wisdom.md`
- **选角政策** — `.squad/casting/policy.json`
- **路由** — `.squad/routing.md`

**解析顺序：** 较晚条目覆盖较早条目。从组织 → 团队 → 仓库分层上游，每个级别根据需要添加或覆盖。

**源类型：**

| 类型 | 示例 | 用例 |
|------|---------|----------|
| **本地** | `../org-practices/.squad/` | 兄弟仓库、共享驱动器、monorepo 包 |
| **git** | `https://github.com/acme/platform-squad.git` | 公共/私人团队仓库（带凭据） |
| **导出** | `./exports/squad-export.json` | 离线使用或版本固定的快照 |

## 快速开始

**本地上游：**

```bash
squad upstream add ../org-practices/.squad
squad upstream list
# org-practices → 本地: /path/to/org-practices/.squad（永不同步）
```

**Git 上游：**

```bash
squad upstream add https://github.com/acme/platform-squad.git --name platform --ref main
squad upstream sync platform
```

**导出快照：**

```bash
squad export-config --output ./exports/snapshot.json
squad upstream add ./exports/snapshot.json --name snapshot
```

## 故障排除

### Git 克隆或同步失败

确保 URL 正确且你有访问权限。对于私人仓库，使用 SSH（`git@github.com:owner/repo.git`）并将 SSH 密钥放在 ssh-agent 中，或使用带有 `https://[PAT]@github.com/owner/repo.git` 的 GitHub PAT。

### 本地上游未找到

验证路径存在：`ls ../shared/.squad`。如果相对路径失败，使用绝对路径。

### 智能体看不到继承的上下文

```bash
# 验证上游已配置
squad upstream list

# 同步并验证源
squad upstream sync

# 重启你的会话（解析发生在会话开始时）
```

对于 git 上游，检查 `.squad/_upstream_repos/{name}` 是否存在。

### 缓存克隆过时

```bash
squad upstream sync <name>
```
