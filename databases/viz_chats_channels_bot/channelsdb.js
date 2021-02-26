const db = require('./../@db.js');

async function getChannel(name) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_channels_channels_bot");

        let collection = db.collection('channels');

        let res = await collection.findOne({name});

return res;
    } catch (err) {

return err;
    } finally {

    
    }
}

async function updateChannel(id, name, title, descr) {

    const client = await db.getClient();

  if (!client) {
      return;
  }

  try {

      const db = client.db("viz_channels_channels_bot");

      let collection = db.collection('channels');

      let res = await collection.updateOne({id}, {$set: {id, name, title, descr}}, {upsert:true});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

 
  }
}

async function removeChannel(id) {

    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz_channels_channels_bot");

    let collection = db.collection('channels');

    let res = await collection.deleteOne({id});

return res;

} catch (err) {

    console.log(err);
return err;
  } finally {

 
}
}

async function findAllChannels() {
    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz_channels_channels_bot");

    let collection = db.collection('channels');

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

module.exports.getChannel = getChannel;
module.exports.updateChannel = updateChannel;
module.exports.removeChannel = removeChannel;
module.exports.findAllChannels = findAllChannels;