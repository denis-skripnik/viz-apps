const methods = require(process.cwd() + '/js_modules/methods');
let lng = {};
lng['Ru'] = require('./languages/ru.json');
lng['Eng'] = require('./languages/en.json');
const botjs = require("./bot");
const udb = require(process.cwd() + "/databases/awards_bot/usersdb");
const helpers = require(process.cwd() + "/js_modules/helpers");
const conf = require(process.cwd() + "/config.json");

// Клавиатура
async function keybord(lang, variant) {
    var buttons = [];
if (variant === 'lng') {
        buttons = [["English", "Русский"]];
    } else if (variant === 'home') {
        buttons = [[lng[lang].subscribes, lng[lang].lang, lng[lang].help]];
    }     else if (variant === 'subscribes') {
        buttons = [[lng[lang].add_subscription, lng[lang].back, lng[lang].home]];
    } else if (variant === 'conferm') {
        buttons = [[lng[lang].on, lng[lang].off, lng[lang].back, lng[lang].home]];
    }     else if (variant === 'back') {
    buttons = [[lng[lang].back, lng[lang].home]];
}     else if (variant === 'cancel') {
        buttons = [[lng[lang].cancel]];
    }
    return buttons;
}

// Команды
async function main(id, message, status) {
    let user = await udb.getUser(id);
    if (!user) {
        await udb.addUser(id, '', '', 'start', []);
    } else {
        if (user.status === message) {
            await udb.updateUser(id, user.lang, user.prev_status, message, user.subscribe);
            } else {
                await udb.updateUser(id, user.lang, user.status, message, user.subscribe);
            }
    }

    if (message.indexOf('start') > -1) {
let text = '';
let btns;
if (message.indexOf('start') > -1 && user && user.lang && user.lang !== '') {
    await main(id, lng[user.lang].home, status);
} else {
    text = `Select language: Выберите язык.`;
    btns = await keybord('', 'lng');
    await botjs.sendMSG(id, text, btns, false);
}
} else if (user && user.lang && message.indexOf(lng[user.lang].lang) > -1) {
let text = `Select language: Выберите язык.`;
btns = await keybord('', 'lng');
await botjs.sendMSG(id, text, btns, false);
    } else if (user && user.lang && message.indexOf(lng[user.lang].home) > -1) {
        let text = lng[user.lang].home_message;
        let btns = await keybord(user.lang, 'home');
        await botjs.sendMSG(id, text, btns, false);        
    } else if (user && user.lang && message.indexOf(lng[user.lang].add_subscription) > -1) {
        let text = lng[user.lang].enter_login;
        let btns = await keybord(user.lang, 'cancel');
        await botjs.sendMSG(id, text, btns, false);
    } else if (user && user.lang && message.indexOf(lng[user.lang].subscribes) > -1) {
        let text = lng[user.lang].subscribes_list;
let subs = user.subscribe;
if (subs && subs.length > 0) {
            for (let login of subs) {
        text += `
unsub ${login}`;
            }
        } else {
            text += lng[user.lang].subscribes_list_is_empty;
        }
                                        let btns = await keybord(user.lang, 'subscribes');
                                                    await botjs.sendMSG(id, text, btns, false);    
                                                } else if (user && user.lang && message.indexOf('unsub') > -1) {
let sub = message.split('unsub ')[1];
let subs = user.subscribe;
let subscriptions = [];
        let unsub_count = 0;
if (subs && subs.length > 0) {
            for (let login of subs) {
if (login !== sub) {
    subscriptions.push(login);
} else {
    unsub_count += 1;
}
            }
                }
                let text = '';
                if (unsub_count > 0) {
    text = lng[user.lang].unsubscribed + sub;
    await udb.updateUser(id, user.lang, user.status, lng[user.lang].home, subscriptions);
} else {
    text = lng[user.lang].not_subscription + sub;
    await udb.updateUser(id, user.lang, user.status, lng[user.lang].home, user.subscribe);
}
let btns = await keybord(user.lang, 'home');
await botjs.sendMSG(id, text, btns, false);
                                                                                    } else if (user && user.lang && message.indexOf(lng[user.lang].news) > -1) {
                                                                                                                                                        if (status === 2) {
                                                                let text = message.split('Новости:')[1];
                                                                let btns = await keybord(user.lang, 'home');
let all_users = await udb.findAllUsers();
for (let one_user of all_users) {
    try {
    await botjs.sendMSG(one_user.uid, text, btns);
    } catch(e) {
        continue;
    }
    await helpers.sleep(1000);
}
                                                                }                                                            
                                                            } else if (user && user.lang && message.indexOf(lng[user.lang].help) > -1) {
                                                                let text = lng[user.lang].help_text;
                                                                let btns = await keybord(user.lang, 'home');
                                                                            await botjs.sendMSG(id, text, btns, false);
                                                            } else if (typeof lng[message] !== "undefined") {
                        let text = lng[message].selected_language;
        let btns = await keybord(message, '');
let subscribes = [];
        if (user && user.subscribe) {
    subscribes = user.subscribe;
}
        let status = 'lng';
        if (user && user.status) {
            status = user.status;
        }
await udb.updateUser(id, message, status, lng[message].home, subscribes);
                    await botjs.sendMSG(id, text, btns, false);
                    await helpers.sleep(3000);
                  await main(id, lng[message].home, 1);
                } else if (user && user.lang && user.lang !== '' && message.indexOf(lng[user.lang].back) > -1 || user && user.lang && user.lang !== '' && message.indexOf(lng[user.lang].cancel) > -1) {
                    await main(id, user.prev_status, status);
                } else {
if (user && user.lang && lng[user.lang] && user.status === lng[user.lang].add_subscription) {
        let logins = message.split(',');
    console.log(JSON.stringify(logins));
        let get_accounts = await methods.getAccounts(logins);
        console.log(JSON.stringify(get_accounts))
        let text = '';
        if (get_accounts && get_accounts.length > 0) {
                        let subscribes = user.subscribe;
                        if (!subscribes) {
                            subscribes = [];
                        }
let logins_list = '';
                        for (let acc of get_accounts) {
    if (subscribes.indexOf(acc.name) === -1) {
        subscribes.push(acc.name);
        logins_list += `${acc.name}, `;
    }
}
logins_list = logins_list.replace(/,\s*$/, "");
text = lng[user.lang].subscription_added + logins_list;
            await udb.updateUser(id, user.lang, user.status, lng[user.lang].subscribes, subscribes);
        } else {
            await udb.updateUser(id, user.lang, user.status, lng[user.lang].home, user.subscribe);
            text = lng[user.lang].not_account;
        }
        let btns = await keybord(user.lang, 'home');
        await botjs.sendMSG(id, text, btns, false);
    }
    }
}

