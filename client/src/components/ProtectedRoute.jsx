import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Reject an expired JWT before protected pages start making API calls.
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      localStorage.removeItem("adminToken");
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
