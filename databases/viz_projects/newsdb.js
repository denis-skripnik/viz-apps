const db = require('./../@db.js');

async function getNews(query, page) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('news');
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

async function updateNews(project_creator, project_name, user, date, title, description, text, image_link) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db("viz_projects");

        let collection = db.collection('news');

              let res = await collection.updateOne({project_creator, project_name, user, date}, {$set: {project_creator, project_name, user, date, title, description, text, image_link}}, { upsert: true });

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {


    }
}

async function deleteNews(data) {

    const client = await db.getClient();
  
  if (!client) {
      return;
  }
  
  try {
  
      const db = client.db("viz_projects");
  
      let collection = db.collection('projects');
  
      let res = await collection.deleteMany(data);
  
  return res;
  
  } catch (err) {
  
      console.log(err);
  return err;
    } finally {
  

  }
  }

module.exports.getNews = getNews;
module.exports.updateNews = updateNews;
module.exports.deleteNews = deleteNews;