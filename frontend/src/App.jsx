 
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

// ============================================================
// PROTECTED APPLICATION PROVIDERS
// ============================================================

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

          {/* ==================================================
              PUBLIC ROUTES
          ================================================== */}

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

          {/* ==================================================
              APPLICATION ROUTES
          ================================================== */}

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

        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;