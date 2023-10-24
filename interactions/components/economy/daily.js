const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");
const { db } = require("../../../mongodb/user.js");
const tempo = require("ms")
module.exports = {
  customId: "daily",
  run: async function(interaction, id) {
   // console.log(interaction)

    let verf = id.replace("daily_", "");
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

    //Codigo

    let userdb = await db.findOne({
         userID: interaction.member.user.id
     })
      
     if(!userdb){
         const newuser = new db({ userID: interaction.member.user.id })
         await newuser.save();
         
         userdb = await db.findOne({ userID: interaction.member.user.id })
        }

    if (Date.now() < userdb.economia.daily_time){
      const calc = userdb.economia.daily_time - Date.now();

      await DiscordRequest(CALLBACK.interaction.response(
        interaction.id, interaction.token
      ), {
        method: 'POST',
        body: {
          type: 4,
          data: {
            content: `Espere um minutinho... você já resgatou seu daily! Volte novamente em: ${ms(calc).hours} horas, ${ms(calc).minutes} minutos e ${ms(calc).seconds} segundos!`,
            flags: 64
          }
        }
      })
    }

    let quantidade = getRandomNumberBetween(1000, 10000);

    await db.updateOne({
         userID: interaction.member.user.id
     }, { $set: {
  "economia.moedas": userdb.economia.moedas + quantidade,
  "economia.daily_time": Date.now() + tempo("12h"),
     }
     })

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
        

    await DiscordRequest(CALLBACK.interaction.response(
      interaction.id, interaction.token
      ), {
         method: "POST",
         body: {
           type: 7,
           data: {
             content: `Você resgatou seu daily e agora tem **${quantidade}** moedas estando na posição #${userPosition} no rank!`,
             components: []
           }
         }
      }
    )
    
  }
}

function getRandomNumberBetween(x, y) {
  if (x >= y) {
    throw new Error("O valor de 'x' deve ser menor que 'y'");
  }
  const randomNumber = Math.floor(Math.random() * (y - x + 1)) + x;
  return randomNumber;
}

      function ms(ms) {
  const seconds = ~~(ms/1000)
  const minutes = ~~(seconds/60)
  const hours = ~~(minutes/60)
  const days = ~~(hours/24)

  return { days, hours: hours%24, minutes: minutes%60, seconds: seconds%60 }
           }