# 内置基础角色

## 概述

- Squad 附带 20 个精选的基础角色，涵盖软件开发和业务运营。
- 基础角色提供开箱即用的深入、实质性的 charter 内容 —— 无需 LLM 生成。
- 在团队选角期间，基础角色作为起点，根据你的项目上下文进行细化。
- 角色内容改编自 [agency-agents](https://github.com/msitarzewski/agency-agents) by AgentLand Contributors（MIT 许可证）。

## 为什么使用基础角色？

- **更快的设置** —— 确定性角色选择而非 LLM 即兴发挥。
- **更低的 token 成本** —— 基础内容提供 90% 的 charter；只有项目特定的细化需要 LLM。
- **更高的质量** —— 策划的专长、边界和声音，而非通用样板。
- **广泛的覆盖** —— 不仅是软件开发；营销、销售、产品、游戏开发等等。

## 软件开发角色（12个）

| 表情 | ID | 标题 | 风格 |
|-------|----|-------|------|
| 🏗️ | `lead` | 组长 / 架构师 | 设计在构建它们的团队之后仍能存活的系统。每个决策都有权衡 —— 说出来。 |
| ⚛️ | `frontend` | 前端开发 | 以像素级精度构建响应式、可访问的 Web 应用。 |
| 🔧 | `backend` | 后端开发 | 设计支撑一切的系统 —— 数据库、API、云、规模。 |
| 💻 | `fullstack` | 全栈开发 | 看到全貌 —— 从数据库到像素。 |
| 👁️ | `reviewer` | 代码审查员 | 像导师一样审查代码，而非守门人。每条评论都教一些东西。 |
| 🧪 | `tester` | 测试工程师 | 在用户之前破坏你的 API。 |
| ⚙️ | `devops` | DevOps 工程师 | 自动化基础设施，让你的团队更快交付、睡得更好。 |
| 🔒 | `security` | 安全工程师 | 建模威胁、审查代码、设计真正稳固的安全架构。 |
| 📊 | `data` | 数据工程师 | 用表和查询思考。先规范化，当数字要求时反规范化。 |
| 📝 | `docs` | 技术编写者 | 将复杂性转化为清晰。如果文档错了，产品就错了。 |
| 🤖 | `ai` | AI / ML 工程师 | 构建学习、推理和适应的智能系统。 |
| 🎨 | `designer` | UI/UX 设计师 | 像素感知、用户痴迷。如果看起来差一个像素，那就是差一个像素。 |

## 业务与运营角色（8个）

| 表情 | ID | 标题 | 风格 |
|-------|----|-------|------|
| 📣 | `marketing-strategist` | 营销策略师 | 通过内容和渠道推动增长 —— 每个帖子都有目的。 |
| 💼 | `sales-strategist` | 销售策略师 | 以战略精准达成交易 —— 在推销解决方案之前了解买家。 |
| 📋 | `product-manager` | 产品经理 | 塑造构建什么和为什么 —— 每个功能都赢得它的位置。 |
| 📅 | `project-manager` | 项目经理 | 让火车保持在轨道上 —— 范围、时间表和理智。 |
| 🎧 | `support-specialist` | 支持专员 | 用户的第一道防线 —— 快速解决，记录一切。 |
| 🎮 | `game-developer` | 游戏开发者 | 构建玩家想居住的世界 —— 每个机制都服务于体验。 |
| 📺 | `media-buyer` | 媒体购买员 | 跨广告渠道最大化 ROI —— 每美元跟踪，每次展示测量。 |
| ⚖️ | `compliance-legal` | 合规与法律 | 确保你安全合法地交付 —— 合规是功能，不是阻碍。 |

## 使用基础角色

### 在 Init 期间

```bash
$ squad init
你在构建什么？> 一个带 Stripe 集成的 React + Node.js API

建议的团队：
  🏗️  组长 / 架构师
  ⚛️  前端开发
  🔧  后端开发
  🧪  测试工程师

看起来对吗？[是] [添加某人] [更改角色] [浏览所有角色]
```

### 在 squad.config.ts 中（SDK 模式）

```typescript
import { useRole, defineSquad } from '@bradygaster/squad-sdk';

export default defineSquad({
  agents: [
    useRole('lead', { name: 'ripley' }),
    useRole('frontend', { name: 'dallas' }),
    useRole('backend', { name: 'kane', expertise: ['Node.js', 'PostgreSQL', 'Stripe API'] }),
    useRole('tester', { name: 'lambert' }),
  ],
});
```

### CLI：浏览角色

```bash
$ squad roles                          # 列出所有 20 个角色
$ squad roles --category engineering   # 按类别筛选
$ squad roles --search "security"      # 按关键词搜索
```

## 定制

- 通过 `useRole()` 选项覆盖专长、风格、声音或边界。
- 用 `extraOwnership`/`extraApproach` 添加额外的所有权或方法项。
- 基础角色是起点 —— 协调器在选角期间为你的项目上下文细化它们。

## 归属

内置角色内容改编自 [agency-agents](https://github.com/msitarzewski/agency-agents) by AgentLand Contributors，根据 MIT 许可证发布。
