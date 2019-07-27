const Post = {
  //All the posts will be returned 1st and GraphQL dig dive into each and every post and run the author function
  //parent is the post object
  author: (parent, args, { db }) => {
    return db.users.find(user => user.id === parent.author);
  },
  comments: (parent, args, { db }) => {
    return db.comments.filter(comment => comment.post == parent.id);
  }
};

export { Post as default };
