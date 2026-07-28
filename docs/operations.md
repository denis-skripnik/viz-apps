# Operations

## Main block loop

[`../viz.js`](../viz.js) loads `PROPS = await methods.getProps()` and reads the saved block cursor from [`../databases/blocksdb.js`](../databases/blocksdb.js). It then loops over irreversible blocks and calls `processBlock(bn)`.

If an operation was handled, `processBlock` returns a positive count and the delay is set to `SHORT_DELAY` (`3000`). Otherwise it uses `LONG_DELAY` (`12000`).

The next block is saved through `bdb.updateBlock(bn)`.

## Stall guard

[`../viz.js`](../viz.js) keeps `last_bn` and exits the process if `bn` has not changed for `SUPER_LONG_DELAY`, which is `1000 * 60 * 15`.

This means production should run under a supervisor that restarts the process after exit.

## Periodic tasks in `viz.js`

Current timers in [`../viz.js`](../viz.js):

- Every block loop iteration also attempts watchdog witness checks every 3 seconds.
- `setInterval(mgbAward, 432000)` calls `methods.award(...)` for the mg_bot award account.
- `new CronJob('0 0 3 * * *', wr.producersDay, null, true)` runs daily witness reward aggregation.
- `new CronJob('0 0 3 1 * *', wr.producersMonth, null, true)` runs monthly witness reward aggregation.
- `new CronJob('0 0 12 * * *', mgb.scoresAward, null, true)` runs daily mg_bot score awards.
- `setInterval(mgb.cryptoBidsResults, 30000)` processes crypto bid results every 30 seconds.
- `setInterval(checkAndWithdraw, 600000)` checks `mg_bot.award_account` vesting state and may call `withdrawVesting` when the code condition matches.

## Periodic tasks in `committee_bot`

[`../js_modules/committee_bot/index.js`](../js_modules/committee_bot/index.js) starts:

- `setInterval(checkRequests, 1000)`
- `setInterval(botjs.langNotifyMSG, 3600000)`

## Operational risks visible in code

- Starting a second `viz.js` process can duplicate block scanning and Telegram bot polling behavior.
- Real keys in `config.json` authorize VIZ transfers/awards/withdrawals.
- `buy_viz` sends VIZ after `invoice_paid`; this is a financial flow and should be monitored separately.
- The API limiter is in-process memory, not a distributed limiter.
- MongoDB connection URL is hardcoded in `viz.js` as `mongodb://localhost:27017`.

## Log review points

After restart, check for errors from:

- MongoDB connection in [`../databases/@db.js`](../databases/@db.js).
- VIZ RPC calls in [`../js_modules/methods.js`](../js_modules/methods.js).
- Telegram sends in bot modules.
- Crypto Pay webhook in [`../js_modules/mg_bot/bot/interface.js`](../js_modules/mg_bot/bot/interface.js).
