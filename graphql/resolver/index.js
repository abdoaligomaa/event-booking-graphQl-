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
    sayWelcome: (_, { name }, context) => {
      // console.log(context);
      return `welcome ${name} , how are you `;
    },

    // get all events
    Events: async (parent, arg) => {
      const events = await prisma.event.findMany();
      return events;
    },
    deleteUser: async () => {
      await prisma.user.deleteMany();
      return "delete users is done";
    },
    deleteEvent: async () => {
      await prisma.event.deleteMany();
      return "delete events is done";
    },

    // get all users
    Users: async () => {
      const users = await prisma.user.findMany();
      // console.log(users);
      return users;
    },
    getUser: async (parent, { userId }, context) => {
      const User = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      if (!User) {
        throw new Error(
          "you should Enter A valid id (there isn't user in this id)"
        );
      }
      return User;
    },
    getEvent: async (parent, { eventId }, context) => {
      const Event = await prisma.event.findFirst({
        where: {
          id: eventId,
        },
      });
      if (!Event) {
        throw new Error(
          "you should Enter A valid id (there isn't Event in this id)"
        );
      }
      return Event;
    },
  },
  RootMutation: {
    sayHellow: (_, arg, context) => `hellow ${arg.name}, how are you `,

    CreateEvent: async (_, args, context) => {
      console.log(context);
      const event = await prisma.event.create({
        data: {
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: args.eventInput.price,
          createId: context.user.id,
          // date: args.eventInput.date,
        },
      });
      console.log(event);

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
    deleteEvent: async (parent, { eventId }, context) => {
      // check for existing or not
       const ExistEvent = await prisma.event.findFirst({
         where: {
           id: eventId,
         },
       });
       if (!ExistEvent) {
         throw new Error(
           "you should Enter A valid id (there isn't Event in this id)"
         );
       }
      const Event = await prisma.event.delete({
        where: {
          id: eventId,
        },
      });
      return Event;
    },
    deleteUser: async (parent, { userId }, context) => {
      // check for exsiting
       const ExistUser = await prisma.user.findFirst({
         where: {
           id: userId,
         },
       });
       if (!ExistUser) {
         throw new Error(
           "you should Enter A valid id (there isn't user in this id)"
         );
        }
         
      const User = await prisma.user.delete({
        where: {
          id: userId,
      }})
      return User;
      }
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
  UserReturn: {
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
