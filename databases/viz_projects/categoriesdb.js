const db = require('./../@db.js');

async function addCategory(name) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('categories');

        let res = await collection.insertOne({name});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

        
    }
}

async function getCategories() {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('categories');
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

async function deleteCategory(name) {

    const client = await db.getClient();
  
  if (!client) {
      return;
  }
  
  try {
  
      const db = client.db("viz_projects");
  
      let collection = db.collection('categories');
  
      let res = await collection.deleteMany({creator, name});
  
  return res;
  
  } catch (err) {
  
      console.log(err);
  return err;
    } finally {
  
      
  }
  }

module.exports.addCategory = addCategory;
module.exports.getCategories = getCategories;
module.exports.deleteCategory = deleteCategory;