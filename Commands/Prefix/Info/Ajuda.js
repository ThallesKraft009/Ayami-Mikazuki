const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");
const COLORS = require("../../../settings/colors.js")
const { guilddb } = require("../../../mongodb/guild.js")

module.exports = {
  name: "ajuda",
  run: async function(message, args) {


    let db = await guilddb.findOne({
         guildID: message.guild_id
     })
      
     if(!db){
         const newguild = new guilddb({ guildID: message.guild_id })
         await newguild.save();
         
         db = await guilddb.findOne({ guildID: message.guild_id })
     }

    let embed = {
      title: "Lista de Comandos",
      fields: [{
        name: "**Prefixo do Servidor**",
        value: `${db.bot.prefix}`
      },{
        name: "**Comando de ajuda em Slash**",
        value: `</ajuda:12345>`
      }],
      color: COLORS.blue,
      thumbnail: {
        url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
      }
    };

    let menu = {
      type: 1,
      components: [{
        type: 3,
        placeholder: "Lista de Comandos",
        custom_id: `ajuda_${message.author.id}`,
        options: [{
          label: "Economia",
          description: "Comandos relacionados a Economia",
          value: "0"
        },{
          label: "Informações",
          description: "Comandos relacionados a Informação",
          value: "1"
        },{
          label: "Administração",
          description: "Comandos relacionado a Administração",
          value: "2"
        }]
      }]
    };

    await DiscordRequest(CALLBACK.message.response(message.channel_id), {
      method: 'POST',
      body: {
        content: `<@${message.author.id}>`,
        embeds: [embed],
        components: [menu],
        message_reference: {
          message_id: message.id,
          channel_id: message.channel_id,
          guild_id: message.guild_id
        }
      }
    });
  }
}