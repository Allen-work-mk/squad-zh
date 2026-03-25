---
title: KEDA 自动扩展
description: 使用 KEDA 外部扩展器模板基于 GitHub issue 队列深度自动扩展 Squad 智能体。
order: 38
---

# KEDA 自动扩展

> ⚠️ **实验性** — Squad 是 alpha 软件。API、命令和行为可能在版本间发生变化。

**试试这个了解你的扩展需求：**
```
当前有多少 issues 排队等待 Squad 智能体？
```

KEDA（Kubernetes 事件驱动自动扩展）是一个基于外部事件源扩展 Kubernetes 工作负载的开源组件。Squad 附带一个外部扩展器模板，基于你的 GitHub issue 队列深度上下扩展智能体 pod。

---

## 何时使用此功能

当以下情况时使用 KEDA 自动扩展：

- Squad 智能体作为 Kubernetes pod 运行（不是本地机器）
- Issue 量不可预测 —— 工作突发应该自动产生更多智能体
- 当没有工作时你希望零智能体空闲成本

## 前置条件

- 安装了 KEDA 的 Kubernetes 集群（[keda.sh](https://keda.sh)）
- 打包为容器镜像并作为 `Deployment` 部署的 Squad 智能体
- 带有 `repo` 范围的 GitHub 令牌用于 issue 队列轮询

## 设置

1. 在你的集群上安装 KEDA：
   ```bash
   helm repo add kedacore https://kedacore.github.io/charts
   helm install keda kedacore/keda --namespace keda --create-namespace
   ```

2. 从 `templates/keda/scaled-object.yaml` 应用 Squad KEDA `ScaledObject` 模板：
   ```yaml
   apiVersion: keda.sh/v1alpha1
   kind: ScaledObject
   metadata:
     name: squad-agents
   spec:
     scaleTargetRef:
       name: squad-agent-deployment
     minReplicaCount: 0
     maxReplicaCount: 10
     triggers:
       - type: external
         metadata:
           scalerAddress: squad-external-scaler:8080
           owner: your-org
           repo: your-repo
           labels: "squad:ready"
           targetQueueLength: "5"
         authenticationRef:
           name: github-token-secret
   ```

3. 创建 GitHub 令牌 secret：
   ```bash
   kubectl create secret generic github-token-secret \
     --from-literal=personalAccessToken=<your-token>
   ```

## 配置参考

| 字段 | 描述 |
|-------|-------------|
| `minReplicaCount` | 空闲时保持运行的智能体（使用 `0` 实现零成本空闲） |
| `maxReplicaCount` | 智能体 pod 的硬上限 |
| `targetQueueLength` | 每个智能体 pod 的 issues（根据任务持续时间调整） |
| `labels` | 计为"排队工作"的 issue 标签 |

## 另请参阅
