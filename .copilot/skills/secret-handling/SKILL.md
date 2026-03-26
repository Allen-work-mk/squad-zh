---
name: secret-handling
description: 永远不要读取 .env 文件或将密钥写入 .squad/ 提交的文件
domain: security, file-operations, team-collaboration
confidence: high
source: earned (issue #267 —— 凭据泄漏事件)
---

## 上下文

生成的智能体拥有对整个仓库的读取权限，包括包含实时凭据的 `.env` 文件。如果智能体读取密钥并将它们写入 `.squad/` 文件（决策、日志、历史），书记员会自动将它们提交到 git，暴露在远程历史中。此技能将绝对禁止和安全替代方案编纂成文。

## 模式

### 禁止的文件读取

**永远不要读取这些文件：**
- `.env`（生产密钥）
- `.env.local`（本地开发密钥）
- `.env.production`（生产环境）
- `.env.development`（开发环境）
- `.env.staging`（暂存环境）
- `.env.test`（带有真实凭据的测试环境）
- 任何匹配 `.env.*` 的文件，除非明确允许（见下文）

**允许的替代方案：**
- `.env.example`（安全 —— 包含占位值，无真实密钥）
- `.env.sample`（安全 —— 文档模板）
- `.env.template`（安全 —— 模式/结构参考）

**如果你需要配置信息：**
1. **直接询问用户** —— "数据库连接字符串是什么？"
2. **读取 `.env.example`** —— 显示结构而不暴露密钥
3. **阅读文档** —— 检查 `README.md`、`docs/`、配置指南

**永远不要假设你可以"偷看 .env 来理解模式。"** 使用 `.env.example` 或询问。

### 禁止的输出模式

**永远不要将这些写入 `.squad/` 文件：**

| 模式类型 | 示例 | 正则表达式模式（用于扫描） |
|--------------|----------|-------------------------------|
| API 密钥 | `OPENAI_API_KEY=sk-proj-...`, `GITHUB_TOKEN=ghp_...` | `[A-Z_]+(?:KEY|TOKEN|SECRET)=[^\s]+` |
| 密码 | `DB_PASSWORD=super_secret_123`, `password: "..."` | `(?:PASSWORD|PASS|PWD)[:=]\s*["']?[^\s"']+` |
| 连接字符串 | `postgres://user:pass@host:5432/db`, `Server=...;Password=...` | `(?:postgres|mysql|mongodb)://[^@]+@|(?:Server|Host)=.*(?:Password|Pwd)=` |
| JWT 令牌 | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | `eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+` |
| 私钥 | `-----BEGIN PRIVATE KEY-----`, `-----BEGIN RSA PRIVATE KEY-----` | `-----BEGIN [A-Z ]+PRIVATE KEY-----` |
| AWS 凭据 | `AKIA...`, `aws_secret_access_key=...` | `AKIA[0-9A-Z]{16}|aws_secret_access_key=[^\s]+` |
| 电子邮件地址 | `user@example.com`（根据团队决策的 PII 违规） | `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}` |

**应该写什么：**
- 占位值：`DATABASE_URL=<在 .env 中设置>`
- 编辑引用：`API 密钥已配置（参见 .env.example）`
- 架构注释："应用使用 JWT 认证 —— 令牌存储在会话中"
- 模式文档："需要 OPENAI_API_KEY、GITHUB_TOKEN（格式参见 .env.example）"

### 书记员预提交验证

**在提交 `.squad/` 更改之前，书记员必须：**

1. **扫描所有暂存文件** 查找密钥模式（使用上面的正则表）
2. **检查禁止的文件名**（即使手动暂存也不要提交 `.env`）
3. **如果检测到密钥：**
   - 停止提交（不要继续）
   - 从暂存中移除文件：`git reset HEAD <file>`
   - 向用户报告：
     ```
     🚨 检测到密钥 —— 提交被阻止
     
     文件：.squad/decisions/inbox/river-db-config.md
     模式：DATABASE_URL=postgres://user:password@localhost:5432/prod
     
     此文件包含凭据，不得提交。
     请移除密钥，替换为占位符，然后重试。
     ```
   - 以错误退出（从不静默跳过）

4. **如果没有检测到密钥：**
   - 正常继续提交

**书记员的实现说明：**
- 暂存文件后运行验证，调用 `git commit` 之前
- 使用 PowerShell `Select-String` 或 `git diff --cached` 扫描暂存内容
- 大声失败 —— 密钥泄漏是不可接受的，阻止提交是正确的行为

### 补救 —— 如果密钥已提交

**如果你在 git 历史中发现密钥：**

1. **立即停止** —— 不要进行更多提交
2. **提醒用户：**
   ```
   🚨 检测到凭据泄漏
   
   在 git 历史中发现密钥：
   提交：abc1234
   文件：.squad/decisions/inbox/agent-config.md
   模式：API_KEY=sk-proj-...
   
   这需要立即补救：
   1. 撤销暴露的凭据（重新生成 API 密钥，轮换密码）
   2. 从 git 历史中移除（git filter-repo 或 BFG）
   3. 强制推送清理后的历史
   
   在解决之前不要继续新工作。
   ```
3. **不要试图自己修复** —— 密钥移除需要专用工具
4. **等待用户确认**后再恢复工作

## 示例

### ✓ 正确：读取配置模式

**智能体需要知道需要什么环境变量：**

```
智能体："这个应用需要什么环境变量？"
→ 读取 `.env.example`：
    OPENAI_API_KEY=sk-...
    DATABASE_URL=postgres://user:pass@localhost:5432/db
    REDIS_URL=redis://localhost:6379

→ 写入 .squad/decisions/inbox/river-env-setup.md：
    "应用需要三个环境变量：
    - OPENAI_API_KEY（OpenAI API 密钥，格式：sk-...）
    - DATABASE_URL（Postgres 连接字符串）
    - REDIS_URL（Redis 连接字符串）
    完整模式参见 .env.example。"
```

### ✗ 错误：读取实时凭据

**智能体需要知道数据库模式：**

```
智能体：（读取 .env）
    DATABASE_URL=postgres://admin:super_secret_pw@prod.example.com:5432/appdb

→ 写入 .squad/decisions/inbox/river-db-schema.md：
    "数据库连接：postgres://admin:super_secret_pw@prod.example.com:5432/appdb"
    
🚨 违规：实时凭据写入提交的文件
```

**正确方法：**
```
智能体：（读取 .env.example 或询问用户）
用户："它是 Postgres 数据库，模式在 migrations/ 中"

→ 写入 .squad/decisions/inbox/river-db-schema.md：
    "数据库：Postgres（连接在 .env 中配置）。模式定义在 db/migrations/ 中。"
```

### ✓ 正确：书记员预提交验证

**书记员即将提交：**

```powershell
# 暂存文件
git add .squad/

# 扫描暂存内容查找密钥
$stagedContent = git diff --cached
$secretPatterns = @(
    '[A-Z_]+(?:KEY|TOKEN|SECRET)=[^\s]+',
    '(?:PASSWORD|PASS|PWD)[:=]\s*["'']?[^\s"'']+',
    'eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+'
)

$detected = $false
foreach ($pattern in $secretPatterns) {
    if ($stagedContent -match $pattern) {
        $detected = $true
        Write-Host "🚨 检测到密钥：$($matches[0])"
        break
    }
}

if ($detected) {
    # 从暂存中移除，报告，退出
    git reset HEAD .squad/
    Write-Error "提交被阻止 —— 暂存文件中检测到密钥"
    exit 1
}

# 安全提交
git commit -F $msgFile
```

## 反模式

- ❌ 读取 `.env`"只是为了检查模式" —— 改用 `.env.example`
- ❌ 写入"清理过的"连接字符串，仍然包含凭据
- ❌ 假设"它只是开发环境"使密钥安全提交
- ❌ 先提交，后扫描 —— 验证必须在提交前发生
- ❌ 静默跳过密钥检测 —— 大声失败，永不静默
- ❌ 信任智能体"更清楚" —— 在多层强制执行（提示、钩子、架构）
- ❌ 将密钥写入 `.squad/` 中的"临时"文件 —— 书记员提交所有 `.squad/` 更改
- ❌ 从连接字符串中提取"只有主机" —— 仍然泄漏基础设施拓扑
