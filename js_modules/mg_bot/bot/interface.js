var Big = require('big.js');
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
const axios = require("axios");
const helpers = require(process.cwd() + "/js_modules/helpers");
const conf = require(process.cwd() + "/config.json");
const tmc = require('../tamagotchi');
var crypto = require('crypto');
var energy = new Big(20);

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
        buttons = [[lng[lang].reytings, lng[lang].games, lng[lang].my_viz_login, lng[lang].add_viz_scores], [lng[lang].lang, lng[lang].help, lng[lang].partners]];
    } else if (variant === 'games') {
        buttons = [[lng[lang].fortune_telling, lng[lang].random_numbers, lng[lang].bk_game], [lng[lang].crypto_bids, lng[lang].tamagotchi, lng[lang].home]];
    } else if (variant === 'bk_game') {
        buttons = [[lng[lang].bk_level + '1', lng[lang].bk_level + '2', lng[lang].bk_level + '3'], [lng[lang].games, lng[lang].home]];
    } else if (variant === 'reytings') {
        buttons = [[lng[lang].scores_top, lng[lang].artifacts_owners, lng[lang].home]]
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
            buttons.push([[lng[lang].inventory, lng[lang].inventory], [lng[lang].t_shop, lng[lang].t_shop], [lng[lang].tamagotchi, lng[lang].tamagotchi]]);
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
    await udb.updateUserStatus(referer.id, referer.names, referer.prev_status, referer.status, referer.send_time, new_scores, 0, 0);
}
}
}
}

