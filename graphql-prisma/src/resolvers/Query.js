import getUserId from "../utils/getUserId";

const Query = {
  hello: () => "Hello world",
  me: (parent, args, {prisma, request}, info) => {
    const userId = getUserId(request);
    return prisma.query.user({
      where:{
        id: userId
      }
    });
  },
  myPosts: (parent,args, {prisma, request}, info) => {
    const userId = getUserId(request);
    const opArgs = {
      where:{
        author:{
          id: userId
        }
      }
    }
    if(args.query){
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ]
    }

    return prisma.query.posts(opArgs, info)
  }
  ,
  post: (parent, args, { prisma, request }, info) => {
    const userId = getUserId(request, false);

    const posts = await prisma.query.posts({
      where:{
        id: args.id,
        OR: [
          {
            published: true
          },
          {
            author: {
              id: userId
            }
          }
        ]
      }
    },info);

    if(posts.length === 0){
      throw new Error("Post not found!");
    }

    return posts[0];
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
  users: (parent, args, { db, prisma }, info) => {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        AND: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
          }
        ]
      };
    }

    return prisma.query.users(opArgs, info);
    // if (!args.id) {
    //   return db.users;
    // }

    // return db.users.filter(user => user.id === args.id);
  },
  posts: (parent, args, { db, prisma }, info) => {
    const opArgs = {
      where:{
        published: true
      }
    };

    if (args.query) {
      opArgs.where.OR = [
          {
            title_contains: args.query
          },
          {
            body_container: args.query
          }
        ]
    }

    return prisma.query.posts(null, info);
  },
  comments: (parent, args, { prisma }) => {
    //We can return Promise object actually
    return prisma.query.comments(null, info);
  }
};

export { Query as default };
