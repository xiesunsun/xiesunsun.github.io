---
title: "通用 Runtime 与业务世界语义"
excerpt: "Agent 生态真正可能共享的，是运行机制，不是业务意义。通用层负责怎么跑，业务层负责什么算对。"
date: 2026-07-18 12:00:00 +0800
categories:
  - Essays
tags:
  - Agent
  - Runtime
  - Architecture
---

**不同业务里的 Agent，能不能建立在统一的通用基座上？**

如果能，车机助手、Coding Agent、Data Agent、客服 Agent，就不必各自从头实现状态管理、工具调用、Context 构造、任务恢复、轨迹记录和评测。它们可以共享一套运行机制，只根据业务定义自己的任务、状态、工具和评价标准。

这听起来很像操作系统和应用程序的关系。但 Agent 由概率模型驱动，依赖动态 Context 和外部环境，分层是否成立，并不那么显然。

我的判断是：**机制可以通用，意义不能通用。**

## 为什么会出现通用基础设施

业务差异很大，但内部实现里反复出现同一批能力：

- 模型调用与路由
- Session 和状态持久化
- Memory 与 Context 管线
- 工具注册、调用与回传
- 权限、审批与安全
- 长程任务的暂停、恢复和重试
- Trace、Snapshot、Replay
- 评测执行与成本统计

无论操作的是车窗、代码还是数据库，系统都要回答：

- 任务进行到哪一步了？
- 模型决策时看到了什么？
- 为什么选了这个工具？
- 世界发生了什么变化？
- 失败后从哪里恢复？
- 新版本是否真的更好？

**通用化的动力，不来自某个热门框架，而来自不同团队正在重复支付相同的工程成本。**

## 可以被通用化的，是运行机制

通用基座不该试图理解所有业务，而应提供与业务相对无关的机制：

**Agent Runtime ≈ Execution + State + Context + Action + Observation + Evaluation**

- **执行**：驱动观察 → Context → 决策 → 行动 → 状态更新
- **状态**：Session、Checkpoint、持久化、分支、回滚、并发
- **Context**：收集、优先级、压缩、溯源、token 预算、快照
- **行动**：注册、校验、超时、重试、权限、审计
- **观测与回放**：版本、轨迹、人工介入、候选版本比较
- **评价执行**：回归、配对、Shadow Test、成本延迟统计

工具具体做什么由业务定义；工具如何被可靠执行，可以由基座统一负责。

## 无法被通用化的，是业务世界语义

Runtime 可以保存状态，却不能决定什么状态重要。

车机用户说“有点闷”，可能涉及车速、空气质量、温度、车窗、空调、偏好、安全和权限。Runtime 可以把信息注入 Context，但无法自动决定：开窗还是开空调，是否先询问，高速时能否执行，什么才算真正满足用户。

Coding Agent 的 Runtime 可以跑测试，却不能替业务定义：哪些测试是发布门槛，哪些改动高风险，测试通过是否等于任务完成，是否需要人工审查。

所以核心边界是：

**通用层负责机制，业务层负责意义。**

- Runtime 回答：如何运行、保存、行动、恢复、被观察？
- 业务回答：生活在什么世界、要完成什么、什么行动合理、什么结果正确？

## 更完整的抽象是三部分，不是两层

**Agent System = Runtime + Business Agent Package + Environment**

- **Runtime**：模型调用、状态、Context、工具执行、权限、Trace、Replay、Evaluation、Lifecycle
- **Business Agent Package**：Task、State Schema、Context Provider、Skill、Workflow、Policy、Evaluator、Simulator、Risk Boundary
- **Environment**：车辆、数据库、文件系统、代码仓库、浏览器、企业系统、外部 API

Runtime 不理解业务，但能加载业务包；业务包不重造运行时，而是声明依赖什么世界和能力；Environment 提供真实状态与行动。

## 这一篇的结论

**统一基座如果成立，统一的是“如何跑”，不是“跑在什么业务世界上算成功”。**

下一篇我会继续说：如果要稳定分离，中间到底需要什么样的应用契约。

---

*Agent 工程札记 · 5/9*  
上一篇：[Code Agent 很强之后，人的价值在迁移](/essays/2026/07/18/human-value-with-code-agents.html)  
下一篇：[Agent 应用契约](/essays/2026/07/18/agent-application-contract.html)
