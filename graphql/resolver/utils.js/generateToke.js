const jwt = require("jsonwebtoken");
const genterateToken = async (objct) => {
  const token = await jwt.sign(
    { id: objct.id, email: objct.email },
    "jwtSecreteString"
  );
  return token;
};
module.exports = { genterateToken };
