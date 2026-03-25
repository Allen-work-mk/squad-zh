# Ralph —— 工作监控器

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

**试试这个查看活跃工作：**
```
Ralph，展示每个人都在做什么
```

**试试这个识别阻塞：**
```
Ralph，issue #42 的进展被什么阻塞了？
```

**试试这个自动分配工作：**
```
Ralph，分配下一个高优先级 issue
```

Ralph 跟踪工作队列、监控 CI 状态，并确保团队在工作要做时永不闲置。他总是在花名册上，需要 GitHub CLI 访问。

---

## Ralph 做什么

Ralph 是一个内置的 squad 成员，其工作是跟踪工作。就像 Scribe 跟踪决策一样，**Ralph 跟踪并驱动工作队列**。他总是在花名册上 —— 不是从宇宙选角 —— 只有一个工作：确保团队在工作要做时永不闲置。

Ralph 使用智能路由将工作匹配给正确的智能体。而不是简单的关键字匹配角色标题，Ralph 阅读 `.squad/routing.md` —— 你团队的工作类型定义和模块所有权 —— 以做出智能的分流和分派决策。这与会话中协调器使用的智能相同。

## 前置条件

Ralph 需要访问 GitHub Issues 和 Pull Requests，通过 `gh` CLI。**需要带有经典范围的 GitHub PAT（个人访问令牌）。**

### 为什么用 PAT Classic？

Copilot 提供的默认 `GITHUB_TOKEN` 没有足够的范围来读取和写入 GitHub Issues 和 PRs。Ralph 需要：
- 列出和阅读 issues
- 创建和更新 issue 标签和分配
- 阅读和与 pull requests 交互
- 报告 CI 状态

### 设置

1. **创建 PAT Classic 令牌：**
   - 前往 https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择范围：`repo` 和 `project`（完全访问仓库和项目）
   - 复制令牌

2. **用 `gh` 认证：**
   ```bash
   gh auth login
   ```
   - 选择 "GitHub.com"
   - 选择 "HTTPS" 作为协议
   - 当询问"用 GitHub 凭据认证 Git？"时，回答 "Yes"
   - 选择 "Paste an authentication token" 并粘贴你的 PAT Classic 令牌

3. **验证认证：**
   ```bash
   gh auth status
   ```

一旦认证，Ralph 就可以监控你仓库的 issues 和 PRs。

## 如何工作

一旦激活，Ralph 持续检查待处理的工作 —— 开放 issues、草稿 PRs、审查反馈、CI 失败 —— 并保持 squad 通过后端移动，无需手动推动。Ralph 的行为建立在三层之上：会话中协调器、本地轮询的监视模式，以及完全无人值守监控的云心跳。

### 基于路由的分流

Ralph 不依赖愚蠢的关键字匹配。他阅读你的 `.squad/routing.md` 文件以了解：
- **工作类型** —— 类别如"核心运行时"、"文档与消息"、"测试与质量"
- **智能体分配** —— 哪个智能体拥有每个领域
- **模块所有权** —— 哪些文件属于哪个智能体（例如 `src/hooks/` → Baer）

分流 issue 时，Ralph 使用此优先顺序：
1. **模块路径匹配** —— 如果 issue 提到 `src/hooks/` 中的文件，它路由给 Baer（主要所有者）
2. **路由规则关键字** —— 如果 issue 提到"docs"或"messaging"，Ralph 查找那些工作类型并分配匹配的智能体（McManus 用于"文档与消息"）
3. **角色关键字** —— 如果没有模块或路由规则匹配，Ralph 扫描 issue 中的角色标题（"test"、"security"、"performance"）
4. **组长回退** —— 如果仍然没有匹配，升级给组长进行人工审查
这确保 Ralph 基于你团队的实际结构做出智能决策，而非通用启发式。
