var Big = require('big.js');
const fs = require('fs');
const methods = require(process.cwd() + '/js_modules/methods');
let lng = {};
lng['Русский'] = require('./languages/ru.js');
lng['English'] = require('./languages/en.js');
const botjs = require("./bot");
const bdb = require(process.cwd() + "/databases/blocksdb");
const udb = require(process.cwd() + "/databases/mg_bot/usersdb");
const ftqdb = require(process.cwd() + "/databases/mg_bot/ftqdb");
const cbdb = require(process.cwd() + "/databases/mg_bot/cbdb");
const bkdb = require(process.cwd() + "/databases/mg_bot/bkdb");
const rtdb = require(process.cwd() + "/databases/mg_bot/ringdb");
const sdb = require(process.cwd() + "/databases/mg_bot/sharesdb");
const axios = require("axios");
var crypto = require('crypto');
const helpers = require(process.cwd() + "/js_modules/helpers");
const conf = require(process.cwd() + "/config.json");
const { CryptoPay, Assets, PaidButtonNames } = require('@foile/crypto-pay-api');
const cryptoPay = new CryptoPay(conf.buy_viz.pay_api, {
    webhook: {
        serverHostname: 'backend.dpos.space',
        serverPort: 3245,
        path: '/buy-viz/crypto-bot_CBgfgtjuHGJGFHt'
    },
  });
  cryptoPay.on('invoice_paid', async (update) => {
    console.log(update.payload)
    if (update.payload.status !== 'paid') return;
try {
  let user = await udb.getUser(parseInt(update.payload.payload));
  if (user && Object.keys(user).length > 0) {
    let price = parseFloat(update.payload.amount) * parseFloat(update.payload.usd_rate);
if (price < conf.buy_viz.min_amount) return;
    let viz_amount = parseFloat(price / conf.buy_viz.price).toFixed(3) + ' VIZ';
await methods.transfer(conf.buy_viz.wif, conf.buy_viz.account, user.viz_login, viz_amount, 'You bought VIZ - Вы купили VIZ!')
let text = `${lng[user.lng].bought_viz} ${viz_amount} ${lng[user.lng].buy_viz_to} ${user.viz_login}`;
    let btns = await keybord(user.lng, 'no');
    await botjs.sendMSG(user.id, text, btns, false);
  return;
}
} catch(e) {
  console.error(e);
}
  });

const tmc = require('../tamagotchi');
const { send } = require('process');
var energy = new Big(20);
const RATE_LIMIT_MS = 600;
const actionStats = new Map();
// userId -> { lastTs, clicks: [], shadow: false }

function checkRateLimit(userId) {
    const now = Date.now();
    let s = actionStats.get(userId) || {
    lastActionTs: 0,
    clicks: [],
    violations: 0,
    lastViolation: 0,
    shadowUntil: 0
};

    if (s.lastActionTs && now - s.lastActionTs < RATE_LIMIT_MS) {
        applyShadow(userId);
        return false;
    }

    s.lastActionTs = now;
    actionStats.set(userId, s);
    return true;
}

function decayViolations(s) {
    if (!s.lastViolation || !s.violations) return;

    const now = Date.now();
    const decayStep = 30 * 60 * 1000;
    const passed = Math.floor((now - s.lastViolation) / decayStep);

    if (passed > 0) {
        s.violations = Math.max(0, s.violations - passed);
        s.lastViolation += passed * decayStep;
    }
}

function applyShadow(userId) {
    const now = Date.now();
    let s = actionStats.get(userId) || {};

    decayViolations(s);

    s.violations = (s.violations || 0) + 1;
    s.lastViolation = now;

    const base = 5 * 60 * 1000;
    const duration = Math.min(
        base * Math.pow(2, s.violations - 1),
        2 * 60 * 60 * 1000
    );

    s.shadowUntil = now + duration;

    actionStats.set(userId, s);
}

function detectAutoClicker(userId) {
    const now = Date.now();
    let s = actionStats.get(userId);
    if (!s) return false;
    
    if (!Array.isArray(s.clicks)) {
        s.clicks = [];
    }

    s.clicks.push(now);
    if (s.clicks.length > 8) s.clicks.shift();

    if (s.clicks.length < 6) return false;

    let diffs = [];
    for (let i = 1; i < s.clicks.length; i++) {
        diffs.push(s.clicks[i] - s.clicks[i - 1]);
    }

    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
    const variance = diffs.reduce((a, b) => a + Math.abs(b - avg), 0) / diffs.length;

    if (variance < 60) {
applyShadow(userId);
        actionStats.set(userId, s);
        return true;
    }

    return false;
}

function isShadowBanned(userId) {
    const s = actionStats.get(userId);
    if (!s || !s.shadowUntil) return false;

    if (Date.now() > s.shadowUntil) {
        s.shadowUntil = 0;
        s.clicks = [];
        actionStats.set(userId, s);
        return false;
    }

    return true;
}

function safeAddScore(score, userId) {
    if (!isShadowBanned(userId)) return score;

    if (score instanceof Big) {
        return new Big(0);
    }

    return 0;
}

async function sumNumbers(n1, n2) {
    let n = new Big(n1).plus(new Big(n2));
    return parseFloat(n.toFixed(2));
}

async function minusNumbers(n1, n2, isBig = false) {
    let n = new Big(n1).minus(new Big(n2));
    if (isBig === true) {
        return n;
    }
    return parseFloat(n.toFixed(2));
}

function countBullsAndCows(secret, suggestion) {
    let bulls = 0, cows = 0;
    suggestion = suggestion.toString();
    secret = secret.toString();
    
    for (let i = 0; i < secret.length; i++) {
      if (suggestion[i] === secret[i]) {
        bulls++;
      } else if (secret.includes(suggestion[i])) {
        cows++;
      }
    }
    
    return [bulls, cows];
  }
     
// Клавиатура
async function keybord(lang, variant) {
    var buttons = [];
if (variant === 'lng') {
        buttons = [["English", "Русский"]];
    } else if (variant === 'home') {
        buttons = [[lng[lang].reytings, lng[lang].my_viz_login, lng[lang].buy_viz, lng[lang].home], [lng[lang].boosts, lng[lang].lang, lng[lang].help, lng[lang].partners]];
    } else if (variant === 'games') {
        buttons = [[lng[lang].fortune_telling, lng[lang].random_numbers, lng[lang].bk_game], [lng[lang].crypto_bids, lng[lang].tamagotchi, lng[lang].home]];
    } else if (variant === 'games_inline') {
        buttons = [[[lng[lang].fortune_telling, lng[lang].fortune_telling], [lng[lang].random_numbers, lng[lang].random_numbers], [lng[lang].bk_game, lng[lang].bk_game]], [[lng[lang].crypto_bids, lng[lang].crypto_bids], [lng[lang].tamagotchi, lng[lang].tamagotchi], [lng[lang].boosts, lng[lang].boosts]]];
    } else if (variant === 'bk_game') {
        buttons = [[lng[lang].bk_level + '1', lng[lang].bk_level + '2', lng[lang].bk_level + '3'], [lng[lang].games, lng[lang].home]];
    } else if (variant === 'reytings') {
        buttons = [[lng[lang].scores_top, lng[lang].t_age_top, lng[lang].t_power_top], [lng[lang].t_xp_top, lng[lang].artifacts_owners, lng[lang].home]]
    } else if (variant === 'fortune_telling') {
        buttons = [[lng[lang].ft_award, lng[lang].ft_standart, lng[lang].back]];
    } else if (variant === 'ft_award_buttons') {
        buttons = [[lng[lang].ft_cancel, lng[lang].back], [lng[lang].games, lng[lang].home]];
    } else if (variant === 'bids_direction') {
        buttons = [[lng[lang].cb_more, lng[lang].cb_less], [lng[lang].back, lng[lang].home]];
    } else if (variant === 'not_subscribe') {
        buttons = [[lng[lang].check_subscribes]];
    }     else if (variant === 'back') {
    buttons = [[lng[lang].back, lng[lang].home]];
}     else if (variant === 'cancel') {
        buttons = [[lng[lang].cancel]];
    }     else if (variant === 'inline_cancel') {
        buttons = [[[lng[lang].cancel, lng[lang].cancel]]];
    }     else if (variant === 'games_buttons') {
        buttons = [[lng[lang].games, lng[lang].home]];
    }     else if (variant === 'bk_game_buttons') {
        buttons = [[lng[lang].reset_game, lng[lang].games, lng[lang].home]];
    } else if (variant.indexOf('tamagotchi|') > -1) {
        let data = JSON.parse(variant.split('|')[1]);
        const rowSize = 3; // количество кнопок в каждом ряду
        const numOfRows = Math.ceil(data.length / rowSize); // количество рядов
        for (let i = 0; i < numOfRows; i++) {
          let row = [];
          for (let j = 0; j < rowSize; j++) {
            let index = i * rowSize + j;
            if (index >= data.length) {
              break;
            }
            row.push([`${lng[lang].tamagotchi}|${data[index]}`, lng[lang][data[index]]]);
          }
          buttons.push(row);
        }
            buttons.push([[lng[lang].inventory, lng[lang].inventory], [lng[lang].t_ring, lng[lang].t_ring], [lng[lang].tamagotchi, lng[lang].tamagotchi]]);
        } else if (variant.indexOf('t_ring') > -1) {
            let data = JSON.parse(variant.split('|')[1]);
            let row_data = variant.split('|')[2];
            const rowSize = 3; // количество кнопок в каждом ряду
            const numOfRows = Math.ceil(data.length / rowSize); // количество рядов
            for (let i = 0; i < numOfRows; i++) {
              let row = [];
              for (let j = 0; j < rowSize; j++) {
                let index = i * rowSize + j;
                if (index >= data.length) {
                  break;
                }
                row.push([data[index][0], data[index][1]]);
              }
              buttons.push(row);
            }
            if (typeof row_data !== 'undefined') {
                let rowData = JSON.parse(row_data);
buttons.push(rowData);
            }
                        buttons.push([[lng[lang].inventory, lng[lang].inventory], [lng[lang].t_workout, lng[lang].t_workout], [lng[lang].tamagotchi, lng[lang].tamagotchi]]);
                } else if (variant.indexOf('t_shop') > -1) {
            let data = lng[lang].t_shop_elements;
            const rowSize = 3; // количество кнопок в каждом ряду
            const numOfRows = Math.ceil(data.length / rowSize); // количество рядов
            for (let i = 0; i < numOfRows; i++) {
              let row = [];
              for (let j = 0; j < rowSize; j++) {
                let index = i * rowSize + j;
                if (index >= data.length) {
                  break;
                }
                row.push([`t_buy ${data[index]}`, data[index]]);
              }
              buttons.push(row);
            }
                buttons.push([[lng[lang].inventory, lng[lang].inventory], [lng[lang].t_shop, lng[lang].t_shop], [lng[lang].tamagotchi, lng[lang].tamagotchi]]);
            } else if (variant.indexOf('t_custom|') > -1) {
                let data = JSON.parse(variant.split('|')[1]);
                const rowSize = 3; // количество кнопок в каждом ряду
                const numOfRows = Math.ceil(data.length / rowSize); // количество рядов
                for (let i = 0; i < numOfRows; i++) {
                  let row = [];
                  for (let j = 0; j < rowSize; j++) {
                    let index = i * rowSize + j;
                    if (index >= data.length) {
                      break;
                    }
                    row.push([`${data[index]}`, data[index]]);
                  }
                  buttons.push(row);
                }
                    buttons.push([[lng[lang].inventory, lng[lang].inventory], [lng[lang].t_shop, lng[lang].t_shop], [lng[lang].tamagotchi, lng[lang].tamagotchi]]);
            } else if (variant.indexOf('to_game|') > -1) {
        let game = variant.split('|')[1];
        buttons = [[[game, lng[lang].to_game], ["/start", lng[lang].home]]];
    }     else if (variant === 'conferm') {
        buttons = [[lng[lang].yes, lng[lang].no], [lng[lang].games, lng[lang].home]];
    }     else if (variant === 'home_button') {
        buttons = [[lng[lang].home]];
    }
    return buttons;
}

