const Event = require("../Structures/Event");


module.exports = new Event("ready", async(client) => {
    console.log("Bot Started")
    client.user.setActivity('Traffic.', {type : 'WATCHING'});

});