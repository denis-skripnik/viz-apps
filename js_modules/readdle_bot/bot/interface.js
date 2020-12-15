const methods = require(process.cwd() + '/js_modules/methods');
let lng = {};
lng['Русский'] = require('./languages/ru.json');
lng['English'] = require('./languages/en.json');
const botjs = require("./bot");
const udb = require(process.cwd() + "/databases/readdle_bot/usersdb");
const adb = require(process.cwd() + "/databases/readdle_bot/accountsdb");
const helpers = require(process.cwd() + "/js_modules/helpers");
const conf = require(process.cwd() + "/config.json");
var sjcl = require('sjcl');

// Клавиатура
async function keybord(lang, variant) {
    var buttons = [];
if (variant === 'lng') {
        buttons = [["English", "Русский"]];
    } else if (variant === 'home') {
        buttons = [[lng[lang].subscribes, lng[lang].accounts], [lng[lang].help, lng[lang].lang]];
    } else if (variant.indexOf('@') > -1) {
        let login = variant.split('@')[1];
        buttons = [[lng[lang].change_posting, lng[lang].publish], [lng[lang].delete, lng[lang].back, lng[lang].home]];
    }     else if (variant === 'subscribes') {
        buttons = [[lng[lang].add_subscription, lng[lang].back, lng[lang].home]];
    } else if (variant === 'conferm') {
        buttons = [[lng[lang].on, lng[lang].off, lng[lang].back, lng[lang].home]];
    }     else if (variant === 'accounts') {
        buttons = [[lng[lang].add_account, lng[lang].back, lng[lang].home]];
    }     else if (variant === 'back') {
    buttons = [[lng[lang].back, lng[lang].home]];
}     else if (variant === 'cancel') {
        buttons = [[lng[lang].cancel]];
    }
    return buttons;
}

