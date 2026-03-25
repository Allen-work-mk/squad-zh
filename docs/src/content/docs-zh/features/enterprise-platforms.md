# 企业平台

Squad 除了 GitHub 还支持 Azure DevOps 和 Microsoft Planner。当你的 git 远程指向 Azure DevOps 时，Squad 自动检测平台并调整其命令。对于工作项跟踪，Squad 还支持混合模型，其中代码生活在一个平台，任务生活在 Microsoft Planner。

## 前置条件

1. **Azure CLI** —— 从 [https://aka.ms/install-az-cli](https://aka.ms/install-az-cli) 安装
2. **Azure DevOps 扩展** —— `az extension add --name azure-devops`
3. **登录** —— `az login`
4. **设置默认值** —— `az devops configure --defaults organization=https://dev.azure.com/YOUR_ORG project=YOUR_PROJECT`

验证设置：

```bash
az devops configure --list
# 应该显示组织和项目
```

## 如何工作

Squad 从你的 git 远程 URL 自动检测平台：

| 远程 URL 模式 | 检测到的平台 |
|---|---|
| `github.com` | GitHub |
| `dev.azure.com` | Azure DevOps |
| `*.visualstudio.com` | Azure DevOps |
| `ssh.dev.azure.com` | Azure DevOps |

## 与 GitHub 的差异

### 工作项 vs Issues

| GitHub | Azure DevOps |
|---|---|
| Issues | 工作项 |
| 标签（例如 `squad:alice`） | 标签（例如 `squad:alice`） |
| `gh issue list --label X` | 通过 `az boards query` 的 WIQL 查询 |
| `gh issue edit --add-label` | `az boards work-item update --fields "System.Tags=..."` |

### Pull Requests

| GitHub | Azure DevOps |
|---|---|
| `gh pr list` | `az repos pr list` |
| `gh pr create` | `az repos pr create` |
| `gh pr merge` | `az repos pr update --status completed` |
| 评审：已批准 / 需要更改 | 投票：10（已批准）/ -10（已拒绝） |

### 分支操作

分支操作在两个平台上使用相同的 `git` 命令。Squad 使用命名约定 `squad/{id}-{slug}` 创建分支。

## Azure DevOps 上的 Ralph

Ralph 在 ADO 上相同地工作 —— 他使用 WIQL 查询而不是 GitHub 标签筛选器扫描未分流的工作项：

```
# GitHub
gh issue list --label "squad:untriaged" --json number,title,labels

# Azure DevOps
az boards query --wiql "SELECT [System.Id],[System.Title],[System.Tags] FROM WorkItems WHERE [System.Tags] Contains 'squad:untriaged'"
```

标签分配使用相同的 `squad:{member}` 约定，存储为用 `;` 分隔的 ADO 工作项标签。

## 配置

Squad 从 git 远程 URL 自动检测 ADO。对于基本使用，无需额外配置。
