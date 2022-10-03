const conf = require(process.cwd() + "/config.json");
const { Bot } = require("grammy");
const bot = new Bot(conf.committee_bot.api_key);
bot.start();
const udb = require(process.cwd() + "/databases/committee_bot/usersdb");
const cdb = require(process.cwd() + "/databases/committee_bot/committeedb");
const methods = require("../methods");
const helpers = require("../helpers");

async function ru_keybord(variant, params) {
    let reply_markup;
    if (variant === 'standart') {
        reply_markup = {keyboard: [["Список заявок", "Поддержка"]], resize_keyboard: true};
} else if (variant === 'application' && params !== 'no') {
    reply_markup = {keyboard: [
    ["Как проголосовать за заявку " + params + " в боте", "Список заявок", "Поддержка"],
], resize_keyboard: true};
} else if (variant === 'admin') {
    reply_markup = {keyboard: [
        ["Да"],
], resize_keyboard: true};
    } else if (variant === 'lang') {
        reply_markup = {keyboard: [
            ["Eng", "Ru"],
    ], resize_keyboard: true};
}
var buttons = {
    parse_mode: 'HTML',
    webPreview: false,
    reply_markup};
    return buttons;
}

async function eng_keybord(variant, params) {
    let reply_markup;
    if (variant === 'standart') {
        reply_markup = {keyboard: [["List of applications", "Support"]], resize: true};
} else if (variant === 'application' && params !== 'no') {
    reply_markup = {keyboard: [
    ["How to vote for an application " + params + " in the bot", "List of applications", "Support"],
], resize: true};
} else if (variant === 'admin') {
    reply_markup = {keyboard: [
        ["Yes"],
], resize: true};
    } else if (variant === 'lang') {
        reply_markup = {keyboard: [
            ["Eng", "Ru"],
    ], resize: true};
}
var buttons = {
    parseMode: 'Html',
    webPreview: false,
    reply_markup};
    return buttons;
    }

    async function sendMSG(userId, text, type, params, lang) {
        await new Promise(r => setTimeout(r, 50));
        if (userId) {
        try {
        if (lang === 'Ru') {
let keybord = await ru_keybord(type, params);
await bot.api.sendMessage(userId, text, keybord);
} else if (lang === 'Eng') {
            let keybord = await eng_keybord(type, params);
            await bot.api.sendMessage(userId, text, keybord);
} else {
    let keybord = await eng_keybord(type, params);
    await bot.api.sendMessage(userId, text, keybord);
}
} catch(e) {
console.error(e);
    if (e.error_code === 403) {
await udb.removeUser(userId);
}
}
}    
}

async function startMSG(userId, username, message) {
    const uid = {uid: userId, username: username, state:0, lang: ''};
    const user = await udb.getUser(userId);
    if (!user) {
    await udb.addUser(uid);
    }
        var text = `Hi! It's a bot that notifies on new requests of the Viz Committee. You can also vote for requests directly in this bot.
        Please select your language.

        Привет! Это бот, уведомляющий о новых заявках в комитете Viz. Также вы можете голосовать за заявки прямо в этом боте.
Пожалуйста, выберите язык.`;
await sendMSG(userId, text, 'lang', 'no', '');
}

async function voteMSG(userId, err, result) {
if (!err || err === '') {
    const user = await udb.getUser(userId);
    if (user) {
if (user.lang === 'Ru') {
    var text = 'Вы успешно проголосовали.';
await sendMSG(userId, text, 'standart', false, 'Ru');
} else if (user.lang === 'Eng') {
    var text = 'You have voted successfully.';
await sendMSG(userId, text, 'standart', false, 'Eng');
}
}    
} else {
    const user = await udb.getUser(userId);
    if (user) {
if (user.lang === 'Ru') {
    var text = `Ошибка. Проголосовать не удалось. Подробности:
        
${JSON.stringify(err)}

Если вам ошибка непонятна, прошу написать моему создателю @denis_skripnik.`;
await sendMSG(userId, text, 'standart', 'no', 'Ru');
} else if (user.lang === 'Eng') {
var text = `Error. It was not possible to vote. Details:

${JSON.stringify(err)}

If you don't understand the error, please write to my Creator @skripnikdenis.`;
await sendMSG(userId, text, 'standart', 'no', 'Eng');
}
}
}
}