async function createRefererScores(scores, referers) {
if (referers.length > 0) {
for (let n in referers) {
let ref_id = referers[n];
let ref_share = 0.08;
if (n === "1") ref_share = 0.02;
let referer = await udb.getUserByRefererCode(ref_id);
if (referer) {
    let new_scores = scores * ref_share;
    new_scores = safeAddScore(new_scores, referer.id);
    await udb.updateUserStatus(referer.id, referer.names, referer.prev_status, referer.status, referer.send_time, referer.diversity, new_scores, 0, 0);
}
}
}
}

// Команды
async function main(id, names, message, status, isReturn = false, silent = false) {
    const block_n = await bdb.getBlock();
    let bn = block_n.last_block;

    let send_time = new Date().getTime();
        let user = await udb.getUser(id);
    let level = 0;
    if (!user) {
let tamagotchi = {};
        let not_refs = -127525490;
        let not_refs_users = await udb.getUsersByPrize('🐅');
        if (not_refs_users && not_refs_users.length > 0) {
            let counter = not_refs_users.length -1;
            let random_ref = await helpers.getRandomInRange(0, counter);
            let referer = not_refs_users[random_ref]
            not_refs = referer.referer_code;
            let text = lng[referer.lng].new_referal1 + `https://t.me/viz_mg_bot?start=r${referer.referer_code}`;
            let btns = await keybord(referer.lng, 'no');
            await botjs.sendMSG(referer.id, text, btns, false);
        }
        let id_hash = await helpers.stringToHash(id);
        if (typeof message !== 'undefined' && message !== '' && message.indexOf('r') > -1 && message.indexOf('subscr') === -1) {
            let ref_id = parseInt(message.split(' r')[1]);
            let referer = await udb.getUserByRefererCode(ref_id);
        if (referer) {
            let text = lng[referer.lng].new_referal1 + `https://t.me/viz_mg_bot?start=r${ref_id}`;
            let btns = await keybord(referer.lng, 'no');
            await botjs.sendMSG(referer.id, text, btns, false);
            let refs = [ref_id];
            if (referer.referers.length > 0) {
    let referer2 = await udb.getUserByRefererCode(referer.referers[0]);
    if (referer2) {
        let text2 = lng[referer.lng].new_referal2 + `https://t.me/viz_mg_bot?start=r${referer.referers[0]}`;
        let btns2 = await keybord(referer2.lng, 'no');
    await botjs.sendMSG(referer2.id, text2, btns2, false);
    refs.push(referer.referers[0])
} // end yes referer2.
} // end if referer length > 0.
await udb.addUser(id, names, '', '', 'start', send_time, 0, refs, id_hash, [], '', '', tamagotchi);
} // end yes referer.
     else {
        await udb.addUser(id, names, '', '', 'start', send_time, 0, [not_refs], id_hash, [], '', '', tamagotchi);
     } // end no referer.
} else { // end if no referer code in command.
        await udb.addUser(id, names, '', '', 'start', send_time, 0, [not_refs], id_hash, [], '', '', tamagotchi);
    } // end if no referer in command.
    user = await udb.getUser(id);
    } // end if not user.
    else { // yes user.
                // ⛔ антибот-фильтр (до любых игр)
                    detectAutoClicker(id);
if (!silent && !checkRateLimit(id)) {
    // мягкий ответ, не всегда
    if (Math.random() < 0.3) {
        await botjs.sendMSG(
            id,
            lng[user.lng]?.too_fast || '⏳ Слишком быстро, подожди немного',
            [],
            true
        );
    }
    return;
}

        let last_time = send_time - user.send_time;
        if (user.send_time && typeof user.send_time !== 'undefined' && last_time < 1000 && message !== lng[user.lng].home && message !== lng[user.lng].check_subscribes && message !== '/start') return;
        if (typeof message !== 'undefined' && user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].back) > -1 || typeof message !== 'undefined' && user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].cancel) > -1) message = user.prev_status;
        
        level = parseInt(new Big(user.scores).plus(new Big(user.locked_scores)).div(100))
        if (level < 0) level = 0;
        if (user.status === message) {
            await udb.updateUserStatus(id, names, user.prev_status, message, send_time);
            } else {
                await udb.updateUserStatus(id, names, user.status, message, send_time);
            }
    } // end yes user.

    let now = new Date();
    let noon = new Date();
    noon.setHours(12, 0, 0, 0);
    let remained = noon - now;
    if (remained >= 0 && remained < 60000 && (message === lng[user.lng].fortune_telling || message === lng[user.lng].random_numbers || message === lng[user.lng].crypto_bids)) {
        let text = lng[user.lng].wait_award;
        let btns = await keybord(user.lng, 'no');
        await botjs.sendMSG(id, text, btns, false);
    return;
    }

// бусты:
let boost = 1;
if (names.indexOf('$VIZ') > -1) boost += 0.1;
if (names.indexOf('@viz_mg_bot') > -1) boost += 0.2;
if (typeof user !== 'undefined' && user.viz_login  && typeof user.viz_login !== 'undefined' && user.viz_login !== '') boost += 0.1;
boost += user.diversity.length * 0.02;
boost = parseFloat(boost.toFixed(2));
    
