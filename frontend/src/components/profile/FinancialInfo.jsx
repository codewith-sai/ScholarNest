import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  IndianRupee,
  Wallet,
  Receipt,
  BriefcaseBusiness,
} from "lucide-react";

const FinancialInfo = ({ profile = {}, onEdit }) => {
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

  const formatIncome = (value) => {
    if (
      value === undefined ||
      value === null ||
      String(value).trim() === ""
    ) {
      return "Not provided";
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return value;
    }

    return `₹${numericValue.toLocaleString("en-IN")}`;
  };

  const information = [
    {
      label: "Annual Family Income",
      value: formatIncome(
        profile?.annualIncome || profile?.familyIncome
      ),
      icon: IndianRupee,
    },
    {
      label: "Monthly Family Income",
      value: formatIncome(profile?.monthlyIncome),
      icon: Wallet,
    },
    {
      label: "Income Source",
      value: profile?.incomeSource,
      icon: BriefcaseBusiness,
    },
    {
      label: "Financial Status",
      value: profile?.financialStatus,
      icon: Receipt,
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
            Financial Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your financial details used for scholarship eligibility.
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

      {/* Financial Information */}
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
                  {item.value || "Not provided"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FinancialInfo;