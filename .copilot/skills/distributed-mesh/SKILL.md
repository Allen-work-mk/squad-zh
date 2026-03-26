---
name: "distributed-mesh"
description: "如何使用 git 作为传输与不同机器上的 squads 协调"
domain: "distributed-coordination"
confidence: "high"
source: "multi-model-consensus (Opus 4.6, Sonnet 4.5, GPT-5.4)"
---

## 范围

**✅ 此技能产生（恰好这些，仅此而已）：**

1. **`mesh.json`** —— 从用户关于区域和 squads 的答案生成（哪些 squads 参与，每个在哪个区域，每个的路径/URL），使用此技能目录中的 `mesh.json.example` 作为模式模板
2. **`sync-mesh.sh` 和 `sync-mesh.ps1`** —— 从此技能目录复制到项目根目录（这些是捆绑资源，不是生成的代码）
3. **区域 2 状态仓库初始化**（如果适用）—— 如果用户指定了区域 2 共享状态仓库，运行 `sync-mesh.sh --init` 来搭建状态仓库结构
4. **`.squad/decisions/inbox/` 中的决策条目** 记录网格配置以供团队感知

**❌ 此技能不产生：**

- **无应用代码** —— 无验证器、库或任何类型的模块
- **无测试文件** —— 无测试套件、测试用例或测试脚手架
- **无生成同步脚本** —— 它们作为预构建资源与此技能捆绑。复制它们，不要生成它们。
- **无守护进程或服务** —— 无后台进程、服务器或持久运行时
- **对现有 squad 文件无修改**，除了决策条目（不更改 team.md、routing.md、智能体 charter 等）

**你的角色：** 配置网格拓扑并安装捆绑的同步脚本。仅此而已。

## 上下文

当 squads 在不同机器上（开发者笔记本电脑、CI runner、云 VM、合作伙伴组织）时，本地文件读取约定仍然有效 —— 但远程文件需要先到达你的磁盘。此技能教授分布式 squad 通信的模式。

**何时适用：**
- Squads 跨越多个机器、VM 或 CI runner
- Squads 跨越组织或公司
- 智能体需要来自文件不在本地文件系统上的 squad 的上下文

**何时不适用：**
- 所有 squads 在同一台机器上（直接读取文件）

## 模式

### 核心原则

> "文件系统是网格，git 是网格跨越机器边界的方式。"

智能体接口永不改变。智能体始终读取本地文件。分布式层的唯一工作是在智能体读取它们之前使远程文件在本地出现。

### 三个通信区域

**区域 1 —— 本地：** 同一文件系统。直接读取文件。零传输。

**区域 2 —— 远程-信任：** 不同主机，同一组织，共享 git 认证。传输：从共享仓库 `git pull`。这将区域 2 折叠为区域 1 —— 文件在磁盘上具体化，智能体正常读取它们。

**区域 3 —— 远程-不透明：** 不同组织，无共享认证。传输：`curl` 获取发布的契约（SUMMARY.md）。单向可见性 —— 你只能看到他们发布的内容。

### 智能体生命周期（分布式）

```
1. 同步：    git pull（区域 2）+ curl（区域 3）—— 具体化远程状态
2. 读取：    cat .mesh/**/state.md —— 所有文件现在都是本地的
3. 工作：    执行分配的工作（智能体的正常任务，不是网格构建）
4. 写入：   更新自己的公告板、日志、drops
5. 发布： git add + commit + push —— 与远程对等方共享状态
```

步骤 2–4 与仅本地相同。步骤 1 和 5 是整个分布式扩展。**注意：**"工作" 意味着智能体执行其正常的 squad 职责 —— 它不意味着"构建网格基础设施"。

### mesh.json 配置

```json
{
  "squads": {
    "auth-squad": { "zone": "local", "path": "../auth-squad/.mesh" },
    "ci-squad": {
      "zone": "remote-trusted",
      "source": "git@github.com:our-org/ci-squad.git",
      "ref": "main",
      "sync_to": ".mesh/remotes/ci-squad"
    },
    "partner-fraud": {
      "zone": "remote-opaque",
      "source": "https://partner.dev/squad-contracts/fraud/SUMMARY.md",
      "sync_to": ".mesh/remotes/partner-fraud",
      "auth": "bearer"
    }
  }
}
```

三种区域类型，一个文件。本地 squads 只需要路径。远程-信任需要 git URL。远程-不透明需要 HTTP URL。

### 写入分区

