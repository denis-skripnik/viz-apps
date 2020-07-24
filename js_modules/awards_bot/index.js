const botjs = require("./bot");
const methods = require("../methods");

async function processAward(award) {
    let results_count = await botjs.awardMSG(award);
    return results_count;
}

async function processBlock(op, opbody) {
let ops_array = [];
    switch(op) {
            case "benefactor_award":
            ops_array.push({type: 'benefactor_award', data: opbody});
break;
case "receive_award":
ops_array.push({type: 'receive_award', data: opbody});
break;
default:
                //неизвестная команда
        }
    
let ok_ops_count = 0;
if (ops_array.length > 0) {
            ok_ops_count = await processAward(ops_array);
} else {
ok_ops_count = 0;
}
return ok_ops_count;
}

async function noReturn() {
    await botjs.startCommand();
    await botjs.aboutCommand();
    await botjs.adminCommand();
    await botjs.subscribeCommand();
    await botjs.unsubscribeCommand();
    await botjs.subscribesCommand();
    await botjs.addStopCommand();
    await botjs.delStopCommand();
await botjs.stoppedCommand();
    await botjs.yesCommand();
    await botjs.supportCommand();
    await botjs.nullSupportCommand();
await botjs.helpCommand();
await botjs.langEngCommand();
await botjs.langRuCommand();
await botjs.cancelCommand();
}

module.exports.processBlock = processBlock;
module.exports.noReturn = noReturn;