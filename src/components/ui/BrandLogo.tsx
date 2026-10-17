import React from "react";
import { Logo } from "./Logo";

export interface BrandLogoProps {
  logoUrl?: string | null;
  variant?: "default" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  logoUrl,
  variant = "default",
  size = "md",
  className,
}) => {
  if (logoUrl) {
    const height = size === "sm" ? 30 : size === "md" ? 36 : 44;
    return (
      <img
        src={logoUrl}
        alt="HRZenith Logo"
        height={height}
        className={className || "h-8 sm:h-9 w-auto object-contain"}
      />
    );
  }

  return <Logo variant={variant} size={size} className={className} />;
};