每个 squad 只写入自己的目录（`boards/{self}.md`、`squads/{self}/*`、`drops/{date}-{self}-*.md`）。没有两个 squads 写入同一文件。Git push/pull 永不冲突。如果 push 失败（"branch is behind"），修复总是 `git pull --rebase && git push`。

### 信任边界

信任映射到 git 权限：
- **同一仓库访问** = 完整网格可见性
- **只读访问** = 可以观察，不能写入
- **无访问** = 不可见（正确行为）

对于选择性可见性，为每个受众（内部、合作伙伴、公共）使用单独的仓库。Git 权限就是信任协商。

### 分阶段推出

- **第 0 阶段：** 仅约定 —— 记录区域，同意 mesh.json 字段，手动运行 `git pull`/`git push`。零新代码。
- **第 1 阶段：** 同步脚本（~30 行 bash 或 PowerShell）当手动同步变得繁琐时。
- **第 2 阶段：** 发布的契约 + curl 获取，当区域 3 合作伙伴出现时。
- **第 3 阶段：** 永不。无 MCP 联邦、A2A、服务发现、消息队列。

**重要：** 阶段不是自动推进的。这些是项目级决策 —— 你从第 0 阶段（手动同步）开始，只有当团队决定复杂性是合理的时才向前移动。

### 网格状态仓库

共享网格状态仓库是一个普通的 git 仓库 —— 不是 Squad 项目。它包含：
- 每个参与 squad 的一个目录
- 每个目录至少包含一个带有 squad 当前状态的 SUMMARY.md
- 一个根 README 解释仓库是什么以及谁参与

没有 `.squad/` 文件夹，没有智能体，没有自动化。写入分区意味着每个 squad 只 push 到自己的目录。仓库是一个会合点，不是智能系统。

如果你想要一个*观察*网格健康的 squad，那是一个单独的 Squad 项目，在其 `mesh.json` 中将状态仓库列为区域 2 远程 —— 它不生活在状态仓库内。

## 示例

### 开发者笔记本电脑 + CI Squad（区域 2）

Auth-squad 智能体唤醒。`git pull` 带来 ci-squad 的最新结果。智能体读取："auth 模块中有 3 个测试失败。"调整工作。完成后推送结果。**开销：一次 `git pull`，一次 `git push`。**

### 两个组织协作（区域 3）

Payment-squad 通过 curl 获取合作伙伴发布的 SUMMARY.md。读取："风险评分 v3 API 于 4 月 15 日弃用。需要新字段 `device_fingerprint`。"消费智能体（在 payment-squad 的团队中）读取此信息并使用它来通知其工作 —— 例如，更新支付集成代码以包含新字段。合作伙伴看不到 payment-squad 的内部。

### 同一组织，共享网格仓库（区域 2）

不同机器上的三个 squads。一个共享的 git 仓库保存网格。每个 squad：工作前 `git pull`，工作后 `git push`。写入分区确保零合并冲突。

## 智能体工作流（确定性设置）

当用户调用此技能设置分布式网格时，**完全按顺序**遵循这些步骤：

### 第 1 步：询问用户网格拓扑

问这些问题（自然地调整措辞，但获取这些答案）：

1. **哪些 squads 正在参与？**（squad 名称列表）
2. **对于每个 squad，它在哪个区域？**
   - `local` —— 同一文件系统（只需要路径）
   - `remote-trusted` —— 不同机器，同一组织，共享 git 访问（需要 git URL + ref）
   - `remote-opaque` —— 不同组织，无共享认证（需要 HTTPS URL 到发布的契约）
3. **对于每个 squad，连接信息是什么？**
   - 本地：他们 `.mesh/` 目录的相对或绝对路径
   - 远程-信任：git URL（SSH 或 HTTPS）、ref（分支/标签），以及本地同步到哪里
   - 远程-不透明：他们 SUMMARY.md 的 HTTPS URL、同步到哪里，以及认证类型（none/bearer）
4. **共享状态应该在哪里？**（对于区域 2 squads：网格状态的 git 仓库 URL，或确认每个 squad 独立同步）

### 第 2 步：生成 `mesh.json`

使用第 1 步的答案，在项目根目录创建 `mesh.json` 文件。使用此技能目录（`.copilot/skills/distributed-mesh/mesh.json.example`）中的 `mesh.json.example` 作为模式模板。

结构：

