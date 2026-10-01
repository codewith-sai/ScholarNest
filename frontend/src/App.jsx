import { Navigate, Route, Routes } from "react-router-dom";

// Public pages
import Landing from "./pages/LandingPage";
import Auth from "./pages/Auth";

// Student pages
import Dashboard from "./pages/DashboardPage";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import Scholarships from "./pages/Scholarships";
import ScholarshipDetail from "./pages/ScholarshipDetailPage";
import BasicPages from "./pages/BasicPages";

// Admin
import Admin from "./pages/Admin";

// Layout / protection
import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* =====================================================
          PUBLIC ROUTES
          ===================================================== */}

      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={<Auth mode="login" />}
      />

      <Route
        path="/register"
        element={<Auth mode="register" />}
      />

      {/* =====================================================
          STUDENT ROUTES
          ===================================================== */}

      <Route element={<ProtectedRoute role="STUDENT" />}>
        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Complete profile */}
          <Route
            path="/complete-profile"
            element={<CompleteProfile />}
          />

          {/* Keep this route as an alias */}
          <Route
            path="/profile/complete"
            element={<CompleteProfile />}
          />

          {/* Student profile */}
          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/profile/edit"
            element={<Profile edit />}
          />

          {/* Scholarships */}
          <Route
            path="/scholarships"
            element={<Scholarships />}
          />

          <Route
            path="/scholarships/:id"
            element={<ScholarshipDetail />}
          />

          {/* Saved scholarships */}
          <Route
            path="/saved"
            element={<BasicPages page="saved" />}
          />

          {/* Applications */}
          <Route
            path="/applications"
            element={<BasicPages page="applications" />}
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={<BasicPages page="notifications" />}
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={<BasicPages page="settings" />}
          />

        </Route>
      </Route>

      {/* =====================================================
          ADMIN ROUTES
          ===================================================== */}

      <Route element={<ProtectedRoute role="ADMIN" />}>

        <Route
          path="/admin/dashboard"
          element={<Admin page="dashboard" />}
        />

        <Route
          path="/admin/scholarships"
          element={<Admin page="scholarships" />}
        />

        <Route
          path="/admin/scholarships/new"
          element={<Admin page="new-scholarship" />}
        />

        <Route
          path="/admin/students"
          element={<Admin page="students" />}
        />

      </Route>

      {/* =====================================================
          FALLBACK
          ===================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;