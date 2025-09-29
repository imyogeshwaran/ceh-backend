import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import authMiddleware, { verifyCollegeAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Route for admin dashboard statistics
router.get("/admin-dashboard", authMiddleware, verifyCollegeAdmin, getDashboardStats);

// Route for user-specific dashboard
router.get("/user-dashboard", authMiddleware, (req, res) => {
  console.log("User object from token:", req.user); // Debug log
  res.json({ message: "Welcome to User Dashboard", user: req.user });
});

export default router;