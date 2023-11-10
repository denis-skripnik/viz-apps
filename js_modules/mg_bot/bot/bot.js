const conf = require(process.cwd() + '/config.json');
const cbdb = require(process.cwd() + "/databases/mg_bot/cbdb");
const udb = require(process.cwd() + "/databases/mg_bot/usersdb");
const { Bot } = require("grammy");
const bot = new Bot(conf.mg_bot.bot_api_key);
bot.start();
const i = require("./interface");
const axios = require('axios')

async function ids(uid) {
    if (conf.mg_bot.admins.indexOf(uid) > -1) {
        return {status: 2, id: uid};
    } else {
        return {status: 1, id: uid};
    }
}

async function keybord(btn_list, inline, preview) {
    let replyMarkup;
    if (inline == true) {
        let inline_keyboard = [];
        for (let row in btn_list) {
    if (typeof btn_list[row] == 'function') {
        continue;
    }
    inline_keyboard[row] = [];
            for (let btn of btn_list[row]) {
                let bytes = Buffer.from(btn[0]).length;
                if (bytes > 64) continue;
                inline_keyboard[row].push({text: btn[1], callback_data: btn[0]});
    }
        }

        reply_markup = {inline_keyboard};
    } else {
        let keyboard = [];
        for (let n in btn_list) {
    let btn_row = btn_list[n];
    if (!keyboard[n]) keyboard[n] = [];
    for (let btn of btn_row) {
    keyboard[n].push({text: btn});
    }
            }
            reply_markup = {keyboard, resize_keyboard: true};
    }
    var buttons = {
        parse_mode: 'HTML',
        webPreview: false,
        reply_markup};
        if (typeof preview !== 'undefined') {
            buttons.webPreview = preview;
            buttons.disable_web_page_preview = true;
        }
        return buttons;
    }

async function sendMSG(userId, text, buttons, inline, preview) {
    await new Promise(r => setTimeout(r, 1000));
    try {
    if (text && text !== '') {
        let options = await keybord(buttons, inline, preview);
        return await bot.api.sendMessage(userId, text, options);
    }
    } catch(error) {
        console.log('Ошибка с отправкой сообщения: ' + JSON.stringify(error));
        if (error.error_code === 403 && error.description === "Forbidden: bot was blocked by the user" || error.error_code === 403 && error.description === "Forbidden: user is deactivated") {
await udb.removeUser(userId);
        await cbdb.removeCryptoBids(userId)
}
    }
    }

    async function editMessage(chatId, messageId, text, buttons, inline, preview) {
        let options = await keybord(buttons, inline, preview);
        try {
            await bot.api.editMessageText(chatId, messageId, text, {parse_mode: 'HTML', disable_web_page_preview: true});
            await bot.api.editMessageReplyMarkup(chatId, messageId, options);
        } catch(error) {
            if (error.description.includes('MESSAGE_ID_INVALID')) {
return false;
            }
            if (error.error_code === 403 && error.description === "Forbidden: bot was blocked by the user" || error.error_code === 403 && error.description === "Forbidden: user is deactivated") {
                await udb.removeUser(chatId);
                        await cbdb.removeCryptoBids(chatId)
                }
    }
    }
    
async function allCommands() {
    try {
    bot.on('message', async (msg) => {
        msg = msg.update.message;
        if (msg.from.is_bot !== false) return;
        var name = '';
if (msg.from.first_name) name += msg.from.first_name;
if (msg.from.last_name) name += ' ' + msg.from.last_name;
        var uid = await ids(msg.from.id);
            i.main(uid.id, name, msg.text, uid.status);
    });

    bot.on('callback_query', async (msg) => {
        msg = msg.update.callback_query;
        if (typeof msg.chat !== 'undefined' && typeof msg.chat.type  !== 'undefined' && msg.chat.type !== 'private') return;
        var uid = await ids(msg.from.id);
        var name = '';
        if (msg.from.first_name) name += msg.from.first_name;
        if (msg.from.last_name) name += ' ' + msg.from.last_name;    
        i.main(uid.id, name, msg.data, uid.status);
    });
} catch(err) {
    console.log('Ошибка с получением сообщения: ' + JSON.stringify(err));
    process.exit(1);
}
}

async function sendChatsMSG(text) {
    try {
    let chats = [-1001498464851, '@kitmoongroup', -1001405155024];
for (let chat of chats) {
    await sendMSG(chat, text, '');
}
    } catch(e) {
        console.log(JSON.stringify(e));
    }
}

async function checkSubscribes(uid) {
    var res = false;
    let id = '@blind_dev';
    try {
    let responce = await axios.get('http://178.20.43.121:3906/blind-dev?id=' + uid);
    if (responce.data === true || responce.data === 'true') res = true;
} catch (e) {
console.log(e);
res = true;
}
return res;
}

module.exports.sendMSG = sendMSG;
module.exports.editMessage = editMessage;
module.exports.allCommands = allCommands;
module.exports.sendChatsMSG = sendChatsMSG;
module.exports.checkSubscribes = checkSubscribes;