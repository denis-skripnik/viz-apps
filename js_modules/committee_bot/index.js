const botjs = require("./bot");
const udb = require(process.cwd() + "/databases/committee_bot/usersdb");
const cdb = require(process.cwd() + "/databases/committee_bot/committeedb");
const helpers = require("../helpers");

async function committeeWorkerCreateRequestOperation(id, opbody) {
let end_datetime = parseInt(new Date().getTime()/1000) + opbody.duration;
try {
let results_count = await cdb.updateCommittee(id, opbody.creator, opbody.url, opbody.worker, opbody.required_amount_min, opbody.required_amount_max, end_datetime);
let users = await udb.findAllUsers();
if (users && users.length > 0) {
    const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
    let end_time = await helpers.date_str(end_datetime*1000 - timezoneOffset, true, false, true);
    for (var i = 0; i < users.length; i++) {
        await botjs.msg(users[i]['uid'], {id, creator: opbody.creator, url: opbody.url, worker: opbody.worker, required_amount_min: opbody.required_amount_min, required_amount_max: opbody.required_amount_max, end: end_datetime}, end_time);
}
}
return results_count;
} catch(e) {
    console.log(e);
    return 0;
}
    }

async function committeePayRequestOperation(opbody) {
        let request = await cdb.getCommittee(opbody.request_id);
        if (request) {
                try {
                        await cdb.removeCommittee(request._id);
                        let users = await udb.findAllUsers();
                        for (user of users) {
                                if (user.lang === 'Ru') {
                                let text = `Заявка №<a href="https://control.viz.world/committee/${request.id}">${request.id}</a> завершена. Воркер получил ${opbody.tokens}.`;
                                await botjs.sendMSG(user['uid'], text, 'standart', 'no', 'Ru');
                        } else if (user.lang === 'Eng') {
                                let text = `Request №<a href="https://control.viz.world/committee/${request.id}">${request.id}</a> is finished. Worker received ${opbody.tokens}.`;
                                await botjs.sendMSG(user['uid'], text, 'standart', 'no', 'Eng');
                        }
                        }
                } catch(e) {
        console.log(e);
                        }                        
}
}

async function checkRequests() {
let now_time = new Date().getTime();
        try {
let res = await cdb.findAllCommittee();
if (res && res.length === 0) return;
for (let request of res) {
let remained = parseInt(now_time / 1000) - parseInt(request.end / 1000);
if (remained === 86400 || remained === 7200) {
        let users = await udb.findAllUsers();
if (users && users.length > 0) {
    for (var i = 0; i < users.length; i++) {
        await botjs.endingRequest(users[i]['uid'], users[i]['lng'], request, remained / 3600);
}
}
} // end if remained is 2 hour's or 1 day.
}
} catch(e) {
    console.log(e);
    return 0;
}
}

setInterval(checkRequests, 1000);
setInterval(botjs.langNotifyMSG, 3600000);

module.exports.committeeWorkerCreateRequestOperation = committeeWorkerCreateRequestOperation;
module.exports.committeePayRequestOperation = committeePayRequestOperation;
module.exports.noReturn = botjs.allCommands;