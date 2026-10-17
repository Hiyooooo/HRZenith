import React from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { ModuleTabs } from "@/components/modules/ModuleTabs";

export const ModulesSection: React.FC = () => {
  return (
    <SectionShell
      id="modul"
      number="3.0"
      title="Lima modul, satu standar tata kelola."
      description="Perizinan menjadi poros: persetujuan mengalir ke Absensi, Gaji, dan arsip dokumen resmi."
      bg="paper"
    >
      <ModuleTabs />
    </SectionShell>
  );
};
