const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

async function addProject(creator, name, description, image_link, type, category, dev_status, command, site, github) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('projects');

        let res = await collection.insertOne({creator, name, description, image_link, type, category, dev_status, command, site, github});

return res;

    } catch (err) {

        console.log(err);
    return err;
      } finally {

        client.close();
    }
}

async function getProject(creator, name) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('projects');

        let res = await collection.findOne({creator, name});

return res;
    } catch (err) {

return err;
    } finally {

        client.close();
    }
}

async function getProjects(query, page) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('projects');
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

async function updateProject(creator, name, new_name, description, image_link, type, category, dev_status, command, site, github) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
        .catch(err => { console.log(err); });

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('projects');

              let res = await collection.updateOne({creator, name}, {$set: {creator, name: new_name, description, image_link, type, category, dev_status, command, site, github}}, {});

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {

        client.close();
    }
}

async function deleteProjects(creator, name) {

    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
      .catch(err => { console.log(err); });
  
  if (!client) {
      return;
  }
  
  try {
  
      const db = client.db("viz_projects");
  
      let collection = db.collection('projects');
  
      let res = await collection.deleteMany({creator, name});
  
  return res;
  
  } catch (err) {
  
      console.log(err);
  return err;
    } finally {
  
      client.close();
  }
  }

module.exports.addProject = addProject;
module.exports.getProject = getProject;
module.exports.getProjects = getProjects;
module.exports.updateProject = updateProject;
module.exports.deleteProjects = deleteProjects;