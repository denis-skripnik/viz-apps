const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://127.0.0.1:27017';

async function getUser(userId) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_committee_bot");

        let collection = db.collection('users');

        let res = await collection.findOne({uid: userId});

return res;
    } catch (err) {

return err;
    } finally {

        client.close();
    }
}

async function addUser(data) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_committee_bot");

        let collection = db.collection('users');

        let res = await collection.insertOne(data);

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

        client.close();
    }
}

async function updateUser(uid, data) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });

  if (!client) {
      return;
  }

  try {

      const db = client.db("viz_committee_bot");

      let collection = db.collection('users');

      let res = await collection.updateOne({uid}, {$set: data}, {});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

      client.close();
  }
}

async function removeUser(tg_id) {

  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => { console.log(err); });

if (!client) {
    return;
}

try {

    const db = client.db("viz_committee_bot");

    let collection = db.collection('users');

    let res = await collection.deleteOne({uid: tg_id});

return res;

} catch (err) {

    console.log(err);
return err;
  } finally {

    client.close();
}
}

async function findAllUsers() {
  const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
    .catch(err => { console.log(err); });

if (!client) {
    return;
}

try {

    const db = client.db("viz_committee_bot");

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

    client.close();
}
}

module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.updateUser = updateUser;
module.exports.removeUser = removeUser;
module.exports.findAllUsers = findAllUsers;