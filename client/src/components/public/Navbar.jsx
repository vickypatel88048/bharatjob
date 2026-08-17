import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", path: "/" },
    { label: "Latest Jobs", path: "/jobs" },
    { label: "Results", path: "/results" },
    { label: "Admit Card", path: "/admit-card" },
    { label: "Answer Key", path: "/answer-key" },
    { label: "Admission", path: "/admission" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">

        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              BJ
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-none">
                BharatJobs
              </h1>

              <p className="text-[10px] text-slate-500 mt-1">
                Government Jobs & Updates
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">

            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

          </nav>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>

        </div>

        {/* Mobile Navigation */}
        {open && (
          <nav className="lg:hidden border-t border-slate-100 py-3">

            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

          </nav>
        )}

      </div>
    </header>
  );
};

export default Navbar;