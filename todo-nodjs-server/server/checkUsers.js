import mongoose from "mongoose";
import User from "../models/User.js";

mongoose.connect("mongodb://127.0.0.1:27017/signup_demo").then(async () => {
  let getUsers = await User.find();
  console.log("📦 Found users:\n", getUsers);
  process.exit(0);
}).catch((error) => {
    console.log(error)
    process.exit(1)
})
