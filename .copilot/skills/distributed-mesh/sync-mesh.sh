#!/bin/bash
# sync-mesh.sh —— 将远程 squad 状态具体化到本地
#
# 读取 mesh.json，将远程 squads 获取到本地目录。
# 在智能体读取前运行。无守护进程。无服务。约 40 行。
#
# 用法: ./sync-mesh.sh [mesh.json 路径]
#        ./sync-mesh.sh --init [mesh.json 路径]
# 需要: jq (https://github.com/jqlang/jq), git, curl

set -euo pipefail

# 处理 --init 模式
if [ "${1:-}" = "--init" ]; then
  MESH_JSON="${2:-mesh.json}"
  
  if [ ! -f "$MESH_JSON" ]; then
    echo "❌ 找不到 $MESH_JSON"
    exit 1
  fi
  
  echo "🚀 正在初始化网格状态仓库..."
  squads=$(jq -r '.squads | keys[]' "$MESH_JSON")
  
  # 创建 squad 目录并放置占位符 SUMMARY.md
  for squad in $squads; do
    if [ ! -d "$squad" ]; then
      mkdir -p "$squad"
      echo "  ✓ 已创建 $squad/"
    else
      echo "  • $squad/ 已存在（跳过）"
    fi
    
    if [ ! -f "$squad/SUMMARY.md" ]; then
      echo -e "# $squad\n\n_尚未发布状态。_" > "$squad/SUMMARY.md"
      echo "  ✓ 已创建 $squad/SUMMARY.md"
    else
      echo "  • $squad/SUMMARY.md 已存在（跳过）"
    fi
  done
  
  # 生成根目录 README.md
  if [ ! -f "README.md" ]; then
    {
      echo "# Squad 网格状态仓库"
      echo ""
      echo "此仓库跟踪来自参与 squads 的已发布状态。"
      echo ""
      echo "## 参与的 Squads"
      echo ""
      for squad in $squads; do
        zone=$(jq -r ".squads.\"$squad\".zone" "$MESH_JSON")
        echo "- **$squad** (区域: $zone)"
      done
      echo ""
      echo "每个 squad 目录包含一个 \`SUMMARY.md\`，其中包含其最新发布的状态。"
      echo "状态使用 \`sync-mesh.sh\` 或 \`sync-mesh.ps1\` 进行同步。"
    } > README.md
    echo "  ✓ 已创建 README.md"
  else
    echo "  • README.md 已存在（跳过）"
  fi
  
  echo ""
  echo "✅ 网格状态仓库已初始化"
  exit 0
fi

MESH_JSON="${1:-mesh.json}"

# 区域 2：远程-信任 —— git clone/pull
for squad in $(jq -r '.squads | to_entries[] | select(.value.zone == "remote-trusted") | .key' "$MESH_JSON"); do
  source=$(jq -r ".squads.\"$squad\".source" "$MESH_JSON")
  ref=$(jq -r ".squads.\"$squad\".ref // \"main\"" "$MESH_JSON")
  target=$(jq -r ".squads.\"$squad\".sync_to" "$MESH_JSON")

  if [ -d "$target/.git" ]; then
    git -C "$target" pull --rebase --quiet 2>/dev/null \
      || echo "⚠ $squad: pull 失败（使用旧的）"
  else
    mkdir -p "$(dirname "$target")"
    git clone --quiet --depth 1 --branch "$ref" "$source" "$target" 2>/dev/null \
      || echo "⚠ $squad: clone 失败（不可用）"
  fi
done

# 区域 3：远程-不透明 —— 获取已发布的契约
for squad in $(jq -r '.squads | to_entries[] | select(.value.zone == "remote-opaque") | .key' "$MESH_JSON"); do
  source=$(jq -r ".squads.\"$squad\".source" "$MESH_JSON")
  target=$(jq -r ".squads.\"$squad\".sync_to" "$MESH_JSON")
  auth=$(jq -r ".squads.\"$squad\".auth // \"\"" "$MESH_JSON")

  mkdir -p "$target"
  auth_flag=""
  if [ "$auth" = "bearer" ]; then
    token_var="$(echo "${squad}" | tr '[:lower:]-' '[:upper:]_')_TOKEN"
    [ -n "${!token_var:-}" ] && auth_flag="--header \"Authorization: Bearer ${!token_var}\""
  fi

  eval curl --silent --fail $auth_flag "$source" -o "$target/SUMMARY.md" 2>/dev/null \
    || echo "# ${squad} —— 不可用 ($(date))" > "$target/SUMMARY.md"
done

echo "✓ 网格同步完成"
