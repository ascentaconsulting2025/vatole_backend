const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database Connection and Auto-Setup
const { testConnection: testSupabase } = require("./config/supabase");
const { testConnection: testDB } = require("./config/database");
const setupDatabase = require("./scripts/setupDatabase");

// Test connections and auto-setup database on startup
(async () => {
  console.log("🚀 Starting Gram Panchayat Backend...");

  const supabaseOk = await testSupabase();
  const dbOk = await testDB();

  // If PostgreSQL is not connected, exit
  if (!dbOk) {
    console.error("❌ PostgreSQL connection failed - cannot continue");
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    return;
  }

  // Auto-setup database (creates tables and admin if not exists)
  // This runs even if Supabase check fails (tables might not exist yet)
  try {
    console.log("\n🔧 Running auto-setup...");
    await setupDatabase();
    console.log("✅ Auto-setup completed\n");

    // Test Supabase again after table creation
    if (!supabaseOk) {
      console.log("🔄 Retesting Supabase connection...");
      const supabaseRetry = await testSupabase();
      if (supabaseRetry) {
        console.log("✅ Supabase connection successful after setup\n");
      } else {
        console.warn(
          "⚠️  Supabase still not connected, but server will continue\n"
        );
      }
    }
  } catch (error) {
    console.error("⚠️  Auto-setup failed:", error.message);
    console.log(
      "ℹ️  Server will continue, but database may need manual setup\n"
    );
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

// Import Routes
const authRoutes = require("./routes/auth");
const representativesRoutes = require("./routes/representatives");
const documentsRoutes = require("./routes/documents");
const certificatesRoutes = require("./routes/certificates");
const imagesRoutes = require("./routes/images");
const heroImagesRoutes = require("./routes/heroImages");
const infrastructureRoutes = require("./routes/infrastructure");
const historicalRoutes = require("./routes/historical");
const grampanchayatRoutes = require("./routes/grampanchayat");
const websiteDataRoutes = require("./routes/websiteData");
const announcementsRoutes = require("./routes/announcements");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/representatives", representativesRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/certificates", certificatesRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/hero-images", heroImagesRoutes);
app.use("/api/infrastructure", infrastructureRoutes);
app.use("/api/historical", historicalRoutes);
app.use("/api/grampanchayat", grampanchayatRoutes);
app.use("/api/website", websiteDataRoutes);
app.use("/api/announcements", announcementsRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Gram Panchayat API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      representatives: "/api/representatives",
      certificates: "/api/certificates",
      images: "/api/images",
      announcements: "/api/announcements",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Gram Panchayat API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 API URL: http://${HOST}:${PORT}/api`);
});

module.exports = app;
