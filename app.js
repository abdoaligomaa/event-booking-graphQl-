const express=require('express')
const app=express()
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
        }

        input EventInput{
            title:String!
            description:String!
            price:Int
        }

        type RootQuery{
            sayWelcome:String
            Events:[Event!]!
        }
        type RootMutation{
            sayHellow(name:String):String
            CreateEvent(eventInput:EventInput):Event!
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

      Events: async() => {
        const events=await prisma.event.findMany()
        return events
      },
      CreateEvent:async(args)=>{
        const event=await prisma.event.create({
          data:{
            // id: args.eventInput.id,
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: args.eventInput.price,
            // date: args.eventInput.date,
          }
        })
        
        return event
      }
    },

    graphiql: true,
  })
);

app.get('/',(req,res)=>{
    res.send('welcome in my first graphql project...............')
})

app.listen(port,console.log(`server is running in port ${port}`))