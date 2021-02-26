const conf = require(process.cwd() + "/config.json");
const TeleBot = require('telebot');
const bot = new TeleBot(conf.chats_channels_bot.api_key);
bot.start();
const helpers = require("../helpers");

async function keybord() {
var buttons = {
    parseMode: 'Html',
    webPreview: false};
    return buttons;
}

    async function sendMSG(userId, text) {
        await new Promise(r => setTimeout(r, 50));
    let keybord = await keybord();
    await bot.sendMessage(userId, text, keybord);
}

async function startMSG() {
return bot.on(/start|старт/, async function (msg, match) {
    var userId = msg.from.id;
    var username = msg.from.username;

        var text = `Это бот, который отправляет в канал @viz_chats_channels посты с новыми чатами и каналами.
        This is a bot that sends posts with new chats and channels to the @viz_chats_channels channel.`;
await sendMSG(userId, text);
});
}

module.exports.sendMSG = sendMSG;
module.exports.startMSG = startMSG;