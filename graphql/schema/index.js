const { buildSchema } = require("graphql");

module.exports = buildSchema(`
        type Event {
            id: String!
            title:String!
            description:String!
            price:Int
            date:String!
            CreatUser: UserReturn!
            bookedUsers:[UserReturn!]
            createdAt:String!
        }
        type User {
            id: String!
            name:String!
            email:String!
            password:String
            createdEvents:[Event!]
            bookedEvents:[Event!]
        }
        type UserReturn{
            id:String!
            name:String!
            email:String!

            createdEvents(page:Int!,limit:Int!):[Event!]
            bookedEvents(page:Int!,limit:Int!):[Event!]
            token:String
        }

        input EventInput{
            title:String!
            description:String!
            price:Int
            
        }
        
        input UserInput{
            name:String
            email:String!
            password:String!
        }
       
        type RootQuery{
            sayWelcome(name:String!):String!
            Events(page:Int!,limit:Int!):[Event!]!
            Users(page:Int!,limit:Int!):[UserReturn!]!
            getUser(userId:String!):UserReturn
            getEvent(eventId:String!):Event
            getCreatedEvents(page:Int!,limit:Int!):[Event!]
            deleteUser:String!
            deleteEvent:String!
            
        }
        type RootMutation{
            sayHellow(name:String):String
            CreateEvent(eventInput:EventInput):Event!
            regester(userRegestration: UserInput!):UserReturn!
            logIn(userLogIn:UserInput!):UserReturn!
            deleteUser(userId:String!):UserReturn
            deleteEvent(eventId:String!):Event
            bookEvent(eventId:String!):String!
            CancelBooking(eventId:String!):Event!
        } 
        schema {
            query:RootQuery
            mutation:RootMutation
        }
    `);