if (message && message.indexOf('start') > -1 || user && user.lng && message.indexOf(lng[user.lng].home) > -1) {
        let text = '';
let btns;
if (user && user.lng && user.lng !== '') {
    await main(id, names, lng[user.lng].check_subscribes, status, false, true);
} else {
    text = `Select language: Выберите язык.`;
    btns = await keybord('', 'lng');
    await botjs.sendMSG(id, text, btns, false);
}
} else if (user && user.lng && message.indexOf(lng[user.lng].check_subscribes) > -1) {
    let checking = await botjs.checkSubscribes(id);
    if (checking && checking === true && isReturn === false) {
        let referer;
        if (user.referers && user.referers.length > 0) {
                referer = user.referers[0];
        } else {
            if (user.lng === 'Русский') {
                referer = 'Не найден';
                    } else {
                        referer = 'not found';
                    }
        }
        let text = lng[user.lng].home_message(user.names, referer, user.referer_code, user.scores, level, user.locked_scores, user.viz_scores, boost);
        text += `

${lng[user.lng].viz_scores_adding(conf.mg_bot.award_account, `scores:${id}`)}`;        
        let btns = await keybord(user.lng, 'home');
                await botjs.sendMSG(id, 'Loading...', btns, false);        
                await new Promise(r => setTimeout(r, 1000));
                let btns2 = await keybord(user.lng, 'games_inline')
                await botjs.sendMSG(id, text, btns2, true);        
            } else if (checking && checking === true && isReturn === true) {
        return;
    } else {
        let text = lng[user.lng].checking_subscribes;
        let btns = await keybord(user.lng, 'not_subscribe');
        await botjs.sendMSG(id, text, btns, false);
return 'not_subscribe';
    }
} else if (user && user.lng && message.indexOf(lng[user.lng].lang) > -1) {
let text = `Select language: Выберите язык.`;
btns = await keybord('', 'lng');
await botjs.sendMSG(id, text, btns, false);
} else if (user && user.lng && message.indexOf(lng[user.lng].boosts    ) > -1) {
    let text = lng[user.lng].boosts_text;
    let btns = await keybord(user.lng, 'no');
await botjs.sendMSG(id, text, btns, false);
} else if (user && user.lng && message.indexOf(lng[user.lng].games) > -1) {
        let text = lng[user.lng].games_text;
                let btns = await keybord(user.lng, 'games');
        await botjs.sendMSG(id, text, btns, false);
        await udb.updateUserStatus(id, names, user.status, lng[user.lng].home, send_time);
    } else if (user && user.lng && message.indexOf(lng[user.lng].reytings) > -1) {
        let text = lng[user.lng].reytings_text;
                let btns = await keybord(user.lng, 'reytings');
        await botjs.sendMSG(id, text, btns, false);
        await udb.updateUserStatus(id, names, user.status, lng[user.lng].home, send_time);
    } else if (user && user.lng && message.indexOf(lng[user.lng].scores_top) > -1) {
        let top = await udb.getTop();
        let all_scores = top.reduce(function(p, c) {
        if (c.scores > 0) {
            return p + c.scores
        } else {
            return p;
        }
    }, 0);

                let top_list = '';
        for (let el of top) {
if (el.scores > 0) {
    let share = new Big(el.scores).div(all_scores);
    let percent = energy.times(share);
    percent = parseInt(percent.times(100));
    percent = parseFloat(new Big(percent).div(100));
    
let identity = `<a href="tg://user?id=${el.id}">${el.id}</a>`;
    if (el.names !== '') identity = `<a href="tg://user?id=${el.id}">${helpers.addslashes(el.names)}</a>`;
    top_list += `
    ${identity}: ${el.scores.toFixed(3)} (${percent.toFixed(2)}% ${lng[user.lng].of_energy})`;
}
        }
        let text = lng[user.lng].scores_top_text(top_list);
        let btns = await keybord(user.lng, 'no');
        await botjs.sendMSG(id, text, btns, false);
        await udb.updateUserStatus(id, names, user.status, lng[user.lng].reytings, send_time);
        } else if (user && user.lng && message.indexOf(lng[user.lng].t_age_top) > -1) {
        let top = await udb.getTop("tamagotchi.age");
                let top_list = '';
        for (let el of top) {
if (typeof el.tamagotchi !== 'undefined' && el.tamagotchi.age > 0) {
let identity = `<a href="tg://user?id=${el.id}">${el.id}</a>`;
    if (el.names !== '') identity = `<a href="tg://user?id=${el.id}">${helpers.addslashes(el.names)}</a>`;
    top_list += `
${lng[user.lng].tamagotchi} ${el.tamagotchi.name} ${lng[user.lng].from} ${identity}: ${lng[user.lng].tamagotchi_params.age} ${el.tamagotchi.age}, ${lng[user.lng].tamagotchi_params.xp} ${el.tamagotchi.xp}, ${lng[user.lng].tamagotchi_params.power} ${el.tamagotchi.power}`;
}
        }
        let text = lng[user.lng].t_age_top_text(top_list);
        let btns = await keybord(user.lng, 'no');
        await botjs.sendMSG(id, text, btns, false);
        await udb.updateUserStatus(id, names, user.status, lng[user.lng].reytings, send_time);
    } else if (user && user.lng && message.indexOf(lng[user.lng].t_power_top) > -1) {
        let top = await udb.getTop("tamagotchi.power");
                let top_list = '';
        for (let el of top) {
    if (typeof el.tamagotchi !== 'undefined' && el.tamagotchi.power > 0) {
    let identity = `<a href="tg://user?id=${el.id}">${el.id}</a>`;
    if (el.names !== '') identity = `<a href="tg://user?id=${el.id}">${helpers.addslashes(el.names)}</a>`;
    top_list += `
${lng[user.lng].tamagotchi} ${el.tamagotchi.name} ${lng[user.lng].from} ${identity}: ${lng[user.lng].tamagotchi_params.power} ${el.tamagotchi.power}, ${lng[user.lng].tamagotchi_params.xp} ${el.tamagotchi.xp}, ${lng[user.lng].tamagotchi_params.age} ${el.tamagotchi.age}`;
    }
        }
        let text = lng[user.lng].t_power_top_text(top_list);
        let btns = await keybord(user.lng, 'no');
        await botjs.sendMSG(id, text, btns, false);
        await udb.updateUserStatus(id, names, user.status, lng[user.lng].reytings, send_time);
    } else if (user && user.lng && message.indexOf(lng[user.lng].t_xp_top) > -1) {
        let top = await udb.getTop("tamagotchi.xp");
                let top_list = '';
        for (let el of top) {
    if (typeof el.tamagotchi !== 'undefined' && el.tamagotchi.xp > 0) {
    let identity = `<a href="tg://user?id=${el.id}">${el.id}</a>`;
    if (el.names !== '') identity = `<a href="tg://user?id=${el.id}">${helpers.addslashes(el.names)}</a>`;
    top_list += `
${lng[user.lng].tamagotchi} ${el.tamagotchi.name} ${lng[user.lng].from} ${identity}: ${lng[user.lng].tamagotchi_params.xp} ${el.tamagotchi.xp}, ${lng[user.lng].tamagotchi_params.power} ${el.tamagotchi.power}, ${lng[user.lng].tamagotchi_params.age} ${el.tamagotchi.age}`;
    }
        }
        let text = lng[user.lng].t_xp_top_text(top_list);
        let btns = await keybord(user.lng, 'no');
        await botjs.sendMSG(id, text, btns, false);
        await udb.updateUserStatus(id, names, user.status, lng[user.lng].reytings, send_time);
    } else if (user && user.lng && message.indexOf(lng[user.lng].artifacts_owners) > -1) {
        let top = await udb.findAllUsers();
        let top_list = '';
        for (let el of top) {
if (el.artifacts.length > 0) {
let arts_list = el.artifacts.join(',');
    let identity = el.id;
    if (el.names !== '') identity = `${el.names} (${el.id})`;
    let prize = '';
    if (el.prize !== '') prize = ` (${el.prize})`;
    top_list += `
    ${identity}: ${arts_list}${prize}`;
}
        }
        let text = `${lng[user.lng].artifacts_owners_text}:
${top_list}`;
        let btns = await keybord(user.lng, 'no');
        await botjs.sendMSG(id, text, btns, false);
        await udb.updateUserStatus(id, names, user.status, lng[user.lng].reytings, send_time);
    } else if (user && user.lng && message.indexOf(lng[user.lng].fortune_telling) > -1) {
        let ftq_data = await ftqdb.getHashById(id);
        let ft_works = 100 - user.ft_counter;
        let text = lng[user.lng].ft_text + ft_works;
                let btns = await keybord(user.lng, 'cancel');
                if (ftq_data && Object.keys(ftq_data).length > 0) {
    text = lng[user.lng].ft_no_work;
    btns = await keybord(user.lng, 'ft_award_buttons');
    await udb.updateUserStatus(id, names, user.prev_status, lng[user.lng].home, send_time);
} else if (user.ft_counter > 100) {
    text = lng[user.lng].ft_tomorrow;
    btns = await keybord(user.lng, 'games');
    await udb.updateUserStatus(id, names, user.prev_status, lng[user.lng].home, send_time);
} else {
    await udb.plusFTCounter(id);
}
        await botjs.sendMSG(id, text, btns, false);        
    } else if (user && user.lng && message.indexOf(lng[user.lng].ft_award) > -1) {
let q = user.status.split('|')[1];
var hash = crypto.createHash('md5').update(q).digest('hex');
        let text = lng[user.lng].ft_award_text(conf.mg_bot.award_account, `ft:${id}`);
        let btns = await keybord(user.lng, 'ft_award_buttons');
        await botjs.sendMSG(id, text, btns, false);        
await ftqdb.updateHashData(hash, q, id);
} else if (user && user.lng && message.indexOf(lng[user.lng].ft_cancel) > -1) {
    await ftqdb.removeHashData(parseInt(id));
    let text = lng[user.lng].ft_cancel_text;
            let btns = await keybord(user.lng, 'games_buttons');
            await botjs.sendMSG(id, text, btns, false);        
} else if (user && user.lng && message.indexOf(lng[user.lng].ft_standart) > -1 && user.status.indexOf('ft_send') > -1) {
    let q = user.status.split('|')[1];
    var hash = crypto.createHash('md5').update(q).digest('hex');
    let number = await methods.randomWithHash(hash, bn, 2);

    let variant = lng[user.lng][number];
    let random_variant = await helpers.getRandomInRange(1, variant.length);
    
    let ft_result = variant[random_variant - 1];
    let max_score = 5;
    let score = number * 5;
    score = Math.min(Math.max(0, Math.floor(score * Math.pow(0.95, level) * 100) / 100), max_score);
if (score < 0) score = 0;
score *= boost;
    score = safeAddScore(score, id);
let text = `${q}
${ft_result}
${lng[user.lng].more}:
${lng[user.lng].block_hash} ${bn},
${lng[user.lng].text_hash}: ${hash},
${lng[user.lng].number_types},
${lng[user.lng].generated_number}: ${number}.
${lng[user.lng].scores}: ${score}.

${lng[user.lng].award_ft_author}`;
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(id, text, btns, false);
if (user.diversity.indexOf('fortune_telling') === -1) user.diversity.push('fortune_telling')
await udb.updateUserStatus(id, names, user.status, lng[user.lng].home, send_time, user.diversity, score);
await createRefererScores(score, user.referers);
} else if (user && user.lng && message.indexOf(lng[user.lng].random_numbers) > -1) {
    let text = lng[user.lng].rn_text;
            let btns = await keybord(user.lng, 'games_buttons');
    await botjs.sendMSG(id, text, btns, false);        
} else if (user && user.lng && message.indexOf(lng[user.lng].crypto_bids) > -1 || user && user.lng && message === '.bids' || user && user.lng && message === '.стк') {
    if (message === '.bids') message = lng[user.lng].crypto_bids;
    if (message === '.стк') message = lng[user.lng].crypto_bids;
    let bids = await cbdb.findCryptoBids();
    console.error(bids);
    let btc_price = await cbdb.getBTCPrice();
  // Проверяем наличие пользователя в списке ставок
  let userBidExists = bids.some((bid) => bid.id === id);

    let text = lng[user.lng].yes_crypto_bid;
    let btns = await keybord(user.lng, 'games');
    let active_scores = await sumNumbers(user.scores, user.viz_scores);
    if (btc_price && typeof btc_price !== 'undefined' && btc_price.price > 0 && userBidExists === false && active_scores > 0) {
  // Инициализируем переменные для хранения сумм и коэффициентов
  let totalBids = { ">": 0, "<": 0 };
  let totalProfitCoefficients = { ">": 0, "<": 0 };

  // Считаем суммы ставок и вычисляем коэффициенты прибыльности для каждого направления
  bids.reduce((total, bid) => {
    if (bid.id === id) {
      return total;
    }

    total[bid.direction] += bid.scores;
    let profitCoefficient = (bid.direction === ">")
      ? bid.scores / bid.btc_price
      : bid.btc_price / bid.scores;
    totalProfitCoefficients[bid.direction] += profitCoefficient;

    return total;
  }, totalBids);

        let now_datetime = new Date(btc_price.timestamp).toLocaleString("ru-RU", {timeZone: "Europe/Moscow"});
        let [date, time] = now_datetime.split(', ');
        let [month, day, year] = date.split('/');
        let datetime = `${day}.${month}.${year} ${time.split(' AM')[0]} GMT+3`;
        text = lng[user.lng].crypto_bids_text(active_scores, btc_price.price, datetime, totalProfitCoefficients);
                btns = await keybord(user.lng, 'cancel');
                await udb.updateUserStatus(id, names, user.prev_status, lng[user.lng].crypto_bids + '|' + btc_price.price, send_time, user.diversity, 0);
            } else {
        await udb.updateUserStatus(id, names, user.prev_status, lng[user.lng].home, send_time, user.diversity, 0);
    }
    await botjs.sendMSG(id, text, btns, false);        
} else if (user && user.lng && message.indexOf(lng[user.lng].bk_game) > -1) {
    let text = lng[user.lng].bk_text;
    let btns = await keybord(user.lng, 'bk_game');
                await botjs.sendMSG(id, text, btns, false);
            } else if (user && user.lng && user.status && user.status.indexOf(lng[user.lng].bk_game) > -1) {
                if (message.indexOf(lng[user.lng].bk_level) === -1) {
                    let text = lng[user.lng].bk_no_level;
                    let btns = await keybord(user.lng, 'bk_game');
                                await botjs.sendMSG(id, text, btns, false);
                                await udb.updateUserStatus(user.id, user.names, user.prev_status, user.status, user.send_time, user.diversity, 0, 0, 0, user.tamagotchi);
                                return;
                }
                let bk_level = parseInt(message.split(' ')[1]);
let game = await bkdb.getGameSession(id, bk_level);
let staps = '';
if (!game || game && Object.keys(game).length === 0) {
    let number = await helpers.randomNumberWithoutRepeats(bk_level + 2);
await bkdb.addGameSession(id, bk_level, number)
    } else {
        staps = game.text;
    }
    let text = lng[user.lng].bk_game_text(bk_level, staps);
                let btns = await keybord(user.lng, 'games_buttons');
                            await botjs.sendMSG(id, text, btns, false);
                        } else if (user && user.lng && message.indexOf(lng[user.lng].tamagotchi) > -1) {
                            let action = message.split('|')[1];
                            if (user.tamagotchi && Object.keys(user.tamagotchi).length > 0 && typeof action === 'undefined') user.tamagotchi = await tmc.updateTamagotchi(user.tamagotchi);
                            let action_text = '';
                            let action_changes = {};
                            let action_scores = 0;
                            
                            if (typeof action !== 'undefined' && Object.keys(user.tamagotchi).length > 0) {
                                let res = tmc.performAction(action, user.tamagotchi, level);
                                if (res !== false &&  Object.keys(res).length === 0) {
                                                                action_text = `${lng[user.lng].tamagotchi_not_wants} ${lng[user.lng].tm_with_actions[action]}.
`;
                                                            } else if (res !== false &&  Object.keys(res).length > 0) {
action_scores = res.plus_score;
await createRefererScores(action_scores, user.referers);
user.tamagotchi = res.params;
                                                                action_changes = res.changes;
                                                                action_text = `${lng[user.lng].tamagotchi_ok} ${lng[user.lng].tm_ok_actions[action]}
`;
user.tamagotchi.power = parseFloat((user.tamagotchi.power).toFixed(2));
if (user.tamagotchi.sleap_time > 0) {
    action_text += `${lng[user.lng].tamagotchi_sleeping(user.tamagotchi)}
`;
}
} else if (res === false) {
                                                                action_text = lng[user.lng].tamagotchi_died;
                                                                user.tamagotchi = {};
                                                            }
                                                                                    }

                let text = `${action_text}${lng[user.lng].tamagotchi_stats(user.tamagotchi, action_changes)}`;
                if (user.tamagotchi.sleap_time > 0 && typeof game === 'undefined') {
                                                                                        text = `${lng[user.lng].tamagotchi_sleeping(user.tamagotchi)}
`;
                                                                                    }
                                                                                    if (action_scores > 0) text += `

${lng[user.lng].scores}: +${action_scores}`;
let btns = await keybord(user.lng, 'cancel');
if (user.tamagotchi && Object.keys(user.tamagotchi).length > 0) {
    let actions = tmc.getActions(user.tamagotchi);
    btns = await keybord(user.lng, 'tamagotchi|' + JSON.stringify(actions));
    if (!user.tamagotchi.message_id && user.message_id > user.tamagotchi.message_id || user.status.indexOf(lng[user.lng].tamagotchi) === -1) {
        let sended = await botjs.sendMSG(id, text, btns, true, false);
        if (typeof sended.message_id !== 'undefined' && Object.keys(user.tamagotchi).length > 0) user.tamagotchi.message_id = sended.message_id;
    } else {
        let edited = await botjs.editMessage(id, user.tamagotchi.message_id, text, btns, true, false);
        if (edited == false) {
            let sended = await botjs.sendMSG(id, text, btns, true, false);
            if (typeof sended.message_id !== 'undefined' && Object.keys(user.tamagotchi).length > 0) user.tamagotchi.message_id = sended.message_id;
        }
    }
} else if (Object.keys(user.tamagotchi).length === 0) {
    if (!user.tamagotchi.message_id) {
        let sended = await botjs.sendMSG(id, text, btns, false, false);
        if (typeof sended.message_id !== 'undefined' && Object.keys(user.tamagotchi).length > 0) user.tamagotchi.message_id = sended.message_id;
    } else {
        await botjs.editMessage(id, user.tamagotchi.message_id,  text, btns, false, false);
    }
}
                                                                                action_scores *= boost;
                                                                                    action_scores = safeAddScore(action_scores, user.id);
                                                                                if (user.diversity.indexOf('tamagotchi') === -1) user.diversity.push('tamagotchi')
await udb.updateUserStatus(user.id, user.names, user.status, message, user.send_time, user.diversity, action_scores, 0, 0, user.tamagotchi);
                                                                            } else if (user && user.lng && message.indexOf(lng[user.lng].inventory) > -1) {                                                                                                    
                                                                                let text = lng[user.lng].no_tamagotchi;
                                                                                let actions = [];
                                                                                if (user.tamagotchi && Object.keys(user.tamagotchi).length > 0) {
                                                                                    text = lng[user.lng].not_inventory;
                                                                                    if (user.tamagotchi.inventory && user.tamagotchi.inventory.length > 0) {
for (let el of user.tamagotchi.inventory) {
    actions.push(el)
}
text = lng[user.lng].inventory_select;
}
                                                                                }
                                                                                                                                                                let btns = await keybord(user.lng, 't_custom|' + JSON.stringify(actions));
                                                                                await botjs.sendMSG(id, text, btns, true, false);
                                                                            } else if (user && user.lng && lng[user.lng].t_shop_elements.indexOf(message) > -1) {
                                                                                if (user.tamagotchi.sleap_time > 0) {
                                                                                    let text = `${lng[user.lng].tamagotchi_sleeping(user.tamagotchi)}
`;
let btns = await keybord(user.lng, 'no');
await botjs.sendMSG(id, text, btns, true, false);                                                                                
return;
}
                                                                                
                                                                                let text = lng[user.lng].no_tamagotchi;
                                                                                let actions = [];
                                                                                if (user.tamagotchi && Object.keys(user.tamagotchi).length > 0) {
text = lng[user.lng].not_in_inv;
if (user.tamagotchi.inventory && user.tamagotchi.inventory.length > 0 && user.tamagotchi.inventory.indexOf(message) > -1) {
    let res = user.tamagotchi.inventory.indexOf(message);
    let number = parseInt(message.split('_')[1]);
    if (message.indexOf('Energetic') > -1) {
        user.tamagotchi.energy = await sumNumbers(user.tamagotchi.energy, number);
        if (user.tamagotchi.energy > 100) user.tamagotchi.energy = 100;
    }
if (message.indexOf('elixir') > -1) {
    user.tamagotchi.health = await sumNumbers(user.tamagotchi.health, number);
    if (user.tamagotchi.health > 100) user.tamagotchi.health = 100;
}
user.tamagotchi.inventory.splice(res, 1);
text = `${message} ${lng[user.lng].product_applied}`;
await udb.updateUserStatus(user.id, user.names, user.status, message, user.send_time, user.diversity, 0, 0, 0, user.tamagotchi);
for (let el of user.tamagotchi.inventory) {
    actions.push(el)
}
}
                                                                                }
                                                                                let btns = await keybord(user.lng, 't_custom|' + JSON.stringify(actions));
                                                                                await botjs.sendMSG(id, text, btns, true, false);
                                                                            } else if (user && user.lng && message.indexOf(lng[user.lng].t_shop) > -1) {                        
let text = lng[user.lng].t_shop_text;
let btns = await keybord(user.lng, 't_shop');
await botjs.sendMSG(id, text, btns, true, false);
} else if (user && user.lng && message.indexOf('t_buy ') > -1) {                        
    let text = lng[user.lng].no_tamagotchi;
    let product = message.split(' ')[1];
let product_number = lng[user.lng].t_shop_elements.indexOf(product);
if (product_number === -1) text = lng[user.lng].product_not_found;
    if (user.tamagotchi && Object.keys(user.tamagotchi).length > 0 && product_number > -1) {
        let scores = lng[user.lng].t_shop_prices[product_number];
        let active_scores = await sumNumbers(user.scores, user.viz_scores);
        if (active_scores < scores) {
            text = lng[user.lng].buy_no_scores;
        } else {
            let [user_scores, viz_scores] = [user.scores, user.viz_scores];
            let gamer_scores = 0;
            let blockchain_scores = 0;
      let minus_scores = await minusNumbers(viz_scores, scores);
      if (minus_scores < 0) {
        blockchain_scores = viz_scores;
          gamer_scores = await minusNumbers(scores, viz_scores)
      } else {
        blockchain_scores = scores;
      }
      user.tamagotchi.inventory.push(product);
      await udb.updateUserStatus(id, names, user.status, lng[user.lng].games, send_time, user.diversity, -Math.abs(gamer_scores), 0, -Math.abs(blockchain_scores), user.tamagotchi);
              text = `${lng[user.lng].t_shop_buy} ${product}`;
        }
    }
    let btns = await keybord(user.lng, 't_shop');
    await botjs.sendMSG(id, text, btns, true, false);                                                 
} else if (user && user.lng && message.indexOf(lng[user.lng].t_workout) > -1) {                        
    if (!user.tamagotchi || Object.keys(user.tamagotchi).length === 0) return;
    let buttons = [];
    if (user.tamagotchi.sleap_time > 0) {
        let text = lng[user.lng].t_ring_sleep;
        buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
await botjs.sendMSG(id, text, btns, true, false);
return;
    }
    if (user.tamagotchi.health <= 10) {
        text = lng[user.lng].t_ring_small_health;
        buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
await botjs.sendMSG(id, text, btns, true, false);
return;
    }

    let scores = 100;
    let active_scores = await sumNumbers(user.scores, user.viz_scores);
    if (active_scores < scores) {
        let text = lng[user.lng].t_ring_no_scores;
        buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
        let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
await botjs.sendMSG(id, text, btns, true, false);
return;
        }
        let [user_scores, viz_scores] = [user.scores, user.viz_scores];
        let gamer_scores = 0;
        let blockchain_scores = 0;
  let minus_scores = await minusNumbers(viz_scores, scores);
  if (minus_scores < 0) {
    blockchain_scores = viz_scores;
      gamer_scores = await minusNumbers(scores, viz_scores)
  } else {
    blockchain_scores = scores;
  }
  let t1 = { ...user.tamagotchi };
  let t2 = { ...user.tamagotchi };
    let text = lng[user.lng].t_workout_text;
    for(let i = 0; i < 5; i++) {
        let hit = await tmc.performAttack(t1, t2);
        if (hit.status >= 1) {
            t2 = hit.target;
            let hit_type = lng[user.lng].t_ring_hit_ok;
    if (hit.status === 2) {
        hit_type = lng[user.lng].t_ring_critical_strike;
    }
            text += `
${hit_type} ${hit.damage}
    ${lng[user.lng].your_health}: ${t1.health},
    ${lng[user.lng].opponent_health}: ${t2.health}`;
} // end if it.status >= 1.
else if (hit.status === 0) {
    text += `
${lng[user.lng].t_ring_failure}`;
}
let hit2 = await tmc.performAttack(t2, t1);
if (hit2.status >= 1) {
    t1 = hit2.target;
    let hit_type = lng[user.lng].t_ring_opponent_yes_hit;
    if (hit2.status === 2) {
        hit_type = lng[user.lng].t_ring_opponent_crytical_hit;
    }
            text += `
${hit_type} ${hit2.damage}
    ${lng[user.lng].your_health}: ${t1.health},
    ${lng[user.lng].opponent_health}: ${t2.health}
    ${lng[user.lng].t_workout_experience}: +${hit2.status / 4}`;
    user.tamagotchi.xp += hit2.status / 4;
} // end if it.status == true.
else if (hit2.status === 0) {
    text += `
${lng[user.lng].t_ring_opponent_no_hit}
${lng[user.lng].t_workout_experience}: +1`;
user.tamagotchi.xp += 1;
}
    } // end for.
let power = 0.2;
if (t1.health >= t2.health) {
    power = 1;
}
    user.tamagotchi.power += power;
text += `
${lng[user.lng].tamagotchi_params.power}: ${power}`;
    await udb.updateUserStatus(id, names, user.prev_status, user.status, send_time, user.diversity, -Math.abs(gamer_scores), 0, -Math.abs(blockchain_scores), user.tamagotchi);
    let btns = await keybord(user.lng, 'tamagotchi|' + JSON.stringify([]));
    await botjs.sendMSG(id, text, btns, true, false);    
} else if (user && user.lng && message.indexOf(lng[user.lng].t_ring) > -1) {                        
    let param = message.split(' ')[1];
    let page = 1;
    if (param && !isNaN(param)) page = parseInt(param);
    let text = lng[user.lng].t_ring_text;
    let rings = await rtdb.findAllRings(page);
    let actions = [];
    for (let ring of rings) {
        if (typeof ring.u2 !== 'undefined' && ring.u1.id !== user.id) continue;
if (!ring.power && ring.power != 0) continue;
        actions.push([`t_ring join:${ring.timestamp}`, `${ring.power.toFixed()} ${ring.blows}  ${ring.u1.tamagotchi.health.toFixed()} ${ring.u1.tamagotchi.xp.toFixed()} ${ring.scores.toFixed()}`]);
    }
    if (page >= 1 && rings.length === 9) {
actions.push([lng[user.lng].t_ring + ` ${page+1}`, '⏩'])
    }
    if (page > 1) {
        actions.push([lng[user.lng].t_ring + ` ${page-1}`, '⏪'])
            }
            actions.push([lng[user.lng].t_ring_forgotten, lng[user.lng].t_ring_forgotten]);
            let row_data = [[`t_ring create:3`, `${lng[user.lng].create_ring}, 3 ${lng[user.lng].blow}`], [`t_ring create:5`, `${lng[user.lng].create_ring}, 5 ${lng[user.lng].blows}`], [`t_ring create:10`, `${lng[user.lng].create_ring}, 10 ${lng[user.lng].blows}`]];
            let btns = await keybord(user.lng, `t_ring|${JSON.stringify(actions)}|${JSON.stringify(row_data)}`);
    await botjs.sendMSG(id, text, btns, true, false);
} else if (user && user.lng && message.indexOf(lng[user.lng].t_ring_forgotten) > -1) {                        
    let param = message.split(' ')[1];
    let page = 1;
    if (param && !isNaN(param)) page = parseInt(param);
    let text = lng[user.lng].t_ring_forgotten_text;
    let rings = await rtdb.findAllRings(page, {$or: [{"u1.id": user.id, queue: 'u1'}, {"u2.id": user.id, queue: 'u2'}]});
    let actions = [];
    for (let ring of rings) {
        if (typeof ring.u2 !== 'undefined' && ring.u1.id !== user.id) continue;
        actions.push([`t_ring_hit ${ring.timestamp}`, `${ring.power.toFixed()} ${ring.blows} ${ring.u1.tamagotchi.xp.toFixed()} ${ring.scores.toFixed()}`]);
    }
    if (page >= 1 && rings.length === 9) {
actions.push([lng[user.lng].t_ring + ` ${page+1}`, '⏩'])
    }
    if (page > 1) {
        actions.push([lng[user.lng].t_ring + ` ${page-1}`, '⏪'])
            }
            actions.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
            let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(actions));
    await botjs.sendMSG(id, text, btns, true, false);
} else if (user && user.lng && message.indexOf('t_ring ') > -1) {                        
    let [command, action] = message.split(' ');
    let [type, n] = action.split(':');
    if (!isNaN(n) && type == 'create') {
        let active_scores = await sumNumbers(user.scores, user.viz_scores);
        let text = `${lng[user.lng].t_ring_scores}. ${lng[user.lng].all_scores}: ${active_scores}.`;
        if (user.tamagotchi.sleap_time > 0) {
            text = lng[user.lng].t_ring_sleep;
            let buttons = [];
            buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
    let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
    await botjs.sendMSG(id, text, btns, true, false);
    return;
        }
        let btns = await keybord(user.lng, 'inline_cancel');
        await botjs.sendMSG(id, text, btns, true, false);
            } else if (!isNaN(n) && type == 'join') {
                let timestamp = parseInt(n);
let ring = await rtdb.getRing(timestamp);
if (!ring || ring && Object.keys(ring).length === 0) return;
let text = lng[user.lng].t_ring_active;
let buttons = [];
if (ring.u1.id === user.id) {
    text = lng[user.lng].t_ring_creator;
    buttons.push([`t_ring_delete ${timestamp}`, lng[user.lng].t_ring_delete])
} else if (typeof ring.u2 === 'undefined' && ring.u1.id !== user.id && (Math.abs(user.tamagotchi.power - ring.power) > 10 && user.tamagotchi.power > ring.power)) {
text = lng[user.lng].t_ring_no_power;
} else if (typeof ring.u2 === 'undefined' && ring.u1.id !== user.id && (Math.abs(user.tamagotchi.power - ring.power) <= 2 || user.tamagotchi.power <= ring.power)) {
    if (user.tamagotchi.sleap_time > 0) {
        text = lng[user.lng].t_ring_sleep;
        buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
await botjs.sendMSG(id, text, btns, true, false);
return;
    }
    if (user.tamagotchi.health <= 10) {
        text = lng[user.lng].t_ring_small_health;
        buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
await botjs.sendMSG(id, text, btns, true, false);
return;
    }

    let scores = ring.scores;
    let active_scores = await sumNumbers(user.scores, user.viz_scores);
    if (active_scores < scores) {
        text = lng[user.lng].t_ring_no_scores;
    } else {
        let [user_scores, viz_scores] = [user.scores, user.viz_scores];
        let gamer_scores = 0;
        let blockchain_scores = 0;
  let minus_scores = await minusNumbers(viz_scores, scores);
  if (minus_scores < 0) {
    blockchain_scores = viz_scores;
      gamer_scores = await minusNumbers(scores, viz_scores)
  } else {
    blockchain_scores = scores;
  }
  let locked_scores = await sumNumbers(Math.abs(gamer_scores), Math.abs(blockchain_scores));
  await udb.updateUserStatus(id, names, user.status, lng[user.lng].tamagotchi, send_time, user.diversity, -Math.abs(gamer_scores), locked_scores, -Math.abs(blockchain_scores));
    let data = {timestamp,u2: {id: user.id, tamagotchi: user.tamagotchi, scores: Math.abs(gamer_scores), viz_scores: Math.abs(blockchain_scores), auto: false}};
    await rtdb.updateRing(data);
    let exclude_params = ["name", "lastAgeUpdate", "sleap_time", "sleepEnergy", "message_id"];
    let t1_text = '';
    let t2_text = '';
    for (let key in ring.u1.tamagotchi) {
        if (exclude_params.indexOf(key) > -1) continue;
     t1_text += `
 ${lng[user.lng].tamagotchi_params[key]}: ${ring.u1.tamagotchi[key]}`;
 }
    for (let key in user.tamagotchi) {
        if (exclude_params.indexOf(key) > -1) continue;
     t2_text += `
 ${lng[user.lng].tamagotchi_params[key]}: ${user.tamagotchi[key]}`;
 }
 
    text = `${lng[user.lng].t_ring_joined}
${lng[user.lng].tamagotchi_params.power}: ${ring.power},
${lng[user.lng].blows}: ${ring.blows}
${lng[user.lng].scores}: ${ring.scores}

${lng[user.lng].t_ring_you}:
${t2_text}
${lng[user.lng].t_ring_opponent}:
${t1_text}`;
buttons.push([`t_ring_hit ${timestamp}`, lng[user.lng].t_ring_hit])
if (data.u2.auto == false) buttons.push([`t_ring_auto ${timestamp}`, lng[user.lng].t_ring_auto_on])
else if (data.u2.auto == true) buttons.push([`t_ring_auto ${timestamp}`, lng[user.lng].t_ring_auto_off])

let text2 = `${lng[user.lng].t_ring_join}
${lng[user.lng].tamagotchi_params.power}: ${ring.power},
${lng[user.lng].blows}: ${ring.blows}
${lng[user.lng].scores}: ${ring.scores}

${lng[user.lng].t_ring_you}:
${t1_text}
${lng[user.lng].t_ring_opponent}:
${t2_text}`;
let buttons2 = [];
buttons2.push([`t_ring_hit ${timestamp}`, lng[user.lng].t_ring_hit])
if (ring.u1.auto == false) buttons2.push([`t_ring_auto ${timestamp}`, lng[user.lng].t_ring_auto_on])
else if (ring.u1.auto == true) buttons2.push([`t_ring_auto ${timestamp}`, lng[user.lng].t_ring_auto_off])
buttons2.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
let user2 = await udb.getUser(ring.u1.id);
if (!user2.lng || user2.lng && user2.lng === '') user2.lng = user.lng;
let btns2 = await keybord(user2.lng, 't_ring|' + JSON.stringify(buttons2));
await botjs.sendMSG(ring.u1.id, text2, btns2, true, false);
}
} // end if ring.u2 undefined.
buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
await botjs.sendMSG(id, text, btns, true, false);
            }
} else if (user && user.lng && user.status.indexOf('t_ring ') > -1 && user.status.indexOf('create:') > -1) {                        
    let [command, action] = user.status.split(' ');
    let [type, n] = action.split(':');
    let scores = parseFloat(message);
    if (isNaN(message)) scores = 1;
    if (!isNaN(n)) {
    let active_scores = await sumNumbers(user.scores, user.viz_scores);
    if (active_scores < scores) {
        text = lng[user.lng].t_ring_no_scores;
    } else {
        if (user.tamagotchi.sleap_time > 0) {
            text = lng[user.lng].t_ring_sleep;
            buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
    let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
    await botjs.sendMSG(id, text, btns, true, false);
    return;
        }
        if (user.tamagotchi.health <= 10) {
            text = lng[user.lng].t_ring_small_health;
            buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
    let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
    await botjs.sendMSG(id, text, btns, true, false);
    return;
        }

        let [user_scores, viz_scores] = [user.scores, user.viz_scores];
        let gamer_scores = 0;
        let blockchain_scores = 0;
  let minus_scores = await minusNumbers(viz_scores, scores);
  if (minus_scores < 0) {
    blockchain_scores = viz_scores;
      gamer_scores = await minusNumbers(scores, viz_scores)
  } else {
    blockchain_scores = scores;
  }
  let locked_scores = await sumNumbers(Math.abs(gamer_scores), Math.abs(blockchain_scores));
  await udb.updateUserStatus(id, names, user.status, lng[user.lng].tamagotchi, send_time, user.diversity, -Math.abs(gamer_scores), locked_scores, -Math.abs(blockchain_scores));
          let blows = parseInt(n);
          let timestamp = new Date().getTime();
          let data = {timestamp, blows, hit: 0, queue: 'u2', power: user.tamagotchi.power, scores, u1: {id: user.id, tamagotchi: user.tamagotchi, scores: Math.abs(gamer_scores), viz_scores: Math.abs(blockchain_scores), auto: false}};
          await rtdb.updateRing(data);
          let text = lng[user.lng].t_ring_created;
          let buttons = [];
          if (data.u1.auto == false) buttons.push([`t_ring_auto ${timestamp}`, lng[user.lng].t_ring_auto_on])
else if (data.u1.auto == true) buttons.push([`t_ring_auto ${timestamp}`, lng[user.lng].t_ring_auto_off])
          buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
          let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
          await botjs.sendMSG(id, text, btns, true, false);
  }  
        } // end if active_scores >= scores.
    } else if (user && user.lng && message.indexOf('t_ring_auto ') > -1) {
        let n = message.split(' ')[1];
        if (!isNaN(n)) {
            let timestamp = parseInt(n);
        let ring = await rtdb.getRing(timestamp);
        if (!ring || ring && Object.keys(ring).length === 0) return;
let gamer = 'u1';
if (typeof  ring.u2 !== 'undefined' && ring.u2.id === id) gamer = 'u2';
        let text = lng[user.lng].t_ring_auto_true;
        let new_ring = {};
        new_ring.timestamp = ring.timestamp;
                if (        ring[gamer].auto == false) {
                    new_ring[`${gamer}.auto`] = true;
        } else {
            new_ring[`${gamer}.auto`]= false;
            text = lng[user.lng].t_ring_auto_false;
        }
        await rtdb.updateRing(new_ring);
        let buttons = [];
        buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
        let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
        await botjs.sendMSG(user.id, text, btns, true, false);
if (ring[gamer].auto == false && ring.queue === gamer) await main(id, names, `t_ring_hit ${timestamp}`, 1, false, true)
    }
    } else if (user && user.lng && message.indexOf('t_ring_delete ') > -1) {
let n = message.split(' ')[1];
if (!isNaN(n)) {
    let timestamp = parseInt(n);
let ring = await rtdb.getRing(timestamp);
if (!ring || ring && Object.keys(ring).length === 0) return;
let users = {};
users['u1'] = await udb.getUser(ring.u1.id);
if (typeof ring.u2 !== 'undefined') users['u2'] = await udb.getUser(ring.u2.id);
        await rtdb.removeRing(timestamp);
        for (let gamer in users) {
            let acc = users[gamer];
                if (!ring[gamer].viz_scores) ring[gamer].viz_scores = 0;
            let scores = ring[gamer].scores;
            let viz_scores = ring[gamer].viz_scores;
            let locked_scores = -await sumNumbers(ring[gamer].scores, ring[gamer].viz_scores);
            if (!locked_scores || typeof locked_scores === 'undefined') locked_scores = -ring.scores;
            acc.tamagotchi.health = ring[gamer].tamagotchi.health;
            await udb.updateUserStatus(acc.id, acc.names, acc.prev_status, acc.status, acc.send_time, acc.diversity, scores, locked_scores, viz_scores, 0, acc.tamagotchi);
            let text = `${lng[acc.lng].t_ring_deleted}:
            ${lng[acc.lng].tamagotchi_params.power}: ${ring.power},
            ${lng[acc.lng].blows}: ${ring.blows}
${lng[acc.lng].scores}: ${ring.scores}.
${lng[acc.lng].t_ring_returned}`;
            let buttons = [];
            buttons.push([lng[acc.lng].t_ring, lng[acc.lng].t_ring])
            let btns = await keybord(acc.lng, 't_ring|' + JSON.stringify(buttons));
            await botjs.sendMSG(acc.id, text, btns, true, false);
            } // end for.
}
} else if (user && user.lng && message.indexOf('t_ring_hit ') > -1) {
    let n = message.split(' ')[1];
    if (!isNaN(n)) {
        let timestamp = parseInt(n);
        let ring = await rtdb.getRing(timestamp);
        if (!ring || typeof ring === 'undefined') return;
let text = lng[user.lng].t_ring_no_hit;
let member = 'u1';
let opponent = 'u2';
if (ring.u2.id === user.id) {
    member = 'u2';
    opponent = 'u1';
}
if (ring.hit === (ring.blows * 2)) {
     let winner = 'u1';
     let not_winner = 'u2';
let users = {};
     if (ring.u2.tamagotchi.health > ring.u1.tamagotchi.health) {
         winner = 'u2';
         not_winner = 'u1';
     } else if (ring.u2.tamagotchi.health === ring.u1.tamagotchi.health) {
let random_winner = Math.round(Math.random());
if (random_winner == 1) {
    winner = 'u2';
    not_winner = 'u1';
}
                    }
     let all_scores = await sumNumbers(ring.scores, ring.scores);
     users['u1'] = await udb.getUser(ring.u1.id);
     users['u2'] = await udb.getUser(ring.u2.id);
     let power_k = parseFloat((ring[not_winner].tamagotchi.power / ring[winner].tamagotchi.power).toFixed(2));
     let texts = {};
     texts[winner] = `${lng[user.lng].t_ring_winner} ${all_scores}, ${lng[user.lng].tamagotchi_params.power} +${power_k}`;
 texts[not_winner] = `${lng[user.lng].t_ring_not_winner}. ${lng[user.lng].tamagotchi_params.power} +0.2`;

     for (let gamer in users) {
let acc = users[gamer];
let txt = texts[gamer];
let scores = 0;
if (gamer === winner) {
    acc.tamagotchi.power = await sumNumbers(parseFloat(acc.tamagotchi.power.toFixed(1)), power_k);
    scores = all_scores;
    await createRefererScores(scores, acc.referers);
} else {
    acc.tamagotchi.power = await sumNumbers(parseFloat(acc.tamagotchi.power.toFixed(1)), 0.2);
}
let locked_scores = -await sumNumbers(ring[gamer].scores, ring[gamer].viz_scores);
if (!locked_scores || typeof locked_scores === 'undefined') locked_scores = ring.scores;
acc.tamagotchi.health = ring[gamer].tamagotchi.health;
await udb.updateUserStatus(acc.id, acc.names, acc.prev_status, acc.status, acc.send_time, acc.diversity, scores, locked_scores, 0, 0, acc.tamagotchi);
let b = [];
b.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
let bs = await keybord(acc.lng, 't_ring|' + JSON.stringify(b));
await botjs.sendMSG(acc.id, txt, bs, true, false);     
}
    await rtdb.removeRing(timestamp);
    return;
}

let user2;
if (ring.queue === member) {
text = lng[user.lng].t_ring_failure;
user2 = await udb.getUser(ring[opponent].id);
let hit = await tmc.performAttack(ring[member].tamagotchi, ring[opponent].tamagotchi);
    let hit_status = lng[user2.lng].t_ring_opponent_no_hit;
    ring.queue = opponent;
    ring.hit++;
    if (hit.status >= 1) {
        ring[opponent].tamagotchi = hit.target;
let hit_type = lng[user.lng].t_ring_hit_ok;
let opponent_type_hit = lng[user2.lng].t_ring_opponent_yes_hit;
if (hit.status === 2) {
    hit_type = lng[user.lng].t_ring_critical_strike;
    opponent_type_hit = lng[user.lng].t_ring_opponent_crytical_hit;
}
        text = `${hit_type} ${hit.damage}
${lng[user.lng].your_health}: ${ring[member].tamagotchi.health},
${lng[user.lng].opponent_health}: ${ring[opponent].tamagotchi.health}
${lng[user.lng].t_ring_with_params}: ${lng[user.lng].tamagotchi_params.power}: ${ring.power}, ${lng[user.lng].blows}: ${ring.blows} ${lng[user.lng].scores}: ${ring.scores}`;
hit_status = `${opponent_type_hit} ${hit.damage}
${lng[user2.lng].t_ring_with_params}: ${lng[user2.lng].tamagotchi_params.power}: ${ring.power}, ${lng[user2.lng].blows}: ${ring.blows} ${lng[user2.lng].scores}: ${ring.scores}`;
} // end if it.status == true.
await rtdb.updateRing(ring);
let text2 = `${hit_status}
${lng[user2.lng].your_health}: ${ring[opponent].tamagotchi.health},
${lng[user2.lng].opponent_health}: ${ring[member].tamagotchi.health}`;
let buttons2 = [];
buttons2.push([`t_ring_hit ${timestamp}`, lng[user2.lng].t_ring_hit])
buttons2.push([lng[user2.lng].t_ring, lng[user2.lng].t_ring]);
if (ring[opponent].auto == false) buttons2.push([`t_ring_auto ${timestamp}`, lng[user2.lng].t_ring_auto_on])
else if (ring[opponent].auto == true) buttons2.push([`t_ring_auto ${timestamp}`, lng[user2.lng].t_ring_auto_off])
let btns2 = await keybord(user2.lng, 't_ring|' + JSON.stringify(buttons2));
await botjs.sendMSG(ring[opponent].id, text2, btns2, true, false);
} // if ring.queue === member.
let buttons = [];
buttons.push([lng[user.lng].t_ring, lng[user.lng].t_ring])
if (ring[member].auto == false) buttons.push([`t_ring_auto ${timestamp}`, lng[user.lng].t_ring_auto_on])
else if (ring[member].auto == true) buttons.push([`t_ring_auto ${timestamp}`, lng[user.lng].t_ring_auto_off])
let btns = await keybord(user.lng, 't_ring|' + JSON.stringify(buttons));
await botjs.sendMSG(id, text, btns, true, false);
if (user2 && typeof user2 !== 'undefined' && ring[opponent].auto == true) {
    await helpers.sleep(3000);
    await main(user2.id, user2.names, `t_ring_hit ${timestamp}`, 1, false, true)
}
    }
} else if (user && user.lng && message.indexOf(lng[user.lng].buy_viz) > -1) {
    if (!user.viz_login || user.viz_login && user.viz_login === '') {
        let text = lng[user.lng].no_buy_viz;
        let btns = await keybord(user.lng, 'no');
await botjs.sendMSG(id, text, btns, false);        
return;
    }
    let text = lng[user.lng].buy_viz_text + ` (>= $ ${conf.buy_viz.min_amount})
1 VIZ = $ ${conf.buy_viz.price}`;
            let btns = await keybord(user.lng, 'cancel');
    await botjs.sendMSG(id, text, btns, false);        
} else if (user && user.lng && message.indexOf(lng[user.lng].my_viz_login) > -1) {
    let text = lng[user.lng].viz_login_text;
            let btns = await keybord(user.lng, 'cancel');
    await botjs.sendMSG(id, text, btns, false);        
} else if (user && user.lng && message.indexOf(lng[user.lng].news) > -1) {
                                                                                                                                                        if (status === 2) {
                                                                                                                                                            let text = message.split('Новости:')[1];
                                                                let btns = await keybord(user.lng, 'home');
let all_users = await udb.findAllUsers();
for (let one_user of all_users) {
    try {
    await botjs.sendMSG(one_user.id, text, btns, false);
} catch(e) {
        continue;
    }
    await helpers.sleep(1000);
}
                                                                }                                                            
                                                            } else if (user && user.lng && message.indexOf(lng[user.lng].help) > -1 || message === '/help') {
                                                                let text = lng[user.lng].help_text;
                                                                let btns = await keybord(user.lng, 'home');
                                                                            await botjs.sendMSG(id, text, btns, false);
                                                                        } else if (user && user.lng && message.indexOf(lng[user.lng].partners) > -1) {
                                                                            let text = lng[user.lng].partners_text;
                                                                            let btns = await keybord(user.lng, 'home');
                                                                                        await botjs.sendMSG(id, text, btns, false);
                                                                        } else if (typeof lng[message] !== "undefined") {
                        let text = lng[message].selected_language;
        let btns = await keybord(message, '');
        let status = 'lng';
        if (user && user.status) {
            status = user.status;
        }
        await udb.updateUser(id, names, message, status, lng[message].home, send_time, user.referers, user.referer_code, user.artifacts, user.prize, user.viz_login, user.viz_scores, user.tamagotchi, user.diversity);
                    await botjs.sendMSG(id, text, btns, false);
                    await helpers.sleep(3000);
                  await main(id, names, lng[message].home, status, false, true);
                } else {
                    if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].fortune_telling) {
                let text = lng[user.lng].ft_message;
        let btns = await keybord(user.lng, 'fortune_telling');
        let spases = message.split(' ');
        let counter = message.length;
if (counter >= 12 && spases.length >= 2 && /[a-zа-яё]/i.test(message)) {
    await botjs.sendMSG(id, text, btns, false);
    await udb.updateUserStatus(id, names, lng[user.lng].home, `ft_send|${message}`, send_time);
} else {
    let text = lng[user.lng].ft_no_correct;
    let btns = await keybord(user.lng, 'games');
    await botjs.sendMSG(id, text, btns, false);
}
    } else if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].random_numbers) {
                        let number = await helpers.getRandomInRange(100, 999);
                        let text = lng[user.lng].not_number;
                        let btns = await keybord(user.lng, 'games_buttons');
                        if (!isNaN(message) && parseInt(message) > 0 && parseInt(message) <= 999 && message.length === 3) {
let rn = String(number);
                            let score = 0;
                            for (let n of message) {
                                let search_number = rn.indexOf(n);
                                if (search_number > -1) {
    score += 1;
    search_number += 1;
    rn = rn.substring(0, search_number - 1) + rn.substring(search_number, rn.length);
}
                                }
                                let max_score = 3;
                                score = Math.min(Math.max(0, Math.floor(score * Math.pow(0.95, level) * 100) / 100), max_score);
                                if (score < 0) score = 0;
score *= boost;
                                                                                    score = safeAddScore(score, id);
                                let scores = user.scores;
                                scores = await sumNumbers(scores, score);
                                text = lng[user.lng].rn_gameing_text(number, message, score, scores);
                                if (user.diversity.indexOf('random_numbers') === -1) user.diversity.push('random_numbers')
                                await udb.updateUserStatus(id, names, lng[user.lng].home, user.status, send_time, user.diversity, score);                                
                                                                await createRefererScores(score, user.referers);
                                                            } else { // if is not number or if error.
                                                                await udb.updateUserStatus(id, names, lng[user.lng].home, user.status, send_time);
                                                                text = lng[user.lng].rn_error;
                                                            }
                                                                                        await botjs.sendMSG(id, text, btns, false);
                                                                                    } else if (user && user.lng && lng[user.lng] && user.status.indexOf(lng[user.lng].bk_level) > -1 && user.prev_status && user.prev_status.indexOf(lng[user.lng].bk_game) > -1) {
                                                                                        let bk_level = parseInt(user.status.split(' ')[1]);
                                                                let max_n = (10 ** (bk_level + 2)) -1;
                                                                let text = lng[user.lng].not_number;
                                                                let btns = await keybord(user.lng, 'games');
                                                                let simbols = bk_level + 2;
                                                                let staps = '';
                                                                if (!isNaN(message) && parseInt(message) > 0 && parseInt(message) <= max_n && message.length === simbols) {
                                                                    let game = await bkdb.getGameSession(id, bk_level);
                                                                if (game || typeof game !== 'undefined') {
                                                                        if (game.text.length < 4000) staps = game.text;
                                                                        let res = countBullsAndCows(game.number, message);
                                                                        let now_stap = game.stap+1;
                                                                        staps += `
${lng[user.lng].bk_stap} ${now_stap}:
${lng[user.lng].bk_number}: ${message},
${lng[user.lng].bulls}: ${res[0]},
${lng[user.lng].cows}: ${res[1]}`;
                                                                        await bkdb.updateGameSession(id, bk_level, staps);
text = lng[user.lng].bk_game_text(bk_level, staps);

                                                                        let max_staps = simbols ** 2 + 10;
                                                                        if (res[0] === simbols) {
                                                                            let bkl_for_scores = 1;
                                                                            if (bk_level === 2) bkl_for_scores = 2.5;
                                                                            if (bk_level === 3) bkl_for_scores = 5;
                                                                            let max_score = new Big(100).times(bkl_for_scores);
                                                                            let score_by_stap = max_score.div(max_staps);
                                                                            if (now_stap > max_staps) now_stap = max_staps;
                                                                            let no_steps = await minusNumbers(max_staps, now_stap, true);
                                                                            let staps_for_scores = new Big(1).plus(no_steps);
                                                                            let score_without_level = score_by_stap.times(staps_for_scores).times(0.1);
let score = parseFloat(score_without_level.toString());
score = Math.min(Math.max(0, Math.floor(score * Math.pow(0.95, level) * 100) / 100), max_score);
score *= boost;
                                                                                    score = safeAddScore(score, id);
let calc_score = new Big(score);
let scores = user.scores;
                                                                            scores = await sumNumbers(calc_score, scores);
                                                                            text = lng[user.lng].bk_gameing_text(game.number, now_stap, calc_score, scores);
                                                                            if (user.diversity.indexOf('bk_game') === -1) user.diversity.push('bk_game')
                                                                            await udb.updateUserStatus(id, names, user.prev_status, user.status, send_time, user.diversity, parseFloat(calc_score));                                
                                                                                                            await createRefererScores(calc_score, user.referers);
                                                                        await bkdb.removeGameSession(id, bk_level);
                                                                                                        } // end if maximum bulls.
                                                                    else {
                                                                        await udb.updateUserStatus(id, names, user.prev_status, user.status, send_time);                                
                                                                        btns = await keybord(user.lng, 'bk_game_buttons');
                                                                    }
                                                                } // end game.
                                                                } else if (message === lng[user.lng].reset_game) {
                                                                    text = lng[user.lng].reset_text;
                                                                    btns = await keybord(user.lng, 'conferm');
                                                                } else { // if is not number or if error.
                                                                    await udb.updateUserStatus(id, names, user.prev_status, user.status, send_time);                                
                            text = lng[user.lng].bk_error(simbols);
                        }
    await botjs.sendMSG(id, text, btns, false);
} else if (user && user.lng && lng[user.lng] && user.status.indexOf(lng[user.lng].reset_game) > -1 && user.prev_status && user.prev_status.indexOf(lng[user.lng].bk_level) > -1) {
    let bk_level = parseInt(user.prev_status.split(' ')[1]);
    let text = lng[user.lng].reset_no;
    let btns = await keybord(user.lng, 'games_buttons');
    if (message === lng[user.lng].yes) {
await bkdb.removeGameSession(id, bk_level);
text = lng[user.lng].reset_yes(bk_level);
}
await botjs.sendMSG(id, text, btns, false);
await udb.updateUserStatus(id, names, user.status, lng[user.lng].home, send_time);
} else if (user && user.lng && lng[user.lng] && user.status.indexOf(lng[user.lng].crypto_bids + '|') > -1) {
    let price = user.status.split('|')[1];
                        let text = lng[user.lng].not_number;
                        let btns = await keybord(user.lng, 'games_buttons');
                        let active_scores = await sumNumbers(user.scores, user.viz_scores);
                        if (!isNaN(message) && parseFloat(message) <= active_scores && new Big(message).gte(0.001)) {
                            await udb.updateUserStatus(id, names, user.status, `cb_direction|${message}|${price}`, send_time);
    text = lng[user.lng].crypto_bids_direction;
    btns = await keybord(user.lng, 'bids_direction');
}
await botjs.sendMSG(id, text, btns, false);
} else if (user && user.lng && lng[user.lng] && user.status.indexOf('cb_direction|') > -1) {
    let scores = parseFloat(user.status.split('|')[1]);
    let price = parseFloat(user.status.split('|')[2]);
    let text = lng[user.lng].crypto_bids_failed;
    let btns = await keybord(user.lng, 'games');
    
    if (message === lng[user.lng].cb_more || message === lng[user.lng].cb_less) {
      let direction = '<';
      if (message === lng[user.lng].cb_more) direction = '>';
      text = lng[user.lng].crypto_bids_ok;
      await cbdb.addCryptoBid(id, scores, direction, price);
    
      let [user_scores, viz_scores] = [user.scores, user.viz_scores];
      let gamer_scores = 0;
      let blockchain_scores = 0;
      let minus_scores = await minusNumbers(viz_scores, scores);
      if (minus_scores < 0) {
        blockchain_scores = viz_scores;
          gamer_scores = await minusNumbers(scores, viz_scores)
      } else {
        blockchain_scores = scores;
      }
      await udb.updateUserStatus(id, names, user.status, lng[user.lng].games, send_time, user.diversity, -Math.abs(gamer_scores), scores, -Math.abs(blockchain_scores));
}
await botjs.sendMSG(id, text, btns, false);
} else if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].tamagotchi && Object.keys(user.tamagotchi).length === 0) {
    let tamagotchi = {name: message, health: 100, satiety: 100, happiness: 100, energy: 100, cleanliness: 100, age: 0, power: 0, xp: 0, lastAgeUpdate: new Date().getTime(), sleap_time: 0, inventory: []};
    user.tamagotchi = tamagotchi;
await udb.updateUserStatus(user.id, user.names, user.prev_status, user.status, user.send_time, user.diversity, 0, 0, 0, user.tamagotchi);
let text = `${lng[user.lng].tamagotchi_set_name} ${message}!`;
let btns = await keybord(user.lng, 'to_game|' + user.status);
                                        await botjs.sendMSG(id, text, btns, true);
                                    } else if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].buy_viz) {
                                        if (!user.viz_login || user.viz_login && user.viz_login === '') {
                                            let text = lng[user.lng].no_buy_viz;
                                            let btns = await keybord(user.lng, 'no');
                                    await botjs.sendMSG(id, text, btns, false);        
                                    return;
                                        }
                                        let amount = 10;
                                        if (!isNaN(message)) amount = parseFloat(message);
if (amount < conf.buy_viz.min_amount) {
    let text = lng[user.lng].small_buy_viz + conf.buy_viz.min_amount;
    let btns = await keybord(user.lng, 'no');
await botjs.sendMSG(id, text, btns, false);        
return;
}
                                        const assets = ['USDT', 'USDC', 'BUSD']
                                        const crypto_pay_options = {
                                            description: 'Покупка VIZ',
                                            paid_btn_name: PaidButtonNames.OPEN_BOT,
                                            paid_btn_url: 'https://t.me/viz_mg_bot',
                                            payload: id
                                          };
                                        const invoices = {};
                                        for (let asset of assets) {
                                            const invoice = await cryptoPay.createInvoice(asset, amount, crypto_pay_options);
                                            invoices[asset] = invoice.pay_url;
                                        }
                        let text = lng[user.lng].buy_viz_select;
                        for (let asset in invoices) {
let url = invoices[asset];
text += `
${asset}: ${url}`;
                        }
                        let btns = await keybord(user.lng, 'home_button');
                        await botjs.sendMSG(id, text, btns, false);                                    
                    } else if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].my_viz_login) {
    let viz_login = message.toLowerCase();
    let get_account = await methods.getAccount(viz_login);
    let text = lng[user.lng].not_account;
    if (get_account && get_account.length > 0) {
        text = lng[user.lng].account_added;
        await udb.updateUser(id, names, user.lng, user.prev_status, user.status, send_time, user.referers, user.referer_code, user.artifacts, user.prize, viz_login, user.viz_scores, user.tamagotchi, user.diversity);
    }
    let btns = await keybord(user.lng, 'home_button');
await botjs.sendMSG(id, text, btns, false);
}
}
}

