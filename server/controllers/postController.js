import Post from "../models/Post.js";
import generateSlug from "../utils/generateSlug.js";

// ==========================================
// CREATE POST - ADMIN ONLY
// ==========================================

export const createPost = async (req, res) => {
  try {
    const {
      title,
      slug,
      type,
      organization,
      shortDescription,
      content,
      status,
      featured,
      importantDates,
      applicationFee,
      ageLimit,
      vacancies,
      eligibility,
      selectionProcess,
      salary,
      howToApply,
      importantLinks,
      faq,
    } = req.body;

    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Post type is required",
      });
    }

    if (!organization) {
      return res.status(400).json({
        success: false,
        message: "Organization is required",
      });
    }

    // ==========================================
    // GENERATE CLEAN SEO SLUG
    // ==========================================

    const cleanSlug = generateSlug(slug || title);

    if (!cleanSlug) {
      return res.status(400).json({
        success: false,
        message: "Valid title or slug is required",
      });
    }

    // ==========================================
    // DUPLICATE SLUG
    // ==========================================

    const existingPost = await Post.findOne({
      slug: cleanSlug,
    });

    if (existingPost) {
      return res.status(409).json({
        success: false,
        message: "A post with this slug already exists",
      });
    }

    // ==========================================
    // STATUS
    // ==========================================

    const finalStatus =
      status === "published" ? "published" : "draft";

    // ==========================================
    // CREATE POST
    // ==========================================

    const post = await Post.create({
      title: title.trim(),

      slug: cleanSlug,

      type,

      organization,

      shortDescription:
        shortDescription?.trim() || "",

      content: content || "",

      status: finalStatus,

      featured: Boolean(featured),

      importantDates: Array.isArray(importantDates)
        ? importantDates
        : [],

      applicationFee: Array.isArray(applicationFee)
        ? applicationFee
        : [],

      ageLimit: ageLimit || {
        minimum: "",
        maximum: "",
        relaxation: "",
      },

      vacancies: Array.isArray(vacancies)
        ? vacancies
        : [],

      eligibility: eligibility || "",

      selectionProcess: Array.isArray(
        selectionProcess
      )
        ? selectionProcess
        : [],

      salary: salary || "",

      howToApply: howToApply || "",

      importantLinks: Array.isArray(importantLinks)
        ? importantLinks
        : [],

      faq: Array.isArray(faq) ? faq : [],

      publishedAt:
        finalStatus === "published"
          ? new Date()
          : null,
    });

    // ==========================================
    // POPULATE ORGANIZATION
    // ==========================================

    const populatedPost = await Post.findById(
      post._id
    ).populate(
      "organization",
      "name shortName slug website"
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Create Post Error:", error);

    // MongoDB duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A post with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL POSTS - PUBLIC + PAGINATION
// ==========================================

export const getPosts = async (req, res) => {
  try {
    const {
      type,
      status,
      featured,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const currentPage = Math.max(
      parseInt(page) || 1,
      1
    );

    const postsPerPage = Math.min(
      Math.max(parseInt(limit) || 20, 1),
      100
    );

    // ==========================================
    // BASE FILTER
    // ==========================================

    const filter = {
      isDeleted: {
        $ne: true,
      },
    };

    // ==========================================
    // PUBLIC DEFAULT
    // ==========================================

    if (!status) {
      filter.status = "published";
    } else {
      filter.status = status;
    }

    // ==========================================
    // TYPE
    // ==========================================

    if (type) {
      filter.type = type;
    }

    // ==========================================
    // FEATURED
    // ==========================================

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    // ==========================================
    // SEARCH
    // ==========================================

    if (search?.trim()) {
      filter.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          shortDescription: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // ==========================================
    // TOTAL
    // ==========================================

    const totalPosts =
      await Post.countDocuments(filter);

    const totalPages = Math.ceil(
      totalPosts / postsPerPage
    );

    // ==========================================
    // POSTS
    // ==========================================

    const posts = await Post.find(filter)
      .populate(
        "organization",
        "name shortName slug website"
      )
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .skip(
        (currentPage - 1) * postsPerPage
      )
      .limit(postsPerPage);

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      page: currentPage,
      limit: postsPerPage,
      totalPosts,
      totalPages,

      hasNextPage:
        currentPage < totalPages,

      hasPreviousPage:
        currentPage > 1,

      posts,
    });
  } catch (error) {
    console.error("Get Posts Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE POST BY SLUG - PUBLIC
// ==========================================

export const getPostBySlug = async (
  req,
  res
) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({
      slug,

      status: "published",

      isDeleted: {
        $ne: true,
      },
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
    console.error(
      "Get Post By Slug Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE POST BY ID - ADMIN ONLY
// ==========================================

export const getPostById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      _id: id,

      isDeleted: {
        $ne: true,
      },
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
    console.error(
      "Get Post By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE POST - ADMIN ONLY
// ==========================================

export const updatePost = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const post = await Post.findOne({
      _id: id,

      isDeleted: {
        $ne: true,
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const {
      title,
      slug,
      type,
      organization,
      shortDescription,
      content,
      status,
      featured,
      importantDates,
      applicationFee,
      ageLimit,
      vacancies,
      eligibility,
      selectionProcess,
      salary,
      howToApply,
      importantLinks,
      faq,
    } = req.body;

    // ==========================================
    // SLUG
    // ==========================================

    if (
      slug !== undefined ||
      title !== undefined
    ) {
      const newSlug = generateSlug(
        slug || title || post.title
      );

      if (!newSlug) {
        return res.status(400).json({
          success: false,
          message: "Invalid slug",
        });
      }

      if (newSlug !== post.slug) {
        const existingPost =
          await Post.findOne({
            slug: newSlug,
            _id: {
              $ne: id,
            },
          });

        if (existingPost) {
          return res.status(409).json({
            success: false,
            message:
              "A post with this slug already exists",
          });
        }
      }

      post.slug = newSlug;
    }

    // ==========================================
    // BASIC
    // ==========================================

    if (title !== undefined) {
      post.title = title.trim();
    }

    if (type !== undefined) {
      post.type = type;
    }

    if (organization !== undefined) {
      post.organization = organization;
    }

    if (shortDescription !== undefined) {
      post.shortDescription =
        shortDescription;
    }

    if (content !== undefined) {
      post.content = content;
    }

    if (featured !== undefined) {
      post.featured = Boolean(featured);
    }

    // ==========================================
    // SMART POST BUILDER
    // ==========================================

    if (importantDates !== undefined) {
      post.importantDates =
        Array.isArray(importantDates)
          ? importantDates
          : [];
    }

    if (applicationFee !== undefined) {
      post.applicationFee =
        Array.isArray(applicationFee)
          ? applicationFee
          : [];
    }

    if (ageLimit !== undefined) {
      post.ageLimit = ageLimit || {
        minimum: "",
        maximum: "",
        relaxation: "",
      };
    }

    if (vacancies !== undefined) {
      post.vacancies =
        Array.isArray(vacancies)
          ? vacancies
          : [];
    }

    if (eligibility !== undefined) {
      post.eligibility = eligibility;
    }

    if (selectionProcess !== undefined) {
      post.selectionProcess =
        Array.isArray(selectionProcess)
          ? selectionProcess
          : [];
    }

    if (salary !== undefined) {
      post.salary = salary;
    }

    if (howToApply !== undefined) {
      post.howToApply = howToApply;
    }

    if (importantLinks !== undefined) {
      post.importantLinks =
        Array.isArray(importantLinks)
          ? importantLinks
          : [];
    }

    if (faq !== undefined) {
      post.faq = Array.isArray(faq)
        ? faq
        : [];
    }

    // ==========================================
    // STATUS + PUBLISHED DATE
    // ==========================================

    if (status !== undefined) {
      post.status = status;
    }

    if (
      post.status === "published" &&
      !post.publishedAt
    ) {
      post.publishedAt = new Date();
    }

    if (post.status === "draft") {
      post.publishedAt = null;
    }

    // ==========================================
    // SAVE
    // ==========================================

    await post.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    const updatedPost =
      await Post.findById(post._id).populate(
        "organization",
        "name shortName slug website"
      );

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(
      "Update Post Error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "A post with this slug already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// SOFT DELETE POST - ADMIN ONLY
// ==========================================

export const deletePost = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const post =
      await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Post is already deleted",
      });
    }

    post.isDeleted = true;

    await post.save();

    return res.status(200).json({
      success: true,
      message:
        "Post moved to trash successfully",
    });
  } catch (error) {
    console.error(
      "Delete Post Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET TRASHED POSTS - ADMIN ONLY
// ==========================================

export const getTrashedPosts = async (
  req,
  res
) => {
  try {
    const posts =
      await Post.find({
        isDeleted: true,
      })
        .populate(
          "organization",
          "name shortName slug website"
        )
        .sort({
          updatedAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error(
      "Get Trash Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// RESTORE POST - ADMIN ONLY
// ==========================================

export const restorePost = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const post =
      await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (!post.isDeleted) {
      return res.status(400).json({
        success: false,
        message:
          "Post is not in trash",
      });
    }

    post.isDeleted = false;

    await post.save();

    const restoredPost =
      await Post.findById(
        post._id
      ).populate(
        "organization",
        "name shortName slug website"
      );

    return res.status(200).json({
      success: true,
      message:
        "Post restored successfully",
      post: restoredPost,
    });
  } catch (error) {
    console.error(
      "Restore Post Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};