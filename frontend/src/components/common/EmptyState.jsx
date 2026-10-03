import { useEffect } from "react";
import { Inbox } from "lucide-react";
import gsap from "gsap";

const EmptyState = ({
  title = "No data found",
  message = "There is nothing to display here.",
  buttonText,
  onAction,
  icon: Icon = Inbox,
}) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".empty-state",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        ".empty-state-icon",
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          delay: 0.15,
          ease: "back.out(1.7)",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="empty-state flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-12 text-center">
      {/* Icon */}
      <div className="empty-state-icon flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
        <Icon size={30} strokeWidth={1.8} />
      </div>

      {/* Title */}
      <h2 className="mt-5 text-xl font-semibold text-white">
        {title}
      </h2>

      {/* Message */}
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {message}
      </p>

      {/* Action */}
      {buttonText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;