window.__ModuleLoader__.load({
  id: "@local/dsh-subagent-panel",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

    const React = require("react");
    const h = React.createElement;

    /** 客户端 locale 命名空间。 */
    const NS = "subagent-panel";
    /** 样式标签身份；重复加载同一页面时只注入一次。 */
    const CSS_ID = "@local/dsh-subagent-panel/subagent-panel.css";
    const PLUGIN_ID = "@local/dsh-subagent-panel";
    /** 视图在标签栏里的稳定 id；order 40 排在 Git（30）右侧。 */
    const VIEW_ID = "subagents";

    /** 中文词典（键集基准）。 */
    const zh = {
      tab: "子代理",
      title: "子代理",
      count: "{running} 运行中 / 共 {total}",
      note: "只读 · 不会向子代理发送消息",
      empty: "当前会话没有子代理。",
      "status.running": "运行中",
      "status.idle": "空闲",
      "status.ended": "已结束",
      "meta.steps": "{count} 步",
      "meta.last": "最后活动 {time}",
      "todo.active": "进行中",
      "todo.pending": "待办",
      "mode.continuable": "可继续",
      "mode.one-shot": "一次性",
      "mode.external": "外部",
      "context.line": "上下文 {used}/{total} ({pct}%)",
      "tokens.line": "输出 {out} · 缓存读 {cache}",
      "duration.seconds": "{n} 秒",
      "duration.minutes": "{n} 分 {s} 秒",
      "duration.hours": "{n} 小时 {m} 分",
      "duration.days": "{n} 天 {h} 小时",
      "relative.justNow": "刚刚",
      "relative.seconds": "{n} 秒前",
      "relative.minutes": "{n} 分钟前",
      "relative.hours": "{n} 小时前",
      "relative.days": "{n} 天前",
    };

    /** 英文词典，键集与中文一致。 */
    const en = {
      tab: "Subagents",
      title: "Subagents",
      count: "{running} running / {total} total",
      note: "Read-only · no messages are sent to subagents",
      empty: "This session has no subagents.",
      "status.running": "Running",
      "status.idle": "Idle",
      "status.ended": "Finished",
      "meta.steps": "{count} steps",
      "meta.last": "Last activity {time}",
      "todo.active": "Now",
      "todo.pending": "Todo",
      "mode.continuable": "Continuable",
      "mode.one-shot": "One-shot",
      "mode.external": "External",
      "context.line": "Context {used}/{total} ({pct}%)",
      "tokens.line": "Output {out} · cache read {cache}",
      "duration.seconds": "{n}s",
      "duration.minutes": "{n}m {s}s",
      "duration.hours": "{n}h {m}m",
      "duration.days": "{n}d {h}h",
      "relative.justNow": "just now",
      "relative.seconds": "{n}s ago",
      "relative.minutes": "{n}m ago",
      "relative.hours": "{n}h ago",
      "relative.days": "{n}d ago",
    };

    /**
     * 只读视图样式。
     *
     * 只使用 DSH 设计 token，自动跟随深浅色主题；底部留 120px，
     * 避免最后一张卡片被会话 shell 浮在底部的输入框遮住。
     */
    const CSS = `
.dsh-subagent-panel-root{box-sizing:border-box;height:100%;min-height:0;overflow:auto;padding:18px 22px 120px;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}
.dsh-subagent-panel-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
.dsh-subagent-panel-title{font-size:15px;font-weight:600}
.dsh-subagent-panel-count{color:var(--dsw-alias-label-tertiary);font-size:12px;font-variant-numeric:tabular-nums}
.dsh-subagent-panel-note{margin-left:auto;color:var(--dsw-alias-label-tertiary);font-size:12px}
.dsh-subagent-panel-empty{color:var(--dsw-alias-label-tertiary);padding:24px 0}
.dsh-subagent-panel-list{display:flex;flex-direction:column;gap:10px}
.dsh-subagent-card{min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:12px 14px;background:var(--dsw-alias-bg-layer-1)}
.dsh-subagent-card.is-running{border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary) 45%,var(--dsw-alias-border-l2))}
.dsh-subagent-card-head{display:flex;align-items:center;gap:8px;min-width:0}
.dsh-subagent-dot{flex:none;width:8px;height:8px;border-radius:999px;background:var(--dsw-alias-label-tertiary)}
.dsh-subagent-dot.is-running{background:var(--dsw-alias-state-success-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-alias-state-success-primary) 18%,transparent)}
.dsh-subagent-card-title{flex:1;min-width:0;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-subagent-badge{flex:none;padding:1px 7px;border-radius:999px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);font-size:11px}
.dsh-subagent-badge.is-running{background:color-mix(in srgb,var(--dsw-alias-state-success-primary) 14%,transparent);color:var(--dsw-alias-state-success-primary)}
.dsh-subagent-elapsed{flex:none;color:var(--dsw-alias-label-tertiary);font-size:12px;font-variant-numeric:tabular-nums}
.dsh-subagent-meta{margin-top:6px;color:var(--dsw-alias-label-tertiary);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-subagent-todos{display:flex;flex-direction:column;gap:4px;margin:8px 0 0;padding:0;list-style:none}
.dsh-subagent-todo{display:flex;gap:8px;min-width:0;color:var(--dsw-alias-label-secondary);font-size:12px}
.dsh-subagent-todo.is-active{color:var(--dsw-alias-label-primary)}
.dsh-subagent-todo-state{flex:none;padding:0 5px;border-radius:4px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-tertiary);font-size:11px}
.dsh-subagent-todo.is-active .dsh-subagent-todo-state{color:var(--dsw-alias-state-success-primary)}
.dsh-subagent-todo span:last-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-subagent-foot{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;padding-top:8px;border-top:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-tertiary);font-size:11px;font-variant-numeric:tabular-nums}
`;

    /** 把毫秒格式化成紧凑时长；没有有效值时返回空串。 */
    function formatDuration(ms, t) {
      if (typeof ms !== "number" || !Number.isFinite(ms) || ms <= 0) return "";
      const totalSeconds = Math.floor(ms / 1000);
      if (totalSeconds < 60) return t("duration.seconds", { n: totalSeconds });
      const totalMinutes = Math.floor(totalSeconds / 60);
      if (totalMinutes < 60) return t("duration.minutes", { n: totalMinutes, s: totalSeconds % 60 });
      const totalHours = Math.floor(totalMinutes / 60);
      if (totalHours < 24) return t("duration.hours", { n: totalHours, m: totalMinutes % 60 });
      return t("duration.days", { n: Math.floor(totalHours / 24), h: totalHours % 24 });
    }

    /** 把 token 数格式化成 k/M，便于一行显示。 */
    function formatTokens(value) {
      if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "0";
      if (value >= 1000000) return `${(value / 1000000).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
      return String(value);
    }

    /** 相对当前时刻的“多久以前”；没有有效值时返回空串。 */
    function relativeTime(now, then, t) {
      if (typeof then !== "number" || !Number.isFinite(then)) return "";
      const seconds = Math.max(0, Math.floor((now - then) / 1000));
      if (seconds < 10) return t("relative.justNow");
      if (seconds < 60) return t("relative.seconds", { n: seconds });
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return t("relative.minutes", { n: minutes });
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return t("relative.hours", { n: hours });
      return t("relative.days", { n: Math.floor(hours / 24) });
    }

    /**
     * 从会话列表快照里收集某个会话的全部直接/嵌套后代。
     *
     * 用 Host 列表的 parentId 链，而不是事件流：已取消的子代理不会留下
     * 结算事件，但它的会话行一定在列表里；running / agentAvailable 也是
     * Host 的实时权威值。
     *
     * @param state - ClientSessions.list 的快照（{ byId, projectionsBySession }）。
     * @param rootId - 当前会话 id。
     * @returns `[{ row, depth }]`，深挖时保留层级。
     */
    function collectSubagents(state, rootId) {
      const byId = state !== null && state !== undefined && state.byId !== null && state.byId !== undefined ? state.byId : {};
      const byParent = new Map();
      for (const row of Object.values(byId)) {
        if (row === null || row === undefined || row.parentId === undefined) continue;
        /* 只认 Host 标记的 subagent 行；普通 fork 不是子代理。 */
        if (row.origin !== "subagent") continue;
        const siblings = byParent.get(row.parentId);
        if (siblings === undefined) byParent.set(row.parentId, [row]);
        else siblings.push(row);
      }
      const result = [];
      const seen = new Set();
      const walk = (parentId, depth) => {
        for (const row of byParent.get(parentId) ?? []) {
          if (seen.has(row.id)) continue;
          seen.add(row.id);
          result.push({ row, depth });
          walk(row.id, depth + 1);
        }
      };
      walk(rootId, 0);
      return result;
    }

    /** 父会话 subagentCatalog 里的 label（比子会话 title 更接近“任务名”）。 */
    function catalogLabels(state, rootId) {
      const catalog = state?.projectionsBySession?.[rootId]?.values?.subagentCatalog
        ?? state?.byId?.[rootId]?.projectionValues?.subagentCatalog;
      const labels = new Map();
      if (!Array.isArray(catalog)) return labels;
      for (const entry of catalog) {
        if (entry !== null && entry !== undefined && typeof entry.id === "string" && typeof entry.label === "string") {
          labels.set(entry.id, entry.label);
        }
      }
      return labels;
    }

    /** 子代理标题：subagent.label → 父 catalog label → title → id。 */
    function labelOf(row, catalog) {
      const identity = row.projectionValues?.subagent;
      const identityLabel = identity !== null && identity !== undefined ? identity.label : undefined;
      if (typeof identityLabel === "string" && identityLabel !== "") return identityLabel;
      const catalogLabel = catalog.get(row.id);
      if (typeof catalogLabel === "string" && catalogLabel !== "") return catalogLabel;
      const title = row.projectionValues?.title ?? row.title;
      if (typeof title === "string" && title !== "") return title;
      return row.displayTitle ?? row.id;
    }

    /** 当前使用的模型，展示 provider · model。 */
    function modelOf(row) {
      const selection = row.projectionValues?.modelSelection;
      const model = selection?.next ?? selection?.lastUsed;
      if (model === null || model === undefined) return "";
      return `${model.provider} · ${model.model}`;
    }

    /** 上下文占用；没有 pressure 投影时返回空串。 */
    function contextOf(row, t) {
      const pressure = row.projectionValues?.contextPressure;
      if (pressure === null || pressure === undefined) return "";
      const window = typeof pressure.contextWindow === "number" ? pressure.contextWindow : 0;
      const pct = window > 0 ? Math.round((pressure.pressureTokens / window) * 100) : 0;
      return t("context.line", {
        used: formatTokens(pressure.pressureTokens),
        total: formatTokens(window),
        pct,
      });
    }

    /** 输出 token 与缓存读 token。 */
    function tokensOf(row, t) {
      const usage = row.projectionValues?.tokenUsage;
      if (usage === null || usage === undefined) return "";
      return t("tokens.line", {
        out: formatTokens(usage.outputTokens),
        cache: formatTokens(usage.cacheReadTokens),
      });
    }

    /** 当前未完成的 todo，最多三条，优先展示进行中的项。 */
    function todosOf(row) {
      const todos = row.projectionValues?.todos;
      if (!Array.isArray(todos)) return [];
      const pending = todos.filter((todo) => todo !== null && todo !== undefined && todo.status !== "completed");
      pending.sort((left, right) => (left.status === "in_progress" ? -1 : 0) - (right.status === "in_progress" ? -1 : 0));
      return pending.slice(0, 3);
    }

    /** 最近一次活动时间：优先用 subagentTiming.active.through，其次 updatedAt。 */
    function lastActivityOf(row) {
      const through = row.projectionValues?.subagentTiming?.active?.through;
      if (typeof through === "number" && Number.isFinite(through)) return through;
      return row.updatedAt;
    }

    /** 已运行时长：运行中的子代理用 active.since；已结束的回落到 settledMs。 */
    function elapsedOf(row, now, t) {
      const timing = row.projectionValues?.subagentTiming;
      if (row.running === true) {
        const since = timing?.active?.since;
        if (typeof since === "number" && Number.isFinite(since)) return formatDuration(Math.max(0, now - since), t);
      }
      if (timing !== null && timing !== undefined && typeof timing.settledMs === "number" && timing.settledMs > 0) {
        return formatDuration(timing.settledMs, t);
      }
      return "";
    }

    /** 子代理模式标签。 */
    function modeOf(row, t) {
      const mode = row.projectionValues?.subagent?.mode;
      if (mode === "continuable") return t("mode.continuable");
      if (mode === "one-shot") return t("mode.one-shot");
      if (mode === "external") return t("mode.external");
      return "";
    }

    /** 渲染一张子代理卡片。 */
    function SubagentCard({ entry, catalog, now, t }) {
      const { row, depth } = entry;
      const running = row.running === true;
      const statusKey = running ? "running" : row.agentAvailable === true ? "idle" : "ended";
      const label = labelOf(row, catalog);
      const stats = row.projectionValues?.sessionStats;
      const meta = [
        modelOf(row),
        stats !== null && stats !== undefined && typeof stats.steps === "number" ? t("meta.steps", { count: stats.steps }) : "",
        contextOf(row, t),
        tokensOf(row, t),
      ].filter((part) => part !== "");
      const elapsed = elapsedOf(row, now, t);
      const lastActivity = lastActivityOf(row);
      const lastText = relativeTime(now, lastActivity, t);
      /* 已结束的子代理不再展示 todo：投影里的“进行中”可能停留在它被取消的那一刻。 */
      const todos = running ? todosOf(row) : [];
      const mode = modeOf(row, t);
      return h("article", {
        className: "dsh-subagent-card" + (running ? " is-running" : ""),
        "data-subagent-id": row.id,
      }, [
        h("div", { className: "dsh-subagent-card-head", key: "head" }, [
          h("span", { className: "dsh-subagent-dot" + (running ? " is-running" : ""), key: "dot" }),
          h("span", {
            className: "dsh-subagent-card-title",
            key: "title",
            title: label,
          }, (depth > 0 ? "↳ " : "") + label),
          h("span", {
            className: "dsh-subagent-badge" + (running ? " is-running" : ""),
            key: "status",
          }, t(`status.${statusKey}`)),
          elapsed === "" ? null : h("span", { className: "dsh-subagent-elapsed", key: "elapsed" }, elapsed),
        ]),
        meta.length === 0 ? null : h("div", { className: "dsh-subagent-meta", key: "meta" }, meta.join(" · ")),
        todos.length === 0 ? null : h("ul", { className: "dsh-subagent-todos", key: "todos" }, todos.map((todo, index) => {
          const active = todo.status === "in_progress";
          return h("li", {
            className: "dsh-subagent-todo" + (active ? " is-active" : ""),
            key: `${row.id}-todo-${index}`,
          }, [
            h("span", { className: "dsh-subagent-todo-state", key: "state" }, t(active ? "todo.active" : "todo.pending")),
            h("span", { key: "content", title: todo.content }, todo.content),
          ]);
        })),
        h("div", { className: "dsh-subagent-foot", key: "foot" }, [
          h("span", { key: "id" }, row.id.slice(0, 8)),
          mode === "" ? null : h("span", { key: "mode" }, mode),
          lastText === "" ? null : h("span", { key: "last" }, t("meta.last", { time: lastText })),
        ]),
      ]);
    }

    /**
     * 子代理只读面板。
     *
     * 数据来源：`ctx.sessions.list` 的 Host 列表快照。每 10 秒主动
     * `sessions.refresh()` 一次，让 token / 上下文 / todo 这类投影值跟得上；
     * running / updatedAt 本身有实时状态事件推送。
     *
     * 明确不渲染输入框、不调用 prompt/send_message —— 这里只观察。
     */
    function SubagentPanel({ sessionId, ctx, t }) {
      const list = ctx.sessions.list;
      const subscribe = React.useMemo(() => (listener) => list.subscribe(listener), [list]);
      const getSnapshot = React.useMemo(() => () => list.getSnapshot(), [list]);
      const state = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
      const [now, setNow] = React.useState(() => Date.now());

      React.useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
      }, []);

      React.useEffect(() => {
        let alive = true;
        const refresh = () => {
          if (!alive || typeof ctx.sessions.refresh !== "function") return;
          void ctx.sessions.refresh().catch(() => {});
        };
        refresh();
        const timer = setInterval(refresh, 10000);
        return () => {
          alive = false;
          clearInterval(timer);
        };
      }, [ctx, sessionId]);

      if (sessionId === undefined || sessionId === null) {
        return h("div", { className: "dsh-subagent-panel-root" }, h("div", { className: "dsh-subagent-panel-empty" }, t("empty")));
      }

      const entries = collectSubagents(state, sessionId);
      const catalog = catalogLabels(state, sessionId);
      entries.sort((left, right) => {
        if (left.row.running !== right.row.running) return left.row.running ? -1 : 1;
        return (lastActivityOf(right.row) ?? 0) - (lastActivityOf(left.row) ?? 0);
      });
      const running = entries.filter((entry) => entry.row.running === true).length;

      return h("div", { className: "dsh-subagent-panel-root" }, [
        h("div", { className: "dsh-subagent-panel-head", key: "head" }, [
          h("span", { className: "dsh-subagent-panel-title", key: "title" }, t("title")),
          h("span", { className: "dsh-subagent-panel-count", key: "count" }, t("count", { running, total: entries.length })),
          h("span", { className: "dsh-subagent-panel-note", key: "note" }, t("note")),
        ]),
        entries.length === 0
          ? h("div", { className: "dsh-subagent-panel-empty", key: "empty" }, t("empty"))
          : h("div", { className: "dsh-subagent-panel-list", key: "list" }, entries.map((entry) => h(SubagentCard, {
              key: entry.row.id,
              entry,
              catalog,
              now,
              t,
            }))),
      ]);
    }

    /** 只需要槽位、会话列表和文案三个服务。 */
    const inject = ["slots", "sessions", "locale"];

    /**
     * 注册“子代理”视图。
     *
     * 标签栏顺序：Chat（平台默认）→ 轨迹（开发者工具）→ Git（30）→ 子代理（40）。
     * 用 `slots.inject` 等待 conversation 声明 `conversation.view` 后再注册；
     * 宿主卸载时插槽系统自动回卷。
     *
     * @param ctx - 客户端插件上下文。
     */
    function apply(ctx) {
      const t = ctx.locale.bind(NS);
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), "subagent-panel: dictionaries");
      ctx.effect(() => {
        if (typeof document === "undefined") return () => {};
        if (document.querySelector("style[data-plugin-css=" + JSON.stringify(CSS_ID) + "]") !== null) return () => {};
        const tag = document.createElement("style");
        tag.dataset.plugin = PLUGIN_ID;
        tag.dataset.pluginCss = CSS_ID;
        tag.textContent = CSS;
        document.head.appendChild(tag);
        return () => tag.remove();
      }, "subagent-panel: styles");
      ctx.slots.inject("conversation.view", () => ctx.slots.register({
        name: "conversation.view",
        id: VIEW_ID,
        order: 40,
        locale: NS,
        label: () => t("tab"),
      }, (props) => h(SubagentPanel, { ...props, ctx, t })));
    }

    exports.name = "subagent-panel";
    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
