import { useEffect, useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

const Trash = () => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

  // ==========================================
  // LOAD TRASH
  // ==========================================

  const loadTrash = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", {
          replace: true,
        });
        return;
      }

      const response = await axios.get(
        `${API}/posts/trash`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(response.data.posts || []);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Failed to load trash"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  // ==========================================
  // RESTORE POST
  // ==========================================

  const handleRestore = async (id) => {
    try {
      setRestoringId(id);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", {
          replace: true,
        });
        return;
      }

      await axios.put(
        `${API}/posts/${id}/restore`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Post restored successfully"
      );

      setPosts((prev) =>
        prev.filter(
          (post) => post._id !== id
        )
      );
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Failed to restore post"
      );
    } finally {
      setRestoringId(null);
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

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">

        <div className="max-w-7xl mx-auto">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/posts")
                }
                className="
                  p-2
                  rounded-lg
                  bg-white
                  border border-slate-200
                  hover:bg-slate-50
                  transition
                "
                title="Back to Posts"
              >
                <ArrowLeft size={20} />
              </button>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                  Trash
                </h1>

                <p className="text-slate-500 mt-1">
                  Manage deleted posts
                </p>

              </div>

            </div>


            {/* Deleted Count */}

            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium">
              {posts.length} Deleted Post
              {posts.length !== 1 ? "s" : ""}
            </div>

          </div>


          {/* ==========================================
              CONTENT
          ========================================== */}

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

            {/* Loading */}

            {loading ? (
              <div className="p-10 text-center">

                <div className="inline-flex items-center gap-2 text-slate-500">
                  <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />

                  Loading trash...
                </div>

              </div>

            ) : posts.length === 0 ? (

              /* Empty Trash */

              <div className="p-12 text-center">

                <Trash2
                  size={44}
                  className="mx-auto text-slate-300 mb-4"
                />

                <h2 className="text-lg font-semibold text-slate-700">
                  Trash is empty
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Deleted posts will appear here.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/posts")
                  }
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-lg
                    bg-blue-600
                    text-white
                    text-sm
                    font-medium
                    hover:bg-blue-700
                    transition
                  "
                >
                  <ArrowLeft size={16} />
                  Back to Posts
                </button>

              </div>

            ) : (

              /* Posts */

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
                        className="hover:bg-slate-50 transition"
                      >

                        {/* Post */}

                        <td className="px-5 py-4 min-w-[280px]">

                          <p className="font-semibold text-slate-800">
                            {post.title}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            /{post.slug}
                          </p>

                        </td>


                        {/* Type */}

                        <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                          {formatType(post.type)}
                        </td>


                        {/* Organization */}

                        <td className="px-5 py-4 text-slate-600 whitespace-nowrap">

                          {post.organization?.shortName ||
                            post.organization?.name ||
                            "-"}

                        </td>


                        {/* Status */}

                        <td className="px-5 py-4">

                          <span className="
                            inline-flex
                            px-2.5
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            bg-red-100
                            text-red-700
                          ">
                            Deleted
                          </span>

                        </td>


                        {/* Actions */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-2">

                            {/* Restore */}

                            <button
                              type="button"
                              onClick={() =>
                                handleRestore(
                                  post._id
                                )
                              }
                              disabled={
                                restoringId ===
                                post._id
                              }
                              className="
                                inline-flex
                                items-center
                                gap-2
                                px-3
                                py-2
                                rounded-lg
                                bg-green-50
                                text-green-700
                                hover:bg-green-100
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                                transition
                              "
                            >

                              <RotateCcw
                                size={17}
                                className={
                                  restoringId ===
                                  post._id
                                    ? "animate-spin"
                                    : ""
                                }
                              />

                              {restoringId ===
                              post._id
                                ? "Restoring..."
                                : "Restore"}

                            </button>


                            {/* Permanent Delete - Future */}

                            <button
                              type="button"
                              disabled
                              title="Permanent delete coming soon"
                              className="
                                p-2
                                rounded-lg
                                text-red-600
                                bg-red-50
                                opacity-50
                                cursor-not-allowed
                              "
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

          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default Trash;