async function voteing(fromId, username, message) {
        let props = {};
    props.match = message.split(' ');
    var num = parseInt(props.match[1]);
    var percent = parseInt(props.match[2]);
    percent *= 100;
    var num = parseInt(props.match[1]);
    var percent = parseInt(props.match[2]);
    percent *= 100;
    var login = props.match[3].toLowerCase().trim();
    var posting_key = props.match[4].trim();
    let res = await methods.workerVote(num, percent, login, posting_key);
    if (res && res.status === 'ok') {
    await voteMSG(fromId, '', res);
    } else if (res && res.status === 'error') {
        await voteMSG(fromId, res, '');
    }
}

async function list_msg(userId, message) {
    try {
        const uid = [{uid: userId}];

        let workers_list = await cdb.findAllCommittee();
        if (workers_list && workers_list.length > 0) {
            const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
        for (let request of workers_list) {
            let end_time = await helpers.date_str(request.end*1000 - timezoneOffset, true, false, true);
            await oneUserMSG(userId, request, end_time);
}
        } else {
            const user = await udb.getUser(userId);
            if (user.lang === 'Ru') {
                var text = 'Заявок нет.';
            await sendMSG(userId, text, 'standart', false, 'Ru');
            } else if (user.lang === 'Eng') {
                var text = 'Requests is not found.';
            await sendMSG(userId, text, 'standart', false, 'Eng');
            }
        }
    } catch(e) {
        console.error(JSON.stringify(e));
    }    
}

    async function voteInfo(fromId, message) {
        let props = {};
        props.match = message.split(' ');
        var request_id = props.match[1] | props.match[2];
        
        const user = await udb.getUser(fromId);
        if (user) {
    if (user.lang === 'Ru') {
    var text = `Вы можете проголосовать за заявку №` + request_id + ` прямо в этом боте.
Для этого введите следующую команду:
vote ${request_id} 100 login 5k
Где:
${request_id} - id заявки (не менять);
100 - процент (от -100 до 100);
login - его замените на свой логин
5k - замените на свой приватный постинг ключ (Не сохраняется).
Будьте внимательны: не удалите пробел или не добавьте лишний.`;
        await sendMSG(fromId, text, 'standart', 'no', 'Eng');
    } else if (user.lang === 'Eng') {
        var text = `You can vote for request #` + request_id + ` in this bot.
For that purpose emter the following command:                
vote ${request_id} 100 login 5k
where:
${request_id} - don’t chance the request;
100 - percent (-100 - 100;
login - replace with your login
5k - Replace 5k with your private key (Don’t save.
Please be attentive: don’t remove or add an additional space.`;
        await sendMSG(fromId, text, 'standart', 'no', 'Eng');
       }
        }
    }

    async function oneUserMSG(uid, res, end_time) {
        try {
            const user = await udb.getUser(uid);
        if (user) {

            if (user.lang === 'Ru') {
                var text = `Заявка №<a href="https://control.viz.world/committee/${res.id}/">${res.id}</a>
Автор: <a href="https://control.viz.world/@${res.creator}/">${res.creator}</a>, Воркер: <a href="https://control.viz.world/@${res.worker}/">${res.worker}</a>, <a href="${res.url}">Ссылка на описание заявки</a>
        Минимальная сумма токенов для удовлетворения заявки: ${res.required_amount_min}
        Максимальная сумма токенов заявки: ${res.required_amount_max}
Дата и время окончания: ${end_time}`;
await sendMSG(uid, text, 'application', res.id, 'Ru');
    } else     if (user.lang === 'Eng') {
        var text = `Request №<a href="https://control.viz.world/committee/${res.id}/">${res.id}</a>
        Author: <a href="https://control.viz.world/@${res.creator}/">${res.creator}</a>, worker: <a href="https://control.viz.world/@${res.worker}/">${res.worker}</a>, <a href="${res.url}">A link to a description of the request</a>
        Minimum amount of tokens to satisfy the request: ${res.required_amount_min}
        The maximum amount of token requests: ${res.required_amount_max}
End date and time: ${end_time}`;
await sendMSG(uid, text, 'application', res.id, 'Eng');
    }
    }
        } catch(error) {
            console.error(JSON.stringify(error));
        }
}

    async function msg(uid, res, end_time) {
        const user = await udb.getUser(uid);
        if (user) {
    if (user.lang === 'Ru') {
        var text = `Появилась новая заявка в комитет № <a href="https://control.viz.world/committee/${res.id}/">${res.id}</a>
Автор: <a href="https://control.viz.world/@${res.creator}/">${res.creator}</a>, воркер: <a href="https://control.viz.world/@${res.worker}/">${res.worker}</a>, <a href="${res.url}">Ссылка на описание заявки</a>
Минимальная сумма токенов для удовлетворения заявки: ${res.required_amount_min}
Максимальная сумма токенов заявки: ${res.required_amount_max}
Дата и время окончания: ${end_time}`;
await sendMSG(uid, text, 'application', res.id, 'Ru');
    } else if (user.lang === 'Eng') {
        var text = `There is a new request to the Viz Committee № <a href="https://control.viz.world/committee/${res.id}/">${res.id}</a>
Author: <a href="https://control.viz.world/@${res.creator}/">${res.creator}</a>, worker: <a href="https://control.viz.world/@${res.worker}/">${res.worker}</a>, <a href="${res.url}">A link to a description of the request</a>
Minimum amount of tokens to satisfy the request: ${res.required_amount_min}
The maximum amount of token requests: ${res.required_amount_max}
End Date and time: ${end_time}`;
await sendMSG(uid, text, 'application', res.id, 'Eng');
    }
        }    
}

