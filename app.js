const express=require('express')
const app=express()
const port=process.env.PORT || 3000

const {graphqlHTTP}=require('express-graphql')
const {buildSchema}=require('graphql')


app.use(
  graphqlHTTP({
    schema: buildSchema(`
        type RootQuery{
            sayWelcome:String
        }
        type RootMutation{
            sayHellow(name:String):String
        }
        schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
    rootValue: {},
    graphiql: true,
  })
);

app.get('/',(req,res)=>{
    res.send('welcome in my first graphql project...............')
})

app.listen(port,console.log(`server is running in port ${port}`))