import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  FileText,
  Loader2,
  Calendar,
  IndianRupee,
  Briefcase,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH STUDENT
  // =========================================================

  const fetchStudent = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/admin/students/${id}`
      );

      const studentData =
        data?.data?.student ||
        data?.student ||
        data?.data;

      if (!studentData) {
        throw new Error(
          "Student not found."
        );
      }

      setStudent(studentData);
    } catch (error) {
      console.error(
        "FETCH STUDENT ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to load student."
      );

      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="mx-auto animate-spin text-purple-400"
          />

          <p className="mt-4 text-sm text-slate-500">
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!student) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center p-6">
        <div className="text-center">
          <User
            size={40}
            className="mx-auto text-slate-600"
          />

          <h2 className="mt-4 text-xl font-semibold text-white">
            Student not found
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/students")
            }
            className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  // =========================================================
  // DATA
  // =========================================================

  const profile =
    student.profile || student;

  const documents =
    Array.isArray(student.documents)
      ? student.documents
      : [];

  const applications =
    Array.isArray(student.applications)
      ? student.applications
      : [];

  const isActive =
    student.isActive !== false;

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">

        <button
          type="button"
          onClick={() =>
            navigate("/admin/students")
          }
          className="flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Student Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View complete student information.
          </p>
        </div>

      </div>

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* PROFILE IMAGE */}

          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-500/10 text-purple-400">

            {student.profileImage ? (
              <img
                src={student.profileImage}
                alt="Student"
                className="h-20 w-20 object-cover"
              />
            ) : (
              <User size={34} />
            )}

          </div>

          {/* BASIC INFO */}

          <div className="flex-1">

            <h2 className="text-2xl font-bold text-white">
              {student.name ||
                profile.name ||
                "Unknown Student"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {student.email ||
                profile.email ||
                "No email available"}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">

              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
                Student
              </span>

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

              {student.category && (
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                  {student.category}
                </span>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <SectionHeader
          icon={User}
          title="Personal Information"
          description="Student's basic information"
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <InfoItem
            icon={User}
            label="Full Name"
            value={
              student.name ||
              profile.name
            }
          />

          <InfoItem
            icon={Mail}
            label="Email"
            value={
              student.email ||
              profile.email
            }
          />

          <InfoItem
            icon={Phone}
            label="Phone"
            value={
              student.phone ||
              profile.phone
            }
          />

          <InfoItem
            icon={Calendar}
            label="Date of Birth"
            value={
              student.dob ||
              profile.dob
            }
          />

          <InfoItem
            icon={MapPin}
            label="State"
            value={
              student.state ||
              profile.state
            }
          />

          <InfoItem
            icon={MapPin}
            label="District"
            value={
              student.district ||
              profile.district
            }
          />

          <InfoItem
            icon={MapPin}
            label="Address"
            value={
              student.address ||
              profile.address
            }
          />

        </div>

      </section>

      {/* =====================================================
          ACADEMIC INFORMATION
      ===================================================== */}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <SectionHeader
          icon={GraduationCap}
          title="Academic Information"
          description="Student's education details"
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <InfoItem
            label="Education Level"
            value={
              student.educationLevel ||
              profile.educationLevel
            }
          />

          <InfoItem
            label="Course"
            value={
              student.course ||
              profile.course
            }
          />

          <InfoItem
            label="Branch"
            value={
              student.branch ||
              profile.branch
            }
          />

          <InfoItem
            label="Institution"
            value={
              student.institution ||
              profile.institution
            }
          />

          <InfoItem
            label="Current Year"
            value={
              student.currentYear ??
              profile.currentYear
            }
          />

          <InfoItem
            label="CGPA"
            value={
              student.cgpa ??
              profile.cgpa
            }
          />

          <InfoItem
            label="Percentage"
            value={
              student.percentage ??
              profile.percentage
            }
          />

        </div>

      </section>

      {/* =====================================================
          CATEGORY + FINANCIAL INFORMATION
      ===================================================== */}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <SectionHeader
          icon={IndianRupee}
          title="Category & Financial Information"
          description="Scholarship eligibility information"
          iconClass="bg-emerald-500/10 text-emerald-400"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <InfoItem
            label="Category"
            value={
              student.category ||
              profile.category
            }
          />

          <InfoItem
            label="Sub Category"
            value={
              student.subCategory ||
              profile.subCategory
            }
          />

          <InfoItem
            label="Domicile State"
            value={
              student.domicileState ||
              profile.domicileState
            }
          />

          <InfoItem
            label="Domicile District"
            value={
              student.domicileDistrict ||
              profile.domicileDistrict
            }
          />

          <InfoItem
            icon={IndianRupee}
            label="Annual Income"
            value={
              student.annualIncome ??
              profile.annualIncome
            }
          />

          <InfoItem
            icon={IndianRupee}
            label="Monthly Income"
            value={
              student.monthlyIncome ??
              profile.monthlyIncome
            }
          />

          <InfoItem
            label="Income Source"
            value={
              student.incomeSource ||
              profile.incomeSource
            }
          />

          <InfoItem
            label="Financial Status"
            value={
              student.financialStatus ||
              profile.financialStatus
            }
          />

        </div>

      </section>

      {/* =====================================================
          DISABILITY
      ===================================================== */}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <SectionHeader
          icon={ShieldCheck}
          title="Disability Information"
          description="Disability details used for eligibility"
          iconClass="bg-orange-500/10 text-orange-400"
        />

        <div className="grid gap-5 sm:grid-cols-2">

          <InfoItem
            label="Disability"
            value={
              student.disability
                ? "Yes"
                : "No"
            }
          />

          {student.disability && (
            <InfoItem
              label="Disability Type"
              value={
                student.disabilityType ||
                profile.disabilityType
              }
            />
          )}

        </div>

      </section>

      {/* =====================================================
          DOCUMENTS
      ===================================================== */}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <div className="mb-6 flex items-center justify-between">

          <SectionHeader
            icon={FileText}
            title="Documents"
            description="Uploaded student documents"
            iconClass="bg-orange-500/10 text-orange-400"
            noMargin
          />

          <span className="text-sm text-slate-500">
            {documents.length} document
            {documents.length !== 1
              ? "s"
              : ""}
          </span>

        </div>

        {documents.length === 0 ? (

          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-600">
            No documents uploaded.
          </div>

        ) : (

          <div className="grid gap-3 md:grid-cols-2">

            {documents.map(
              (document) => (

                <div
                  key={document._id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950 p-4"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <FileText
                      size={20}
                      className="shrink-0 text-slate-500"
                    />

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium text-white">
                        {document.name ||
                          document.fileName ||
                          "Document"}
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        {document.type ||
                          "Unknown type"}
                      </p>

                      {document.verified && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] text-emerald-400">
                          <ShieldCheck
                            size={11}
                          />
                          Verified
                        </span>
                      )}

                    </div>

                  </div>

                  {document.url && (
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex shrink-0 items-center gap-1 rounded-lg bg-white/5 px-3 py-2 text-xs text-purple-400 transition hover:bg-purple-500/10"
                    >
                      View
                      <ExternalLink
                        size={13}
                      />
                    </a>
                  )}

                </div>

              )
            )}

          </div>

        )}

      </section>

      {/* =====================================================
          APPLICATIONS
      ===================================================== */}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <SectionHeader
          icon={Briefcase}
          title="Applications"
          description="Scholarship applications submitted by this student"
          iconClass="bg-cyan-500/10 text-cyan-400"
        />

        {applications.length === 0 ? (

          <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-600">
            No applications found.
          </div>

        ) : (

          <div className="space-y-3">

            {applications.map(
              (application) => {

                const status =
                  String(
                    application.status ||
                      "pending"
                  ).toLowerCase();

                const statusClass =
                  status === "approved"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : status === "rejected"
                    ? "bg-red-500/10 text-red-400"
                    : status ===
                      "under_review"
                    ? "bg-blue-500/10 text-blue-400"
                    : "bg-yellow-500/10 text-yellow-400";

                return (
                  <div
                    key={application._id}
                    className="flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-slate-950 p-4 sm:flex-row sm:items-center"
                  >

                    <div>

                      <p className="font-medium text-white">
                        {application
                          .scholarship
                          ?.title ||
                          application.scholarshipTitle ||
                          "Scholarship"}
                      </p>

                      {application
                        .scholarship
                        ?.provider && (
                        <p className="mt-1 text-xs text-slate-600">
                          {
                            application
                              .scholarship
                              .provider
                          }
                        </p>
                      )}

                      <p className="mt-1 text-xs text-slate-600">
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "Date unavailable"}
                      </p>

                      {application.adminRemark && (
                        <p className="mt-2 max-w-xl text-xs text-slate-500">
                          Remark:{" "}
                          {
                            application.adminRemark
                          }
                        </p>
                      )}

                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs ${statusClass}`}
                    >
                      {status
                        .replace(
                          "_",
                          " "
                        )
                        .replace(
                          /\b\w/g,
                          (char) =>
                            char.toUpperCase()
                        )}
                    </span>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>

    </div>
  );
};

// =========================================================
// SECTION HEADER
// =========================================================

const SectionHeader = ({
  icon: Icon,
  title,
  description,
  iconClass,
  noMargin = false,
}) => {
  return (
    <div
      className={`flex items-center gap-3 ${
        noMargin ? "" : "mb-6"
      }`}
    >

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
      >
        <Icon size={19} />
      </div>

      <div>
        <h2 className="font-semibold text-white">
          {title}
        </h2>

        {description && (
          <p className="text-xs text-slate-500">
            {description}
          </p>
        )}
      </div>

    </div>
  );
};

// =========================================================
// INFO ITEM
// =========================================================

const InfoItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4">

      <div className="flex items-center gap-2">

        {Icon && (
          <Icon
            size={15}
            className="text-slate-600"
          />
        )}

        <p className="text-xs text-slate-600">
          {label}
        </p>

      </div>

      <p className="mt-2 break-words text-sm font-medium text-slate-300">
        {value !== undefined &&
        value !== null &&
        value !== ""
          ? String(value)
          : "Not provided"}
      </p>

    </div>
  );
};

export default StudentDetails;