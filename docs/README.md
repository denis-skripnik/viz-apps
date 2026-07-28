# viz-apps documentation

This documentation describes the code in `denis-skripnik/viz-apps` at commit `e1c17a133ca8522a8216d9bb89acaab0f663f4cc`.

`viz-apps` is a Node.js/VIZ service collection. The main process starts from [`../viz.js`](../viz.js), connects to MongoDB, scans VIZ irreversible blocks, dispatches blockchain operations to application modules, starts Telegram bots, starts an Express API, and runs scheduled background tasks.

## Documentation map

### Core

- [Architecture](architecture.md) — process shape, dispatching, data flow and diagrams.
- [Getting started](getting-started.md) — dependencies, install and first run.
- [Configuration](configuration.md) — every top-level `config.json` section and sensitive fields.
- [Deployment](deployment.md) — production-oriented start/restart notes.
- [Operations](operations.md) — runtime loops, cron jobs and operational checks.
- [API](api.md) — the `/viz-api/` HTTP endpoint and supported services.
- [Data storage](data-storage.md) — MongoDB connection and collections used by the code.
- [Security and secrets](security-and-secrets.md) — where credentials are read and what must not be committed.

### Modules

- [Module index](modules/README.md)
- [`viz.js` entrypoint](modules/viz-js.md)
- [Express API module](modules/api.md)
- [VIZ methods and helpers](modules/methods-helpers.md)
- [Readdle bot](modules/readdle-bot.md)
- [mg_bot](modules/mg-bot.md)
- [Awards bot](modules/awards-bot.md)
- [Committee bot](modules/committee-bot.md)
- [Watchdog](modules/watchdog.md)
- [VIZ Projects](modules/viz-projects.md)
- [Other services](modules/other-services.md)

### Workflows

- [Workflow index](workflows/README.md)
- [Block processing](workflows/block-processing.md)
- [Voice publication notifications](workflows/voice-publication-notifications.md)
- [buy_viz flow](workflows/buy-viz.md)
- [Votes flow](workflows/votes.md)
- [VIZ Projects flow](workflows/viz-projects.md)
- [Committee flow](workflows/committee.md)
- [Watchdog flow](workflows/watchdog.md)

### Diagrams

- [Architecture diagrams](diagrams/architecture.md)
- [Sequence diagrams](diagrams/sequences.md)

## Source facts used

- Main entrypoint: [`../viz.js`](../viz.js)
- Runtime dependencies: [`../package.json`](../package.json)
- Config template: [`../config.json`](../config.json)
- Source tree: [`../js_modules/`](../js_modules/) and [`../databases/`](../databases/)
- Current source size at the documented commit: 63 JavaScript files, about 10,487 JavaScript lines.

## Scope and cautions

- The documentation describes current code behavior only.
- It does not include live server-only configuration values.
- It intentionally uses placeholder names for tokens and keys.
- It does not claim that a service is running in production; deployment state must be checked on the server.
