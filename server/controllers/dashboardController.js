import Post from "../models/Post.js";
import Organization from "../models/Organization.js";

// ==========================================
// GET DASHBOARD STATS - ADMIN ONLY
// ==========================================
export const getDashboardStats = async (req, res) => {
  try {
    const activePostFilter = {
      $or: [
        { isDeleted: false },
        { isDeleted: { $exists: false } },
      ],
    };

    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      trashedPosts,
      totalOrganizations,
    ] = await Promise.all([
      // Total active posts
      Post.countDocuments(activePostFilter),

      // Published posts
      Post.countDocuments({
        status: "published",
        ...activePostFilter,
      }),

      // Draft posts
      Post.countDocuments({
        status: "draft",
        ...activePostFilter,
      }),

      // Trash
      Post.countDocuments({
        isDeleted: true,
      }),

      // Active organizations
      Organization.countDocuments({
        isActive: true,
      }),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        trashedPosts,
        totalOrganizations,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};