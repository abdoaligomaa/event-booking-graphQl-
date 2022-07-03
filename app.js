const express=require('express')
const app=express()
const port=process.env.PORT || 3000

// const {PrismaClient}=require("@prisma/client")
// const prisma=new PrismaClient()

const typeDefs = require("./graphql/schema/index");
const resolvers = require("./graphql/resolver/index");

// const {graphqlHTTP}=require('express-graphql')
const { ApolloServer, gql,  } = require("apollo-server");
const  {makeExecutableSchema}=require('graphql-tools')
const {applyMiddleware}=require('graphql-middleware')
// you did't have to use express.json and without it every thing is ok.v 

/* 
  the next step i will do 
  1- middleware in the code with apollo server
  2- auth with graphql (regester, log in)
  3- gard the resover
  4- refactoring the code 
*/
const schema =makeExecutableSchema({
  typeDefs,
  resolvers,
}) 
const middleware=[]
const schemaWithMiddleWare=applyMiddleware(schema,...middleware)

app.use(express.json())
const server = new ApolloServer({
 schema:schemaWithMiddleWare
});


app.get('/',async(req,res)=>{
    const users = await prisma.user.findMany()
      console.log(users);
      res.json(users)
})

// app.listen(port,console.log(`server is running in port ${port}`))
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});