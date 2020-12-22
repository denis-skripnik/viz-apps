const conf = require(process.cwd() + "/config.json");
const TeleBot = require('telebot');
const bot = new TeleBot(conf.awards_bot.api_key);
bot.start();
const udb = require(process.cwd() + "/databases/awards_bot/usersdb");
const methods = require("../methods");

Array.prototype.remove = function(value) {
    var idx = this.indexOf(value);
    if (idx != -1) {
        // Второй параметр - число элементов, которые необходимо удалить
        return this.splice(idx, 1);
    }
    return false;
}

async function ru_keybord(variant) {
    let replyMarkup;
    if (variant === 'standart') {
    replyMarkup = bot.keyboard([
        ["справка", "О боте"],
        ["Подписки", "Поддержка"],
], {resize: true});
} else if (variant === 'admin') {
replyMarkup = bot.keyboard([
        ["Да"],
], {resize: true});
    } else if (variant === 'lang') {
        replyMarkup = bot.keyboard([
            ["Eng", "Ru"],
    ], {resize: true});
} else if (variant === '') {
    replyMarkup = bot.keyboard([
        ["Отмена"],
], {resize: true});
}
var buttons = {
    webPreview: false,
    parseMode: 'Html',
    replyMarkup};
    return buttons;
}

async function eng_keybord(variant) {
    let replyMarkup;
    if (variant === 'standart') {
replyMarkup = bot.keyboard([
                    ["help", "about"],
                    ["subscribes", "support"],
        ], {resize: true});
    } else if (variant === 'admin') {
        replyMarkup = bot.keyboard([
            ["yes"],
], {resize: true});
        } else if (variant === 'lang') {
            replyMarkup = bot.keyboard([
                ["Eng", "Ru"],
    ], {resize: true});
} else if (variant === '') {
    replyMarkup = bot.keyboard([
        ["Cancel"],
], {resize: true});
}
    var buttons = {
        disable_web_page_preview: true,
        parseMode: 'Html',
        replyMarkup};
    return buttons;
    }

    async function sendMSG(userId, text, type, lang) {
        try {
        if (lang === 'Ru') {
let keybord = await ru_keybord(type);
await bot.sendMessage(userId, text, keybord);
} else if (lang === 'Eng') {
            let keybord = await eng_keybord(type);
            await bot.sendMessage(userId, text, keybord);
} else {
    let keybord = await eng_keybord(type);
    await bot.sendMessage(userId, text, keybord);
}
} catch(e) {
console.error(e);
    if (e.error_code === 403) {
await udb.removeUser(userId);
}
}
}

async function startCommand() {
bot.on(/start|старт/, async function (msg, match) {
    var userId = msg.from.id;
    var username = msg.from.username;

const user = await udb.getUser(userId);
if (!user) {
await udb.addUser(userId, username, [], [], 0, "");
    }
                      
let text = `Hello @${username}! I am a bot that notifies you of awards received by logins you are subscribed to.
Please select a language by clicking on one of the buttons below.

/help - list of commands

Привет, @${username}! Я - бот, уведомляющий о наградах логинам, на которых вы подписались.
Пожалуйста, выберите язык, нажав на одну из кнопок ниже.

/help - Список команд.`;
                        await sendMSG(userId, text, 'lang', 'eng');
});
}

