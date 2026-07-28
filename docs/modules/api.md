# Module: HTTP API

Main file: [`../../js_modules/api.js`](../../js_modules/api.js)

## Responsibilities

- Start Express.
- Expose `GET /viz-api/` on port `3100`.
- Read data from MongoDB helper modules.
- Apply in-process request limiting.

## Dependencies

Uses:

- [`../../js_modules/helpers.js`](../../js_modules/helpers.js)
- [`../../js_modules/methods.js`](../../js_modules/methods.js)
- [`../../js_modules/limiter.js`](../../js_modules/limiter.js)
- database helpers for top, prices, projects, votes, links and witnesses.

## Route

Only one route is registered:

```text
GET /viz-api/
```

See [HTTP API](../api.md) for service/type details.

## Limiter

The module constructs:

- `authTrueLimiter = new Limiter(conf.api.authTrueLimiter)`
- `authFalseLimiter = new Limiter(conf.api.authFalseLimiter)`

The selected limiter is increased before handling and decreased in `finally`.
