const pool = require('./../@db.js')

async function getRing(timestamp) {
	let client = await pool.getClient()

	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('ring');

		let res = await collection.findOne({
			timestamp
		});
		if (!res) res = {};
		return res;
	} catch (err) {

		return err;
	} finally {

	}
}

async function findAllRings(page, query = {}) {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("mg_bot");

    let collection = db.collection('ring');

	let skip = page * 9 - 9;
   let res = [];
    let cursor = await collection.find(query).skip(skip).limit(9);
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


async function updateRing(data) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('ring');


		let res = await collection.updateOne({
			timestamp: data.timestamp
		}, {
			$set: data
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

async function removeRing(timestamp) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('ring');

if (timestamp === -1) {
	let res = await collection.deleteMany({});
	return res;
} else {
	let res = await collection.deleteOne({
		timestamp
	});
	return res;
}
	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

module.exports.getRing = getRing;
module.exports.findAllRings = findAllRings;
module.exports.updateRing = updateRing;
module.exports.removeRing = removeRing;