import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import postRoutes from "./routes/postRoutes.js";

import organizationRoutes from "./routes/organizationRoutes.js";
const app = express();

app.use(cors());
app.use(helmet());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/organizations", organizationRoutes);
export default app;