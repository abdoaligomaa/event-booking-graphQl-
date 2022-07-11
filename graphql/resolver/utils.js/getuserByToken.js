const jwt = require("jsonwebtoken");
const getUserByToken = async (token) => {
  const user = await jwt.decode(token, "jwt secrete string");
  return user
};
module.exports = { getUserByToken };
