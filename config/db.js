import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let connection;

const connectToDatabase = async () => {
  try {
    if (!connection) {
      console.log("DB_HOST:", process.env.DB_HOST); // Debug log
      console.log("DB_USER:", process.env.DB_USER); // Debug log
      console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "[HIDDEN]" : "[NOT SET]"); // Debug log
      console.log("DB_NAME:", process.env.DB_NAME); // Debug log

      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      console.log("Connected to MySQL database");
    }
    return connection;
  } catch (error) {
    console.error("Database connection error:", error); // Debug log
    throw error;
  }
};

export default connectToDatabase;
