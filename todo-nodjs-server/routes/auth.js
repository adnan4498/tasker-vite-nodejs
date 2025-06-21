import bycrypt from "bcrypt";
import User from "../models/User.js";
import { parsedJSONBody } from "../utils/parseJSON.js";

export const auth = async function (req, res) {
  try {
    let body = await parsedJSONBody(req);
    const { name, email, password, confirmPassword } = body;

    // if (!name || !email || !password || !confirmPassword) {
    //   res.writeHead(400, { "content-type": "application/json" });
    //   return res.end(JSON.stringify({ error: "Invalid input" }));
    // }

    const findUser = await User.findOne({ email });

    if (req.url.includes("signup")) {
      if (findUser) {
        res.writeHead(409);
        return res.end(JSON.stringify({ error: "User already exists" }));
      }
      const hashedPassword = await bycrypt.hash(password, 10);
      let newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: "Signup successful" }));
    }

    if (req.url.includes("login")) {
      if (!findUser) {
        res.writeHead(401, { "content-type": "application/json" });
        return res.end(JSON.stringify({ emailNotFound: "user not found" }));
      }

      const match = await bycrypt.compare(password, findUser.password);

      if (!match) {
        res.writeHead(401, { "content-type": "application/json" });
        return res.end(
          JSON.stringify({ incorrectPassword: "incorrect password" })
        );
      }

      let loggedInUserData = {
        name: findUser.name,
        email: email,
      };

      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ status: 200, user: loggedInUserData }));
    }
  } catch (error) {
    res.writeHead(400, { "content-type": "application/json" });
    return JSON.stringify({ error: error });
  }
};
