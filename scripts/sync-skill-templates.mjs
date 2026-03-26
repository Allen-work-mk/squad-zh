#!/usr/bin/env node
/**
 * sync-skill-templates.mjs —— 同步技能模板到 CLI 和 SDK 包
 * 
 * 此脚本将 .squad/skills/ 目录下的技能模板同步到：
 * - packages/squad-cli/templates/skills/
 * - packages/squad-sdk/templates/skills/
 */

import { readdirSync, cpSync, existsSync, statSync } from 'fs';  // 文件系统操作
import { join } from 'path';                                      // 路径处理
import { fileURLToPath } from 'url';                              // URL 转文件路径
import { dirname } from 'path';                                   // 获取目录名

const __filename = fileURLToPath(import.meta.url);  // 当前文件路径
const __dirname = dirname(__filename);              // 当前文件所在目录
const rootDir = join(__dirname, '..');              // 项目根目录

// 技能模板源目录
const skillsSourceDir = join(rootDir, '.squad', 'skills');
// 目标目录列表
const targets = [
  join(rootDir, 'packages', 'squad-cli', 'templates', 'skills'),
  join(rootDir, 'packages', 'squad-sdk', 'templates', 'skills')
];

console.log('🔄 正在从规范源同步技能模板...\n');

// 检查源目录是否存在
if (!existsSync(skillsSourceDir)) {
  console.error(`❌ 找不到源目录: ${skillsSourceDir}`);
  process.exit(1);
}

// 获取所有技能目录名称
const skillDirs = readdirSync(skillsSourceDir).filter(name => {
  const fullPath = join(skillsSourceDir, name);
  return statSync(fullPath).isDirectory();  // 只保留目录
});

// 如果没有找到技能
if (skillDirs.length === 0) {
  console.log('⚠️  源目录中没有找到技能');
  process.exit(0);
}

console.log(`📁 找到 ${skillDirs.length} 个技能: ${skillDirs.join(', ')}\n`);

// 同步到每个目标目录
for (const target of targets) {
  console.log(`📦 同步到: ${target}`);
  
  for (const skillName of skillDirs) {
    const sourcePath = join(skillsSourceDir, skillName);  // 源路径
    const destPath = join(target, skillName);             // 目标路径
    
    try {
      // 递归复制目录（强制覆盖）
      cpSync(sourcePath, destPath, { recursive: true, force: true });
      console.log(`  ✅ ${skillName}`);
    } catch (err) {
      console.error(`  ❌ ${skillName}: ${err.message}`);
      process.exit(1);
    }
  }
  
  console.log('');
}

console.log('✅ 技能模板同步完成');
