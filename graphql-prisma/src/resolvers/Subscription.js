const Subscription = {
  comment: {
    subscribe: (parent, { postId }, { pubsub, db, prisma }, info) => {
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId
              }
            }
          }
        },
        info
      );
      //   const post = db.posts.find(post => post.id == postId && post.published);

      //   if (!post) {
      //     throw new Error("Post not found!");
      //   }

      //   return pubsub.asyncIterator(`comment ${postId}`);
    }
  },
  post: {
    subscribe: (parent, args, { pubsub, db, prisma }, info) => {
      return prisma.subscription.post({
        where: {
          node: {
            published: true
          }
        }
      });

      // return pubsub.asyncIterator("posts");
    }
  }
};

export { Subscription as default };
