const ldb = require("../databases/linksdb");

async function receiveAwardOperation(custom_sequence, shares, data) {
    let protocol = '';
    if (custom_sequence === 0) {
        protocol = 'viz://';
} else if (custom_sequence === 1) {
    protocol = 'https://';
} else if (custom_sequence === 2) {
    protocol = 'ipfs://';
} else if (custom_sequence === 3) {
    protocol = 'magnet://'
}

if (data[1].indexOf('https') > -1) data[1] = data[1].substr(8);
if (data[1].indexOf('http') > -1) data[1] = data[1].substr(7);
if (data[2].indexOf('https') > -1) data[2] = data[2].substr(8);
if (data[2].indexOf('http') > -1) data[2] = data[2].substr(7);

let keyword = data[0].toLowerCase().trim();
let link = await ldb.getLink(keyword, protocol + data[1], protocol + data[2]);
if (link) {
    shares += link.shares;
    }
await ldb.updateLink(keyword, protocol + data[1], protocol + data[2], shares);
}

async function updateShares() {
    let links = await ldb.findAllLinks();
if (links && links.length > 0) {
    for (let link of links) {
        let shares = link.shares * 0.99;
        shares = shares.toFixed(6);
        shares = parseFloat(shares);
        await ldb.updateLink(link.keyword, link.link, link.in_link, shares);
    }
}
}

module.exports.receiveAwardOperation = receiveAwardOperation;
module.exports.updateShares = updateShares;