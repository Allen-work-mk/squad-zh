---
name: github-multi-account
description: 检测并设置多账户 GitHub 的账户锁定 gh 别名。AI 读取此技能，检测账户，询问用户哪个是个人/工作，并自动运行设置。
confidence: high
source: https://github.com/tamirdresher/squad-skills/tree/main/plugins/github-multi-account
author: tamirdresher
---

# GitHub 多账户 —— AI 驱动设置

## 何时激活
当用户有多个 GitHub 账户时（用 `gh auth status` 检查）。如果你看到列出 2+ 个账户，此技能适用。

## 做什么（作为 AI 智能体）

### 第 1 步：检测账户
运行：`gh auth status`
查找多个账户。记下列出的用户名。

### 第 2 步：询问用户
询问："我看到你有多个 GitHub 账户：{列出它们}。哪个是你的个人账户，哪个是你的工作/EMU 账户？"

### 第 3 步：自动运行设置
一旦用户确认，为他们做所有这些：

```powershell
# 1. 定义函数
$personal = "THEIR_PERSONAL_USERNAME"
$work = "THEIR_WORK_USERNAME"

# 2. 添加到 PowerShell 配置文件
$profilePath = $PROFILE.CurrentUserAllHosts
if (!(Test-Path $profilePath)) { New-Item -Path $profilePath -Force | Out-Null }
$existing = Get-Content $profilePath -Raw -ErrorAction SilentlyContinue
if ($existing -notmatch "gh-personal") {
    $block = @"

# === GitHub 多账户别名 ===
function gh-personal { gh auth switch --user $personal 2>`$null | Out-Null; gh @args }
function gh-work { gh auth switch --user $work 2>`$null | Out-Null; gh @args }
Set-Alias ghp gh-personal
Set-Alias ghw gh-work
"@
    Add-Content -Path $profilePath -Value $block
}

# 3. 创建 CMD 包装器
$binDir = Join-Path $env:USERPROFILE ".squad\bin"
if (!(Test-Path $binDir)) { New-Item -ItemType Directory -Path $binDir -Force | Out-Null }
"@echo off`ngh auth switch --user $personal >nul 2>&1`ngh %*" | Out-File "$binDir\ghp.cmd" -Encoding ascii
"@echo off`ngh auth switch --user $work >nul 2>&1`ngh %*" | Out-File "$binDir\ghw.cmd" -Encoding ascii

# 4. 添加到 PATH
$userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($userPath -notmatch [regex]::Escape($binDir)) {
    [Environment]::SetEnvironmentVariable("PATH", "$binDir;$userPath", "User")
    $env:PATH = "$binDir;$env:PATH"
}

# 5. 在当前会话中加载
function gh-personal { gh auth switch --user $personal 2>$null | Out-Null; gh @args }
function gh-work { gh auth switch --user $work 2>$null | Out-Null; gh @args }
Set-Alias ghp gh-personal
Set-Alias ghw gh-work
```

### 第 4 步：为用户验证
运行这些并显示结果：
```powershell
ghp api user --jq '.login'   # 应该显示个人账户名
ghw api user --jq '.login'   # 应该显示工作账户名
```

### 第 5 步：告诉用户
"全部设置好了！从现在开始，个人仓库使用 `ghp`，工作仓库使用 `ghw`。我也会使用它们。"

## 设置后 —— 使用规则

1. **永远不要**使用裸 `gh` 进行仓库操作 —— 总是使用 `ghp` 或 `ghw`
2. **永远不要**手动 `gh auth switch` —— 别名处理它
3. 通过仓库所有者确定别名：
   - 个人账户仓库 → `ghp` / `gh-personal`
   - 工作/EMU 账户仓库 → `ghw` / `gh-work`

## 仓库特定账户绑定

此仓库（`bradygaster/squad`）绑定到 **bradygaster**（个人）账户。
此仓库中的所有 `gh` 操作必须使用 `ghp` / `gh-personal`。

## 对于 Squad 智能体
在任何触及 GitHub 的脚本顶部，定义：
```powershell
function gh-personal { gh auth switch --user bradygaster 2>$null | Out-Null; gh @args }
function gh-work { gh auth switch --user bradyg_microsoft 2>$null | Out-Null; gh @args }
```
