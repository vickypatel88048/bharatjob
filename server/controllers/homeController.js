import Post from "../models/Post.js";

// Lightweight Home payload: only fields required by the Home page.
export const getHomePosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: "published",
      isDeleted: { $ne: true },
    })
      .select("title slug type publishedAt createdAt")
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(40)
      .lean();

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Get Home Posts Error:", error);
    res.status(500).json({ success: false, message: error.message, posts: [] });
  }
};
