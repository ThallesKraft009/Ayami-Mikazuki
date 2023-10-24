const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");
const { db } = require("../../../mongodb/user.js");

module.exports = {
  customId: "perfil",
  run: async function(interaction, id) {
   // console.log(interaction)

    let verf = id.replace("perfil_", "");
    if (interaction.member.user.id !== verf){
     await DiscordRequest(
        CALLBACK.interaction.response(
          interaction.id, interaction.token
        ), { 
      method: 'POST',
      body: {
        type: 4,
        data: {
          content: `Espere um minutinho... Você não é <@${verf}>! Sai daqui!`,
          flags: 64
        }
      }
      })
    }

   // console.log(interaction)

    let userdb = await db.findOne({
         userID: interaction.member.user.id
     })
      
     if(!userdb){
         const newuser = new db({ userID: interaction.member.user.id })
         await newuser.save();
         
         userdb = await db.findOne({ userID: interaction.member.user.id })
     }

    let option = interaction.data.values[0];

    if (option === "0"){

      let modal = {
        title: "Mudanças de Sobremim",
        custom_id: "mudar-sobremim",
        components: [{
          type: 1,
          components: [{
            type: 4,
            custom_id: "x",
            label: "Insira seu Sobremim",
            placeholder: `${userdb.perfil.sobremim}`,
            style: 2
          }]
        }]
      };

           await DiscordRequest(CALLBACK.interaction.response(
      interaction.id, interaction.token
      ), {
         method: "POST",
         body: {
           type: 9,
           data: modal
         }
      }
    )
    }
    
  }
          }