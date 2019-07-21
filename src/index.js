import { GraphQLServer } from "graphql-yoga";

//Type definition (Schema)
//hello: String! identify string will be returned
//greeting(name: String, age: Int!): name is of String type and not required, age is of Integer type and it is required
//[User!]!: The things returned must be an array and cannot be null, the element in the array if exists has to be User

const users = [
  {
    id: "123",
    name: "Andrew",
    age: null,
    email: "andrewkuan@gmail.com"
  },
  {
    id: "124",
    name: "Sarah",
    age: null,
    email: "sarah@gmail.com"
  },
  {
    id: "125",
    name: "Mike",
    age: null,
    email: "mike@gmail.com"
  }
];

const posts = [
  {
    id: "111",
    title: "Title 001",
    body: "Hello 001",
    published: true,
    author: "123"
  },
  {
    id: "112",
    title: "Title 002",
    body: "Hello 002",
    published: true,
    author: "124"
  },
  {
    id: "113",
    title: "Title 003",
    body: "Hello 003",
    published: true,
    author: "125"
  }
];

const comments = [
  {
    id: "1",
    body: "Comment 001",
    author: "123",
    post: "111"
  },
  {
    id: "2",
    body: "Comment 002",
    author: "124",
    post: "112"
  },
  {
    id: "3",
    body: "Comment 003",
    author: "125",
    post: "113"
  }
];

const typeDefs = `
    type Query{
        hello: String!
        me: User!
        post: Post!
        greeting(name: String, age: Int!): String!
        grades:[Int!]!
        add(numbers: [Int!]!): Int!
        users(id: String):[User!]!
        posts: [Post!]!
        comments: [Comment!]!
    }

    type User{
        id: ID!
        name: String!
        age: Int
        email: String!
        posts: [Post!]!
        comments:[Comment!]!
    }

    type Post{
        id:ID!
        title: String!
        body: String!
        published:Boolean!
        author: User!
        comments:[Comment!]!
    }

    type Comment{
      id:ID!
      body: String!
      author: User!
      post: Post!
    }
`;

//Resolvers (Function that run to handle each query)
const resolvers = {
  Query: {
    hello: () => "Hello world",
    me: () => {
      return { id: "123", name: "Voon", age: 13, email: "Voon Shun Zhi" };
    },
    post: () => {
      return {
        id: "123",
        title: "nfoianifae",
        body: "fneklanfkef",
        published: true
      };
    },
    greeting: (parent, args, context) => {
      return `Hi ${args.name}`;
    },
    grades: () => [1, 2, 3, 4],
    add(parent, args, context) {
      if (args.numbers.length === 0) {
        return 0;
      }

      return args.numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });
    },
    users: (parent, args, context) => {
      if (!args.id) {
        return users;
      }

      return users.filter(user => user.id === args.id);
    },
    posts: () => posts,
    comments: () => comments
  },
  Post: {
    //All the posts will be returned 1st and GraphQL dig dive into each and every post and run the author function
    //parent is the post object
    author: parent => {
      return users.find(user => user.id === parent.author);
    },
    comments: parent => {
      return comments.filter(comment => comment.post == parent.id);
    }
  },
  User: {
    posts: parent => {
      return posts.filter(post => post.author === parent.id);
    },
    comments: parent => {
      return comments.filter(comment => comment.author == parent.id);
    }
  },
  Comment: {
    post: parent => {
      return posts.find(post => post.id == parent.post);
    },
    author: parent => {
      return users.find(user => user.id === parent.author);
    }
  }
};

//Server Instance
const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log("Server is running on localhost:4000"));
