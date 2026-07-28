# Module: Watchdog

Main files:

- [`../../js_modules/watchdog/index.js`](../../js_modules/watchdog/index.js)
- [`../../js_modules/watchdog/telegram.js`](../../js_modules/watchdog/telegram.js)
- [`../../js_modules/watchdog/check.js`](../../js_modules/watchdog/check.js)
- [`../../js_modules/watchdog/messages.js`](../../js_modules/watchdog/messages.js)
- [`../../databases/watchdogdb.js`](../../databases/watchdogdb.js)

## Purpose

The watchdog monitors VIZ witnesses/validators and notifies Telegram chats.

## Bot commands

[`../../js_modules/watchdog/index.js`](../../js_modules/watchdog/index.js) handles:

- `/start`
- `/help`
- `/watchall`
- `/list`
- text commands for adding/removing watched witnesses:
  - `+login`
  - `-login`
  - `login`

## Runtime entry

[`../../viz.js`](../../viz.js) calls:

- `await watchdog.runBot()` during startup.
- `await watchdog.getWitnessesByBlock()` repeatedly in the main loop.

## Witness check

`getWitnessesByBlock()`:

- reads up to 100 witnesses through `methods.getWitnessesByVote("", 100)`;
- loads previously saved witness state from `watchdogdb`;
- calls [`../../js_modules/watchdog/check.js`](../../js_modules/watchdog/check.js) when saved state exists;
- saves current witness state.

## Storage

[`../../databases/watchdogdb.js`](../../databases/watchdogdb.js) uses `witnesses` and `chats` collections.