async function awardMSG(award) {
let benef_arr = [];
let receive_arr = [];
for (let get_award of award) {
    if (get_award.type === 'benefactor_award') {
    let benef_awards = get_award.data;
    let ru_custom_sequence;
    let eng_custom_sequence;
    let ru_memo;
    let eng_memo;
    if (benef_awards.custom_sequence > 0) {
            ru_custom_sequence = `, номер custom операции, за которую была награда сделана (Может содержать любое число): ${benef_awards.custom_sequence}`;
            eng_custom_sequence = `, number of custom operation that got the award: ${benef_awards.custom_sequence}`;
        } else {
            ru_custom_sequence = '';
eng_custom_sequence = '';
        }
            if (benef_awards.memo) {
            ru_memo = `, заметка (memo): ${benef_awards.memo}`;
            eng_memo = `, note (memo): ${benef_awards.memo}`;
        } else {
            ru_memo = '';
eng_memo = '';
        }
        let initiator = benef_awards.initiator;   
        let benefactor = benef_awards.benefactor;
    let benef_shares = parseFloat(benef_awards.shares);
    benef_shares = benef_shares.toFixed(3) + ' Ƶ в соц. капитал';

    let ru_benef_text = `<a href="https://info.viz.plus/accounts/${benefactor}">${benefactor}</a> получил бенефициарские от <a href="https://info.viz.plus/accounts/${initiator}/">${initiator}</a> на ${benef_shares}${ru_custom_sequence} ${ru_memo}`;
    let eng_benef_text = `user <a href="https://info.viz.plus/accounts/${benefactor}">${benefactor}</a> received beneficiary awards  from <a href="https://info.viz.plus/accounts/${initiator}/">${initiator}</a> on the ${benef_shares}${eng_custom_sequence} ${eng_memo}`;
benef_arr.push({benefactor: benefactor, ru: ru_benef_text, eng: eng_benef_text});
    } else if (get_award.type === 'receive_award') {
        let receive_awards = get_award.data;
        let initiator = receive_awards.initiator;
        let receiver = receive_awards.receiver;
        let receiver_shares = parseFloat(receive_awards.shares);
        receiver_shares = receiver_shares.toFixed(3) + ' Ƶ в соц. капитал';
        let ru_custom_sequence;
        let eng_custom_sequence;
        let ru_memo;
        let eng_memo;
                    if (receive_awards.custom_sequence > 0) {
                ru_custom_sequence = `, номер custom операции, за которую была награда сделана: ${receive_awards.custom_sequence}`;
                eng_custom_sequence = `, number of custom operation that got the award: ${receive_awards.custom_sequence}`;
            } else {
                ru_custom_sequence = '';
                eng_custom_sequence = '';
            }
                if (receive_awards.memo) {
                    ru_memo = `, заметка (memo): ${receive_awards.memo}`;
                    eng_memo = `, Note (memo): ${receive_awards.memo}`;
            } else {
                ru_memo = '';
                eng_memo = '';
            }

            let ru_receive_text = `<a href="https://dpos.space/viz/profiles/${initiator}">${initiator}</a> наградил <a href="https://dpos.space/viz/profiles/${receiver}">${receiver}</a> на ${receiver_shares}${ru_custom_sequence} ${ru_memo}`;
let eng_receive_text = `<a href="https://dpos.space/viz/profiles/${initiator}">${initiator}</a> awarded <a href="https://dpos.space/viz/profiles/${receiver}">${receiver}</a> with ${receiver_shares}${eng_custom_sequence} ${eng_memo}`;
                    receive_arr.push({receiver: receiver, ru: ru_receive_text, eng: eng_receive_text});
    }
}

    const user_info = await udb.findAllUsers();
    if (user_info) {
let ok_count = 0;
        for (let user in user_info) {
let receive_msg = [];
    let benef_msg = [];
    let ru_text = ``;
let eng_text = ``;
let ru_receive_list = ``;
let eng_receive_list = ``;
let get_ru_beneficiaries = ``;
let get_eng_beneficiaries = ``;
if (receive_arr.length > 0) {
for (receive of receive_arr) {
    if (user_info[user].subscribe && user_info[user].subscribe.length >= 0 && !user_info[user].subscribe.includes(receive.receiver) && !user_info[user].subscribe.includes('all')) continue;
    if (user_info[user].stopped && user_info[user].stopped.length != 0 && user_info[user].stopped.includes(receive.receiver)) continue;
    receive_msg.push(true);
        ru_receive_list += receive.ru + `, `;
        eng_receive_list += receive.eng + `, `;
}
ru_receive_list = ru_receive_list.replace(/,\s*$/, ""); 
eng_receive_list = eng_receive_list.replace(/,\s*$/, ""); 
}

if (benef_arr.length > 0) {
for (let benef_data of benef_arr) {
            if (user_info[user].subscribe && user_info[user].subscribe.length >= 0 && !user_info[user].subscribe.includes(benef_data.benefactor) && !user_info[user].subscribe.includes('all')) continue;
            if (user_info[user].stopped && user_info[user].stopped.length != 0 && user_info[user].stopped.includes(benef_data.benefactor)) continue;
            benef_msg.push(true);
                get_ru_beneficiaries += benef_data.ru + `, `;
                get_eng_beneficiaries += benef_data.eng + `, `;
    }
    get_ru_beneficiaries = get_ru_beneficiaries.replace(/,\s*$/, ""); 
    get_eng_beneficiaries = get_eng_beneficiaries.replace(/,\s*$/, "");
}

if (receive_msg.includes(true)) {
    ru_text += `${ru_receive_list}
`;
    eng_text += `${eng_receive_list}
    `;
}
if (benef_msg.includes(true)) {
    ru_text += `${get_ru_beneficiaries}
    `;
    eng_text += `${get_eng_beneficiaries}
    `;
}

if (receive_msg.includes(true) || benef_msg.includes(true)) {
if (user_info[user].lang === 'Ru') {
        await sendMSG(user_info[user].uid, ru_text, 'standart', 'Ru');
    } else if (user_info[user].lang === 'Eng') {
 await sendMSG(user_info[user].uid, eng_text, 'standart', 'Eng');
}
} else if (receive_msg.includes(true) && benef_msg.includes(true)) {
    if (user_info[user].lang === 'Ru') {
                await sendMSG(user_info[user].uid, ru_text, 'standart', 'Ru');
    } else if (user_info[user].lang === 'Eng') {
 await sendMSG(user_info[user].uid, eng_text, 'standart', 'Eng');
}
}
ok_count += 1;
}
return ok_count;
}
}

