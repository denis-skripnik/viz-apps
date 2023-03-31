const methods = require("./methods");
const udb = require("../databases/viz_usersdb");

async function updateAccounts(accs) {
if (accs[0] === '') accs = [accs[1]];
if (accs[1] === '') accs = [accs[0]];
	try {
	const params = await methods.getProps();
	const {total_vesting_fund, total_vesting_shares, current_supply, total_reward_fund} = params;
	const total_viz = parseFloat(total_vesting_fund.split(" ")[0]);
	const total_vests = parseFloat(total_vesting_shares.split(" ")[0]);
const all_viz = parseFloat(current_supply) - parseFloat(total_vesting_fund) - parseFloat(total_reward_fund);

			let get_accounts = await methods.getAccounts(accs);
			for (let b of get_accounts) {
			if (b) {
				await udb.updateTop(b.name,
	parseFloat(b.vesting_shares.split(" ")[0]),
	(parseFloat(b.vesting_shares.split(" ")[0]) / parseFloat(total_vests) * 100).toFixed(3),
	parseFloat(b.delegated_vesting_shares.split(" ")[0]),
	parseFloat(b.received_vesting_shares.split(" ")[0]),
	(parseFloat(b.vesting_shares.split(" ")[0]) - parseFloat(b.delegated_vesting_shares.split(" ")[0]) + parseFloat(b.received_vesting_shares.split(" ")[0])),
	parseFloat(b.vesting_withdraw_rate.split(' ')[0]),
	parseFloat(b.balance.split(" ")[0]),
	parseFloat(b.balance.split(" ")[0]) / parseFloat(all_viz) * 100);
				}
	
		}
		} catch (e) {
			console.error('Viz error: ' + JSON.stringify(e));
			process.exit(1);
			}
		
}

module.exports.updateAccounts = updateAccounts;