// Команды
async function main(id, my_name, message, status) {
    let user = await udb.getUser(id);
    if (!user) {
        await udb.addUser(id, '', '', 'start', []);
    } else {
            await udb.updateUser(id, user.lng, user.status, message, []);
    }

    if (message.indexOf('start') > -1) {
let text = '';
let btns;
if (message.indexOf('start') > -1 && user && user.lng && user.lng !== '') {
    await main(id, my_name, lng[user.lng].home, status);
} else {
    text = `Select language: Выберите язык.`;
    btns = await keybord('', 'lng');
    await botjs.sendMSG(id, text, btns);
}
    } else if (user && user.lng && message.indexOf(lng[user.lng].add_account) > -1) {
            let text = lng[user.lng].enter_login;
            let btns = await keybord(user.lng, 'cancel');
            await botjs.sendMSG(id, text, btns);
    } else if (user && user.lng && message.indexOf(lng[user.lng].home) > -1) {
        let text = lng[user.lng].home_message;
        let btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(id, text, btns);        
    } else if (user && user.lng && message.indexOf(lng[user.lng].add_subscription) > -1) {
        let text = lng[user.lng].enter_login;
        let btns = await keybord(user.lng, 'cancel');
        await botjs.sendMSG(id, text, btns);
    } else if (user && user.lng && message.indexOf(lng[user.lng].subscribes) > -1) {
        let text = lng[user.lng].subscribes_list;
let subs = user.subscribes;
        if (subs && subs.length > 0) {
            for (let login of subs) {
        text += `
unsub ${login}`;
            }
        } else {
            text += lng[user.lng].subscribes_list_is_empty;
        }
                                        let btns = await keybord(user.lng, 'subscribes');
                                                    await botjs.sendMSG(id, text, btns);    
                                                } else if (user && user.lng && message.indexOf('unsub') > -1) {
let sub = message.split('unsub ')[1];
let subs = user.subscribes;
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
    text = lng[user.lng].unsubscribed + sub;
    await udb.updateUser(id, user.lng, user.status, 'unsubscribed', subscriptions);
} else {
    text = lng[user.lng].not_subscription + sub;
    await udb.updateUser(id, user.lng, user.status, 'not_subscription', user.subscribes);
}
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(id, text, btns);
    } else if (user && user.lng && message.indexOf(lng[user.lng].accounts) > -1) {
                                let text = lng[user.lng].accounts_list;
                                let accs = await adb.getAccounts(id);
                                if (accs && accs.length > 0) {
                                    for (let acc of accs) {
                                text += `
@${acc.login}`;
                                    }
                                } else {
                                    text += lng[user.lng].account_list_is_empty;
                                }
                                                                let btns = await keybord(user.lng, 'accounts');
                                                                            await botjs.sendMSG(id, text, btns);    
                                                                        } else if (user && user.lng && message === lng[user.lng].delete && user.status.indexOf('@') > -1) {
                                                                            let login = user.status.split('@')[1];
                                                                            if (message.split('@')[2]) {
                                                                                login += '@' + message.split('@')[2];
                                                                                    }
                                                                            await udb.updateUser(id, user.lng, user.status, 'delete_' + login, user.subscribes);
                                                                            let text = lng[user.lng].delete_conferm + login;
                                                    let btns = await keybord(user.lng, 'conferm');
                                                    await botjs.sendMSG(id, text, btns);

                                                } else if (message.indexOf('@') > -1 && message.indexOf(lng[user.lng].news) === -1 && user.status.indexOf('publish_') === -1) {
                                                                            let acc = await adb.getAccount(message.split('@')[1]);
if (acc && acc.id === id) {
    let text = lng[user.lng].change_account + message;
    let btns = await keybord(user.lng, message);
                        await botjs.sendMSG(id, text, btns);
}
                                                                                    } else if (user && user.lng && message === lng[user.lng].change_posting && user.status.indexOf('@') > -1) {
                                                                                        let login = user.status.split('@')[1];
                                                                                        let my_acc = await adb.getAccount(login);
                                                                                        let text = '';
                                                                                        let btns;
                                                                                        if (my_acc && my_acc.id === id) {
                                                                                        let get_account = await methods.getAccount(login);
                                                                                        let acc = get_account[0]
                                                                                        if (get_account && get_account.length > 0) {
                                                                                            let posting_public_keys = [];
                                                                                        for (key of acc.regular_authority.key_auths) {
                                                                                        posting_public_keys.push(key[0]);
                                                                                        }
                                                                                            text = lng[user.lng].type_posting;
                                                                                            btns = await keybord(user.lng, 'cancel');
                                                                                            await udb.updateUser(id, user.lng, user.status, 'changed_posting_' + login + '_' + JSON.stringify(posting_public_keys), user.subscribes);
                                                                                        } else {
                                                                                            await udb.updateUser(id, user.lng, user.status, 'change_account', user.subscribes);
                                                                                            text = lng[user.lng].not_account;
                                                                                            btns = await keybord(user.lng, 'home');
                                                                                        }
                                                                                    } else {
                                                                                        text = lng[user.lng].account_not_add;
                                                                                        btns = await keybord(user.lng, 'home');
                                                                                    }
                                                                                        await botjs.sendMSG(id, text, btns);
                                                                                    } else if (user && user.lng && message === lng[user.lng].publish && user.status.indexOf('@') > -1) {
                                                                                        let login = user.status.split('@')[1];
                                                                                            let text = lng[user.lng].type_post;
                                                                                            let btns = await keybord(user.lng, 'cancel');
                                                                                            await udb.updateUser(id, user.lng, user.status, 'publish_' + login, user.subscribes);
                                                                                        await botjs.sendMSG(id, text, btns);
                                                            } else if (user && user.lng && message.indexOf(lng[user.lng].news) > -1) {
                                                                if (status === 2) {
                                                                let text = message.split('Новости:')[1];
                                                                let btns = await keybord(user.lng, 'home');
let all_users = await udb.findAllUsers();
for (let one_user of all_users) {
    try {
    await botjs.sendMSG(one_user.id, text, btns);
    } catch(e) {
        continue;
    }
    await helpers.sleep(1000);
}
                                                                }                                                            
                                                            } else if (user && user.lng && message.indexOf(lng[user.lng].help) > -1) {
                                                                let text = lng[user.lng].help_text;
                                                                let btns = await keybord(user.lng, 'home');
                                                                            await botjs.sendMSG(id, text, btns);
                                                            } else if (typeof lng[message] !== "undefined") {
                        let text = lng[message].selected_language;
        let btns = await keybord(message, '');
let subscribes = [];
        if (user && user.subscribes) {
    subscribes = user.subscribes;
}
        let status = 'lng';
        if (user && user.status) {
            status = user.status;
        }
await udb.updateUser(id, message, status, 'selected_language', subscribes);
                    await botjs.sendMSG(id, text, btns);
                    await helpers.sleep(3000);
                    await main(id, my_name, lng[message].home, status);
                } else if (user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].back) > -1 || user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].cancel) > -1) {
                    await main(id, my_name, user.prev_status, status);
                } else {
                    if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].add_account) {
let get_account = await methods.getAccount(message);
let text = '';
let btns;
if (get_account && get_account.length > 0) {
    let acc = get_account[0]
    let posting_public_keys = [];
for (key of acc.regular_authority.key_auths) {
posting_public_keys.push(key[0]);
}
    text = lng[user.lng].type_posting;
    btns = await keybord(user.lng, 'cancel');
    await udb.updateUser(id, user.lng, user.status, 'login_' + message + '_' + JSON.stringify(posting_public_keys), user.subscribes);
} else {
    await udb.updateUser(id, user.lng, user.status, 'add_account', user.subscribes);
    text = lng[user.lng].not_account;
    btns = await keybord(user.lng, 'home');
}
await botjs.sendMSG(id, text, btns);
                    } else if (user && user.lng && lng[user.lng] && user.status.indexOf('login_') > -1) {
let login = user.status.split('_')[1];
let posting_public_keys = user.status.split('_')[2];
let text = '';
let btns;
try {
const public_wif = await methods.wifToPublic(message);
console.log(JSON.stringify(posting_public_keys), public_wif);
if (posting_public_keys.indexOf(public_wif) > -1) {
await adb.updateAccount(id, login, sjcl.encrypt(login + '_postingKey_readdle_bot', message));
await udb.updateUser(id, user.lng, user.status, 'posting_' + login, user.subscribes);
text = lng[user.lng].saved_true;
btns = await keybord(user.lng, 'home');
await botjs.sendMSG(id, text, btns);
} else {
    await udb.updateUser(id, user.lng, user.status, lng[user.lng].home, user.subscribes);
    text = lng[user.lng].posting_not_found;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
    await helpers.sleep(1000);
    await main(id, my_name, lng[user.lng].change_posting + '@' + login, status);
}
} catch(e) {
    await udb.updateUser(id, user.lng, user.status, lng[user.lng].home);
    text = lng[user.lng].posting_not_valid;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
    await helpers.sleep(1000);
    await main(id, my_name, lng[user.lng].change_posting + '@' + login, status);
}    
} else if (user && user.lng && lng[user.lng] && user.status.indexOf('changed_posting_') > -1) {
    let arr = user.status.split('@')[1];
    let login = arr.split('_')[0];
    let text = '';
let btns;
try {
    const public_wif = await methods.wifToPublic(message);
    let posting_public_keys = user.status.split('_')[3];
    console.log(JSON.stringify(posting_public_keys), public_wif);
    if (posting_public_keys.indexOf(public_wif) > -1) {
    await adb.updateAccount(id, login, sjcl.encrypt(login + '_postingKey_readdle_bot', message));
                            await udb.updateUser(id, user.lng, user.status, 'added_posting_key', user.subscribes);
                            text = lng[user.lng].saved_posting_key + login;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
} else {
    await udb.updateUser(id, user.lng, user.status, lng[user.lng].home, user.subscribes);
    text = lng[user.lng].posting_not_found;
    btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
    await helpers.sleep(1000);
    await main(id, my_name, lng[user.lng].change_posting + '@' + login, status);
}
    } catch(e) {
        await udb.updateUser(id, user.lng, user.status, lng[user.lng].home, user.subscribes);
        console.log(JSON.stringify(e));
        text = lng[user.lng].posting_not_valid;
        btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(id, text, btns);
    }    
} else if (user && user.lng && lng[user.lng] && user.status.indexOf('publish_') > -1) {
let login = user.status.split('_')[1];
let text = '';
try {
        let acc = await adb.getAccount(login);
        if (acc) {
            let wif = sjcl.decrypt(login + '_postingKey_readdle_bot', acc.posting_key);
            let data = {};
    let custom_data = await methods.getCustomProtocolAccount(login, 'V');
    data.p =         custom_data.custom_sequence_block_num;
    data.d = {};
            data.d.text = message;
            await methods.sendJson(wif, login, 'V', JSON.stringify(data));
            text = lng[user.lng].sended_post;
        } else {
            text = lng[user.lng].post_not_sended;
        }
        } catch(e) {
            console.log(e, JSON.stringify(e));
            text = lng[user.lng].post_not_sended;
        }
    let btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
} else if (user && user.lng && lng[user.lng] && user.status.indexOf('delete_') > -1) {
    let login = user.status.split('_')[1];
    if (user.status.split('_')[2]) {
login += ' @' + user.status.split('_')[2];
    }
    console.log('Логин: ' + login);
    let acc = await adb.getAccount(login);
    let text = '';
    if (acc) {
        text = lng[user.lng].delete_false;
        if (message === lng[user.lng].on) {
    text = lng[user.lng].delete_true;
    let res = await adb.removeAccount(id, login);
console.log('Результат: ' + JSON.stringify(res));
}
    }                        
    await udb.updateUser(id, user.lng, user.status, 'delet_account', user.subscribes);
    let btns = await keybord(user.lng, 'home');
    await botjs.sendMSG(id, text, btns);
    await helpers.sleep(3000);
    await main(id, my_name, lng[user.lng].home, status);
} else if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].add_subscription) {
        let get_account = await methods.getAccount(message);
        let text = '';
        if (get_account && get_account.length > 0) {
                        let subscribes = user.subscribes;
                        subscribes.push(message);
            text = lng[user.lng].subscription_added;
            await udb.updateUser(id, user.lng, user.status, 'added_subscription', subscribes);
        } else {
            await udb.updateUser(id, user.lng, user.status, 'not_account', user.subscribes);
            text = lng[user.lng].not_account;
        }
        let btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(id, text, btns);
    }
}
}

