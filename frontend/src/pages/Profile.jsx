import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  GraduationCap,
  IndianRupee,
  Loader2,
  MapPin,
  Save,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../services/api";

const initialProfile = {
  fullName: "",
  dob: "",
  gender: "",
  state: "",
  district: "",
  city: "",
  areaType: "",

  category: "",
  casteCommunity: "",
  minority: "",
  disability: "",
  disabilityType: "",

  annualFamilyIncome: "",
  incomeCertificate: "",
  parentOccupation: "",

  educationLevel: "",
  institution: "",
  course: "",
  branch: "",
  academicYear: "",
  previousPercentage: "",
  currentCGPA: "",

  domicileState: "",
  specialEligibility: "",
};

const states = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-500";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

const Section = ({
  icon: Icon,
  title,
  description,
  children,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="text-lg font-black text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>

    {children}
  </section>
);

const TextField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
  min,
  max,
  step,
}) => (
  <div>
    <label htmlFor={name} className={labelClass}>
      {label}
    </label>

    <input
      id={name}
      name={name}
      type={type}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      step={step}
      className={inputClass}
    />
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  disabled = false,
}) => (
  <div>
    <label htmlFor={name} className={labelClass}>
      {label}
    </label>

    <select
      id={name}
      name={name}
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled}
      className={inputClass}
    >
      <option value="">Select</option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Profile = ({ edit = false }) => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isEditing = edit;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const response = await api.get("/profile");

        const data =
          response.data?.profile ||
          response.data?.data ||
          response.data;

        if (data) {
          setProfile({
            ...initialProfile,
            ...data,
          });
        }
      } catch (error) {
        console.error("Profile loading error:", error);

        if (user?.profile) {
          setProfile({
            ...initialProfile,
            ...user.profile,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const completion = useMemo(() => {
    const fields = [
      "fullName",
      "dob",
      "gender",
      "state",
      "district",
      "city",
      "category",
      "minority",
      "disability",
      "annualFamilyIncome",
      "incomeCertificate",
      "parentOccupation",
      "educationLevel",
      "institution",
      "course",
      "academicYear",
      "domicileState",
    ];

    const completed = fields.filter((field) => {
      const value = profile[field];

      return (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      );
    }).length;

    return Math.round((completed / fields.length) * 100);
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!profile.fullName?.trim()) {
      toast.error("Full name is required.");
      return false;
    }

    if (!profile.state) {
      toast.error("State is required.");
      return false;
    }

    if (!profile.category) {
      toast.error("Category is required.");
      return false;
    }

    if (
      profile.annualFamilyIncome !== "" &&
      Number(profile.annualFamilyIncome) < 0
    ) {
      toast.error("Annual family income cannot be negative.");
      return false;
    }

    if (
      profile.previousPercentage !== "" &&
      (Number(profile.previousPercentage) < 0 ||
        Number(profile.previousPercentage) > 100)
    ) {
      toast.error(
        "Previous percentage must be between 0 and 100."
      );
      return false;
    }

    if (
      profile.currentCGPA !== "" &&
      (Number(profile.currentCGPA) < 0 ||
        Number(profile.currentCGPA) > 10)
    ) {
      toast.error("CGPA must be between 0 and 10.");
      return false;
    }

    return true;
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      setSaving(true);

      const payload = {
        ...profile,

        annualFamilyIncome:
          profile.annualFamilyIncome === ""
            ? null
            : Number(profile.annualFamilyIncome),

        previousPercentage:
          profile.previousPercentage === ""
            ? null
            : Number(profile.previousPercentage),

        currentCGPA:
          profile.currentCGPA === ""
            ? null
            : Number(profile.currentCGPA),

        profileCompleted: true,
      };

      const response = await api.put(
        "/profile",
        payload
      );

      const updatedProfile =
        response.data?.profile ||
        response.data?.data ||
        response.data ||
        payload;

      setProfile({
        ...initialProfile,
        ...updatedProfile,
      });

      updateUser({
        fullName: profile.fullName,
        profileCompleted: true,
        profile: updatedProfile,
      });

      toast.success("Profile updated successfully.");

      navigate("/profile");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={36}
            className="mx-auto animate-spin text-indigo-600"
          />

          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Dashboard
            </Link>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {isEditing
              ? "Edit Profile"
              : "My Profile"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Keep your information updated so ScholarNet
            can find relevant scholarships.
          </p>
        </div>

        {!isEditing && (
          <Link
            to="/profile/edit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            <Edit3 size={17} />
            Edit Profile
          </Link>
        )}
      </div>

      {/* Profile completion */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 p-5 text-white shadow-lg sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-100">
              Profile completion
            </p>

            <div className="mt-1 flex items-center gap-3">
              <span className="text-3xl font-black">
                {completion}%
              </span>

              {completion < 100 && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                  Almost there
                </span>
              )}
            </div>

            <p className="mt-1 max-w-xl text-sm text-indigo-100">
              A complete profile helps ScholarNet
              match you with more relevant scholarship
              opportunities.
            </p>
          </div>

          <div className="w-full sm:w-64">
            <div className="mb-2 flex justify-between text-xs font-bold">
              <span>Completion</span>
              <span>{completion}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-6"
      >
        {/* Personal */}
        <Section
          icon={User}
          title="Personal Information"
          description="Basic information used for scholarship matching."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <TextField
                label="Full name"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Your full name"
              />
            </div>

            <TextField
              label="Date of birth"
              name="dob"
              type="date"
              value={profile.dob}
              onChange={handleChange}
              disabled={!isEditing}
            />

            <SelectField
              label="Gender"
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                {
                  value: "Male",
                  label: "Male",
                },
                {
                  value: "Female",
                  label: "Female",
                },
                {
                  value: "Other",
                  label: "Other",
                },
                {
                  value: "Prefer not to say",
                  label: "Prefer not to say",
                },
              ]}
            />

            <SelectField
              label="State"
              name="state"
              value={profile.state}
              onChange={handleChange}
              disabled={!isEditing}
              options={states.map((state) => ({
                value: state,
                label: state,
              }))}
            />

            <TextField
              label="District"
              name="district"
              value={profile.district}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="District"
            />

            <TextField
              label="City / Town / Village"
              name="city"
              value={profile.city}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="City, town or village"
            />

            <SelectField
              label="Area type"
              name="areaType"
              value={profile.areaType}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                {
                  value: "Urban",
                  label: "Urban",
                },
                {
                  value: "Rural",
                  label: "Rural",
                },
                {
                  value: "Semi-Urban",
                  label: "Semi-Urban",
                },
              ]}
            />
          </div>
        </Section>

        {/* Category */}
        <Section
          icon={Users}
          title="Category & Social Information"
          description="Information used for category-specific scholarships."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Category"
              name="category"
              value={profile.category}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                {
                  value: "General",
                  label: "General",
                },
                {
                  value: "OBC",
                  label: "OBC",
                },
                {
                  value: "SC",
                  label: "SC",
                },
                {
                  value: "ST",
                  label: "ST",
                },
                {
                  value: "EWS",
                  label: "EWS",
                },
                {
                  value: "Minority",
                  label: "Minority",
                },
                {
                  value: "Other",
                  label: "Other",
                },
              ]}
            />

            <TextField
              label="Caste / Community"
              name="casteCommunity"
              value={profile.casteCommunity}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="If applicable"
            />

            <SelectField
              label="Minority status"
              name="minority"
              value={profile.minority}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                {
                  value: "Yes",
                  label: "Yes",
                },
                {
                  value: "No",
                  label: "No",
                },
              ]}
            />

            <SelectField
              label="Disability status"
              name="disability"
              value={profile.disability}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                {
                  value: "Yes",
                  label: "Yes",
                },
                {
                  value: "No",
                  label: "No",
                },
              ]}
            />

            {profile.disability === "Yes" && (
              <div className="sm:col-span-2">
                <TextField
                  label="Disability type"
                  name="disabilityType"
                  value={profile.disabilityType}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Disability type"
                />
              </div>
            )}
          </div>
        </Section>

        {/* Financial */}
        <Section
          icon={Wallet}
          title="Financial Information"
          description="Used to match scholarships with family income requirements."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="annualFamilyIncome"
                className={labelClass}
              >
                Annual family income
              </label>

              <div className="relative">
                <IndianRupee
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="annualFamilyIncome"
                  name="annualFamilyIncome"
                  type="number"
                  min="0"
                  value={
                    profile.annualFamilyIncome ?? ""
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="e.g. 250000"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <SelectField
              label="Income certificate"
              name="incomeCertificate"
              value={profile.incomeCertificate}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                {
                  value: "Available",
                  label: "Available",
                },
                {
                  value: "Not Available",
                  label: "Not Available",
                },
                {
                  value: "Applied",
                  label: "Applied",
                },
              ]}
            />

            <TextField
              label="Parent / guardian occupation"
              name="parentOccupation"
              value={profile.parentOccupation}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Occupation"
            />
          </div>
        </Section>

        {/* Academic */}
        <Section
          icon={GraduationCap}
          title="Academic Information"
          description="Your education details are important for course and academic eligibility."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Education level"
              name="educationLevel"
              value={profile.educationLevel}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                {
                  value: "School",
                  label: "School",
                },
                {
                  value: "Diploma",
                  label: "Diploma",
                },
                {
                  value: "Undergraduate",
                  label: "Undergraduate",
                },
                {
                  value: "Postgraduate",
                  label: "Postgraduate",
                },
                {
                  value: "PhD",
                  label: "PhD",
                },
                {
                  value: "Other",
                  label: "Other",
                },
              ]}
            />

            <TextField
              label="College / institution"
              name="institution"
              value={profile.institution}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Institution name"
            />

            <TextField
              label="Course"
              name="course"
              value={profile.course}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="e.g. B.Tech"
            />

            <TextField
              label="Branch / stream"
              name="branch"
              value={profile.branch}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="e.g. Computer Science"
            />

            <SelectField
              label="Current academic year"
              name="academicYear"
              value={profile.academicYear}
              onChange={handleChange}
              disabled={!isEditing}
              options={[
                {
                  value: "1st Year",
                  label: "1st Year",
                },
                {
                  value: "2nd Year",
                  label: "2nd Year",
                },
                {
                  value: "3rd Year",
                  label: "3rd Year",
                },
                {
                  value: "4th Year",
                  label: "4th Year",
                },
                {
                  value: "5th Year",
                  label: "5th Year",
                },
                {
                  value: "Other",
                  label: "Other",
                },
              ]}
            />

            <TextField
              label="Previous percentage"
              name="previousPercentage"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={profile.previousPercentage}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="e.g. 78.5"
            />

            <TextField
              label="Current CGPA"
              name="currentCGPA"
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={profile.currentCGPA}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="e.g. 8.1"
            />
          </div>
        </Section>

        {/* Additional */}
        <Section
          icon={MapPin}
          title="Additional Eligibility"
          description="Additional information that can affect scholarship matching."
        >
          <div className="space-y-5">
            <SelectField
              label="Domicile state"
              name="domicileState"
              value={profile.domicileState}
              onChange={handleChange}
              disabled={!isEditing}
              options={states.map((state) => ({
                value: state,
                label: state,
              }))}
            />

            <div>
              <label
                htmlFor="specialEligibility"
                className={labelClass}
              >
                Special eligibility information
              </label>

              <textarea
                id="specialEligibility"
                name="specialEligibility"
                value={
                  profile.specialEligibility ?? ""
                }
                onChange={handleChange}
                disabled={!isEditing}
                rows={5}
                placeholder="Any additional scholarship-related eligibility information..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </Section>

        {/* Save buttons */}
        {isEditing && (
          <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {/* Footer note */}
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
        <div className="flex gap-3">
          <GraduationCap
            size={20}
            className="mt-0.5 shrink-0 text-indigo-600"
          />

          <div>
            <p className="text-sm font-bold text-indigo-900">
              Scholarship eligibility reminder
            </p>

            <p className="mt-1 text-xs leading-5 text-indigo-700">
              ScholarNet provides eligibility guidance based
              on the information you provide. Always verify
              the latest eligibility criteria, documents,
              deadlines and application instructions on the
              official scholarship portal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;