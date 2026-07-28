# Module: mg_bot

Main files:

- [`../../js_modules/mg_bot/index.js`](../../js_modules/mg_bot/index.js)
- [`../../js_modules/mg_bot/bot/interface.js`](../../js_modules/mg_bot/bot/interface.js)
- [`../../js_modules/mg_bot/bot/bot.js`](../../js_modules/mg_bot/bot/bot.js)
- [`../../js_modules/mg_bot/tamagotchi.js`](../../js_modules/mg_bot/tamagotchi.js)
- [`../../js_modules/mg_bot/bot/languages/ru.js`](../../js_modules/mg_bot/bot/languages/ru.js)
- [`../../js_modules/mg_bot/bot/languages/en.js`](../../js_modules/mg_bot/bot/languages/en.js)

## Purpose

`mg_bot` is a Telegram bot module for game/social mechanics, VIZ scores, crypto bid games, Tamagotchi/Ring-style features, subscriptions and the `buy_viz` payment flow.

The largest file is [`../../js_modules/mg_bot/bot/interface.js`](../../js_modules/mg_bot/bot/interface.js).

## Exports

[`../../js_modules/mg_bot/index.js`](../../js_modules/mg_bot/index.js) exports:

- `futureTellingNotify`
- `addVizScores`
- `scoresAward`
- `cryptoBidsResults`

These functions are called from [`../../viz.js`](../../viz.js).

## Entry from `viz.js`

`viz.js` calls mg_bot in these places:

- `futureTellingNotify(bn, memo)` when a `receive_award` memo contains `ft:` and receiver is `conf.mg_bot.award_account`.
- `addVizScores(bn, memo, shares)` when a `receive_award` memo contains `scores:` and receiver is `conf.mg_bot.award_account`.
- `scoresAward` daily by cron.
- `cryptoBidsResults` every 30 seconds.

`viz.js` also uses `conf.mg_bot.regular_key`, `conf.mg_bot.award_account` and `conf.mg_bot.active_key` for scheduled blockchain operations.

## `buy_viz`

Implemented in [`../../js_modules/mg_bot/bot/interface.js`](../../js_modules/mg_bot/bot/interface.js).

Current behavior:

1. Home keyboard includes `lng[lang].buy_viz`.
2. If user presses “Купить VIZ” / `buy VIZ` without a saved `viz_login`, the bot replies with `no_buy_viz`.
3. Otherwise it asks for a dollar amount and shows `min_amount` and `price` from `config.json.buy_viz`.
4. After the user enters an amount:
   - default amount is `10` unless the message parses as a number;
   - values below `conf.buy_viz.min_amount` are rejected;
   - invoices are created for `USDT`, `USDC` and `BUSD` with `cryptoPay.createInvoice(...)`;
   - invoice links are sent to the user.
5. On Crypto Pay `invoice_paid`:
   - the bot loads the user by `update.payload.payload`;
   - calculates `price = amount * usd_rate`;
   - rejects if below `min_amount`;
   - calculates `viz_amount = price / conf.buy_viz.price` with 3 decimals;
   - transfers VIZ from `conf.buy_viz.account` to `user.viz_login` using `conf.buy_viz.wif`;
   - sends a confirmation message to the user.

Detailed flow: [buy_viz workflow](../workflows/buy-viz.md).

## Database helpers

mg_bot database files:

- [`../../databases/mg_bot/usersdb.js`](../../databases/mg_bot/usersdb.js)
- [`../../databases/mg_bot/sharesdb.js`](../../databases/mg_bot/sharesdb.js)
- [`../../databases/mg_bot/ftqdb.js`](../../databases/mg_bot/ftqdb.js)
- [`../../databases/mg_bot/bkdb.js`](../../databases/mg_bot/bkdb.js)
- [`../../databases/mg_bot/ringdb.js`](../../databases/mg_bot/ringdb.js)
- [`../../databases/mg_bot/cbdb.js`](../../databases/mg_bot/cbdb.js)

See [Data storage](../data-storage.md).
