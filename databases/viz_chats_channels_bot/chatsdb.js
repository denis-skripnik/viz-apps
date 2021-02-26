const db = require('./../@db.js');

async function getChat(name) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_chats_channels_bot");

        let collection = db.collection('chats');

        let res = await collection.findOne({name});

return res;
    } catch (err) {

return err;
    } finally {

    
    }
}

async function updateChat(id, name, title, descr) {

    const client = await db.getClient();

  if (!client) {
      return;
  }

  try {

      const db = client.db("viz_chats_channels_bot");

      let collection = db.collection('chats');

      let res = await collection.updateOne({id}, {$set: {id, name, title, descr}}, {upsert:true});

return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

 
  }
}

async function removeChat(id) {

    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz_chats_channels_bot");

    let collection = db.collection('chats');

    let res = await collection.deleteOne({id});

return res;

} catch (err) {

    console.log(err);
return err;
  } finally {

 
}
}

async function findAllChats() {
    const client = await db.getClient();

if (!client) {
    return;
}

try {

    const db = client.db("viz_chats_channels_bot");

    let collection = db.collection('chats');

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

module.exports.getChat = getChat;
module.exports.updateChat = updateChat;
module.exports.removeChat = removeChat;
module.exports.findAllChats = findAllChats;