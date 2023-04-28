const Event = require("../Structures/Event");
const Config = require("../Data/config.json");

const Prefix = Config.Prefix;

module.exports = new Event("messageCreate", (client, message) => {

    //Checks if a prefix can be found
    if(!Prefix){
        message.reply("Well Done! You Have Broken Your Prefix! Check your config.json File!");
        return;
    }

    //Ignores the message if it came from a bot
    if(message.author.bot){
        return;
    }
    //Ignores the message if it doesn't start with the prefix
    if(!message.content.startsWith(Prefix)){
        return;
    }
    //Creates the arguements to be used by commands
    const args = message.content.slice(Prefix.length).split(' ');
    
    //Finds the command from the list of commands for the bot
    var command = client.commands.find(cmd => cmd.name == args[0]);
    
    //Finds the command alias from the list of commands for the bot
    if(!command) command = client.commands.find(cmd => cmd.aliases == args[0]);
    
    //Checks if the command is at all valid
    if(!command)return message.reply(`${args[0]} is not a valid command!`);
    
    //Checks if the user has the permission required by the command
    const permission = message.member.permissions.has(command.permission, true);

    //Tells a user to go away if they don't have permission
    if(!permission)return message.reply("You canny do that!");
    
    //Runs the command
    command.run(message, args, client);
});