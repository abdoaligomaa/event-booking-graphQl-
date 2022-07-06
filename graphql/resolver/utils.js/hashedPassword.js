const hashPassword=async(pass)=>{
      const hashPassword = await bcrypt.hash(pass, 10);
      return hashPassword;
}

module.exports={
    hashPassword
}