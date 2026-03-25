# 咨询模式

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

咨询模式让你将个人 squad 带到你不拥有的项目 —— OSS 贡献、客户工作、临时协作 —— 而不留下任何痕迹。你的团队咨询、做工作、学习东西，并带着只有你批准的通用学习回家。

---

## 问题

你在全局路径（例如 Linux 上 `~/.config/squad/.squad`）有个人 squad，带有随时间细化的智能体、技能和决策。当你为别人的项目做贡献时，你面临困境：

- **污染项目？** 运行 `squad init` 创建他们没要求的 `.squad/` 文件夹
- **污染你的 squad？** 项目特定知识渗入你的全局 squad
- **没有你的团队工作？** 失去你建立的生产力优势

---

## 解决方案

你的团队在项目**咨询**。他们带来专长、做工作、学习东西。完成后，他们提取可复用的内容并回家。项目永远不知道 Squad 在那里。

| 方面 | 正常模式 | 咨询模式 |
|--------|-------------|--------------|
| Squad 位置 | 项目中的 `.squad/` | 个人 squad 的**副本**到项目 `.squad/` |
| Git 可见性 | 提交或 `.gitignore` | 通过 `.git/info/exclude` 不可见 |
| 写入到 | 项目 `.squad/` | 项目 `.squad/`（隔离副本） |
| 会话后 | 留在项目中 | 提取通用学习 → 个人 squad，丢弃其余 |

---

## 快速开始

### OSS 贡献

```bash
cd ~/projects/kubernetes-dashboard
squad consult                 # 进入咨询模式
# ... 用你的 squad 做你的工作 ...
squad extract                 # 审查并提取通用学习
squad extract --clean --yes   # 提取后清理
```

### 客户工作

```bash
cd ~/client-projects/acme-corp
squad consult                 # 进入咨询模式
# ... 在项目上做工作 ...
squad extract --dry-run       # 预览将要提取的内容
squad extract --clean         # 提取并清理（提示确认）
```

### 检查状态

```bash
squad consult --status        # 查看咨询模式是否激活
squad consult --check         # 干运行：展示将要发生什么
```

---

## 命令参考

### `squad consult`

用你的个人 squad 进入咨询模式。

```bash
squad consult              # 进入咨询模式
squad consult --status     # 检查当前咨询模式状态
squad consult --check      # 干运行：展示将要发生什么而不创建文件
```

**发生什么：**

1. 将你的个人 squad 复制到项目的 `.squad/` 目录
2. 将 `.squad/` 和 `.github/agents/squad.agent.md` 添加到 `.git/info/exclude`
3. 用提取指令修补 Scribe charter
