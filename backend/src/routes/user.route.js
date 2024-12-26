import express from "express"
import {z} from "zod"
import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import authenticate from "../midddleware/middleware.js"


const userRouter=express.Router()

const userSchema=z.object({
  fullName: z.string().min(4),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[^A-Za-z0-9]/)
})

const signinSchema=z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[^A-Za-z0-9]/)
})

userRouter.post('/user/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  
  try {
    const parsedData = userSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).send({ message: "User already exists" }); 
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).send({ message: "User added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/user/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const parsedData = signinSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: "Invalid data", errors: parsedData.error.errors });
    }

    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return res.status(401).send({ message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, existedUser.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: existedUser._id }, process.env.MYJWTKEY, { expiresIn: '1h' });

    res.status(200).json({
      message: "Signin successful",
      token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.get('/user/profile', authenticate, async (req, res) => {
  try {
    
    const user = await User.findById(req.user.userId).select('fullName'); // Adjust the fields you want to return

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ fullName: user.fullName}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



export default userRouter