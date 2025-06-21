import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = function (req, res, next) {
  const authHeader = req.headers["authorization"];

  let token = authHeader && authHeader.split(" ")[1];
  console.log(token, "header");

  if (!token) {
    console.log("in !token");
    res.writeHead(401, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Missing token" }));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid token" }));
    }

    req.user = payload;
    next();

    // res.writeHead(200, { "content-type": "json/application" });
    // return res.end(JSON.stringify({ myAuthHeader: payload }));
  });

};
