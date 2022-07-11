const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const getUserByToken =(token) => {
  try {
    const user = jwt.verify(token,"jwt secrete string");
    return user;
  } catch (error) {
    throw new AuthenticationError("token is not true");
    
  }
};
module.exports = { getUserByToken };
