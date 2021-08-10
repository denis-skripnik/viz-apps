const db = require('./@db.js');

async function getPrices() {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('viz_prices');

        let query = {}

        let res = await collection.findOne(query);

  return res.data;
    } catch (err) {

return err;
    } finally {

        
    }
}

async function updatePrices(data) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("blockchains");

        let collection = db.collection('viz_prices');

        let res = await collection.updateOne({}, {$set: {data}}, { upsert: true });

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {

        
    }
}

module.exports.getPrices = getPrices;
module.exports.updatePrices = updatePrices;