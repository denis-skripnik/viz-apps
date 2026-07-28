# Module: methods and helpers

## `methods.js`

File: [`../../js_modules/methods.js`](../../js_modules/methods.js)

This module wraps `viz-js-lib`.

Exported functions in current code:

- `getOpsInBlock`
- `getBlock`
- `getProps`
- `getConfig`
- `updateAccount`
- `getAccount`
- `getCustomProtocolAccount`
- `lookupAccounts`
- `getAccounts`
- `send`
- `wifToPublic`
- `workerVote`
- `verifyData`
- `getSubscriptionStatus`
- `sendJson`
- `award`
- `randomGenerator`
- `randomWithHash`
- `getWitnessByAccount`
- `getWitnessesByVote`
- `withdrawVesting`
- `transfer`
- `sendReblog`

The file sets `viz.config.set('websocket', conf.node)`.

## `helpers.js`

File: [`../../js_modules/helpers.js`](../../js_modules/helpers.js)

Helper exports include:

- HTTP body read helper: `getBody`
- time helpers: `unixTime`, `date_str`, `nowDateTime`, `sleep`
- numeric/string helpers: `compareShares`, `adaptiveFixed`, `addslashes`
- random/hash helpers: `getRandomInRange`, `randomNumberWithoutRepeats`, `stringToHash`
- JSON/object helpers: `isJsonString`, `objectSearch`, `remove_array`

## Callers

Most application modules use `methods.js` for blockchain access and `helpers.js` for formatting, sleeping, parsing and helper logic.
