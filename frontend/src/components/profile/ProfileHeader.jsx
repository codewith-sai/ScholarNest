import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Camera, Mail, MapPin, User } from "lucide-react";

const ProfileHeader = ({
  profile = {},
  onEdit,
  onImageChange,
}) => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const progressBar = progressRef.current;

    if (!container) return;

    const timeline = gsap.timeline();

    timeline.fromTo(
      container,
      {
        opacity: 0,
        y: 25,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      }
    );

    if (progressBar) {
      timeline.fromTo(
        progressBar,
        {
          width: "0%",
        },
        {
          width: `${getProfileCompletion(profile)}%`,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }

    return () => {
      timeline.kill();
    };
  }, [profile]);

  const getProfileCompletion = (data) => {
    const fields = [
      data?.name,
      data?.email,
      data?.phone,
      data?.education,
      data?.course,
      data?.category,
      data?.annualIncome,
      data?.state,
      data?.district,
    ];

    const completedFields = fields.filter(
      (field) =>
        field !== undefined &&
        field !== null &&
        String(field).trim() !== ""
    ).length;

    return Math.round(
      (completedFields / fields.length) * 100
    );
  };

  const completion = getProfileCompletion(profile);

  const getInitials = () => {
    if (!profile?.name) return "U";

    return profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <section
      ref={containerRef}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Cover */}
      <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 sm:h-36" />

      {/* Profile Content */}
      <div className="px-5 pb-6 sm:px-7">
        <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar */}
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-indigo-100 text-2xl font-bold text-indigo-600 shadow-md sm:h-28 sm:w-28">
              {profile?.profileImage || profile?.avatar ? (
                <img
                  src={profile.profileImage || profile.avatar}
                  alt={profile?.name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials()
              )}
            </div>

            {/* Image Upload */}
            {onImageChange && (
              <label
                className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-md transition hover:bg-indigo-700"
                title="Change profile picture"
              >
                <Camera size={15} />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageChange}
                />
              </label>
            )}
          </div>

          {/* Edit Button */}
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="w-fit rounded-lg border border-indigo-200 px-5 py-2.5 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 active:scale-95"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Basic Information */}
        <div className="mt-4">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {profile?.name || "Student Name"}
          </h1>

          <div className="mt-2 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            {profile?.email && (
              <div className="flex items-center gap-1.5">
                <Mail size={15} />
                <span>{profile.email}</span>
              </div>
            )}

            {(profile?.state || profile?.district) && (
              <div className="flex items-center gap-1.5">
                <MapPin size={15} />

                <span>
                  {[profile.district, profile.state]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}

            {profile?.course && (
              <div className="flex items-center gap-1.5">
                <User size={15} />
                <span>{profile.course}</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Profile Completion
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Complete your profile to get better scholarship
                recommendations.
              </p>
            </div>

            <span className="text-sm font-bold text-indigo-600">
              {completion}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              ref={progressRef}
              className="h-full rounded-full bg-indigo-600"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;