async function aboutCommand() {
bot.on(/about|^О боте/i, async function (msg, match) {
    var userId = msg.from.id;
    var username = msg.from.username;
    const user = await udb.getUser(userId);
    if(user) {
        if (user.lang === 'Ru') {
            let text = `Что такое @viz_awards_bot?
Это бот, который уведомляет о наградах и бенефициарских пользователям, на которых вы подписаны.
Награда (award) - операция в VIZ. Позволяет награждать кого угодно за что угодно.
Бенефициары (beneficiaries), Бенефициарская награда (benefactor_award) - это вознаграждение тем, кого указал отправитель награды помимо получателя.
Автором бота является незрячий программист @skripnikdenis. На Viz логин https://info.viz.plus/accounts/denis-skripnik.
Помимо этого бота есть и другие:
@viz_committee_bot - уведомляет о заявках в комитете,
<a href="https://dpos.space/viz/awards">Форма для отправки наград</a>
<a href="https://dpos.space/viz/profiles/denis-skripnik/witness">Делегат в Viz</a>.`;
await sendMSG(userId, text, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
    let text = `What is @viz_awards_bot?

This is a bot that notifies you about awards and beneficiaries received by users you are subscribed to.

Award is an operation in VIZ. Allows you to award anyone for anything.
The beneficiaries get benefactor_award – it is an award to those indicated by the sender of the award besides the recipient.

The author of the bot is a blind programmer @skripnikdenis. His Viz login is https://info.viz.plus/accounts/denis-skripnik.
In addition to this bot, there are a couple of others:
@viz_committee_bot – notifies of requests in the committee,
<a href="https://viz.dpos.space/awards/en/form.html">Form for awards</a>
<a href="https://dpos.space/viz/profiles/denis-skripnik/witness">His witness</a>.`;
await sendMSG(userId, text, 'standart', 'Eng');
}
}
});
}

async function subscribeCommand() {
            bot.on(/^sub (.+)/i, async function (msg, props) {
                var fromId = msg.from.id;
                var username = msg.from.username;
                var sb = props.match[1].toLowerCase();
                if (sb.indexOf(',') > -1) {
                    var sp = sb.split(',');
                } else {
                var sp = [sb];
                }

                try {
                const result = await methods.getAccounts(sp);
var vl = [];
                    result.forEach(async function(viz_login) {
vl.push(viz_login.name);
});

                    if (vl.length > 0) {
    const user = await udb.getUser(fromId);
                if(user) {
            var user_subscribes = [];
            vl.forEach(async function (sub_user) {
            if (user.subscribe && !user.subscribe.includes(sub_user)) {
                        user_subscribes = user.subscribe;
                                user_subscribes.push(sub_user);
                    } else if (!user.subscribe) {
                        user_subscribes.push(sub_user);
                    } else if (user.subscribe && user.subscribe.includes(sub_user)) {
                        user_subscribes = user.subscribe;
                   }
                });
             
                var vl_str = vl.join(',');

                   const res = await udb.updateUser(fromId, username, user_subscribes, user.stopped, 0, user.lang);
                   if (res) {
if (user.lang === 'Ru') {
    let text
    if (user.subscribe.includes('all')) {
text = `Вы успешно подписались на получение уведомлений о наградах всех пользователей.

/help - список команд.`;
    } else {
text = `Вы успешно подписались на получение уведомлений о наградах пользователей ${vl_str}.

/help - список команд.`;
    }
await sendMSG(fromId, text, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
    let text;
    if (user.subscribe.includes('all')) {
    text = `you have successfully subscribed to receive reward notifications for all users.

/help - list of commands.`;
    } else {
        text = `you have successfully subscribed to receive reward notifications for ${vl_str} users.

/help - list of commands.`;
    }
    await sendMSG(fromId, text, 'standart', 'Eng');
}
                }
}
                } else {
                    const user = await udb.getUser(fromId);
                    if(user) {
                        if (user.lang === 'Ru') {
                        let text = 'Ошибка: Пользователь не существует.';
                        await sendMSG(fromId, text, 'standart', 'Ru');
                    } else if (user.lang === 'Eng') {
                        let text = ' Error: User does not exist.';                
                        await sendMSG(fromId, text, 'standart', 'Eng');
                    }
                }
                }
                } catch(e) {
                    const user = await udb.getUser(fromId);
                    if(user) {
   
                    if (user.lang === 'Ru') {
                    let text = 'Ошибка: ' + e;
                    await sendMSG(fromId, text, 'standart', 'Ru');
                } else if (user.lang === 'Eng') {
                    let text = ' Error: ' + e;
                    await sendMSG(fromId, text, 'standart', 'Eng');
                }
            }    
            }
                });
            }

            async function unsubscribeCommand() {
                bot.on(/^unsub (.+)/i, async function (msg, props) {
                    var fromId = msg.from.id;
                    var username = msg.from.username;
                    var sb = props.match[1].toLowerCase();
                    if (sb.indexOf(',') > -1) {
                        var sp = sb.split(',');
                    } else {
                    var sp = [sb];
                    }

                    const user = await udb.getUser(fromId);
                if(user) {
                    var user_subscribes = [];
                        sp.forEach(async function (sub_user) {
                    if (user.subscribe && user.subscribe.includes(sub_user)) {
                        user_subscribes = user.subscribe;
                                                user_subscribes.remove(sub_user);
                    }
                });
                    
                    if (user_subscribes) {
                        const res = await udb.updateUser(fromId, username, user_subscribes, user.stopped, 0, user.lang);
                        if (res) {
                            if (user.lang === 'Ru') {
                            let text = `Вы отписались от уведомлений о получении наград пользователей ${sb}.

/help - список команд.`;
await sendMSG(fromId, text, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
                                let text = `you have unsubscribed from the ${sb} user reward notifications.

/help - list of commands.`;
                                await sendMSG(fromId, text, 'standart', 'Eng');
                            }
                }
                } else {
if (user.lang === 'Ru') {
                    let text = `Пользователей ${sp} нет в списке ваших подписок.

/help - список команд.`;
await sendMSG(fromId, text, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
    let text = `${sp} Users are not in your subscription list.

/help - list of commands.`;
    await sendMSG(fromId, text, 'standart', 'Eng');
}
                }
            }
                    });
                }

                async function subscribesCommand() {
                        bot.on(/subscribes|Подписки/i, async function (msg, match) {
                            var fromId = msg.from.id;
                            var username = msg.from.username;
                        
const user = await udb.getUser(fromId);
            if (user && user.subscribe) {
            var subscribes = '';
                user.subscribe.forEach(async function (subscribe_el) {
            subscribes += subscribe_el + ',';
            });
            subscribes = subscribes.replace(/,\s*$/, "");
            if (user.lang === 'Ru') {
let text = `Ваши подписки:

${subscribes}

/help - список команд.`;
await sendMSG(fromId, text, 'standart', 'Ru');
            } else if (user.lang === 'Eng') {
                let text = `Your subscriptions:

${subscribes}

/help - list of commands.`;
await sendMSG(fromId, text, 'standart', 'Eng');
            }
                                        } else {
if (user.lang === 'Ru') {
                                            let text = `Вы не подписывались.

/help - список команд.`;
await sendMSG(fromId, text, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
    let text = `you have not subscribed.

/help - list of commands.`;
await sendMSG(fromId, text, 'standart', 'Eng');
}
                                                                           }
            });
        }

        async function addStopCommand() {
            bot.on(/^add_stop (.+)/i, async function (msg, props) {
                var fromId = msg.from.id;
                var username = msg.from.username;
                var sb = props.match[1].toLowerCase();
                if (sb.indexOf(',') > -1) {
                    var sp = sb.split(',');
                } else {
                var sp = [sb];
                }
try {
const result = await methods.getAccounts(sp);
var vl = [];
                    result.forEach(async function(viz_login) {
vl.push(viz_login.name);
});

                    if (vl.length > 0) {
    const user = await udb.getUser(fromId);
                if(user) {
            var user_stopped = [];
            vl.forEach(async function (sub_user) {
            if (user.stopped && !user.stopped.includes(sub_user)) {
                        user_stopped = user.stopped;
                                user_stopped.push(sub_user);
                    } else if (!user.stopped) {
                        user_stopped.push(sub_user);
                    } else if (user.stopped && user.stopped.includes(sub_user)) {
                        user_stopped = user.stopped;
                   }
                });
             
                var vl_str = vl.join(',');

                   const res = await udb.updateUser(fromId, username, user.subscribe, user_stopped, 0, user.lang);
                   if (res) {
if (user.lang === 'Ru') {
                    let text = `Теперь вы не будете получать уведомления о наградах пользователям ${vl_str}.
/help - список команд.`;
await sendMSG(fromId, text, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
    let text = `Now you will not receive notification of the awards to users ${vl_str}.
/help - list of commands.`;
    await sendMSG(fromId, text, 'standart', 'Eng');
}
                }
}
                    }                     else {
                        const user = await udb.getUser(fromId);
                        if(user) {
       
                        if (user.lang === 'Ru') {
                            let text = 'Ошибка: Пользователь не существует.';
                            await sendMSG(fromId, text, 'standart', 'Ru');
                        } else if (user.lang === 'Eng') {
                            let text = ' Error: User does not exist.';                
                            await sendMSG(fromId, text, 'standart', 'Eng');
                        }
                    }
                }
                } catch(e) {
    const user = await udb.getUser(fromId);
                if(user) {
    if (user.lang === 'Ru') {
                    let text = 'Ошибка: ' + e;
                    await sendMSG(fromId, text, 'standart', 'Ru');
                } else if (user.lang === 'Eng') {
                    let text = ' Error: ' + e;
                    await sendMSG(fromId, text, 'standart', 'Eng');
                }
            }
            }
                });
            }

            async function delStopCommand() {
                bot.on(/^del_stop (.+)/i, async function (msg, props) {
                    var fromId = msg.from.id;
                    var username = msg.from.username;
                    var sb = props.match[1].toLowerCase();
                    if (sb.indexOf(',') > -1) {
                        var sp = sb.split(',');
                    } else {
                    var sp = [sb];
                    }

                    const user = await udb.getUser(fromId);
                if(user) {
                    var user_stopped = [];
                        sp.forEach(async function (sub_user) {
                    if (user.stopped && user.stopped.includes(sub_user)) {
                        user_stopped = user.stopped;
                                                user_stopped.remove(sub_user);
                    }
                });
                    
                    if (user_stopped) {
                        const res = await udb.updateUser(fromId, username, user.subscribe, user_stopped, 0, user.lang);
                        if (res) {
                            if (user.lang === 'Ru') {
                            let text = `Теперь вы будете получать уведомления о наградах пользователям ${sb}.

/help - список команд.`;
await sendMSG(fromId, text, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
                                let text = `You will now receive notification of the awards to the users. ${sb}.

/help - list of commands.`;
                                await sendMSG(fromId, text, 'standart', 'Eng');
                            }
                }
                } else {
if (user.lang === 'Ru') {
                    let text = `Пользователей ${sp} нет в списке ваших запрещённых к отправке уведомлений.

/help - список команд.`;
await sendMSG(fromId, text, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
    let text = `${sp} Users are not in your stop-list.

/help - list of commands.`;
    await sendMSG(fromId, text, 'standart', 'Eng');
}
                }
            }
                    });
                }

                async function stoppedCommand() {
                        bot.on(/stopped|Остановленные/i, async function (msg, match) {
                            var fromId = msg.from.id;
                            var username = msg.from.username;
                        
const user = await udb.getUser(fromId);
            if (user && user.stopped) {
            var stopped = '';
                user.stopped.forEach(async function (stopped_el) {
            stopped += stopped_el + ',';
            });
            stopped = stopped.replace(/,\s*$/, "");
            if (user.lang === 'Ru') {
let text = `Список пользователей, о наградах которых не будут приходить уведомления:
${stopped}
/help - список команд.`;
await sendMSG(fromId, text, 'standart', 'Ru');
            } else if (user.lang === 'Eng') {
                let text = `The list of users about awards of which will not come notified:

${stopped}

/help - list of commands.`;
await sendMSG(fromId, text, 'standart', 'Eng');
            }
                                        } else {
if (user.lang === 'Ru') {
                                            let text = `У вас нет пользователей, уведомлений для которых вы не хотите получать.

/help - список команд.`;
await sendMSG(fromId, text, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
    let text = `you have not filtered users.

/help - list of commands.`;
await sendMSG(fromId, text, 'standart', 'Eng');
}
                                                                           }
            });
        }

        async function adminCommand() {
            bot.on(/admin ((.|\n)+)/m, async function (msg, props) {
            var fromId = msg.from.id;
            var username = msg.from.username;
            var resp = props.match[1];
            if (fromId === conf.awards_bot.admin_id) {
            const user_info = await udb.findAllUsers();
            if (user_info) {
            user_info.forEach(async function (user) {
            if (user.lang === 'Ru') {
                let text = resp + `

Если вы получили сообщение, просьба нажать на /yes или ввести
            Да
Также вы можете нажать на одноимённую кнопку.

Надо убедиться, что вы получили это сообщение.`;
            await sendMSG(user['uid'], text, 'admin', 'Ru');
            } else if (user.lang === 'Eng') {
                let text = resp + `

If you receive a message, please click /yes or enter
                             Yes
You can also click on the button with the same name.
                
                We need to make sure you received this message.`;
            await sendMSG(user['uid'], text, 'admin', 'Eng');
            }
        });
            }
                            }
                        });
                    }
            
        async function yesCommand() {
       bot.on(/yes|Да/i, async function (msg, match) {
var fromId = msg.from.id;
        var fromLogin = msg.from.username;
let textTo = `Пользователь Telegram @${fromLogin} подтвердил получение вашего сообщения.`;
await sendMSG(conf.awards_bot.admin_id, textTo, 'standart');
const user = await udb.getUser(fromId);
            if (user) {
if (user.lang === 'Ru') {
                let textFrom = `Благодарю за подтверждение. Оно отправлено успешно.`;
await sendMSG(fromId, textFrom, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
    let textFrom = `Thank you for your confirmation. It was sent successfully.`;
    await sendMSG(fromId, textFrom, 'standart', 'Eng');
}
}
});
    }

    async function supportCommand() {
        bot.on(/support|^Поддержка/i, async function (msg, match) {
            var fromId = msg.from.id;
            var username = msg.from.username;

const user = await udb.getUser(fromId);
                if(user) {

                       const res = await udb.updateUser(fromId, username, user.subscribe, user.stopped, 1, user.lang);
                if (res) {
if (user.lang === 'Ru') {
                    let text = 'Введите пожалуйста сообщение создателю бота.';
                    await sendMSG(fromId, text, '', 'Ru');
} else if (user.lang === 'Eng') {
    let text = `please Enter a message to the Creator of the bot.`;
    await sendMSG(fromId, text, '', 'Eng');
}
                }
        }
    });
    }

    async function nullSupportCommand() {
                        bot.on('text', async (msg) => {
                var fromId = msg.from.id;
                var username = msg.from.username;
  if (msg.text !== 'Поддержка' && msg.text !== 'support') {
                const user = await udb.getUser(fromId);
switch(user.state) {
case 1:
const update_user = await udb.updateUser(fromId, username, user.subscribe, user.stopped, 0, user.lang);
if (update_user) {
let textTo = `Пользователь @${username} оставил сообщение в #поддержка:

${msg.text}`;
await sendMSG(conf.awards_bot.admin_id, textTo, 'standart');
if (user.lang === 'Ru') {
let textFrom = `Благодарю. Сообщение успешно отправлено.`;
await sendMSG(fromId, textFrom, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
    let textFrom = 'Thank you. The message was successfully sent.';
    await sendMSG(fromId, textFrom, 'standart', 'Eng');
}
               }
    break;
}
                        }
});
    }

    async function helpCommand() {
        bot.on(/help|справка/i, async function (msg, match) {
            var userId = msg.from.id;
            var username = msg.from.username;
        
            const user = await udb.getUser(userId);
            if(user) {
if (user.lang === 'Ru') {
        let text = `Список команд:

sub login1,login2... - Подписаться на получение уведомлений о наградах пользователям login1 и login2
unsub login1,login2 - отписка от этих уведомлений.
Подписки - список тех, чьи награды и беники получаете.
Чтобы получать все уведомления, отпишитесь от всех логинов.
add_stop login1,login2 - 1 или несколько логинов пользователей, уведомления о которых вы не хотите получать (актуально, если ни на кого не подписывались).
del_stop login3,login4,login5 - удаление пользователей из списка запрещённых для уведомлений.
stopped - список таких пользователей (СМ. команды выше).
/support - Поддержка - написать создателю бота.    
/about - О боте.`;
        await sendMSG(userId, text, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
    let text = `List of commands:

sub login1, login2 ... – Subscribe to receive notifications of awards received by users login1 and login2
unsub login1, login2 – unsubscribe from these notifications.
Subscriptions – a list of those who sent you awards and beneficiaries.
To receive all notifications, unsubscribe from all of the logins.
add_stop login1,login2 - 1 or several the user logins, notifications you don't want to (useful if no one else had signed up)
del_stop login3,login4,login5 - remove users from the list of prohibited for the notifications.
stopped - a list of such users (see commands above).
/support – write a message to the bot creator.
/about – info about this bot`;
    await sendMSG(userId, text, 'standart', 'Eng');
}
            }
    });
        }
        
        async function langRuCommand() {
            bot.on(/Ru/i, async function (msg, match) {
                var fromId = msg.from.id;
                var username = msg.from.username;
    
    const user = await udb.getUser(fromId);
                    if(user) {
                           const res = await udb.updateUser(fromId, username, user.subscribe, user.stopped, 0, "Ru");
                    if (res) {
    let text = `Выбран язык: Русский.

/help - Список команд.`;
    await sendMSG(fromId, text, 'standart', 'Ru');
                    }
            }
        });
        }
    
        async function langEngCommand() {
            bot.on(/Eng/i, async function (msg, match) {
                var fromId = msg.from.id;
                var username = msg.from.username;
    
    const user = await udb.getUser(fromId);
                    if(user) {
                           const res = await udb.updateUser(fromId, username, user.subscribe, user.stopped, 0, "Eng");
                    if (res) {
    let text = `Selected language: English.

/help    - list of commands.`;
    await sendMSG(fromId, text, 'standart', 'Eng');
                    }
            }
        });
        }
    
async function langNotifyMSG() {
    const user_info = await udb.findAllUsers();
    if (user_info) {
for (let user in user_info) {
if (!user_info[user].lang || user_info[user].lang === "") {
    const res = await udb.updateUser(user_info[user]['uid'], user_info[user]['username'], user_info[user]['subscribe'], user_info[user]['stopped'], 0, "yes_no");
    let text = `Please select your language. The bot does not know in what language to send you notifications.
Выберите язык, пожалуйста. Бот пока не знает, на каком языке присылать вам уведомления.`;
await sendMSG(user_info[user]['uid'], text, 'lang', '');
}
}
    }
}

async function cancelCommand() {
    bot.on(/Cancel|Отмена/i, async function (msg, match) {
        var fromId = msg.from.id;
        var username = msg.from.username;
        
        const user = await udb.getUser(fromId);
switch(user.state) {
case 1:
const update_user = await udb.updateUser(fromId, username, user.subscribe, user.stopped, 0, user.lang);
if (update_user) {
if (user.lang === 'Ru') {
let textFrom = `Сообщение в поддержку отменено.`;
await sendMSG(fromId, textFrom, 'standart', 'Ru');
} else if (user.lang === 'Eng') {
let textFrom = 'Sending a message to support has been canceled.';
await sendMSG(fromId, textFrom, 'standart', 'Eng');
}
       }
break;
}
});
}

module.exports.startCommand = startCommand;
module.exports.awardMSG = awardMSG;
module.exports.aboutCommand = aboutCommand;
module.exports.adminCommand = adminCommand;
module.exports.subscribeCommand = subscribeCommand;
module.exports.unsubscribeCommand = unsubscribeCommand;
module.exports.subscribesCommand = subscribesCommand;
module.exports.addStopCommand = addStopCommand;
module.exports.delStopCommand = delStopCommand;
module.exports.stoppedCommand = stoppedCommand;
module.exports.yesCommand = yesCommand;
module.exports.supportCommand = supportCommand;
module.exports.nullSupportCommand = nullSupportCommand;
module.exports.helpCommand = helpCommand;
module.exports.langEngCommand = langEngCommand;
module.exports.langRuCommand = langRuCommand;
module.exports.langNotifyMSG = langNotifyMSG;
module.exports.cancelCommand = cancelCommand;