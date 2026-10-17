import React from "react";
import clsx from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  header,
  headerClassName,
  bodyClassName,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "bg-paper border border-line rounded-[4px] overflow-hidden",
        className
      )}
      {...props}
    >
      {header && (
        <div
          className={clsx(
            "bg-panel border-b border-line px-5 py-3.5 text-[15px] font-semibold text-ink",
            headerClassName
          )}
        >
          {header}
        </div>
      )}
      <div className={clsx("p-5 sm:p-6", bodyClassName)}>{children}</div>
    </div>
  );
};
