import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  to,
  iconClassName = "bg-purple-500/10 text-purple-400",
}) => {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-purple-500/30 hover:bg-white/[0.05]"
    >
      {/* LEFT */}
      <div className="flex min-w-0 items-center gap-4">

        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
          >
            <Icon size={21} />
          </div>
        )}

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white">
            {title}
          </h3>

          {description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600">
              {description}
            </p>
          )}
        </div>

      </div>

      {/* ARROW */}
      <div className="shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-purple-400">
        <ArrowRight size={18} />
      </div>

    </Link>
  );
};

export default QuickActionCard;