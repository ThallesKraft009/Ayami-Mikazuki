const CALLBACK = require("../../../settings/callback.js");
const DiscordRequest = require("../../../settings/request.js");
const { db } = require("../../../mongodb/user.js");
const { QuickDB } = require("quick.db");
const quickdb = new QuickDB();

module.exports = {
  data: {
    name: "perfil",
    description: "Comandos relacionados a Perfil",
    type: 1,
    options: [{
      name: "ver",
      description: "Veja o perfil de algum usuário",
      type: 1,
      options: [{
        name: "membro",
        description: "Mencione ou insira o Id",
        type: 6,
        required: false
      }]
    },{
      name: "sobremim",
      description: "Altere seu sobremim",
      type: 1
    }]
  },
  
  run: async function(interaction) {
    let option = interaction.data.options[0].name;

    if (option === "ver"){
      let userId;
      if (interaction.data.options[0].options.length == 0){

        userId = interaction.member.user.id;
        
      } else {
        userId = interaction.data.options[0].options[0].value;
        
      }

      let user = await DiscordRequest(
  CALLBACK.guild.userGet(
    interaction.guild_id, 
    userId), {
      method: "GET"
  });

      user = await user.json(); 
      user = user.user;

      let userdb = await db.findOne({
         userID: userId
     })
      
     if(!userdb){
         const newuser = new db({ userID: userId })
         await newuser.save();
         
         userdb = await db.findOne({ userID: userId })
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
    if (interaction.member.user.id === user.id){
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
        custom_id: `perfil_${interaction.member.user.id}`,
        placeholder: "Opções do Perfil",
        options: options
      }]
    }]

   await quickdb.set(`perfilSelect_${interaction.member.user.id}`, user.id)

      await DiscordRequest(CALLBACK.interaction.response(interaction.id, interaction.token), {
      method: 'POST',
      body: {
        type: 4,
        data: {
           content: `<@${interaction.member.user.id}>`,
           embeds: [embed],
           components: menu,
          }
      }
    });
    } else if (option === "sobremim"){
      let modal = {
        title: "Mudanças de Sobremim",
        custom_id: "mudar-sobremim",
        components: [{
          type: 1,
          components: [{
            type: 4,
            custom_id: "x",
            label: "Insira seu Sobremim",
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
    }
  }
}