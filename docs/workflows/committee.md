# Workflow: Committee

## Code locations

- [`../../js_modules/committee_bot/index.js`](../../js_modules/committee_bot/index.js)
- [`../../js_modules/committee_bot/bot.js`](../../js_modules/committee_bot/bot.js)
- [`../../databases/committee_bot/`](../../databases/committee_bot/)

## Worker request creation

1. `viz.js` receives `committee_worker_create_request`.
2. It calls `committeeWorkerCreateRequestOperation(PROPS.committee_requests, opbody)`.
3. The module calculates an end timestamp from `opbody.duration`.
4. Request data is saved in committee database.
5. All committee bot users receive a notification.

## Worker request payment

1. `viz.js` receives `committee_pay_request`.
2. It calls `committeePayRequestOperation(opbody)`.
3. The module loads the stored request by `opbody.request_id`.
4. The request is removed.
5. All users receive localized completion text.

## Background checks

`committee_bot/index.js` runs `checkRequests` once per second and `botjs.langNotifyMSG` once per hour.
