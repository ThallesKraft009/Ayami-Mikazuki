const { Schema, model } = require("mongoose");

const data = new Schema({
  userID: { type: String },

  perfil: {
    sobremim: { type: String, default: `Eu amo a Ayami! Selecione no menu para alterar o sobremim.`},
    cor: { type: Number, default: 65280 }
  },
  
  economia: {
    moedas: { type: Number, default: 0 },
    daily_time: { type: Number, default: 0 }
  }
})

const db = model("Users", data)

module.exports = { db };