import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createOrganization,
  getOrganizations,
  updateOrganization,
  deactivateOrganization,
} from "../controllers/organizationController.js";

const router = express.Router();

// ==========================================
// PUBLIC - ACTIVE ORGANIZATIONS
// ==========================================

router.get("/", getOrganizations);

// ==========================================
// ADMIN - CREATE
// ==========================================

router.post(
  "/",
  protect,
  createOrganization
);

// ==========================================
// ADMIN - UPDATE
// ==========================================

router.put(
  "/:id",
  protect,
  updateOrganization
);

// ==========================================
// ADMIN - DEACTIVATE
// ==========================================

router.delete(
  "/:id",
  protect,
  deactivateOrganization
);

export default router;