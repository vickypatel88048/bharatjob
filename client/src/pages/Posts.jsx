import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

const Posts = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    totalPosts: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ==========================================
  // LOAD POSTS
  // ==========================================

  const loadPosts = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const params = new URLSearchParams({
        page,
        limit: 10,
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (type) {
        params.append("type", type);
      }

      if (status) {
        params.append("status", status);
      }

      const response = await axios.get(
        `${API}/posts?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data.posts || []);

      setPagination({
        totalPosts: response.data.totalPosts || 0,
        totalPages: response.data.totalPages || 0,
        hasNextPage: response.data.hasNextPage || false,
        hasPreviousPage:
          response.data.hasPreviousPage || false,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load posts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page, type, status]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);

    loadPosts();
  };

  // ==========================================
  // DELETE / MOVE TO TRASH
  // ==========================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to move this post to trash?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(
        `${API}/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Post moved to trash");

      loadPosts();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete post"
      );
    }
  };

  // ==========================================
  // FORMAT TYPE
  // ==========================================

  const formatType = (value) => {
    if (!value) return "-";

    return value
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Posts
              </h1>

              <p className="text-slate-500 mt-1">
                Manage all BharatJobs posts
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/admin/posts/add")
              }
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition"
            >
              <Plus size={19} />
              Add Post
            </button>

          </div>

          {/* Filters */}

          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

              <form
                onSubmit={handleSearch}
                className="md:col-span-2 relative"
              >

                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search posts..."
                  className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </form>

              {/* Type */}

              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(1);
                }}
                className="border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  All Types
                </option>

                <option value="job">
                  Jobs
                </option>

                <option value="result">
                  Results
                </option>

                <option value="admit-card">
                  Admit Cards
                </option>

                <option value="answer-key">
                  Answer Keys
                </option>

                <option value="admission">
                  Admissions
                </option>

                {/* ONLY NEW OPTION */}

                <option value="document">
                  Documents
                </option>
              </select>

              {/* Status */}

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="border border-slate-200 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  All Status
                </option>

                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>
              </select>

            </div>
          </div>

          {/* Posts Table */}

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

            {loading ? (
              <div className="p-10 text-center text-slate-500">
                Loading posts...
              </div>
            ) : posts.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-slate-500">
                  No posts found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                      <th className="text-left px-5 py-4 font-semibold text-slate-600">
                        Post
                      </th>

                      <th className="text-left px-5 py-4 font-semibold text-slate-600">
                        Type
                      </th>

                      <th className="text-left px-5 py-4 font-semibold text-slate-600">
                        Organization
                      </th>

                      <th className="text-left px-5 py-4 font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="text-right px-5 py-4 font-semibold text-slate-600">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {posts.map((post) => (

                      <tr
                        key={post._id}
                        className="hover:bg-slate-50"
                      >

                        {/* Post */}

                        <td className="px-5 py-4">

                          <div className="flex items-start gap-2">

                            <div>

                              <p className="font-semibold text-slate-800">
                                {post.title}
                              </p>

                              <p className="text-xs text-slate-400 mt-1">
                                /{post.slug}
                              </p>

                            </div>

                            {post.featured && (
                              <Star
                                size={16}
                                className="text-yellow-500 fill-yellow-500 mt-1"
                              />
                            )}

                          </div>

                        </td>

                        {/* Type */}

                        <td className="px-5 py-4 text-slate-600">
                          {formatType(post.type)}
                        </td>

                        {/* Organization */}

                        <td className="px-5 py-4 text-slate-600">
                          {post.organization?.shortName ||
                            post.organization?.name ||
                            "-"}
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                              post.status === "published"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {post.status}
                          </span>

                        </td>

                        {/* Actions */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/posts/edit/${post._id}`
                                )
                              }
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                              title="Edit"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(post._id)
                              }
                              className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                              title="Move to trash"
                            >
                              <Trash2 size={18} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

            {/* Pagination */}

            {!loading && posts.length > 0 && (

              <div className="border-t border-slate-200 px-5 py-4 flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Total Posts:{" "}
                  <span className="font-semibold text-slate-700">
                    {pagination.totalPosts}
                  </span>
                </p>

                <div className="flex items-center gap-2">

                  <button
                    disabled={
                      !pagination.hasPreviousPage
                    }
                    onClick={() =>
                      setPage((prev) => prev - 1)
                    }
                    className="p-2 border rounded-lg disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="px-3 text-sm font-medium">
                    Page {page} of{" "}
                    {pagination.totalPages || 1}
                  </span>

                  <button
                    disabled={
                      !pagination.hasNextPage
                    }
                    onClick={() =>
                      setPage((prev) => prev + 1)
                    }
                    className="p-2 border rounded-lg disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronRight size={18} />
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default Posts;