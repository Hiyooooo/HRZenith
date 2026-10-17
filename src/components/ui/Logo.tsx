import React from "react";
import clsx from "clsx";

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  variant = "default",
  size = "md",
  className,
  ...props
}) => {
  const isLight = variant === "light";
  const iconColor = isLight ? "white" : "var(--brand)";
  const textColor = isLight ? "white" : "var(--ink)";
  const accentColor = "var(--steel)";

  const dimensions = {
    sm: { width: 130, height: 30, iconSize: 22 },
    md: { width: 156, height: 36, iconSize: 26 },
    lg: { width: 190, height: 44, iconSize: 32 },
  };

  const dim = dimensions[size];

  return (
    <div
      className={clsx("inline-flex items-center gap-2.5 select-none", className)}
      role="img"
      aria-label="HRZenith Logo"
    >
      <svg
        width={dim.iconSize}
        height={dim.iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
      >
        <rect
          width="32"
          height="32"
          rx="4"
          fill={iconColor}
        />
        <path
          d="M16 6L24 10.5V17C24 21.5 20.5 25.5 16 27C11.5 25.5 8 21.5 8 17V10.5L16 6Z"
          stroke={isLight ? "var(--brand)" : "white"}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M16 11V21"
          stroke={isLight ? "var(--brand)" : "white"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 16H20"
          stroke={isLight ? "var(--brand)" : "white"}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex items-baseline font-bold tracking-tight" style={{ color: textColor }}>
        <span className="text-[19px] sm:text-[21px] tracking-[-0.02em]">HRZenith</span>
        <span
          className="ml-1 text-[11px] font-semibold uppercase tracking-[0.08em] px-1 py-0.5 rounded-[2px]"
          style={{
            backgroundColor: isLight ? "rgba(255,255,255,0.15)" : "var(--panel)",
            color: accentColor,
          }}
        >
          ENTERPRISE
        </span>
      </span>
    </div>
  );
};
