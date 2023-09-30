const conf = require(process.cwd() + "/config.json");
const { Bot } = require("grammy");
const bot = new Bot(conf.chats_channels_bot.api_key);
bot.start();
const helpers = require("../helpers");

    async function sendMSG(userId, text) {
        await new Promise(r => setTimeout(r, 50));
        var buttons = {
            parse_mode: 'HTML',
            webPreview: false};
    await bot.api.sendMessage(userId, text, buttons);
}

async function startMSG() {
return bot.hears(/start|старт/, async function (msg, match) {
    var userId = msg.from.id;
    var username = msg.from.username;

        var text = `Это бот, который отправляет в канал @viz_chats_channels посты с новыми чатами и каналами.
This is a bot that sends posts with new chats and channels to the @viz_chats_channels channel.`;
await sendMSG(userId, text);
});
}

module.exports.sendMSG = sendMSG;
module.exports.startMSG = startMSG;