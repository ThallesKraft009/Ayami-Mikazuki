const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");
const { db } = require("../../../mongodb/user.js");

module.exports = {
  data: {
    name: "moedas",
    description: "Comandos relacionados a Moedas",
    type: 1,
    options: [{
      name: "daily",
      description: "Resgate suas Moedas diárias",
      type: 1
    },{
      name: "atm",
      description: "Veja quantas moedas você tem",
      type: 1,
      options: [{
        name: "membro",
        description: "Insira o ID ou mencione",
        type: 6,
        required: false
      }]
    }]
  },

  run: async function (interaction) {

   // console.log(interaction);
    let option = interaction.data.options[0].name;

    if (option === "daily"){
      let button = [{
      type: 1,
      components: [{
        label: "Resgatar Daily",
        custom_id: `daily_${interaction.member.user.id}`,
        style: 1,
        type: 2
      }]
    }];

      await DiscordRequest(
        CALLBACK.interaction.response(
          interaction.id, interaction.token
        ), { 
      method: 'POST',
      body: {
        type: 4,
        data: {
          content: `Resgate suas Moedas diárias \:D`,
        components: button
        }
      }
      })
    } else if (option === "atm"){

      let userId;
      //= interaction.data.options[0].options[0].value;

      if (interaction.data.options[0].options.length == 0){

        userId = interaction.member.user.id;
        
      } else {
        userId = interaction.data.options[0].options[0].value;
        
      }

      let userdb = await db.findOne({
         userID: userId
     })
      
     if(!userdb){
         const newuser = new db({ userID: userId })
         await newuser.save();
         
         userdb = await db.findOne({ userID: userId })
        }

        const rankedUsers = await db.find({
              "economia.moedas": { 
                $gt: 0 
              }
            })
                .sort({ 
                  "economia.moedas": -1 
                })
                .exec();
    
            let userPosition = rankedUsers.findIndex(user => user.userID === userdb.userID) + 1;

            if (userdb.economia.moedas === 0) {
           userPosition = rankedUsers.length + 1;
          }

      await DiscordRequest(
        CALLBACK.interaction.response(
          interaction.id, interaction.token
        ), {
          method: "POST",
          body: {
            type: 4,
            data: {
              content: `<@${userId}> tem **\`${userdb.economia.moedas}\`** moedas e está na posição #${userPosition} do rank!`
            }
          }
        }
      )
      
    }
  }
}