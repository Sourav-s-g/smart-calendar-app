import * as userService from './user.service.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET is not defined in environment variables!");
}

// REGISTER USER (Inserting into PROFILES)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    // Check if profile already exists by email
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // This calls the service which now targets the 'profiles' table
    const user = await userService.createUser({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User profile created successfully",
      data: user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const authData = await userService.loginUser(email, password);

    // authData contains: { user: {...}, session: { access_token: "...", expires_in: 3600 } }
    res.json({
      success: true,
      message: "Login successful",
      token: authData.session.access_token, // This is your JWT
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.user_metadata?.name
      }
    });

  } catch (err) {
    // ADD THIS LINE TO YOUR TERMINAL
    console.error("DETAILED LOGIN ERROR:", err); 

    res.status(401).json({
      success: false,
      message: err.message || "Invalid email or password",
      error_detail: err.status // Tells us if it's a 400, 422, or 401
    });
  }
};

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const data = await userService.getUsers();

    // Strip out sensitive fields before sending to client
    const safeData = data.map(({ password_hash, ...user }) => user);

    res.json({
      success: true,
      count: safeData.length,
      data: safeData
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await userService.getUserById(id);

    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Strip password_hash if it exists
    const { password_hash, ...safeUser } = data;

    res.json({
      success: true,
      data: safeUser
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};