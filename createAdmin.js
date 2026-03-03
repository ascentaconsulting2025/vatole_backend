const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/grampanchayat"
    );

    const email = process.env.ADMIN_EMAIL || "admin@grampanchayat.gov.in";
    const password = process.env.ADMIN_PASSWORD || "admin123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      email,
      password,
      role: "admin",
    });

    await admin.save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