async function adminCommand(fromId, message) {
let props = {};
props.match = message.split(' ');
    var resp = props.match[1];
    if (fromId === conf.committee_bot.admin_id) {
    const user_info = await udb.findAllUsers();
    if (user_info) {
    user_info.forEach(async function (user) {
if (user.lang === 'Ru') {
        var text = resp + `
    
    Если вы получили сообщение, просьба нажать на /yes или ввести
    /Да
    Также вы можете нажать на одноимённую кнопку.
    
    Надо убедиться, что вы получили это сообщение.`;
    await sendMSG(user['uid'], text, 'admin', 'no', 'Ru');
} else if (user.lang === 'Eng') {
    var text = resp + `

    If you receive a message, please click /yes or enter
                 /Yes
You can also click on the button with the same name.
    
    We need to make sure you received this message.`;
    await sendMSG(user['uid'], text, 'admin', 'no', 'Eng');
}
});
    }
                    }
            }
    
async function yesCommand(fromId, fromLogin, message) {
var textTo = `Пользователь Telegram @${fromLogin} подтвердил получение вашего сообщения.`;
await sendMSG(conf.committee_bot.admin_id, textTo, 'standart', false);
const user = await udb.getUser(fromId);
if (user) {
if (user.lang === 'Ru') {
var textFrom = `Благодарю за подтверждение. Оно отправлено успешно.`;
await sendMSG(fromId, textFrom, 'standart', 'no', 'Ru');
} else if (user.lang === 'Eng') {
    var textFrom = `Thank you for your confirmation. It was sent successfully.`;
    await sendMSG(fromId, textFrom, 'standart', 'no', 'Eng');
    }
}
}

async function supportCommand(fromId, username, message) {
const user = await udb.getUser(fromId);
        if(user) {
            const user_data = {uid: fromId, username: username, state:1, langg: user.lang};

               const res = await udb.updateUser(fromId, user_data);
        if (res) {
if (user.lang === 'Ru') {
            var text = 'Введите пожалуйста сообщение создателю бота.';
await sendMSG(fromId, text, 'standart', 'no', 'Ru');
} else if (user.lang === 'Eng') {
    var text = 'Please enter a message to the Creator of the bot.';
    await sendMSG(fromId, text, 'standart', 'no', 'Eng');
}
        }
}
}

