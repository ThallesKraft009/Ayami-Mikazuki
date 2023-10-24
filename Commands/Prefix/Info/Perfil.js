const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");
const { db } = require("../../../mongodb/user.js");

module.exports = {
  name: "perfil",
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

    let embed = {
      title: `Perfil de ${user.global_name}`,
      fields: [{
        name: "**Quantidade de Moedas**",
        value: `${userdb.economia.moedas}`
      },{
        name: "**Posição no Rank**",
        value: `#${userPosition}`
      },{
        name: "Emblemas",
        value: `\`[Ainda em produção...]\``
      }],
      description: `**SobreMim:**\n${userdb.perfil.sobremim}`,
      color: userdb.perfil.cor
    }

    let options = [];
    if (message.author.id === user.id){
      options.push({
        label: "Editar Sobremim",
        description: "Edite seu sobremim",
        value: "0"
      })
    };

    options.push({
      label: "Cooldowns",
      description: "Veja os Cooldowns do Usuário",
      value: "1"
    })

    let menu = [{
      type: 1,
      components: [{
        type: 3,
        custom_id: `perfil_${message.author.id}`,
        placeholder: "Opções do Perfil",
        options: options
      }]
    }]

    await DiscordRequest(CALLBACK.message.response(message.channel_id), {
      method: 'POST',
      body: {
        content: `<@${message.author.id}>`,
        embeds: [embed],
        components: menu,
        message_reference: {
          message_id: message.id,
          channel_id: message.channel_id,
          guild_id: message.guild_id
        }
      }
    });
  }
}