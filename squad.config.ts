// Squad 配置文件 —— 使用 squad-sdk 定义团队结构和路由规则
// 此文件使用 TypeScript/代码优先的方式配置 Squad，替代传统的 .squad/ Markdown 文件
// 运行 `squad build` 可从该文件重新生成 .squad/*.md

import {
  defineSquad,      // 定义 Squad 配置
  defineTeam,       // 定义团队
  defineAgent,      // 定义智能体
  defineRouting,    // 定义路由规则
  defineCasting,    // 定义角色分配策略
} from '@bradygaster/squad-sdk';

/**
 * Squad 配置导出
 * 这是整个 Squad 系统的核心配置
 */
export default defineSquad({
  version: '1.0.0',  // 配置版本

  // 团队定义
  team: defineTeam({
    name: 'squad-sdk',  // 团队名称
    description: '面向 GitHub Copilot 的可编程多智能体运行时。',  // 团队描述
    // 项目上下文信息（提供给所有智能体）
    projectContext:
      '- **负责人:** Brady\n' +
      '- **技术栈:** TypeScript（严格模式，仅 ESM）、Node.js ≥20、@github/copilot-sdk、Vitest、esbuild\n' +
      '- **描述:** 面向 GitHub Copilot 的可编程多智能体运行时 —— Squad beta 的 v1 重新平台化\n' +
      '- **分发方式:** npm（CLI 使用 `npm install -g @bradygaster/squad-cli`，SDK 使用 `npm install @bradygaster/squad-sdk`）\n' +
      '- **创建日期:** 2026-02-21',
    // 团队成员列表（智能体名称）
    members: [
      'keaton', 'verbal', 'fenster', 'hockney', 'mcmanus', 'kujan',
      'edie', 'kobayashi', 'fortier', 'rabin', 'baer', 'redfoot',
      'strausz', 'saul', 'kovash', 'marquez', 'cheritto', 'breedan',
      'nate', 'waingro',
    ],
  }),

  // 智能体定义数组
  agents: [
    // keaton: 负责人 - 架构师，范围保持者，能看到全局的人
    defineAgent({ name: 'keaton', role: 'Lead', description: '架构师，范围保持者，能看到全局的人。', status: 'active' }),
    // verbal: 提示词工程师 - 负责编写提示词、charter 和协调器逻辑
    defineAgent({ name: 'verbal', role: 'Prompt Engineer', description: '编写提示词、charter 和协调器逻辑。', status: 'active' }),
    // fenster: 核心开发 - 实用、彻底，先让它工作再让它正确
    defineAgent({ name: 'fenster', role: 'Core Dev', description: '实用、彻底，先让它工作再让它正确。', status: 'active' }),
    // hockney: 测试人员 - 如果它没有测试，它就不工作
    defineAgent({ name: 'hockney', role: 'Tester', description: '如果它没有测试，它就不工作。', status: 'active' }),
    // mcmanus: 开发者关系 - 文档、消息传递、开发者体验
    defineAgent({ name: 'mcmanus', role: 'DevRel', description: '文档、消息传递、开发者体验。', status: 'active' }),
    // kujan: SDK 专家 - 深入了解 Copilot SDK
    defineAgent({ name: 'kujan', role: 'SDK Expert', description: '深入了解 Copilot SDK 的人。', status: 'active' }),
    // edie: TypeScript 工程师 - 精确、类型痴迷
    defineAgent({ name: 'edie', role: 'TypeScript Engineer', description: '精确、类型痴迷。类型即契约。如果它能编译，它就能工作。', status: 'active' }),
    // kobayashi: Git 与发布 - 语义化版本控制、发布、分支保护
    defineAgent({ name: 'kobayashi', role: 'Git & Release', description: '语义化版本控制、发布、分支保护。', status: 'active' }),
    // fortier: Node.js 运行时 - 流、事件循环健康、异步迭代器、内存分析
    defineAgent({ name: 'fortier', role: 'Node.js Runtime', description: '流、事件循环健康、异步迭代器、内存分析。', status: 'active' }),
    // rabin: 分发 - npm 打包、esbuild 配置、全局安装、市场
    defineAgent({ name: 'rabin', role: 'Distribution', description: 'npm 打包、esbuild 配置、全局安装、市场。', status: 'active' }),
    // baer: 安全 - Hook 设计、PII 过滤器、文件写入保护、合规
    defineAgent({ name: 'baer', role: 'Security', description: 'Hook 设计、PII 过滤器、文件写入保护、合规。', status: 'active' }),
    // redfoot: 平面设计师 - Logo、图标、品牌资产、设计系统
    defineAgent({ name: 'redfoot', role: 'Graphic Designer', description: 'Logo、图标、品牌资产、设计系统。', status: 'active' }),
    // strausz: VS Code 扩展 - VS Code Extension API、runSubagent、编辑器集成
    defineAgent({ name: 'strausz', role: 'VS Code Extension', description: 'VS Code Extension API、runSubagent、编辑器集成。', status: 'active' }),
    // saul: Aspire & 可观测性 - Aspire 仪表板、OTLP 集成、Docker 遥测
    defineAgent({ name: 'saul', role: 'Aspire & Observability', description: 'Aspire 仪表板、OTLP 集成、Docker 遥测。', status: 'active' }),
    // kovash: REPL & 交互式 Shell - 交互式 shell、Ink 组件、会话分发
    defineAgent({ name: 'kovash', role: 'REPL & Interactive Shell', description: '交互式 shell、Ink 组件、会话分发。', status: 'active' }),
    // marquez: CLI UX 设计师 - 交互设计、文案、间距、可发现性、UX 门禁
    defineAgent({ name: 'marquez', role: 'CLI UX Designer', description: '交互设计、文案、间距、可发现性、UX 门禁。', status: 'active' }),
    // cheritto: TUI 工程师 - Ink 组件、布局、输入处理、渲染性能
    defineAgent({ name: 'cheritto', role: 'TUI Engineer', description: 'Ink 组件、布局、输入处理、渲染性能。', status: 'active' }),
    // breedan: E2E 测试工程师 - node-pty 工具、Gherkin 功能、帧快照
    defineAgent({ name: 'breedan', role: 'E2E Test Engineer', description: 'node-pty 工具、Gherkin 功能、帧快照。', status: 'active' }),
    // nate: 无障碍审查员 - 键盘导航、颜色对比度、错误引导、快捷键可发现性
    defineAgent({ name: 'nate', role: 'Accessibility Reviewer', description: '键盘导航、颜色对比度、错误引导、快捷键可发现性。', status: 'active' }),
    // waingro: 产品 dogfooder - 对抗性测试、边界情况、回归场景
    defineAgent({ name: 'waingro', role: 'Product Dogfooder', description: '对抗性测试、边界情况、回归场景。', status: 'active' }),
  ],

  // 路由规则定义
  routing: defineRouting({
    // 路由规则数组：根据任务模式匹配到特定智能体
    rules: [
      // 核心运行时相关任务 → fenster
      { pattern: 'core-runtime', agents: ['@fenster'], description: 'CopilotClient、适配器、会话池、工具模块、生成编排' },
      // 提示词架构相关任务 → verbal
      { pattern: 'prompt-architecture', agents: ['@verbal'], description: '智能体 charter、生成模板、协调器逻辑、响应层级选择' },
      // 类型系统相关任务 → edie
      { pattern: 'type-system', agents: ['@edie'], description: '可辨识联合、泛型、tsconfig、严格模式、声明文件' },
      // SDK 集成相关任务 → kujan
      { pattern: 'sdk-integration', agents: ['@kujan'], description: '@github/copilot-sdk 使用、CopilotSession 生命周期、事件处理' },
      // 运行时性能相关任务 → fortier
      { pattern: 'runtime-performance', agents: ['@fortier'], description: '流、事件循环健康、会话管理、异步迭代器' },
      // 测试相关任务 → hockney
      { pattern: 'testing', agents: ['@hockney'], description: '测试覆盖率、Vitest、边界情况、CI/CD、质量门禁' },
      // 文档相关任务 → mcmanus
      { pattern: 'documentation', agents: ['@mcmanus'], description: 'README、API 文档、入门指南、演示、语调审查' },
      // 架构相关任务 → keaton
      { pattern: 'architecture', agents: ['@keaton'], description: '产品方向、架构决策、代码审查、范围' },
      // 分发相关任务 → rabin
      { pattern: 'distribution', agents: ['@rabin'], description: 'npm 打包、esbuild 配置、全局安装、市场准备' },
      // Git 发布相关任务 → kobayashi
      { pattern: 'git-releases', agents: ['@kobayashi'], description: '语义化版本控制、GitHub Releases、CI/CD、分支保护' },
      // 安全相关任务 → baer
      { pattern: 'security', agents: ['@baer'], description: 'Hook 设计、PII 过滤器、安全审查、合规' },
      // 视觉识别相关任务 → redfoot
      { pattern: 'visual-identity', agents: ['@redfoot'], description: 'Logo、图标、品牌资产、设计系统' },
      // 可观测性相关任务 → saul
      { pattern: 'observability', agents: ['@saul'], description: 'Aspire 仪表板、OTLP 集成、Playwright E2E、Docker 遥测' },
      // VS Code 集成相关任务 → strausz
      { pattern: 'vscode-integration', agents: ['@strausz'], description: 'VS Code Extension API、runSubagent 兼容性' },
      // REPL Shell 相关任务 → kovash
      { pattern: 'repl-shell', agents: ['@kovash'], description: '交互式 shell、Ink 组件、会话分发' },
      // CLI UX 相关任务 → marquez
      { pattern: 'cli-ux', agents: ['@marquez'], description: '交互设计、文案、间距、可发现性、UX 门禁' },
      // TUI 相关任务 → cheritto
      { pattern: 'tui', agents: ['@cheritto'], description: 'Ink 组件、布局、输入处理、焦点管理' },
      // E2E 测试相关任务 → breedan
      { pattern: 'e2e-tests', agents: ['@breedan'], description: 'node-pty 工具、Gherkin 功能、帧快照' },
      // 无障碍相关任务 → nate
      { pattern: 'accessibility', agents: ['@nate'], description: '键盘导航、颜色对比度、错误引导' },
      // 对抗性 QA 相关任务 → waingro
      { pattern: 'hostile-qa', agents: ['@waingro'], description: '对抗性测试、边界情况、回归场景' },
    ],
    defaultAgent: '@keaton',  // 默认智能体（当没有规则匹配时）
    fallback: 'coordinator',  // 回退策略
  }),

  // 角色分配策略
  casting: defineCasting({
    // 允许的角色宇宙（命名空间）
    allowlistUniverses: ['The Usual Suspects', 'Breaking Bad', 'The Wire', 'Firefly'],
    // 溢出策略：当角色耗尽时使用通用角色
    overflowStrategy: 'generic',
  }),
});