async function futureTellingNotify(bn, memo) {
    let [type, id] = memo.split(':');
if (type && id) {
    let data = await ftqdb.getHashById(parseInt(id));
    if (typeof data === 'undefined' || data && Object.keys(data).length === 0) return;
    let q = data.text;
    let user = await udb.getUser(parseInt(id));
    if (user) {
        let res =     await main(user.id, user.names, lng[user.lng].check_subscribes, 1, true, true);
        if (user.lng && user.lng !== '' && res === 'not_subscribe') return;
        let boost = 1;
        if (user.names.indexOf('$VIZ') > -1) boost += 0.1;
        if (user.names.indexOf('@viz_mg_bot') > -1) boost += 0.2;
        if (typeof user.viz_login !== 'undefined' && user.viz_login !== '') boost += 0.1;
        boost += user.diversity.length * 0.02;
        boost = parseFloat(boost.toFixed(2));
        
        let number = await methods.randomWithHash(data.hash, bn, 2);
        let variant = lng[user.lng][number];
        let random_variant = await helpers.getRandomInRange(1, variant.length);
        
        let ft_result = variant[random_variant - 1];
        let level = parseInt(new Big(user.scores).plus(new Big(user.locked_scores)).div(100))
        if (level < 0) level = 0;
        let max_score = 10;
        let score = number * 10;
        if (score < 0) score = 0;
        score = Math.min(Math.max(0, Math.floor(score * Math.pow(0.95, level) * 100) / 100), max_score);
        score *= boost;
                                                                                                    score = safeAddScore(score, id);
        let text = `${q}
${ft_result}
${lng[user.lng].more}:
${lng[user.lng].block_hash} ${bn},
${lng[user.lng].text_hash}: ${data.hash},
${lng[user.lng].number_types},
${lng[user.lng].generated_number}: ${number}.
${lng[user.lng].scores}: ${score}

${lng[user.lng].award_ft_author}`;
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(parseInt(id), text, btns, false);
await ftqdb.removeHashData(parseInt(id));
let scores = user.scores;
scores = await sumNumbers(scores, score);
if (user.diversity.indexOf('fortune_telling') === -1) user.diversity.push('fortune_telling')
await udb.updateUserStatus(user.id, user.names, user.prev_status, user.status, user.send_time, user.diversity, score);
await createRefererScores(score, user.referers);
}
}
}

