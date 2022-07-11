const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const getUserByToken =(token) => {
  try {
    const user = jwt.verify(token,"jwt secrete string");
    if(user){
        return user;
    }
  } catch (error) {
    return null;
  }
};
module.exports = { getUserByToken };
