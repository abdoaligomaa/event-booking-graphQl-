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
      // pagination 
      let { page, limit } = arg;
      page = page > 0 ? page : 1;
      limit = limit > 0 ? limit : 1;
      const startIndex = (page - 1) * limit;
      // const endIndex = page * limit
      const events = await prisma.event.findMany({
        skip: startIndex,
        take: limit,
      });
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
    Users: async (parent, arg) => {
      // pagination 
      let { page, limit } = arg;
      page = page > 0 ? page : 1;
      limit = limit > 0 ? limit : 1;
      const startIndex = (page - 1) * limit;
      // const endIndex = page * limit
      const users = await prisma.user.findMany({
        skip: startIndex,
        take: limit,
      });
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
    getCreatedEvents: async (parent, arg, context) => {
      // pagination 
      let { page, limit } = arg;
      page = page > 0 ? page : 1;
      limit = limit > 0 ? limit : 1;
      const startIndex = (page - 1) * limit;
      // const endIndex = page * limit

      const Events = await prisma.event.findMany({
        where: {
          createId: context.user.id,
        },
        skip: startIndex,
        take: limit,
      });
      return Events;
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
        },
      });
      return User;
    },
    bookEvent: async (parent, { eventId }, context) => {
      // check for existing or not
      const ExistEvent = await prisma.event.findFirst({
        where: {
          id: eventId,
        },
      });
      if (!ExistEvent) {
        throw new Error("Event not Exist ,you can't booked non Existing Event");
      }
      const isBooked = await prisma.bookEvent.findUnique({
        where: {
          userId_eventId: {
            eventId: eventId,
            userId: context.user.id,
          },
        },
      });
      if (isBooked) {
        throw new Error(
          "you are already booked this Event and you can't book it anther time"
        );
      }
      const bookedEvent = await prisma.bookEvent.create({
        data: {
          userId: context.user.id,
          eventId: eventId,
        },
      });
      if(bookedEvent){

        return "the booked is done";
      }else{
        return "error in booked event"
      }
    },
    CancelBooking: async (parent, { eventId }, context) => {
      //check if there is Event in this id
      const IsExistingEvent = await prisma.event.findFirst({
        where: {
          id: eventId,
        },
      });
      if (!IsExistingEvent) {
        throw new Error("there are not event is this id");
      }
      // allow only the user who book this event to cancel it
      const EventByUser = await prisma.bookEvent.findFirst({
        where: {
          userId_eventId: {
            eventId: eventId,
            userId: context.user.id,
          },
        },
      });
      if (!EventByUser) {
        throw new Error("you can't cancel Event you did't book it");
      }
      // delete this event
      const Event = await prisma.bookEvent.delete({
        where: {
          userId_eventId: {
            eventId: eventId,
            userId: context.user.id,
          },
        },
        select: {
          event: true,
        },
      });
      return Event.event;
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
  UserReturn: {
    createdEvents: async (parent, arg) => {
      // pagination
      let { page, limit } = arg;
      page = page > 0 ? page : 1;
      limit = limit > 0 ? limit : 1;
      const startIndex = (page - 1) * limit;
      // const endIndex = page * limit

      const Events = await prisma.event.findMany({
        where: {
          createId: parent.id,
        },
        skip: startIndex,
        take: limit,
      });
      return Events;
    },
    bookedEvents: async (parent, arg) => {
      // pagination
      let { page, limit } = arg;
      page = page > 0 ? page : 1;
      limit = limit > 0 ? limit : 1;
      const startIndex = (page - 1) * limit;
      // const endIndex = page * limit

      let BookedEvents = await prisma.bookEvent.findMany({
        where: {
          userId: parent.id,
        },
        select: {
          event: true,
        },
        skip: startIndex,
        take: limit,
      });

      let arrayOfBookEvents = [];
      for (let index = 0; index < BookedEvents.length; index++) {
        arrayOfBookEvents.push(BookedEvents[index].event);
      }

      return arrayOfBookEvents;
    },
  },
};
