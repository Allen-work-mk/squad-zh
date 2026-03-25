# 市场指南

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

**Issue:** #39 (M5-16)

---

## 概述

Squad 市场让团队导出、导入、浏览和安装智能体配置。本指南涵盖完整的生命周期：打包、发布、发现、安装、版本控制、缓存和安全。

## 导出 / 导入

将你的 Squad 配置导出为可移植捆绑包：

```typescript
import { exportSquadConfig, importSquadConfig } from '@squad/sdk';

// 导出
const bundle = await exportSquadConfig(config, {
  includeHistory: false,
  anonymize: true,
  format: 'json',
});

// 导入到另一个项目
const result = await importSquadConfig(bundle, targetDir, {
  merge: true,
  dryRun: false,
});
console.log(`应用了 ${result.changes.length} 个更改`);
```

`ExportBundle` 包含配置、智能体、技能、路由规则和元数据。`splitHistory()` 将可分享的历史与私有数据分开。`detectConflicts()` 识别合并冲突；`resolveConflicts()` 应用解决策略（`keep-existing`、`use-incoming`、`merge`、`manual`）。

## 智能体仓库

将智能体固定到特定版本以实现可复现的团队：

```typescript
import { pinAgentVersion, getAgentVersion, configureAgentRepo } from '@squad/sdk';

await pinAgentVersion({ agentId: 'backend', sha: 'abc123', source: 'github' });
const pin = await getAgentVersion('backend');
// { agentId: 'backend', sha: 'abc123', timestamp: ..., source: 'github' }
```

`configureAgentRepo()` 验证 GitHub 仓库配置。`AgentRepoOperations` 提供智能体定义的推送/拉取。

## 版本控制和缓存

`AgentCache` 为远程智能体定义提供基于 TTL 的缓存：

- 智能体定义：1小时 TTL（`DEFAULT_AGENT_TTL`）
- 技能：5分钟 TTL（`DEFAULT_SKILL_TTL`）
- `CacheStats` 跟踪命中、未命中、驱逐和大小

`parseSemVer()` 和 `compareSemVer()` 处理版本比较。`bumpVersion()` 支持 major/minor/patch/prerelease 增量。

## 安全

7 条安全规则（`SECURITY_RULES`）在安装前验证远程智能体：

```typescript
import { validateRemoteAgent, generateSecurityReport } from '@squad/sdk';

const report = await validateRemoteAgent(agentDefinition);
if (report.blocked.length > 0) {
  console.error('智能体被阻止:', report.blocked);
  const sanitized = quarantineAgent(agentDefinition);
}
```

`SecurityReport` 包括每条规则的通过/失败、警告、被阻止项目和 `riskScore`。`quarantineAgent()` 剥离注入尝试并限制工具权限。规则检查：提示注入、过度权限、可疑工具模式等。

## 市场浏览和安装

`MarketplaceBrowser` 提供基于 CLI 的发现：