```json
{
  "squads": {
    "<squad-name>": { "zone": "local", "path": "<relative-or-absolute-path>" },
    "<squad-name>": {
      "zone": "remote-trusted",
      "source": "<git-url>",
      "ref": "<branch-or-tag>",
      "sync_to": ".mesh/remotes/<squad-name>"
    },
    "<squad-name>": {
      "zone": "remote-opaque",
      "source": "<https-url-to-summary>",
      "sync_to": ".mesh/remotes/<squad-name>",
      "auth": "<none|bearer>"
    }
  }
}
```

将此文件写入项目根目录。不要写任何其他代码。

### 第 3 步：复制同步脚本

从此技能目录复制捆绑的同步脚本到项目根目录：

- **源：** `.copilot/skills/distributed-mesh/sync-mesh.sh`
- **目标：** `sync-mesh.sh`（项目根目录）

- **源：** `.copilot/skills/distributed-mesh/sync-mesh.ps1`
- **目标：** `sync-mesh.ps1`（项目根目录）

这些是捆绑资源。不要生成它们 —— 直接复制它们。

### 第 4 步：运行 `--init`（如果区域 2 状态仓库存在）

如果用户在第 1 步中指定了区域 2 共享状态仓库，运行初始化：

**在 Unix/Linux/macOS：**
```bash
bash sync-mesh.sh --init
```

**在 Windows：**
```powershell
.\sync-mesh.ps1 -Init
```

这会搭建状态仓库结构（squad 目录、占位 SUMMARY.md 文件、根 README）。

**如果以下情况跳过此步骤：**
- 没有配置区域 2 squads（仅本地/不透明）
- 状态仓库已存在并已初始化

### 第 5 步：写入决策条目

在 `.squad/decisions/inbox/<your-agent-name>-mesh-setup.md` 创建决策文件，内容如下：

```markdown
### <YYYY-MM-DD>: 网格配置

**By:** <your-agent-name>（通过 distributed-mesh 技能）

**What:** 配置了跨区域 <list-zones-used> 的 <N> 个 squads 的分布式网格

**Squads:**
- `<squad-name>` —— 区域 <X> —— <brief-connection-info>
- `<squad-name>` —— 区域 <X> —— <brief-connection-info>
- ...

**State repo:** <git-url-if-zone-2-used, or "N/A (local/opaque only)">

**Why:** <user's stated reason for setting up the mesh, or "Enable cross-machine squad coordination">
```

写入此文件。书记员稍后会将其合并到主决策文件中。

### 第 6 步：停止

**你完成了。** 不要：
- 生成同步脚本（它们与此技能捆绑 —— 复制它们）
- 编写验证器代码
- 编写测试文件
- 创建任何其他模块、库或应用代码
- 修改现有 squad 文件（team.md、routing.md、charters）
- 自动推进到第 2 阶段或第 3 阶段

输出简单的完成消息：

```
✅ 网格已配置。已创建：
- mesh.json (<N> squads)
- sync-mesh.sh 和 sync-mesh.ps1（从技能包复制）
- 决策条目：.squad/decisions/inbox/<filename>

在智能体启动前运行 `bash sync-mesh.sh`（或在 Windows 上运行 `.\sync-mesh.ps1`）以具体化远程状态。
```

---

## 反模式

**❌ 代码生成反模式：**
- 编写 `mesh-config-validator.js` 或任何验证器模块
- 编写网格配置的测试文件
- 生成同步脚本而不是从此技能目录复制捆绑的脚本
- 创建库模块或工具
- 构建任何"运行网格"的代码 —— 网格由智能体读取，不是执行

**❌ 架构反模式：**
- 构建联邦协议 —— Git push/pull 就是联邦
- 运行同步守护进程或服务器 —— 智能体不是持久的。在启动时同步，在关闭时发布
- 实时通知 —— 智能体不需要实时。他们需要"足够新。"`git pull` 足够新
- markdown 的模式验证 —— LLM 读取 markdown。如果格式改变，它会适应
- 服务发现协议 —— mesh.json 是一个有 10 个条目的文件。不是"发现问题"
- 认证框架 —— Git SSH 密钥和 HTTPS 令牌。不是框架。已配置
- 消息队列 / 事件总线 —— 智能体唤醒、读取、工作、写入、休眠。没有人在家接收事件
- 任何需要运行进程的组件 —— 那是界限。不要跨越它

**❌ 范围蔓延反模式：**
- 没有用户决策自动推进阶段
- 修改智能体 charter 或路由规则
- 为网格同步设置 CI/CD 管道
- 创建仪表板或监控工具
