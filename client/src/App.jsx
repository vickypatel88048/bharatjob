import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Results from "./pages/Results";
import AdmitCard from "./pages/AdmitCard";
import AnswerKey from "./pages/AnswerKey";
import Admission from "./pages/Admission";
import Syllabus from "./pages/Syllabus";
import Contact from "./pages/Contact";
import PostDetails from "./pages/PostDetails";

// ==========================================
// ADMIN PAGES
// ==========================================

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import Trash from "./pages/Trash";
import Organizations from "./pages/Organizations";
import ImportPost from "./pages/ImportPost";

// ==========================================
// PROTECTED ROUTE
// ==========================================

import ProtectedRoute from "./components/ProtectedRoute";

// ==========================================
// COMING SOON
// ==========================================

function ComingSoon({ title }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">

        <h1 className="text-2xl font-bold text-slate-800">
          {title}
        </h1>

        <p className="text-slate-500 mt-2">
          This section is coming next.
        </p>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-5 px-4 py-2 bg-blue-700 text-white rounded-md text-sm"
        >
          Go Back
        </button>

      </div>
    </div>
  );
}

// ==========================================
// APP
// ==========================================

function App() {
  return (
    <BrowserRouter>

      {/* ==========================================
          TOASTER
      ========================================== */}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>

        {/* ==========================================
            PUBLIC PAGES
        ========================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        <Route
          path="/admit-card"
          element={<AdmitCard />}
        />

        <Route
          path="/answer-key"
          element={<AnswerKey />}
        />

        <Route
          path="/admission"
          element={<Admission />}
        />

        <Route
          path="/syllabus"
          element={<Syllabus />}
        />

        {/* ==========================================
            CONTACT US
        ========================================== */}

        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* ==========================================
            POST DETAILS
        ========================================== */}

        <Route
          path="/post/:slug"
          element={<PostDetails />}
        />

        {/* ==========================================
            ADMIN LOGIN
        ========================================== */}

        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* ==========================================
            ADMIN DASHBOARD
        ========================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            ADMIN POSTS
        ========================================== */}

        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute>
              <Posts />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            ADD POST
        ========================================== */}

        <Route
          path="/admin/posts/add"
          element={
            <ProtectedRoute>
              <AddPost />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            IMPORT POST
        ========================================== */}

        <Route
          path="/admin/import-post"
          element={
            <ProtectedRoute>
              <ImportPost />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            EDIT POST
        ========================================== */}

        <Route
          path="/admin/posts/edit/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            ORGANIZATIONS
        ========================================== */}

        <Route
          path="/admin/organizations"
          element={
            <ProtectedRoute>
              <Organizations />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            TRASH
        ========================================== */}

        <Route
          path="/admin/trash"
          element={
            <ProtectedRoute>
              <Trash />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            ADMIN SETTINGS
        ========================================== */}

        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <ComingSoon title="Settings" />
            </ProtectedRoute>
          }
        />

        {/* ==========================================
            404 / UNKNOWN ROUTE
        ========================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;