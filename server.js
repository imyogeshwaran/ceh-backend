import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
