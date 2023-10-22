module.exports = {

  /////////////// MESSAGE ////////////////

  message: {
    response: (channelId) => {
      return `/channels/${channelId}/messages`
    }
  },

  ////////////// USER /////////////////////
  user: {
    info: (userId) => {
      return `/users/${userId}`
    }
  },

  ///////////// GUILD ///////////////////
  guild: {
    get: (guildId) => {
      return `/guilds/${guildId}`
    },
    
    userGet: (guildId, userId) => {
      return `/guilds/${guildId}/members/${userId}`
    },

    rolesGet: (guildId) => {
      return `/guilds/${guildId}/roles`
    }
  }
  
}