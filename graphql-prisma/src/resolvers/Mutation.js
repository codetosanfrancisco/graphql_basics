//import uuidv4 from "uuid/v4";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getUserId from "../utils/getUserId";

const Mutation = {
  login: async (parent, args, { prisma }, info) => {
    const user = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!user) {
      throw new Error("No such user!");
    }

    const isMatch = await bcrypt.compare(args.data.password, user.password);

    if (!isMatch) {
      throw new Error("Password not matching!");
    }

    return {
      user,
      token: jwt.sign({ userId: user.id}, "thisisasecret");
    }
  },

  createUser: async (parent, args, { db, prisma }, info) => {
    if (args.data.password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    const password = await bcrypt.hash(args.data.password, 10);

    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error("Email taken!");
    }

    const user = await prisma.mutation.createUser(
      {
        data: {
          ...args.data,
          password
        }
      },
      info
    );

    return {
      user,
      token: jwt.sign({ userId: user.id }, "thisisasecret")
    };

    //Without Prisma
    //const emailTaken = db.users.some(user => user.email == args.data.email);
    // const object = {
    //   id: uuidv4(),
    //   ...args.data
    // };

    // users.push(object);

    // return object;
  },
  deleteUser: async (parent, args, { db, prisma, request }, info) => {
    const userId = getUserId(request);
    return prisma.mutation.deleteUser(
      { where: { id: userId} },
      info
    );

    //Without Prisma
    // const userIndex = db.users.findIndex(user => user.id === args.id);

    // if (userIndex === -1) {
    //   throw new Error("User not exists!");
    // }

    // const deletedUsers = db.users.splice(userIndex, 1);

    // posts = db.posts.filter(post => {
    //   const match = post.author == args.id;

    //   if (match) {
    //     comments = comments.filter(comment => comment.post !== post.id);
    //   }

    //   return !match;
    // });

    // comments = db.comments.filter(comment => comment.author == args.id);

    // return deletedUsers[0];
  },

  createPost: (parent, args, { db, pubsub, prisma,request }) => {
    const userId = getUserId(request);
    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );

    //Without Prisma
    // const userExists = db.users.some(user => user.id === args.data.author);

    // if (!userExists) {
    //   throw new Error("User not exists!");
    // }

    // const post = {
    //   ...args.data,
    //   id: uuidv4()
    // };

    // db.posts.push(post);

    // pubsub.publish("posts", { post: { post: post, mutation: "CREATED" } });

    // return post;
  },
  createComment: (parent, args, { db, pubsub, prisma, request }, info) => {

    const userId = getUserId(request);

    return primsa.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );

    //Without Prisma
    // const userExists = db.users.some(user => user.id == args.data.author);
    // const postExists = db.posts.some(
    //   post => post.id == args.data.post && post.published
    // );
    // if (!userExists || !postExists) {
    //   throw new Error("User or Posts not exists!");
    // }

    // const comment = {
    //   id: uuidv4(),
    //   ...args.data
    // };

    // db.comments.push(comment);

    // pubsub.publish(`comment ${args.data.post}`, { comment });

    // return comment;
  },
  deletePost: async (parent, args, { db, pubsub, request, prisma }, info) => {

    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id:args.id,
      author:{
        id: userId
      }
    });

    if(!postExists){
      throw new Error("You cannot delete the post!");
    }

    return prisma.mutation.deletePost({
      where: {
        id: args.id
      },
      info
    });

    //Without Prisma
    // const postExists = db.posts.findIndex(post => post.id == args.id);

    // if (postExists == -1) {
    //   throw new Error("Post not exists!");
    // }

    // const deletedPost = db.posts.splice(postExists, 1);

    // var comments = db.comments.filter(comment => comment.post !== args.id);

    // db.comments = comments;

    // pubsub.publish("posts", {
    //   post: { post: deletedPost[0], mutation: "DELETED" }
    // });

    // return deletedPost[0];
  },
  deleteComment: async (parent, args, { db, request }, info) => {

    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if(!commentExists){
      throw new Error("Cannot delete comment!");
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );

    //Without Prisma
    // const commentExists = db.comments.findIndex(
    //   comment => comment.id == args.id
    // );

    // if (!commentExists) {
    //   throw new Error("Commnet not found!");
    // }

    // const deletedComment = db.comments.splice(commentExists, 1);

    // return deletedComment[0];
  },
  updateUser: async (parent, args, { db,request }, info) => {
    const userId = getUserId(request);

    prisma.mutation.updateUser({ where: { id: userId }, data: args.data });

    //Without Prisma
    // const { id, data } = args;
    // const user = db.users.find(user => user.id === id);

    // if (!user) {
    //   throw new Error("User not found!");
    // }

    // if (typeof data.email === "string") {
    //   const emailTaken = db.users.some(user => user.email == data.email);

    //   if (emailTaken) {
    //     throw new Error("Email is taken");
    //   }

    //   user.email = data.email;
    // }

    // if (typeof data.name == "string") {
    //   user.name = data.name;
    // }

    // if (typeof data.age !== "undefined") {
    //   user.age = data.age;
    // }

    // return user;
  },
  updatePost: (parent, args, { db, pubsub, prisma, request }, info) => {
    const userId = getUserId(request);

    const postExists = prisma.exists.Post({
      where:{
        id: args.id,
        author:{
          id: userId
        }
      }
    });

    if(!postExists){
      throw new Error("Unable to update the post!");
    }
    //The Prisma will do the Post exists check for us automatically
    return prisma.mutation.updatePost(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );

    //Without Prisma
    // const { data, id } = args;

    // const post = db.posts.find(post => post.id == id);

    // if (!post) {
    //   throw new Error("Post not exists!");
    // }

    // if (typeof data.body == "string") {
    //   post.body = data.body;
    // }

    // if (typeof data.title == "string") {
    //   post.title = data.title;
    // }

    // if (typeof data.published == "boolean") {
    //   post.published = data.published;
    // }

    // pubsub.publish("posts", { post: { post, mutation: "UPDATED" } });

    // return post;
  },
  updateComment: (parent, args, { db, prisma, request }, info) => {

    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author:{
        id: userId
      }
    });

    if(!commentExists){
      throw new Errro("Unable to create comment!");
    }

    return prisma.mutation.updateComment(
      {
        data: args.data,
        where: {
          id: args.id
        }
      },
      info
    );

    //Without Prisma
    // const { id, data } = args;

    // const comment = db.comments.find(comment => comment.id == id);

    // if (!comment) {
    //   throw new Error("Comment not exists!");
    // }

    // if (typeof data.body != "undefined") {
    //   comment.body = data.body;
    // }

    // return comment;
  }
};

export { Mutation as default };
