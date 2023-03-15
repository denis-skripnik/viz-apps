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
const ccdb = require(process.cwd() + "/databases/ccdb");
const helpers = require(process.cwd() + "/js_modules/helpers");
const conf = require(process.cwd() + "/config.json");
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

function countBullsAndCows(secret, suggestition) {
      let bulls = 0, cows = 0;
    suggestition = suggestition.toString();
    secret = secret.toString();
    let search_secret = secret;
    for (let i = 0; i < secret.length; i++) {
        if (suggestition[i] === secret[i]) {
          bulls++;
          let search_number = search_secret.indexOf(suggestition[i]);
          if (search_number > -1) {
search_number += 1;
search_secret = search_secret.substring(0, search_number - 1) + search_secret.substring(search_number, search_secret.length);
}
        }
      else if (search_secret.includes(suggestition[i])) {
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
        buttons = [[lng[lang].reytings, lng[lang].games, lng[lang].my_viz_login], [lng[lang].lang, lng[lang].help, lng[lang].partners]];
    } else if (variant === 'games') {
        buttons = [[lng[lang].fortune_telling, lng[lang].random_numbers, lng[lang].bk_game], [lng[lang].crypto_bids, lng[lang].home]];
    } else if (variant === 'bk_game') {
        buttons = [[lng[lang].bk_level + '1', lng[lang].bk_level + '2', lng[lang].bk_level + '3'], [lng[lang].games, lng[lang].home]];
    } else if (variant === 'reytings') {
        buttons = [[lng[lang].scores_top, lng[lang].artifacts_owners, lng[lang].home]]
    } else if (variant === 'fortune_telling') {
        buttons = [[lng[lang].ft_award, lng[lang].ft_standart, lng[lang].back]];
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
    await udb.updateUserStatus(referer.id, referer.names, referer.prev_status, referer.status, referer.send_time, new_scores);
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
        let level_k = 0;
    if (!user) {
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
await udb.addUser(id, names, '', '', 'start', send_time, 0, refs, id_hash, [], '', '');
} // end yes referer.
     else {
        await udb.addUser(id, names, '', '', 'start', send_time, 0, [not_refs], id_hash, [], '', '');
     } // end no referer.
} else { // end if no referer code in command.
        await udb.addUser(id, names, '', '', 'start', send_time, 0, [not_refs], id_hash, [], '', '');
    } // end if no referer in command.
    } // end if not user.
    else { // yes user.
        if (typeof message !== 'undefined' && user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].back) > -1 || user && user.lng && user.lng !== '' && message.indexOf(lng[user.lng].cancel) > -1) message = user.prev_status;
        let last_time = send_time - user.send_time;
        if (user.send_time && typeof user.send_time !== 'undefined' && last_time < 1000 && message !== lng[user.lng].home && message !== lng[user.lng].check_subscribes && message !== '/start') return;
        
        level = parseInt(new Big(user.scores).plus(new Big(user.locked_scores)).div(100))
        if (level < 0) level = 0;
        level_k = new Big(level).times(0.05);

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
        let text = lng[user.lng].home_message(user.names, referer, user.referer_code, user.scores, level, user.locked_scores);
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
        await botjs.sendMSG(id, text, btns, false, false, false);
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
        await botjs.sendMSG(id, text, btns, false, false, true);
        await udb.updateUserStatus(id, names, user.status, lng[user.lng].reytings, send_time);
    } else if (user && user.lng && message.indexOf(lng[user.lng].fortune_telling) > -1) {
        let ftq_data = await ftqdb.getHashById(id);
        let ft_works = 100 - user.ft_counter;
        let text = lng[user.lng].ft_text + ft_works;
                let btns = await keybord(user.lng, 'cancel');
                if (ftq_data && Object.keys(ftq_data).length > 0) {
    text = lng[user.lng].ft_no_work;
    btns = await keybord(user.lng, 'games');
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
        let btns = await keybord(user.lng, 'home');
        await botjs.sendMSG(id, text, btns, false);        
await ftqdb.updateHashData(hash, q, id);
} else if (user && user.lng && message.indexOf(lng[user.lng].ft_standart) > -1 && user.status.indexOf('ft_send') > -1) {
    let q = user.status.split('|')[1];
    var hash = crypto.createHash('md5').update(q).digest('hex');
    let number = await methods.randomWithHash(hash, bn, 2);

    let variant = lng[user.lng][number];
    let random_variant = await helpers.getRandomInRange(1, variant.length);
    
    let ft_result = variant[random_variant - 1];
    let score = await minusNumbers((number * 5), level_k);
if (score < 0) score = 0;
    score = await helpers.getRandomInRange(0, score);
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
} else if (user && user.lng && message.indexOf(lng[user.lng].random_numbers) > -1) {
    let text = lng[user.lng].rn_text;
            let btns = await keybord(user.lng, 'games_buttons');
    await botjs.sendMSG(id, text, btns, false);        
} else if (user && user.lng && message.indexOf(lng[user.lng].crypto_bids) > -1 || user && user.lng && message === '.bids' || user && user.lng && message === '.стк') {
    if (message === '.bids') message = lng[user.lng].crypto_bids;
    if (message === '.стк') message = lng[user.lng].crypto_bids;
    let end_bids_round = Math.ceil(bn / 100) * 100;
    if (bn >= end_bids_round - 50 && bn <= end_bids_round) {
        let end_round_block = 100 - (bn % 100);
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
    let bids = await cbdb.findCryptoBids(id);
    let btc_price = await cbdb.getBTCPrice();
    let text = lng[user.lng].yes_crypto_bid;
    let btns = await keybord(user.lng, 'games');
    if (btc_price && typeof btc_price !== 'undefined' && btc_price.price > 0 && bids.length === 0 && user.scores > 0) {
        let x =  await minusNumbers(2, level_k);
        if (x < 1.2) x = 1.2;
        let now_datetime = new Date(btc_price.timestamp).toLocaleString("ru-RU", {timeZone: "Europe/Moscow"});
        let [date, time] = now_datetime.split(', ');
        let [month, day, year] = date.split('/');
        let datetime = `${day}.${month}.${year} ${time.split(' AM')[0]} GMT+3`;
        text = lng[user.lng].crypto_bids_text(user.scores, btc_price.price, datetime, level, x);
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
            } else if (user && user.lng && message.indexOf(lng[user.lng].bk_level) > -1 && user.status.indexOf(lng[user.lng].bk_game) > -1) {
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
                                                            } else if (user && user.lng && message.indexOf(lng[user.lng].help) > -1) {
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
        await udb.updateUser(id, names, message, status, lng[message].home, send_time, user.referers, user.referer_code, user.artifacts, user.prize, user.viz_login);
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
                            let b = 0;
                            for (let n of message) {
                                let search_number = rn.indexOf(n);
                                if (search_number > -1) {
    b += 1;
    search_number += 1;
    rn = rn.substring(0, search_number - 1) + rn.substring(search_number, rn.length);
}
                                }
                                let score = await minusNumbers(b, level_k);
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
                                                                            if (bk_level === 2) bkl_for_scores = 2;
                                                                            if (bk_level === 3) bkl_for_scores = 5;
                                                                            let max_score = new Big(100).times(bkl_for_scores);
                                                                            let score_by_stap = max_score.div(max_staps);
                                                                            if (now_stap > max_staps) now_stap = max_staps;
                                                                            let no_steps = await minusNumbers(max_staps, now_stap, true);
                                                                            let staps_for_scores = new Big(1).plus(no_steps);
let level_percent = await minusNumbers(1, level_k, true);
if (level_percent.lt(0)) level_percent = new Big(0);
let score = score_by_stap.times(staps_for_scores).times(level_percent);
                                                                           
let score_number = parseFloat(score.toString());
let scores = user.scores;
                                                                            scores = await sumNumbers(scores, score);
                                                                            text = lng[user.lng].bk_gameing_text(game.number, now_stap, score_number, scores);
                                                                            await udb.updateUserStatus(id, names, user.prev_status, user.status, send_time, parseFloat(score_number));                                
                                                                                                            await createRefererScores(score_number, user.referers);
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
    let end_bids_round = Math.ceil(bn / 100) * 100;
    if (bn >= end_bids_round - 50 && bn <= end_bids_round) {
        let end_round_block = 100 - (bn % 100);
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
                        if (!isNaN(message) && parseFloat(message) <= user.scores && new Big(message).gte(0.001)) {
                            await udb.updateUserStatus(id, names, user.status, `cb_direction|${message}|${price}`, send_time);
    text = lng[user.lng].crypto_bids_direction;
    btns = await keybord(user.lng, 'bids_direction');
}
await botjs.sendMSG(id, text, btns, false);
} else if (user && user.lng && lng[user.lng] && user.status.indexOf('cb_direction|') > -1) {
    let end_bids_round = Math.ceil(bn / 100) * 100;
    if (bn >= end_bids_round - 50 && bn <= end_bids_round) {
        let end_round_block = 100 - (bn % 100);
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
let user_scores = user.scores;
user_scores = await minusNumbers(user_scores, scores);
let locked_scores = parseFloat(new Big(user.locked_scores).plus(scores));
await udb.updateUserStatus(id, names, user.status, lng[user.lng].games, send_time, -Math.abs(scores), scores);
}

await botjs.sendMSG(id, text, btns, false);
} else if (user && user.lng && lng[user.lng] && user.status === lng[user.lng].my_viz_login) {
    let viz_login = message.toLowerCase();
    let get_account = await methods.getAccount(viz_login);
    let text = lng[user.lng].not_account;
    if (get_account && get_account.length > 0) {
        text = lng[user.lng].account_added;
        await udb.updateUser(id, names, user.lng, user.prev_status, user.status, send_time, user.referers, user.referer_code, user.artifacts, user.prize, viz_login);
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
        let level_k = new Big(level).times(0.05);
        let score = await minusNumbers((number * 10), level_k);
        if (score < 0) score = 0;
        score = await helpers.getRandomInRange(0, score);
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
await botjs.sendMSG(msg.id, msg.text, btns, false, true);
}
}
}

async function cryptoBidsResults() {
    await helpers.sleep(1000);
    let responce = await ccdb.getCoinsByIds(['bitcoin']);
    let now_price = responce[0].current_price;
    let time_has_passed = new Date().getTime() - responce[0].updated;
    if (!now_price || typeof now_price === 'undefined' || responce && responce.length > 0 && time_has_passed >= 300000) return;
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
await botjs.sendMSG(user.id, lng[user.lng].new_bids_round, btns, false, true);
}


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
let price_difference = await minusNumbers(now_price, bid.btc_price, true);
let change_percent = price_difference.div(new Big(bid.btc_price));
if (user.lng === '' && user.locked_scores === 0) continue;
    let text = lng[user.lng].crypto_bids_lost;
    let btns = await keybord(user.lng, 'no');
    if (bid.direction === direction) {
let level = parseInt(new Big(user.scores).plus(bid.scores).div(100))
if (level < 0) level = 0;
let level_k = new Big(level).times(0.05);
        let x =  await minusNumbers(2, level_k)
        if (x < 1.2) x = 1.2;
        let score = new Big(bid.scores).times(x);
        let scores = parseFloat(new Big(user.scores).plus(score));
        text = lng[user.lng].crypto_bids_winn(x);
        admin_text += `${user.names} выиграл, поставив ${bid.scores} баллов.
Курс BTC:
был: ${bid.btc_price}, Сейчас: ${now_price}`;
                let locked_scores = parseFloat(new Big(user.locked_scores).minus(bid.scores));
                if (locked_scores < 0) locked_scores = 0;
                await udb.updateUserStatus(bid.id, user.names, user.prev_status, user.status, user.send_time, score, -Math.abs(bid.scores));
                await helpers.sleep(500);
                await createRefererScores(score, user.referers);
            } // you winn.
                 else {
                    admin_text += `${user.names} проиграл, поставив ${bid.scores} баллов.
Курс BTC:
Был: ${bid.btc_price}, сейчас: ${now_price}`;                   
                    let locked_scores = parseFloat(new Big(user.locked_scores).minus(bid.scores));
                    if (locked_scores < 0) locked_scores = 0;
                    await udb.updateUserStatus(bid.id, user.names, user.prev_status, user.status, user.send_time, 0, -Math.abs(bid.scores));
                    await helpers.sleep(500);
                }
    text += lng[user.lng].crypto_bids_data(bid.btc_price, now_price, bid.direction, bid.scores);
    await botjs.sendMSG(bid.id, text, btns, false);
    await cbdb.removeCryptoBids(bid.id);
} // end if user.
        }
await botjs.sendMSG(conf.mg_bot.admins[0], admin_text, [], false);
await helpers.sleep(1000);
}

module.exports.main = main;
module.exports.futureTellingNotify = futureTellingNotify;
module.exports.scoresAward = scoresAward;
module.exports.cryptoBidsResults = cryptoBidsResults;