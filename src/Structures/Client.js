const Discord = require("discord.js");

const fs = require("fs");

const Command = require("./Command.js");

const Event = require("./Event.js");

const Config = require("../Data/config.json");


const AllIntents = new Discord.Intents(32767);


class Client extends Discord.Client{
    constructor(){
        super({ intents: [AllIntents], allowedMentions: {repliedUser: false}});

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
    }

    async start(){



        fs.readdirSync("./src/Commands").filter(file => file.endsWith(".js")).forEach(file => {
            /**
             * @type {Command}
             */
            const command = require(`../Commands/${file}`);
        
            console.log(`Command ${command.name} loaded`);
        
            this.commands.set(command.name, command);
            
        });


        fs.readdirSync("./src/Events").filter(file => file.endsWith(".js")).forEach(file => {
            /**
             * @type {Event}
             */
            const event = require(`../Events/${file}`);
            console.log(`Event ${event.event} loaded`);
            this.on(event.event, event.run.bind(null, this));
        });


        
        this.login(Config.Token);
    }
}

module.exports = Client;