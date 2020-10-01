const db = require('./../@db.js');

async function getWorkingTasks(query, page) {

    const client = await db.getClient();

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
  

    }
}

async function updateWorkingTask(task_creator, task_name, user, date, text) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('working_tasks');

              let res = await collection.updateOne({task_creator, task_name, user, date}, {$set: {task_creator, task_name, user, date, text}}, { upsert: true });

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {


    }
}

async function deleteWorkingTasks(data) {

    const client = await db.getClient();
  
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
  
  }
  }
  
module.exports.getWorkingTasks = getWorkingTasks;
module.exports.updateWorkingTask = updateWorkingTask;
module.exports.deleteWorkingTasks = deleteWorkingTasks;