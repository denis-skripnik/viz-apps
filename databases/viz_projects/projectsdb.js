const db = require('./../@db.js');

async function addProject(creator, name, description, image_link, type, category, dev_status, command, site, github) {

    const client = await db.getClient();

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

        
    }
}

async function getProject(creator, name) {

    const client = await db.getClient();

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

        
    }
}

async function getProjects(query, page) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('projects');
        if (isNaN(page) || !isNaN(page) && page <= 0) return;
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

async function updateProject(creator, name, new_name, description, image_link, type, category, dev_status, command, site, github) {

    const client = await db.getClient();

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

       
    }
}

async function deleteProjects(creator, name) {

    const client = await db.getClient();
  
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
  
      
  }
  }

module.exports.addProject = addProject;
module.exports.getProject = getProject;
module.exports.getProjects = getProjects;
module.exports.updateProject = updateProject;
module.exports.deleteProjects = deleteProjects;