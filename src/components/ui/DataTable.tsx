import React from "react";
import clsx from "clsx";

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  caption?: string;
  hideCaption?: boolean;
  wrapperClassName?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  caption,
  hideCaption = true,
  wrapperClassName,
  className,
  children,
  ...props
}) => {
  return (
    <div
      role="region"
      aria-label={caption || "Tabel data"}
      tabIndex={0}
      className={clsx(
        "w-full overflow-x-auto table-scrollbar border border-line rounded-[4px] bg-paper focus-visible:outline-brand",
        wrapperClassName
      )}
      {...props}
    >
      <table className={clsx("w-full text-left text-[14px] border-collapse", className)}>
        {caption && (
          <caption className={clsx(hideCaption ? "sr-only" : "p-3 text-left font-semibold text-ink bg-panel")}>
            {caption}
          </caption>
        )}
        {children}
      </table>
    </div>
  );
};
