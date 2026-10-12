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
<<<<<<< HEAD
  Sparkles,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
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
  state: "Maharashtra",
  district: "",
  taluka: "",
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

  domicileState: "Maharashtra",
  specialEligibility: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

const formatAcademicYear = (val) => {
  if (val === null || val === undefined || val === "") return "";
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.toLowerCase() === "other") return "Other";
    if (trimmed.toLowerCase().includes("year")) return trimmed;
  }
  const num = typeof val === "number" ? val : parseInt(String(val).match(/\d+/)?.[0] || "", 10);
  if (num === 1) return "1st Year";
  if (num === 2) return "2nd Year";
  if (num === 3) return "3rd Year";
  if (num === 4) return "4th Year";
  if (num === 5) return "5th Year";
  if (isNaN(num)) return String(val);
  return `${num}th Year`;
};

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
      value={value ?? ""}
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
      value={value ?? ""}
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

=======
  Save,
  UserRound,
} from "lucide-react";
import gsap from "gsap";
import api from "../services/api";

>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
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
<<<<<<< HEAD
    if (user?.profile) {
      const p = user.profile;
      setForm((current) => ({
        ...current,
        fullName: p.fullName || user.fullName || user.name || current.fullName || "",
        dob: p.dob || (p.dateOfBirth ? new Date(p.dateOfBirth).toISOString().slice(0, 10) : "") || current.dob || "",
        gender: p.gender || current.gender || "",
        state: p.state || current.state || "Maharashtra",
        district: p.district || current.district || "",
        taluka: p.taluka || current.taluka || "",
        city: p.city || current.city || "",
        areaType: p.areaType || current.areaType || "",
        category: p.category || current.category || "",
        casteCommunity: p.casteCommunity || current.casteCommunity || "",
        minority: p.minority || (p.minorityStatus ? "Yes" : (p.minorityStatus === false ? "No" : "")) || current.minority || "",
        disability: p.disability || (p.disabilityStatus ? "Yes" : (p.disabilityStatus === false ? "No" : "")) || current.disability || "",
        disabilityType: p.disabilityType || current.disabilityType || "",
        annualFamilyIncome: p.annualFamilyIncome ?? p.annualIncome ?? current.annualFamilyIncome ?? "",
        incomeCertificate:
          p.incomeCertificate === true || p.incomeCertificate === "Yes" || p.incomeCertificate === "Available"
            ? "Available"
            : p.incomeCertificate === false || p.incomeCertificate === "No" || p.incomeCertificate === "Not Available"
            ? "Not Available"
            : (p.incomeCertificate || current.incomeCertificate || ""),
        parentOccupation: p.parentOccupation || current.parentOccupation || "",
        educationLevel: p.educationLevel || current.educationLevel || "",
        institution: p.institution || p.college || current.institution || "",
        course: p.course || current.course || "",
        branch: p.branch || current.branch || "",
        academicYear: formatAcademicYear(p.academicYear) || current.academicYear || "",
        previousPercentage: p.previousPercentage ?? p.percentage ?? current.previousPercentage ?? "",
        currentCGPA: p.currentCGPA ?? p.cgpa ?? current.currentCGPA ?? "",
        domicileState: p.domicileState || p.state || current.domicileState || "Maharashtra",
        specialEligibility: p.specialEligibility || current.specialEligibility || "",
      }));
    } else if (user?.fullName || user?.name) {
      setForm((current) => ({
        ...current,
        fullName: user.fullName || user.name || current.fullName || "",
        state: current.state || "Maharashtra",
        domicileState: current.domicileState || "Maharashtra",
      }));
    }
  }, [user]);

  const handleAutoFillSample = () => {
    const studentName = user?.name || user?.fullName || form.fullName || "Student Name";
    setForm({
      fullName: studentName,
      dob: form.dob || "2005-06-15",
      gender: form.gender || "Male",
      state: "Maharashtra",
      district: form.district || "Pune",
      taluka: form.taluka || "Haveli",
      city: form.city || "Pune",
      areaType: form.areaType || "Urban",
      category: form.category || "OBC",
      casteCommunity: form.casteCommunity || "Kunbi",
      minority: form.minority || "No",
      disability: form.disability || "No",
      disabilityType: "",
      annualFamilyIncome: form.annualFamilyIncome || 220000,
      incomeCertificate: "Available",
      parentOccupation: form.parentOccupation || "Agriculture / Farming",
      educationLevel: form.educationLevel || "Undergraduate",
      institution: form.institution || "Government College of Engineering, Pune (COEP)",
      course: form.course || "B.Tech / Engineering",
      branch: form.branch || "Computer Science",
      academicYear: form.academicYear || "2nd Year",
      previousPercentage: form.previousPercentage || 85.5,
      currentCGPA: form.currentCGPA || 8.6,
      domicileState: "Maharashtra",
      specialEligibility: "None",
    });
    toast.success("Automatically added personal and academic matching details!");
  };

  const progress = useMemo(
    () => Math.round((currentStep / steps.length) * 100),
    [currentStep]
  );
