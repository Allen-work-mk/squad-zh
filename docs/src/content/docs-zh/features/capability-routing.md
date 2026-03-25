---
title: 能力路由
description: 机器能力发现和 needs:* 标签路由，用于硬件特定和操作系统特定的工作。
order: 35
---

# 能力路由

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

**试试这个声明机器能力：**
```
这台机器有 GPU —— 标记它用于需要 GPU 的工作
```

**试试这个将 issue 路由到有能力的机器：**
```
用 needs:gpu 标记 issue #42，让它去正确的 runner
```

Squad 发现每台机器能做什么，并只将 issues 路由到满足要求的机器。无需手动分配硬件或操作系统特定的工作。

---

## 什么是能力？

能力是描述机器能做什么的标签 —— 硬件、操作系统或环境属性，不是每个 runner 都有的。你在项目根目录或主目录的 `machine-capabilities.json` 中声明能力；Squad 在路由 issues 时读取它们。

示例：`gpu`、`windows`、`macos`、`arm64`、`high-memory`、`docker`。

## 声明能力

在每台机器的项目根目录或主目录的 `machine-capabilities.json` 中添加 `capabilities` 数组：

```json
["gpu", "cuda", "high-memory"]
```

Squad 在启动时读取此文件。声明的能力立即对路由系统可用。

## `needs:*` 标签模式

对任何 GitHub issue 应用 `needs:*` 标签以要求特定能力：

| 标签 | 含义 |
|-------|---------|
| `needs:gpu` | 必须在有 GPU 的机器上运行 |
| `needs:windows` | 必须在 Windows 上运行 |
| `needs:macos` | 必须在 macOS 上运行 |
| `needs:arm64` | 必须在 ARM64 架构上运行 |
| `needs:docker` | 必须在有 Docker 的地方运行 |

你可以组合多个 `needs:*` 标签 —— 所有都必须匹配。

## 路由如何工作

当 Ralph 获取 issue 时：

1. 它读取 issue 上的所有 `needs:*` 标签。
2. 它与当前机器声明的能力进行比较。
3. 如果机器满足所有要求，它就继续。如果不满足，它就跳过 issue，留给有能力的机器来获取。

无需中央调度器。每台机器基于它能做什么自我选择。

## 示例流程

```
Issue #99  标签：needs:gpu, needs:windows
Machine A  能力：["gpu", "windows", "cuda"]  ← 获取它
Machine B  能力：["macos"]                   ← 跳过它
```

## 另请参阅

- [工作路由](routing.md) —— 基于模式和基于技能的路由
- [Ralph —— 工作监控器](ralph.md) —— Ralph 如何轮询和获取 issues
