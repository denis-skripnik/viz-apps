# Workflow: Voice publication notifications

## Source operation

VIZ custom operation with:

```json
{
  "id": "V"
}
```

The author is read from `opbody.required_regular_auths[0]` in [`../../viz.js`](../../viz.js).

## Dispatch path

1. [`../../viz.js`](../../viz.js) parses `opbody.json`.
2. For `opbody.id === 'V'`, it calls `rb.notify(author, blockNumber, parsedJson)`.
3. [`../../js_modules/readdle_bot/index.js`](../../js_modules/readdle_bot/index.js) filters content/users.
4. [`../../js_modules/readdle_bot/bot/interface.js`](../../js_modules/readdle_bot/bot/interface.js) formats a Telegram message in `sendNotify`.
5. [`../../js_modules/readdle_bot/bot/bot.js`](../../js_modules/readdle_bot/bot/bot.js) sends the Telegram message.

## Supported content shapes in current formatter

Publication:

```json
{
  "t": "p",
  "d": {
    "t": "title",
    "m": "markdown body"
  }
}
```

The current formatter also accepts `d.d` as a fallback body field.

Note/repost/reply branches are selected by absence of `data.t` plus `data.d.s` or `data.d.r` fields.

## Subscriber matching

`readdle_bot/index.js` currently sends when one of these conditions matches:

- user subscribes to the author login;
- user has no subscriptions and `show_all == true`;
- reply target author matches a subscription;
- content mentions an `@account` that matches a subscription.

`#nsfw` content is skipped unless `user.show_nsfw == true`.
