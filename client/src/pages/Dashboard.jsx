
import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  Trash2,
  Building2,
  Plus,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

const API = "http://localhost:5000/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    trashedPosts: 0,
    totalOrganizations: 0,
  });

  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DASHBOARD STATS
  // ==========================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(
        `${API}/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setStats(
          response.data.stats || {
            totalPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            trashedPosts: 0,
            totalOrganizations: 0,
          }
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================
  // DASHBOARD CARDS
  // ==========================================

  const cards = [
    {
      title: "Total Posts",
      value: stats.totalPosts,
      icon: FileText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      route: "/admin/posts",
    },
    {
      title: "Published Posts",
      value: stats.publishedPosts,
      icon: CheckCircle,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      route: "/admin/posts?status=published",
    },
    {
      title: "Draft Posts",
      value: stats.draftPosts,
      icon: Clock,
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-600",
      route: "/admin/posts?status=draft",
    },
    {
      title: "Trash",
      value: stats.trashedPosts,
      icon: Trash2,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      route: "/admin/trash",
    },
    {
      title: "Organizations",
      value: stats.totalOrganizations,
      icon: Building2,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
      route: "/admin/organizations",
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">

        <div className="max-w-7xl mx-auto">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="mb-8">

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="text-slate-500 mt-1">
              Welcome to BharatJobs Admin Panel
            </p>

          </div>


          {/* ==========================================
              STATS CARDS
          ========================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <button
                  key={card.title}
                  type="button"
                  onClick={() =>
                    navigate(card.route)
                  }
                  className="text-left bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        {card.title}
                      </p>

                      <h2 className="text-3xl font-bold text-slate-800 mt-2">

                        {loading ? (
                          <span className="text-slate-300">
                            ...
                          </span>
                        ) : (
                          card.value
                        )}

                      </h2>

                    </div>


                    <div
                      className={`${card.iconBg} ${card.iconColor} p-3 rounded-lg`}
                    >
                      <Icon size={24} />
                    </div>

                  </div>


                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-4">
                    View details
                    <ArrowRight size={13} />
                  </div>

                </button>
              );
            })}

          </div>


          {/* ==========================================
              QUICK ACTIONS
          ========================================== */}

          <div className="mt-8 bg-white rounded-xl border border-slate-200 p-5 sm:p-6">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-800">
                  Quick Actions
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Quickly manage your BharatJobs content
                </p>

              </div>

            </div>


            <div className="flex flex-wrap gap-3 mt-5">

              {/* ADD POST */}

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/posts/add")
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
              >
                <Plus size={18} />
                Add Post
              </button>


              {/* MANAGE POSTS */}

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/posts")
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-medium"
              >
                <FileText size={18} />
                Manage Posts
              </button>


              {/* ORGANIZATIONS */}

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/organizations")
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition font-medium"
              >
                <Building2 size={18} />
                Organizations
              </button>


              {/* TRASH */}

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/trash")
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
              >
                <Trash2 size={18} />
                Trash
              </button>

            </div>

          </div>


          {/* ==========================================
              OVERVIEW
          ========================================== */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

            {/* POST OVERVIEW */}

            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">

              <h2 className="text-lg font-semibold text-slate-800">
                Posts Overview
              </h2>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Published
                  </span>

                  <span className="font-semibold text-green-600">
                    {stats.publishedPosts}
                  </span>

                </div>


                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{
                      width:
                        stats.totalPosts > 0
                          ? `${Math.min(
                              (stats.publishedPosts /
                                stats.totalPosts) *
                                100,
                              100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>


                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Draft
                  </span>

                  <span className="font-semibold text-yellow-600">
                    {stats.draftPosts}
                  </span>

                </div>


                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all"
                    style={{
                      width:
                        stats.totalPosts > 0
                          ? `${Math.min(
                              (stats.draftPosts /
                                stats.totalPosts) *
                                100,
                              100
                            )}%`
                          : "0%",
                    }}
                  />

                </div>

              </div>

            </div>


            {/* SYSTEM OVERVIEW */}

            <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">

              <h2 className="text-lg font-semibold text-slate-800">
                System Overview
              </h2>

              <div className="mt-5 space-y-4">

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">

                  <div className="flex items-center gap-3">

                    <Building2
                      size={20}
                      className="text-purple-600"
                    />

                    <span className="text-sm text-slate-600">
                      Organizations
                    </span>

                  </div>

                  <span className="font-semibold text-slate-800">
                    {stats.totalOrganizations}
                  </span>

                </div>


                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">

                  <div className="flex items-center gap-3">

                    <FileText
                      size={20}
                      className="text-blue-600"
                    />

                    <span className="text-sm text-slate-600">
                      Active Posts
                    </span>

                  </div>

                  <span className="font-semibold text-slate-800">
                    {stats.totalPosts}
                  </span>

                </div>


                <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">

                  <div className="flex items-center gap-3">

                    <Trash2
                      size={20}
                      className="text-red-600"
                    />

                    <span className="text-sm text-red-600">
                      Posts in Trash
                    </span>

                  </div>

                  <span className="font-semibold text-red-700">
                    {stats.trashedPosts}
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;

