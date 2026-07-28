# Module: Awards bot

Main files:

- [`../../js_modules/awards_bot/index.js`](../../js_modules/awards_bot/index.js)
- [`../../js_modules/awards_bot/bot/interface.js`](../../js_modules/awards_bot/bot/interface.js)
- [`../../js_modules/awards_bot/bot/bot.js`](../../js_modules/awards_bot/bot/bot.js)
- [`../../databases/awards_bot/usersdb.js`](../../databases/awards_bot/usersdb.js)

## Purpose

The awards bot sends Telegram notifications about VIZ award operations for accounts that users subscribe to.

## Entry from `viz.js`

[`../../viz.js`](../../viz.js) calls:

- `awards.benefactorAward(opbody)` for `benefactor_award` operations.
- `awards.receiveAward(opbody)` for `receive_award` operations.

## User-facing logic

[`../../js_modules/awards_bot/bot/interface.js`](../../js_modules/awards_bot/bot/interface.js) handles:

- language selection;
- subscription management;
- unsubscribe command text containing `unsub`;
- help/home messages;
- admin news broadcast when status is `2`.

## Notifications

`benefactorAward(opbody)`:

- loads all users;
- filters by subscription to `opbody.benefactor`;
- formats amount in `Ƶ VIZ`;
- converts `viz://...` links in memo to Readdle links;
- sends Telegram messages.

`receiveAward(opbody)`:

- loads all users;
- filters by subscription to `opbody.receiver`;
- formats amount in `Ƶ VIZ`;
- turns `channel:@...` memo into Telegram links;
- converts `viz://...` memo links to Readdle links;
- sends Telegram messages.
