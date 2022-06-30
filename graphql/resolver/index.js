const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
module.exports = {
  sayWelcome: () => {
    return "welocme in my first graphql project ";
  },
  sayHellow: (arg) => `hellow ${arg.name}, how are you `,

  Events: async () => {
    const events = await prisma.event.findMany();
    return events;
  },
  CreateEvent: async (args) => {
    const event = await prisma.event.create({
      data: {
        // id: args.eventInput.id,
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        createId:1
        // date: args.eventInput.date,
      },
      include:{
        CreatUser:true
      }
    });
    // console.log(event.CreatUser);

    return { ...event, createdUser:event.CreateUser};
  },

  CreateUser: async (arg) => {
    const oldUser = await prisma.user.findUnique({
      where: {
        email: arg.userInput.email,
      },
    });
    if (oldUser) {
      throw new Error(
        "you can not create this user because the email is exist"
      );
    }
    const hashPassword = await bcrypt.hash(arg.userInput.password, 10);

    const user = await prisma.user.create({
      data: {
        name: arg.userInput.name,
        email: arg.userInput.email,
        password: hashPassword,
      },
    });
    return { ...user, password: null };
  },
  Users: async () => {
    const users = await prisma.user.findMany();
    // console.log(users);
    return users;
  },
};
