import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import sitemapRoutes from "./routes/sitemapRoutes.js";

dotenv.config();

// MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

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