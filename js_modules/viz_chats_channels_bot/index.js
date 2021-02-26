const botjs = require("./bot");
const chatsdb = require(process.cwd() + "/databases/viz_chats_channels_bot/chatsdb");
const channelsdb = require(process.cwd() + "/databases/viz_chats_channels_bot/channelsdb");
const helpers = require("../helpers");

async function run() {
        let chats = await helpers.getBody('https://telegram.viz.world/api/groups');
        let channels = await helpers.getBody('https://telegram.viz.world/api/channels');
        let res = {};
        res['chats'] = JSON.parse(chats);
        res['channels'] = JSON.parse(channels);
        if (res['chats']) {
                let content_counter = 0;
                let msg_counter = 0;
                let content = [];
                content[0] = `New chats - Новые чаты:`;
                for (let el of res['chats']) {
                        let db_res = await chatsdb.getChat(el.name);
                        if (!db_res) {
                                content_counter++;
                                let chunk = `

                                ${content_counter}. <a href="https://telegram.viz.world/@${el.name}">@${el.name}</a>
Description - Описание:
${el.descr}`;
                                if (content[msg_counter].length + chunk.length >= 4096) {
                                msg_counter++;
                                content[msg_counter] = '';
                                }
                                content[msg_counter] += chunk;
                       }
await chatsdb.updateChat(el.id, el.name, el.title, el.descr);
                    }

                    if (content_counter > 0) {
                        for (let text of content) {
                                await botjs.sendMSG(-1001396750173, text);
                        }
                    }
               } // end chats.

               await helpers.sleep(3000);

               if (res['channels']) {
                let content_counter = 0;
                let msg_counter = 0;
                let content = [];
                content[0] = `New channels - Новые каналы:`;
                for (let el of res['channels']) {
                        let db_res = await channelsdb.getChannel(el.name);
                        if (!db_res) {
                                content_counter++;
                                let chunk = `

                                ${content_counter}. <a href="https://telegram.viz.world/@${el.name}">@${el.name}</a>
Description - Описание:
${el.descr}`;
                                if (content[msg_counter].length + chunk.length >= 4096) {
                                msg_counter++;
                                content[msg_counter] = '';
                                }
                                content[msg_counter] += chunk;
                       }
await channelsdb.updateChannel(el.id, el.name, el.title, el.descr);
                    }

                    if (content_counter > 0) {
                        for (let text of content) {
                                await botjs.sendMSG(-1001396750173, text);
                        }
                    }
               } // end channels.
}

botjs.startMSG();

module.exports.run = run;