// Команды
async function main(id, names, message, status, isReturn = false) {
    const block_n = await bdb.getBlock();
    let bn = block_n.last_block;
    let block_interval = 28800;
    let end_round_block = block_interval - (bn % block_interval);

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
        if (message.indexOf('r') > -1 && message.indexOf('subscr') === -1) {
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
    } // end if not user.
    else { // yes user.
        if (typeof message !== 'undefined' && user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].back) > -1 || typeof message !== 'undefined' && user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].cancel) > -1) message = user.prev_status;
        let last_time = send_time - user.send_time;
        if (user.send_time && typeof user.send_time !== 'undefined' && last_time < 1000 && message !== lng[user.lng].home && message !== lng[user.lng].check_subscribes && message !== '/start') return;
        
        level = parseInt(new Big(user.scores).plus(new Big(user.locked_scores)).div(100))
        if (level < 0) level = 0;

        if (user.status === message) {
            await udb.updateUserStatus(id, names, user.prev_status, message, send_time);
            } else {
                await udb.updateUserStatus(id, names, user.status, message, send_time);
            }
    } // end yes user.

    if (end_round_block < 30 && (message === lng[user.lng].fortune_telling || message === lng[user.lng].random_numbers || message === lng[user.lng].crypto_bids)) {
        let text = lng[user.lng].wait_award;
        let btns = await keybord(user.lng, 'no');
        await botjs.sendMSG(id, text, btns, false);
    return;
    }

    if (message.indexOf('start') > -1 || user && user.lng && message.indexOf(lng[user.lng].home) > -1) {
        let text = '';
let btns;
if (user && user.lng && user.lng !== '') {
    await main(id, names, lng[user.lng].check_subscribes, status, false);
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
        let text = lng[user.lng].home_message(user.names, referer, user.referer_code, user.scores, level, user.locked_scores, user.viz_scores);
                let btns = await keybord(user.lng, 'home');
                await botjs.sendMSG(id, text, btns, false);        
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
        let top = await udb.getScoresTop();
        let all_scores = top.reduce(function(p, c) {
        if (c.scores > 0) {
            return p + c.scores
        } else {
            return p;
        }
    }, 0);
let j_timestamp = parseInt(end_round_block * 3);
var j_hours = Math.floor(j_timestamp / 60 / 60);
var j_minutes = Math.floor(j_timestamp / 60) - (j_hours * 60);
var j_seconds = j_timestamp % 60;
var end_round_time = [
    j_hours.toString().padStart(2, '0'),
    j_minutes.toString().padStart(2, '0'),
    j_seconds.toString().padStart(2, '0')
  ].join(':');
let before_award = `${end_round_block} ${lng[user.lng].is_blocks} (${lng[user.lng].approximately} ${end_round_time})`;

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
        let text = lng[user.lng].scores_top_text(before_award, top_list);
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
let text = `${q}
${ft_result}
${lng[user.lng].more}:
${lng[user.lng].block_hash} ${bn},
${lng[user.lng].text_hash}: ${hash},
${lng[user.lng].number_types},
${lng[user.lng].generated_number}: ${number}.
${lng[user.lng].scores}: ${score}.
`;
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(id, text, btns, false);
 await udb.updateUserStatus(id, names, user.status, lng[user.lng].home, send_time, score);
await createRefererScores(score, user.referers);
} else if (user && user.lng && message.indexOf(lng[user.lng].add_viz_scores) > -1) {
            let text = lng[user.lng].viz_scores_adding(conf.mg_bot.award_account, `scores:${id}`);
            let btns = await keybord(user.lng, 'no');
            await botjs.sendMSG(id, text, btns, false);
} else if (user && user.lng && message.indexOf(lng[user.lng].random_numbers) > -1) {
    let text = lng[user.lng].rn_text;
            let btns = await keybord(user.lng, 'games_buttons');
    await botjs.sendMSG(id, text, btns, false);        
} else if (user && user.lng && message.indexOf(lng[user.lng].crypto_bids) > -1 || user && user.lng && message === '.bids' || user && user.lng && message === '.стк') {
    if (message === '.bids') message = lng[user.lng].crypto_bids;
    if (message === '.стк') message = lng[user.lng].crypto_bids;
    let end_bids_round = Math.ceil(bn / 200) * 200;
    if (bn >= end_bids_round - 100 && bn <= end_bids_round) {
        let end_round_block = 200 - (bn % 200);
        let timestamp = parseInt(end_round_block * 3);
        var hours = Math.floor(timestamp / 60 / 60);
        var minutes = Math.floor(timestamp / 60) - (hours * 60);
        var seconds = timestamp % 60;
        var end_round_time = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
          ].join(':');
        
        let text = lng[user.lng].crypto_bids_active + ` ${end_round_time}`;
        let btns = await keybord(user.lng, 'games');        
        await botjs.sendMSG(id, text, btns, false);        
        await udb.updateUserStatus(id, names, user.prev_status, lng[user.lng].home, send_time);
        return;
    }
    let bids = await cbdb.findCryptoBids();
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
                await udb.updateUserStatus(id, names, user.prev_status, lng[user.lng].crypto_bids + '|' + btc_price.price, send_time, 0);
            } else {
        await udb.updateUserStatus(id, names, user.prev_status, lng[user.lng].home, send_time, 0);
    }
    await botjs.sendMSG(id, text, btns, false);        
} else if (user && user.lng && message.indexOf(lng[user.lng].bk_game) > -1) {
    let text = lng[user.lng].bk_text;
    let btns = await keybord(user.lng, 'bk_game');
                await botjs.sendMSG(id, text, btns, false);
            } else if (user && user.lng && user.status.indexOf(lng[user.lng].bk_game) > -1) {
                if (message.indexOf(lng[user.lng].bk_level) === -1) {
                    let text = lng[user.lng].bk_no_level;
                    let btns = await keybord(user.lng, 'bk_game');
                                await botjs.sendMSG(id, text, btns, false);
                                await udb.updateUserStatus(user.id, user.names, user.prev_status, user.status, user.send_time, 0, 0, 0, user.tamagotchi);
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
                            
                            if (typeof action !== 'undefined') {
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
    await botjs.sendMSG(id, text, btns, true, false);
} else {
    await botjs.sendMSG(id, text, btns, false, false);
}
                                                                                await udb.updateUserStatus(user.id, user.names, user.status, message, user.send_time, action_scores, 0, 0, user.tamagotchi);
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
                                                                                let text = lng[user.lng].no_tamagotchi;
                                                                                let actions = [];
                                                                                if (user.tamagotchi && Object.keys(user.tamagotchi).length > 0) {
text = lng[user.lng].not_in_inv;
if (user.tamagotchi.inventory && user.tamagotchi.inventory.length > 0 && user.tamagotchi.inventory.indexOf(message) > -1) {
    let res = user.tamagotchi.inventory.indexOf(message);
    let energy = parseInt(message.split('_')[1]);
user.tamagotchi.energy = await sumNumbers(user.tamagotchi.energy, energy);
if (user.tamagotchi.energy > 100) user.tamagotchi.energy = 100;
user.tamagotchi.inventory.splice(res, 1);
text = `${message} ${lng[user.lng].product_applied}`;
await udb.updateUserStatus(user.id, user.names, user.status, message, user.send_time, 0, 0, 0, user.tamagotchi);
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
      let minus_scores = await minusNumbers(user_scores, scores);
      if (minus_scores < 0) {
          gamer_scores = user_scores;
      blockchain_scores = await minusNumbers(scores, user_scores)
      } else {
          gamer_scores = scores;
      }
      user.tamagotchi.inventory.push(product);
      await udb.updateUserStatus(
              id,
              names,
              user.status,
              lng[user.lng].games,
              send_time,
              -Math.abs(gamer_scores),
              0,
              -Math.abs(blockchain_scores),
              user.tamagotchi
              );
              text = `${lng[user.lng].t_shop_buy} ${product}`;
        }
    }
    let btns = await keybord(user.lng, 't_shop');
    await botjs.sendMSG(id, text, btns, true, false);                                                 
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
        await udb.updateUser(id, names, message, status, lng[message].home, send_time, user.referers, user.referer_code, user.artifacts, user.prize, user.viz_login, user.viz_scores, user.tamagotchi);
                    await botjs.sendMSG(id, text, btns, false);
                    await helpers.sleep(3000);
                  await main(id, names, lng[message].home, status);
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
                                let scores = user.scores;
                                scores = await sumNumbers(scores, score);
                                text = lng[user.lng].rn_gameing_text(number, message, score, scores);
                                await udb.updateUserStatus(id, names, lng[user.lng].home, user.status, send_time, score);                                
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
let calc_score = new Big(score);
let scores = user.scores;
                                                                            scores = await sumNumbers(calc_score, scores);
                                                                            text = lng[user.lng].bk_gameing_text(game.number, now_stap, calc_score, scores);
                                                                            await udb.updateUserStatus(id, names, user.prev_status, user.status, send_time, parseFloat(calc_score));                                
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
    let end_bids_round = Math.ceil(bn / 200) * 200;
    if (bn >= end_bids_round - 100 && bn <= end_bids_round) {
        let end_round_block = 200 - (bn % 200);
        let timestamp = parseInt(end_round_block * 3);
        var hours = Math.floor(timestamp / 60 / 60);
        var minutes = Math.floor(timestamp / 60) - (hours * 60);
        var seconds = timestamp % 60;
        var end_round_time = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
          ].join(':');
        
        let text = lng[user.lng].crypto_bids_active + ` ${end_round_time}`;
        let btns = await keybord(user.lng, 'games');        
        await botjs.sendMSG(id, text, btns, false);        
        await udb.updateUserStatus(id, names, user.prev_status, lng[user.lng].home, send_time);
        return;
    }
                    
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
    let end_bids_round = Math.ceil(bn / 200) * 200;
    if (bn >= end_bids_round - 100 && bn <= end_bids_round) {
        let end_round_block = 200 - (bn % 200);
        let timestamp = parseInt(end_round_block * 3);
        var hours = Math.floor(timestamp / 60 / 60);
        var minutes = Math.floor(timestamp / 60) - (hours * 60);
        var seconds = timestamp % 60;
        var end_round_time = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
          ].join(':');
        
        let text = lng[user.lng].crypto_bids_active + ` ${end_round_time}`;
        let btns = await keybord(user.lng, 'games');        
        await botjs.sendMSG(id, text, btns, false);        
        await udb.updateUserStatus(id, names, user.prev_status, lng[user.lng].home, send_time);
        return;
    }

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
let minus_scores = await minusNumbers(user_scores, scores);
if (minus_scores < 0) {
    gamer_scores = user_scores;
blockchain_scores = await minusNumbers(scores, user_scores)
} else {
    gamer_scores = scores;
}
      await udb.updateUserStatus(
        id,
        names,
        user.status,
        lng[user.lng].games,
        send_time,
        -Math.abs(gamer_scores),
        scores,
        -Math.abs(blockchain_scores)
        );
}
await botjs.sendMSG(id, text, btns, false);
} else if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].tamagotchi && Object.keys(user.tamagotchi).length === 0) {
    let tamagotchi = {name: message, health: 100, satiety: 100, happiness: 100, energy: 100, cleanliness: 100, age: 0, lastAgeUpdate: new Date().getTime(), sleap_time: 0, inventory: []};
user.tamagotchi = tamagotchi;
await udb.updateUserStatus(user.id, user.names, user.prev_status, user.status, user.send_time, 0, 0, 0, user.tamagotchi);
let text = `${lng[user.lng].tamagotchi_set_name} ${message}!`;
let btns = await keybord(user.lng, 'to_game|' + user.status);
                                        await botjs.sendMSG(id, text, btns, true);
} else if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].my_viz_login) {
    let viz_login = message.toLowerCase();
    let get_account = await methods.getAccount(viz_login);
    let text = lng[user.lng].not_account;
    if (get_account && get_account.length > 0) {
        text = lng[user.lng].account_added;
        await udb.updateUser(id, names, user.lng, user.prev_status, user.status, send_time, user.referers, user.referer_code, user.artifacts, user.prize, viz_login, user.viz_scores, user.tamagotchi);
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
        let res =     await main(user.id, user.names, lng[user.lng].check_subscribes, 1, true);
        if (user.lng && user.lng !== '' && res === 'not_subscribe') return;
   
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
        let text = `${q}
${ft_result}
${lng[user.lng].more}:
${lng[user.lng].block_hash} ${bn},
${lng[user.lng].text_hash}: ${data.hash},
${lng[user.lng].number_types},
${lng[user.lng].generated_number}: ${number}.
${lng[user.lng].scores}: ${score}
`;
let btns = await keybord(user.lng, 'home');
await botjs.sendMSG(parseInt(id), text, btns, false);
await ftqdb.removeHashData(parseInt(id));
let scores = user.scores;
scores = await sumNumbers(scores, score);
await udb.updateUserStatus(user.id, user.names, user.prev_status, user.status, user.send_time, score);
await createRefererScores(score, user.referers);
}
}
}

