const express=require('express')
const app=express()
const bcrypt=require('bcryptjs')
const port=process.env.PORT || 3000

const {PrismaClient}=require("@prisma/client")
const prisma=new PrismaClient()


const {graphqlHTTP}=require('express-graphql')
const {buildSchema}=require('graphql')

// you did't have to use express.json and without it every thing is ok.v 
app.use(express.json())



app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            id: Int!
            title:String!
            description:String!
            price:Int
            date:String!
            createdUser: User!
        }
        type User {
            id: Int!
            name:String!
            email:String!
            password:String
            createdEvents:[Event]
        }

        input EventInput{
            title:String!
            description:String!
            price:Int
        }
        
        input UserInput{
            name:String!
            email:String!
            password:String!
        }
        type UserReturn{
            id:Int
            name:String!
            email:String!
            password:String
        }

        type RootQuery{
            sayWelcome:String
            Events:[Event!]!
            Users:[User!]!
        }
        type RootMutation{
            sayHellow(name:String):String
            CreateEvent(eventInput:EventInput):Event!
            CreateUser(userInput:UserInput):UserReturn!
        } 
        schema {
            query:RootQuery
            mutation:RootMutation
        }
    `),

    rootValue: {
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
            // date: args.eventInput.date,
          },
        });

        return event;
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
    },

    graphiql: true,
  })
);

app.get('/',async(req,res)=>{
    const users = await prisma.user.findMany()
      console.log(users);
      res.json(users)
})

app.listen(port,console.log(`server is running in port ${port}`))