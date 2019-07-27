import uuidv4 from "uuid/v4";

const Mutation = {
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

  createPost: (parent, args, { db, pubsub }) => {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) {
      throw new Error("User not exists!");
    }

    const post = {
      ...args.data,
      id: uuidv4()
    };

    db.posts.push(post);

    pubsub.publish("posts", { post: { post: post, mutation: "CREATE POST" } });

    return post;
  },
  createComment: (parent, args, { db, pubsub }, info) => {
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

    pubsub.publish(`comment ${args.data.post}`, { comment });

    return comment;
  },
  deletePost: (parent, args, { db, pubsub }, info) => {
    const postExists = db.posts.findIndex(post => post.id == args.id);

    if (postExists == -1) {
      throw new Error("Post not exists!");
    }

    const deletedPost = db.posts.splice(postExists, 1);

    var comments = db.comments.filter(comment => comment.post !== args.id);

    db.comments = comments;

    pubsub.publish("posts", {
      post: { post: deletedPost[0], mutation: "DELETE POST" }
    });

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
  },
  updateUser: (parent, args, { db }, info) => {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error("User not found!");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some(user => user.email == data.email);

      if (emailTaken) {
        throw new Error("Email is taken");
      }

      user.email = data.email;
    }

    if (typeof data.name == "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },
  updatePost: (parent, args, { db, pubsub }, info) => {
    const { data, id } = args;

    const post = db.posts.find(post => post.id == id);

    if (!post) {
      throw new Error("Post not exists!");
    }

    if (typeof data.body == "string") {
      post.body = data.body;
    }

    if (typeof data.title == "string") {
      post.title = data.title;
    }

    if (typeof data.published == "boolean") {
      post.published = data.published;
    }

    pubsub.publish("posts", { post: { post, mutation: "UPDATE POST" } });

    return post;
  },
  updateComment: (parent, args, { db }, info) => {
    const { id, data } = args;

    const comment = db.comments.find(comment => comment.id == id);

    if (!comment) {
      throw new Error("Comment not exists!");
    }

    if (typeof data.body != "undefined") {
      comment.body = data.body;
    }

    return comment;
  }
};

export { Mutation as default };
