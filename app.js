const express=require('express')
const app=express()
const port=process.env.PORT || 3000

  const {PrismaClient}=require("@prisma/client")
  const prisma=new PrismaClient()

const typeDefs = require("./graphql/schema/index");
const resolvers = require("./graphql/resolver/index");

// const {graphqlHTTP}=require('express-graphql')
const { ApolloServer, gql,  } = require("apollo-server");
const  {makeExecutableSchema}=require('graphql-tools')
const {applyMiddleware}=require('graphql-middleware')

const {getUserByToken}=require('./graphql/resolver/utils.js/getuserByToken')


/* 
  the next step i will do 
  1- middleware in the code with apollo server
  2- auth with graphql (regester, log in)
  3- gard the resover
  4- refactoring the code 
*/
// const schema =makeExecutableSchema({
//   typeDefs,
//   resolvers,
// }) 

// const firstMiddleware=async()=>{
//   console.log('first middleware')
//   const events = await prisma.event.findMany();
//       return events;
  
// }
// const middleware = [firstMiddleware];
// const schemaWithMiddleWare=applyMiddleware(schema,...middleware)

app.use(express.json())
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const authToken = req.headers.authorization;
    const token=authToken.split('Bearer ')[1]
    // console.log(token)

    if(!token){
      return null
    }else {
      const user =await getUserByToken(token)
      // console.log(user)
      return {user}
    }
    // const user = getUserByToken(token);
    //   console.log(user)
    //   return user
  }
});


// app.get('/',async(req,res)=>{
//     const users = await prisma.user.findMany()
//       console.log(users);
//       res.json(users)
// })
// delete all users
// app.get("/deleteUsers", async (req, res) => {
//   const users = await prisma.user.deleteMany();
//   res.send("done");

// });
// // delete all events
// app.get("/deleteEvents", async (req, res) => {
//   const users = await prisma.event.deleteMany();
//   res.send('done')
// });
// app.listen(port,console.log(`server is running in port ${port}`))
server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});