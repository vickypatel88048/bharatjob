import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import app from "./app.js";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";
import sitemapRoutes from "./routes/sitemapRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

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

// Keep the health endpoint available immediately so Render can detect a
// healthy web process even while MongoDB is reconnecting.
app.use("/", sitemapRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 BharatJobs API Running...",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const initializeDatabase = async () => {
  try {
    await connectDB();
    await ensureAdmin();
    console.log("✅ Database initialization completed");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    console.error("⚠️ Server is still running. Check MONGO_URI in Render environment variables.");
  }
};

initializeDatabase();
