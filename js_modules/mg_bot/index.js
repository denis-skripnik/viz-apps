const botjs = require("./bot/bot");
const helpers = require("../helpers");
const conf = require(process.cwd() + '/config.json');
const i = require("./bot/interface");

	botjs.allCommands();

module.exports.futureTellingNotify = i.futureTellingNotify;
module.exports.addVizScores = i.addVizScores;
module.exports.scoresAward = i.scoresAward;
	module.exports.cryptoBidsResults = i.cryptoBidsResults;