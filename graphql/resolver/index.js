const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { userRegestrationError, UserInputError } = require("apollo-server");

const { genterateToken } = require("./utils.js/generateToke");
const { hashPassword } = require("./utils.js/hashedPassword");
const { CheckExistingUser } = require("./utils.js/checkExistingUser");
const { validateRegisterInput } = require("./utils.js/registrationValidation");
const { validateLoginInput } = require("./utils.js/loginValidation");
const { checkValidpassword } = require("./utils.js/checkValidPass");

module.exports = {
  RootQuery: {
    sayWelcome: (_, arg, context) => {
      console.log(context)
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
      // check validation of inputs
      const { valid, errors } = validateRegisterInput(
        arg.userRegestration.name,
        arg.userRegestration.email,
        arg.userRegestration.password
      );
      if (!valid) {
        throw new UserInputError("Errors", errors);
      }

      // check if the user with that email is exist or not in the database
      const oldUser = await CheckExistingUser(arg.userRegestration.email);
      if (oldUser) {
        throw new Error(
          "you can not create this user because the email is exist"
        );
      }

      // hassed the password
      const TheHashPass = await hashPassword(arg.userRegestration.password);
      // create new user
      const user = await prisma.user.create({
        data: {
          name: arg.userRegestration.name,
          email: arg.userRegestration.email,
          password: TheHashPass,
        },
      });
      // create token for this user
      const token = genterateToken(user);
      return { ...user, token };
    },

    logIn: async (_, arg) => {
      // validate login inputs
      const { errors, valid } = validateLoginInput(
        arg.userLogIn.email,
        arg.userLogIn.password
      );
      if (!valid) {
        throw new UserInputError("Errors", errors);
      }

      // check the user is exist in the database
      const user = await CheckExistingUser(arg.userLogIn.email);
      if (!user) {
        throw new Error(
          "This Email does not exist, you should Enter a correct Email"
        );
      }
      // check if the password is correct or not
      const IscorrectPass = await checkValidpassword(
        arg.userLogIn.password,
        user.password
      );

      if (!IscorrectPass) {
        throw new Error(
          "Password is not true ,Please Enter the correct Password"
        );
      }
      const token = genterateToken(user);

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
