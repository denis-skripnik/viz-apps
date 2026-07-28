# Module: Readdle bot

Main files:

- [`../../js_modules/readdle_bot/index.js`](../../js_modules/readdle_bot/index.js)
- [`../../js_modules/readdle_bot/bot/interface.js`](../../js_modules/readdle_bot/bot/interface.js)
- [`../../js_modules/readdle_bot/bot/bot.js`](../../js_modules/readdle_bot/bot/bot.js)
- [`../../databases/readdle_bot/usersdb.js`](../../databases/readdle_bot/usersdb.js)
- [`../../databases/readdle_bot/accountsdb.js`](../../databases/readdle_bot/accountsdb.js)

## Purpose

The Readdle bot handles Telegram interaction around Voice/Readdle content and sends notifications for VIZ custom protocol `V` operations.

## Entry from block scanner

[`../../viz.js`](../../viz.js) calls:

```js
rb.notify(opbody.required_regular_auths[0], bn, JSON.parse(opbody.json))
```

when a custom operation has `opbody.id === 'V'`.

## `notify(login, bn, data)`

Implemented in [`../../js_modules/readdle_bot/index.js`](../../js_modules/readdle_bot/index.js).

Current behavior:

1. Ignore data without `data.d.m`, `data.d.d` or `data.d.t`.
2. Choose searchable text from `data.d.m`, then `data.d.d`, then `data.d.t`.
3. Filter selected words/accounts in the content/login.
4. Load all bot users from `databases/readdle_bot/usersdb.js`.
5. For each user:
   - skip if language is empty;
   - check `#nsfw` against `user.show_nsfw`;
   - look for `@account` mentions in combined content;
   - send notification if user subscribes to the author, show-all mode applies, reply target matches, or a mentioned account matches a subscription.
6. Before sending, replace `sia://...` links with HTML links.
7. Call `sendNotify(login, user.lng, user.id, bn, data)`.

## `sendNotify(login, lang, id, bn, data)`

Implemented in [`../../js_modules/readdle_bot/bot/interface.js`](../../js_modules/readdle_bot/bot/interface.js).

It formats Telegram messages for:

- publication: `data.t === 'p'` and body in `data.d.m` or `data.d.d`;
- note: no `data.t`, no repost/reply fields;
- repost: no `data.t`, `data.d.s` is present;
- reply: no `data.t`, `data.d.r` is present.

Publication links use:

```text
https://readdle.me/#viz://@<login>/<block>/publication/
```

## Current Voice publication format

The current fixed publication branch accepts both body locations:

- `data.d.m` — current markdown body used by recent Voice publications;
- `data.d.d` — legacy/alternate body field accepted for compatibility.

## Telegram length handling

`sendNotify` replaces `<br>` with newlines and sends `replacedText.substring(0, 4096)` through the bot wrapper.

## User actions

`interface.js` also exports:

- `main`
- `sendNotify`
- `sendReply`

`sendReply` builds a Voice custom data object with `data.d.t` and `data.d.r`, then calls `methods.sendJson(...)`.
