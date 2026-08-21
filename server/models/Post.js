import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },

    type: {
      type: String,
      enum: ["job", "result", "admit-card", "answer-key", "admission", "syllabus", "document"],
      required: true,
      index: true,
    },

    // A single post can appear in multiple Home sections.
    placements: {
      type: [String],
      enum: ["latest-jobs", "results", "admit-card", "answer-key", "admission", "syllabus", "featured"],
      default: [],
      index: true,
    },

    organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    shortDescription: { type: String, trim: true, default: "" },
    content: { type: String, default: "" },

    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    featured: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: null, index: true },

    importantDates: [{ label: { type: String, trim: true }, date: { type: String, trim: true } }],
    applicationFee: [{ category: { type: String, trim: true }, amount: { type: String, trim: true } }],

    ageLimit: {
      minimum: { type: String, default: "" },
      maximum: { type: String, default: "" },
      relaxation: { type: String, default: "" },
    },

    vacancies: [{ postName: { type: String, trim: true }, total: { type: Number, default: 0 } }],
    eligibility: { type: String, default: "" },
    selectionProcess: [{ type: String, trim: true }],
    salary: { type: String, default: "" },
    howToApply: { type: String, default: "" },
    importantLinks: [{ label: { type: String, trim: true }, url: { type: String, trim: true } }],
    faq: [{ question: { type: String, trim: true }, answer: { type: String, trim: true } }],
  },
  { timestamps: true }
);

postSchema.index({ status: 1, isDeleted: 1, publishedAt: -1 });
postSchema.index({ type: 1, status: 1, isDeleted: 1, publishedAt: -1 });
postSchema.index({ placements: 1, status: 1, isDeleted: 1, publishedAt: -1 });

export default mongoose.model("Post", postSchema);
