const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");

module.exports = {
  name: "serverinfo",
  run: async function(message, args) {
    
   let guild = await DiscordRequest(
  CALLBACK.guild.get(message.guild_id), {
      method: "GET"
  });

    guild = await guild.json();
     
    let seguranca = [
      "Nenhum",
      "Baixo",
      "Médio",
      "Alto",
      "Muito Alto"
    ]


    let embed = {
      title: `Informações de ${guild.name}`,
      fields: [{
        name: "Descrição do Servidor",
        value: `${guild.description || "O servidor não tem uma descrição"}`
      },{
        name: `Criador(a) do Servidor`,
        value: `<@${guild.owner_id}>`
      },{
        name: "Nível de Segurança",
        value: `${seguranca[Number(`${guild.verification_level}`)]}`
      },{
        name: "Total de Cargos",
        value: `${guild.roles.length}`
      },{
        name: "Total de Emojis",
        value: `${guild.emojis.length}`
      }],
      color: 65280
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
  }
}