=======
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
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571

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
<<<<<<< HEAD
      if (!String(form.fullName || "").trim()) {
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

      if (!String(form.district || "").trim()) {
        toast.error("Please enter your district.");
        return false;
      }

      if (!String(form.city || "").trim()) {
        toast.error("Please enter your city/town/village.");
=======
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
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
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
<<<<<<< HEAD
      if (
        form.annualFamilyIncome === "" ||
        form.annualFamilyIncome === null ||
        form.annualFamilyIncome === undefined ||
        Number(form.annualFamilyIncome) < 0
      ) {
        toast.error("Please enter your annual family income.");
        return false;
      }

      if (!form.incomeCertificate) {
        toast.error("Please select your income certificate status.");
        return false;
      }

      if (!String(form.parentOccupation || "").trim()) {
        toast.error("Please enter the parent/guardian occupation.");
=======
      if (!formData.annualFamilyIncome) {
        setError(
          "Please enter your annual family income."
        );
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
        return false;
      }
    }

    if (currentStep === 4) {
<<<<<<< HEAD
      if (!form.educationLevel) {
        toast.error("Please select your education level.");
        return false;
      }

      if (!String(form.institution || "").trim()) {
        toast.error("Please enter your institution.");
        return false;
      }

      if (!String(form.course || "").trim()) {
        toast.error("Please enter your course.");
        return false;
      }

      if (!form.academicYear) {
        toast.error("Please select your current academic year.");
        return false;
      }

      if (
        form.previousPercentage !== "" &&
        form.previousPercentage !== null &&
        form.previousPercentage !== undefined &&
        (Number(form.previousPercentage) < 0 ||
          Number(form.previousPercentage) > 100)
      ) {
        toast.error("Previous percentage must be between 0 and 100.");
        return false;
      }

      if (
        form.currentCGPA !== "" &&
        form.currentCGPA !== null &&
        form.currentCGPA !== undefined &&
        (Number(form.currentCGPA) < 0 || Number(form.currentCGPA) > 10)
      ) {
        toast.error("CGPA must be between 0 and 10.");
        return false;
      }
    }

    if (currentStep === 5) {
      if (!form.domicileState) {
        toast.error("Please select your domicile state.");
=======
      if (
        !formData.educationLevel ||
        !formData.course ||
        !formData.institution ||
        !formData.currentYear
      ) {
        setError(
          "Please complete the required academic information."
        );
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
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

<<<<<<< HEAD
    setLoading(true);

    try {
      const parsedYear = form.academicYear
        ? parseInt(String(form.academicYear).match(/\d+/)?.[0] || "1", 10)
        : null;

      const payload = {
        ...form,
        college: form.institution,
        institution: form.institution,
        annualIncome:
          form.annualFamilyIncome === "" || form.annualFamilyIncome === null
            ? null
            : Number(form.annualFamilyIncome),
        annualFamilyIncome:
          form.annualFamilyIncome === "" || form.annualFamilyIncome === null
            ? null
            : Number(form.annualFamilyIncome),
        previousPercentage:
          form.previousPercentage === "" || form.previousPercentage === null
            ? null
            : Number(form.previousPercentage),
        percentage:
          form.previousPercentage === "" || form.previousPercentage === null
            ? null
            : Number(form.previousPercentage),
        currentCGPA:
          form.currentCGPA === "" || form.currentCGPA === null
            ? null
            : Number(form.currentCGPA),
        cgpa:
          form.currentCGPA === "" || form.currentCGPA === null
            ? null
            : Number(form.currentCGPA),
        academicYear: parsedYear,
        incomeCertificate:
          form.incomeCertificate === "Available" ||
          form.incomeCertificate === "Yes" ||
          form.incomeCertificate === true ||
          form.incomeCertificate === "true",
        minorityStatus:
          form.minority === "Yes" ||
          form.minority === true ||
          form.minority === "true",
        disabilityStatus:
          form.disability === "Yes" ||
          form.disability === true ||
          form.disability === "true",
        dateOfBirth: form.dob || null,
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Tell us about yourself
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  We use these details to identify scholarships with relevant
                  personal and location requirements.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoFillSample}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 shadow-sm"
              >
                <Sparkles size={14} />
                <span>Auto-Fill Details</span>
              </button>
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
                {user?.email && (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Registered account email: <span className="font-semibold text-slate-600">{user.email}</span>
                  </p>
                )}
              </div>
=======
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
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571

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

<<<<<<< HEAD
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
                placeholder="e.g. Pune, Chandrapur"
                required
              />

              <TextField
                label="Taluka / Tehsil"
                name="taluka"
                value={form.taluka}
                onChange={handleChange}
                placeholder="e.g. Haveli, Chandrapur"
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
=======
  if (fetchingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-blue-500" />
          <p className="mt-4 text-sm text-slate-400">
            Loading your profile...
>>>>>>> c28c600bb8640e657e76f4102ec6c9096b22d571
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