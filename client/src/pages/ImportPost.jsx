import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function ImportPost() {
  const [url, setUrl] = useState("");
  const [post, setPost] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // TOKEN
  // ==========================================

  function getToken() {
    return localStorage.getItem("adminToken");
  }

  function getHeaders() {
    const token = getToken();

    if (!token) {
      throw new Error("ADMIN_TOKEN_MISSING");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }

  // ==========================================
  // FETCH / IMPORT
  // ==========================================

  async function handleImport() {
    if (!url.trim()) {
      setError("Please enter source URL");
      return;
    }

    if (!getToken()) {
      setError("Admin login expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setPost(null);

      const response = await axios.post(
        `${API}/posts/import-url`,
        {
          url: url.trim(),
        },
        getHeaders()
      );

      console.log("IMPORT RESPONSE:", response.data);

      if (response.data?.success) {
        // Different backend response formats support
        const importedPost =
          response.data.post ||
          response.data.data ||
          response.data.result ||
          null;

        if (!importedPost) {
          setError(
            "Import successful, but no post data was returned by server."
          );
          return;
        }

        setPost({
          title: importedPost.title || "",
          slug: importedPost.slug || "",
          type: importedPost.type || "job",
          organization:
            importedPost.organization || "",
          organizationSlug:
            importedPost.organizationSlug || "",
          shortDescription:
            importedPost.shortDescription || "",
          content: importedPost.content || "",
          status: importedPost.status || "draft",
          featured: importedPost.featured ?? false,

          importantDates:
            importedPost.importantDates || [],

          applicationFee:
            importedPost.applicationFee || [],

          ageLimit:
            importedPost.ageLimit || {
              minimum: "",
              maximum: "",
              relaxation: "",
            },

          vacancies:
            importedPost.vacancies || [],

          eligibility:
            importedPost.eligibility || "",

          selectionProcess:
            importedPost.selectionProcess || [],

          salary:
            importedPost.salary || "",

          howToApply:
            importedPost.howToApply || "",

          importantLinks:
            importedPost.importantLinks || [],

          faq:
            importedPost.faq || [],
        });

        setMessage(
          "Post fetched successfully. Review the complete details below and publish it."
        );
      } else {
        setError(
          response.data?.message ||
            "Unable to import post"
        );
      }
    } catch (err) {
      console.error("IMPORT ERROR:", err);

      if (err.response?.status === 401) {
        setError(
          "Admin login expired. Please login again."
        );

        localStorage.removeItem("adminToken");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Import failed"
        );
      }
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // UPDATE FIELD
  // ==========================================

  function updateField(field, value) {
    setPost((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  // ==========================================
  // DATES
  // ==========================================

  function updateDate(index, field, value) {
    setPost((prev) => {
      const dates = [...(prev.importantDates || [])];

      dates[index] = {
        ...dates[index],
        [field]: value,
      };

      return {
        ...prev,
        importantDates: dates,
      };
    });
  }

  function addDate() {
    setPost((prev) => ({
      ...prev,
      importantDates: [
        ...(prev.importantDates || []),
        {
          label: "",
          date: "",
        },
      ],
    }));
  }

  function removeDate(index) {
    setPost((prev) => ({
      ...prev,
      importantDates:
        prev.importantDates.filter(
          (_, i) => i !== index
        ),
    }));
  }

  // ==========================================
  // VACANCIES
  // ==========================================

  function updateVacancy(index, field, value) {
    setPost((prev) => {
      const vacancies = [
        ...(prev.vacancies || []),
      ];

      vacancies[index] = {
        ...vacancies[index],
        [field]:
          field === "total"
            ? Number(value)
            : value,
      };

      return {
        ...prev,
        vacancies,
      };
    });
  }

  function addVacancy() {
    setPost((prev) => ({
      ...prev,
      vacancies: [
        ...(prev.vacancies || []),
        {
          postName: "",
          total: 0,
        },
      ],
    }));
  }

  function removeVacancy(index) {
    setPost((prev) => ({
      ...prev,
      vacancies:
        prev.vacancies.filter(
          (_, i) => i !== index
        ),
    }));
  }

  // ==========================================
  // IMPORTANT LINKS
  // ==========================================

  function updateLink(index, field, value) {
    setPost((prev) => {
      const links = [
        ...(prev.importantLinks || []),
      ];

      links[index] = {
        ...links[index],
        [field]: value,
      };

      return {
        ...prev,
        importantLinks: links,
      };
    });
  }

  function addLink() {
    setPost((prev) => ({
      ...prev,
      importantLinks: [
        ...(prev.importantLinks || []),
        {
          label: "",
          url: "",
        },
      ],
    }));
  }

  function removeLink(index) {
    setPost((prev) => ({
      ...prev,
      importantLinks:
        prev.importantLinks.filter(
          (_, i) => i !== index
        ),
    }));
  }

  // ==========================================
  // FAQ
  // ==========================================

  function updateFaq(index, field, value) {
    setPost((prev) => {
      const faq = [...(prev.faq || [])];

      faq[index] = {
        ...faq[index],
        [field]: value,
      };

      return {
        ...prev,
        faq,
      };
    });
  }

  function addFaq() {
    setPost((prev) => ({
      ...prev,
      faq: [
        ...(prev.faq || []),
        {
          question: "",
          answer: "",
        },
      ],
    }));
  }

  function removeFaq(index) {
    setPost((prev) => ({
      ...prev,
      faq: prev.faq.filter(
        (_, i) => i !== index
      ),
    }));
  }

  // ==========================================
  // SAVE / PUBLISH
  // ==========================================

  async function savePost(status) {
    if (!post) {
      setError("No post data available.");
      return;
    }

    if (!post.title?.trim()) {
      setError("Post title is required.");
      return;
    }

    if (!post.slug?.trim()) {
      setError("Post slug is required.");
      return;
    }

    if (!post.type) {
      setError("Post type is required.");
      return;
    }

    if (!post.organization) {
      setError(
        "Organization is missing. Import controller must return organization."
      );
      return;
    }

    if (!getToken()) {
      setError("Admin login expired. Please login again.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...post,
        status,
        publishedAt:
          status === "published"
            ? new Date().toISOString()
            : null,
      };

      delete payload.organizationSlug;

      const response = await axios.post(
        `${API}/posts`,
        payload,
        getHeaders()
      );

      console.log("SAVE RESPONSE:", response.data);

      if (response.data?.success) {
        if (status === "published") {
          setMessage(
            "✅ Post published successfully."
          );

          setPost(null);
          setUrl("");
        } else {
          setMessage(
            "✅ Post saved as draft successfully."
          );
        }
      } else {
        setError(
          response.data?.message ||
            "Unable to save post"
        );
      }
    } catch (err) {
      console.error("SAVE ERROR:", err);

      if (err.response?.status === 401) {
        setError(
          "Admin login expired. Please login again."
        );

        localStorage.removeItem("adminToken");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to save post"
        );
      }
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
          <h1 className="text-2xl font-bold text-gray-800">
            Import Post
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Paste a government job, result,
            admit card or answer-key URL and
            automatically create a complete post.
          </p>
        </div>

        {/* IMPORT */}

        <div className="bg-white rounded-xl shadow-sm p-5 mb-5">

          <label className="block text-sm font-semibold mb-2">
            Source URL
          </label>

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="url"
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              placeholder="https://example.com/job-details"
              className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={handleImport}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-7 py-3 rounded-lg"
            >
              {loading
                ? "Fetching..."
                : "Fetch Post"}
            </button>

          </div>

          {message && (
            <div className="mt-4 bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* ======================================
            PREVIEW
        ====================================== */}

        {post && (
          <div className="space-y-5">

            {/* PREVIEW HEADER */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h2 className="text-xl font-bold text-blue-900">
                Post Preview
              </h2>

              <p className="text-sm text-blue-700 mt-1">
                Data automatically fetched from
                the source. Check it before publishing.
              </p>
            </div>

            {/* BASIC INFORMATION */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <h2 className="text-lg font-bold mb-4">
                Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">

                <Field
                  label="Title"
                  value={post.title}
                  onChange={(value) =>
                    updateField(
                      "title",
                      value
                    )
                  }
                />

                <Field
                  label="Slug"
                  value={post.slug}
                  onChange={(value) =>
                    updateField(
                      "slug",
                      value
                    )
                  }
                />

                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Type
                  </label>

                  <select
                    value={
                      post.type || "job"
                    }
                    onChange={(e) =>
                      updateField(
                        "type",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="job">
                      Latest Job
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

                    <option value="syllabus">
                      Syllabus
                    </option>

                    <option value="document">
                      Document
                    </option>
                  </select>
                </div>

                <Field
                  label="Organization"
                  value={
                    post.organizationSlug ||
                    post.organization?.shortName ||
                    post.organization?.name ||
                    ""
                  }
                  onChange={() => {}}
                />

              </div>

              <div className="mt-4">
                <label className="block text-sm font-semibold mb-1">
                  Short Description
                </label>

                <textarea
                  rows="3"
                  value={
                    post.shortDescription || ""
                  }
                  onChange={(e) =>
                    updateField(
                      "shortDescription",
                      e.target.value
                    )
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </section>

            {/* CONTENT */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <h2 className="text-lg font-bold mb-4">
                Content
              </h2>

              <textarea
                rows="12"
                value={post.content || ""}
                onChange={(e) =>
                  updateField(
                    "content",
                    e.target.value
                  )
                }
                className="w-full border rounded-lg px-3 py-3"
              />

            </section>

            {/* IMPORTANT DATES */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-lg font-bold">
                  Important Dates
                </h2>

                <button
                  type="button"
                  onClick={addDate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Add Date
                </button>

              </div>

              <div className="space-y-3">

                {(post.importantDates || []).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="grid md:grid-cols-[1fr_1fr_auto] gap-3"
                    >

                      <input
                        value={
                          item.label || ""
                        }
                        onChange={(e) =>
                          updateDate(
                            index,
                            "label",
                            e.target.value
                          )
                        }
                        placeholder="Label"
                        className="border rounded-lg px-3 py-2"
                      />

                      <input
                        value={
                          item.date || ""
                        }
                        onChange={(e) =>
                          updateDate(
                            index,
                            "date",
                            e.target.value
                          )
                        }
                        placeholder="Date"
                        className="border rounded-lg px-3 py-2"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeDate(index)
                        }
                        className="bg-red-100 text-red-600 px-4 rounded-lg"
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>
            </section>

            {/* APPLICATION FEE */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <h2 className="text-lg font-bold mb-4">
                Application Fee
              </h2>

              <div className="space-y-3">

                {(post.applicationFee || []).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="grid md:grid-cols-2 gap-3"
                    >
                      <input
                        value={
                          item.category || ""
                        }
                        onChange={(e) => {
                          const fees = [
                            ...(post.applicationFee || []),
                          ];

                          fees[index] = {
                            ...fees[index],
                            category:
                              e.target.value,
                          };

                          updateField(
                            "applicationFee",
                            fees
                          );
                        }}
                        placeholder="Category"
                        className="border rounded-lg px-3 py-2"
                      />

                      <input
                        value={
                          item.amount || ""
                        }
                        onChange={(e) => {
                          const fees = [
                            ...(post.applicationFee || []),
                          ];

                          fees[index] = {
                            ...fees[index],
                            amount:
                              e.target.value,
                          };

                          updateField(
                            "applicationFee",
                            fees
                          );
                        }}
                        placeholder="Amount"
                        className="border rounded-lg px-3 py-2"
                      />
                    </div>
                  )
                )}

              </div>
            </section>

            {/* AGE LIMIT */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <h2 className="text-lg font-bold mb-4">
                Age Limit
              </h2>

              <div className="grid md:grid-cols-3 gap-3">

                <Field
                  label="Minimum Age"
                  value={
                    post.ageLimit?.minimum
                  }
                  onChange={(value) =>
                    updateField(
                      "ageLimit",
                      {
                        ...(post.ageLimit || {}),
                        minimum: value,
                      }
                    )
                  }
                />

                <Field
                  label="Maximum Age"
                  value={
                    post.ageLimit?.maximum
                  }
                  onChange={(value) =>
                    updateField(
                      "ageLimit",
                      {
                        ...(post.ageLimit || {}),
                        maximum: value,
                      }
                    )
                  }
                />

                <Field
                  label="Relaxation"
                  value={
                    post.ageLimit?.relaxation
                  }
                  onChange={(value) =>
                    updateField(
                      "ageLimit",
                      {
                        ...(post.ageLimit || {}),
                        relaxation: value,
                      }
                    )
                  }
                />

              </div>
            </section>

            {/* VACANCIES */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-lg font-bold">
                  Vacancies
                </h2>

                <button
                  type="button"
                  onClick={addVacancy}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Add Vacancy
                </button>

              </div>

              <div className="space-y-3">

                {(post.vacancies || []).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="grid md:grid-cols-[1fr_180px_auto] gap-3"
                    >

                      <input
                        value={
                          item.postName || ""
                        }
                        onChange={(e) =>
                          updateVacancy(
                            index,
                            "postName",
                            e.target.value
                          )
                        }
                        placeholder="Post Name"
                        className="border rounded-lg px-3 py-2"
                      />

                      <input
                        type="number"
                        value={
                          item.total ?? 0
                        }
                        onChange={(e) =>
                          updateVacancy(
                            index,
                            "total",
                            e.target.value
                          )
                        }
                        placeholder="Total"
                        className="border rounded-lg px-3 py-2"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeVacancy(index)
                        }
                        className="bg-red-100 text-red-600 px-4 rounded-lg"
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>
            </section>

            {/* ELIGIBILITY */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <h2 className="text-lg font-bold mb-4">
                Eligibility
              </h2>

              <textarea
                rows="6"
                value={
                  post.eligibility || ""
                }
                onChange={(e) =>
                  updateField(
                    "eligibility",
                    e.target.value
                  )
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </section>

            {/* SELECTION */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <h2 className="text-lg font-bold mb-4">
                Selection Process
              </h2>

              <textarea
                rows="5"
                value={(
                  post.selectionProcess || []
                ).join("\n")}
                onChange={(e) =>
                  updateField(
                    "selectionProcess",
                    e.target.value
                      .split("\n")
                      .filter(Boolean)
                  )
                }
                placeholder="One stage per line"
                className="w-full border rounded-lg px-3 py-2"
              />
            </section>

            {/* SALARY */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <h2 className="text-lg font-bold mb-4">
                Salary / Pay Scale
              </h2>

              <textarea
                rows="4"
                value={post.salary || ""}
                onChange={(e) =>
                  updateField(
                    "salary",
                    e.target.value
                  )
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </section>

            {/* HOW TO APPLY */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <h2 className="text-lg font-bold mb-4">
                How To Apply
              </h2>

              <textarea
                rows="6"
                value={post.howToApply || ""}
                onChange={(e) =>
                  updateField(
                    "howToApply",
                    e.target.value
                  )
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </section>

            {/* IMPORTANT LINKS */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-lg font-bold">
                  Important Links
                </h2>

                <button
                  type="button"
                  onClick={addLink}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Add Link
                </button>

              </div>

              <div className="space-y-3">

                {(post.importantLinks || []).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="grid md:grid-cols-[1fr_1fr_auto] gap-3"
                    >

                      <input
                        value={
                          item.label || ""
                        }
                        onChange={(e) =>
                          updateLink(
                            index,
                            "label",
                            e.target.value
                          )
                        }
                        placeholder="Link Name"
                        className="border rounded-lg px-3 py-2"
                      />

                      <input
                        value={
                          item.url || ""
                        }
                        onChange={(e) =>
                          updateLink(
                            index,
                            "url",
                            e.target.value
                          )
                        }
                        placeholder="https://..."
                        className="border rounded-lg px-3 py-2"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeLink(index)
                        }
                        className="bg-red-100 text-red-600 px-4 rounded-lg"
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>
            </section>

            {/* FAQ */}

            <section className="bg-white rounded-xl shadow-sm p-5">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-lg font-bold">
                  FAQ
                </h2>

                <button
                  type="button"
                  onClick={addFaq}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  + Add FAQ
                </button>

              </div>

              <div className="space-y-3">

                {(post.faq || []).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="grid md:grid-cols-[1fr_1fr_auto] gap-3"
                    >

                      <input
                        value={
                          item.question || ""
                        }
                        onChange={(e) =>
                          updateFaq(
                            index,
                            "question",
                            e.target.value
                          )
                        }
                        placeholder="Question"
                        className="border rounded-lg px-3 py-2"
                      />

                      <input
                        value={
                          item.answer || ""
                        }
                        onChange={(e) =>
                          updateFaq(
                            index,
                            "answer",
                            e.target.value
                          )
                        }
                        placeholder="Answer"
                        className="border rounded-lg px-3 py-2"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeFaq(index)
                        }
                        className="bg-red-100 text-red-600 px-4 rounded-lg"
                      >
                        Remove
                      </button>

                    </div>
                  )
                )}

              </div>
            </section>

            {/* ACTIONS */}

            <section className="bg-white rounded-xl shadow-sm p-5 sticky bottom-0 border-t">

              <div className="flex flex-col md:flex-row gap-3 justify-end">

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    savePost("draft")
                  }
                  className="px-6 py-3 rounded-lg border border-gray-300 font-semibold hover:bg-gray-100 disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : "Save Draft"}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    savePost("published")
                  }
                  className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50"
                >
                  {saving
                    ? "Publishing..."
                    : "Publish Post"}
                </button>

              </div>
            </section>

          </div>
        )}

      </div>
    </div>
  );
}

// ==========================================
// FIELD
// ==========================================

function Field({
  label,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">
        {label}
      </label>

      <input
        value={value || ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}