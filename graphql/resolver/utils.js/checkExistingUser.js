const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const CheckExistingUser = async (email) => {
  const oldUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return oldUser
  
};

module.exports = {
  CheckExistingUser,
};
