const pool = require('./../@db.js')

async function getGameSession(id, level) {
	let client = await pool.getClient()

	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('bools_and_cows');

		let res = await collection.findOne({
			id,
			level
		});
		
		if (!res) res = {};
		return res;
	} catch (err) {

		return err;
	} finally {

	}
}

async function addGameSession(id, level, number) {
    let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("mg_bot");

        let collection = db.collection('bools_and_cows');

        let res = await collection.insertOne({id, level, number, stap: 0, text: ''});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function updateGameSession(id, level, text) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('bools_and_cows');

		let res = await collection.updateOne({
			id,
			level
		}, {
			$set: {
				id,
				level,
				text
			},
			$inc: {
				stap: 1
			}
		}, {});

		return res;

	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

async function removeGameSession(id, level) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('bools_and_cows');

		let res = await collection.deleteOne({
			id,
			level
		});

		return res;

	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

module.exports.getGameSession = getGameSession;
module.exports.addGameSession = addGameSession;
module.exports.updateGameSession = updateGameSession;
module.exports.removeGameSession = removeGameSession;