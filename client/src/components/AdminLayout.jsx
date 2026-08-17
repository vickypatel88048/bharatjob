import { Menu, Bell } from "lucide-react";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ==========================================
          MAIN AREA
      ========================================== */}

      <div className="lg:ml-64 min-h-screen">

        {/* ==========================================
            TOPBAR
        ========================================== */}

        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30">

          <div className="h-full px-4 sm:px-6 flex items-center justify-between">

            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-700"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>


            {/* Desktop Title */}

            <div className="hidden lg:block">

              <p className="text-sm font-medium text-slate-700">
                Admin Dashboard
              </p>

              <p className="text-xs text-slate-400">
                BharatJobs Management Panel
              </p>

            </div>


            {/* Right Side */}

            <div className="flex items-center gap-3 sm:gap-4">

              {/* Notification */}

              <button
                type="button"
                className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                aria-label="Notifications"
              >
                <Bell size={20} />

                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>


              {/* Admin Profile */}

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  A
                </div>

                <div className="hidden sm:block">

                  <p className="text-sm font-semibold text-slate-800">
                    Administrator
                  </p>

                  <p className="text-xs text-slate-500">
                    Admin
                  </p>

                </div>

              </div>

            </div>

          </div>

        </header>


        {/* ==========================================
            PAGE CONTENT
        ========================================== */}

        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;