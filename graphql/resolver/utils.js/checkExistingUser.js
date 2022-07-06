const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const CheckExistingUser = async (email) => {
  const oldUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (oldUser) {
    throw new Error("you can not create this user because the email is exist");
  }
};

module.exports = {
  CheckExistingUser,
};