async function addVizScores(bn, memo, shares) {
        let [type, id] = memo.split(':');
    if (typeof id !=='undefined' && !isNaN(id)) {
        let user = await udb.getUser(parseInt(id));
        if (!user || user && Object.keys(user).length === 0) return;
        let score = shares * 10;
        let scores = user.viz_scores;
        scores = await sumNumbers(scores, score);
        await udb.updateUserStatus(user.id, user.names, user.prev_status, user.status, user.send_time, 0, 0, score);
        let text = `${lng[user.lng].added_viz_scores}: ${score}
${lng[user.lng].all_scores}: ${scores}.`;
        let btns = await keybord(user.lng, 'no');
        await botjs.sendMSG(parseInt(id), text, btns, false);
    }
    }

async function scoresAward() {
    const operations = [];
let benef = [{account: 'denis-skripnik', weight: 100}];
    let top = await udb.getScoresTop();
    let all_scores = top.reduce(function(p, c) {
        if (c.scores > 0) {
            return p + c.scores
        } else {
            return p;
        }
    }, 0);
    let msgs = [];
let top_list = '';
    for (let user of top) {
        if (user.scores > 0) {
            let res =     await main(user.id, user.names, lng[user.lng].check_subscribes, 1, true);
        if (user.lng && user.lng !== '' && res === 'not_subscribe') continue;
            let text = '';
    let scores_share = new Big(user.scores).div(all_scores);
    let percent = energy.times(scores_share);
    let identity = `<a href="tg://user?id=${user.id}">${user.id}</a>`;
    if (user.names !== '') identity = `<a href="tg://user?id=${user.id}">${helpers.addslashes(user.names)}</a>`;
    top_list += `
    ${identity}: ${user.scores} (${percent.toFixed(2)}% ${lng[user.lng].of_energy})`;

    if (percent.lt(0.01)) {
    text = lng[user.lng].not_scores_award(user.scores, all_scores);
    continue;
}
let memo =  `telegram:${user.id}`;
let receiver = 'viz-social-bot';
if (user.viz_login !== '') {
    memo = 'https://t.me/viz_mg_bot';
    receiver = user.viz_login.toLowerCase();
}
let op = [];
op[0] = 'award';
op[1] = {};
op[1].initiator = conf.mg_bot.award_account;
op[1].receiver = receiver;
op[1].energy = parseInt(percent.times(100));
op[1].custom_sequence = 0;
op[1].memo = memo;
op[1].beneficiaries = benef;
operations.push(op);

    text = `${lng[user.lng].yes_scores_award}
`;
msgs.push({text, lng: user.lng, id: user.id})
}
}
if (operations.length > 0) {
    await methods.send(operations, conf.mg_bot.regular_key);
    await udb.resetUsersScores();
    await cbdb.removeCryptoBids();
for (let msg of msgs) {
    msg.text += lng[msg.lng].scores_top_text('', top_list);
    let btns = await keybord(msg.lng, 'no');
await botjs.sendMSG(msg.id, msg.text, btns, false);
}
}
}

