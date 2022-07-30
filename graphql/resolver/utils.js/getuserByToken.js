const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const getUserByToken =(token) => {
  
    const user =  jwt.verify(token,"jwtSecreteString");
    return user

};
module.exports = { getUserByToken };
