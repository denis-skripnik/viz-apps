const botjs = require("./bot/bot");
const i = require("./bot/interface");
const udb = require(process.cwd() + "/databases/readdle_bot/usersdb");
const helpers = require("../helpers");
const conf = require(process.cwd() + '/config.json');
var sjcl = require('sjcl');

function replaceSIAWithHTMLLinks(text) {
    var exp = /(\b(sia):\/\/([-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]))/gi;
    return text.replace(exp,"<a href='https://siasky.net/$3'>$1</a>"); 
}

async function notify(login, bn, data) {
	if (typeof data.d === "undefined" || data.d && typeof data.d.m === "undefined" && typeof data.d.d === "undefined" && typeof data.d.t === "undefined") {
		return;
	}
let str_data = '';
	if (data.d.m) {
		str_data = data.d.m;
	} else if (data.d.d) {
		str_data = data.d.d;
	} else if (data.d.t) {
		str_data = data.d.t;
	}
str_data = str_data.toLowerCase();

if (str_data.indexOf('рашк') > -1 || str_data.indexOf('фашис') > -1 || str_data.indexOf('полити') > -1 || str_data.indexOf('украин') > -1 || login === 'stefan99') {
	return;
}
	let users = await udb.findAllUsers();
if (users && users.length > 0) {
	for (let user of users) {
		var ffl = 0;
		var jarr = [data.d.m, data.d.d, data.d.t].join(' ');
		var regex = /@[A-Z,a-z,.,0-9,\-,_]+/g;
if (jarr.indexOf('#nsfw') === -1 || jarr.indexOf('#nsfw') > -1 && user.show_nsfw == true) {
	if(jarr.length > 2 && user.subscribes && jarr.match(regex))
	jarr.match(regex).forEach(function (element) {if (user.subscribes.indexOf(element.substr(1)) > -1) ffl = 1;});
	
			if (user.subscribes && user.subscribes.indexOf(login) > -1 || user.subscribes && user.subscribes.length === 0 && user.show_all == true || data.d.r&& user.subscribes && user.subscribes.indexOf(data.d.r.split('@')[1].split('/')[0]) > -1 || ffl == 1) {
				if (data.d.m) data.d.m = replaceSIAWithHTMLLinks(data.d.m);
				if (data.d.d) data.d.d = replaceSIAWithHTMLLinks(data.d.d);
				if (data.d.t) data.d.t = replaceSIAWithHTMLLinks(data.d.t);
				await i.sendNotify(login, user.lng, user.id, bn, data);
	}
} // end if #nsfw.
	}
}
}

	botjs.allCommands();

module.exports.notify = notify;