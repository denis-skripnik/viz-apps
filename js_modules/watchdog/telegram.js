const global = require("basescript");
const memory = require(process.cwd() + "/databases/watchdogdb");
const conf = require(process.cwd() + '/config.json');
const log = global.getLogger("telegram");

const { Bot } = require("grammy");

let bot = null;

async function send(chat_id, msg, kbd) {
    try {
        let opts = { parse: "HTML" };
        log.debug("msg", msg);
        log.debug("kbd", kbd);
        if (kbd) {
            opts.markup = kbd;
        }
        await bot.api.sendMessage(chat_id, msg, opts)
    } catch(e) {
log.error('Chat id: ' + chat_id);
log.error('Details: ' + e);
        if (e.error_code === 403 && e.description === "Forbidden: bot was blocked by the user" || e.error_code === 403 && e.description === "Forbidden: user is deactivated" || e.error_code === 403 && e.description === "Forbidden: bot can't send messages to bots" || e.error_code === 400 && e.description === "Bad Request: user not found" || e.error_code === 400 && e.description === "Bad Request: chat not found") {
await memory.removeChat(chat_id)
                    }
    }
}

async function init(onMsg) {
    bot = new Bot(conf.watchdog.token);
   
    bot.on('message', onMsg); 
    bot.start();
}

module.exports.init = init;
module.exports.send = send;