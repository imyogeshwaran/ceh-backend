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

    const { name, email, password, role } = req.body;
    const id = uuidv4(); // generate UUID for primary key

    if (!name || !email || !password) {
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

    await db.execute(
      "INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [id, name, email, hashedPassword, role || "student"]
    );

    console.log("User registered successfully"); // Debug log
    res.status(201).json({ message: "User registered successfully", userId: id });
  } catch (err) {
    console.error("Server error:", err); // Debug log
    res.status(500).json({ error: "Server error" });
  }
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = await connectToDatabase();
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


