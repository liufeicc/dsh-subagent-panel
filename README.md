# dsh-subagent-panel

A **read-only “Subagents” view** for the DeepSeek Harness Web UI. It adds a tab to
the right of **Git** in the conversation view bar, so you can see what the
current session's subagents are doing without opening each child session.

[中文说明](README.zh.md)

## What it shows

- One card per direct or nested subagent of the current session;
- Running / idle / finished state, task label, elapsed time;
- Model, step count, context usage, output and cache-read tokens;
- The unfinished todo list of **running** subagents;
- Short child session id, mode (`continuable` / `one-shot` / `external`) and
  last-activity time.

There is **no input box and no send button** — the panel never prompts or
messages a subagent. The composer at the bottom still belongs to the parent
conversation.

## Install

The plugin is a normal local bundle. In a Web profile:

```json
"@local/dsh-subagent-panel": "link:/absolute/path/to/dsh-subagent-panel"
```

Add it to `dsh.profile.bundles`, then run `pnpm install` in the profile.
A **Host restart** is required because profile bundles and the client plugin
graph are composed at boot.

## How it works

- Host side (`index.js`) is an empty plugin shell; all UI logic is in
  `client.js`.
- `client.js` registers a `conversation.view` slot entry with `order: 40`
  (the Git panel uses 30).
- Data comes from `ctx.sessions.list`: rows with `origin === "subagent"` whose
  `parentId` chain reaches the current session. `running` is the live Host
  agent status; `projectionValues` supplies timing, tokens, context, todos and
  the subagent label.
- The panel calls `ctx.sessions.refresh()` every 10 seconds while mounted so
  projection values stay current. It is observation-only and does not change
  goal, parent or child state.

## Requirements

- DeepSeek Harness `0.2.1-rc.2` or newer with the Web UI;
- The conversation view slot (`conversation.view`) and the client
  `sessions.list` service.

## License

MIT
