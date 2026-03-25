# 内测计划

获取 Squad 开发构建的早期访问权限，塑造项目的未来。

---

## 什么是内测计划？

内测计划让你持续访问 Squad 的开发构建。内测者运行来自 `insider` 分支的代码 —— 新功能首先落地的最前沿。这是一个轻量级、诚信系统的计划，专为希望以下功能的开发者设计：

- **提前尝试新功能** —— 在发布前
- **帮助发现 bug** —— 在稳定版本之前报告问题
- **塑造路线图** —— 你的反馈直接影响我们构建的内容
- **快速迭代** —— 无需等待月度发布；更新随提交落地而流动

---

## 如何安装和升级

### 安装内测构建

```bash
npm install -g @bradygaster/squad-cli@insider
```

### 将现有仓库升级到内测版

```bash
npm install -g @bradygaster/squad-cli@insider
squad upgrade
```

这将 Squad 管理的文件（`squad.agent.md`、工作流、模板）更新到最新的内测构建。你的 `.squad/` 团队状态（智能体、决策、选角、历史）始终保留。

---

## 会有什么体验

### 你会得到

- **持续更新** —— `insider` 分支始终领先于 `main`
- **新功能** —— 在稳定发布前数月预览功能
- **直接访问** —— 一个命令拉取最新
- **社区输入** —— 你的反馈影响优先级

### 你可能会遇到

- **粗糙边缘** —— 功能可能尚未完全打磨
- **偶尔的 bug** —— 开发构建的测试少于发布版
- **破坏性变更** —— API 表面可能在内部版本之间变化
- **缺少文档** —— 新功能可能还没有指南

**这是预期的。** 内测计划以稳定性换取速度。

---

## 版本格式

内测构建使用此版本方案：

```
v0.5.2-insider+abc1234f
```

其中：
- `v0.5.2` —— 即将发布的语义化版本
- `insider` —— 内测构建标志
- `abc1234f` —— 提交哈希（前 8 个字符）

你会在 `squad.agent.md` HTML 版本注释中看到它：

```markdown
<!-- version: v0.5.2-insider+abc1234f -->
```

**固定特定标记版本：**

```bash
npm install -g @bradygaster/squad-cli@0.5.2-insider
```

---

## 报告问题

发现 bug？我们想听听。

**打开 GitHub issue** 并提供：

1. **版本** —— 来自你的 `squad.agent.md` 的完整版本
2. **发生了什么** —— 对 bug 的清晰描述
3. **复现步骤** —— 触发它的确切步骤
4. **环境** —— CLI 或 VS Code、Node 版本、操作系统

**用 `[INSIDER]` 标记它** 以便我们跟踪内部特定问题。

示例：

```
标题：[INSIDER] Squad 在 Node 20 上初始化时崩溃

版本：v0.4.2-insider+abc1234f
环境：macOS 14.1 上的 CLI，Node 20.11.0

步骤：
1. npm install -g @bradygaster/squad-cli@insider
2. 按照快速开始
3. squad.agent.md 中的错误...
```

---

## 退出

想回到稳定发布？

```bash
npm install -g @bradygaster/squad-cli@latest
```

这会安装最新的稳定版本。你的 `.squad/` 状态是安全的 —— 它可以在任何版本上工作。

---

## 常见问题

### 问：内测构建会破坏我的项目吗？

**答：** 不太可能，但有可能。内测分支在推送前经过测试，但比发布版稳定性差。确保你可以根据需要回滚。

### 问：我可以在内测和稳定构建之间切换吗？

**答：** 可以。内测构建与稳定安装向后兼容。你的 `.squad/` 目录可以在任何版本上工作。

### 问：内测构建多久更新一次？

**答：** 视提交在 `insider` 分支上的落地频率而定。可能是每天，可能是每周 —— 取决于开发周期。再次运行 `npm install -g @bradygaster/squad-cli@insider` 以获取最新。

### 问：我的团队状态会保留吗？

**答：** 是的。`.squad/` 在升级时永远不会被覆盖。你所有的智能体、决策和历史都是安全的。

### 问：如果内测构建有严重 bug 怎么办？

**答：** 立即回滚：

```bash
npm install -g @bradygaster/squad-cli@latest   # 回到稳定版
squad upgrade                                   # 应用稳定版本
```

然后[报告问题](https://github.com/bradygaster/squad/issues)。

---

## 感谢

内测者帮助我们发布更好的软件。你的 bug 报告、功能请求和反馈使 Squad 更强大。感谢你参与这段旅程。

有问题？[开始讨论](https://github.com/bradygaster/squad/discussions)。
