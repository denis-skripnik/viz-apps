const helpers = require("./helpers");
const methods = require("./methods");
const votes = require("../databases/votesdb");
const vadb = require("../databases/vadb");
const conf = require('../config.json');

async function transferOperation(timestamp, op, opbody) {
        opbody.memo = opbody.memo.replace(/\s+/g, ' ').trim();
        let ok_ops_count = 0;
        try {
        let isJson = await helpers.isJsonString(opbody.memo);
if (isJson.approve === true && opbody.to === conf.votes.to && opbody.amount.indexOf('VIZ') > -1 && parseFloat(opbody.amount) >= parseFloat(conf.votes.vote_price) && isJson.data && isJson.data.contractName === 'viz-votes') {
let arr = isJson.data;
if (arr.contractAction === 'createVote' && arr.contractPayload && arr.contractPayload.question && arr.contractPayload.answers && typeof arr.contractPayload.consider != undefined) {
    if (!arr.contractPayload.end_date) {
        let nowUnixTime = await helpers.unixTime();
        arr.contractPayload.end_date = nowUnixTime + 432000;
    }
                try {
    let permlink = 'survey-' + parseInt(new Date(timestamp).getTime()/1000);
let status = await votes.addVote(arr.contractPayload.question, arr.contractPayload.answers, permlink, arr.contractPayload.consider, arr.contractPayload.end_date);
ok_ops_count += 1;
} catch(err) {
console.log(err);
}
} // action createVote.
    }
} catch(e) {
console.log(e);
}
return ok_ops_count;
    }
    
    async function customOperation(op, opbody) {
        let ok_ops_count = 0;
        try {
            let arr = JSON.parse(opbody.json);
    if (opbody.id === 'viz-votes' && arr.contractAction === 'voteing' && arr.contractPayload && arr.contractPayload.votePermlink && arr.contractPayload.answerId) {
        let nowUnixTime = await helpers.unixTime();
        let isVote = await votes.getVoteByPermlink(arr.contractPayload.votePermlink);
    if (isVote && isVote.end_date > nowUnixTime && isVote.answers.length-1 >= arr.contractPayload.answerId) {
    let acc = await methods.getAccount(opbody.required_regular_auths[0]);
    let shares = 0;
    if (isVote.consider && isVote.consider === 0 || isVote.consider === "0") {
    shares = parseFloat(acc[0].vesting_shares);
    } else if (isVote.consider && isVote.consider === 1 || isVote.consider === "1") {
    shares = parseFloat(acc[0].vesting_shares) + parseFloat(acc[0].proxied_vsf_votes[0]/1000000);
    } else if (isVote.consider && isVote.consider === 2 || isVote.consider === "2") {
    shares = parseFloat(acc[0].vesting_shares) + parseFloat(acc[0].received_vesting_shares) - parseFloat(acc[0].delegated_vesting_shares);
    } else {
    shares = parseFloat(acc[0].vesting_shares);
    }
    let status = await vadb.updateVa(arr.contractPayload.votePermlink, arr.contractPayload.answerId, opbody.required_regular_auths[0], shares);
    } // isVote.            
    } // Action voteing.
    ok_ops_count += 1;
    } catch(e) {
    console.log(e);
    }
    return ok_ops_count;
    }
    
module.exports.transferOperation = transferOperation;
module.exports.customOperation = customOperation;