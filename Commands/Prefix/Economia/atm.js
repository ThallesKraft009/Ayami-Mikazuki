const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");
const { db } = require("../../../mongodb/user.js");

module.exports = {
  name: "atm",
  run: async function(message, args) {
    let user;
    if (message.mentions.length === 0) {
      user = message.author;
    } else {
      user = message.mentions[0];
    };

    let userdb = await db.findOne({
         userID: user.id
     })
      
     if(!userdb){
         const newuser = new db({ userID: user.id })
         await newuser.save();
         
         userdb = await db.findOne({ userID: user.id })
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

    await DiscordRequest(CALLBACK.message.response(message.channel_id), {
      method: 'POST',
      body: {
        content: `<@${user.id}> tem **\`${userdb.economia.moedas}\`** moedas e está na posição #${userPosition} do rank!`,
        message_reference: {
          message_id: message.id,
          channel_id: message.channel_id,
          guild_id: message.guild_id
        }
      }
    });
  }
}