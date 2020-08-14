const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function addCategory(name) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

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

        client.close();
    }
}

async function getCategories() {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

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
  
        client.close();
    }
}

async function deleteCategory(name) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });
  
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
  
      client.close();
  }
  }

module.exports.addCategory = addCategory;
module.exports.getCategories = getCategories;
module.exports.deleteCategory = deleteCategory;