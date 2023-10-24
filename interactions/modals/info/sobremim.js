const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");
const { db } = require("../../../mongodb/user.js");

module.exports = {
  customId: "mudar-sobremim",
  run: async function(interaction, id){

    let sobremim = interaction.data.components[0].components[0].value;

  //  console.log(sobremim)

    let userdb = await db.findOne({
         userID: interaction.member.user.id
     })
      
     if(!userdb){
         const newuser = new db({ userID: interaction.member.user.id })
         await newuser.save();
         
         userdb = await db.findOne({ userID: interaction.member.user.id })
     }

    await db.updateOne({
         userID: interaction.member.user.id
     }, { $set: {
  "perfil.sobremim": sobremim
     }
     })

    await DiscordRequest(CALLBACK.interaction.response(
        interaction.id, interaction.token
      ), {
        method: 'POST',
        body: {
          type: 4,
          data: {
            content: `Seu sobremim foi atualizado pra: **\`${sobremim}\`**!\nUtilize o comando novamente para visualizar.`,
            flags: 64
          }
        }
      })
    
  }
}