async function addVizScores(bn, memo, shares) {
        let [type, id] = memo.split(':');
    if (typeof id !=='undefined' && !isNaN(id)) {
        let user = await udb.getUser(parseInt(id));
        if (!user || user && Object.keys(user).length === 0) return;
        let boost = 1;
        if (user.names.indexOf('$VIZ') > -1) boost += 0.1;
        if (user.names.indexOf('@viz_mg_bot') > -1) boost += 0.2;
        if (typeof user.viz_login !== 'undefined' && user.viz_login !== '') boost += 0.1;
        boost += user.diversity.length * 0.02;
        boost = parseFloat(boost.toFixed(2));

        let score = shares * 10;
        score *= boost;
                                                                                            score = safeAddScore(score, user.id);
        let scores = user.viz_scores;
        scores = await sumNumbers(scores, score);
        if (user.diversity.indexOf('add_viz_scores') === -1 && shares >= 1) user.diversity.push('add_viz_scores')
        await udb.updateUserStatus(user.id, user.names, user.prev_status, user.status, user.send_time, user.diversity, 0, 0, score);
        let text = `${lng[user.lng].added_viz_scores}: ${score}
${lng[user.lng].all_scores}: ${scores}.`;
        let btns = await keybord(user.lng, 'no');
        await botjs.sendMSG(parseInt(id), text, btns, false);
    }
    }

