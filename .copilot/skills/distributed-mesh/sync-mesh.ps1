# sync-mesh.ps1 —— 将远程 squad 状态具体化到本地
#
# 读取 mesh.json，将远程 squads 获取到本地目录。
# 在智能体读取前运行。无守护进程。无服务。约 40 行。
#
# 用法: .\sync-mesh.ps1 [mesh.json 路径]
#        .\sync-mesh.ps1 -Init [mesh.json 路径]
# 需要: git
param(
    [switch]$Init,                              # 初始化模式开关
    [string]$MeshJson = "mesh.json"             # mesh.json 文件路径，默认为当前目录下的 mesh.json
)
$ErrorActionPreference = "Stop"                 # 设置错误处理：遇到错误立即停止

# 处理 -Init 模式（初始化网格状态仓库）
if ($Init) {
    if (-not (Test-Path $MeshJson)) {            # 检查 mesh.json 文件是否存在
        Write-Host "❌ 找不到 $MeshJson"
        exit 1
    }
    
    Write-Host "🚀 正在初始化网格状态仓库..."
    $config = Get-Content $MeshJson -Raw | ConvertFrom-Json   # 读取并解析 JSON 配置
    $squads = $config.squads.PSObject.Properties.Name         # 获取所有 squad 名称
    
    # 创建 squad 目录并放置占位符 SUMMARY.md
    foreach ($squad in $squads) {
        if (-not (Test-Path $squad)) {           # 如果目录不存在则创建
            New-Item -ItemType Directory -Path $squad | Out-Null
            Write-Host "  ✓ 已创建 $squad/"
        } else {
            Write-Host "  • $squad/ 已存在（跳过）"
        }
        
        $summaryPath = "$squad/SUMMARY.md"       # 占位符状态文件路径
        if (-not (Test-Path $summaryPath)) {     # 如果文件不存在则创建
            "# $squad`n`n_尚未发布状态。_" | Set-Content $summaryPath
            Write-Host "  ✓ 已创建 $summaryPath"
        } else {
            Write-Host "  • $summaryPath 已存在（跳过）"
        }
    }
    
    # 生成根目录 README.md
    if (-not (Test-Path "README.md")) {
        $readme = @"
# Squad 网格状态仓库

此仓库跟踪来自参与 squads 的已发布状态。

## 参与的 Squads

"@
        foreach ($squad in $squads) {            # 遍历所有 squad 添加到 README
            $zone = $config.squads.$squad.zone   # 获取 squad 所属区域
            $readme += "- **$squad** (区域: $zone)`n"
        }
        $readme += @"

每个 squad 目录包含一个 ``SUMMARY.md``，其中包含其最新发布的状态。
状态使用 ``sync-mesh.sh`` 或 ``sync-mesh.ps1`` 进行同步。
"@
        $readme | Set-Content "README.md"
        Write-Host "  ✓ 已创建 README.md"
    } else {
        Write-Host "  • README.md 已存在（跳过）"
    }
    
    Write-Host ""
    Write-Host "✅ 网格状态仓库已初始化"
    exit 0
}

$config = Get-Content $MeshJson -Raw | ConvertFrom-Json   # 解析 mesh.json 配置

# 区域 2：远程-信任 —— git clone/pull
foreach ($entry in $config.squads.PSObject.Properties | Where-Object { $_.Value.zone -eq "remote-trusted" }) {
    $squad  = $entry.Name                        # squad 名称
    $source = $entry.Value.source                # Git 仓库源地址
    $ref    = if ($entry.Value.ref) { $entry.Value.ref } else { "main" }   # 分支/标签，默认为 main
    $target = $entry.Value.sync_to               # 本地同步目标路径

    if (Test-Path "$target/.git") {             # 如果已存在 git 仓库则执行 pull
        git -C $target pull --rebase --quiet 2>$null
        if ($LASTEXITCODE -ne 0) { Write-Host "⚠ ${squad}: pull 失败（使用旧的）" }
    } else {                                     # 否则执行 clone
        New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
        git clone --quiet --depth 1 --branch $ref $source $target 2>$null
        if ($LASTEXITCODE -ne 0) { Write-Host "⚠ ${squad}: clone 失败（不可用）" }
    }
}

# 区域 3：远程-不透明 —— 获取已发布的契约
foreach ($entry in $config.squads.PSObject.Properties | Where-Object { $_.Value.zone -eq "remote-opaque" }) {
    $squad  = $entry.Name                        # squad 名称
    $source = $entry.Value.source                # HTTP 源地址（SUMMARY.md URL）
    $target = $entry.Value.sync_to               # 本地同步目标路径
    $auth   = $entry.Value.auth                  # 认证类型（可选）

    New-Item -ItemType Directory -Force -Path $target | Out-Null   # 确保目标目录存在
    $params = @{ Uri = $source; OutFile = "$target/SUMMARY.md"; UseBasicParsing = $true }  # HTTP 请求参数
    if ($auth -eq "bearer") {                   # 如果需要 Bearer 认证
        $tokenVar = ($squad.ToUpper() -replace '-', '_') + "_TOKEN"   # 构造环境变量名
        $token = [Environment]::GetEnvironmentVariable($tokenVar)     # 从环境变量获取令牌
        if ($token) { $params.Headers = @{ Authorization = "Bearer $token" } }  # 添加认证头
    }
    try { Invoke-WebRequest @params -ErrorAction Stop }   # 尝试下载
    catch { "# ${squad} —— 不可用 ($(Get-Date))" | Set-Content "$target/SUMMARY.md" }  # 失败时创建占位符
}

Write-Host "✓ 网格同步完成"
