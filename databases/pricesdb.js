const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function getPrices() {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('viz-prices');

        let query = {}

        let res = await collection.findOne(query);

  return res.data;
    } catch (err) {

return err;
    } finally {

        client.close();
    }
}

async function updatePrices(data) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('viz-prices');

        let res = await collection.updateOne({}, {$set: {data}}, { upsert: true });

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {

        client.close();
    }
}

module.exports.getPrices = getPrices;
module.exports.updatePrices = updatePrices;