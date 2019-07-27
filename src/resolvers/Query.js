const Query = {
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
  posts: (parent, args, { db }) => db.posts,
  comments: (parent, args, { db }) => db.comments
};

export { Query as default };
