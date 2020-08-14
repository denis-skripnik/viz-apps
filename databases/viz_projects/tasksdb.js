const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function addTask(creator, name, description, mambers, status) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('tasks');

        let res = await collection.insertOne({creator, name, description, mambers, status});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

        client.close();
    }
}

async function getTask(creator, name) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('tasks');

        let res = await collection.findOne({creator, name});

return res;
    } catch (err) {

return err;
    } finally {

        client.close();
    }
}

async function getTasks(query, page) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('tasks');
        let skip = page * 10 - 10;

        const res = [];
        let cursor = await collection.find(query).skip(skip).limit(10);
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

async function updateTask(creator, name, new_name, description, mambers, status) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('tasks');

              let res = await collection.updateOne({creator, name}, {$set: {creator, name: new_name, description, mambers}}, {});

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {

        client.close();
    }
}

async function deleteTasks(creator, name) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });
  
  if (!client) {
      return;
  }
  
  try {
  
      const db = client.db("viz_projects");
  
      let collection = db.collection('tasks');
  
      let res = await collection.deleteMany({creator, name});
  
  return res;
  
  } catch (err) {
  
      console.log(err);
  return err;
    } finally {
  
      client.close();
  }
  }

module.exports.addTask = addTask;
module.exports.getTask = getTask;
module.exports.getTasks = getTasks;
module.exports.updateTask = updateTask;
module.exports.deleteTasks = deleteTasks;