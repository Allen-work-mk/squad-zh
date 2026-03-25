# 插件市场指南

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

**试试这个添加即时专长：**
```
安装 AWS 部署插件
```

**试试这个发现社区捆绑包：**
```
展示 React 开发的可用插件
```

插件是社区策划的智能体模板、技能和最佳实践捆绑包。安装插件为你的 squad 提供 React、Azure、安全、测试等方面的即时专长。

---

## 什么是插件？

你的 Squad 可以发现和安装**插件** —— 来自社区仓库的智能体模板、技能和指令策划集合。插件解决常见问题：Azure 云开发、React 模式、安全加固、测试策略等。

---

## 什么是插件？

插件是**社区策划捆绑包**的可复用知识。每个插件包含：

- **智能体模板** —— 常见需求的专业角色 charter（例如 "AWS DevOps"、"Python 数据科学"）
- **技能** —— 编码模式和最佳实践的可复用 `.squad/skills/SKILL.md` 文件
- **指令** —— 约定和路由规则的 `decisions.md` 片段
- **示例提示** —— 激活插件功能的即用型提示

插件市场是**托管这些捆绑包的仓库**。Squad 附带预配置的社区市场。你可以添加自己的。

---

## 可用市场

| 市场 | URL | 里面有什么 |
|-------------|-----|-----------|
| **awesome-copilot** | `github/awesome-copilot` | 前端框架（React、Vue、Svelte）、后端技术栈（Node、Python、Go）、部署模式 |
| **anthropic-skills** | `anthropics/skills` | Claude 优化模式、提示工程、token 效率、RAG 模式 |
| **azure-cloud-dev** | `github/azure-cloud-development` | Azure VM、App Service、Cosmos DB、GitHub Actions DevOps、基础设施即代码 |
| **security-hardening** | `github/security-hardening` | OWASP、输入验证、密钥管理、加密、合规模式 |

---

## 命令

### 列出注册的市场

```
> 展示可用市场
```

Squad 显示所有配置的市场及描述。

```
/plugin marketplace list
```

同样的事情，命令行风格。

### 添加市场

```
> 添加 awesome-copilot 市场
```

或使用命令：

```
/plugin marketplace add github/awesome-copilot
```

Squad 连接到仓库、索引其插件，并使它们可供浏览。

### 移除市场

```
> 移除 awesome-copilot 市场
```

或：

```
/plugin marketplace remove awesome-copilot
```

从你的配置中移除市场。已安装的插件保留；无法从中添加新插件。

### 浏览市场中的插件

```
> 浏览 awesome-copilot 市场
```

Squad 显示所有可用插件及单行描述。
