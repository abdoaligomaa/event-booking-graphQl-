const { buildSchema } = require("graphql");

module.exports = buildSchema(`
        type Event {
            id: Int!
            title:String!
            description:String!
            price:Int
            date:String!
            CreatUser: User!
        }
        type User {
            id: String!
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
        
        input  userRegestration{
            name:String!
            email:String!
            password:String!
        }
        input UserlogIN{
            email:String!
            password:String!
        }
        type UserReturn{
            id:String!
            name:String!
            email:String!
            token:String
        }

        type RootQuery{
            sayWelcome(name:String!):String!
            Events:[Event!]!
            Users:[User!]!
        }
        type RootMutation{
            sayHellow(name:String):String
            CreateEvent(eventInput:EventInput):Event!
            regester( userRegestration: userRegestration!):UserReturn!
            logIn(userLogIn:UserlogIN!):UserReturn!
        } 
        schema {
            query:RootQuery
            mutation:RootMutation
        }
    `);
