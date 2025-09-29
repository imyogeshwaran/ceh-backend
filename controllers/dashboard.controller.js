import connectToDatabase from "../config/db.js";

// New API for dashboard after login/signup
export const getUserDashboard = (req, res) => {
  const userId = req.user.id; // Assuming user ID is stored in req.user by auth middleware
  const userStats = {};

  db.query("SELECT COUNT(*) AS userEvents FROM Events WHERE userId = ?", [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    userStats.userEvents = rows.length > 0 ? rows[0].userEvents : 0;

    db.query("SELECT COUNT(*) AS userRegistrations FROM Registrations WHERE userId = ?", [userId], (err2, rows2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      userStats.userRegistrations = rows2.length > 0 ? rows2[0].userRegistrations : 0;

      db.query("SELECT AVG(rating) AS avgUserRating FROM Feedback WHERE userId = ?", [userId], (err3, rows3) => {
        if (err3) return res.status(500).json({ error: err3.message });
        userStats.avgUserRating = rows3.length > 0 ? rows3[0].avgUserRating || 0 : 0;

        res.json(userStats);
      });
    });
  });
};

// Corrected export for getDashboardStats
export const getDashboardStats = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const stats = {};

    const [totalEvents] = await db.query("SELECT COUNT(*) AS totalEvents FROM Events");
    stats.totalEvents = totalEvents[0].totalEvents;

    const [activeUsers] = await db.query("SELECT COUNT(DISTINCT user_id) AS activeUsers FROM Registrations");
    stats.activeUsers = activeUsers[0].activeUsers;

    const [totalRegistrations] = await db.query("SELECT COUNT(*) AS totalRegistrations FROM Registrations");
    stats.totalRegistrations = totalRegistrations[0].totalRegistrations;

    const [pendingReviews] = await db.query("SELECT COUNT(*) AS pendingReviews FROM Feedback WHERE rating IS NULL");
    stats.pendingReviews = pendingReviews[0].pendingReviews;

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};