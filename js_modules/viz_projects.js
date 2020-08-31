const pdb = require("../databases/viz_projects/projectsdb");
const ndb = require("../databases/viz_projects/newsdb");
const tdb = require("../databases/viz_projects/tasksdb");
const wtdb = require("../databases/viz_projects/workingtasksdb");
const cdb = require("../databases/viz_projects/categoriesdb");
const tydb = require("../databases/viz_projects/typesdb");
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
        switch(json.data[0]) {
            case "update_project":
let u_prj = await pdb.getProject(data.creator, data.name);
if (u_prj && opbody.required_regular_auths[0] === u_prj.creator) {
    await pdb.updateProject(data.creator, data.name, data.new_name, data.description, data.image_link, data.type, data.category, data.dev_status, data.command, data.site, data.github);
}
        break;
        case "update_task":
        let u_tsk = await tdb.getTask(data.creator, data.name);
        if (u_tsk && opbody.required_regular_auths[0] === u_tsk.creator) {
            await tdb.updateTask(data.creator, data.name, data.new_name, data.description, data.mambers, data.status);
        }
        break;
        case "add_task_member":
        let a_tsk_m = await tdb.getTask(data.creator, data.name);
        if (a_tsk_m) {
            let mambers = a_tsk_m.mambers;
            if (mambers.length < 10) {
                mambers.push(opbody.required_regular_auths[0]);
                await tdb.updateTask(data.creator, a_tsk_m.name, a_tsk_m.name, a_tsk_m.description, mambers, a_tsk_m.status);
            }
        }
        break;
        case "delete_task_member":
        let d_tsk_m = await tdb.getTask(data.creator, data.name);
        let login = opbody.required_regular_auths[0];
        if (data.task_member) {
            login = data.task_member;
        }
        if (d_tsk_m && d_tsk_m.mambers.indexOf(login)) {
            if (opbody.required_regular_auths[0] === conf.viz_projects.login || opbody.required_regular_auths[0] === data.task_member || opbody.required_regular_auths[0] === d_tsk_m.creator) {
            let members = d_tsk_m.mambers;
let new_members = [];
            for (let member of members) {
if (member !== login) {
new_members.push(member);
}
}
            await tdb.updateTask(data.creator, d_tsk_m.name, d_tsk_m.name, d_tsk_m.description, new_members, d_tsk_m.status);
await wtdb.deleteWorkingTasks({task_creator: data.creator, task_name: data.name, user: login, date: data.date});
        }
        }
        break;
        case "news":
if (data.date) {
    date = data.date;
}
let n_prj = await pdb.getProject(opbody.required_regular_auths[0], data.project_name);
if (n_prj && opbody.required_regular_auths[0] === n_prj.creator || n_prj && n_prj.command.indexOf(opbody.required_regular_auths[0]) > -1) {
                await ndb.updateNews(data.project_creator, data.project_name, opbody.required_regular_auths[0], date, data.title, data.description, data.text, data.image_link);
        }
break;
        case "delete_one_news":
        await ndb.deleteNews({project_creator: data.project_creator, project_name: data.project_name, user: opbody.required_regular_auths[0], date: data.date});
        break;
case "working_tasks":
        if (data.date) {
            date = data.date;
        }
        let w_tsk = await tdb.getTask(data.task_creator, data.task_name);
        if (w_tsk && w_tsk.mambers.indexOf(opbody.required_regular_auths[0]) > -1) {
await wtdb.updateWorkingTask(data.task_creator, data.task_name, opbody.required_regular_auths[0], date, data.text);
        }
        break;
case "delete_working_task":
await wtdb.deleteWorkingTasks({task_creator: data.task_creator, task_name: data.task_name, user: opbody.required_regular_auths[0], date: data.date});
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
        case "add_type":
        if (opbody.required_regular_auths[0] === conf.viz_projects.login && data.name) {
    await tydb.addType(data.name);
}
        break;
        case "delete_type":
        if (opbody.required_regular_auths[0] === conf.viz_projects.login && data.name) {
            await tydb.deleteType(data.name);
        }
        break;
        case "add_category":
        if (opbody.required_regular_auths[0] === conf.viz_projects.login && data.name) {
            await cdb.addCategory(data.name);
        }
        break;
        case "delete_category":
        if (opbody.required_regular_auths[0] === conf.viz_projects.login && data.name) {
            await cdb.deleteCategory(data.name);
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