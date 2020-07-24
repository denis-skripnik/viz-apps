let express = require('express');
let app = express();
const helpers = require("./helpers");
const methods = require("./methods");
const vudb = require("../databases/viz_usersdb");
const pdb = require("../databases/pricesdb");
const conf = require('../config.json');

app.get('/viz-api/', async function (req, res) {
    let service = req.query.service;
    let type = req.query.type;
    let page = req.query.page;
let date = req.query.date; // получили параметр date из url
let login = req.query.login; // получили параметр login из url
if (service === 'top' && type) {
        let data = await vudb.getTop(type, page);
    let users = [];
    let users_count = 0;
    for (let user of data) {
            users[users_count] = {};
            users[users_count]['name'] = user['name'];
            users[users_count][type] = user[type];
            users[users_count][type + '_percent'] = user[type + '_percent'];
            for (let el in user) {
    if (type !== el && el !== 'name' && el + '_percent' !== type + '_percent') {
        users[users_count][el] = user[el];
    }
    }
    users_count++;
    }
    res.send(users);
} else if (service === 'prices') {
    let data = await pdb.getPrices();
    delete data._id;
    res.send(data);
}
});
app.listen(3100, function () {
});