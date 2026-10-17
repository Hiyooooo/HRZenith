import React from "react";
import clsx from "clsx";

export type BadgeVariant = "default" | "brand" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  className,
  children,
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-panel text-steel border border-line",
    brand: "bg-brand-tint text-brand border border-brand/20",
    outline: "bg-transparent text-steel border border-line",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wider rounded-[4px] leading-none",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
