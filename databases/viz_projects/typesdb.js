const db = require('./../@db.js');

async function addType(name) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('types');

        let res = await collection.insertOne({name});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

        
    }
}

async function getTypes() {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('types');
        const res = [];
        let cursor = await collection.find({}).limit(100);
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

async function deleteType(name) {

    const client = await db.getClient();
  
  if (!client) {
      return;
  }
  
  try {
  
      const db = client.db("viz_projects");
  
      let collection = db.collection('types');
  
      let res = await collection.deleteMany({creator, name});
  
  return res;
  
  } catch (err) {
  
      console.log(err);
  return err;
    } finally {
  
      
  }
  }

module.exports.addType = addType;
module.exports.getTypes = getTypes;
module.exports.deleteType = deleteType;