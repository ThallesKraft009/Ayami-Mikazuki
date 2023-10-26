require("dotenv").config();

module.exports = {
  token: process.env.token,
  clientId: "1165243701073821766",
  intents: 33281,
  mongo: process.env.mongo
};
