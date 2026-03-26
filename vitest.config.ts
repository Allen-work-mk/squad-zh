// Vitest 测试配置文件
// Vitest 是一个基于 Vite 的测试框架，提供快速的单元测试

import { defineConfig } from 'vitest/config';  // 导入 Vitest 配置定义函数

export default defineConfig({
  resolve: {
    // 强制 Vitest 从工作区根目录解析 @bradygaster/squad-sdk，
    // 而不是从 packages/squad-cli/node_modules/ 下的重复副本解析。
    // 没有这个配置，vi.mock('@bradygaster/squad-sdk') 会针对根目录副本，
    // 但被测代码会从重复副本导入 —— 绕过 mock。
    dedupe: ['@bradygaster/squad-sdk'],
  },
  test: {
    // 包含的测试文件模式
    include: ['test/**/*.test.ts'],
    coverage: {
      // 覆盖率提供者：v8（Node.js 内置）
      provider: 'v8',
      // 覆盖率报告格式
      reporter: ['text', 'text-summary', 'html'],
      // 覆盖率报告输出目录
      reportsDirectory: './coverage',
      // 包含在覆盖率统计中的文件
      include: ['src/**/*.ts', 'packages/*/src/**/*.ts'],
      // 排除在覆盖率统计外的文件
      exclude: ['**/*.test.ts', '**/*.d.ts', '**/node_modules/**'],
    },
  },
});
