import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "primary-on-brand"
  | "secondary-on-brand"
  | "outline"
  | "text";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  href?: string;
  target?: string;
  rel?: string;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      variant = "primary",
      href,
      target,
      rel,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center text-center font-semibold text-[14px] sm:text-[15px] leading-snug transition-colors duration-150 rounded-[4px] min-h-[44px] px-5 select-none disabled:opacity-50 disabled:pointer-events-none";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-brand text-on-brand hover:bg-brand-hover focus-visible:outline-ink",
      secondary:
        "bg-paper border-[1.5px] border-brand text-brand hover:bg-brand-tint focus-visible:outline-ink",
      "primary-on-brand":
        "bg-paper text-brand hover:bg-white/90 focus-visible:outline-white",
      "secondary-on-brand":
        "border-[1.5px] border-white text-white hover:bg-white/12 focus-visible:outline-white",
      outline:
        "bg-paper border border-line text-ink hover:bg-canvas focus-visible:outline-ink",
      text: "bg-transparent text-brand underline underline-offset-[3px] decoration-1 hover:text-brand-hover p-0 min-h-0 focus-visible:outline-brand",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      fullWidth && "w-full",
      className
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          className={combinedClassName}
          aria-disabled={disabled}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={combinedClassName}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
