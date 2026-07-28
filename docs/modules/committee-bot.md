# Module: Committee bot

Main files:

- [`../../js_modules/committee_bot/index.js`](../../js_modules/committee_bot/index.js)
- [`../../js_modules/committee_bot/bot.js`](../../js_modules/committee_bot/bot.js)
- [`../../databases/committee_bot/committeedb.js`](../../databases/committee_bot/committeedb.js)
- [`../../databases/committee_bot/usersdb.js`](../../databases/committee_bot/usersdb.js)

## Purpose

The committee bot tracks VIZ committee worker requests and notifies subscribed Telegram users.

## Entry from `viz.js`

[`../../viz.js`](../../viz.js) calls:

- `committee.committeeWorkerCreateRequestOperation(PROPS.committee_requests, opbody)` for `committee_worker_create_request`.
- `committee.committeePayRequestOperation(opbody)` for `committee_pay_request`.

## Request creation

`committeeWorkerCreateRequestOperation(id, opbody)`:

- calculates `end_datetime` as current time plus `opbody.duration`;
- stores request data through `committeedb.updateCommittee(...)`;
- loads all users;
- formats end time with `helpers.date_str(...)`;
- sends notification with `botjs.msg(...)`.

## Request payment

`committeePayRequestOperation(opbody)`:

- loads request by `opbody.request_id`;
- removes the stored request;
- sends localized completion notification to all users.

## Timers

The module starts:

- `setInterval(checkRequests, 1000)`
- `setInterval(botjs.langNotifyMSG, 3600000)`

`checkRequests` reads all stored committee requests and sends ending notifications when its current `remained` condition matches the code.
