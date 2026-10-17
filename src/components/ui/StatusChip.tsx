import React from "react";
import clsx from "clsx";
import { Check, AlertTriangle, XCircle, Clock, Info } from "lucide-react";

export type StatusVariant = "ok" | "warn" | "danger" | "neutral" | "info";

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusVariant;
  text: string;
  icon?: "check" | "alert" | "error" | "clock" | "info" | "none";
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  text,
  icon,
  className,
  ...props
}) => {
  const styles: Record<StatusVariant, string> = {
    ok: "bg-ok-bg text-ok border-ok/20",
    warn: "bg-warn-bg text-warn border-warn/20",
    danger: "bg-danger-bg text-danger border-danger/20",
    neutral: "bg-panel text-steel border-line",
    info: "bg-brand-tint text-brand border-brand/20",
  };

  const renderIcon = () => {
    if (icon === "none") return null;
    if (icon === "check" || (!icon && status === "ok")) {
      return <Check className="w-3.5 h-3.5 shrink-0 stroke-[2]" aria-hidden="true" />;
    }
    if (icon === "alert" || (!icon && status === "warn")) {
      return (
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 stroke-[2]" aria-hidden="true" />
      );
    }
    if (icon === "error" || (!icon && status === "danger")) {
      return <XCircle className="w-3.5 h-3.5 shrink-0 stroke-[2]" aria-hidden="true" />;
    }
    if (icon === "clock") {
      return <Clock className="w-3.5 h-3.5 shrink-0 stroke-[2]" aria-hidden="true" />;
    }
    return <Info className="w-3.5 h-3.5 shrink-0 stroke-[2]" aria-hidden="true" />;
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 text-[12px] font-semibold rounded-[4px] border leading-normal select-none",
        styles[status],
        className
      )}
      {...props}
    >
      {renderIcon()}
      <span>{text}</span>
    </span>
  );
};
