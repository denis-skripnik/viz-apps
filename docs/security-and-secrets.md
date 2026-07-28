# Security and secrets

This repository contains placeholder config values. Real production credentials must not be committed.

## Secret-bearing config fields

Treat these as secret or sensitive:

- `awards_bot.api_key`
- `readdle_bot.bot_api_key`
- `mg_bot.bot_api_key`
- `mg_bot.regular_key`
- `mg_bot.active_key`
- `committee_bot.api_key`
- `chats_channels_bot.api_key`
- `watchdog.token`
- `viz_projects.regular_key`
- `viz_projects.sandbox.regular_key`
- `viz_projects.popular.regular_key`
- `buy_viz.pay_api`
- `buy_viz.wif`

## Where keys are used

- [`../js_modules/methods.js`](../js_modules/methods.js) wraps VIZ signing and broadcasting.
- [`../viz.js`](../viz.js) uses `mg_bot.regular_key` for scheduled awards and `mg_bot.active_key` for `withdrawVesting`.
- [`../js_modules/mg_bot/bot/interface.js`](../js_modules/mg_bot/bot/interface.js) uses `buy_viz.wif` to transfer VIZ after a paid invoice.
- Readdle bot account keys are encrypted/decrypted through `sjcl` in [`../js_modules/readdle_bot/bot/interface.js`](../js_modules/readdle_bot/bot/interface.js) and stored through database helpers.

## Public repository rule

Do not replace placeholder values in [`../config.json`](../config.json) with production values in git.

If a real key/token is accidentally committed or pasted publicly, rotate it. Removing it from a later commit is not enough.

## Deployment rule

Production `config.json` should be managed as server configuration, not as a public source file.

When updating code on a server:

- back up production config first;
- keep real config out of git diff;
- do not print token/key values in logs or issue comments;
- verify only that required fields are present, not their full values.

## Financial flow caution

`buy_viz` is a payment-to-transfer flow. It receives Crypto Pay `invoice_paid`, calculates the VIZ amount and broadcasts a VIZ transfer. Any production change to `buy_viz.price`, `buy_viz.account`, `buy_viz.wif`, `min_amount`, webhook host/port/path, or transfer logic should be tested with explicit operator approval.
