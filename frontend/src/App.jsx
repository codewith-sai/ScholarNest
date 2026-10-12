 
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

// ==========================================
// Context Providers
// ==========================================

import { AppProvider } from "./context/AppContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ScholarshipProvider } from "./context/ScholarshipContext";
import { ApplicationProvider } from "./context/ApplicationContext";
import { NotificationProvider } from "./context/NotificationContext";
import { MessageProvider } from "./context/MessageContext";

// ==========================================
// Layout
// ==========================================

import Layout from "./components/layout/Layout";

// ==========================================
// Pages
// ==========================================

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import CompleteProfile from "./pages/CompleteProfile";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Scholarships from "./pages/Scholarships";
import ScholarshipDetails from "./pages/ScholarshipDetails";
import SavedScholarships from "./pages/SavedScholarships";
import Applications from "./pages/Applications";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import AdminLoginPage from "./pages/admin/AdminLoginPage";

<<<<<<< HEAD
// Layout / protection
import Layout from "./layouts/Layout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
=======
// ============================================================
// PROTECTED APPLICATION PROVIDERS
// ============================================================
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571

const ApplicationProviders = () => {
  return (
    <ProfileProvider>
      <ScholarshipProvider>
        <ApplicationProvider>
          <NotificationProvider>
            <MessageProvider>
              <Layout />
            </MessageProvider>
          </NotificationProvider>
        </ApplicationProvider>
      </ScholarshipProvider>
    </ProfileProvider>
  );
};

// ============================================================
// APP
// ============================================================

const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>

<<<<<<< HEAD
      <Route
        path="/register"
        element={<Auth mode="register" />}
      />

      <Route
        path="/admin/login"
        element={<AdminLoginPage />}
      />

      {/* Public Browse without mandatory auth */}
      <Route
        path="/scholarships/public"
        element={<Scholarships />}
      />

      {/* =====================================================
          STUDENT ROUTES
          ===================================================== */}

      <Route element={<ProtectedRoute role="STUDENT" />}>
        <Route element={<Layout />}>
=======
          {/* ==================================================
              PUBLIC ROUTES
          ================================================== */}
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571

          <Route
            path="/"
            element={<Landing />}
          />

          <Route
            path="/login"
            element={<Auth mode="login" />}
          />

          <Route
            path="/register"
            element={<Auth mode="register" />}
          />

          <Route
            path="/complete-profile"
            element={<CompleteProfile />}
          />

<<<<<<< HEAD
          <Route
            path="/profile/complete"
            element={<CompleteProfile />}
          />
=======
          {/* ==================================================
              APPLICATION ROUTES
          ================================================== */}
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571

          <Route element={<ApplicationProviders />}>

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Profile */}
            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* Scholarships */}
            <Route
              path="/scholarships"
              element={<Scholarships />}
            />

            {/* Scholarship Details */}
            <Route
              path="/scholarships/:id"
              element={<ScholarshipDetails />}
            />

            {/* Saved Scholarships */}
            <Route
              path="/saved-scholarships"
              element={<SavedScholarships />}
            />

            {/* Applications */}
            <Route
              path="/applications"
              element={<Applications />}
            />

            {/* Notifications */}
            <Route
              path="/notifications"
              element={<Notifications />}
            />

            {/* Messages */}
            <Route
              path="/messages"
              element={<Messages />}
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* ==================================================
                ADMIN DASHBOARD
            ================================================== */}

            <Route
              path="/admin"
              element={<Admin />}
            />

          </Route>

          {/* ==================================================
              UNKNOWN ROUTE
          ================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

<<<<<<< HEAD
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
        <Route element={<AdminLayout />}>
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
            path="/admin/scholarships/:id/edit"
            element={<Admin page="edit-scholarship" />}
          />

          <Route
            path="/admin/scholarships/edit/:id"
            element={<Admin page="edit-scholarship" />}
          />

          <Route
            path="/admin/students"
            element={<Admin page="students" />}
          />
        </Route>
      </Route>

      {/* =====================================================
          FALLBACK
          ===================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
=======
        </Routes>
      </AppProvider>
    </BrowserRouter>
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
  );
};

export default App;