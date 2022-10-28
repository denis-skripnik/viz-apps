const db = require('./../@db.js');

async function addPost(author, block) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db('viz_projects');

        let collection = db.collection('posts');

        let res = await collection.insertOne({author, block, power: 0});

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {


    }
}

async function getPost(author, block) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db('viz_projects');

        let collection = db.collection('posts');

        let query = {author, block}

        let res = await collection.findOne(query);

        if (res) {
return res;
}
    } catch (err) {

return err;
    } finally {

        
    }
}

async function updatePost(author, block, power) {

    const client = await db.getClient();

    if (!client) {
        return;
    }

    try {

        const db = client.db('viz_projects');

        let collection = db.collection('posts');

        let res = await collection.updateOne({author, block}, {$set: {author, block, power}}, {});

return res;
    } catch (err) {

        console.log(err);
    return err;
      } finally {


    }
}

module.exports.addPost = addPost;
module.exports.getPost = getPost;
module.exports.updatePost = updatePost;