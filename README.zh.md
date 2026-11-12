# dsh-subagent-panel

在会话视图标签栏的 **Git 右侧**增加一个 **“子代理”只读视图**：列出当前会话的全部直接/嵌套子代理，显示它们在做什么、跑多久、用了多少上下文；**不提供输入框，也不会向子代理发消息**。

## 为什么需要

DSH 默认只能在侧边栏或子代理会话里看子代理；当主 agent 在等子代理时，主对话里几乎看不到子代理的进度。这个视图把子代理的 Host 实时状态集中到当前会话的标签栏里，定位是“只读观察窗”，不是第二个聊天入口。

## 界面

- 标签位置：`对话 → Git → 子代理`（`conversation.view` 的 `order: 40`，Git 是 30）。
- 顶部：`N 运行中 / 共 M` + “只读 · 不会向子代理发送消息”。
- 每个子代理一张卡片：
  - 标记：绿色圆点 / `运行中`、`空闲`、`已结束`；
  - 标题：优先子代理自己的 `subagent.label`（如“巫师屏与命名屏100%复刻”），回落到父会话 `subagentCatalog` 的 label，再到标题；
  - 已运行时长（运行中取 `subagentTiming.active.since`；已结束取 `settledMs`）；
  - 模型（`provider · model`）、步数、上下文占用、输出 token、缓存读 token；
  - 未完成 todo（只对运行中的子代理显示，避免把已取消子代理的“进行中”当成当前状态）；
  - 子会话 id 前 8 位、模式（可继续 / 一次性 / 外部）、最后活动相对时间。
- 排序：运行中的在前，其余按最后活动倒序。
- 没有输入框、没有发送按钮、没有 `prompt` / `send_message` 调用。

## 数据来源

`ctx.sessions.list` 的 Host 会话列表快照：

- `byId` 里 `origin === "subagent"` 且能沿 `parentId` 链追溯到当前会话的行；
- `running` 是 Host `Agent.status === "running"` 的实时值；
- `projectionValues` 提供 `subagent`（label/mode）、`subagentTiming`、`tokenUsage`、`contextPressure`、`sessionStats`、`todos`、`modelSelection`；
- 父会话 `projectionsBySession[parent].values.subagentCatalog` 提供 catalog label 兜底。

视图挂载时每 10 秒调一次 `ctx.sessions.refresh()`，让 token / 上下文 / todo 这类投影值跟上；`running` / `updatedAt` 本身有实时状态事件推送。子代理结束或被取消后，卡片会留在列表里（标记“已结束”），不会消失。

## 安装

已经加入 `~/.dsh/profiles/web`：

```json
"@local/dsh-subagent-panel": "link:/home/liufei/data/claude-workspace/dsh/dsh-subagent-panel"
```

并加入 `dsh.profile.bundles`。依赖已 `pnpm install` 链接为符号链接。

- 纯客户端逻辑；Host 侧 `index.js` 是空壳，只负责让 bundle 行被挂载。
- 客户端依赖在 `package.json` 的 `dsh.client.inject` 里声明：`dsh-api-session-controller`、`dsh-client-locale`、`dsh-client-ui-conversation`。
- 升级 DSH 不会丢：插件不在 `node_modules` 里改文件，不依赖补丁锚点。

## 生效

**需要重启 DSH 宿主**（关闭 DSH Desktop 再打开，或重启 `dsh web`），因为 profile 的 bundle 列表和客户端插件图是在启动时组合的。

重启会打断正在跑的轮次；等新会话或方便中断时再做。重启后：

1. 打开一个会话，标签栏应出现 `对话 | Git | 子代理`；
2. 点“子代理”，运行中的子代理显示绿色 `运行中`，历史子代理显示 `已结束`；
3. 面板里没有任何输入框；需要追问子代理时回到主对话。

## 边界

- 只统计 Host 标记为 `origin: "subagent"` 的会话；普通 fork 不算子代理。
- `mode: external` 的子代理没有本地子 Session 行，不在面板里；它们不在 `sessions.list` 的 `byId` 里。
- 历史子代理（几天前的）也会列出；运行中的排在最前。列表较长时可滚动。
- 面板只读，不改变 goal、子代理或主 agent 的状态。
