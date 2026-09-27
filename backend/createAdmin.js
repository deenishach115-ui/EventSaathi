import bcrypt from "bcryptjs";
import db from "./db.js";

const createAdmin = async () => {
  try {
    const name = "EventSaathi Admin";
    const email = "admin@eventsaathi.com";
    const password = "Admin@12345";
    const role = "admin";

    // Check if admin already exists
    const [existingAdmin] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingAdmin.length > 0) {
      console.log("Admin already exists!");
      process.exit();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert admin
    const [result] = await db.execute(
      `INSERT INTO users (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role],
    );

    console.log("Admin created successfully!");
    console.log("Admin ID:", result.insertId);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", role);

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
