const wrdb = require("../databases/wrdb");

async function witnessRewardOperation(opbody, timestamp) {
    try {
          let shares = parseFloat(opbody.shares);
          let witness = await wrdb.getWitness(opbody.witness);
          let now_monthly_profit = shares;
      let now_daily_profit = shares;
      let old_monthly_profit = 0;
      let old_daily_profit = 0;
      let month = timestamp.split('-')[1];
      let day = timestamp.split('-')[2].split('T')[0];
      if (witness && witness.timestamp.split('-')[1] === month && witness.timestamp.split('-')[2].split('T')[0] === day) {
              now_monthly_profit += witness.now_monthly_profit;
              now_daily_profit += witness.now_daily_profit;
              old_monthly_profit = witness.old_monthly_profit;
              old_daily_profit = witness.old_daily_profit;
          } else if (witness && witness.timestamp.split('-')[1] === month && witness.timestamp.split('-')[2].split('T')[0] !== day) {
              now_monthly_profit += witness.now_monthly_profit;
              old_monthly_profit = witness.old_monthly_profit;
              old_daily_profit = witness.now_daily_profit;
          } else if (witness && witness.timestamp.split('-')[1] !== month && witness.timestamp.split('-')[2].split('T')[0] !== day) {
              old_monthly_profit = witness.now_monthly_profit;
              old_daily_profit = witness.now_daily_profit;
                  }
              await wrdb.updateWitness(opbody.witness, old_monthly_profit, now_monthly_profit, old_daily_profit, now_daily_profit, timestamp);
    return 1;
            } catch(e) {
        console.log('Ошибка в witness_rewards: ' + JSON.stringify(e));
    return 0;
    }
    }

    async function producersMonth() {
        let witnesses = await wrdb.findAllWitnesses();
        if (witnesses && witnesses.length > 0) {
            for (let witness of witnesses) {
    let now_daily_profit = 0;
    let now_monthly_profit = 0;
    let timestamp = new Date().toISOString().split('.')[0];
                await wrdb.updateWitness(witness.login, witness.old_monthly_profit, now_monthly_profit, witness.old_daily_profit, now_daily_profit, timestamp);
            }
        }
    }
    
    async function producersDay() {
        let witnesses = await wrdb.findAllWitnesses();
        if (witnesses && witnesses.length > 0) {
            for (let witness of witnesses) {
    let now_daily_profit = 0;
    let timestamp = new Date().toISOString().split('.')[0];
                await wrdb.updateWitness(witness.login, witness.old_monthly_profit, witness.now_monthly_profit, witness.old_daily_profit, now_daily_profit, timestamp);
            }
        }
    }
    
module.exports.witnessRewardOperation = witnessRewardOperation;
module.exports.producersMonth = producersMonth;
module.exports.producersDay = producersDay;