# Deployment

This document describes what the repository code expects. It does not describe the current production host state.

## Runtime entrypoint

The documented start command is:

```bash
node viz.js
```

or, under PM2:

```bash
pm2 start viz.js
```

[`../viz.js`](../viz.js) starts more than one runtime surface:

- VIZ irreversible block scanner.
- Express API from [`../js_modules/api.js`](../js_modules/api.js), listening on port `3100`.
- Telegram command handlers imported from bot modules.
- Watchdog bot initialization.
- Cron and interval tasks.

## Required services

- Node.js with dependencies from [`../package.json`](../package.json).
- MongoDB reachable at `mongodb://localhost:27017` unless code/config is changed.
- A reachable VIZ node endpoint in `config.json.node`.
- Telegram bot tokens for enabled bots.
- Crypto Pay API key if `mg_bot` `buy_viz` is enabled.

## Production update checklist

1. Back up the current server copy and production `config.json` before replacing code.
2. Verify that the repository copy contains no real secrets before pushing public commits.
3. Update code on the server.
4. Keep production `config.json` values; do not overwrite them with placeholder values from the repository.
5. Install dependencies if `package.json` or `package-lock.json` changed.
6. Restart only the intended process supervisor for `viz.js`.
7. Confirm that only one block scanner / Telegram poller instance is running.
8. Check logs after restart for MongoDB, VIZ node, Telegram and Crypto Pay errors.

## Ports visible in code

- Express API: [`../js_modules/api.js`](../js_modules/api.js) listens on port `3100`.
- Crypto Pay webhook object in [`../js_modules/mg_bot/bot/interface.js`](../js_modules/mg_bot/bot/interface.js) uses `serverPort: 3245`, `serverHostname: 'backend.dpos.space'` and a `/buy-viz/...` path in the current code.

## Safe checks after deployment

- Confirm the process is running under the intended supervisor.
- Confirm `/viz-api/` responds through the production route if it is publicly proxied.
- Confirm block cursor progresses in the `blocks` collection.
- Confirm Telegram bots answer `/start` only if that is safe for production.
- For `buy_viz`, do not run a live paid transaction just to test code unless an operator explicitly approves it.
