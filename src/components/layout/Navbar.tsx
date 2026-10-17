import React from "react";
import type { SiteConfig } from "@/lib/cms/types";
import { NavbarShell } from "./NavbarShell";

export interface NavbarProps {
  config: SiteConfig;
}

export const Navbar: React.FC<NavbarProps> = ({ config }) => {
  return (
    <NavbarShell
      logoUrl={config.branding.logoUrl}
      ctaText={config.hero.ctaText}
      email={config.contact.email}
    />
  );
};
