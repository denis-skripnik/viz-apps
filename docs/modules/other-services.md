# Other services

## Votes

Files:

- [`../../js_modules/votes.js`](../../js_modules/votes.js)
- [`../../databases/votesdb.js`](../../databases/votesdb.js)
- [`../../databases/vadb.js`](../../databases/vadb.js)

Current behavior:

- A qualifying `transfer` to `conf.votes.to` with amount at least `conf.votes.vote_price` can create a vote when memo JSON has `contractName: 'viz-votes'` and `contractAction: 'createVote'`.
- Custom operation `id === 'viz-votes'` with `contractAction: 'voteing'` stores an answer weighted by VIZ shares according to the vote `consider` mode.
- API exposes vote list, vote details and results through `service=votes`.

Workflow: [Votes flow](../workflows/votes.md).

## Links

Files:

- [`../../js_modules/links.js`](../../js_modules/links.js)
- [`../../databases/linksdb.js`](../../databases/linksdb.js)

Current `viz.js` call:

- On `receive_award`, if receiver is `committee` and memo split by `~` has length 3, `links.receiveAwardOperation(...)` is called.

The module also exports `updateShares`, called by `viz.js` every 28,800 blocks.

## VIZ price

Files:

- [`../../js_modules/vizprice.js`](../../js_modules/vizprice.js)
- [`../../databases/pricesdb.js`](../../databases/pricesdb.js)

`viz.js` calls `prices.getPrices()` when `bn % 1200 == 0`.

## VIZ top

Files:

- [`../../js_modules/viz_top.js`](../../js_modules/viz_top.js)
- [`../../databases/viz_usersdb.js`](../../databases/viz_usersdb.js)

`viz.js` calls `top.updateAccounts(...)` when selected operations affect account balances/shares.

## Witness rewards

Files:

- [`../../js_modules/witness_rewards.js`](../../js_modules/witness_rewards.js)
- [`../../databases/wrdb.js`](../../databases/wrdb.js)

Used for:

- `witness_reward` operation handling;
- daily producer stats cron;
- monthly producer stats cron;
- API `service=witnesses`.

## VIZ chats/channels bot

Files:

- [`../../js_modules/viz_chats_channels_bot/index.js`](../../js_modules/viz_chats_channels_bot/index.js)
- [`../../js_modules/viz_chats_channels_bot/bot.js`](../../js_modules/viz_chats_channels_bot/bot.js)
- [`../../databases/viz_chats_channels_bot/`](../../databases/viz_chats_channels_bot/)

`viz.js` calls `vccb.run()` every 28,800 blocks.
