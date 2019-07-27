import { GraphQLServer, PubSub } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import db from "./db";
import User from "./resolvers/User";
import Comment from "./resolvers/Comment";
import Post from "./resolvers/Post";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Subscription from "./resolvers/Subscription";

const pubsub = new PubSub();

//Server Instance
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    User,
    Comment,
    Mutation,
    Query,
    Post,
    Subscription
  },
  context: { db, pubsub } //context should have the things that is universal to all the resolvers, like variable or methods that is shared between all resolver methods
});

server.start(() => console.log("Server is running on localhost:4000"));
