import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  IndianRupee,
  MapPin,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../services/api";

const steps = [
  {
    id: 1,
    title: "Personal",
    description: "Basic information",
    icon: User,
  },
  {
    id: 2,
    title: "Category",
    description: "Social eligibility",
    icon: Users,
  },
  {
    id: 3,
    title: "Financial",
    description: "Family income",
    icon: Wallet,
  },
  {
    id: 4,
    title: "Academic",
    description: "Education details",
    icon: GraduationCap,
  },
  {
    id: 5,
    title: "Other",
    description: "Additional eligibility",
    icon: MapPin,
  },
];

const initialForm = {
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

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
}) => (
  <div>
    <label htmlFor={name} className={labelClass}>
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={inputClass}
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const TextField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  max,
  step,
}) => (
  <div>
    <label htmlFor={name} className={labelClass}>
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>

    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      min={min}
      max={max}
      step={step}
      className={inputClass}
    />
  </div>
);

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setForm((current) => ({
        ...current,
        ...user.profile,
      }));
    }

    if (user?.fullName && !user.profile?.fullName) {
      setForm((current) => ({
        ...current,
        fullName: user.fullName,
      }));
    }
  }, [user]);

  const progress = useMemo(
    () => Math.round((currentStep / steps.length) * 100),
    [currentStep]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!form.fullName.trim()) {
        toast.error("Please enter your full name.");
        return false;
      }

      if (!form.dob) {
        toast.error("Please select your date of birth.");
        return false;
      }

      if (!form.gender) {
        toast.error("Please select your gender.");
        return false;
      }

      if (!form.state) {
        toast.error("Please select your state.");
        return false;
      }

      if (!form.district.trim()) {
        toast.error("Please enter your district.");
        return false;
      }

      if (!form.city.trim()) {
        toast.error("Please enter your city/town/village.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!form.category) {
        toast.error("Please select your category.");
        return false;
      }

      if (!form.minority) {
        toast.error("Please select your minority status.");
        return false;
      }

      if (!form.disability) {
        toast.error("Please select your disability status.");
        return false;
      }
    }

    if (currentStep === 3) {
      if (
        form.annualFamilyIncome === "" ||
        Number(form.annualFamilyIncome) < 0
      ) {
        toast.error("Please enter your annual family income.");
        return false;
      }

      if (!form.incomeCertificate) {
        toast.error("Please select your income certificate status.");
        return false;
      }

      if (!form.parentOccupation.trim()) {
        toast.error("Please enter the parent/guardian occupation.");
        return false;
      }
    }

    if (currentStep === 4) {
      if (!form.educationLevel) {
        toast.error("Please select your education level.");
        return false;
      }

      if (!form.institution.trim()) {
        toast.error("Please enter your institution.");
        return false;
      }

      if (!form.course.trim()) {
        toast.error("Please enter your course.");
        return false;
      }

      if (!form.academicYear) {
        toast.error("Please select your current academic year.");
        return false;
      }

      if (
        form.previousPercentage !== "" &&
        (Number(form.previousPercentage) < 0 ||
          Number(form.previousPercentage) > 100)
      ) {
        toast.error("Previous percentage must be between 0 and 100.");
        return false;
      }

      if (
        form.currentCGPA !== "" &&
        (Number(form.currentCGPA) < 0 || Number(form.currentCGPA) > 10)
      ) {
        toast.error("CGPA must be between 0 and 10.");
        return false;
      }
    }

    if (currentStep === 5) {
      if (!form.domicileState) {
        toast.error("Please select your domicile state.");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;

    setCurrentStep((current) => Math.min(current + 1, steps.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previousStep = () => {
    setCurrentStep((current) => Math.max(current - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateStep()) return;

    setLoading(true);

    try {
      const payload = {
        ...form,
        annualFamilyIncome:
          form.annualFamilyIncome === ""
            ? null
            : Number(form.annualFamilyIncome),
        previousPercentage:
          form.previousPercentage === ""
            ? null
            : Number(form.previousPercentage),
        currentCGPA:
          form.currentCGPA === "" ? null : Number(form.currentCGPA),
        profileCompleted: true,
      };

      const response = await api.put("/profile", payload);

      const updatedProfile =
        response.data?.profile ||
        response.data?.data ||
        response.data;

      updateUser({
        profileCompleted: true,
        profile: updatedProfile || payload,
        fullName: form.fullName,
      });

      toast.success(
        "Profile completed! Finding scholarships that match your details..."
      );

      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save your profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Tell us about yourself
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                We use these details to identify scholarships with relevant
                personal and location requirements.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField
                  label="Full name"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <TextField
                label="Date of birth"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                type="date"
                required
              />

              <SelectField
                label="Gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                  { value: "Prefer not to say", label: "Prefer not to say" },
                ]}
              />

              <SelectField
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                options={[
                  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
                  { value: "Assam", label: "Assam" },
                  { value: "Bihar", label: "Bihar" },
                  { value: "Chhattisgarh", label: "Chhattisgarh" },
                  { value: "Delhi", label: "Delhi" },
                  { value: "Goa", label: "Goa" },
                  { value: "Gujarat", label: "Gujarat" },
                  { value: "Haryana", label: "Haryana" },
                  { value: "Himachal Pradesh", label: "Himachal Pradesh" },
                  { value: "Jharkhand", label: "Jharkhand" },
                  { value: "Karnataka", label: "Karnataka" },
                  { value: "Kerala", label: "Kerala" },
                  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
                  { value: "Maharashtra", label: "Maharashtra" },
                  { value: "Odisha", label: "Odisha" },
                  { value: "Punjab", label: "Punjab" },
                  { value: "Rajasthan", label: "Rajasthan" },
                  { value: "Tamil Nadu", label: "Tamil Nadu" },
                  { value: "Telangana", label: "Telangana" },
                  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
                  { value: "Uttarakhand", label: "Uttarakhand" },
                  { value: "West Bengal", label: "West Bengal" },
                  { value: "Other", label: "Other" },
                ]}
              />

              <TextField
                label="District"
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="e.g. Pune"
                required
              />

              <TextField
                label="City / Town / Village"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter your city, town or village"
                required
              />

              <SelectField
                label="Area type"
                name="areaType"
                value={form.areaType}
                onChange={handleChange}
                options={[
                  { value: "Urban", label: "Urban" },
                  { value: "Rural", label: "Rural" },
                  { value: "Semi-Urban", label: "Semi-Urban" },
                ]}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Social and category details
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                These details help us match scholarships that have category,
                community, minority or disability requirements.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                options={[
                  { value: "General", label: "General" },
                  { value: "OBC", label: "OBC" },
                  { value: "SC", label: "SC" },
                  { value: "ST", label: "ST" },
                  { value: "EWS", label: "EWS" },
                  { value: "Minority", label: "Minority" },
                  { value: "Other", label: "Other" },
                ]}
              />

              <TextField
                label="Caste / Community"
                name="casteCommunity"
                value={form.casteCommunity}
                onChange={handleChange}
                placeholder="Enter if relevant"
              />

              <SelectField
                label="Minority status"
                name="minority"
                value={form.minority}
                onChange={handleChange}
                required
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
              />

              <SelectField
                label="Disability status"
                name="disability"
                value={form.disability}
                onChange={handleChange}
                required
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
              />

              {form.disability === "Yes" && (
                <div className="sm:col-span-2">
                  <TextField
                    label="Disability type"
                    name="disabilityType"
                    value={form.disabilityType}
                    onChange={handleChange}
                    placeholder="Enter disability type if applicable"
                  />
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-800">
                Privacy note
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Only provide information that is relevant to scholarship
                eligibility. You should verify the latest documentation
                requirements on the official scholarship portal.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Financial information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Income-related information is used for scholarships that have
                family income limits.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="annualFamilyIncome" className={labelClass}>
                  Annual family income
                  <span className="ml-1 text-red-500">*</span>
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
                    value={form.annualFamilyIncome}
                    onChange={handleChange}
                    placeholder="e.g. 250000"
                    className={`${inputClass} pl-10`}
                  />
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Enter the annual family income in Indian rupees.
                </p>
              </div>

              <SelectField
                label="Income certificate"
                name="incomeCertificate"
                value={form.incomeCertificate}
                onChange={handleChange}
                required
                options={[
                  { value: "Available", label: "Available" },
                  { value: "Not Available", label: "Not Available" },
                  { value: "Applied", label: "Applied" },
                ]}
              />

              <TextField
                label="Parent / guardian occupation"
                name="parentOccupation"
                value={form.parentOccupation}
                onChange={handleChange}
                placeholder="e.g. Farmer, Teacher, Business"
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Academic information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Academic details help us identify course, year, marks and
                education-level requirements.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Education level"
                name="educationLevel"
                value={form.educationLevel}
                onChange={handleChange}
                required
                options={[
                  { value: "School", label: "School" },
                  { value: "Diploma", label: "Diploma" },
                  { value: "Undergraduate", label: "Undergraduate" },
                  { value: "Postgraduate", label: "Postgraduate" },
                  { value: "PhD", label: "PhD" },
                  { value: "Other", label: "Other" },
                ]}
              />

              <TextField
                label="College / institution"
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="Enter institution name"
                required
              />

              <TextField
                label="Course"
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="e.g. B.Tech"
                required
              />

              <TextField
                label="Branch / stream"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
              />

              <SelectField
                label="Current academic year"
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                required
                options={[
                  { value: "1st Year", label: "1st Year" },
                  { value: "2nd Year", label: "2nd Year" },
                  { value: "3rd Year", label: "3rd Year" },
                  { value: "4th Year", label: "4th Year" },
                  { value: "5th Year", label: "5th Year" },
                  { value: "Other", label: "Other" },
                ]}
              />

              <TextField
                label="Previous percentage"
                name="previousPercentage"
                value={form.previousPercentage}
                onChange={handleChange}
                type="number"
                min="0"
                max="100"
                step="0.01"
                placeholder="e.g. 78.5"
              />

              <TextField
                label="Current CGPA"
                name="currentCGPA"
                value={form.currentCGPA}
                onChange={handleChange}
                type="number"
                min="0"
                max="10"
                step="0.01"
                placeholder="e.g. 8.1"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Additional eligibility
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add information that may be relevant to special scholarship
                conditions.
              </p>
            </div>

            <div className="space-y-5">
              <SelectField
                label="Domicile state"
                name="domicileState"
                value={form.domicileState}
                onChange={handleChange}
                required
                options={[
                  { value: "Andhra Pradesh", label: "Andhra Pradesh" },
                  { value: "Assam", label: "Assam" },
                  { value: "Bihar", label: "Bihar" },
                  { value: "Chhattisgarh", label: "Chhattisgarh" },
                  { value: "Delhi", label: "Delhi" },
                  { value: "Goa", label: "Goa" },
                  { value: "Gujarat", label: "Gujarat" },
                  { value: "Haryana", label: "Haryana" },
                  { value: "Karnataka", label: "Karnataka" },
                  { value: "Kerala", label: "Kerala" },
                  { value: "Madhya Pradesh", label: "Madhya Pradesh" },
                  { value: "Maharashtra", label: "Maharashtra" },
                  { value: "Odisha", label: "Odisha" },
                  { value: "Punjab", label: "Punjab" },
                  { value: "Rajasthan", label: "Rajasthan" },
                  { value: "Tamil Nadu", label: "Tamil Nadu" },
                  { value: "Telangana", label: "Telangana" },
                  { value: "Uttar Pradesh", label: "Uttar Pradesh" },
                  { value: "Uttarakhand", label: "Uttarakhand" },
                  { value: "West Bengal", label: "West Bengal" },
                  { value: "Other", label: "Other" },
                ]}
              />

              <div>
                <label htmlFor="specialEligibility" className={labelClass}>
                  Special eligibility information
                </label>

                <textarea
                  id="specialEligibility"
                  name="specialEligibility"
                  value={form.specialEligibility}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Add any relevant information such as special eligibility conditions..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <Check size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-indigo-900">
                    Your profile is almost ready
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-indigo-700">
                    After saving, ScholarNet will use your profile to identify
                    scholarships whose listed criteria appear to match your
                    information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200">
              <GraduationCap size={23} />
            </div>

            <div className="text-left">
              <div className="text-xl font-black text-slate-900">
                Scholar<span className="text-indigo-600">Net</span>
              </div>

              <div className="text-[10px] font-medium text-slate-400">
                Student Profile
              </div>
            </div>
          </button>

          <div className="text-right">
            <p className="text-xs font-semibold text-slate-400">
              Profile completion
            </p>

            <p className="text-sm font-black text-indigo-600">
              {progress}%
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Intro */}
        <div className="mb-7">
          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            Step {currentStep} of {steps.length}
          </span>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Complete your student profile
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Provide the information needed to discover scholarship opportunities
            that may match your eligibility.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="hidden items-center md:flex">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const completed = currentStep > step.id;
              const active = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`flex flex-1 items-center ${
                    index !== steps.length - 1 ? "" : "flex-none"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (step.id <= currentStep) {
                        setCurrentStep(step.id);
                      }
                    }}
                    className="flex items-center gap-3 text-left"
                  >
                    <span
                      className={`
                        flex h-11 w-11 shrink-0 items-center justify-center
                        rounded-xl text-sm font-bold transition
                        ${
                          completed
                            ? "bg-emerald-500 text-white"
                            : active
                              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                              : "bg-slate-100 text-slate-400"
                        }
                      `}
                    >
                      {completed ? <Check size={19} /> : <Icon size={19} />}
                    </span>

                    <span className="hidden lg:block">
                      <span
                        className={`block text-sm font-bold ${
                          active || completed
                            ? "text-slate-900"
                            : "text-slate-400"
                        }`}
                      >
                        {step.title}
                      </span>

                      <span className="block text-xs text-slate-400">
                        {step.description}
                      </span>
                    </span>
                  </button>

                  {index !== steps.length - 1 && (
                    <div
                      className={`mx-4 h-0.5 flex-1 ${
                        currentStep > step.id
                          ? "bg-emerald-400"
                          : "bg-slate-100"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile stepper */}
          <div className="md:hidden">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = steps[currentStep - 1].icon;

                  return (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Icon size={19} />
                    </div>
                  );
                })()}

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {steps[currentStep - 1].title}
                  </p>

                  <p className="text-xs text-slate-400">
                    {steps[currentStep - 1].description}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-indigo-600">
                {currentStep}/{steps.length}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-9">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={previousStep}
              disabled={currentStep === 1 || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft size={17} />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Continue
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving profile...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Save & Find Scholarships
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default CompleteProfile;