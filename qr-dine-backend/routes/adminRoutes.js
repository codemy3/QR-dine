import express from "express";
import Admin from "../models/Admin.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

// Admin Login
router.post("/login", asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Username and password are required");
  }

  const admin = await Admin.findOne({ username });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      username: admin.username,
      message: "Login successful"
    });
  } else {
    res.status(401);
    throw new Error("Invalid username or password");
  }
}));

// Register Admin (use this once to create admin account, then comment out for security)
router.post("/register", asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Username and password are required");
  }

  const adminExists = await Admin.findOne({ username });

  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const admin = await Admin.create({ username, password });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      message: "Admin created successfully"
    });
  } else {
    res.status(400);
    throw new Error("Failed to create admin");
  }
}));

export default router;