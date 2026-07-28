const pool = require('./../@db.js')

async function getShares() {
    let client = await pool.getClient()
    if (!client) {
        return;
    }

    try {

        const db = client.db("mg_bot");

        let collection = db.collection('shares');

        let res = await collection.findOne({});

return res;
    } catch (err) {

return err;
    } finally {

    }
}

async function updateShares(amount) {

    let client = await pool.getClient()

  if (!client) {
      return;
  }

  try {

      const db = client.db("mg_bot");

      let collection = db.collection('shares');

      let query = {$inc: {amount}};
if (amount === 0) query = {$set: {amount}};
  let res = await collection.updateOne({}, query, { upsert: true });
  
return res;

  } catch (err) {

      console.log(err);
  return err;
    } finally {

  }
}

module.exports.getShares = getShares;
module.exports.updateShares = updateShares;