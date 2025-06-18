import bycrypt from "bcrypt";
import User from "../models/User.js";
import { parsedJSONBody } from "../utils/parseJSON.js";

export const auth = async function (req, res) {
  try {
    let body = await parsedJSONBody(req);
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password || !confirmPassword) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid input" }))
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      res.writeHead(409);
      return res.end(JSON.stringify({ error: "User already exists" }));
    }
    console.log("existingEmail")

    const hashedPassword = await bycrypt.hash(password, 10);
    let newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.writeHead(201, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Signup successful" }));

  } catch (error) {
    res.writeHead(400, { "content-type": "application/json" });
    return JSON.stringify({ error: error });
  }
};
