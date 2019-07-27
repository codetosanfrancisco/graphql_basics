const Comment = {
  post: (parent, args, { db }) => {
    return db.posts.find(post => post.id == parent.post);
  },
  author: (parent, args, { db }) => {
    return db.users.find(user => user.id === parent.author);
  }
};

export { Comment as default };
