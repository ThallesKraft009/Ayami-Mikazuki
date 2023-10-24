const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");
const { db } = require("../../../mongodb/user.js");
const { QuickDB } = require("quick.db");
const quickdb = new QuickDB();

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
let userId = await quickdb.get(`perfilSelect_${interaction.member.user.id}`)
    

   // console.log(interaction)

    let userdb = await db.findOne({
         userID: userId
     })
      
     if(!userdb){
         const newuser = new db({ userID: userId })
         await newuser.save();
         
         userdb = await db.findOne({ userID: userId })
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
    } else if (option === "1"){

      let time = userdb.economia.daily_time;
      let texto = "";
      if (time === 0) {
        texto = `O usuário já pode coletar o Daily novamente.`
      } else {

        const calc = time - Date.now();
        
        texto = `${ms(calc).hours} horas, ${ms(calc).minutes} minutos e ${ms(calc).seconds} segundos.`;
      }

      let embed = {
        title: "Cooldowns em Andamento",
        fields: [{
          name: "Tempo de Daily",
          value: `\`${texto}\``
        }],
        color: 16776960
      };

      
      await DiscordRequest(CALLBACK.interaction.response(
      interaction.id, interaction.token
      ), {
         method: "POST",
         body: {
           type: 4,
           data: {
             content: `<@${interaction.member.user.id}>`,
             embeds: [embed],
             flags: 64
           }
         }
      }
    )
    }
  }
}


      function ms(ms) {
  const seconds = ~~(ms/1000)
  const minutes = ~~(seconds/60)
  const hours = ~~(minutes/60)
  const days = ~~(hours/24)

  return { days, hours: hours%24, minutes: minutes%60, seconds: seconds%60 }
                                               }