const Event = require("../Structures/Event");

module.exports = new Event("messageCreate", (client, message) => {
    if(message.author.bot)return;
    
    if(message.mentions.users.first() == client.user){

        console.log("Message: " + message);


        const args = message.content.split(' ');

        args.shift();

        const command = client.commands.find(cmd => cmd.name == args[0]);

        if(!command) return message.channel.send(`${args[0]} is not a valid command!`);
        
        const permission = message.member.permissions.has(command.permission, true);

        if(!permission) return message.channel.send("You canny do that!");

        command.run(message, args, client);
    }
});