# 技能：CLI 命令布线

**Bug 类别：** 在 `packages/squad-cli/src/cli/commands/` 中实现但从未在 `cli-entry.ts` 中路由的命令。

## 清单 —— 添加新 CLI 命令

1. **在 `packages/squad-cli/src/cli/commands/<name>.ts` 中创建命令文件**
   - 导出 `run<Name>(cwd, options)` 异步函数（或类的静态方法用于工具模块）

2. **在 `packages/squad-cli/src/cli-entry.ts` 中的 `main()` 内添加路由块**：
   ```ts
   if (cmd === '<name>') {
     const { run<Name> } = await import('./cli/commands/<name>.js');
     // 解析参数，调用函数
     await run<Name>(process.cwd(), options);
     return;
   }
   ```

3. **在 `cli-entry.ts` 的帮助部分添加帮助文本**（搜索 `Commands:`）：
   ```ts
   console.log(`  ${BOLD}<name>${RESET}     <description>`);
   console.log(`             Usage: <name> [flags]`);
   ```

4. **验证两者都存在** —— 重复出现的 bug 是做了步骤 1 但遗漏了步骤 2-3。

## 按命令类型的布线模式

| 类型 | 示例 | 如何布线 |
|------|---------|-------------|
| 标准命令 | `export.ts`, `build.ts` | `run*()` 函数，从 `args` 解析标志 |
| 占位命令 | `loop`, `hire` | 内联在 cli-entry.ts 中，打印待处理消息 |
| 工具/检查模块 | `rc-tunnel.ts`, `copilot-bridge.ts` | 作为诊断检查布线（例如 `isDevtunnelAvailable()`） |
| 另一个的子命令 | `init-remote.ts` | 已在父级内使用 + 独立别名 |

## 常见导入模式

```ts
import { BOLD, RESET, DIM, RED, GREEN, YELLOW } from './cli/core/output.js';
```

对命令模块使用动态 `await import()` 以保持启动快速（懒加载）。

## 历史

- **#237 / PR #244：** 4 个命令已布线（rc、copilot-bridge、init-remote、rc-tunnel）。aspire、link、loop、hire 已存在。
