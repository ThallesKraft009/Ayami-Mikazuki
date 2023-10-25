const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");

module.exports = {
  data: {
    name: "moedas",
    description: "Comandos relacionados a Moedas",
    type: 1,
    options: [{
      name: "daily",
      description: "Resgate suas Moedas diárias",
      type: 1
    },{
      name: "atm",
      description: "Veja quantas moedas você tem",
      type: 1,
      options: [{
        name: "membro",
        description: "Insira o ID ou mencione",
        type: 6,
        required: true
      }]
    }]
  },

  run: async function (interaction) {

   // console.log(interaction);
    let option = interaction.data.options[0].name;

    if (option === "daily"){
      let button = [{
      type: 1,
      components: [{
        label: "Resgatar Daily",
        custom_id: `daily_${interaction.member.user.id}`,
        style: 1,
        type: 2
      }]
    }];

      await DiscordRequest(
        CALLBACK.interaction.response(
          interaction.id, interaction.token
        ), { 
      method: 'POST',
      body: {
        type: 4,
        data: {
          content: `Resgate suas Moedas diárias \:D`,
        components: button
        }
      }
      })
    }
  }
}