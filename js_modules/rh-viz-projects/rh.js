const conf = require("../config.json");
const methods = require("./methods");
const helpers = require("./helpers");
const pdb = require("../databases/viz_projects/rh_postsdb");

async function customOperation(opbody) {
            if (opbody.id === 'V') {
                let author = opbody.required_regular_auths[0];
                let data = JSON.parse(opbody.json);
                if (!data.t) {
                    console.log(JSON.stringify(data));
                    return;
                }
                let text = data.t.t;
                if (data.t === 'p') {
                    text += `
${data.d.m}`;
                }
                if (text === '') return;
                let hashtags_pattern = /(|\b)#([^:;@#!.,?\r\n\t <>()\[\]]+)(|\b)/g;;
                let search_tags =text.match(hashtags_pattern)
                if (!search_tags) return;
                let tags = search_tags.map(function(p){return p.substring(1, p.length)});
                const found = tags.some(r=> conf.viz_projects.tags.indexOf(r) >= 0);
if (found === true) {
await pdb.addPost(author, bn);
    let acc = await methods.getAccount(author);
if (acc !== false && conf.viz_projects.sandbox.type === 'shares' && parseFloat(acc.vesting_shares) > parseFloat(conf.viz_projects.sandbox.value) || conf.viz_projects.sandbox.type === 'whitelist' && conf.viz_projects.whitelist.indexOf(author) > -1 || conf.viz_projects.sandbox.allow === false && conf.viz_projects.whitelist.indexOf(author) > -1) {
await methods.sendReblog(conf.viz_projects.account, conf.viz_projects.regular_key, author, bn);
} else if (acc !== false && conf.viz_projects.sandbox.allow === true && conf.viz_projects.sandbox.type === 'shares' && parseFloat(acc.vesting_shares) <= parseFloat(conf.viz_projects.sandbox.value) || conf.viz_projects.sandbox.allow === true && conf.viz_projects.sandbox.type === 'whitelist' && conf.viz_projects.whitelist.indexOf(author) === -1) {
    await methods.sendReblog(conf.viz_projects.sandbox.account, conf.viz_projects.sandbox.regular_key, author, bn);
}
} // end if found === true.
            }
        }

async function receiveAwardOperation(opbody) {
        if (opbody.memo.indexOf('viz://@') > -1) {
    let post = opbody.memo.split('@')[1];
let [author, block] = post.split('/');
let power = parseFloat(opbody.shares);
let content = await pdb.getPost(author, block);
if (content && Object.keys(content).length > 0) {
    power += content.power;
if (content.power === -1) return 0;
}

if (conf.viz_projects.popular.allow === true && power >= conf.viz_projects.popular.award_amount) {
    await methods.sendReblog(conf.viz_projects.popular.account, conf.viz_projects.popular.regular_key, author, block);
    await pdb.updatePost(author, block, -1);
} else {
    await pdb.updatePost(author, block, power);
}
}
    }

    module.exports.customOperation = customOperation;
module.exports.receiveAwardOperation = receiveAwardOperation;