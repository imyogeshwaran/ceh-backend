import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("No token provided"); // Debug log
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // remove "Bearer"
  if (!token) {
    console.log("Invalid token format"); // Debug log
    return res.status(401).json({ message: "Invalid token format" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Invalid token:", err.message); // Debug log
      return res.status(403).json({ message: "Invalid token" });
    }
    console.log("Decoded token:", decoded); // Debug log
    req.user = decoded;
    console.log("req.user in authMiddleware:", req.user); // Debug log
    next();
  });
}

export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

export const verifyCollegeAdmin = (req, res, next) => {
  try {
    const { role } = req.user;

    console.log("User object in verifyCollegeAdmin:", req.user); // Debug log
    console.log("Decoded token in verifyCollegeAdmin:", req.user); // Debug log
    if (!req.user) {
      console.log("Access denied: No user object found"); // Debug log
      return res.status(403).json({ message: "Access denied: No user object found" });
    }

    if (req.user.role !== "college_admin") {
      console.log("Access denied: User is not a college admin"); // Debug log
      return res.status(403).json({ message: "Access denied: Only college admins can access this resource" });
    }

    console.log("Access granted: User is a college admin"); // Debug log
    next();
  } catch (err) {
    console.error("Error in verifyCollegeAdmin middleware:", err); // Debug log
    res.status(500).json({ error: "Server error" });
  }
};

export default authMiddleware;
