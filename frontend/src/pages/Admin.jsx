import AdminDashboardPage from "./admin/AdminDashboardPage";
import AdminScholarshipsPage from "./admin/AdminScholarshipsPage";
import AdminScholarshipForm from "./admin/AdminScholarshipFormPage";
import AdminStudentsPage from "./admin/AdminStudentsPage";

const Admin = ({ page = "dashboard" }) => {
  switch (page) {
    case "dashboard":
      return <AdminDashboardPage />;

    case "scholarships":
      return <AdminScholarshipsPage />;

    case "new-scholarship":
      return <AdminScholarshipForm />;

    case "edit-scholarship":
      return <AdminScholarshipForm edit />;

    case "students":
      return <AdminStudentsPage />;

    default:
      return <AdminDashboardPage />;
  }
};

export default Admin;