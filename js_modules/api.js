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
const wrdb = require("../databases/wrdb");
const ldb = require("../databases/linksdb");
const conf = require('../config.json');

// загружаем библиотеку ограничителя
const Limiter = require('./limiter.js');

// создаем экземпляры класса ограничителя для авторизованных и не авторизованных запросов
const authTrueLimiter = new Limiter(conf.api.authTrueLimiter);
const authFalseLimiter = new Limiter(conf.api.authFalseLimiter);

app.get('/viz-api/', async function (req, res) {
    let service = req.query.service;
    let type = req.query.type;
    let page = req.query.page;
let date = req.query.date; // получили параметр date из url
let login = req.query.login; // получили параметр login из url
let filter = req.query.filter;
let query = req.query.query;
let link = req.query.link;
    // получаем ключ из запроса
    let auth = req.query.auth;
    // проверяем ключ на наличие авторизации
    let keyAuth = false
    if (typeof auth === 'string') {
        keyAuth = await keyCheckAuth(auth)
    }
    // объявляем переменную на указатель класса ограничителя
    let limiter = null

    // проверяем результатт проверки ключа на авторизацию
    if (keyAuth) {
        // ключ авторизованный
        // используем ограничитель для авторизованных запросов
        limiter = authTrueLimiter
    } else {
        // ключ не авторизованный
        // используем ограничитель для авторизованных запросов
        limiter = authFalseLimiter
    }

    // увеличиваем счетчик ограничителя
    if (!limiter.increase()) {
        // если увеличение счетчика не произошло, значит сейчас введено ограничение
        // отправляем сообщение об ограничении запросов
        res.send({ message: "error", description: "The limit is exhausted" })
        // выходим из обработчика маршрута
        return
    }

    try {
        
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
for (let collum of collums[type]) {
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
data = await prdb.getProjects(JSON.parse(filter), page)
    } else if (type === 'news') {
        data = await ndb.getNews(JSON.parse(filter), page);
    } else if (type === 'tasks') {
        data = await tdb.getTasks(JSON.parse(filter), page);
    } else if (type === 'working_tasks') {
        data = await wtdb.getWorkingTasks(JSON.parse(filter), page);
    } else if (type === 'categories') {
        data = await cdb.getCategories();
    } else if (type === 'types') {
        data = await tydb.getTypes();
    }
    res.send(data);
} else if (service === 'witnesses') {
    let data = await wrdb.findAllWitnesses();
    if (data && data.length > 0) {
        res.send(data);
    } else {
        res.send({});
    }
} else if (service === 'links') {
    if (type === 'full_search' && page && query) {
        query = query.toLowerCase().trim();
        let data = await ldb.fullQuerySearchResults(query, page);
        res.send(data);
    } else if (type === 'unfull_search' && page && query) {
        query = query.toLowerCase().trim();
        let data = await ldb.unFullQuerySearchResults(query, page);
        res.send(data);
    } else if (type === 'in_link' && page && link) {
        let data = await ldb.findInLink(link, page);
        res.send(data);
    }
}
} catch (error) {
    // на всякий случай ловим ошибку
    console.log(error)
} finally {
    // в данной секции нам надо уменьшить счетчик
    limiter.decrease();
}

});
app.listen(3100, function () {
});


const keyCheckAuth = async function (aKey) {
    let auth_data = aKey.split(':'); // 0 - логин, 1 - ключ, 2 - unixtime, 3 - подпись.
    let signature = auth_data[3];
    let vizpubkey = auth_data[1];
    let acc = await methods.getAccount(auth_data[0])[0];
    let unixtime = await helpers.unixTime();
    let isAuth = false;
    if (acc && auth_data[2] >= unixtime - 10000 && auth_data[2] >= unixtime) {
        let approve_key = false;
        for (key of acc.regular_authority.key_auths) {
            if (key[0] === vizpubkey) {
                approve_key = true;
            }
        }

        if (approve_key == true) {
            let verifyData = await methods.verifyData(data, signature, VIZPUBKEY);
            if (verifyData == true) {
                let status = await methods.getSubscriptionStatus(auth_data[0], conf.api.provider_account);
                isAuth = true;
            }
        }
    }
    return isAuth;
}