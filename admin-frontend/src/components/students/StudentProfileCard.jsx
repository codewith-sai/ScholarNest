import {
  User,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
  GraduationCap,
  Building2,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";

const StudentProfileCard = ({ student }) => {
  if (!student) return null;

  const formatDate = (date) => {
    if (!date) return "Not provided";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not provided";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    if (
      amount === undefined ||
      amount === null ||
      amount === ""
    ) {
      return "Not provided";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-5">

      {/* =====================================================
          PROFILE HEADER
      ===================================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {/* AVATAR */}

          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-purple-500/10 text-2xl font-bold text-purple-400">

            {student.profileImage ? (
              <img
                src={student.profileImage}
                alt={student.name || "Student"}
                className="h-full w-full object-cover"
              />
            ) : (
              (student.name || "S")
                .charAt(0)
                .toUpperCase()
            )}

          </div>

          {/* NAME */}

          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-3">

              <h2 className="text-xl font-bold text-white">
                {student.name || "Unnamed Student"}
              </h2>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  student.isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    student.isActive
                      ? "bg-emerald-400"
                      : "bg-red-400"
                  }`}
                />

                {student.isActive
                  ? "Active"
                  : "Inactive"}
              </span>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Student Profile
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

              <span className="flex items-center gap-1.5">
                <Mail size={13} />
                {student.email || "No email"}
              </span>

              <span className="flex items-center gap-1.5">
                <Phone size={13} />
                {student.phone || "No phone"}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          PERSONAL INFORMATION
      ===================================================== */}

      <ProfileSection
        title="Personal Information"
        icon={User}
      >

        <InfoItem
          label="Full Name"
          value={student.name}
        />

        <InfoItem
          label="Email"
          value={student.email}
        />

        <InfoItem
          label="Phone"
          value={student.phone}
        />

        <InfoItem
          label="Date of Birth"
          value={formatDate(student.dob)}
          icon={CalendarDays}
        />

      </ProfileSection>

      {/* =====================================================
          ACADEMIC INFORMATION
      ===================================================== */}

      <ProfileSection
        title="Academic Information"
        icon={GraduationCap}
      >

        <InfoItem
          label="Education Level"
          value={student.educationLevel}
        />

        <InfoItem
          label="Course"
          value={student.course}
        />

        <InfoItem
          label="Branch"
          value={student.branch}
        />

        <InfoItem
          label="Institution"
          value={student.institution}
          icon={Building2}
        />

        <InfoItem
          label="Current Year"
          value={student.currentYear}
        />

        <InfoItem
          label="CGPA"
          value={student.cgpa}
        />

        <InfoItem
          label="Percentage"
          value={
            student.percentage !== undefined &&
            student.percentage !== null &&
            student.percentage !== ""
              ? `${student.percentage}%`
              : null
          }
        />

      </ProfileSection>

      {/* =====================================================
          CATEGORY & FINANCIAL INFORMATION
      ===================================================== */}

      <ProfileSection
        title="Category & Financial Information"
        icon={ShieldCheck}
      >

        <InfoItem
          label="Category"
          value={student.category}
        />

        <InfoItem
          label="Sub Category"
          value={student.subCategory}
        />

        <InfoItem
          label="Domicile State"
          value={student.domicileState}
          icon={MapPin}
        />

        <InfoItem
          label="Domicile District"
          value={student.domicileDistrict}
        />

        <InfoItem
          label="Annual Income"
          value={formatAmount(student.annualIncome)}
          icon={IndianRupee}
        />

        <InfoItem
          label="Monthly Income"
          value={formatAmount(student.monthlyIncome)}
          icon={IndianRupee}
        />

        <InfoItem
          label="Income Source"
          value={student.incomeSource}
        />

        <InfoItem
          label="Financial Status"
          value={student.financialStatus}
        />

      </ProfileSection>

      {/* =====================================================
          ADDRESS
      ===================================================== */}

      <ProfileSection
        title="Address"
        icon={MapPin}
      >

        <div className="sm:col-span-2 lg:col-span-3">

          <InfoItem
            label="Address"
            value={student.address}
          />

        </div>

        <InfoItem
          label="State"
          value={student.state}
        />

        <InfoItem
          label="District"
          value={student.district}
        />

      </ProfileSection>

      {/* =====================================================
          DISABILITY
      ===================================================== */}

      <ProfileSection
        title="Disability Information"
        icon={ShieldCheck}
      >

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
            value={student.disabilityType}
          />
        )}

      </ProfileSection>

    </div>
  );
};

/* =========================================================
   PROFILE SECTION
========================================================= */

const ProfileSection = ({
  title,
  icon: Icon,
  children,
}) => {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">

      <div className="mb-5 flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <Icon size={18} />
        </div>

        <h3 className="text-base font-semibold text-white">
          {title}
        </h3>

      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>

    </section>
  );
};

/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({
  label,
  value,
  icon: Icon,
}) => {
  const displayValue =
    value !== undefined &&
    value !== null &&
    value !== ""
      ? value
      : "Not provided";

  return (
    <div className="rounded-xl bg-white/[0.02] p-3.5">

      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-600">
        {label}
      </p>

      <div className="mt-1.5 flex items-start gap-2">

        {Icon && (
          <Icon
            size={14}
            className="mt-0.5 shrink-0 text-slate-600"
          />
        )}

        <p className="break-words text-sm text-slate-300">
          {displayValue}
        </p>

      </div>

    </div>
  );
};

export default StudentProfileCard;