const { mongo } = require("../settings/client.js");
const { connect } = require("mongoose");

const { Prefix } = require("./GUILD/messageCreate.js");

const { Interaction } = require("./GUILD/interactionCreate.js");

module.exports = async(data) => {

  let { t, d } = data;

  if (t === "READY"){
    console.log("Ayami Online")
    connect(mongo);
  } else if (t === "MESSAGE_CREATE"){
    return Prefix(data);
  } else if (t === "INTERACTION_CREATE"){
    return Interaction(data);
  }
  
}