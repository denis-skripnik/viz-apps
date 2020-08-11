const pdb = require("../databases/viz_projects/projectsdb");
const ndb = require("../databases/viz_projects/newsdb");
const tdb = require("../databases/viz_projects/tasksdb");
const wtdb = require("../databases/viz_projects/workingtasksdb");
const conf = require('../config.json');
const gate = conf.viz_projects.login;
const helpers = require("./helpers");

async function transferOperation(opbody) {
try {
    let json = await helpers.isJsonString(opbody.memo);
if (json.approve === true) {
    let data = json.data[1];
    switch(json.data[0]) {
        case "project":
        await pdb.addProject(opbody.from, data.name, data.description, data.image_link, data.type, data.category, data.dev_status, data.command, data.site, data.github);
    break;
    case "task":
    await tdb.addTask(opbody.from, data.name, data.description, data.mambers, data.status);
    break;
    default:
    // Ничего не делать.
}
}
return 1;
} catch(e) {
    console.log('viz_projects, adding error: ' + e);
return 0;
}
}

async function customOperation(date, opbody) {
    try {
        let json = await helpers.isJsonString(opbody.json);
    if (json.approve === true) {
        let data = json.data[1];
        let db;
        switch(json.data[0]) {
            case "update_project":
let db = await pdb.getProject(data.creator, data.name);
            if (db && opbody.from === db.creator) {
    await pdb.updateProject(data.creator, data.name, data.new_name, data.description, data.image_link, data.type, data.category, data.dev_status, data.command, data.site, data.github);
}
        break;
        case "update_task":
        db = await tdb.getTask(data.creator, data.name);
        if (db && opbody.from === db.creator) {
            await tdb.updateTask(data.creator, data.name, data.new_name, data.description, data.mambers, data.status);
        }
        break;
        case "add_task_member":
        db = await tdb.getTask(data.creator, data.name);
        if (db) {
            let mambers = db.mambers;
            mambers.push(opbody.required_posting_auths[0]);
            await tdb.updateTask(data.creator, db.name, db.name, db.description, mambers, db.status);
        }
        break;
        case "delete_task_member":
        db = await tdb.getTask(data.creator, data.name);
        let login = opbody.required_posting_auths[0];
        if (data.task_member) {
            login = data.task_member;
        }
        if (db && db.mambers.indexOf(login)) {
            if (opbody.required_posting_auths[0] === conf.viz_projects.login || opbody.required_posting_auths[0] === data.task_member || opbody.required_posting_auths[0] === db.creator) {
            let members = db.mambers;
let new_members = [];
            for (let member of members) {
if (member !== login) {
new_members.push(member);
}
}
            await tdb.updateTask(data.creator, db.name, db.name, db.description, new_members, db.status);
await wtdb.deleteWorkingTasks({task_creator: data.creator, task_name: data.name, user: login, date: data.date});
        }
        }
        break;
        case "news":
if (data.date) {
    date = data.date;
}
db = await pdb.getProject(opbody.required_posting_auths[0], data.project);
            if (db && opbody.required_posting_auths[0] === db.creator || db && db.command.indexOf(opbody.required_posting_auths[0]) > -1) {
await ndb.updateNews(data.project_creator, data.project_name, opbody.required_posting_auths[0], date, data.title, data.description, data.text, data.image_link);
        }
break;
        case "delete_one_news":
        await ndb.deleteNews({project_creator: data.project_creator, project_name: data.project_name, user: opbody.required_posting_auths[0], date: data.date});
        break;
case "working_tasks":
        if (data.date) {
            date = data.date;
        }
        db = await tdb.getTask(data.task_creator, data.task_name);
        if (db && db.mambers.indexOf(opbody.from) > -1) {
await wtdb.updateWorkingTask(data.task_creator, data.task_name, opbody.required_posting_auths[0], date, data.title, data.description, data.text);
        }
        break;
case "delete_working_task":
await wtdb.deleteWorkingTasks({task_creator: data.task_creator, task_name: data.task_name, user: opbody.required_posting_auths[0], date: data.date});
break;
        case "moderation":
if (data.type === 'task') {
    await tdb.deleteTasks(data.creator, data.name);
    await wtdb.deleteWorkingTasks({task_creator: data.creator, task_name: data.name});
} else if (data.type === 'project') {
    await pdb.deleteProjects(data.creator, data.name);
    await ndb.deleteNews({project_creator: data.creator, project_name: data.name});
}
    break;
        default:
        // Ничего не делать.
    }
    }
    return 1;
    } catch(e) {
        console.log('viz_projects, adding error: ' + e);
    return 0;
    }
    
}

module.exports.transferOperation = transferOperation;
module.exports.customOperation = customOperation;