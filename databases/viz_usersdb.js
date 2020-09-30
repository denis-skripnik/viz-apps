const db = require('./@db.js');

async function getTop(type, page) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('viztop');
        const query = {}
        query[type] = { $exists: true }
        const sorting = {};
        sorting[type] = -1;
        let skip = page * 100 - 100;

        collection.createIndex(sorting, function (err) {
            if (err) {
                console.error(JSON.stringify(err));
            }
              });

        const res = [];
        let cursor = await collection.find(query).sort(sorting).skip(skip).limit(100);
        let doc = null;
        while(null != (doc = await cursor.next())) {
            res.push(doc);
        }
    return res;
      } catch (err) {
  
        console.log(err);
    return err;
      } finally {
  
        
    }
}

async function updateTop(name, shares, shares_percent, delegated_shares, received_shares, effective_shares, viz, viz_percent) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('viztop');
        collection.createIndex({ name: -1 }, function (err) {
            if (err) {
                console.error(JSON.stringify(err));
            }
              });

              let res = await collection.updateOne({name}, {$set: {name, shares, shares_percent, delegated_shares, received_shares, effective_shares, viz, viz_percent}}, { upsert: true });

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {

        
    }
}

module.exports.getTop = getTop;
module.exports.updateTop = updateTop;