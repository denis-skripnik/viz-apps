const methods = require("./methods");
const pdb = require("../databases/pricesdb");
const axios = require('axios')

async function getPrices() {
    let accs = await methods.getAccounts(['mnt.quotes.bank.viz.plus', 'gph.quotes.bank.viz.plus']);
    if (accs[0] && accs[1]) {
    let prices = {};
        let custom_sequence_block_num1 = accs[0].custom_sequence_block_num;
    let custom_sequence_block_num2 = accs[1].custom_sequence_block_num;
if (custom_sequence_block_num1 === custom_sequence_block_num2) {
    const block = await methods.getOpsInBlock(custom_sequence_block_num1);
        for(let tr of block) {
            const [op, opbody] = tr.op;
            switch(op) {
                case "custom":
                    if (opbody.id !== 'vizplus_exchange_info') continue;
                let data = JSON.parse(opbody.json);
                    prices[data[0]] = {average_ask_price: parseFloat(data[1].average_ask_price), quote: data[1].quote, base_depth: parseFloat(data[1].base_depth), average_bid_price: parseFloat(data[1].average_bid_price), datetime: data[1].time_utc}
                break;
    default:
                        //неизвестная команда
                }
            }    
        } else { // block1 !== block2.
            const block = await methods.getOpsInBlock(custom_sequence_block_num1);
                for(let tr of block) {
                    const [op, opbody] = tr.op;
                    switch(op) {
                        case "custom":
                            if (opbody.id !== 'vizplus_exchange_info') continue;    
                        let data = JSON.parse(opbody.json);
                        prices[data[0]] = {average_ask_price: parseFloat(data[1].average_ask_price), quote: data[1].quote, base_depth: parseFloat(data[1].base_depth), average_bid_price: parseFloat(data[1].average_bid_price), datetime: data[1].time_utc}
                        break;
            default:
                                //неизвестная команда
                        }
                    }

                    const block2 = await methods.getOpsInBlock(custom_sequence_block_num2);
                        for(let tr of block2) {
                            const [op, opbody] = tr.op;
                            switch(op) {
                                case "custom":
                                    if (opbody.id !== 'vizplus_exchange_info') continue;    
                                let data = JSON.parse(opbody.json);
                                prices[data[0]] = {average_ask_price: parseFloat(data[1].average_ask_price), quote: data[1].quote, base_depth: parseFloat(data[1].base_depth), average_bid_price: parseFloat(data[1].average_bid_price), datetime: data[1].time_utc}
                                break;
                    default:
                                        //неизвестная команда
                                }
                            }

        } // end if blocks.
        
        let datetime = new Date().toISOString();
let average_ask_price = 0;
let average_bid_price = 0;
for (let chain in prices) {
average_ask_price += prices[chain].average_ask_price;
average_bid_price += prices[chain].average_bid_price ;
}
average_ask_price /= Object.keys(prices).length;
average_bid_price  /= Object.keys(prices).length;
average_ask_price = parseFloat(average_ask_price.toFixed(5));
average_bid_price = parseFloat(average_bid_price.toFixed(5));

prices['result'] = {average_ask_price, quote: 'VIZ', base_depth: 100, average_bid_price, datetime}


await pdb.updatePrices(prices);
}
}

module.exports.getPrices = getPrices;