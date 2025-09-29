import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboard.router.js";

const app = express();
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Register dashboard routes
app.use("/api/auth", dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
