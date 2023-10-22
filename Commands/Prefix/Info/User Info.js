const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");

const { hasPermissions } = require("../../../functions/bitset.js");

module.exports = {
  name: "userinfo",
  run: async function(message, args) {

    let user;
    if (message.mentions.length === 0) {
      user = message.author;
    } else {
      user = message.mentions[0];
    }

await DiscordRequest(
  CALLBACK.guild.userGet(
    message.guild_id, 
    user.id), {
      method: "GET"
  }).then(async(x) => {
  let userData = await x.json();

 // console.log(userData)

  let embed = {
    title: `Informações de ${userData.user.global_name}`,
    fields: [{
      name: "ID do Usuário",
      value: `\`\`\`\n${userData.user.id}\n\`\`\``
    },{
      name: "Cargos totais no Servidor",
      value: `${userData.roles.length}`
    },{
      name: "Cargos do usuário",
      value: `${userData.roles.map(role => `<@&${role}>`).join(", ")}`
    }],
   thumbnail:  {
     url: `https://cdn.discordapp.com/avatars/${userData.user.id}/${userData.user.avatar}.png?size=2048`
             },
    color: 65535
  }

  await DiscordRequest(CALLBACK.message.response(message.channel_id), { 
      method: 'POST',
      body: {
        content: `<@${message.author.id}>`,
        embeds: [embed],
        message_reference: {
          message_id: message.id,
          channel_id: message.channel_id,
          guild_id: message.guild_id
        }
      }
    });

  })
    
  }
}