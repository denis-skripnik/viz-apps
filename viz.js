require("./databases/@db.js").initialize({
    url: 'mongodb://localhost:27017',
    poolSize: 15
});
require("./js_modules/api");
const CronJob = require('cron').CronJob;
const conf = require("./config.json");
const prices = require("./js_modules/vizprice");
const top = require("./js_modules/viz_top");
const awards = require("./js_modules/awards_bot");
const committee = require("./js_modules/committee_bot");
const rb = require("./js_modules/readdle_bot");
const vp = require("./js_modules/viz_projects");
const wr = require("./js_modules/witness_rewards");
const links = require("./js_modules/links");
const votes = require("./js_modules/votes");
const helpers = require("./js_modules/helpers");
const methods = require("./js_modules/methods");
const bdb = require("./databases/blocksdb");
const LONG_DELAY = 12000;
const SHORT_DELAY = 3000;
const SUPER_LONG_DELAY = 1000 * 60 * 15;

async function processBlock(bn) {
    if (bn%28800 == 0) {
        await links.updateShares();
            }
        
    const block = await methods.getOpsInBlock(bn);
let ok_ops_count = 0;
    for(let tr of block) {
        const [op, opbody] = tr.op;
        switch(op) {
            case "witness_reward":
                ok_ops_count += await wr.witnessRewardOperation(opbody, tr.timestamp);
                break;
            case "transfer":
if (opbody.to === conf.viz_projects.login && opbody.amount === conf.viz_projects.amount) {
ok_ops_count += await vp.transferOperation(opbody);
} else {
    ok_ops_count += await votes.transferOperation(tr.timestamp, op, opbody);
}
            break;
            case "custom":
            ok_ops_count += await prices.customOperation(op, opbody);
            ok_ops_count += await votes.customOperation(op, opbody);
            if (opbody.id === 'viz-projects') {
                ok_ops_count += await vp.customOperation(tr.timestamp, opbody);
            } else if (opbody.id === 'V') {
                ok_ops_count += await rb.notify(opbody.required_regular_auths[0], bn, JSON.parse(opbody.json));
            }
            break;
            case "benefactor_award":
                ok_ops_count += await awards.processBlock(op, opbody);
                break;
                case "receive_award":
ok_ops_count += await awards.processBlock(op, opbody);
let data = opbody.memo.split(',');
if (opbody.receiver === 'committee' && data.length === 3) {
    ok_ops_count += await links.receiveAwardOperation(opbody.custom_sequence, parseFloat(opbody.shares), data);
}
break;
case "committee_worker_create_request":
ok_ops_count += await committee.committeeWorkerCreateRequestOperation(PROPS.committee_requests, opbody);
break;
case "committee_pay_request":
ok_ops_count += await committee.committeePayRequestOperation(opbody);
break;
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
new CronJob('0 0 3 * * *', wr.producersDay, null, true);    
new CronJob('0 0 3 1 * *', wr.producersMonth, null, true);

awards.noReturn();

committee.noReturn();