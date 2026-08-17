import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ArrowLeft,
  FileText,
  CalendarDays,
  IndianRupee,
  Users,
  GraduationCap,
  ListChecks,
  WalletCards,
  ClipboardList,
  Link as LinkIcon,
  HelpCircle,
  Save,
  Send,
  Star,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

const createInitialForm = () => ({
  title: "",
  slug: "",
  type: "job",
  organization: "",
  shortDescription: "",
  content: "",
  status: "draft",
  featured: false,

  importantDates: [
    {
      label: "",
      date: "",
    },
  ],

  applicationFee: [
    {
      category: "",
      amount: "",
    },
  ],

  ageLimit: {
    minimum: "",
    maximum: "",
    relaxation: "",
  },

  vacancies: [
    {
      postName: "",
      total: "",
    },
  ],

  eligibility: "",

  selectionProcess: [""],

  salary: "",

  howToApply: "",

  importantLinks: [
    {
      label: "",
      url: "",
    },
  ],

  faq: [
    {
      question: "",
      answer: "",
    },
  ],
});

const AddPost = () => {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(createInitialForm);

  // ==========================================
  // LOAD ORGANIZATIONS
  // ==========================================

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(
        `${API}/organizations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrganizations(
        response.data?.organizations || []
      );
    } catch (error) {
      console.error(
        "Load Organizations Error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Failed to load organizations"
      );
    }
  };

  // ==========================================
  // BASIC CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================================
  // SLUG
  // ==========================================

  const generateSlug = (value) => {
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;

    setForm((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  // ==========================================
  // GENERIC ARRAY UPDATE
  // ==========================================

  const updateArrayItem = (
    key,
    index,
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  const removeArrayItem = (key, index) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ==========================================
  // IMPORTANT DATES
  // ==========================================

  const addDate = () => {
    setForm((prev) => ({
      ...prev,
      importantDates: [
        ...prev.importantDates,
        {
          label: "",
          date: "",
        },
      ],
    }));
  };

  // ==========================================
  // APPLICATION FEE
  // ==========================================

  const addFee = () => {
    setForm((prev) => ({
      ...prev,
      applicationFee: [
        ...prev.applicationFee,
        {
          category: "",
          amount: "",
        },
      ],
    }));
  };

  // ==========================================
  // VACANCIES
  // ==========================================

  const addVacancy = () => {
    setForm((prev) => ({
      ...prev,
      vacancies: [
        ...prev.vacancies,
        {
          postName: "",
          total: "",
        },
      ],
    }));
  };

  // ==========================================
  // SELECTION PROCESS
  // ==========================================

  const addSelection = () => {
    setForm((prev) => ({
      ...prev,
      selectionProcess: [
        ...prev.selectionProcess,
        "",
      ],
    }));
  };

  const updateSelection = (
    index,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      selectionProcess:
        prev.selectionProcess.map(
          (item, i) =>
            i === index
              ? value
              : item
        ),
    }));
  };

  const removeSelection = (index) => {
    setForm((prev) => ({
      ...prev,
      selectionProcess:
        prev.selectionProcess.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // ==========================================
  // IMPORTANT LINKS
  // ==========================================

  const addLink = () => {
    setForm((prev) => ({
      ...prev,
      importantLinks: [
        ...prev.importantLinks,
        {
          label: "",
          url: "",
        },
      ],
    }));
  };

  // ==========================================
  // FAQ
  // ==========================================

  const addFaq = () => {
    setForm((prev) => ({
      ...prev,
      faq: [
        ...prev.faq,
        {
          question: "",
          answer: "",
        },
      ],
    }));
  };

  // ==========================================
  // AGE LIMIT
  // ==========================================

  const updateAge = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      ageLimit: {
        ...prev.ageLimit,
        [field]: value,
      },
    }));
  };

  // ==========================================
  // CLEAN DATA
  // ==========================================

  const cleanPayload = (
    finalStatus
  ) => {
    return {
      ...form,

      title: form.title.trim(),

      slug: generateSlug(form.slug),

      type: form.type,

      organization:
        form.organization,

      shortDescription:
        form.shortDescription.trim(),

      content:
        form.content.trim(),

      status: finalStatus,

      featured:
        Boolean(form.featured),

      importantDates:
        form.importantDates.filter(
          (item) =>
            item.label.trim() ||
            item.date.trim()
        ),

      applicationFee:
        form.applicationFee.filter(
          (item) =>
            item.category.trim() ||
            item.amount.trim()
        ),

      ageLimit: {
        minimum:
          form.ageLimit.minimum.trim(),

        maximum:
          form.ageLimit.maximum.trim(),

        relaxation:
          form.ageLimit.relaxation.trim(),
      },

      vacancies:
        form.vacancies
          .filter(
            (item) =>
              item.postName.trim() ||
              item.total !== ""
          )
          .map((item) => ({
            postName:
              item.postName.trim(),

            total:
              item.total === ""
                ? 0
                : Number(item.total),
          })),

      eligibility:
        form.eligibility.trim(),

      selectionProcess:
        form.selectionProcess
          .map((item) =>
            item.trim()
          )
          .filter(Boolean),

      salary:
        form.salary.trim(),

      howToApply:
        form.howToApply.trim(),

      importantLinks:
        form.importantLinks.filter(
          (item) =>
            item.label.trim() ||
            item.url.trim()
        ),

      faq:
        form.faq.filter(
          (item) =>
            item.question.trim() ||
            item.answer.trim()
        ),

      publishedAt:
        finalStatus === "published"
          ? new Date()
          : null,
    };
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    e,
    publish = false
  ) => {
    e.preventDefault();

    // Save Draft = draft
    // Publish = published
    const finalStatus = publish
      ? "published"
      : "draft";

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    if (!form.organization) {
      toast.error(
        "Please select organization"
      );
      return;
    }

    if (!form.type) {
      toast.error(
        "Please select post type"
      );
      return;
    }

    // ==========================================
    // TOKEN
    // ==========================================

    const token =
      localStorage.getItem(
        "adminToken"
      );

    if (!token) {
      toast.error(
        "Your session has expired. Please login again."
      );

      navigate("/admin/login");
      return;
    }

    try {
      setLoading(true);

      const payload =
        cleanPayload(
          finalStatus
        );

      const response =
        await axios.post(
          `${API}/posts`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      if (response.data?.success) {
        toast.success(
          finalStatus ===
            "published"
            ? "Post published successfully"
            : "Post saved as draft successfully"
        );

        navigate("/admin/posts");
      } else {
        toast.error(
          response.data?.message ||
            "Failed to create post"
        );
      }
    } catch (error) {
      console.error(
        "Create Post Error:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        toast.error(
          "Session expired. Please login again."
        );

        navigate("/admin/login");
        return;
      }

      if (
        error.response?.status ===
        409
      ) {
        toast.error(
          "This slug already exists. Please use a different title or slug."
        );

        return;
      }

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STYLES
  // ==========================================

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

  const textareaClass =
    "w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50";

  const sectionClass =
    "rounded-2xl border border-slate-200 bg-white shadow-sm";

  const sectionHeader =
    "flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6";

  const sectionBody =
    "p-5 sm:p-6";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  const addButtonClass =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50";

  // ==========================================
  // SECTION TITLE
  // ==========================================

  const SectionTitle = ({
    icon: Icon,
    title,
    description,
    action,
  }) => (
    <div className={sectionHeader}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={19} />
        </div>

        <div>
          <h2 className="text-base font-bold text-slate-800 sm:text-lg">
            {title}
          </h2>

          {description && (
            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
              {description}
            </p>
          )}
        </div>
      </div>

      {action}
    </div>
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* ==================================
              HEADER
          ================================== */}

          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/posts"
                  )
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <ArrowLeft
                  size={20}
                />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Add New Post
                  </h1>

                  <span className="hidden rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 sm:inline-block">
                    Post Builder
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Create a complete
                  recruitment, result or
                  admission notification.
                </p>
              </div>

            </div>

            {/* TOP ACTIONS */}

            <div className="flex gap-2">

              <button
                type="button"
                onClick={(e) =>
                  handleSubmit(
                    e,
                    false
                  )
                }
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <Save size={17} />

                {loading
                  ? "Saving..."
                  : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={(e) =>
                  handleSubmit(
                    e,
                    true
                  )
                }
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
              >
                <Send size={17} />

                {loading
                  ? "Publishing..."
                  : "Publish"}
              </button>

            </div>
          </div>

          {/* ==================================
              FORM
          ================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ==================================
                BASIC INFORMATION
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={FileText}
                title="Basic Information"
                description="Main information about the notification"
              />

              <div
                className={
                  sectionBody
                }
              >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                  {/* TITLE */}

                  <div className="md:col-span-2">
                    <label
                      className={
                        labelClass
                      }
                    >
                      Post Title{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      value={
                        form.title
                      }
                      onChange={
                        handleTitleChange
                      }
                      className={
                        inputClass
                      }
                      placeholder="UP Police Constable Recruitment 2026"
                    />
                  </div>

                  {/* SLUG */}

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      URL Slug{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      name="slug"
                      value={
                        form.slug
                      }
                      onChange={
                        handleChange
                      }
                      className={
                        inputClass
                      }
                      placeholder="up-police-constable-recruitment-2026"
                    />

                    <p className="mt-1.5 text-xs text-slate-400">
                      Public URL:
                      /post/
                      {form.slug ||
                        "your-post-slug"}
                    </p>
                  </div>

                  {/* TYPE */}

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Post Type
                    </label>

                    <select
                      name="type"
                      value={
                        form.type
                      }
                      onChange={
                        handleChange
                      }
                      className={
                        inputClass
                      }
                    >
                      <option value="job">
                        Job
                      </option>

                      <option value="result">
                        Result
                      </option>

                      <option value="admit-card">
                        Admit Card
                      </option>

                      <option value="answer-key">
                        Answer Key
                      </option>

                      <option value="admission">
                        Admission
                      </option>
                    </select>
                  </div>

                  {/* ORGANIZATION */}

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Organization{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <select
                      name="organization"
                      value={
                        form.organization
                      }
                      onChange={
                        handleChange
                      }
                      className={
                        inputClass
                      }
                    >
                      <option value="">
                        Select Organization
                      </option>

                      {organizations.map(
                        (
                          organization
                        ) => (
                          <option
                            key={
                              organization._id
                            }
                            value={
                              organization._id
                            }
                          >
                            {
                              organization.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* SHORT DESCRIPTION */}

                  <div className="md:col-span-2">
                    <label
                      className={
                        labelClass
                      }
                    >
                      Short Description
                    </label>

                    <textarea
                      name="shortDescription"
                      value={
                        form.shortDescription
                      }
                      onChange={
                        handleChange
                      }
                      rows={4}
                      className={
                        textareaClass
                      }
                      placeholder="Write a short summary that will appear on post cards and listing pages..."
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="md:col-span-2">
                    <label
                      className={
                        labelClass
                      }
                    >
                      Post Content
                    </label>

                    <textarea
                      name="content"
                      value={
                        form.content
                      }
                      onChange={
                        handleChange
                      }
                      rows={8}
                      className={
                        textareaClass
                      }
                      placeholder="Write the main notification content..."
                    />
                  </div>

                  {/* FEATURED */}

                  <div className="md:col-span-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50/40">

                      <input
                        type="checkbox"
                        name="featured"
                        checked={
                          form.featured
                        }
                        onChange={
                          handleChange
                        }
                        className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <div className="flex items-center gap-2">

                        <Star
                          size={18}
                          className={
                            form.featured
                              ? "fill-yellow-400 text-yellow-500"
                              : "text-slate-400"
                          }
                        />

                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            Featured Post
                          </p>

                          <p className="text-xs text-slate-400">
                            Highlight this post
                            on the website.
                          </p>
                        </div>

                      </div>

                    </label>
                  </div>

                </div>
              </div>
            </section>

            {/* ==================================
                IMPORTANT DATES
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={CalendarDays}
                title="Important Dates"
                description="Application and examination dates"
                action={
                  <button
                    type="button"
                    onClick={
                      addDate
                    }
                    className={
                      addButtonClass
                    }
                  >
                    <Plus size={17} />
                    <span className="hidden sm:inline">
                      Add Date
                    </span>
                  </button>
                }
              />

              <div
                className={
                  sectionBody
                }
              >
                <div className="space-y-3">

                  {form.importantDates.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]"
                      >

                        <input
                          value={
                            item.label
                          }
                          onChange={(
                            e
                          ) =>
                            updateArrayItem(
                              "importantDates",
                              index,
                              "label",
                              e.target.value
                            )
                          }
                          placeholder="Application Start Date"
                          className={
                            inputClass
                          }
                        />

                        <input
                          value={
                            item.date
                          }
                          onChange={(
                            e
                          ) =>
                            updateArrayItem(
                              "importantDates",
                              index,
                              "date",
                              e.target.value
                            )
                          }
                          placeholder="10 August 2026"
                          className={
                            inputClass
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(
                              "importantDates",
                              index
                            )
                          }
                          disabled={
                            form
                              .importantDates
                              .length ===
                            1
                          }
                          className="flex h-11 items-center justify-center rounded-xl px-3 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2
                            size={
                              18
                            }
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>
              </div>
            </section>

            {/* ==================================
                APPLICATION FEE
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={IndianRupee}
                title="Application Fee"
                description="Category-wise application fee"
                action={
                  <button
                    type="button"
                    onClick={
                      addFee
                    }
                    className={
                      addButtonClass
                    }
                  >
                    <Plus size={17} />
                    <span className="hidden sm:inline">
                      Add Fee
                    </span>
                  </button>
                }
              />

              <div
                className={
                  sectionBody
                }
              >
                <div className="space-y-3">

                  {form.applicationFee.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]"
                      >

                        <input
                          value={
                            item.category
                          }
                          onChange={(
                            e
                          ) =>
                            updateArrayItem(
                              "applicationFee",
                              index,
                              "category",
                              e.target.value
                            )
                          }
                          placeholder="General / OBC"
                          className={
                            inputClass
                          }
                        />

                        <input
                          value={
                            item.amount
                          }
                          onChange={(
                            e
                          ) =>
                            updateArrayItem(
                              "applicationFee",
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                          placeholder="₹500"
                          className={
                            inputClass
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(
                              "applicationFee",
                              index
                            )
                          }
                          disabled={
                            form
                              .applicationFee
                              .length ===
                            1
                          }
                          className="flex h-11 items-center justify-center rounded-xl px-3 text-red-500 transition hover:bg-red-50 disabled:opacity-30"
                        >
                          <Trash2
                            size={
                              18
                            }
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>
              </div>
            </section>

            {/* ==================================
                AGE LIMIT
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={Users}
                title="Age Limit"
                description="Minimum, maximum age and relaxation"
              />

              <div
                className={
                  sectionBody
                }
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Minimum Age
                    </label>

                    <input
                      value={
                        form.ageLimit
                          .minimum
                      }
                      onChange={(
                        e
                      ) =>
                        updateAge(
                          "minimum",
                          e.target.value
                        )
                      }
                      placeholder="18 Years"
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Maximum Age
                    </label>

                    <input
                      value={
                        form.ageLimit
                          .maximum
                      }
                      onChange={(
                        e
                      ) =>
                        updateAge(
                          "maximum",
                          e.target.value
                        )
                      }
                      placeholder="32 Years"
                      className={
                        inputClass
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Age Relaxation
                    </label>

                    <input
                      value={
                        form.ageLimit
                          .relaxation
                      }
                      onChange={(
                        e
                      ) =>
                        updateAge(
                          "relaxation",
                          e.target.value
                        )
                      }
                      placeholder="As per rules"
                      className={
                        inputClass
                      }
                    />
                  </div>

                </div>
              </div>
            </section>

            {/* ==================================
                VACANCIES
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={Users}
                title="Vacancy Details"
                description="Post-wise vacancy information"
                action={
                  <button
                    type="button"
                    onClick={
                      addVacancy
                    }
                    className={
                      addButtonClass
                    }
                  >
                    <Plus size={17} />
                    <span className="hidden sm:inline">
                      Add Vacancy
                    </span>
                  </button>
                }
              />

              <div
                className={
                  sectionBody
                }
              >
                <div className="space-y-3">

                  {form.vacancies.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_180px_auto]"
                      >

                        <input
                          value={
                            item.postName
                          }
                          onChange={(
                            e
                          ) =>
                            updateArrayItem(
                              "vacancies",
                              index,
                              "postName",
                              e.target.value
                            )
                          }
                          placeholder="Post Name"
                          className={
                            inputClass
                          }
                        />

                        <input
                          type="number"
                          min="0"
                          value={
                            item.total
                          }
                          onChange={(
                            e
                          ) =>
                            updateArrayItem(
                              "vacancies",
                              index,
                              "total",
                              e.target.value
                            )
                          }
                          placeholder="Total Vacancy"
                          className={
                            inputClass
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(
                              "vacancies",
                              index
                            )
                          }
                          disabled={
                            form
                              .vacancies
                              .length ===
                            1
                          }
                          className="flex h-11 items-center justify-center rounded-xl px-3 text-red-500 transition hover:bg-red-50 disabled:opacity-30"
                        >
                          <Trash2
                            size={
                              18
                            }
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>
              </div>
            </section>

            {/* ==================================
                ELIGIBILITY
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={
                  GraduationCap
                }
                title="Eligibility"
                description="Educational qualification and eligibility"
              />

              <div
                className={
                  sectionBody
                }
              >
                <textarea
                  value={
                    form.eligibility
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        eligibility:
                          e.target.value,
                      })
                    )
                  }
                  rows={6}
                  className={
                    textareaClass
                  }
                  placeholder="Graduation from a recognized university with required qualification..."
                />
              </div>
            </section>

            {/* ==================================
                SELECTION PROCESS
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={ListChecks}
                title="Selection Process"
                description="Selection stages"
                action={
                  <button
                    type="button"
                    onClick={
                      addSelection
                    }
                    className={
                      addButtonClass
                    }
                  >
                    <Plus size={17} />

                    <span className="hidden sm:inline">
                      Add Step
                    </span>
                  </button>
                }
              />

              <div
                className={
                  sectionBody
                }
              >
                <div className="space-y-3">

                  {form.selectionProcess.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="flex gap-3"
                      >

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                          {index +
                            1}
                        </div>

                        <input
                          value={
                            item
                          }
                          onChange={(
                            e
                          ) =>
                            updateSelection(
                              index,
                              e.target.value
                            )
                          }
                          placeholder={`Selection Step ${
                            index +
                            1
                          }`}
                          className={
                            inputClass
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeSelection(
                              index
                            )
                          }
                          disabled={
                            form
                              .selectionProcess
                              .length ===
                            1
                          }
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-red-500 hover:bg-red-50 disabled:opacity-30"
                        >
                          <Trash2
                            size={
                              18
                            }
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>
              </div>
            </section>

            {/* ==================================
                SALARY
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={
                  WalletCards
                }
                title="Salary"
                description="Pay scale and salary information"
              />

              <div
                className={
                  sectionBody
                }
              >
                <input
                  value={
                    form.salary
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        salary:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="₹25,500 - ₹1,51,100"
                  className={
                    inputClass
                  }
                />
              </div>
            </section>

            {/* ==================================
                HOW TO APPLY
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={
                  ClipboardList
                }
                title="How To Apply"
                description="Step-by-step application process"
              />

              <div
                className={
                  sectionBody
                }
              >
                <textarea
                  value={
                    form.howToApply
                  }
                  onChange={(e) =>
                    setForm(
                      (prev) => ({
                        ...prev,
                        howToApply:
                          e.target.value,
                      })
                    )
                  }
                  rows={8}
                  className={
                    textareaClass
                  }
                  placeholder={`1. Visit official website
2. Read notification
3. Complete registration
4. Fill application form
5. Upload documents
6. Pay fee
7. Submit form`}
                />
              </div>
            </section>

            {/* ==================================
                IMPORTANT LINKS
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={LinkIcon}
                title="Important Links"
                description="Official website and application links"
                action={
                  <button
                    type="button"
                    onClick={
                      addLink
                    }
                    className={
                      addButtonClass
                    }
                  >
                    <Plus size={17} />

                    <span className="hidden sm:inline">
                      Add Link
                    </span>
                  </button>
                }
              />

              <div
                className={
                  sectionBody
                }
              >
                <div className="space-y-3">

                  {form.importantLinks.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]"
                      >

                        <input
                          value={
                            item.label
                          }
                          onChange={(
                            e
                          ) =>
                            updateArrayItem(
                              "importantLinks",
                              index,
                              "label",
                              e.target.value
                            )
                          }
                          placeholder="Apply Online"
                          className={
                            inputClass
                          }
                        />

                        <input
                          value={
                            item.url
                          }
                          onChange={(
                            e
                          ) =>
                            updateArrayItem(
                              "importantLinks",
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="https://example.com"
                          className={
                            inputClass
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeArrayItem(
                              "importantLinks",
                              index
                            )
                          }
                          disabled={
                            form
                              .importantLinks
                              .length ===
                            1
                          }
                          className="flex h-11 items-center justify-center rounded-xl px-3 text-red-500 hover:bg-red-50 disabled:opacity-30"
                        >
                          <Trash2
                            size={
                              18
                            }
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>
              </div>
            </section>

            {/* ==================================
                FAQ
            ================================== */}

            <section
              className={
                sectionClass
              }
            >
              <SectionTitle
                icon={
                  HelpCircle
                }
                title="Frequently Asked Questions"
                description="Common questions about this notification"
                action={
                  <button
                    type="button"
                    onClick={
                      addFaq
                    }
                    className={
                      addButtonClass
                    }
                  >
                    <Plus size={17} />

                    <span className="hidden sm:inline">
                      Add FAQ
                    </span>
                  </button>
                }
              />

              <div
                className={
                  sectionBody
                }
              >
                <div className="space-y-4">

                  {form.faq.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >

                        <div className="mb-3 flex items-center justify-between">

                          <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            FAQ #
                            {index +
                              1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeArrayItem(
                                "faq",
                                index
                              )
                            }
                            disabled={
                              form
                                .faq
                                .length ===
                              1
                            }
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-30"
                          >
                            <Trash2
                              size={
                                17
                              }
                            />
                          </button>

                        </div>

                        <input
                          value={
                            item.question
                          }
                          onChange={(
                            e
                          ) =>
                            updateArrayItem(
                              "faq",
                              index,
                              "question",
                              e.target.value
                            )
                          }
                          placeholder="What is the last date to apply?"
                          className={
                            inputClass
                          }
                        />

                        <textarea
                          value={
                            item.answer
                          }
                          onChange={(
                            e
                          ) =>
                            updateArrayItem(
                              "faq",
                              index,
                              "answer",
                              e.target.value
                            )
                          }
                          placeholder="Write the answer..."
                          rows={4}
                          className={`${textareaClass} mt-3`}
                        />

                      </div>
                    )
                  )}

                </div>
              </div>
            </section>

            {/* ==================================
                BOTTOM ACTIONS
            ================================== */}

            <div className="sticky bottom-0 z-20 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">

              <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin/posts"
                    )
                  }
                  disabled={loading}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={
                    loading
                  }
                  onClick={(e) =>
                    handleSubmit(
                      e,
                      false
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <Save
                    size={
                      17
                    }
                  />

                  {loading
                    ? "Saving..."
                    : "Save Draft"}
                </button>

                <button
                  type="button"
                  disabled={
                    loading
                  }
                  onClick={(e) =>
                    handleSubmit(
                      e,
                      true
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send
                    size={
                      17
                    }
                  />

                  {loading
                    ? "Publishing..."
                    : "Publish Post"}
                </button>

              </div>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddPost;