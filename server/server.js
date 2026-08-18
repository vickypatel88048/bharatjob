import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import app from "./app.js";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";
import sitemapRoutes from "./routes/sitemapRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create the default admin automatically if it does not exist.
const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || "admin@bharatjobs.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const name = process.env.ADMIN_NAME || "Super Admin";

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    console.log("✅ Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await Admin.create({
    name,
    email,
    password: hashedPassword,
  });

  console.log(`✅ Default admin created: ${email}`);
};

const startServer = async () => {
  try {
    await connectDB();
    await ensureAdmin();

    // ==========================================
    // SITEMAP
    // ==========================================
    app.use("/", sitemapRoutes);

    // ==========================================
    // API ROOT
    // ==========================================
    app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "🚀 BharatJobs API Running..."
      });
    });

    // ==========================================
    // SERVER
    // ==========================================
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
