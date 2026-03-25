# Squad  ping 你

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

**试试这个在完成时获得通知：**
```
构建完成时通知我
```

**试试这个保持循环：**
```
需要我输入时在 Teams 上 ping 我
```

你的 squad 在需要输入、遇到错误或完成工作时给你发送即时消息。适用于 Teams、Discord、Slack、webhooks —— 你配置的任何方式。

---

## 如何工作

你的 squad 在需要你的输入时可以发送即时消息。离开你的终端，在手机上获得 ping。

---

## 如何工作

Squad 不附带零通知基础设施。相反，它使用**技能** —— 可复用知识文件 —— 教智能体何时以及如何 ping 你。你通过在你的 Copilot 环境中配置 MCP 通知服务器来带来自己的通知传递。

流程：
1. **技能**（`human-notification`）告诉智能体何时 ping —— 阻塞等待输入、需要决策、遇到错误、工作完成
2. **智能体**调用技能，技能调用你配置的 MCP 服务器
3. **你的 MCP 服务器**（Teams、iMessage、Discord、webhook 等）将实际消息发送到你的设备

这意味着 Squad 适用于任何通知服务。选择你喜欢的消息平台，配置一次，你的 squad 就有了一条直接联系你的线路。

---

## 快速开始：Teams（最简单路径）

### 你需要知道的

Squad 不附带 Teams MCP 服务器。你带来自己的 —— 社区实现或你自己构建的。Squad 智能体在生成时发现配置的 MCP 服务器，并在需要通知你时自动调用它。

### Teams 工作流 webhook

Teams 工作流（Power Automate）webhooks 是推荐的方法。Office 365 连接器被 [Microsoft 退役](https://devblogs.microsoft.com/microsoft365dev/retirement-of-office-365-connectors-within-microsoft-teams/) —— 改用工作流。

1. **为你的 squad 创建频道：**
   - 创建一个名为 "My Squads" 的新团队（或重用现有的）
   - 添加频道，例如 `#squad-myproject`

2. **创建工作流 webhook：**
   - 打开频道，选择 **+**（添加选项卡）或前往 Teams 中的 **工作流** 应用
   - 选择 **"收到 webhook 请求时发布到频道"**
   - 按照提示命名工作流并选择你的频道
   - 复制生成的 webhook URL（它以 `https://prod-...logic.azure.com/...` 开头）

3. **获取 Teams webhook MCP 服务器：**
   
   你需要一个可以 POST 到你的 webhook URL 的 MCP 服务器。选项：
   
   - **社区参考：** [benleane83's teams-webhook-mcp.js](https://gist.github.com/benleane83/f37b5bc1ed3d00e320ba48886109b82a) —— 发送 MessageCard 负载的工作实现（与工作流 webhooks 兼容）
   - **自己构建：** 使用社区参考作为起点
   - **搜索 MCP 市场：** 在 https://mcpmarket.com 查找 Teams 兼容服务器

4. **配置 Squad：**
   
   在你的工作区中创建或编辑 `.vscode/mcp.json`：
   ```json
   {
     "mcpServers": {
       "notifications": {
         "command": "node",
         "args": ["/absolute/path/to/teams-webhook-mcp.js"],
         "env": {
           "TEAMS_WEBHOOK_URL": "https://prod-XX.westus.logic.azure.com:443/workflows/..."
         }
       }
     }
   }
