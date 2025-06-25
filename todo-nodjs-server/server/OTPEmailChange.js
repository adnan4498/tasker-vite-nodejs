// import { MongoClient, ObjectId } from "mongodb";
// import nodemailer from "nodemailer";

// const DB_URI = "mongodb://localhost:27017";
// const DB_NAME = "signup_demo";

// const client = new MongoClient(DB_URI);

// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// async function sendOTPEmail(email, otp) {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: "akhan123456008@gmail.com",
//     pass: "svph xiwn mfsu vuka",
//   });

//   await transporter.sendMail({
//     from: "akhan123456008@gmail.com",
//     to: email,
//     subject: "Your OTP Code",
//     text: `Your OTP is ${otp}. It expires in 10 minutes.`,
//   });
// }

// export async function requestEmailChange(userId, newEmail) {
//   await client.connect();
//   const db = client.db(DB_NAME);
//   const users = db.collection("users");

//   const otp = generateOTP();
//   const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

//   await users.updateOne(
//     { _id: new ObjectId(userId) },
//     {
//       $set: {
//         emailChangeOTP: otp,
//         emailChangeTarget: newEmail,
//         emailChangeExpiry: otpExpiry,
//       },
//     }
//   );

//   await sendOTPEmail(newEmail, otp);
//   return { message: "OTP sent to new email." };
// }

// export async function verifyEmailOTP(userId, otp) {
//   await client.connect();
//   const db = client.db(DB_NAME);
//   const users = db.collection("users");

//   const user = await users.findOne({ _id: new ObjectId(userId) });

//   if (
//     user.emailChangeOTP === otp &&
//     new Date(user.emailChangeExpiry) > new Date()
//   ) {
//     await users.updateOne(
//       { _id: new ObjectId(userId) },
//       {
//         $set: { email: user.emailChangeTarget },
//         $unset: {
//           emailChangeOTP: "",
//           emailChangeTarget: "",
//           emailChangeExpiry: "",
//         },
//       }
//     );
//     return { message: "Email updated successfully." };
//   } else {
//     throw new Error("Invalid or expired OTP.");
//   }
// }

// sendOTPEmail
// requestEmailChange
// verifyEmailOTP

import { MongoClient, ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const DB_URI = "mongodb://localhost:27017";
const DB_NAME = "signup_demo";

const client = new MongoClient(DB_URI);

const generateOTP = function () {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async function (email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "akhan123456008@gmail.com",
        pass: "svph xiwn mfsu vuka",
      },
    });

    return await transporter.sendMail({
      from: "akhan123456008@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw error;
  }
};

export const requestEmailChange = async function (userId, email, newEmail, res) {
  await client.connect();
  const db = client.db(DB_NAME);
  const users = db.collection("users");

  const getUser = await users.findOne(new ObjectId(userId));
  let otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const checkOtpSent = await sendOTPEmail(email, otp);

  try {
    if (checkOtpSent.accepted.length <= 0)
      throw new Error("otp email not found");

    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          emailChangeOTP: otp,
          emailChangeOTPExpiry: otpExpiry,
          emailChangeTarget: newEmail,
        },
      }
    );

    console.log(getUser, "ggg");
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ succeed: "to otp page" }));
  } catch (error) {
    return error;
  }
};

export const verifyEmailOTP = function(otpSubmitted){
  
}
