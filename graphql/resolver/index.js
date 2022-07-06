const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const {genterateToken} = require("./utils.js/generateToke");
const { hashPassword } = require("./utils.js/hashedPassword");
const {CheckExistingUser}=require('./utils.js/checkExistingUser')

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
      const isUserExist=await CheckExistingUser(arg.userInput.email)

      // hassed the password
      const TheHashPass =await hashPassword(arg.userInput.password);
      // create new user
      const user = await prisma.user.create({
        data: {
          name: arg.userInput.name,
          email: arg.userInput.email,
          password: TheHashPass,
        },
      });
      // create token for this user
      const token = genterateToken(user)
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
