#!/usr/bin/env node
/**
 * bump-build.mjs —— 在每次构建前自动递增构建号
 *
 * 版本格式: major.minor.patch-prerelease.build（有效的 semver）
 *   例如: 0.8.6-preview.1 → 0.8.6-preview.2
 *
 * 如果不存在构建号（例如 0.8.6-preview），从 1 开始。
 * 非预发布版本使用: major.minor.patch-build.N（有效的 semver）
 * 同时更新所有 3 个 package.json 文件（根目录 + 两个工作区）。
 *
 * 通过设置 SKIP_BUILD_BUMP=1 跳过此脚本（用于 CI/CD 发布）。
 */

import { readFileSync, writeFileSync } from 'node:fs';   // 文件系统操作
import { join, dirname } from 'node:path';              // 路径处理
import { fileURLToPath } from 'node:url';               // URL 转文件路径

// 如果设置了 SKIP_BUILD_BUMP 则跳过构建号递增（例如 CI/CD 发布）
if (process.env.SKIP_BUILD_BUMP === '1' || process.env.CI === 'true') {
  console.log('⏭️  跳过构建号递增（CI 模式）');
  process.exit(0);
}

// 获取当前文件所在目录
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');  // 项目根目录

// 需要更新的 package.json 文件路径列表
const PACKAGE_PATHS = [
  join(root, 'package.json'),                          // 根目录
  join(root, 'packages', 'squad-sdk', 'package.json'), // SDK 包
  join(root, 'packages', 'squad-cli', 'package.json'), // CLI 包
];

// 解析版本号: "major.minor.patch-prerelease.build" 或 "major.minor.patch.build"
// 非预发布版本现在生成 "major.minor.patch-build.N"（有效的 semver）
function parseVersion(version) {
  // 尝试预发布格式: "1.2.3-tag" 或 "1.2.3-tag.N"
  let match = version.match(/^(\d+\.\d+\.\d+)(-[a-zA-Z][a-zA-Z0-9-]*)(?:\.(\d+))?$/);
  if (match) {
    return {
      base: match[1],                     // 基础版本，例如 "0.8.6"
      prerelease: match[2],               // 预发布标签，例如 "-preview"
      build: match[3] ? parseInt(match[3], 10) : 0,  // 构建号，默认为 0
    };
  }
  // 非预发布格式: "1.2.3" 或 "1.2.3.N"
  match = version.match(/^(\d+\.\d+\.\d+)(?:\.(\d+))?$/);
  if (match) {
    return {
      base: match[1],
      prerelease: '',
      build: match[2] ? parseInt(match[2], 10) : 0,
    };
  }
  throw new Error(`无法解析版本号: ${version}`);
}

// 格式化版本号
function formatVersion({ base, build, prerelease }) {
  if (prerelease) {
    return `${base}${prerelease}.${build}`;  // 预发布格式
  }
  // 使用预发布标签以符合有效 semver（npm 拒绝 4 部分版本如 0.8.25.4）
  return `${base}-build.${build}`;  // 构建标签格式
}

// 从根 package.json 读取规范版本号
const rootPkg = JSON.parse(readFileSync(PACKAGE_PATHS[0], 'utf8'));
const parsed = parseVersion(rootPkg.version);
parsed.build += 1;  // 递增构建号
const newVersion = formatVersion(parsed);

// 更新所有 package.json 文件
for (const pkgPath of PACKAGE_PATHS) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.version = newVersion;  // 设置新版本
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

console.log(`构建 ${parsed.build}: ${rootPkg.version} → ${newVersion}`);
