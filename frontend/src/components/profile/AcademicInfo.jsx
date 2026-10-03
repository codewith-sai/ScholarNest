import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  GraduationCap,
  BookOpen,
  Building2,
  Award,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

const AcademicInfo = ({ profile = {}, onEdit }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const animation = gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  const information = [
    {
      label: "Education Level",
      value: profile?.educationLevel,
      icon: GraduationCap,
    },
    {
      label: "Course",
      value: profile?.course,
      icon: BookOpen,
    },
    {
      label: "Branch / Stream",
      value: profile?.branch,
      icon: BookOpen,
    },
    {
      label: "Institution",
      value: profile?.institution,
      icon: Building2,
    },
    {
      label: "Current Year",
      value: profile?.currentYear,
      icon: CalendarDays,
    },
    {
      label: "Academic Performance",
      value: profile?.academicPerformance,
      icon: TrendingUp,
    },
    {
      label: "CGPA / Percentage",
      value: profile?.cgpa || profile?.percentage,
      icon: Award,
    },
  ];

  return (
    <section
      ref={cardRef}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Academic Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your education and academic details.
          </p>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 active:scale-95"
          >
            Edit
          </button>
        )}
      </div>

      {/* Academic Information */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {information.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <Icon size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400">
                  {item.label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-gray-800">
                  {item.value !== undefined &&
                  item.value !== null &&
                  String(item.value).trim() !== ""
                    ? item.value
                    : "Not provided"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default AcademicInfo;