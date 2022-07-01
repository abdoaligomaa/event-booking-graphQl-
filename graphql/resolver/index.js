const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
module.exports = {
  RootQuery: {
    sayWelcome: () => {
      return "welocme in my first graphql project ";
    },

    // get all events
    Events: async (parent, arg) => {
      const events = await prisma.event.findMany();
      return events;
    },

    // get all users
    Users: async () => {
      const users = await prisma.user.findMany();
      // console.log(users);
      return users;
    },
  },
  RootMutation: {
    sayHellow: (_,arg) => `hellow ${arg.name}, how are you `,

    CreateEvent: async (_,args) => {
      const event = await prisma.event.create({
        data: {
          // id: args.eventInput.id,
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          createId: 1,
          // date: args.eventInput.date,
        },
      });
      // console.log(event.CreatUser);

      return event;
    },

    CreateUser: async (_,arg) => {
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
  },
  Event: {
    CreatUser: async (parent, args) => {
      const user = await prisma.user.findFirst({
        where: {
          id: parent.createId,
        },
      });
      return user;
    },
  },
  User: {
    createdEvents: async (parent, args) => {
      const Events = await prisma.event.findMany({
        where: {
          createId: parent.id,
        },
      });
      return Events;
    },
  },
};
