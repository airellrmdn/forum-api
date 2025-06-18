/* istanbul ignore file */
const jwt = require('@hapi/jwt');

const ServerTestHelper = {
  async getAccessToken({ id = 'user-123', username = 'airell r' }) {
    return jwt.token.generate({ username, id }, process.env.ACCESS_TOKEN_KEY);
  }
};

module.exports = ServerTestHelper;
