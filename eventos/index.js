const { Prefix } = require("./GUILD/messageCreate.js");

module.exports = async(data) => {

  let { t, d } = data;

  if (t === "READY"){
    console.log("Ayami Online")
  } else if (t === "MESSAGE_CREATE"){
    return Prefix(data);
  }
  
}