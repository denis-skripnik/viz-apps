const methods = require(process.cwd() + '/js_modules/methods');
let lng = {};
lng['Русский'] = require('./languages/ru.js');
lng['English'] = require('./languages/en.js');
const botjs = require("./bot");
const bdb = require(process.cwd() + "/databases/blocksdb");
const udb = require(process.cwd() + "/databases/mg_bot/usersdb");
const ftqdb = require(process.cwd() + "/databases/mg_bot/ftqdb");
const helpers = require(process.cwd() + "/js_modules/helpers");
const conf = require(process.cwd() + "/config.json");
var crypto = require('crypto');

// Клавиатура
async function keybord(lang, variant) {
    var buttons = [];
if (variant === 'lng') {
        buttons = [["English", "Русский"]];
    } else if (variant === 'home') {
        buttons = [[lng[lang].fortune_telling, lng[lang].lang, lng[lang].help]];
    } else if (variant === 'fortune_telling') {
        buttons = [[lng[lang].ft_award, lng[lang].ft_standart, lng[lang].back]];
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
        await udb.addUser(id, '', '', 'start');
    } else {
        if (user.status === message) {
            await udb.updateUser(id, user.lng, user.prev_status, message);
            } else {
                await udb.updateUser(id, user.lng, user.status, message);
            }
    }

    if (message.indexOf('start') > -1) {
let text = '';
let btns;
if (message.indexOf('start') > -1 && user && user.lng && user.lng !== '') {
    await main(id, lng[user.lng].home, status);
} else {
    text = `Select language: Выберите язык.`;
    btns = await keybord('', 'lng');
    await botjs.sendMSG(id, text, btns, false);
}
} else if (user && user.lng && message.indexOf(lng[user.lng].lang) > -1) {
let text = `Select language: Выберите язык.`;
btns = await keybord('', 'lng');
await botjs.sendMSG(id, text, btns, false);
    } else if (user && user.lng && message.indexOf(lng[user.lng].home) > -1) {
        let text = lng[user.lng].home_message;
        let btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(id, text, btns, false);        
    } else if (user && user.lng && message.indexOf(lng[user.lng].fortune_telling) > -1) {
        let text = lng[user.lng].ft_text;
                let btns = await keybord(user.lng, 'cancel');
        await botjs.sendMSG(id, text, btns, false);        
    } else if (user && user.lng && message.indexOf(lng[user.lng].ft_award) > -1) {
let q = user.status;
var hash = crypto.createHash('md5').update(q).digest('hex');
        let text = lng[user.lng].ft_award_text(conf.mg_bot.award_account, `ft:${id}`);
        let btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(id, text, btns, false);        
await ftqdb.updateHashData(hash, q, id);
} else if (user && user.lng && message.indexOf(lng[user.lng].ft_standart) > -1) {
    let q = user.status;
    var hash = crypto.createHash('md5').update(q).digest('hex');
    const block_n = await bdb.getBlock();
    let bn = block_n.last_block;
    let number = await methods.randomWithHash(hash, bn, 2);

    let variant = lng[user.lng][number];
    let random_variant = await helpers.getRandomInRange(1, variant.length);
    
    let ft_result = variant[random_variant - 1];
let text = `${q}
${ft_result}
${lng[user.lng].more}:
${lng[user.lng].block_hash} ${bn},
${lng[user.lng].text_hash}: ${hash},
${lng[user.lng].number_types},
${lng[user.lng].generated_number}: ${number}.
`;
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(id, text, btns, false);
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
                                                                            await botjs.sendMSG(id, text, btns, false);
                                                            } else if (typeof lng[message] !== "undefined") {
                        let text = lng[message].selected_language;
        let btns = await keybord(message, '');
        let status = 'lng';
        if (user && user.status) {
            status = user.status;
        }
await udb.updateUser(id, message, status, lng[message].home);
                    await botjs.sendMSG(id, text, btns, false);
                    await helpers.sleep(3000);
                  await main(id, lng[message].home, 1);
                } else if (user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].back) > -1 || user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].cancel) > -1) {
                    await main(id, user.prev_status, status);
                } else {
                    if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].fortune_telling) {
                let text = lng[user.lng].ft_message;
        let btns = await keybord(user.lng, 'fortune_telling');
        await botjs.sendMSG(id, text, btns, false);
    }
}
}

async function futureTellingNotify(bn, memo) {
    let [type, id] = memo.split(':');
if (type && id) {
    let data = await ftqdb.getHashById(parseInt(id));
    let q = data.text;
    let user = await udb.getUser(parseInt(id));
    if (user) {
        let number = await methods.randomWithHash(data.hash, bn, 2);
        let variant = lng[user.lng][number];
        let random_variant = await helpers.getRandomInRange(1, variant.length);
        
        let ft_result = variant[random_variant - 1];
    let text = `${q}
${ft_result}
${lng[user.lng].more}:
${lng[user.lng].block_hash} ${bn},
${lng[user.lng].text_hash}: ${data.hash},
${lng[user.lng].number_types},
${lng[user.lng].generated_number}: ${number}.
`;
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(parseInt(id), text, btns, false);
await ftqdb.removeHashData(parseInt(id), data.hash);
}
}
}

module.exports.main = main;
module.exports.futureTellingNotify = futureTellingNotify;