const express=require('express')
const app=express()
const port=process.env.PORT || 3000

var bodyParser = require("body-parser");



app.use(bodyParser.json());

const {graphqlHTTP}=require('express-graphql')
const {buildSchema}=require('graphql')

// app.use(express.json())

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type RootQuery{
            sayWelcome:String
        }
        type RootMutation{
            sayHellow(name:String):String
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
      sayHellow:(arg)=>`hellow ${arg.name}, how are you `
    },

    graphiql: true,
  })
);

app.get('/',(req,res)=>{
    res.send('welcome in my first graphql project...............')
})

app.listen(port,console.log(`server is running in port ${port}`))