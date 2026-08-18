import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = `${import.meta.env.VITE_API_URL || "https://bharatjob-2.onrender.com"}/api`;

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPosts: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false });

  const loadPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const params = new URLSearchParams({ page: String(page), limit: "10" });
      if (search.trim()) params.append("search", search.trim());
      if (type) params.append("type", type);
      if (status) params.append("status", status);

      const response = await axios.get(`${API}/posts?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(response.data.posts || []);
      setPagination({
        totalPosts: response.data.totalPosts || 0,
        totalPages: response.data.totalPages || 0,
        hasNextPage: response.data.hasNextPage || false,
        hasPreviousPage: response.data.hasPreviousPage || false,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, [page, type, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadPosts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to move this post to trash?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${API}/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Post moved to trash");
      loadPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const formatType = (value) => value ? value.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "-";

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Posts</h1>
              <p className="text-slate-500 mt-1">Manage all BharatJobs posts</p>
            </div>
            <button onClick={() => navigate("/admin/posts/add")} className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium"><Plus size={19}/>Add Post</button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <form onSubmit={handleSearch} className="md:col-span-2 relative">
                <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500" />
              </form>
              <select value={type} onChange={e => { setType(e.target.value); setPage(1); }} className="border border-slate-200 rounded-lg px-3 py-2.5">
                <option value="">All Types</option><option value="job">Jobs</option><option value="result">Results</option><option value="admit-card">Admit Cards</option><option value="answer-key">Answer Keys</option><option value="admission">Admissions</option><option value="document">Documents</option>
              </select>
              <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="border border-slate-200 rounded-lg px-3 py-2.5">
                <option value="">All Status</option><option value="published">Published</option><option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {loading ? <div className="p-10 text-center text-slate-500">Loading posts...</div> : posts.length === 0 ? <div className="p-10 text-center text-slate-500">No posts found.</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b"><tr><th className="text-left px-5 py-4">Post</th><th className="text-left px-5 py-4">Type</th><th className="text-left px-5 py-4">Organization</th><th className="text-left px-5 py-4">Status</th><th className="text-right px-5 py-4">Actions</th></tr></thead>
                  <tbody className="divide-y">
                    {posts.map(post => <tr key={post._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4"><div className="flex items-start gap-2"><div><p className="font-semibold text-slate-800">{post.title}</p><p className="text-xs text-slate-400 mt-1">/{post.slug}</p></div>{post.featured && <Star size={16} className="text-yellow-500 fill-yellow-500 mt-1"/>}</div></td>
                      <td className="px-5 py-4 text-slate-600">{formatType(post.type)}</td>
                      <td className="px-5 py-4 text-slate-600">{post.organization?.shortName || post.organization?.name || "-"}</td>
                      <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${post.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{post.status}</span></td>
                      <td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => navigate(`/admin/posts/edit/${post._id}`)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"><Pencil size={18}/></button><button onClick={() => handleDelete(post._id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50"><Trash2 size={18}/></button></div></td>
                    </tr>)}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && posts.length > 0 && <div className="border-t px-5 py-4 flex items-center justify-between"><p className="text-sm text-slate-500">Total Posts: <span className="font-semibold text-slate-700">{pagination.totalPosts}</span></p><div className="flex items-center gap-2"><button disabled={!pagination.hasPreviousPage} onClick={() => setPage(p => p - 1)} className="p-2 border rounded-lg disabled:opacity-40"><ChevronLeft size={18}/></button><span className="px-3 text-sm">Page {page} of {pagination.totalPages || 1}</span><button disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)} className="p-2 border rounded-lg disabled:opacity-40"><ChevronRight size={18}/></button></div></div>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Posts;
