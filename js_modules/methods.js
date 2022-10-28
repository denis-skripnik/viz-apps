var conf = require('../config.json');
var viz = require('viz-js-lib');
viz.config.set('websocket',conf.node);
let keccak = require("keccak");
let BigI = require("big-integer");

async function getOpsInBlock(bn) {
    return await viz.api.getOpsInBlockAsync(bn, false);
  }

  let time_start = new Date().getTime();
  let properties = {};
        async function getProps() {
      let old_time = time_start;
    time_start = new Date().getTime();
let time_call = time_start - old_time;
    if (time_call < 0) time_call = 0;
    if (time_call === 0 || time_call >= 3000 || Object.keys(properties).length === 0) {
    properties = await viz.api.getDynamicGlobalPropertiesAsync();
}
return properties;
      }


      async function getConfig() {
        return await viz.api.getConfigAsync();
        }
  
      async function updateAccount(service) {
let test_user = '';
let pk = '';
        let 					metadata={};
        metadata.profile={};
                if (service === 'votes') {
        metadata.profile.name = 'Опросы и референдумы';
            metadata.profile.about= `Опросы и референдумы на Голосе. Создание путём отправки к null от ${conf.vote_price} с определённым кодом (рекомендуем пользоваться интерфейсом на dpos.space)`;
            metadata.profile.website = 'https://dpos.space/viz-polls';
        test_user = conf[service].login;
        pk = conf[service].posting_key;
        }
            let json_metadata=JSON.stringify(metadata);
        return await viz.broadcast.accountMetadataAsync(pk,test_user,json_metadata);
    }
    
    async function getAccount(login) {
        return await viz.api.getAccountsAsync([login]);
        }
    
async function getCustomProtocolAccount(account, custom_protocol_id) {
return await viz.api.getAccountAsync(account, custom_protocol_id);
}

async function lookupAccounts(curr_acc) {
    return await viz.api.lookupAccountsAsync(curr_acc, 100);
}

async function getAccounts(accs) {
    return await viz.api.getAccountsAsync(accs);
}

async function send(operations, regular_wif) {
try {
    return await viz.broadcast.sendAsync({extensions: [], operations}, [regular_wif]);
} catch(e) {
    console.error(e);
    console.log('Операции: ', JSON.stringify(operations));
}
}

async function wifToPublic(key) {
    return viz.auth.wifToPublic(key);
}

async function workerVote(num, percent, login, key) {
    try {
      let result = await viz.broadcast.committeeVoteRequestAsync(key, login, num, percent);
return {status: "ok", data: result};
    } catch(e) {
    console.log(e);
    return {status: "error", data: e};
    }
    }
    
    async function verifyData(data, signature, VIZPUBKEY) {
        return viz.auth.signature.verifyData(data, viz.auth.signature.fromHex(signature),VIZPUBKEY);
    }
    
    async function getSubscriptionStatus(subscriber, account) {
        let active = false;
        try {
        let approveSubscribe = await viz.api.getPaidSubscriptionStatusAsync(subscriber, account);
    active = approveSubscribe.active;
        } catch(e) {
          console.log(JSON.stringify(e));
        }
    return active;    
    }

async function sendJson(wif, login, id, json) {
    return await viz.broadcast.customAsync(wif, [], [login], id, json);
}

async function award(wif, initiator, receiver, percent, memo, beneficiaries = []) {
var energy=percent * 100;
energy = parseInt(energy);
return await viz.broadcast.awardAsync(wif,initiator,receiver,energy,0,memo,beneficiaries);
}

async function getBlockSignature(block) {
    var b = await viz.api.getBlockAsync(block);
    if(b && b.witness_signature) {
        return b.witness_signature;
    } 
    throw "unable to retrieve signature for block " + block;
}

async function randomGenerator(start_block, end_block, maximum_number) {
    let hasher = new keccak("keccak256");
    let sig = await getBlockSignature(end_block);
    let prevSig = await getBlockSignature(start_block);
    hasher.update(prevSig + sig);
        let sha3 = hasher.digest().toString("hex");
    let random = BigI(sha3, 16).mod(maximum_number);
    return parseInt(random);
}

async function randomWithHash(hash, block, maximum_number) {
    let hasher = new keccak("keccak256");
    let sig = await getBlockSignature(block);
    let prevSig = hash;
    hasher.update(prevSig + sig);
        let sha3 = hasher.digest().toString("hex");
    let random = BigI(sha3, 16).mod(maximum_number);
    return parseInt(random);
}

async function getWitnessByAccount(login) {
    return await viz.api.getWitnessByAccountAsync(login)
}

async function getWitnessesByVote(login, limit) {
    return await viz.api.getWitnessesByVoteAsync(login,limit);
}

async function getWitnessSchedule() {
    return await viz.api.getWitnessScheduleAsync();
}

async function sendReblog(account, wif, author, block) {
    let data = {};
    let custom_data = await getCustomProtocolAccount(account, 'V');
    data.p =         custom_data.custom_sequence_block_num;
    data.d = {};
            data.d.t = '';
            data.d.s = `viz://@${author}/${block}`;
            await sendJson(wif, account, 'V', JSON.stringify(data));
}

module.exports.getOpsInBlock = getOpsInBlock;
module.exports.getProps = getProps;      
module.exports.getConfig = getConfig;
module.exports.updateAccount = updateAccount;
module.exports.getAccount = getAccount;
module.exports.getCustomProtocolAccount = getCustomProtocolAccount;
module.exports.lookupAccounts = lookupAccounts;
module.exports.getAccounts = getAccounts;
module.exports.send = send;
module.exports.wifToPublic = wifToPublic;
module.exports.workerVote = workerVote;
module.exports.verifyData = verifyData;
module.exports.getSubscriptionStatus = getSubscriptionStatus;
module.exports.sendJson = sendJson;
module.exports.award = award;
module.exports.randomGenerator = randomGenerator;
module.exports.randomWithHash = randomWithHash;
module.exports.getWitnessByAccount = getWitnessByAccount;
module.exports.getWitnessesByVote = getWitnessesByVote;
module.exports.getWitnessSchedule = getWitnessSchedule;
module.exports.sendReblog = sendReblog;