import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { User } from "./models/User.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import {authMiddleware} from "./middleware";
import { Note } from "./models/Notes.js";
dotenv.config();

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error("MONGO_URI is not defined.");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(cors({
  origin: "https://my-react-app-eefp.vercel.app", 
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


app.post("/send-otp", async (req: Request, res: Response) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  let user = await User.findOne({ email });

  // If already fully registered
  if (user && user.name) {
    return res.status(400).json({ message: "Email already exists!" });
  }

  // Update or create user with OTP
  await User.updateOne(
    { email },
    { $set: { otp } },
    { upsert: true }
  );

  // Send OTP via mail
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP Code",
    text: `Your OTP is ${otp}`,
  });

  res.json({ success: true, message: "OTP sent!" });
});


// Signup
app.post("/signup", async (req: Request, res: Response) => {
  try {
    const { name, dob, email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Please request OTP first!" });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update user details after OTP verified
    user.name = name;
    user.dob = dob;
     // clear otp after use
    await user.save();

    res.json({
      user,
      token: (user as any).generateToken(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP
app.post("/verify-otp", async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (!user || Number(user.otp) !== Number(otp)) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  res.json({ success: true, message: "OTP verified!" });
});


app.post("/login", async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res.status(400).json({ message: "User not found!" });
  }

  if (Number(user.otp) !== Number(otp)) {
    return res.status(400).json({ message: "Invalid OTP!" });
  }
  return res.json({ user, token: (user as any).generateToken() });
});

app.get("/getuser", authMiddleware, async (req: any, res) => {
  res.json({ name: req.user.name, email: req.user.email });
});


//notes

app.post("/notes", authMiddleware, async (req: any, res) => {
  const note = new Note({ ...req.body, userId: req.user._id });
  await note.save();
  res.json({ message: "Note created", note });
});

app.get("/notes", authMiddleware, async (req: any, res) => {
  const notes = await Note.find({ userId: req.user._id });
  res.json(notes);
});

app.delete("/notes/:id", authMiddleware, async (req: any, res) => {
  await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ message: "Note deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
