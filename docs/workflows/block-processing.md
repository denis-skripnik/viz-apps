# Workflow: block processing

## Code path

1. [`../../viz.js`](../../viz.js) starts with `getNullTransfers()`.
2. It loads dynamic global properties through `methods.getProps()`.
3. It reads the saved cursor with `bdb.getBlock(PROPS.last_irreversible_block_num)`.
4. It enters a loop.
5. If `bn <= PROPS.last_irreversible_block_num`, it calls `processBlock(bn)`.
6. `processBlock` loads operations through `methods.getOpsInBlock(bn)`.
7. Each operation is dispatched by `switch(op)`.
8. Cursor is advanced through `bdb.updateBlock(bn)`.

## Dispatch summary

| Operation | Destination |
|---|---|
| `witness_reward` | `witness_rewards.witnessRewardOperation` |
| `transfer` | `viz_projects.transferOperation` or `votes.transferOperation` |
| `custom` | `votes.customOperation`, optionally `viz_projects.customOperation` or `readdle_bot.notify` |
| `benefactor_award` | `awards.benefactorAward` |
| `receive_award` | `awards.receiveAward`, optionally `links` or `mg_bot` |
| `committee_worker_create_request` | `committee.committeeWorkerCreateRequestOperation` |
| `committee_pay_request` | `committee.committeePayRequestOperation` |

## Cursor and delay

If `processBlock` returns a positive handled-operation count, delay becomes `SHORT_DELAY`. Otherwise it becomes `LONG_DELAY`.
