const botjs = require("./bot/bot");
const i = require("./bot/interface");
const udb = require(process.cwd() + "/databases/readdle_bot/usersdb");
const helpers = require("../helpers");
const conf = require(process.cwd() + '/config.json');
var sjcl = require('sjcl');

async function notify(login, bn, data) {
	let users = await udb.findAllUsers();
if (users && users.length > 0) {
	for (let user of users) {
		if (user.subscribes && user.subscribes.length === 0 || user.subscribes && user.subscribes.indexOf(login) > -1 || data.d.r&& user.subscribes && user.subscribes.indexOf(data.d.r.split('@')[1].split('/')[0]) > -1) {
					await i.sendNotify(login, user.lng, user.id, bn, data);
		}
	}
}
}

	botjs.allCommands();

module.exports.notify = notify;