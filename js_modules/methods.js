var conf = require('../config.json');
var viz = require('viz-js-lib');
viz.config.set('websocket',conf.node);

async function getOpsInBlock(bn) {
    return await viz.api.getOpsInBlockAsync(bn, false);
  }

  async function getProps() {
      return await viz.api.getDynamicGlobalPropertiesAsync();
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
    
async function lookupAccounts(curr_acc) {
    return await viz.api.lookupAccountsAsync(curr_acc, 100);
}

async function getAccounts(accs) {
    return await viz.api.getAccountsAsync(accs);
}

async function send(operations, posting) {
    return await viz.broadcast.sendAsync({extensions: [], operations}, [posting]);
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

module.exports.getOpsInBlock = getOpsInBlock;
module.exports.getProps = getProps;      
module.exports.updateAccount = updateAccount;
module.exports.getAccount = getAccount;
module.exports.lookupAccounts = lookupAccounts;
module.exports.getAccounts = getAccounts;
module.exports.send = send;
module.exports.wifToPublic = wifToPublic;
module.exports.workerVote = workerVote;
module.exports.verifyData = verifyData;
module.exports.getSubscriptionStatus = getSubscriptionStatus;