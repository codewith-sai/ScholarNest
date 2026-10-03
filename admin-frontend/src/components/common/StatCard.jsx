import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

const StatCard = ({
  title,
  value = 0,
  description,
  icon: Icon,
  iconClassName = "bg-purple-500/10 text-purple-400",
  trend,
  trendLabel,
}) => {
  const hasTrend =
    trend !== undefined &&
    trend !== null &&
    trend !== "";

  const numericTrend = Number(trend);

  const isPositive =
    hasTrend && numericTrend > 0;

  const isNegative =
    hasTrend && numericTrend < 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]">

      {/* TOP */}

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h2>
        </div>

        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
          >
            <Icon size={21} />
          </div>
        )}

      </div>

      {/* BOTTOM */}

      <div className="mt-4 flex min-h-[24px] items-center gap-2">

        {hasTrend ? (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              isPositive
                ? "text-emerald-400"
                : isNegative
                ? "text-red-400"
                : "text-slate-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={14} />
            ) : isNegative ? (
              <ArrowDownRight size={14} />
            ) : (
              <Minus size={14} />
            )}

            {Math.abs(numericTrend)}%
          </span>
        ) : null}

        {trendLabel && (
          <span className="text-xs text-slate-600">
            {trendLabel}
          </span>
        )}

        {!hasTrend && description && (
          <span className="text-xs text-slate-600">
            {description}
          </span>
        )}

      </div>

    </div>
  );
};

export default StatCard;