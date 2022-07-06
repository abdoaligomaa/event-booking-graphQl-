const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
    sayHellow: (_, arg) => `hellow ${arg.name}, how are you `,

    CreateEvent: async (_, args) => {
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

    regester: async (_, arg) => {
      // TODO adding validation for user input
      

      // check if the user with that email is exist or not in the database
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

      // hassed the password
      const hashPassword = await bcrypt.hash(arg.userInput.password, 10);
      // create new user
      const user = await prisma.user.create({
        data: {
          name: arg.userInput.name,
          email: arg.userInput.email,
          password: hashPassword,
        },
      });
      console.log(user);
      // create token for this user
      const token = await jwt.sign(
        { id: user.id, email: user.email },
        "jwt secrete string"
      );
      console.log(user);
      return { ...user, token };
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
