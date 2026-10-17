import React from "react";
import clsx from "clsx";

export interface SectionShellProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  number: string;
  title: string;
  description?: string;
  badge?: string;
  bg?: "canvas" | "paper" | "panel";
}

export const SectionShell: React.FC<SectionShellProps> = ({
  id,
  number,
  title,
  description,
  badge,
  bg = "canvas",
  className,
  children,
  ...props
}) => {
  const bgStyles = {
    canvas: "bg-canvas",
    paper: "bg-paper",
    panel: "bg-panel",
  };

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={clsx(
        "py-14 lg:py-22 border-b border-line relative",
        bgStyles[bg],
        className
      )}
      {...props}
    >
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Rel Kiri (Sticky pada Desktop) */}
          <div className="lg:col-span-3 lg:sticky lg:top-[96px] space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] font-medium tracking-[0.08em] text-brand uppercase">
                {number}
              </span>
              {badge && (
                <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wider uppercase rounded-[2px] bg-brand-tint text-brand">
                  {badge}
                </span>
              )}
            </div>
            <h2
              id={`${id}-heading`}
              className="text-[24px] sm:text-[28px] font-bold text-ink leading-[1.2] tracking-[-0.015em]"
            >
              {title}
            </h2>
            {description && (
              <p className="text-[14px] text-steel leading-[1.6]">
                {description}
              </p>
            )}
          </div>

          {/* Konten Kanan (9 Kolom) */}
          <div className="lg:col-span-9 min-w-0 space-y-8">{children}</div>
        </div>
      </div>
    </section>
  );
};
