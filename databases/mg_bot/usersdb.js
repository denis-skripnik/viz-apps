const { userInfo } = require('os');
const pool = require('./../@db.js')

async function getUser(id) {
    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("mg_bot");

        let collection = db.collection('users');

        let res = await collection.findOne({id});

return res;
    } catch (err) {

return err;
    } finally {

    }
}

async function getUserByRefererCode(referer_code) {

    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("mg_bot");

        let collection = db.collection('users');

        let res = await collection.findOne({referer_code});

return res;
    } catch (err) {

return err;
    } finally {

    }
}

async function addUser(id, names, lng, prev_status, status, send_time, scores, referers, referer_code, artifacts, prize, viz_login, tamagotchi) {
    let client = await pool.getClient()

    if (!client) {
        return;
    }

    try {

        const db = client.db("mg_bot");

        let collection = db.collection('users');

        let locked_scores = 0;
        let res = await collection.insertOne({id, names, lng, prev_status, status, send_time, scores, locked_scores, referers, referer_code, artifacts, prize, viz_login, tamagotchi, viz_scores: 0});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function updateUser(id, names, lng, prev_status, status, send_time, referers, referer_code, artifacts, prize, viz_login, viz_scores, tamagotchi) {

    let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("mg_bot");

      let collection = db.collection('users');

      let res = await collection.updateOne({id}, {$set: {id, names, lng, prev_status, status, send_time, referers, referer_code, artifacts, prize, viz_login, tamagotchi}}, {});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

  }
}

async function updateUserStatus(id, names, prev_status, status, send_time, scores = 0, locked_scores = 0, viz_scores = 0, tamagotchi) {

    let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("mg_bot");

      let collection = db.collection('users');

let set_params = {id, names, prev_status, status, send_time};
if (typeof tamagotchi !== 'undefined') set_params.tamagotchi = tamagotchi;

let res = await collection.updateOne({id}, {$set: set_params, $inc: {scores: parseFloat(scores.toString()), locked_scores: parseFloat(locked_scores.toString()), viz_scores: parseFloat(viz_scores.toString())}}, {});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

  }
}

async function plusFTCounter(id) {

    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("mg_bot");

        let collection = db.collection('users');

        let upd = {$inc:{ft_counter: 1}};
        let res = await collection.updateOne({id}, upd);

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {


    }
}

async function resetUsersScores() {

    let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("mg_bot");

      let collection = db.collection('users');

      let res = await collection.updateMany({}, {$set: {scores: 0, locked_scores: 0, ft_counter: 0}}, {});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

  }
}

async function removeUser(id) {

	let client = await pool.getClient()
	if (!client) {
		return;
	}

	try {

		const db = client.db("mg_bot");

		let collection = db.collection('users');

		let res = await collection.deleteOne({
			id
		});

		return res;

	} catch (err) {

		console.log(err);
		return err;
	} finally {

	}
}

async function findAllUsers(mode = 'array') {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("mg_bot");

    let collection = db.collection('users');

    let res;
if (mode === 'array') {
   res = [];
    let cursor = await collection.find({}).limit(500);
    let doc = null;
    while(null != (doc = await cursor.next())) {
        res.push(doc);
    }
} else if (mode === 'object') {
    res = {};
    let cursor = await collection.find({}).limit(500);
    let doc = null;
    while(null != (doc = await cursor.next())) {
        res[doc.id] = doc;
    }
}
    return res;
  } catch (err) {

    console.log(err);
return err;
  } finally {
}
}

async function getScoresTop() {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("mg_bot");

    let collection = db.collection('users');

    const res = [];
    let cursor = await collection.find({}).limit(500).sort({scores: -1});
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

async function getUsersByPrize(prize) {
    let client = await pool.getClient()

if (!client) {
    return;
}

try {

    const db = client.db("mg_bot");

    let collection = db.collection('users');

    const res = [];
    let cursor = await collection.find({prize}).limit(500);
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

module.exports.getUser = getUser;
module.exports.getUserByRefererCode = getUserByRefererCode;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.updateUserStatus = updateUserStatus;
module.exports.plusFTCounter = plusFTCounter;
module.exports.resetUsersScores = resetUsersScores;
module.exports.removeUser = removeUser;
module.exports.findAllUsers = findAllUsers;
module.exports.getScoresTop = getScoresTop;
module.exports.getUsersByPrize = getUsersByPrize;