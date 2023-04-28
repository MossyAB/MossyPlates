const Command = require("../Structures/Command");
const Discord = require('discord.js');
const Config = require("../Data/config.json");

var https = require('follow-redirects').https;
var fs = require('fs');
const { type } = require('os');

var Options = {
    method: 'POST',
    hostname: 'driver-vehicle-licensing.api.gov.uk',
    path: '/vehicle-enquiry/v1/vehicles',
    headers: {
      'x-api-key': Config.APIKey,
      'Content-Type': 'application/json',
    },
    maxRedirects: 20,
  };

  function fetchData(LP, message) {
    return new Promise((resolve, reject) => {
      const req = https.request(Options, function(res) {
        let chunks = [];

        res.on('data', function(chunk) {
          chunks.push(chunk);
        });

        res.on('end', function() {
          let body = Buffer.concat(chunks);
          let text = body.toString();

          if(text.includes("error")){
            message.reply("Unable To Find Plate: " + LP + "\nMake Sure You Have No Spaces!");
            return;
          }

          const jsonString = text;

          const carData = JSON.parse(jsonString);

          let data = {
            LicencePlate: carData.registrationNumber,
            Tax: carData.taxStatus,
            TaxDate: carData.taxDueDate,
            MOT: carData.motStatus,
            Make: carData.make,
            Year: carData.yearOfManufacture,
            EngineCapacity: carData.engineCapacity + " CC",
            co2: carData.co2Emissions,
            Fuel: carData.fuelType,
            Colour: carData.colour,
            MOTDate: carData.motExpiryDate,
            FirstRegistered: carData.monthOfFirstRegistration
          };

          resolve(data);
        });

        res.on('error', function(error) {
          reject(error);
        });
      });

      let postData = JSON.stringify({ registrationNumber: LP });
      req.write(postData);
      req.end();
    });
  }

module.exports = new Command({
    name: "plate",
    description: "Details about a plate",
    permission: "SEND_MESSAGES",
    aliases: "np",
    async run(message, args, client){

        if(args.length < 2){
            message.reply("What plate do you want to check?");
            return;
        }

        LP = args[1];

        try{
            const data = await fetchData(LP, message);

            const embed = new Discord.MessageEmbed()
                .setAuthor(data.LicencePlate)
                .setTitle("Searched By: " + message.author.username)
                .setDescription("**Tax Status:** " + data.Tax + "\n" +
                    "**Tax Date:** " + data.TaxDate + "\n" +
                    "**MOT Status:** " + data.MOT + "\n" +
                    "**MOT Date:** " + data.MOTDate + "\n" +
                    "**Make:** " + data.Make + "\n" +
                    "**Year:** " + data.Year + "\n" +
                    "**Engine Capacity:** " + data.EngineCapacity + "\n" +
                    "**Colour:** " + data.Colour + "\n" +
                    "**CO2:** " + data.co2 + "\n" +
                    "**Fuel:** " + data.Fuel + "\n" +
                    "**First Registered:** " + data.FirstRegistered + "\n")
                .setColor("#00b0f4")
                .setFooter("MossyBot")
                .setTimestamp();



            await message.reply({ embeds: [embed] });
        }
        catch(error){
            console.error(error);
        }
        
    }
})