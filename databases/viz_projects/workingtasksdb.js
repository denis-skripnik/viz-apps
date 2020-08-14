const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function getWorkingTasks(query, page) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('working_tasks');
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

async function updateWorkingTask(task_creator, task_name, user, date, text) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('working_tasks');

              let res = await collection.updateOne({task_creator, task_name, user, date}, {$set: {task_id, user, date, text}}, { upsert: true });

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {

        client.close();
    }
}

async function deleteWorkingTasks(data) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });
  
  if (!client) {
      return;
  }
  
  try {
  
      const db = client.db("viz_projects");
  
      let collection = db.collection('working_tasks');
  
      let res = await collection.deleteMany(data);
  
  return res;
  
  } catch (err) {
  
      console.log(err);
  return err;
    } finally {
  
      client.close();
  }
  }
  
module.exports.getWorkingTasks = getWorkingTasks;
module.exports.updateWorkingTask = updateWorkingTask;
module.exports.deleteWorkingTasks = deleteWorkingTasks;