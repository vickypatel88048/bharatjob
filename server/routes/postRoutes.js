import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createPost,
  getPosts,
  getPostBySlug,
  getPostById,
  updatePost,
  deletePost,
  getTrashedPosts,
  restorePost,
} from "../controllers/postController.js";

import { getHomePosts } from "../controllers/homeController.js";

import { importPostsFromUrl } from "../controllers/importController.js";

const router = express.Router();

// Fast public Home payload. Keep before /:slug.
router.get("/home", getHomePosts);

// PUBLIC - ALL POSTS
router.get("/", getPosts);

// ADMIN - IMPORT FROM URL
router.post("/import-url", protect, importPostsFromUrl);

// ADMIN - SINGLE POST BY ID
router.get("/id/:id", protect, getPostById);

// ADMIN - TRASH
router.get("/trash", protect, getTrashedPosts);

// ADMIN - RESTORE
router.put("/:id/restore", protect, restorePost);

// ADMIN - CREATE POST
router.post("/", protect, createPost);

// ADMIN - UPDATE POST
router.put("/:id", protect, updatePost);

// ADMIN - DELETE POST
router.delete("/:id", protect, deletePost);

// PUBLIC - SINGLE POST BY SLUG
router.get("/:slug", getPostBySlug);

export default router;
