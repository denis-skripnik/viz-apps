# Workflow: Watchdog

## Code locations

- [`../../js_modules/watchdog/index.js`](../../js_modules/watchdog/index.js)
- [`../../js_modules/watchdog/check.js`](../../js_modules/watchdog/check.js)
- [`../../js_modules/watchdog/telegram.js`](../../js_modules/watchdog/telegram.js)
- [`../../databases/watchdogdb.js`](../../databases/watchdogdb.js)

## Startup

`viz.js` calls `watchdog.runBot()` during block scanner startup. `runBot()` initializes Telegram handling through `telegram.init(onMsg)`.

## User configuration flow

The bot handles:

- `/start` — introduction.
- `/help` — help text from `messages.js`.
- `/watchall` — toggles watch-all mode.
- `/list` — displays watched validators.
- `+login`, `-login`, `login` — add/remove watched validators after checking them through `methods.getWitnessByAccount`.

## Monitoring flow

`viz.js` repeatedly calls `watchdog.getWitnessesByBlock()`.

That function:

1. Gets witnesses from the VIZ node with `methods.getWitnessesByVote("", 100)`.
2. Loads saved witness state by owner.
3. Calls `check(w, saved)` when previous state exists.
4. Saves the current witness state.
