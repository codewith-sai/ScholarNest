import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Edit3, Save, X, User } from "lucide-react";

import { useProfile } from "../context/ProfileContext";

import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfo from "../components/profile/PersonalInfo";
import AcademicInfo from "../components/profile/AcademicInfo";
import FinancialInfo from "../components/profile/FinancialInfo";
import CategoryInfo from "../components/profile/CategoryInfo";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

const Profile = () => {
  const {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateProfileImage,
    clearError,
  } = useProfile();

  // Reference for the whole profile page
  const pageRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // Load Profile
  // =====================================================

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // =====================================================
  // Update Local Form
  // =====================================================

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  // =====================================================
  // Page Animation
  // =====================================================

  useEffect(() => {
    // Profile page is not rendered yet
    if (!profile || !pageRef.current) {
      return;
    }

    const sections = pageRef.current.querySelectorAll(
      ".profile-section"
    );

    // Prevent GSAP warning if sections are not available
    if (!sections.length) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sections,
        {
          opacity: 0,
          y: 15,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform,opacity",
        }
      );
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, [profile]);

  // =====================================================
  // Change Field
  // =====================================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSuccessMessage("");
    clearError();
  };

  // =====================================================
  // Save Profile
  // =====================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccessMessage("");
      clearError();

      const result = await updateProfile(formData);

      /*
       * Some context implementations return:
       * { success: true/false }
       *
       * If your context returns nothing, the save is still
       * considered successful when no error is thrown.
       */
      if (result?.success === false) {
        throw new Error(
          result?.error || "Failed to update profile."
        );
      }

      setIsEditing(false);

      setSuccessMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      console.error("PROFILE UPDATE ERROR:", err);

      setSuccessMessage("");

      if (err?.message) {
        console.error(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // Cancel Editing
  // =====================================================

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
    setSuccessMessage("");
    clearError();
  };

  // =====================================================
  // Profile Image
  // =====================================================

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);
      setSuccessMessage("");
      clearError();

      await updateProfileImage(file);

      setSuccessMessage(
        "Profile image updated successfully."
      );

      // Reload profile after image upload
      await fetchProfile();
    } catch (err) {
      console.error("PROFILE IMAGE ERROR:", err);
    } finally {
      setUploadingImage(false);

      // Reset file input
      event.target.value = "";
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading && !profile) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoadingSpinner
          size="lg"
          message="Loading profile..."
        />
      </div>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (error && !profile) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <ErrorMessage
          title="Unable to load profile"
          message={error}
          onRetry={fetchProfile}
          showRetry
        />
      </div>
    );
  }

  // =====================================================
  // No Profile
  // =====================================================

  if (!profile) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
          <User size={30} />
        </div>

        <h1 className="text-2xl font-bold text-white">
          Profile not found
        </h1>

        <p className="mt-2 text-slate-400">
          We could not find your profile.
        </p>

        <button
          type="button"
          onClick={fetchProfile}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  // =====================================================
  // Render
  // =====================================================

  return (
    <div
      ref={pageRef}
      className="mx-auto max-w-6xl pb-10"
    >
      {/* =================================================
          Page Header
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage your personal information and
            scholarship eligibility details.
          </p>
        </div>

        {/* =========================
            Actions
        ========================= */}

        {!isEditing ? (
          <button
            type="button"
            onClick={() => {
              setFormData(profile);
              setIsEditing(true);
              setSuccessMessage("");
              clearError();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Edit3 size={17} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* =================================================
          Success Message
      ================================================= */}

      {successMessage && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-sm font-medium text-emerald-300">
          {successMessage}
        </div>
      )}

      {/* =================================================
          Error Message
      ================================================= */}

      {error && profile && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onRetry={fetchProfile}
            showRetry
          />
        </div>
      )}

      {/* =================================================
          Profile Header
      ================================================= */}

      <div className="profile-section mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <ProfileHeader
          profile={profile}
          onEdit={() => {
            setFormData(profile);
            setIsEditing(true);
            setSuccessMessage("");
          }}
          onImageChange={handleImageChange}
        />

        {uploadingImage && (
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400/30 border-t-blue-400" />

            Uploading profile image...
          </div>
        )}
      </div>

      {/* =================================================
          Personal Information
      ================================================= */}

      <div className="profile-section mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <PersonalInfo
          profile={
            isEditing
              ? formData
              : profile
          }
          onEdit={
            isEditing
              ? handleChange
              : undefined
          }
        />
      </div>

      {/* =================================================
          Academic Information
      ================================================= */}

      <div className="profile-section mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <AcademicInfo
          profile={
            isEditing
              ? formData
              : profile
          }
          onEdit={
            isEditing
              ? handleChange
              : undefined
          }
        />
      </div>

      {/* =================================================
          Financial Information
      ================================================= */}

      <div className="profile-section mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <FinancialInfo
          profile={
            isEditing
              ? formData
              : profile
          }
          onEdit={
            isEditing
              ? handleChange
              : undefined
          }
        />
      </div>

      {/* =================================================
          Category Information
      ================================================= */}

      <div className="profile-section rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <CategoryInfo
          profile={
            isEditing
              ? formData
              : profile
          }
          onEdit={
            isEditing
              ? handleChange
              : undefined
          }
        />
      </div>

      {/* =================================================
          Bottom Save
      ================================================= */}

      {isEditing && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            <X size={17} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;