async function benefactorAward(opbody) {
        let users = await udb.findAllUsers();
        if (users && users.length > 0) {
for (let user of users) {
    let benefactor = opbody.benefactor;
    if (user.subscribe.indexOf(benefactor) === -1) continue;
    let cs = '';
if (opbody.custom_sequence > 0) cs = `${lng[user.lang].custom_sequence}: ${opbody.custom_sequence}`;
let memo = '';
if (opbody.memo !== '') memo = `${lng[user.lang].memo}: ${opbody.memo}`;
let initiator = opbody.initiator;   
let benef_shares = parseFloat(opbody.shares);
benef_shares = benef_shares.toFixed(3) + ' Ƶ VIZ';
let text = `🤘 <a href="https://dpos.space/viz/profiles/${benefactor}/benefactor-awards">${benefactor}</a> ${lng[user.lang].received_benefactor} <a href="https://dpos.space/viz/profiles/${initiator}/">${initiator}</a> ${lng[user.lang].to_amount} ${benef_shares}
${cs} ${memo}`;
let btns = await keybord(user.lang, 'no');
await botjs.sendMSG(user.uid, text, btns, false);
} // end for users.
        } // end if users.
}
    
async function receiveAward(opbody) {
    let users = await udb.findAllUsers();
    if (users && users.length > 0) {
for (let user of users) {
    let initiator = opbody.initiator;
    let receiver = opbody.receiver;
if (user.subscribe.indexOf(receiver) === -1) continue;
    let cs = '';
if (opbody.custom_sequence > 0) cs = `${lng[user.lang].custom_sequence}: ${opbody.custom_sequence}`;
let memo = '';
if (opbody.memo !== '') memo = `${lng[user.lang].memo}: ${opbody.memo}`;
            let receiver_shares = parseFloat(opbody.shares);
            receiver_shares = receiver_shares.toFixed(3) + ' Ƶ VIZ';
                let text = `😍 <a href="https://dpos.space/viz/profiles/${initiator}">${initiator}</a> ${lng[user.lang].awarded} <a href="https://dpos.space/viz/profiles/${receiver}">${receiver}</a> ${lng[user.lang].to_amount} ${receiver_shares}
${cs} ${memo}`;
let btns = await keybord(user.lang, 'no');
await botjs.sendMSG(user.uid, text, btns, false);
} // end for users.
        } // end if users.
}

module.exports.main = main;
module.exports.benefactorAward = benefactorAward;
module.exports.receiveAward = receiveAward;