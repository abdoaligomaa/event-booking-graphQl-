

module.exports.validateLoginInput = (email, password) => {
  const errors = {};
  if (email.trim() === "") {
    errors.email = "email must not be empty";
  }else{
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }else if(password.length<8){
    errors.password = "you should Enter at least 8 characher";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