async function cryptoBidsResults() {
    await helpers.sleep(1000);
    let responce = await axios.get('https://api.coincap.io/v2/assets?limit=1');
    let now_price = parseFloat(responce.data.data[0].priceUsd);
    let time_has_passed = new Date().getTime() - responce.data.timestamp;
    if (!now_price || typeof now_price === 'undefined' || responce && responce.length > 0 && time_has_passed >= 600000) return;
    let timestamp = new Date().getTime();
await cbdb.updateBTCPrice(now_price, timestamp);

    let bids = await cbdb.findCryptoBids();
    if (!bids || bids && bids.length === 0) {
        bids_status = false;
        return;
    }
    
    const bids_ids = bids.reduce((previousValue, currentValue) => {
        previousValue.push(currentValue.id);
        return previousValue;
        }, []);
    
    let users = await udb.findAllUsers('object');
if (!users || typeof users === 'undefined' || Object.keys(users).length === 0) return;
for (let id in users) {
    let user = users[id];
    if (bids_ids.indexOf(id) > -1 || user.lng && user.status !== lng[user.lng].crypto_bids || user.status.indexOf('cb_direction|') === -1) continue;
    await udb.updateUserStatus(user.id, user.names, user.prev_status, lng[user.lng].games, user.send_time);
    let btns = await keybord(msg.lng, 'home');
await botjs.sendMSG(user.id, lng[user.lng].new_bids_round, btns, false);
}


let all_bids = new Big(0);
let winners_bids = new Big(0);
let winners = [];
        let admin_text = `В этом раунде сделали ставки следующие пользователи:
`;
        for (let bid of bids) {
            let user = users[bid.id];
if (user && Object.keys(user).length > 0) {
    if (!user.lng || user.lng && user.lng === '') user.lng = 'English';
    let res =     await main(user.id, user.names, lng[user.lng].check_subscribes, 1, true);
    if (user.lng && user.lng !== '' && res === 'not_subscribe') continue;
    let direction = '<';
if (now_price > bid.btc_price) direction = '>';
if (user.lng === '' && user.locked_scores === 0) continue;
let text = lng[user.lng].crypto_bids_lost;
let btns = await keybord(user.lng, 'no');
let bid_scores = new Big(bid.scores);
    all_bids = all_bids.plus(bid_scores);
    if (bid.direction === direction) {
        winners_bids = winners_bids.plus(bid_scores);
        winners.push(bid);
        admin_text += `${user.names} выиграл, поставив ${bid.scores} баллов.
Курс BTC:
был: ${bid.btc_price}, Сейчас: ${now_price}`;
            continue;
} // you winn.
                 else {
                    await cbdb.removeCryptoBids(bid.id);
                    admin_text += `${user.names} проиграл, поставив ${bid.scores} баллов.
Курс BTC:
Был: ${bid.btc_price}, сейчас: ${now_price}`;                   
                    let locked_scores = parseFloat(new Big(user.locked_scores).minus(bid.scores));
                    if (locked_scores < 0) locked_scores = 0;
                    await udb.updateUserStatus(bid.id, user.names, user.prev_status, user.status, user.send_time, 0, -Math.abs(bid.scores));
                    await helpers.sleep(500);
                }
    text += lng[user.lng].crypto_bids_data(helpers.adaptiveFixed(bid.btc_price, 2), helpers.adaptiveFixed(now_price, 2), bid.direction, bid.scores);
    await botjs.sendMSG(bid.id, text, btns, false);
} // end if user.
        } // end for bids.

        for (let bid of winners) {
            let user = users[bid.id];
                        if (user && Object.keys(user).length > 0) {
                            let level = parseInt(new Big(user.scores).plus(new Big(user.locked_scores)).div(100))
                        if (level < 0) level = 0;
                            if (!user.lng || user.lng && user.lng === '') user.lng = 'English';
    let direction = '<';
if (now_price > bid.btc_price) direction = '>';
if (user.lng === '' && user.locked_scores === 0) continue;
    let text = lng[user.lng].crypto_bids_lost;
    let btns = await keybord(user.lng, 'no');
    let bid_scores = new Big(bid.scores);
    if (bid.direction === direction) {
        let bid_share = bid_scores.div(winners_bids);
        let scoreCalc = all_bids.times(bid_share);
        if (winners.length === bids.length) {
            const stakeLevel = Math.ceil(bid.scores / 100); // Уровень с округлением в большую сторону

const baseCoefficient = 1.5; // Начальное значение коэффициента
const maxLevel = 10; // Максимальный уровень, на котором коэффициент будет равен 1.05

let coefficient;
if (stakeLevel <= maxLevel) {
  const decayFactor = Math.pow(1.05 / baseCoefficient, 1 / maxLevel); // Фактор затухания для плавного спуска
  coefficient = baseCoefficient * Math.pow(decayFactor, stakeLevel);
} else {
  coefficient = 1.05; // Коэффициент равен 1.05 после максимального уровня
}

            scoreCalc = scoreCalc.times(coefficient);
        }
        let plus_amount = new Big(scoreCalc).minus(bid.scores);
        plus_amount = new Big(plus_amount).times(new Big(0.95).pow(level)).toFixed(2);
        let score = new Big(bid.scores).plus(plus_amount);
        let scores = parseFloat(new Big(user.scores).plus(score));
text = lng[user.lng].crypto_bids_winn(parseFloat(plus_amount), bid.scores, parseFloat(score));
let locked_scores = parseFloat(new Big(user.locked_scores).minus(bid.scores));
                if (locked_scores < 0) locked_scores = 0;
                await udb.updateUserStatus(bid.id, user.names, user.prev_status, user.status, user.send_time, score, -Math.abs(bid.scores));
                await helpers.sleep(500);
                await createRefererScores(score, user.referers);
            } // you winn.
    text += lng[user.lng].crypto_bids_data(helpers.adaptiveFixed(bid.btc_price, 2), helpers.adaptiveFixed(now_price, 2), bid.direction, bid.scores);
    await botjs.sendMSG(bid.id, text, btns, false);
    await cbdb.removeCryptoBids(bid.id);
} // end if user.
        } // end for bids.
        await botjs.sendMSG(conf.mg_bot.admins[0], admin_text, [], false);
await helpers.sleep(1000);
}

module.exports.main = main;
module.exports.futureTellingNotify = futureTellingNotify;
module.exports.addVizScores = addVizScores;
module.exports.scoresAward = scoresAward;
module.exports.cryptoBidsResults = cryptoBidsResults;