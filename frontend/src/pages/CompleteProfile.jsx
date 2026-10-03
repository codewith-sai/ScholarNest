import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleUser,
  FileText,
  GraduationCap,
  IndianRupee,
  MapPin,
  Save,
  UserRound,
} from "lucide-react";
import gsap from "gsap";
import api from "../services/api";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    state: "",
    district: "",
    pincode: "",

    // Category Information
    category: "",
    subCategory: "",
    domicileState: "",
    domicileDistrict: "",
    disabilityStatus: false,
    disabilityPercentage: "",

    // Financial Information
    annualFamilyIncome: "",
    monthlyFamilyIncome: "",
    incomeSource: "",
    incomeCertificateAvailable: false,

    // Academic Information
    educationLevel: "",
    course: "",
    branch: "",
    institution: "",
    currentYear: "",
    academicPerformance: "",
    cgpa: "",
    percentage: "",

    // Other Information
    hostelRequired: false,
    firstGenerationStudent: false,
    orphanStatus: false,
    specialAchievements: "",
  });

  const steps = [
    {
      id: 1,
      title: "Personal",
      icon: UserRound,
    },
    {
      id: 2,
      title: "Category",
      icon: CircleUser,
    },
    {
      id: 3,
      title: "Financial",
      icon: IndianRupee,
    },
    {
      id: 4,
      title: "Academic",
      icon: GraduationCap,
    },
    {
      id: 5,
      title: "Other",
      icon: FileText,
    },
  ];

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu and Kashmir",
  ];

  const educationLevels = [
    "School",
    "Higher Secondary",
    "Diploma",
    "Undergraduate",
    "Postgraduate",
    "PhD",
  ];

  const categories = [
    "General",
    "SC",
    "ST",
    "OBC",
    "EWS",
    "Minority",
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setFetchingProfile(true);
        setError("");

        const response = await api.get("/profile");

        const profile =
          response?.data?.data ?? response?.data;

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            ...profile,
            fullName:
              profile.fullName ||
              profile.name ||
              prev.fullName,
            annualFamilyIncome:
              profile.annualFamilyIncome ??
              profile.annualIncome ??
              prev.annualFamilyIncome,
          }));
        }
      } catch (err) {
        if (err?.response?.status !== 404) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load profile."
          );
        }
      } finally {
        setFetchingProfile(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".profile-container", {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".profile-step", {
        opacity: 0,
        y: -15,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.2,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (
        !formData.fullName.trim() ||
        !formData.phone.trim() ||
        !formData.dateOfBirth ||
        !formData.state ||
        !formData.district
      ) {
        setError(
          "Please complete all required personal information."
        );
        return false;
      }
    }

    if (currentStep === 2) {
      if (!formData.category || !formData.domicileState) {
        setError(
          "Please select your category and domicile state."
        );
        return false;
      }

      if (
        formData.disabilityStatus &&
        !formData.disabilityPercentage
      ) {
        setError(
          "Please enter your disability percentage."
        );
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.annualFamilyIncome) {
        setError(
          "Please enter your annual family income."
        );
        return false;
      }
    }

    if (currentStep === 4) {
      if (
        !formData.educationLevel ||
        !formData.course ||
        !formData.institution ||
        !formData.currentYear
      ) {
        setError(
          "Please complete the required academic information."
        );
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;

    setError("");

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const previousStep = () => {
    setError("");

    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const saveProfile = async (redirect = false) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.put("/profile", formData);

      const updatedProfile =
        response?.data?.data ?? response?.data;

      if (updatedProfile) {
        setFormData((prev) => ({
          ...prev,
          ...updatedProfile,
        }));
      }

      setSuccess(
        response?.data?.message ||
          "Profile saved successfully."
      );

      if (redirect) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 700);
      }

      return true;
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save profile."
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateStep()) return;

    await saveProfile(true);
  };

  const renderInput = ({
    label,
    name,
    type = "text",
    placeholder,
    required = false,
  }) => (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-400">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
      />
    </div>
  );

  const renderSelect = ({
    label,
    name,
    options,
    required = false,
  }) => (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-300"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-400">*</span>
        )}
      </label>

      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  if (fetchingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />
          <p className="mt-4 text-sm text-slate-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8"
    >
      <div className="profile-container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <GraduationCap size={24} />
              </div>

              <span className="text-xl font-bold">
                Scholar<span className="text-blue-400">Net</span>
              </span>
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Complete Your Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Add your information to discover scholarships that
              match your eligibility.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={17} />
            Skip for now
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">
              Step {currentStep} of {steps.length}
            </span>

            <span className="text-sm text-blue-400">
              {Math.round(
                (currentStep / steps.length) * 100
              )}
              %
            </span>
          </div>

          <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${
                  (currentStep / steps.length) * 100
                }%`,
              }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (step.id <= currentStep) {
                      setCurrentStep(step.id);
                    }
                  }}
                  disabled={step.id > currentStep}
                  className={`profile-step flex flex-col items-center gap-2 rounded-xl p-2 transition ${
                    isActive
                      ? "bg-blue-500/10 text-blue-400"
                      : isCompleted
                      ? "text-emerald-400"
                      : "text-slate-600"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                      isActive
                        ? "border-blue-500 bg-blue-500/10"
                        : isCompleted
                        ? "border-emerald-500 bg-emerald-500/10"
                        : "border-slate-700 bg-slate-900"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={17} />
                    ) : (
                      <Icon size={17} />
                    )}
                  </div>

                  <span className="hidden text-xs font-medium sm:block">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {success}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8"
        >
          {/* Step 1 */}
          {currentStep === 1 && (
            <section>
              <div className="mb-7">
                <h2 className="text-2xl font-bold">
                  Personal Information
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Tell us about yourself and where you live.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {renderInput({
                  label: "Full Name",
                  name: "fullName",
                  placeholder: "Enter your full name",
                  required: true,
                })}

                {renderInput({
                  label: "Email",
                  name: "email",
                  type: "email",
                  placeholder: "Enter your email",
                })}

                {renderInput({
                  label: "Phone Number",
                  name: "phone",
                  type: "tel",
                  placeholder: "Enter your phone number",
                  required: true,
                })}

                {renderInput({
                  label: "Date of Birth",
                  name: "dateOfBirth",
                  type: "date",
                  required: true,
                })}

                {renderSelect({
                  label: "Gender",
                  name: "gender",
                  options: [
                    "Male",
                    "Female",
                    "Other",
                    "Prefer not to say",
                  ],
                })}

                {renderSelect({
                  label: "State",
                  name: "state",
                  options: states,
                  required: true,
                })}

                {renderInput({
                  label: "District",
                  name: "district",
                  placeholder: "Enter your district",
                  required: true,
                })}

                {renderInput({
                  label: "Pincode",
                  name: "pincode",
                  placeholder: "Enter pincode",
                })}

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter your complete address"
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <section>
              <div className="mb-7">
                <h2 className="text-2xl font-bold">
                  Category Information
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  This information helps us identify category-specific
                  scholarships.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {renderSelect({
                  label: "Category",
                  name: "category",
                  options: categories,
                  required: true,
                })}

                {renderInput({
                  label: "Sub Category",
                  name: "subCategory",
                  placeholder: "Enter sub category",
                })}

                {renderSelect({
                  label: "Domicile State",
                  name: "domicileState",
                  options: states,
                  required: true,
                })}

                {renderInput({
                  label: "Domicile District",
                  name: "domicileDistrict",
                  placeholder: "Enter domicile district",
                })}

                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-4">
                    <input
                      type="checkbox"
                      name="disabilityStatus"
                      checked={formData.disabilityStatus}
                      onChange={handleChange}
                      className="h-4 w-4 accent-blue-600"
                    />

                    <span>
                      <span className="block text-sm font-medium text-slate-200">
                        I have a disability
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        Select this if you are eligible for disability
                        related scholarships.
                      </span>
                    </span>
                  </label>
                </div>

                {formData.disabilityStatus &&
                  renderInput({
                    label: "Disability Percentage",
                    name: "disabilityPercentage",
                    type: "number",
                    placeholder: "Enter percentage",
                    required: true,
                  })}
              </div>
            </section>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <section>
              <div className="mb-7">
                <h2 className="text-2xl font-bold">
                  Financial Information
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Financial information helps identify need-based
                  scholarship opportunities.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {renderInput({
                  label: "Annual Family Income",
                  name: "annualFamilyIncome",
                  type: "number",
                  placeholder: "Enter annual family income",
                  required: true,
                })}

                {renderInput({
                  label: "Monthly Family Income",
                  name: "monthlyFamilyIncome",
                  type: "number",
                  placeholder: "Enter monthly family income",
                })}

                {renderInput({
                  label: "Income Source",
                  name: "incomeSource",
                  placeholder: "Example: Business, Job, Farming",
                })}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Income Certificate
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-4">
                    <input
                      type="checkbox"
                      name="incomeCertificateAvailable"
                      checked={
                        formData.incomeCertificateAvailable
                      }
                      onChange={handleChange}
                      className="h-4 w-4 accent-blue-600"
                    />

                    <span className="text-sm text-slate-300">
                      I have a valid income certificate
                    </span>
                  </label>
                </div>
              </div>
            </section>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <section>
              <div className="mb-7">
                <h2 className="text-2xl font-bold">
                  Academic Information
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  Add your current academic details.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {renderSelect({
                  label: "Education Level",
                  name: "educationLevel",
                  options: educationLevels,
                  required: true,
                })}

                {renderInput({
                  label: "Course",
                  name: "course",
                  placeholder: "Example: B.Tech",
                  required: true,
                })}

                {renderInput({
                  label: "Branch / Specialization",
                  name: "branch",
                  placeholder: "Example: Computer Science",
                })}

                {renderInput({
                  label: "Institution",
                  name: "institution",
                  placeholder: "Enter institution name",
                  required: true,
                })}

                {renderInput({
                  label: "Current Year",
                  name: "currentYear",
                  placeholder: "Example: 2nd Year",
                  required: true,
                })}

                {renderInput({
                  label: "Academic Performance",
                  name: "academicPerformance",
                  placeholder: "Example: Excellent",
                })}

                {renderInput({
                  label: "CGPA",
                  name: "cgpa",
                  type: "number",
                  placeholder: "Enter CGPA",
                })}

                {renderInput({
                  label: "Percentage",
                  name: "percentage",
                  type: "number",
                  placeholder: "Enter percentage",
                })}
              </div>
            </section>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <section>
              <div className="mb-7">
                <h2 className="text-2xl font-bold">
                  Other Information
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  These additional details can improve scholarship
                  matching.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-4">
                  <input
                    type="checkbox"
                    name="hostelRequired"
                    checked={formData.hostelRequired}
                    onChange={handleChange}
                    className="h-4 w-4 accent-blue-600"
                  />

                  <span>
                    <span className="block text-sm font-medium text-slate-200">
                      Hostel required
                    </span>

                    <span className="mt-1 block text-xs text-slate-500">
                      I require hostel accommodation.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-4">
                  <input
                    type="checkbox"
                    name="firstGenerationStudent"
                    checked={
                      formData.firstGenerationStudent
                    }
                    onChange={handleChange}
                    className="h-4 w-4 accent-blue-600"
                  />

                  <span>
                    <span className="block text-sm font-medium text-slate-200">
                      First-generation student
                    </span>

                    <span className="mt-1 block text-xs text-slate-500">
                      I am the first person in my family to pursue
                      higher education.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-4">
                  <input
                    type="checkbox"
                    name="orphanStatus"
                    checked={formData.orphanStatus}
                    onChange={handleChange}
                    className="h-4 w-4 accent-blue-600"
                  />

                  <span>
                    <span className="block text-sm font-medium text-slate-200">
                      Orphan status
                    </span>

                    <span className="mt-1 block text-xs text-slate-500">
                      Select if applicable to you.
                    </span>
                  </span>
                </label>

                <div>
                  <label
                    htmlFor="specialAchievements"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Special Achievements
                  </label>

                  <textarea
                    id="specialAchievements"
                    name="specialAchievements"
                    value={formData.specialAchievements}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Mention academic, sports, technical, cultural, or other achievements."
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={previousStep}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  <ArrowLeft size={17} />
                  Previous
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => saveProfile(false)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <Save size={17} />
                Save Progress
              </button>

              {currentStep < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:opacity-50"
                >
                  Next
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Profile
                      <Check size={17} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Help */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
          <MapPin size={14} />
          Your information is used to find relevant scholarship
          opportunities.
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;