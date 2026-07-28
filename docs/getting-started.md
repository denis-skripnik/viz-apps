# Getting started

## Prerequisites

The repository is a Node.js application. Runtime dependencies are listed in [`../package.json`](../package.json):

- `viz-js-lib`
- `mongodb`
- `express`
- `cron`
- `telebot`
- `grammy`
- `@foile/crypto-pay-api`
- and helper libraries such as `axios`, `big.js`, `sjcl`, `basescript`.

The code expects MongoDB at `mongodb://localhost:27017` in [`../viz.js`](../viz.js) and [`../databases/@db.js`](../databases/@db.js).

## Install

From the repository root:

```bash
npm install
```

## Configure

Edit [`../config.json`](../config.json). It contains placeholders for bot tokens and VIZ keys. Do not commit real production values.

Important sections:

- `node` — VIZ node endpoint used by `viz-js-lib`.
- `api` — `/viz-api/` rate limiter and paid subscription account.
- `awards_bot`, `readdle_bot`, `mg_bot`, `committee_bot`, `chats_channels_bot`, `watchdog` — Telegram bot credentials/settings.
- `viz_projects` — VIZ Projects gate account, amount and optional sandbox/popular settings.
- `buy_viz` — Crypto Pay and VIZ transfer settings used by `mg_bot`.

See [Configuration](configuration.md).

## Start

The repository README currently documents:

```bash
node viz.js
```

or:

```bash
pm2 start viz.js
```

The main file is [`../viz.js`](../viz.js).

## What starts with `viz.js`

Starting `viz.js` imports modules that initialize command handlers and background work:

- Express API from [`../js_modules/api.js`](../js_modules/api.js).
- Awards bot from [`../js_modules/awards_bot/`](../js_modules/awards_bot/).
- Committee bot from [`../js_modules/committee_bot/`](../js_modules/committee_bot/).
- Readdle bot from [`../js_modules/readdle_bot/`](../js_modules/readdle_bot/).
- mg_bot from [`../js_modules/mg_bot/`](../js_modules/mg_bot/).
- VIZ chats/channels bot from [`../js_modules/viz_chats_channels_bot/`](../js_modules/viz_chats_channels_bot/).
- Watchdog from [`../js_modules/watchdog/`](../js_modules/watchdog/).

It also enters the irreversible block scanning loop.

## Minimal local checks

Documentation-only checks that do not start production services:

```bash
node --check viz.js
node --check js_modules/api.js
node --check js_modules/mg_bot/bot/interface.js
node --check js_modules/readdle_bot/bot/interface.js
```

The existing smoke test added for Readdle publication notifications can be run with:

```bash
node tests/readdle-publication-notify-smoke.js
```

Do not run `node viz.js` on a production host without checking process supervision and config first, because it starts bots, API, block scanning and background jobs.
