const jwt = require("jsonwebtoken");
const getUserByToken =(token) => {
  try {
    const user = jwt.verify(token,"jwt secrete string");
    //   console.log(user);
    return user;
  } catch (error) {
    console.log("wrong in this function ");
    // console.log(error);
  }
};
module.exports = { getUserByToken };
