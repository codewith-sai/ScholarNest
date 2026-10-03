import {
  CheckCircle,
  XCircle,
  Clock3,
  Eye,
  FileText,
  AlertCircle,
} from "lucide-react";

const StatusBadge = ({
  status = "pending",
}) => {
  const normalizedStatus = String(
    status
  ).toLowerCase();

  const statusConfig = {
    approved: {
      label: "Approved",
      className:
        "bg-emerald-500/10 text-emerald-400",
      icon: CheckCircle,
    },

    rejected: {
      label: "Rejected",
      className:
        "bg-red-500/10 text-red-400",
      icon: XCircle,
    },

    pending: {
      label: "Pending",
      className:
        "bg-yellow-500/10 text-yellow-400",
      icon: Clock3,
    },

    under_review: {
      label: "Under Review",
      className:
        "bg-blue-500/10 text-blue-400",
      icon: Eye,
    },

    saved: {
      label: "Saved",
      className:
        "bg-purple-500/10 text-purple-400",
      icon: FileText,
    },

    active: {
      label: "Active",
      className:
        "bg-emerald-500/10 text-emerald-400",
      icon: CheckCircle,
    },

    inactive: {
      label: "Inactive",
      className:
        "bg-red-500/10 text-red-400",
      icon: XCircle,
    },
  };

  const config =
    statusConfig[normalizedStatus] || {
      label:
        normalizedStatus
          .replace(/_/g, " ")
          .replace(
            /\b\w/g,
            (char) => char.toUpperCase()
          ),
      className:
        "bg-slate-500/10 text-slate-400",
      icon: AlertCircle,
    };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon size={13} />

      {config.label}
    </span>
  );
};

export default StatusBadge;