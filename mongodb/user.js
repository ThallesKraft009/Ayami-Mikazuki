const { Schema, model } = require("mongoose");

const data = new Schema({
  userID: { type: String },
  economia: {
    moedas: { type: Number, default: 0 },
    daily_time: { type: Number, default: 0 }
  }
})

const db = model("Users", data)

module.exports = { db };