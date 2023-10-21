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
  }
  
}