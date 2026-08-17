import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "job",
        "result",
        "admit-card",
        "answer-key",
        "admission",
        "syllabus",
        "document",
      ],
      required: true,
      index: true,
    },

    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },

    // ==========================================
    // IMPORTANT DATES
    // ==========================================

    importantDates: [
      {
        label: {
          type: String,
          trim: true,
        },

        date: {
          type: String,
          trim: true,
        },
      },
    ],

    // ==========================================
    // APPLICATION FEE
    // ==========================================

    applicationFee: [
      {
        category: {
          type: String,
          trim: true,
        },

        amount: {
          type: String,
          trim: true,
        },
      },
    ],

    // ==========================================
    // AGE LIMIT
    // ==========================================

    ageLimit: {
      minimum: {
        type: String,
        default: "",
      },

      maximum: {
        type: String,
        default: "",
      },

      relaxation: {
        type: String,
        default: "",
      },
    },

    // ==========================================
    // VACANCIES
    // ==========================================

    vacancies: [
      {
        postName: {
          type: String,
          trim: true,
        },

        total: {
          type: Number,
          default: 0,
        },
      },
    ],

    // ==========================================
    // ELIGIBILITY
    // ==========================================

    eligibility: {
      type: String,
      default: "",
    },

    // ==========================================
    // SELECTION PROCESS
    // ==========================================

    selectionProcess: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // SALARY
    // ==========================================

    salary: {
      type: String,
      default: "",
    },

    // ==========================================
    // HOW TO APPLY
    // ==========================================

    howToApply: {
      type: String,
      default: "",
    },

    // ==========================================
    // IMPORTANT LINKS
    // ==========================================

    importantLinks: [
      {
        label: {
          type: String,
          trim: true,
        },

        url: {
          type: String,
          trim: true,
        },
      },
    ],

    // ==========================================
    // FAQ
    // ==========================================

    faq: [
      {
        question: {
          type: String,
          trim: true,
        },

        answer: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

postSchema.index({
  status: 1,
  isDeleted: 1,
  publishedAt: -1,
});

postSchema.index({
  type: 1,
  status: 1,
  isDeleted: 1,
  publishedAt: -1,
});

export default mongoose.model("Post", postSchema);