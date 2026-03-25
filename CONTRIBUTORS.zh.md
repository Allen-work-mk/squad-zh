# 贡献者

Squad 由来自整个开源社区的贡献者构建。感谢各位。

---

## 内测计划

**[INSIDER]** — Squad 开发构建的早期访问测试者。

内测计划让你在功能发布前获得前沿功能的访问权限。内测者直接从 `insider` 分支运行开发构建，帮助我们发现 bug、验证用户体验，并塑造 Squad 的未来。

### 内测计划是什么

- **早期访问**未发布的功能
- **持续更新**的开发构建
- 对下一步构建内容的**直接输入**
- 可能尚不完善的**实验性功能**

### 如何加入

使用诚信系统从 insider 分支安装：

```bash
npx github:bradygaster/squad#insider
```

就是这样。你现在使用内测构建了。

### 会有什么体验

- **定期更新** —— insider 分支在功能发布时接收提交
- **实验性功能** —— 某些功能可能尚未完全稳定
- **欢迎 bug 报告** —— 帮助我们及早发现和修复问题
- **版本格式** —— 你的 `squad.agent.md` 中显示为 `v0.4.2-insider+{commit-hash}`

### 报告问题

在内测构建中发现 bug？请[打开 GitHub issue](https://github.com/bradygaster/squad/issues)并提供：

- **版本** —— 来自你的 `squad.agent.md` 的完整版本字符串
- **发生了什么** —— 对 bug 或意外行为的清晰描述
- **复现步骤** —— 如何触发该问题
- **环境** —— CLI 或 VS Code、Node 版本、操作系统

在你的 issue 上标记 `[INSIDER]` 以便我们跟踪。

---

## 团队阵容

Squad 由一个 AI 团队构建，每个成员负责一个领域并交付实际工作。每个版本都代表整个阵容的贡献。

| 名字 | 角色 | 领域 |
|------|------|--------|
| Flight | 负责人 | 架构、代码审查、产品方向 |
| Procedures | 提示工程师 | 智能体设计、生成模板、协调器逻辑 |
| EECOM | 核心开发 | 运行时实现、CLI、选角引擎 |
| FIDO | 质量负责人 | 测试覆盖、质量门禁、CI/CD 流水线 |
| PAO | 开发者关系 | 文档、消息传递、开发者体验 |
| CAPCOM | SDK 专家 | Copilot SDK 集成、平台模式 |
| CONTROL | TypeScript 工程师 | 类型系统、构建工具、公共 API |
| Surgeon | 发布经理 | 发布、版本控制、CI/CD、分支策略 |
| Booster | CI/CD 工程师 | GitHub Actions、发布流水线、自动化 |
| GNC | Node.js 运行时 | Node.js 运行时、系统 API、性能 |
| Network | 分发 | npm 分发、包管理 |
| RETRO | 安全 | 安全审计、漏洞修复 |
| INCO | CLI UX 与视觉设计 | CLI 用户体验、品牌、视觉设计 |
| GUIDO | VS Code 扩展 | VS Code 扩展、IDE 集成 |
| Telemetry | Aspire 与可观测性 | Aspire 仪表板、OpenTelemetry、Docker |
| VOX | REPL 与交互式 Shell | REPL 实现、交互功能 |
| DSKY | TUI 工程师 | 终端 UI、交互组件 |
| Sims | E2E 测试工程师 | 端到端测试、集成验证 |
| Handbook | SDK 可用性 | JSDoc、API 表面清晰度、迁移指南 |

## v0.8.22 贡献者

| 贡献者 | 交付内容 |
|-------------|-------------------|
| Saul | Aspire 仅 Docker 重构 —— 将仪表板移至独立容器，将测试覆盖从 18 个扩展到 45 个，强化 CLI 布线 |
| Verbal | Squad Places 集成 —— 与 18 个智能体主导反馈会议，通过 3 波推广工件，推动社区参与；defineSkill() 构建器 & 从 squad.agent.md 提取技能 |
| Fenster | Squad Places 客户端 —— 重写 REST API 客户端，启动离线队列模块，交付集成到核心运行时；SDK-first 初始化标志 & generateSDKBuilderConfig |
| Hockney | Aspire 测试扩展 —— 增加 27 个测试，覆盖 Docker 路径验证、端口边界情况、错误处理；66 个新测试（init-sdk、migrate、defineSkill） |
| Kobayashi | 发布管理 —— 记录 v0.8.20 完成，提升至 v0.8.21-preview.1，管理 dev/insiders/main 的分支策略 |
| McManus | 文档与语调 —— 完成文档审计（提交 10 个 GitHub issue），执行语调上限，验证文档一致性；SDK-First 文档更新 |
| Edie | squad migrate 命令（523 行）—— TypeScript 实现、公共 API 表面 |

---

## 文档冲刺贡献者

| 贡献者 | 交付内容 |
|-------------|-------------------|
| [@IEvangelist](https://github.com/IEvangelist) (David Pine) | PR #293 —— 完整的 Astro 文档站点重建：Astro 5.7、Tailwind CSS 4.1、Pagefind 搜索、结构化内容集合、响应式设计、带滚动到活动的自定义侧边栏、博客系统迁移。彻底重写。PR #298 —— Docs/Blog 链接的活动导航高亮、favicon 修复、导航清晰度改进。 |
| [@diberry](https://github.com/diberry) (Dina Berry) | PR #286 —— 向快速开始 README 添加验证步骤。PR #288 —— 安装页面的"我应该使用哪种方法？"决策树（CLI vs VS Code vs SDK）。PR #290 —— 首次会话指南的 .squad/ 目录说明。PR #292 —— 向团队工作流添加文档影响审查流程。 |
| [@tamirdresher](https://github.com/tamirdresher) (Tamir Dresher) | PR #272 —— 将工作流重命名为 SubSquads（社区决策）。PR #278 —— 发布说明博客 026 + 修复重复的 ADO 博客。PR #279 —— 解决预先存在的测试失败。PR #280 —— 在 CLI 中连接上游和监视命令。PR #283 —— 测试中的动态博客发现。 |

---

## 社区贡献者

这些社区成员通过 issue、讨论和反馈塑造了 Squad。每个贡献都很重要。

| 贡献者 | 贡献 |
|-------------|---------------|
| [@dfberry](https://github.com/dfberry) | #241（文档的 Squad 成员）、#157（CFO/账户成员）—— 文档和团队组成想法 |
| [@IEvangelist](https://github.com/IEvangelist) | PR #293（Astro 文档重写）—— 使用 Astro、Tailwind CSS、Pagefind 搜索、响应式设计完成的文档站点重建；PR #298（活动导航高亮和 favicon 修复）—— Astro 重写上的导航优化。巨大贡献。 |
| [@diberry](https://github.com/diberry) | #211（Squad 管理范式）、PR #286（快速开始验证）、PR #288（安装决策树）、PR #290（.squad/ 目录说明）、PR #292（文档影响审查流程）—— 管理方法、跨多个 PR 的文档改进 |
| [@HemSoft](https://github.com/HemSoft) | #148（GitHub Agent Workflows）—— GAW 概念 |
| [@sturlath](https://github.com/sturlath) | #156（从他人工作中学些的团队）—— 跨智能体学习 |
| [@tomasherceg](https://github.com/tomasherceg) | #184（多 PR 提交隔离）、#237（CLI 布线 bug）—— 工作区改进和 bug 报告 |
| [@csharpfritz](https://github.com/csharpfritz) | #205（每个成员的模型配置）—— 模型选择功能（已交付！） |
| [@johnwc](https://github.com/johnwc) | #176（不同的仓库支持）—— 多仓库工作流 |
| [@tamirdresher](https://github.com/tamirdresher) | #200（Squad SubSquads PRD）、#237（CLI 布线 bug）、PR #272（将工作流重命名为 SubSquads）、PR #278（发布说明博客 026 + 修复重复的 ADO 博客）、PR #279（解决预先存在的测试失败）、PR #280（连接上游和监视命令）、PR #283（测试中的动态博客发现）—— 水平扩展概念、bug 报告和跨多个 PR 的测试基础设施改进 |
| [@marchermans](https://github.com/marchermans) | #247（安装失败）—— 安装 bug 报告 |
| [@dkirby-ms](https://github.com/dkirby-ms) | #239（终端闪烁 bug）、PR #243（修复 CLI 空白问题）—— 用户体验 bug 报告和改进 |
| [@EirikHaughom](https://github.com/EirikHaughom) | #223（模型和推理配置）—— 模型配置改进 |
| [@williamhallatt](https://github.com/williamhallatt) | #202（squad link/init --remote）、#201（CI/CD 选择加入）、#218（fork 工作流文档）、#216（TUI 初始化 bug）—— 涵盖用户体验、文档和 bug 的 4 个 issue |
| [@uvirk](https://github.com/uvirk) | #229（squad doctor 不可用）—— CLI 一致性 |
| [@tihomir-kit](https://github.com/tihomir-kit) | #214（Node.js 内置模块错误）—— 兼容性 bug |
| [@fboucher](https://github.com/fboucher) | #207（Copilot 在非根目录看不到 Squad）—— 路径解析 |
| [@Pruthviraj36](https://github.com/Pruthviraj36) | #206（终端闪烁）—— 用户体验 bug 报告 |
| [@wbreza](https://github.com/wbreza) | #193（仪式文件大小阈值）—— 仪式健壮性 |
| [@dnoriegagoodwin](https://github.com/dnoriegagoodwin) | #195（升级版本标记 bug）—— 升级可靠性 |
| [@swnger](https://github.com/swnger) | Discussion #169（基于技能的编排）—— 导致 issue #255 交付 defineSkill() |

---

## 加入

贡献代码？请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 获取完整指南。

有问题？[GitHub Discussions](https://github.com/bradygaster/squad/discussions)。