async function scoresAward() {
try {
    const account = await methods.getAccount(conf.mg_bot.award_account);
    if (account && account.length == 0) return;
        const balance = parseFloat(account[0].balance.split(' ')[0]) - 1;

    let top = await udb.getTop();
    let all_scores = top.reduce(function(p, c) {
        if (c.scores > 0) {
            return p + c.scores
        } else {
            return p;
        }
    }, 0);
    let msgs = [];
let top_list = '';
const operations = [];
for (let user of top) {
        if (user.scores > 0) {
            let res =     await main(user.id, user.names, lng[user.lng].check_subscribes, 1, true, true);
        if (user.lng && user.lng !== '' && res === 'not_subscribe') continue;
            let text = '';
    let scores_share = new Big(user.scores).div(all_scores);
    let send_amount = new Big(balance).times(scores_share);
    let identity = `<a href="tg://user?id=${user.id}">${user.id}</a>`;
    if (user.names !== '') identity = `<a href="tg://user?id=${user.id}">${helpers.addslashes(user.names)}</a>`;
    if (send_amount.lt(0.001)) {
    text = lng[user.lng].not_scores_award(user.scores, all_scores);
    continue;
}
let memo =  `Award from https://t.me/viz_mg_bot`;
let to = user.viz_login;
if (user.viz_login === '') {
    memo =  `telegram:${user.id}`;
to = 'viz-social-bot';
}
let op = [];
op[0] = 'transfer';
op[1] = {};
op[1].from = conf.mg_bot.award_account;
op[1].to = to;
op[1].amount = send_amount.toFixed(3) + ' VIZ';
op[1].memo = memo;
operations.push(op);
top_list += `
${identity}: ${user.scores} (${send_amount.toFixed(3)} VIZ)`;

    text = `${lng[user.lng].yes_scores_award}
`;
msgs.push({text, lng: user.lng, id: user.id})
}
}

if (operations.length > 0) {
    let sended = await methods.send(operations, conf.mg_bot.active_key);
    if (typeof sended === 'string' && send === 'error') return;
    await udb.resetUsersScores();
    await sdb.updateShares(0);
    await cbdb.removeCryptoBids();
    await rtdb.removeRing(-1);
for (let msg of msgs) {
    msg.text += lng[msg.lng].scores_top_text(top_list);
    let btns = await keybord(msg.lng, 'no');
await botjs.sendMSG(msg.id, msg.text, btns, false);
}
}
} catch(e) {
    console.error('Ошибка в функции scoresAward:', e);
    await helpers.sleep(60000);
    await scoresAward();
}
}

