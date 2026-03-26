#!/usr/bin/env node
/**
 * sync-templates.mjs —— 从 .squad-templates/ 复制规范模板
 * 到所有需要它们的目标目录。
 *
 * 目标目录:
 *   templates/                        (根目录镜像)
 *   packages/squad-cli/templates/     (CLI 包)
 *   packages/squad-sdk/templates/     (SDK 包)
 *   .github/agents/squad.agent.md     (GitHub 智能体 —— 仅 squad.agent.md)
 *
 * 只复制 .squad-templates/ 中存在的文件。
 * 不存在的目标目录会被跳过并显示警告。
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));  // 当前文件目录
const ROOT = join(__dirname, '..');                         // 项目根目录

const SOURCE = join(ROOT, '.squad-templates');              // 模板源目录

// 镜像目标目录列表
const MIRROR_TARGETS = [
  join(ROOT, 'templates'),                                  // 根目录模板
  join(ROOT, 'packages', 'squad-cli', 'templates'),        // CLI 包模板
  join(ROOT, 'packages', 'squad-sdk', 'templates'),        // SDK 包模板
];

// squad.agent.md 还会复制到 .github/agents/
const AGENT_MD_TARGET = join(ROOT, '.github', 'agents');
const AGENT_MD_FILE = 'squad.agent.md';

// ---------------------------------------------------------------------------
// 辅助函数
// ---------------------------------------------------------------------------

/**
 * 递归收集目录下所有文件的相对路径
 * @param {string} dir - 要扫描的目录
 * @param {string} base - 基础路径（用于递归）
 * @returns {string[]} 相对文件路径数组
 */
function collectFiles(dir, base = '') {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const rel = base ? join(base, entry.name) : entry.name;
    if (entry.isDirectory()) {
      // 递归收集子目录
      files.push(...collectFiles(join(dir, entry.name), rel));
    } else {
      files.push(rel);
    }
  }
  return files;
}

/**
 * 复制单个文件，按需创建父目录
 * @param {string} src - 源文件路径
 * @param {string} dest - 目标文件路径
 * @returns {boolean} 是否成功写入
 */
function copyFile(src, dest) {
  const content = readFileSync(src);
  const destDir = dirname(dest);
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });  // 递归创建目录
  }
  writeFileSync(dest, content);
  return true;
}

// ---------------------------------------------------------------------------
// 主程序
// ---------------------------------------------------------------------------

// 检查源目录是否存在
if (!existsSync(SOURCE)) {
  console.log('⏭️  .squad-templates/ 不存在 —— 无需同步');
  process.exit(0);
}

const sourceFiles = collectFiles(SOURCE);  // 收集所有源文件
let totalCopied = 0;

// 处理每个源文件
for (const relFile of sourceFiles) {
  const srcPath = join(SOURCE, relFile);
  const targets = [];

  // 镜像到每个目标目录
  for (const targetDir of MIRROR_TARGETS) {
    if (!existsSync(targetDir)) {
      // 跳过根目录不存在（例如包未检出）的目标
      continue;
    }
    targets.push(join(targetDir, relFile));
  }

  // 特殊情况: squad.agent.md 还会复制到 .github/agents/
  if (relFile === AGENT_MD_FILE && existsSync(AGENT_MD_TARGET)) {
    targets.push(join(AGENT_MD_TARGET, AGENT_MD_FILE));
  }

  if (targets.length === 0) continue;

  // 复制到所有目标
  for (const dest of targets) {
    copyFile(srcPath, dest);
  }

  totalCopied++;
  const label = targets.length === 1
    ? `1 个目标`
    : `${targets.length} 个目标`;
  console.log(`  ✅ ${relFile} → ${label}`);
}

console.log(`\n📋 从 .squad-templates/ 同步了 ${totalCopied} 个文件`);
