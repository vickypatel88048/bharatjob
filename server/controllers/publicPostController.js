import mongoose from "mongoose";
import Post from "../models/Post.js";

// PUBLIC - SINGLE PUBLISHED POST BY ID
export const getPublicPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post id",
      });
    }

    const post = await Post.findOne({
      _id: id,
      status: "published",
      isDeleted: { $ne: true },
    }).populate(
      "organization",
      "name shortName slug website"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get Public Post By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
