const express=require('express')
const app=express()
const port=process.env.PORT || 3000

const {PrismaClient}=require("@prisma/client")
const prisma=new PrismaClient()

// const {AuthenticationError } = require("apollo-server");

const typeDefs = require("./graphql/schema/index");
const resolvers = require("./graphql/resolver/index");

const { ApolloServer, gql, AuthenticationError } = require("apollo-server");
const  {makeExecutableSchema}=require('graphql-tools')
const {applyMiddleware}=require('graphql-middleware')
const {shield,rule}=require('graphql-shield')

const {getUserByToken}=require('./graphql/resolver/utils.js/getuserByToken')
const { argsToArgsConfig, assertUnionType } = require('graphql/type/definition')


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

// there are no permission in this rule
const freeToUse=rule()((parent,arg,context,info)=>{
  return true
})

// permission to prevent not auth users from acess privite resolvers
const IsAuth=rule()((parent,arg,context,info)=>{
  const user=context.user
  if(user)return true
  else return false
})


const permissions = shield({
  RootQuery: {
    sayWelcome: IsAuth,
  },
  RootMutation: {},
});
const schemaWithPermissions = applyMiddleware(schema, permissions);

app.use(express.json())

const server = new ApolloServer({
  schema: schemaWithPermissions,
  context: ({ req }) => {
    let user;
    const token = req.headers.authorization;
    if (token) {
      try {
        user = getUserByToken(token);
        return { user: user };
      } catch (error) {
        return { user: null };
      }
    } else {
      return { user: null };
    }
    // if(!token){
    //   throw new Error('you should Enter the tokne')
    // }
    // try {
    //   const user = getUserByToken(token)
    //   return {
    //     prisma,
    //     user
    //   };

    // } catch (error) {
    // throw new Error("token is false");

    // }
    // return {
    //   prisma,
    //   user:'abdo ali',
    // };
  },
});

server.listen(3000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});