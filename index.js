/**
 * 纯客户端插件的 Host 端空壳。
 *
 * 为什么需要它：profile 的 bundle 行是“Host 插件行”，本包必须能作为 Cordis 插件
 * 被插入一次；真正的工作全部在 `client.js`（浏览器端）完成 —— 它注册
 * `conversation.view` 这个 slot，在“对话 / Git”右侧增加一个“子代理”只读视图。
 *
 * Host 侧不读子代理、不发消息、不改变任何 agent 行为。
 */
export function apply() {}
