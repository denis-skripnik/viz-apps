const pool = require('./../@db.js')

async function getHashById(id) {
	let client = await pool.getClient()

	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('ftq');

		let res = await collection.findOne({
			id
		});
		if (!res) res = {};
		return res;
	} catch (err) {

		return err;
	} finally {

	}
}

async function getHashData(hash) {
	let client = await pool.getClient()

	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('ftq');

		let res = await collection.findOne({
			hash
		});

		return res;
	} catch (err) {

		return err;
	} finally {

	}
}

async function updateHashData(hash, text, id) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('ftq');

		let res = await collection.updateOne({
			hash,
			id
		}, {
			$set: {
				hash,
				text,
				id
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

async function removeHashData(id) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('ftq');

		let res = await collection.deleteMany({
			id
		});

		return res;

	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

module.exports.getHashById = getHashById;
module.exports.getHashData = getHashData;
module.exports.updateHashData = updateHashData;
module.exports.removeHashData = removeHashData;