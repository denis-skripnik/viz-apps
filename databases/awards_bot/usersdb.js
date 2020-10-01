const db = require('./../@db.js');

async function getUser(userId) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_awards_bot");

        let collection = db.collection('users');

        let res = await collection.findOne({uid: userId});

return res;
    } catch (err) {

return err;
    } finally {


    }
}

async function addUser(uid, username, subscribe, stopped, state, lang) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_awards_bot");

        let collection = db.collection('users');

        let res = await collection.insertOne({uid, username, subscribe, stopped, state, lang});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

    }
}

async function updateUser(uid, username, subscribe, stopped, state, lang) {

    const client = await db.getClient();

  if (!client) {
      return;
  }

  try {

      const db = client.db("viz_awards_bot");

      let collection = db.collection('users');

      let res = await collection.updateOne({uid}, {$set: {uid, username, subscribe, stopped, state, lang}}, {});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {


  }
}

async function removeUser(tg_id) {

    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz_awards_bot");

    let collection = db.collection('users');

    let res = await collection.deleteOne({uid: tg_id});

return res;

} catch (err) {

    console.log(err);
return err;
  } finally {


}
}

async function findAllUsers() {
    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz_awards_bot");

    let collection = db.collection('users');

    const res = [];
    let cursor = await collection.find({}).limit(500);
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
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.removeUser = removeUser;
module.exports.findAllUsers = findAllUsers;