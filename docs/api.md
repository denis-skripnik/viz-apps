# HTTP API

The API is implemented in [`../js_modules/api.js`](../js_modules/api.js).

## Server

Current code:

- creates an Express app;
- registers one `GET /viz-api/` route;
- listens on port `3100`.

## Common query parameters

The route reads these query parameters:

- `service`
- `type`
- `page`
- `date`
- `login`
- `filter`
- `query`
- `link`
- `permlink`
- `auth`

Not every parameter is used by every service.

## Rate limiting

[`../js_modules/api.js`](../js_modules/api.js) creates two limiter instances from [`../js_modules/limiter.js`](../js_modules/limiter.js):

- `authTrueLimiter` from `config.json.api.authTrueLimiter`
- `authFalseLimiter` from `config.json.api.authFalseLimiter`

The route calls `keyCheckAuth(auth)` to decide which limiter to use.

## Services

### `service=top`

Required in code:

- `type`
- `page`

Behavior:

- Counts top records through `vudb.countTop(type)`.
- Reads page data through `vudb.getTop(type, page)`.
- Returns selected columns based on `type`.

Recognized `type` column groups in code include:

- `shares`
- `delegated_shares`
- `received_shares`
- `effective_shares`
- `viz`
- `vesting_withdraw_rate`

### `service=prices`

Reads price data from [`../databases/pricesdb.js`](../databases/pricesdb.js) and sends it without `_id`.

### `service=viz-projects`

Supported `type` values in current code:

- `projects` — reads `projectsdb.getProjects(JSON.parse(filter), page)`.
- `news` — reads `newsdb.getNews(JSON.parse(filter), page)`.
- `tasks` — reads `tasksdb.getTasks(JSON.parse(filter), page)`.
- `working_tasks` — reads `workingtasksdb.getWorkingTasks(filter, page)`.
- `categories` — reads `categoriesdb.getCategories()`.
- `types` — reads `typesdb.getTypes()`.

### `service=witnesses`

Reads witnesses from [`../databases/wrdb.js`](../databases/wrdb.js) through `findAllWitnesses()`.

### `service=links`

Supported `type` values in current code:

- `full_search` with `page` and `query`.
- `unfull_search` with `page` and `query`.
- `in_link` with `page` and `link`.

### `service=votes`

Supported `type` values in current code:

- `list` — returns question, answers, permlink and end date for all votes.
- `voteing` with `permlink` — returns question, answers and end date.
- `vote` with `permlink` — returns vote results, percentages and voter lists.

## Auth helper note

`keyCheckAuth` is implemented at the bottom of [`../js_modules/api.js`](../js_modules/api.js). This documentation records its presence and role for the limiter selection; it does not claim that the helper has been security-reviewed.
