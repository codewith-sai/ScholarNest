import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Mail,
  Save,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import gsap from "gsap";

import { useProfile } from "../context/ProfileContext";

const Settings = () => {
  const navigate = useNavigate();

  const { profile, loading, updateProfile } = useProfile();

  const [formData, setFormData] = useState({
    emailNotifications: true,
    applicationUpdates: true,
    scholarshipAlerts: true,
    deadlineReminders: true,
    marketingEmails: false,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    gsap.fromTo(
      ".settings-section",
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, []);

  useEffect(() => {
    if (!profile) return;

    setFormData((prev) => ({
      ...prev,
      emailNotifications:
        profile.emailNotifications ?? true,
      applicationUpdates:
        profile.applicationUpdates ?? true,
      scholarshipAlerts:
        profile.scholarshipAlerts ?? true,
      deadlineReminders:
        profile.deadlineReminders ?? true,
      marketingEmails:
        profile.marketingEmails ?? false,
    }));
  }, [profile]);

  const handleChange = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    setSuccess("");
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const result = await updateProfile(formData);

      if (!result?.success) {
        setError(
          result?.error || "Failed to save settings."
        );
        return;
      }

      setSuccess("Settings saved successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      setError(
        err?.message || "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  };

  const settingsGroups = [
    {
      title: "Notifications",
      description:
        "Choose which notifications you want to receive.",
      icon: Bell,
      settings: [
        {
          key: "emailNotifications",
          title: "Email Notifications",
          description:
            "Receive important account and platform notifications through email.",
        },
        {
          key: "applicationUpdates",
          title: "Application Updates",
          description:
            "Get notified when your scholarship application status changes.",
        },
        {
          key: "scholarshipAlerts",
          title: "Scholarship Alerts",
          description:
            "Receive notifications about new scholarships matching your profile.",
        },
        {
          key: "deadlineReminders",
          title: "Deadline Reminders",
          description:
            "Get reminders before important scholarship application deadlines.",
        },
        {
          key: "marketingEmails",
          title: "Platform Updates",
          description:
            "Receive occasional updates about new ScholarNet features and services.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="settings-section mb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
            <SettingsIcon size={14} />
            Account Settings
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Manage your ScholarNet notification preferences and
            account settings.
          </p>
        </div>

        {/* Account Overview */}
        <div className="settings-section mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <User size={21} />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold">
                Account Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your account information is managed by the backend.
              </p>

              {profile?.email && (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                  <Mail size={16} className="text-slate-500" />
                  <span className="truncate">
                    {profile.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="settings-section mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Shield size={21} />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold">
                Security
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Password changes, authentication, sessions, and
                account authorization are handled by the backend.
              </p>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <User size={16} />
                Manage Profile
              </button>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        {settingsGroups.map((group) => {
          const GroupIcon = group.icon;

          return (
            <div
              key={group.title}
              className="settings-section mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="border-b border-white/10 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <GroupIcon size={19} />
                  </div>

                  <div>
                    <h2 className="font-semibold">
                      {group.title}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      {group.description}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                {group.settings.map((setting, index) => (
                  <div
                    key={setting.key}
                    className={`flex items-center justify-between gap-5 p-5 ${
                      index !== group.settings.length - 1
                        ? "border-b border-white/5"
                        : ""
                    }`}
                  >
                    <div>
                      <h3 className="text-sm font-medium text-slate-200">
                        {setting.title}
                      </h3>

                      <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                        {setting.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={formData[setting.key]}
                      onClick={() =>
                        handleChange(setting.key)
                      }
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                        formData[setting.key]
                          ? "bg-blue-600"
                          : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                          formData[setting.key]
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Feedback */}
        {success && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            <CheckCircle2 size={18} />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Save */}
        <div className="settings-section flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;