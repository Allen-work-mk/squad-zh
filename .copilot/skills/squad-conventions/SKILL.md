---
name: "squad-conventions"
description: "Squad 代码库中使用的核心约定和模式"
domain: "project-conventions"
confidence: "high"
source: "manual"
---

## 上下文
这些约定适用于 Squad CLI 工具（`create-squad`）上的所有工作。Squad 是一个零依赖的 Node.js 包，为任何项目添加 AI 智能体团队。在修改任何 Squad 源代码之前，理解这些模式是必不可少的。

## 模式

### 零依赖
Squad 有零运行时依赖。一切都使用 Node.js 内置模块（`fs`、`path`、`os`、`child_process`）。不要在 `package.json` 的 `dependencies` 中添加包。这是一个硬性约束，不是偏好。

### Node.js 内置测试运行器
测试使用 `node:test` 和 `node:assert/strict` —— 没有测试框架。使用 `npm test` 运行。测试文件位于 `test/`。测试命令是 `node --test test/`。

### 错误处理 —— `fatal()` 模式
所有面向用户的错误使用 `fatal(msg)` 函数，它打印红色的 `✗` 前缀并以代码 1 退出。永远不要抛出未处理的异常或打印原始堆栈跟踪。全局 `uncaughtException` 处理程序作为安全网调用 `fatal()`。

### ANSI 颜色常量
颜色在 `index.js` 顶部定义为常量：`GREEN`、`RED`、`DIM`、`BOLD`、`RESET`。使用这些常量 —— 不要内联 ANSI 转义码。

### 文件结构
- `.squad/` —— 团队状态（用户拥有，升级时永不覆盖）
- `.squad/templates/` —— 从 `templates/` 复制的模板文件（Squad 拥有，升级时覆盖）
- `.github/agents/squad.agent.md` —— 协调器提示（Squad 拥有，升级时覆盖）
- `templates/` —— 随 npm 包发布的源模板
- `.copilot/skills/` —— SKILL.md 格式的团队技能（用户拥有）
- `.squad/decisions/inbox/` —— 并行决策写入的投递箱

### Windows 兼容性
总是使用 `path.join()` 作为文件路径 —— 永远不要硬编码 `/` 或 `\` 分隔符。Squad 必须在 Windows、macOS 和 Linux 上工作。所有测试必须通过所有平台。

### 初始化幂等性
初始化流程使用存在则跳过模式：如果文件或目录已存在，跳过它并报告"已存在"。初始化期间永远不要覆盖用户状态。升级流程仅覆盖 Squad 拥有的文件。

### 复制模式
`copyRecursive(src, target)` 处理文件和目录。它用 `{ recursive: true }` 创建父目录，用 `fs.copyFileSync` 复制文件。

## 示例

```javascript
// 错误处理
function fatal(msg) {
  console.error(`${RED}✗${RESET} ${msg}`);
  process.exit(1);
}

// 文件路径构造（Windows 安全）
const agentDest = path.join(dest, '.github', 'agents', 'squad.agent.md');

// 存在则跳过模式
if (!fs.existsSync(ceremoniesDest)) {
  fs.copyFileSync(ceremoniesSrc, ceremoniesDest);
  console.log(`${GREEN}✓${RESET} .squad/ceremonies.md`);
} else {
  console.log(`${DIM}ceremonies.md 已存在 —— 跳过${RESET}`);
}
```

## 反模式
- **添加 npm 依赖** —— Squad 是零依赖的。仅使用 Node.js 内置模块。
- **硬编码路径分隔符** —— 永远不要直接使用 `/` 或 `\`。总是使用 `path.join()`。
- **在初始化时覆盖用户状态** —— 初始化跳过现有文件。只有升级覆盖 Squad 拥有的文件。
- **原始堆栈跟踪** —— 所有错误通过 `fatal()`。用户看到干净的消息，不是堆栈跟踪。
- **内联 ANSI 代码** —— 使用颜色常量（`GREEN`、`RED`、`DIM`、`BOLD`、`RESET`）。
