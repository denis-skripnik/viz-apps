require("./js_modules/ajax");
const CronJob = require('cron').CronJob;
const conf = require("./config.json");
const prices = require("./js_modules/vizprice");
const top = require("./js_modules/viz_top");
const awards = require("./js_modules/awards_bot");
const committee = require("./js_modules/committee_bot");
const helpers = require("./js_modules/helpers");
const methods = require("./js_modules/methods");
const bdb = require("./databases/blocksdb");
const LONG_DELAY = 12000;
const SHORT_DELAY = 3000;
const SUPER_LONG_DELAY = 1000 * 60 * 15;

async function processBlock(bn) {
    const block = await methods.getOpsInBlock(bn);
let ok_ops_count = 0;
    for(let tr of block) {
        const [op, opbody] = tr.op;
        switch(op) {
            case "transfer":
            break;
            case "custom":
            ok_ops_count += await prices.customOperation(op, opbody);
            break;
            case "benefactor_award":
            case "receive_award":
ok_ops_count += await awards.processBlock(op, opbody);
break;
case "committee_worker_create_request":
ok_ops_count += await committee.processCommittee(PROPS.committee_requests, opbody);
default:
                    //неизвестная команда
            }
        }
        return ok_ops_count;
    }

let PROPS = null;

let bn = 0;
let last_bn = 0;
let delay = SHORT_DELAY;

async function getNullTransfers() {
    PROPS = await methods.getProps();
            const block_n = await bdb.getBlock(PROPS.last_irreversible_block_num);
bn = block_n.last_block;

delay = SHORT_DELAY;
while (true) {
    try {
        if (bn > PROPS.last_irreversible_block_num) {
            // console.log("wait for next blocks" + delay / 1000);
            await helpers.sleep(delay);
            PROPS = await methods.getProps();
        } else {
            if(0 < await processBlock(bn)) {
                delay = SHORT_DELAY;
            } else {
                delay = LONG_DELAY;
            }
            bn++;
            await bdb.updateBlock(bn);
        }
    } catch (e) {
        console.log("error in work loop" + e);
        await helpers.sleep(1000);
        }
    }
}

setInterval(() => {
    if(last_bn == bn) {

        try {
                process.exit(1);
        } catch(e) {
            process.exit(1);
        }
    }
    last_bn = bn;
}, SUPER_LONG_DELAY);

getNullTransfers()

new CronJob('0 30 * * * *', top.run, null, true);

awards.noReturn();

new CronJob('0 * * * * *', committee.timer, null, true);
committee.noReturn();