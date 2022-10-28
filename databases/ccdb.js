const pool = require('./@db.js')

async function updateCoin(id, data) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("bd_prices_bot");

		let collection = db.collection('cc');

      let res = await collection.updateOne({id}, {$set: data}, {upsert: true});

return res;

} catch (err) {

    console.log(err);
    return err;
} finally {

}
}

async function getCoinsByTickers(symbols) {
    
	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("bd_prices_bot");

		let collection = db.collection('cc');

const res = [];
      let cursor = await collection.find({symbol: {$in: symbols}}).limit(500);
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

async function getCoinsByIds(ids) {
    
	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("bd_prices_bot");

		let collection = db.collection('cc');

const res = [];
      let cursor = await collection.find({id: {$in: ids}}).limit(500);
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

module.exports.updateCoin = updateCoin;
module.exports.getCoinsByTickers = getCoinsByTickers;
module.exports.getCoinsByIds = getCoinsByIds;