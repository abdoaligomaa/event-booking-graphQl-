const bcrypt = require("bcryptjs");
const checkValidpassword=async(password,hashed)=>{
     const validPass=await bcrypt.compare(password,hashed)
     return validPass   
}

module.exports = {
  checkValidpassword,
};