async function cryptoBidsResults() {
    await helpers.sleep(1000);
    let responce = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    let now_price = parseFloat(responce.data.price);
    let time_has_passed = new Date().getTime() - responce.data.timestamp;
    if (!now_price || typeof now_price === 'undefined' || responce && responce.length > 0 && time_has_passed >= 600000) return;
    let timestamp = new Date().getTime();
await cbdb.updateBTCPrice(now_price, timestamp);

let min_time = timestamp - 60000;
let bids = await cbdb.findCryptoBids(true, {timestamp: {$lte: min_time}});
    if (!bids || bids && bids.length === 0) {
        bids_status = false;
        return;
    }
    
        let users = await udb.findAllUsers();
if (!users || typeof users === 'undefined' || Object.keys(users).length === 0) return;
for (let user of users) {
if (!bids[user.id] || typeof bids[user.id] === 'undefined') continue;
    let res =     await main(user.id, user.names, lng[user.lng].check_subscribes, 1, true, true);
    if (user.lng && user.lng !== '' && res === 'not_subscribe') continue;
    let bid = bids[user.id];
    let direction = '<';
if (now_price > bid.btc_price) direction = '>';
if (user.lng === '' && user.locked_scores === 0) continue;
let text = lng[user.lng].crypto_bids_lost;
let btns = await keybord(user.lng, 'no');
let bid_scores = new Big(bid.scores);
    if (bid.direction === direction) {
        let boost = 1;
        if (user.names.indexOf('$VIZ') > -1) boost += 0.1;
        if (user.names.indexOf('@viz_mg_bot') > -1) boost += 0.2;
        if (typeof user.viz_login !== 'undefined' && user.viz_login !== '') boost += 0.1;
        boost += user.diversity.length * 0.02;
        boost = parseFloat(boost.toFixed(2));

        let level = parseInt(new Big(user.scores).plus(new Big(user.locked_scores)).div(100))
    if (level < 0) level = 0;
    if (!user.lng || user.lng && user.lng === '') user.lng = 'English';
const stakeLevel = Math.ceil(bid.scores / 100); // Уровень с округлением в большую сторону

const baseCoefficient = 1.2; // Начальное значение коэффициента
const maxLevel = 10; // Максимальный уровень, на котором коэффициент будет равен 1.05

let coefficient;
if (stakeLevel <= maxLevel) {
const decayFactor = Math.pow(1.05 / baseCoefficient, 1 / maxLevel); // Фактор затухания для плавного спуска
coefficient = baseCoefficient * Math.pow(decayFactor, stakeLevel);
} else {
coefficient = 1.05; // Коэффициент равен 1.05 после максимального уровня
}
coefficient -= 1;
let k = new Big(coefficient).times(boost);
k = new Big(1).plus(k);
let scoreCalc = bid_scores.times(k);
let score = new Big(scoreCalc);
                                                                                    score = safeAddScore(score, bid.id);
let scores = parseFloat(new Big(user.scores).plus(score));
let plus_amount = new Big(score).minus(bid.scores);
text = lng[user.lng].crypto_bids_winn(parseFloat(plus_amount), bid.scores, parseFloat(score));
let locked_scores = parseFloat(new Big(user.locked_scores).minus(bid.scores));
if (locked_scores < 0) locked_scores = 0;
if (user.diversity.indexOf('crypto_bids') === -1) user.diversity.push('crypto_bids')
await udb.updateUserStatus(bid.id, user.names, user.prev_status, user.status, user.send_time, user.diversity, score, -Math.abs(bid.scores));
await helpers.sleep(500);
await createRefererScores(score, user.referers);
await cbdb.removeCryptoBids(bid.id);    
} // you winn.
                 else {
                    await cbdb.removeCryptoBids(bid.id);
                    let locked_scores = parseFloat(new Big(user.locked_scores).minus(bid.scores));
                    if (locked_scores < 0) locked_scores = 0;
                    await udb.updateUserStatus(bid.id, user.names, user.prev_status, user.status, user.send_time, user.diversity, 0, -Math.abs(bid.scores));
                    await helpers.sleep(500);
                }
    text += lng[user.lng].crypto_bids_data(helpers.adaptiveFixed(bid.btc_price, 2), helpers.adaptiveFixed(now_price, 2), bid.direction, bid.scores);
    await botjs.sendMSG(bid.id, text, btns, false);
            } // end for users.
}

module.exports.main = main;
module.exports.futureTellingNotify = futureTellingNotify;
module.exports.addVizScores = addVizScores;
module.exports.scoresAward = scoresAward;
module.exports.cryptoBidsResults = cryptoBidsResults;