const botjs = require("./bot/bot");
const i = require("./bot/interface");

botjs.allCommands();

module.exports.benefactorAward = i.benefactorAward;
module.exports.receiveAward = i.receiveAward;