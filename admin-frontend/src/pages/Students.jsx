import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Users,
  Eye,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

const Students = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH STUDENTS
  // =========================================================

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/admin/students"
      );

      const studentData =
        data?.data?.students ||
        data?.students ||
        data?.data ||
        [];

      setStudents(
        Array.isArray(studentData)
          ? studentData
          : []
      );
    } catch (error) {
      console.error(
        "FETCH STUDENTS ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to load students."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredStudents = students.filter(
    (student) => {
      const searchableText = `
        ${student.name || ""}
        ${student.fullName || ""}
        ${student.email || ""}
        ${student.phone || ""}
        ${student.course || ""}
        ${student.branch || ""}
        ${student.institution || ""}
        ${student.category || ""}
        ${student.state || ""}
        ${student.district || ""}
      `.toLowerCase();

      return searchableText.includes(
        search.toLowerCase()
      );
    }
  );

  // =========================================================
  // VIEW STUDENT
  // =========================================================

  const viewStudent = (studentId) => {
    if (!studentId) {
      toast.error(
        "Student ID is missing."
      );
      return;
    }

    navigate(
      `/admin/students/${studentId}`
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Students
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage registered student accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStudents}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="mb-5 flex gap-3">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search students by name, email, course, branch..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-purple-500"
          />

        </div>

      </div>

      {/* =====================================================
          RESULT COUNT
      ===================================================== */}

      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">

        <Users size={16} />

        <span>
          Showing {filteredStudents.length} of{" "}
          {students.length} students
        </span>

      </div>

      {/* =====================================================
          STUDENTS TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-2xl border border-white/10">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px] text-left">

            <thead className="border-b border-white/10 bg-white/[0.03]">

              <tr>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Student
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Education
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="py-14 text-center"
                  >

                    <Loader2
                      size={26}
                      className="mx-auto animate-spin text-purple-400"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      Loading students...
                    </p>

                  </td>

                </tr>

              ) : filteredStudents.length === 0 ? (

                /* EMPTY */

                <tr>

                  <td
                    colSpan="6"
                    className="py-14 text-center"
                  >

                    <Users
                      size={38}
                      className="mx-auto mb-3 text-slate-700"
                    />

                    <p className="text-sm text-slate-500">
                      No students found.
                    </p>

                  </td>

                </tr>

              ) : (

                /* STUDENTS */

                filteredStudents.map(
                  (student) => {

                    const isActive =
                      student.isActive !== false;

                    return (
                      <tr
                        key={student._id}
                        className="border-b border-white/5 transition hover:bg-white/[0.03]"
                      >

                        {/* STUDENT */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                              <Users size={18} />
                            </div>

                            <div>

                              <p className="font-medium text-white">
                                {student.name ||
                                  student.fullName ||
                                  "Unknown Student"}
                              </p>

                              {student.phone && (
                                <p className="mt-1 text-xs text-slate-600">
                                  {student.phone}
                                </p>
                              )}

                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}

                        <td className="px-5 py-4">

                          <p className="text-sm text-slate-400">
                            {student.email ||
                              "—"}
                          </p>

                        </td>

                        {/* EDUCATION */}

                        <td className="px-5 py-4">

                          <p className="text-sm text-slate-300">
                            {student.educationLevel ||
                              student.course ||
                              "—"}
                          </p>

                          {student.branch && (
                            <p className="mt-1 text-xs text-slate-600">
                              {student.branch}
                            </p>
                          )}

                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-4">

                          <div>

                            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
                              {student.category ||
                                "Not specified"}
                            </span>

                            {student.subCategory && (
                              <p className="mt-2 text-xs text-slate-600">
                                {student.subCategory}
                              </p>
                            )}

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              isActive
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-red-500/10 text-red-400"
                            }`}
                          >
                            {isActive
                              ? "Active"
                              : "Inactive"}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              viewStudent(
                                student._id
                              )
                            }
                            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:bg-white/5 hover:text-white"
                          >

                            <Eye size={15} />

                            View

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Students;