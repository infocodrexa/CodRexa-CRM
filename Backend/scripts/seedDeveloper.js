import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "../Models/User.js";
import bcrypt from "bcryptjs";

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = process.env.INIT_DEV_EMAIL;
  const pwd = process.env.INIT_DEV_PASS;
  if (!email || !pwd) {
    console.log("Please set INIT_DEV_EMAIL and INIT_DEV_PASS in .env");
    process.exit(1);
  }
  const exists = await User.findOne({ email });
  if (exists) {
    console.log("Developer exists:", email);
    process.exit(0);
  }
  // const hashed = await bcrypt.hash(pwd, 10);
  const dev = await User.create({
    name: "Initial Developer",
    username: email.split("@")[0],
    email,
    password: pwd,
    role: "developer",
    createdBy: null
  });
  console.log("Developer created:", dev.email);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});



// npm run seed:dev    to run code and create developer