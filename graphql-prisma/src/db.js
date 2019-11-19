let users = [
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

let posts = [
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

let comments = [
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

const db = {
  users,
  comments,
  posts
};

export { db as default };
