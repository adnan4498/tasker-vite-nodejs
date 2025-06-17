import bycrypt from "bcrypt";
import UserJs from "../models/User.js";
import User from "../models/User.js";
import { parsedJSONBody } from "../utils/parseJSON.js";

export const auth = async function (req, res) {
  try {
    let body = await parsedJSONBody(req);
    const { name, email, password, confirmPassword } = body;

    if (!name || !email || !password || !confirmPassword) {
      res.writeHead(400, { "content-type": "application/json" });
      return JSON.stringify({ error: "Invalid input" })

    }

    const existingEmail = await User.find


  } catch (error) {
    res.writeHead(400, { "content-type": "application/json" });
    return JSON.stringify({ error: error });
  }
};
