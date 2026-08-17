import express from "express";
import {
  SitemapStream,
  streamToPromise,
} from "sitemap";
import Post from "../models/Post.js";

const router = express.Router();

const SITE_URL = "https://bharatjobs360.com";

// ==========================================
// SITEMAP
// ==========================================

router.get("/sitemap.xml", async (req, res) => {
  try {
    const posts = await Post.find({
      status: "published",
      isDeleted: { $ne: true },
      slug: {
        $exists: true,
        $ne: "",
      },
    })
      .select("slug updatedAt publishedAt createdAt")
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .lean();

    const sitemap = new SitemapStream({
      hostname: SITE_URL,
    });

    // ==========================================
    // MAIN HOME PAGE
    // ==========================================

    sitemap.write({
      url: "/",
      changefreq: "daily",
      priority: 1.0,
    });

    // ==========================================
    // STATIC PAGES
    // ==========================================

    const pages = [
      {
        url: "/jobs",
        priority: 0.9,
      },
      {
        url: "/results",
        priority: 0.9,
      },
      {
        url: "/admit-card",
        priority: 0.9,
      },
      {
        url: "/admission",
        priority: 0.8,
      },
      {
        url: "/syllabus",
        priority: 0.8,
      },
      {
        url: "/answer-key",
        priority: 0.8,
      },
      {
        url: "/contact",
        priority: 0.4,
      },
    ];

    pages.forEach((page) => {
      sitemap.write({
        url: page.url,
        changefreq: "daily",
        priority: page.priority,
      });
    });

    // ==========================================
    // DYNAMIC POSTS
    // ==========================================

    posts.forEach((post) => {
      if (!post.slug) {
        return;
      }

      const slug = String(post.slug)
        .trim()
        .replace(/^\/+|\/+$/g, "");

      if (!slug) {
        return;
      }

      sitemap.write({
        url: `/post/${encodeURIComponent(slug)}`,

        lastmod:
          post.updatedAt ||
          post.publishedAt ||
          post.createdAt ||
          new Date(),

        changefreq: "weekly",

        priority: 0.7,
      });
    });

    // ==========================================
    // END SITEMAP
    // ==========================================

    sitemap.end();

    const sitemapXML =
      await streamToPromise(sitemap);

    // ==========================================
    // RESPONSE HEADERS
    // ==========================================

    res.set({
      "Content-Type": "application/xml; charset=utf-8",

      "Cache-Control":
        "public, max-age=3600, s-maxage=3600",
    });

    return res.status(200).send(
      sitemapXML.toString()
    );
  } catch (error) {
    console.error(
      "Sitemap generation error:",
      error
    );

    return res.status(500).send(
      "Unable to generate sitemap"
    );
  }
});

export default router;