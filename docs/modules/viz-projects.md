# Module: VIZ Projects

Main files:

- [`../../js_modules/viz_projects.js`](../../js_modules/viz_projects.js)
- [`../../js_modules/rh-viz-projects/rh.js`](../../js_modules/rh-viz-projects/rh.js)
- database helpers under [`../../databases/viz_projects/`](../../databases/viz_projects/)

## Purpose

The VIZ Projects module stores projects, tasks, news, categories, types and working-task notes based on VIZ blockchain operations.

## Transfer creation flow

[`../../viz.js`](../../viz.js) routes a `transfer` to `viz_projects.transferOperation(opbody)` only when:

- `opbody.to === conf.viz_projects.login`
- `opbody.amount === conf.viz_projects.amount`

`transferOperation` parses JSON memo and supports data types:

- `project`
- `task`

## Custom update flow

For custom operations with `opbody.id === 'viz-projects'`, `viz.js` calls `viz_projects.customOperation(timestamp, opbody)`.

Supported actions in current code:

- `update_project`
- `update_task`
- `add_task_member`
- `delete_task_member`
- `news`
- `delete_one_news`
- `working_tasks`
- `delete_working_task`
- `moderation`
- `add_type`
- `delete_type`
- `add_category`
- `delete_category`

Some actions check that `opbody.required_regular_auths[0]` matches the creator or configured VIZ Projects account.

## API exposure

The HTTP API exposes VIZ Projects data through `service=viz-projects`. See [API](../api.md).
