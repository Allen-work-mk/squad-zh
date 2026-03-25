# Squad 的 Issue 模板

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

**试试这个设置模板后：**
```
Ralph，展示未分流的 issues
```

**然后观看 Ralph 基于标签自动分流。**

当 GitHub Issues 是你的工作队列时，创建任务应该无摩擦。Issue 模板预填充标签、结构化任务描述，在手机上工作得很好 —— 让从任何地方在 10 秒内添加任务成为可能。

---

## 为什么 Issue 模板对 Squad 重要

GitHub 提供 Issue 模板 —— 一个平台功能，在创建新 issues 时预填充标签、字段和结构。本指南展示如何配置与 Squad 基于标签的路由顺畅工作的模板。

Squad 在工作被捕获为 GitHub Issues 时运行最佳。但从头创建 issue 需要时间：你需要记住正确的标签、一致地格式化描述，并确保结构匹配智能体的期望。

Issue 模板解决这些问题：

- **预填充标签** —— `squad` 标签自动应用
- **结构化格式** —— 任务描述、验收标准、优先级字段
- **移动友好** —— 在 GitHub 移动应用中工作
- **快速任务创建** —— 在遛狗、等咖啡或开会时添加工作

使用模板，创建 Squad 任务只需 10 秒而不是 2 分钟。

---

## 基础 Squad 任务模板

在你的仓库中创建 `.github/ISSUE_TEMPLATE/squad-task.yml`：

```yaml
name: Squad 任务
description: 为 Squad 团队创建任务
title: "[任务]: "
labels: ["squad"]
body:
  - type: markdown
    attributes:
      value: |
        感谢创建 Squad 任务！在下面填写详细信息。
        
  - type: textarea
    id: description
    attributes:
      label: 任务描述
      description: 需要做什么？
      placeholder: |
        为设置页面添加暗色模式支持。
        
        当前行为：设置页面只使用浅色主题。
        期望行为：设置中的主题切换器，尊重系统偏好。
    validations:
      required: true
      
  - type: textarea
    id: acceptance-criteria
    attributes:
      label: 验收标准
      description: 我们如何知道这是完整的？
      placeholder: |
        - [ ] 主题切换器开关添加到设置
        - [ ] 启用时应用暗色模式 CSS
        - [ ] 偏好保存到 localStorage
        - [ ] 首次加载时检测系统主题偏好
    validations:
      required: false
      
  - type: dropdown
    id: priority
    attributes:
      label: 优先级
      description: 这个任务多紧急？
      options:
