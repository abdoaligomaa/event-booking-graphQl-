const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const getUserByToken =(token) => {
  try {
    const user = jwt.verify(token,"jwt secrete string");
    if(user){
        return user;
    }
  } catch (error) {
    throw new Error('There are error in the token');
  }
};
module.exports = { getUserByToken };
