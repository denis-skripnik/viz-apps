# Data storage

## MongoDB connector

MongoDB connection management is in [`../databases/@db.js`](../databases/@db.js). [`../viz.js`](../viz.js) initializes it with:

```js
require("./databases/@db.js").initialize({
    url: 'mongodb://localhost:27017',
    poolSize: 15
});
```

Database helper files under [`../databases/`](../databases/) export CRUD-style functions and select collections by name.

## Collection map

This list is extracted from `.collection(...)` calls in the current code.

| Database helper | Collections used |
|---|---|
| [`../databases/blocksdb.js`](../databases/blocksdb.js) | `blocks` |
| [`../databases/viz_usersdb.js`](../databases/viz_usersdb.js) | `viztop` |
| [`../databases/pricesdb.js`](../databases/pricesdb.js) | `viz_prices` |
| [`../databases/wrdb.js`](../databases/wrdb.js) | `witnesses` |
| [`../databases/watchdogdb.js`](../databases/watchdogdb.js) | `witnesses`, `chats` |
| [`../databases/votesdb.js`](../databases/votesdb.js) | `votes` |
| [`../databases/vadb.js`](../databases/vadb.js) | `votesAnswers` |
| [`../databases/linksdb.js`](../databases/linksdb.js) | `links` |
| [`../databases/ccdb.js`](../databases/ccdb.js) | `cc` |
| [`../databases/awards_bot/usersdb.js`](../databases/awards_bot/usersdb.js) | `users` |
| [`../databases/readdle_bot/accountsdb.js`](../databases/readdle_bot/accountsdb.js) | `accounts` |
| [`../databases/readdle_bot/usersdb.js`](../databases/readdle_bot/usersdb.js) | `users` |
| [`../databases/viz_chats_channels_bot/chatsdb.js`](../databases/viz_chats_channels_bot/chatsdb.js) | `chats` |
| [`../databases/viz_chats_channels_bot/channelsdb.js`](../databases/viz_chats_channels_bot/channelsdb.js) | `channels` |
| [`../databases/mg_bot/usersdb.js`](../databases/mg_bot/usersdb.js) | `users` |
| [`../databases/mg_bot/sharesdb.js`](../databases/mg_bot/sharesdb.js) | `shares` |
| [`../databases/mg_bot/ftqdb.js`](../databases/mg_bot/ftqdb.js) | `ftq` |
| [`../databases/mg_bot/bkdb.js`](../databases/mg_bot/bkdb.js) | `bools_and_cows` |
| [`../databases/mg_bot/ringdb.js`](../databases/mg_bot/ringdb.js) | `ring` |
| [`../databases/mg_bot/cbdb.js`](../databases/mg_bot/cbdb.js) | `btc_price`, `crypto_bids` |
| [`../databases/committee_bot/committeedb.js`](../databases/committee_bot/committeedb.js) | `requests`, `users` |
| [`../databases/committee_bot/usersdb.js`](../databases/committee_bot/usersdb.js) | `users` |
| [`../databases/viz_projects/projectsdb.js`](../databases/viz_projects/projectsdb.js) | `projects` |
| [`../databases/viz_projects/tasksdb.js`](../databases/viz_projects/tasksdb.js) | `tasks` |
| [`../databases/viz_projects/workingtasksdb.js`](../databases/viz_projects/workingtasksdb.js) | `working_tasks` |
| [`../databases/viz_projects/newsdb.js`](../databases/viz_projects/newsdb.js) | `news`, `projects` |
| [`../databases/viz_projects/categoriesdb.js`](../databases/viz_projects/categoriesdb.js) | `categories` |
| [`../databases/viz_projects/typesdb.js`](../databases/viz_projects/typesdb.js) | `types` |
| [`../databases/viz_projects/rh_postsdb.js`](../databases/viz_projects/rh_postsdb.js) | `posts` |

## Cursor state

The block scanner uses [`../databases/blocksdb.js`](../databases/blocksdb.js). On startup, [`../viz.js`](../viz.js) reads `bdb.getBlock(PROPS.last_irreversible_block_num)` and then stores progress with `bdb.updateBlock(bn)`.

## Backup note

A production backup should include MongoDB collections and production `config.json`. The repository template alone is not enough to restore runtime state.
