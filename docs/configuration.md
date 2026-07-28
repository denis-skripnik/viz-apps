# Configuration

The application reads [`../config.json`](../config.json) through direct `require()` calls. The file in the repository is a template with placeholders. Production values must stay outside public commits.

## Top-level sections

| Section | Used by | Purpose |
|---|---|---|
| `node` | [`../js_modules/methods.js`](../js_modules/methods.js) | VIZ websocket/API endpoint passed to `viz.config.set('websocket', conf.node)`. |
| `api` | [`../js_modules/api.js`](../js_modules/api.js) | Provider account and limiter sizes for `/viz-api/`. |
| `votes` | [`../js_modules/votes.js`](../js_modules/votes.js) | Target account and minimum transfer amount for poll creation. |
| `awards_bot` | [`../js_modules/awards_bot/`](../js_modules/awards_bot/) | Telegram token and admin IDs for awards notifications. |
| `readdle_bot` | [`../js_modules/readdle_bot/`](../js_modules/readdle_bot/) | Telegram token and admin IDs for Readdle/Voice bot. |
| `mg_bot` | [`../js_modules/mg_bot/`](../js_modules/mg_bot/) | Telegram token, admins, VIZ award account and keys. |
| `committee_bot` | [`../js_modules/committee_bot/`](../js_modules/committee_bot/) | Telegram token and admin ID for committee bot. |
| `chats_channels_bot` | [`../js_modules/viz_chats_channels_bot/`](../js_modules/viz_chats_channels_bot/) | Telegram token for chats/channels bot. |
| `watchdog` | [`../js_modules/watchdog/`](../js_modules/watchdog/) | Telegram token and admin chat for watchdog. |
| `viz_projects` | [`../js_modules/viz_projects.js`](../js_modules/viz_projects.js) and [`../js_modules/rh-viz-projects/rh.js`](../js_modules/rh-viz-projects/rh.js) | Gate account, required amount, tags and optional sandbox/popular settings. |
| `buy_viz` | [`../js_modules/mg_bot/bot/interface.js`](../js_modules/mg_bot/bot/interface.js) | Crypto Pay credentials and VIZ account used to sell VIZ through mg_bot. |

## `api`

Fields in the template:

```json
"api": {
  "provider_account": "denis-skripnik",
  "authTrueLimiter": 50,
  "authFalseLimiter": 10
}
```

[`../js_modules/api.js`](../js_modules/api.js) selects one of two in-process limiters depending on whether `keyCheckAuth(auth)` accepts the request.

## `votes`

Fields:

```json
"votes": {
  "to": "committee",
  "vote_price": "1.000 VIZ"
}
```

[`../js_modules/votes.js`](../js_modules/votes.js) uses this when deciding whether a `transfer` operation creates a new poll.

## `mg_bot`

Fields:

```json
"mg_bot": {
  "bot_api_key": "THIS_ADD_mg_bot_API_TOKEN",
  "admins": [123456789],
  "award_account": "THIS_ADD_ACCOUNT",
  "regular_key": "THIS_ADD_REGULAR_KEY",
  "active_key": "THIS_ADD_ACTIVE_KEY"
}
```

Used by [`../js_modules/mg_bot/`](../js_modules/mg_bot/) and by [`../viz.js`](../viz.js) for scheduled award/withdrawal operations.

## `buy_viz`

Fields:

```json
"buy_viz": {
  "pay_api": "API_KEY",
  "price": 0.004,
  "account": "PAY_ACCOUNT",
  "wif": "PAY_WIF",
  "min_amount": 4
}
```

Current code behavior in [`../js_modules/mg_bot/bot/interface.js`](../js_modules/mg_bot/bot/interface.js):

- `pay_api` initializes `CryptoPay` from `@foile/crypto-pay-api`.
- `price` is the dollar price of 1 VIZ used in `paid USD / price` conversion.
- `account` is the VIZ account from which bought VIZ is transferred.
- `wif` signs the VIZ transfer from `account`.
- `min_amount` is checked before creating invoices and again after receiving `invoice_paid`.

The code creates invoices for `USDT`, `USDC` and `BUSD`.

## Secret fields

Treat these fields as secrets or sensitive production values:

- any `*_api_key`, `token`, `pay_api`;
- any `regular_key`, `active_key`, `wif`;
- production Telegram admin/chat IDs when they are private operational data;
- production account names if they identify hidden service wallets.

See [Security and secrets](security-and-secrets.md).
