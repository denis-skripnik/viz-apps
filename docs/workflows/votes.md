# Workflow: Votes

## Code locations

- [`../../js_modules/votes.js`](../../js_modules/votes.js)
- [`../../databases/votesdb.js`](../../databases/votesdb.js)
- [`../../databases/vadb.js`](../../databases/vadb.js)
- API reads in [`../../js_modules/api.js`](../../js_modules/api.js)

## Vote creation from transfer

`votes.transferOperation(timestamp, op, opbody)` handles transfer memos.

A transfer creates a vote when current code conditions match:

- memo is valid JSON according to `helpers.isJsonString`;
- `opbody.to === conf.votes.to`;
- `opbody.amount` contains `VIZ`;
- amount is at least `conf.votes.vote_price`;
- memo JSON has `contractName === 'viz-votes'`;
- `contractAction === 'createVote'`;
- payload has `question`, `answers` and `consider`.

If `end_date` is absent, code sets it to current Unix time plus `432000`.

The permlink is generated as:

```text
survey-<timestampSeconds>
```

## Vote answer from custom operation

`votes.customOperation(op, opbody)` handles custom JSON where:

- `opbody.id === 'viz-votes'`
- `contractAction === 'voteing'`
- payload has `votePermlink` and `answerId`

If the vote exists and is not expired, it calculates shares based on `consider`:

- `0` — personal `vesting_shares`.
- `1` — personal `vesting_shares` plus `proxied_vsf_votes[0] / 1000000`.
- `2` — `vesting_shares + received_vesting_shares - delegated_vesting_shares`.

Then it stores the answer through `vadb.updateVa(...)`.

## API

`service=votes` exposes list, vote detail and results. See [API](../api.md).
