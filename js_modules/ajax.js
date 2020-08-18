let express = require('express');
let app = express();
const helpers = require("./helpers");
const methods = require("./methods");
const vudb = require("../databases/viz_usersdb");
const pdb = require("../databases/pricesdb");
const prdb = require("../databases/viz_projects/projectsdb");
const ndb = require("../databases/viz_projects/newsdb");
const tdb = require("../databases/viz_projects/tasksdb");
const wtdb = require("../databases/viz_projects/workingtasksdb");
const cdb = require("../databases/viz_projects/categoriesdb");
const tydb = require("../databases/viz_projects/typesdb");
const conf = require('../config.json');

app.get('/viz-api/', async function (req, res) {
    let service = req.query.service;
    let type = req.query.type;
    let page = req.query.page;
let date = req.query.date; // получили параметр date из url
let login = req.query.login; // получили параметр login из url
let filter = req.query.filter;
if (service === 'top' && type && page) {
        let data = await vudb.getTop(type, page);
    let users = [];
    if (data && data.length > 0) {
        let collums = {};
        collums['shares'] = ['shares', 'shares_percent', 'delegated_shares', 'received_shares', 'effective_shares', 'viz', 'viz_percent'];
        collums['delegated_shares'] = ['delegated_shares', 'shares', 'shares_percent', 'received_shares', 'effective_shares', 'viz', 'viz_percent'];
        collums['received_shares'] = ['received_shares', 'shares', 'shares_percent', 'delegated_shares', 'effective_shares', 'viz', 'viz_percent'];
        collums['effective_shares'] = ['effective_shares', 'shares', 'shares_percent', 'delegated_shares', 'received_shares', 'viz', 'viz_percent'];
        collums['viz'] = ['viz', 'viz_percent', 'shares', 'shares_percent', 'delegated_shares', 'received_shares', 'effective_shares'];
        let users_count = 0;
        for (let user of data) {
                users[users_count] = {};
                users[users_count]['name'] = user['name'];
for (let collum of collums) {
    users[users_count][collum] = user[collum];
}
        users_count++;
        } // end for.
    } // end if data.
    res.send(users);
} else if (service === 'prices') {
    let data = await pdb.getPrices();
    delete data._id;
    res.send(data);
} else if (service === 'viz-projects') {
    let data = [];
    if (type === 'projects') {
data = await prdb.getProjects(filter, page)
    } else if (type === 'news') {
        data = await ndb.getNews(filter, page);
    } else if (type === 'tasks') {
        data = await tdb.getTasks(filter, page);
    } else if (type === 'working_tasks') {
        data = await wtdb.getWorkingTasks(filter, page);
    } else if (type === 'categories') {
        data = await cdb.getCategories();
    } else if (type === 'types') {
        data = await tydb.getTypes();
    }
    res.send(data);
}
});
app.listen(3100, function () {
});