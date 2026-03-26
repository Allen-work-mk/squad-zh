// ESLint 配置文件
// ESLint 是一个静态代码分析工具，用于识别 JavaScript/TypeScript 代码中的问题

import tsParser from "@typescript-eslint/parser";      // TypeScript 解析器
import tsPlugin from "@typescript-eslint/eslint-plugin"; // TypeScript ESLint 插件
import nPlugin from "eslint-plugin-n";                   // Node.js 特定规则插件

export default [
  {
    // 忽略的文件和目录
    ignores: ["**/node_modules/**", "**/dist/**", "**/.squad/**"],
  },

  // 源码包配置 —— 通过 tsconfig 项目服务启用类型感知规则
  {
    // 匹配的文件
    files: ["packages/**/*.ts", "packages/**/*.tsx"],
    languageOptions: {
      parser: tsParser,  // 使用 TypeScript 解析器
      parserOptions: {
        projectService: true,                  // 启用项目服务（类型感知）
        tsconfigRootDir: import.meta.dirname, // tsconfig 根目录
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,  // TypeScript 规则
      n: nPlugin,                      // Node.js 规则
    },
    rules: {
      // 捕获未处理的 Promise 和缺少 await 的情况
      "@typescript-eslint/no-floating-promises": "warn",

      // 标记函数内的同步 I/O（allowAtRootLevel 允许模块级配置代码中的同步调用）
      "n/no-sync": ["warn", { allowAtRootLevel: true }],

      // 禁止生产环境中的 console.log；允许 warn/error
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // 测试文件配置 —— 无 tsconfig 覆盖，仅使用非类型感知规则
  {
    files: ["test/**/*.ts"],
    languageOptions: {
      parser: tsParser,  // 使用 TypeScript 解析器（无类型检查）
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // 禁止 console.log；允许 warn/error
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
