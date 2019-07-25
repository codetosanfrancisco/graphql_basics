import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import db from "./db";
//Type definition (Schema)
//hello: String! identify string will be returned
//greeting(name: String, age: Int!): name is of String type and not required, age is of Integer type and it is required
//[User!]!: The things returned must be an array and cannot be null, the element in the array if exists has to be User

//Using Input Type
// mutation{
//   createPost(data: { title: "Title 101", body: "Body 101", published: true, author: "123" }){
//     id
//     title
//     body
//     author{
//       name
//     }
//   }

//   createComment(data: { body: "This is a comment", author: "123", post: "111" }){
//     id
//   }
// }

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
    greeting: (parent, args, { db }) => {
      return `Hi ${args.name}`;
    },
    grades: () => [1, 2, 3, 4],
    add: (parent, args, { db }) => {
      if (args.numbers.length === 0) {
        return 0;
      }

      return args.numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });
    },
    users: (parent, args, { db }) => {
      if (!args.id) {
        return db.users;
      }

      return db.users.filter(user => user.id === args.id);
    },
    posts: () => db.posts,
    comments: () => db.comments
  },
  Mutation: {
    createUser: (parent, args, { db }, info) => {
      const emailTaken = db.users.some(user => user.email == args.data.email);

      if (emailTaken) {
        throw new Error("Email taken!");
      }

      const object = {
        id: uuidv4(),
        ...args.data
      };

      users.push(object);

      return object;
    },
    deleteUser: (parent, args, { db }, info) => {
      const userIndex = db.users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User not exists!");
      }

      const deletedUsers = db.users.splice(userIndex, 1);

      posts = db.posts.filter(post => {
        const match = post.author == args.id;

        if (match) {
          comments = comments.filter(comment => comment.post !== post.id);
        }

        return !match;
      });

      comments = db.comments.filter(comment => comment.author == args.id);

      return deletedUsers[0];
    },

    createPost: (parent, args, { db }) => {
      const userExists = db.users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not exists!");
      }

      const post = {
        ...args.data,
        id: uuidv4()
      };

      db.posts.push(post);

      return post;
    },
    createComment: (parent, args, { db }, info) => {
      const userExists = db.users.some(user => user.id == args.data.author);
      const postExists = db.posts.some(
        post => post.id == args.data.post && post.published
      );
      if (!userExists || !postExists) {
        throw new Error("User or Posts not exists!");
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      db.comments.push(comment);

      return comment;
    },
    deletePost: (parent, args, { db }, info) => {
      const postExists = db.posts.findIndex(post => post.id == args.id);

      if (postExists == -1) {
        throw new Error("Post not exists!");
      }

      const deletedPost = db.posts.splice(postExists, 1);

      comments = db.comments.filter(comment => comment.post !== args.id);

      return deletedPost[0];
    },
    deleteComment: (parent, args, { db }, info) => {
      const commentExists = db.comments.findIndex(
        comment => comment.id == args.id
      );

      if (!commentExists) {
        throw new Error("Commnet not found!");
      }

      const deletedComment = db.comments.splice(commentExists, 1);

      return deletedComment[0];
    }
  },
  Post: {
    //All the posts will be returned 1st and GraphQL dig dive into each and every post and run the author function
    //parent is the post object
    author: (parent, args, { db }) => {
      return db.users.find(user => user.id === parent.author);
    },
    comments: (parent, args, { db }) => {
      return db.comments.filter(comment => comment.post == parent.id);
    }
  },
  User: {
    posts: (parent, args, { db }) => {
      return db.posts.filter(post => post.author === parent.id);
    },
    comments: (parent, args, { db }) => {
      return db.comments.filter(comment => comment.author == parent.id);
    }
  },
  Comment: {
    post: (parent, args, { db }) => {
      return db.posts.find(post => post.id == parent.post);
    },
    author: (parent, args, { db }) => {
      return db.users.find(user => user.id === parent.author);
    }
  }
};

//Server Instance
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: { db } //context should have the things that is universal to all the resolvers, like variable or methods that is shared between all resolver methods
});

server.start(() => console.log("Server is running on localhost:4000"));
