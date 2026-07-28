# Module: `viz.js`

[`../../viz.js`](../../viz.js) is the main process entrypoint.

## Responsibilities

- Load [`../../config.json`](../../config.json).
- Initialize MongoDB through [`../../databases/@db.js`](../../databases/@db.js).
- Import and start application modules.
- Scan VIZ irreversible blocks.
- Dispatch blockchain operations to modules.
- Start cron and interval tasks.
- Register shutdown cleanup handlers.

## Imported modules

`viz.js` imports:

- [`../../js_modules/api.js`](../../js_modules/api.js)
- [`../../js_modules/vizprice.js`](../../js_modules/vizprice.js)
- [`../../js_modules/viz_top.js`](../../js_modules/viz_top.js)
- [`../../js_modules/awards_bot/`](../../js_modules/awards_bot/)
- [`../../js_modules/committee_bot/`](../../js_modules/committee_bot/)
- [`../../js_modules/readdle_bot/`](../../js_modules/readdle_bot/)
- [`../../js_modules/mg_bot/`](../../js_modules/mg_bot/)
- [`../../js_modules/viz_chats_channels_bot/`](../../js_modules/viz_chats_channels_bot/)
- [`../../js_modules/watchdog/`](../../js_modules/watchdog/)
- [`../../js_modules/viz_projects.js`](../../js_modules/viz_projects.js)
- [`../../js_modules/witness_rewards.js`](../../js_modules/witness_rewards.js)
- [`../../js_modules/links.js`](../../js_modules/links.js)
- [`../../js_modules/votes.js`](../../js_modules/votes.js)
- [`../../js_modules/helpers.js`](../../js_modules/helpers.js)

## `processBlock(bn)`

`processBlock(bn)` loads operations through `methods.getOpsInBlock(bn)` and switches on operation name.

Handled operations:

- `witness_reward`
- `transfer`
- `custom`
- `benefactor_award`
- `receive_award`
- `committee_worker_create_request`
- `committee_pay_request`

## Custom protocol dispatch

For `custom` operations:

- `votes.customOperation(op, opbody)` is called for every custom operation.
- `opbody.id === 'viz-projects'` calls `vp.customOperation(...)`.
- `opbody.id === 'V'` calls `rb.notify(author, block, JSON.parse(opbody.json))`.

## Transfer dispatch

For `transfer` operations:

- If `opbody.to === conf.viz_projects.login` and amount matches `conf.viz_projects.amount`, the operation is sent to VIZ Projects.
- Otherwise, the operation is sent to Votes.

## Receive award dispatch

For `receive_award`:

- Awards bot always receives the operation through `awards.receiveAward(opbody)`.
- If receiver is `committee` and memo has three `~` parts, Links handles it.
- If receiver is `conf.mg_bot.award_account` and memo contains `ft:`, mg_bot future telling notification is called.
- If receiver is `conf.mg_bot.award_account` and memo contains `scores:`, mg_bot VIZ score logic is called.
- If initiator and receiver are both `conf.mg_bot.award_account` and memo is empty, `sharesdb.updateShares(...)` is called.

## Timers

See [Operations](../operations.md).
