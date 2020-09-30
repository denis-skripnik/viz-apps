const db = require('./../@db.js');

async function getCommittee(id) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_committee_bot");

        let collection = db.collection('requests');

        let res = await collection.findOne({id});

return res;
    } catch (err) {

return err;
    } finally {

    
    }
}

async function addUser(data) {

    const client = await db.getClient();

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


    }
}

async function updateCommittee(id, creator, url, worker, required_amount_min, required_amount_max, end) {

    const client = await db.getClient();

  if (!client) {
      return;
  }

  try {

      const db = client.db("viz_committee_bot");

      let collection = db.collection('requests');

      let res = await collection.updateOne({id}, {$set: {id, creator, url, worker, required_amount_min, required_amount_max, end}}, {upsert:true});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

 
  }
}

async function removeCommittee(_id) {

    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz_committee_bot");

    let collection = db.collection('requests');

    let res = await collection.deleteOne({_id});

return res;

} catch (err) {

    console.log(err);
return err;
  } finally {

 
}
}

async function findAllCommittee() {
    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz_committee_bot");

    let collection = db.collection('requests');

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

module.exports.getCommittee = getCommittee;
module.exports.updateCommittee = updateCommittee;
module.exports.removeCommittee = removeCommittee;
module.exports.findAllCommittee = findAllCommittee;