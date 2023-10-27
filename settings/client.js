require("dotenv").config();

module.exports = {
  token: process.env.token,
  clientId: process.env.clientId,
  intents: 3276799,
  mongo: process.env.mongo
};
