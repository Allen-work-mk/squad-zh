#!/usr/bin/env node
// CLI 入口文件 - 旧版兼容入口
// 当用户通过 npx/npm 调用时显示弃用警告

// 仅当通过 npx/npm 调用时显示弃用警告（不是直接 `node cli.js`）
if (process.env.npm_execpath) {
  console.error('\x1b[33m');  // 设置黄色文本颜色
  console.error('⚠  弃用警告');
  console.error('   npx github:bradygaster/squad 已弃用。');
  console.error('   请切换为：npm install -g @bradygaster/squad-cli');
  console.error('   或使用：   npx @bradygaster/squad-cli');
  console.error('\x1b[0m');  // 重置颜色
}

// 转发到构建后的 CLI 入口点（自动执行 main()）
import './packages/squad-cli/dist/cli-entry.js';
