const pool = require('./../@db.js')

async function getBTCPrice() {
	let client = await pool.getClient()

	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('btc_price');

		let res = await collection.findOne({});
		return res;
	} catch (err) {

		return err;
	} finally {

	}
}

async function updateBTCPrice(price, timestamp) {
	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('btc_price');

		let res = await collection.updateOne({}, {
			$set: {
				price,
				timestamp
			}
		}, {
			upsert: true
		});

		return res;

	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

async function addCryptoBid(id, scores, direction, btc_price) {
    let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("mg_bot");

        let collection = db.collection('crypto_bids');
		
		let timestamp = new Date().getTime();
        let res = await collection.insertOne({id, scores, direction, btc_price, timestamp});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function removeCryptoBids(id) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('crypto_bids');

if (!id) {
	let res = await collection.drop();

	return res;
} else {
	let res = await collection.deleteOne({id});

	return res;
}

	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

async function findCryptoBids(isObject = false,  query = {}) {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("mg_bot");

    let collection = db.collection('crypto_bids');

	if (isObject == true) {
		const res = {};
		let cursor = await collection.find(query).limit(500);
			let doc = null;
			while(null != (doc = await cursor.next())) {
		res[doc.id] = doc;
			}
			return res;
		} else {
			const res = [];
			let cursor = await collection.find(query).limit(500);
				let doc = null;
				while(null != (doc = await cursor.next())) {
res.push(doc);
				}
				return res;
		}
  } catch (err) {

    console.log('test find bids', err);
return err;
  } finally {
}
}

module.exports.getBTCPrice = getBTCPrice;
module.exports.updateBTCPrice = updateBTCPrice;
module.exports.addCryptoBid = addCryptoBid;
module.exports.removeCryptoBids = removeCryptoBids;
module.exports.findCryptoBids = findCryptoBids;