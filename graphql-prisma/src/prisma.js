const { Prisma } = require("prisma-binding");

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "thisismysecretkey"
});

export { prisma as default };

// prisma.exists
//   .User({
//     id: "cjyrlt0l300cr0774m6cy9k8i"
//   })
//   .then(res => {
//     console.log(res);
//   });

// const createPostForUser = async (authorId, data) => {
//   const mutation = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId
//           }
//         }
//       }
//     },
//     "{ id }"
//   );

//   const user = await prisma.query.users(null, "{name}");

//   return user;
// };

// createPostForUser("cjyrlt0l300cr0774m6cy9k8i", {
//   title: "Hello World",
//   body: "Body of Hello World",
//   published: true
// })
//   .then(user => {
//     console.log(user);
//   })
//   .catch(err => {
//     console.log(err);
//   });
