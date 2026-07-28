# Workflow: VIZ Projects

## Code locations

- [`../../js_modules/viz_projects.js`](../../js_modules/viz_projects.js)
- [`../../databases/viz_projects/`](../../databases/viz_projects/)
- API reads in [`../../js_modules/api.js`](../../js_modules/api.js)

## Creation through transfer

[`../../viz.js`](../../viz.js) routes transfers to VIZ Projects only when:

- recipient is `conf.viz_projects.login`;
- amount equals `conf.viz_projects.amount`.

`viz_projects.transferOperation` parses memo JSON and supports:

- `project`
- `task`

## Updates through custom operation

For custom operations with `id === 'viz-projects'`, `customOperation(date, opbody)` parses JSON and supports project/task/news/moderation/category/type actions listed in [VIZ Projects module](../modules/viz-projects.md).

## API

`service=viz-projects` exposes projects, news, tasks, working tasks, categories and types. See [API](../api.md).
