const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");

module.exports = {
  name: "daily",
  run: async function(message, args) {

    let button = [{
      type: 1,
      components: [{
        label: "Resgatar Daily",
        custom_id: `daily_${message.author.id}`,
        style: 1,
        type: 2
      }]
    }];

    await DiscordRequest(CALLBACK.message.response(message.channel_id), { 
      method: 'POST',
      body: {
        content: `<@${message.author.id}> | Resgate suas Moedas diárias \:D`,

        components: button,
        message_reference: {
          message_id: message.id,
          channel_id: message.channel_id,
          guild_id: message.guild_id
        }
      }
    });
  }
}