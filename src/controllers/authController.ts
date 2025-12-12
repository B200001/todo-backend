import type { Request, Response } from "express";
import bcrypt from "bcryptjs";        // For hashing and comparing passwords
import jwt from "jsonwebtoken";        // For generating auth tokens
import dotenv from "dotenv";
import User from "../models/User";     // Mongoose User model

dotenv.config();

/**
 * REGISTER CONTROLLER
 * --------------------
 * This endpoint creates a new user account.
 * Steps:
 * 1. Validate email & password
 * 2. Check if email already exists
 * 3. Hash the password securely
 * 4. Save user to database
 * 5. Generate a JWT token for authentication
 * 6. Return token + user data to client
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Ensure required fields are provided
    if (!email || !password)
      return res.status(400).json({ message: "Provide email and password" });

    // Check if user already exists in database
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password (salt increases security)
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create new user document
    const user = new User({ email, password: hashed });
    await user.save();

    // Sign JWT token with user ID
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }       // Token valid for 7 days
    );

    // Send back token + serialized user object (never send password)
    res.json({ token, user: { id: user._id, email: user.email } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * LOGIN CONTROLLER
 * --------------------
 * This endpoint authenticates existing users.
 * Steps:
 * 1. Validate email & password
 * 2. Find user by email
 * 3. Compare provided password with hashed password (bcrypt)
 * 4. Generate JWT token
 * 5. Return token + user details
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Ensure both credentials are provided
    if (!email || !password)
      return res.status(400).json({ message: "Provide email and password" });

    // Check if user exists in DB
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // Compare unhashed password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    // Respond with token + safe user data
    res.json({ token, user: { id: user._id, email: user.email } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
