import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Scholarships from "./pages/Scholarships";
import CreateScholarship from "./pages/CreateScholarship";
import EditScholarship from "./pages/EditScholarship";

import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";

import Documents from "./pages/Documents";
import Applications from "./pages/Applications";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

import AdminLayout from "./components/layout/AdminLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            AUTH ROUTE
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* =========================
            ADMIN ROUTES
        ========================== */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          {/* /admin */}
          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* =========================
              SCHOLARSHIPS
          ========================== */}

          <Route
            path="scholarships"
            element={<Scholarships />}
          />

          <Route
            path="scholarships/create"
            element={<CreateScholarship />}
          />

          <Route
            path="scholarships/edit/:id"
            element={<EditScholarship />}
          />

          {/* =========================
              STUDENTS
          ========================== */}

          <Route
            path="students"
            element={<Students />}
          />

          <Route
            path="students/:id"
            element={<StudentDetails />}
          />

          {/* =========================
              DOCUMENTS
          ========================== */}

          <Route
            path="documents"
            element={<Documents />}
          />

          {/* =========================
              APPLICATIONS
          ========================== */}

          <Route
            path="applications"
            element={<Applications />}
          />

          {/* =========================
              NOTIFICATIONS
          ========================== */}

          <Route
            path="notifications"
            element={<Notifications />}
          />

          {/* =========================
              SETTINGS
          ========================== */}

          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>

        {/* =========================
            DEFAULT ROUTES
        ========================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

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

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  );
};

export default App;