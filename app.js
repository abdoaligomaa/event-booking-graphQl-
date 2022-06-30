const express=require('express')
const app=express()
const port=process.env.PORT || 3000

// const {PrismaClient}=require("@prisma/client")
// const prisma=new PrismaClient()

const RootQurey=require('./graphql/schema/index')
const RootResolver=require('./graphql/resolver/index')

const {graphqlHTTP}=require('express-graphql')
// const {buildSchema}=require('graphql')

// you did't have to use express.json and without it every thing is ok.v 
app.use(express.json())

app.use(
  "/graphql",
  graphqlHTTP({
    schema:RootQurey ,
    rootValue:RootResolver ,
    graphiql: true,
  })
);

app.get('/',async(req,res)=>{
    const users = await prisma.user.findMany()
      console.log(users);
      res.json(users)
})

app.listen(port,console.log(`server is running in port ${port}`))