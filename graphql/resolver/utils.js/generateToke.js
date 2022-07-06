const jwt = require("jsonwebtoken");
const genterateToken = async (objct) => {
  const token = await jwt.sign(
    { id: objct.id, email: objct.email },
    "jwt secrete string"
  );
  return token;
};
module.exports = { genterateToken };
