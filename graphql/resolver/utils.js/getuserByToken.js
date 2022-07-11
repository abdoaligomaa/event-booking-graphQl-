const jwt = require("jsonwebtoken");
const getUserByToken =(token) => {
  try {
    const user = jwt.verify(token,"jwt secrete string");
    return user;
  } catch (error) {
    console.log("wrong in this function ");
  }
};
module.exports = { getUserByToken };
