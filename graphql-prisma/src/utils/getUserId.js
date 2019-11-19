import jwt from "jwt";

const getUserId = (request, requireAuth = true) => {
  const header = request.request.headers.authorization;

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisisasecret");
    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error("Authentication error!");
  }

  return null;
};

export { getUserId as default };
