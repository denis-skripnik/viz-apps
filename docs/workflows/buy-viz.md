# Workflow: buy_viz

## Code locations

- Config: [`../../config.json`](../../config.json), section `buy_viz`.
- Main implementation: [`../../js_modules/mg_bot/bot/interface.js`](../../js_modules/mg_bot/bot/interface.js).
- VIZ transfer helper: [`../../js_modules/methods.js`](../../js_modules/methods.js), `transfer`.

## User flow

1. User stores a VIZ login in `mg_bot` through the bot UI.
2. User presses the localized `buy_viz` button from the home keyboard.
3. If no `viz_login` is stored, the bot sends `no_buy_viz`.
4. If `viz_login` exists, the bot asks for a dollar amount and shows:
   - minimum amount: `conf.buy_viz.min_amount`
   - price: `conf.buy_viz.price`
5. User enters an amount.
6. If amount is below `min_amount`, the bot sends `small_buy_viz`.
7. Bot creates Crypto Pay invoices for:
   - `USDT`
   - `USDC`
   - `BUSD`
8. Bot sends the invoice URLs to the user.

## Payment callback

The code initializes:

```js
const cryptoPay = new CryptoPay(conf.buy_viz.pay_api, {
  webhook: {
    serverHostname: 'backend.dpos.space',
    serverPort: 3245,
    path: '/buy-viz/...'
  }
});
```

On `invoice_paid`:

1. Ignore events whose `status` is not `paid`.
2. Load the user by `parseInt(update.payload.payload)`.
3. Calculate paid dollar value:

```text
price = amount * usd_rate
```

4. Reject if the price is below `conf.buy_viz.min_amount`.
5. Calculate VIZ amount:

```text
viz_amount = price / conf.buy_viz.price
```

6. Format to 3 decimals and append ` VIZ`.
7. Broadcast transfer:

```js
methods.transfer(
  conf.buy_viz.wif,
  conf.buy_viz.account,
  user.viz_login,
  viz_amount,
  'You bought VIZ - Вы купили VIZ!'
)
```

8. Send localized confirmation to the Telegram user.

## Operational cautions

- `buy_viz.wif` signs real VIZ transfers.
- `buy_viz.price` directly controls how much VIZ users receive per dollar.
- The current code creates three invoices for each valid request.
- Live payment tests should be explicitly approved by an operator.
