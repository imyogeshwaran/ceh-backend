import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// ---------- SIGN UP ----------
export const signup = async (req, res) => {
  try {
    console.log("Middleware check: express.json() is working"); // Debug log
    console.log("Signup request body:", req.body); // Debug log

    const { name, email, password, college, role } = req.body;

    if (!name || !email || !password || !college) {
      console.log("Validation failed: Missing required fields"); // Debug log
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = await connectToDatabase();
    const [userExists] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (userExists.length > 0) {
      console.log("Validation failed: Email already registered"); // Debug log
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await db.execute(
        "INSERT INTO users (name, email, password, college, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, college, role || "student"]
      );

      console.log("User registered successfully"); // Debug log
      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Database error during signup:", err); // Debug log
      res.status(500).json({ error: "Server error" });
    }
  } catch (err) {
    console.error("Server error:", err); // Debug log
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request received:", { email }); // Debug log

    const db = await connectToDatabase();
    console.log("Database connection established"); // Debug log

    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    console.log("Query executed: SELECT * FROM users WHERE email = ?", { email }); // Debug log

    if (rows.length === 0) {
      console.log("No user found with email:", email); // Debug log
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    console.log("Stored hashed password:", user.password); // Debug log
    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", validPassword); // Debug log

    if (!validPassword) {
      console.log("Password mismatch for user:", email); // Debug log
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    console.log("Login successful for user:", email); // Debug log
    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Error during login:", err); // Debug log
    res.status(500).json({ error: "Server error" });
  }
};


