import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "No data found",
  description = "There is nothing to display here.",
  icon: Icon = Inbox,
}) => {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-slate-600">
        <Icon size={28} />
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-300">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-slate-600">
        {description}
      </p>

    </div>
  );
};

export default EmptyState;