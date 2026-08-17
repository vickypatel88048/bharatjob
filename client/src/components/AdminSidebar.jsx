import {
  LayoutDashboard,
  FileText,
  Building2,
  Trash2,
  Settings,
  LogOut,
  X,
  Plus,
  Download,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

const AdminSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },

    {
      label: "Posts",
      path: "/admin/posts",
      icon: FileText,
    },

    {
      label: "Add Post",
      path: "/admin/posts/add",
      icon: Plus,
    },

    // ==========================================
    // IMPORT POST
    // ==========================================

    {
      label: "Import Post",
      path: "/admin/import-post",
      icon: Download,
    },

    {
      label: "Organizations",
      path: "/admin/organizations",
      icon: Building2,
    },

    {
      label: "Trash",
      path: "/admin/trash",
      icon: Trash2,
    },

    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");

    onClose?.();

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <>
      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-slate-900 text-white
          flex flex-col
          shadow-xl
          transition-transform duration-300
          lg:translate-x-0
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* ==========================================
            LOGO
        ========================================== */}

        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">

          <button
            type="button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
            className="text-left"
          >
            <h1 className="text-xl font-bold">
              BharatJobs
            </h1>

            <p className="text-xs text-slate-400">
              Admin Panel
            </p>
          </button>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>

        </div>

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  px-4 py-3 rounded-lg
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                  `
                }
              >
                <Icon size={19} />

                <span>
                  {item.label}
                </span>
              </NavLink>
            );
          })}

        </nav>

        {/* ==========================================
            ADMIN INFO
        ========================================== */}

        <div className="px-4 pb-3">

          <div className="rounded-lg bg-slate-800 p-3">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-semibold">
                A
              </div>

              <div className="min-w-0">

                <p className="text-sm font-medium text-white truncate">
                  Administrator
                </p>

                <p className="text-xs text-slate-400">
                  Admin Account
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ==========================================
            LOGOUT
        ========================================== */}

        <div className="p-4 border-t border-slate-800">

          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-lg
              text-slate-300
              hover:bg-red-500/10
              hover:text-red-400
              transition
            "
          >
            <LogOut size={19} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;