async function sendNotify(login, lang, id, bn, data) {
    let text = '';
    if (data.t && data.t === 'p' && !data.d.r && !data.d.s) {
        text = `${lng[lang].type_publication}: ${data.d.t}
${lng[lang].announcement}:
${data.d.d}
[${lng[lang].read}](https://readdle.me/dapp.html#viz://@${login}/${bn})`;
    } else if (!data.t && !data.d.s && !data.d.r) {
        text = `${lng[lang].type_note}:
${data.d.text}
[${lng[lang].read}](https://readdle.me/dapp.html#viz://@${login}/${bn})`;
} else if (!data.t && !data.d.r && data.d.s) {
    text = `${lng[lang].type_repost} [${data.d.s}](${data.d.s}):

    ${data.d.text}
[${lng[lang].read}](https://readdle.me/dapp.html#viz://@${login}/${bn})`;
} else if (!data.t && !data.d.s && data.d.r) {
    text = `${lng[lang].type_reply} [${data.d.r}](${data.d.r}):
    
    ${data.d.text}

    [${lng[lang].read}](https://readdle.me/dapp.html#viz://@${login}/${bn})`;
}
        let btns = await keybord(lang, 'home');
    await botjs.sendMSG(id, text, btns);
}

module.exports.main = main;
module.exports.sendNotify = sendNotify;