async function langRuCommand(fromId, username, message) {
const user = await udb.getUser(fromId);
            if(user) {
               const user_data = {uid: fromId, username: username, state:0, lang: "Ru"};

                   const res = await udb.updateUser(fromId, user_data);
            if (res) {
let text = `Выбран язык: Русский.

[/help](/help) - Список команд.`;
await sendMSG(fromId, text, 'standart', 'no', 'Ru');
            }
    }
}

async function langEngCommand(fromId, username, message) {
const user = await udb.getUser(fromId);
            if(user) {
               const user_data = {uid: fromId, username: username, state:0, lang: "Eng"};

                   const res = await udb.updateUser(fromId, user_data);
            if (res) {
let text = `Selected language: English.

[/help](/help) - list of commands.`;
await sendMSG(fromId, text, 'standart', 'no', 'Eng');
            }
    }
}

async function allCommands() {
                bot.on('message', async (msg) => {
                    msg = msg.update.message;
                    var fromId = msg.from.id;
        var username = msg.from.username;
        if (msg.text === '/start' || msg.text === 'старт') {
            await startMSG(fromId, username);
            return;
        } else if (msg.text.indexOf('vote') > -1) {
            await voteing(fromId, username, msg.text);
            return;
        } else if (msg.text.indexOf('list') > -1 || msg.text.indexOf('Список заявок') > -1) {
            await list_msg(fromId, msg.text);
            return;
        } else if (msg.text.indexOf('How to vote for an request') > -1 || msg.text.indexOf('Как проголосовать за заявку') > -1) {
            await voteInfo(fromId, msg.text);
            return;
        } else if (msg.text.indexOf('admin') > -1) {
            await adminCommand(fromId, msg.text);
            return;
        } else if (msg.text.indexOf('yes') > -1 || msg.text.indexOf('Да') >  -1) {
            await yesCommand(fromId, username, msg.text);
            return;
        } else if (msg.text.indexOf('support') > -1 || msg.text.indexOf('Поддержка') > -1) {
            await supportCommand(fromId, username, msg.text);
            return;
        }  else if (msg.text.indexOf('Ru') > -1) {
            await langRuCommand(fromId, username, msg.text);
            return;
        }  else if (msg.text.indexOf('Eng') > -1) {
            await langEngCommand(fromId, username, msg.text);
            return;
        } else {
            if (msg.text === 'Поддержка') return;
            const user = await udb.getUser(fromId);
    switch(user.state) {
    case 1:
    const user_data = {uid: fromId, username: username, state:0, langg: user.lang};
    const update_user = await udb.updateUser(fromId, user_data);
    if (update_user) {
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
    const date = await helpers.date_str(msg.date*1000 - timezoneOffset, true, false, true);
    var textTo = `Пользователь @${username} оставил сообщение в #поддержка:
    
    ${msg.text}`;
    await sendMSG(conf.committee_bot.admin_id, textTo, 'standart', 'no');
    if (user.lang === 'Ru') {
        var textFrom = `Благодарю. Сообщение успешно отправлено.`;
        await sendMSG(fromId, textFrom, 'standart', 'no', 'Ru');
    } else if (user.lang === 'Eng') {
        var textFrom = `Thank. The message was successfully sent.`;
        await sendMSG(fromId, textFrom, 'standart', 'no', 'Eng');
    }
           }
    break;
    }
        }

});
}

async function langNotifyMSG() {
const user_info = await udb.findAllUsers();
if (user_info) {
    for (let user in user_info) {
if (!user_info[user].lang || user_info[user].lang === "yes_no") {
const user_data = {uid: user_info[user]['uid'], username: user_info[user]['username'], state:0, lang: "yes_no"};

const res = await udb.updateUser(user_info[user]['uid'], user_data);
let text = `Please select your language. The bot does not know in what language to send you notifications.
Выберите язык, пожалуйста. Бот пока не знает, на каком языке присылать вам уведомления.`;
await sendMSG(user_info[user]['uid'], text, 'lang', 'no', '');
}
}
}
}

module.exports.sendMSG = sendMSG;
module.exports.msg = msg;
module.exports.oneUserMSG = oneUserMSG;
module.exports.allCommands = allCommands;
    module.exports.langNotifyMSG = langNotifyMSG;