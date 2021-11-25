const botjs = require("./bot/bot");
const udb = require(process.cwd() + "/databases/mg_bot/usersdb");
const helpers = require("../helpers");
const conf = require(process.cwd() + '/config.json');
const i = require("./bot/interface");

	botjs.allCommands();
	module.exports.futureTellingNotify = i.futureTellingNotify;