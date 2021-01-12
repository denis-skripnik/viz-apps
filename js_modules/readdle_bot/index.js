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
		var ffl = 0;
		var jarr = [data.d.m, data.d.d, data.d.text].join(' ');
		var regex = /@[A-Z,a-z,.,0-9,\-,_]+/g;
		if(jarr.length > 2 && user.subscribes && jarr.match(regex))
		jarr.match(regex).forEach(function (element) {if (user.subscribes.indexOf(element.substr(1)) > -1) ffl = 1;});
		
		if (user.subscribes && user.subscribes.indexOf(login) > -1 || user.subscribes && user.subscribes.length === 0 || data.d.r&& user.subscribes && user.subscribes.indexOf(data.d.r.split('@')[1].split('/')[0]) > -1 || ffl == 1) {
					await i.sendNotify(login, user.lng, user.id, bn, data);
		}
	}
}
}

	botjs.allCommands();

module.exports.notify = notify;