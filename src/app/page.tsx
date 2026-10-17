import React from "react";
import { getSiteConfig } from "@/lib/cms/get-site-config";
import { buildJsonLd } from "@/lib/schema";
import { Hero } from "@/components/sections/Hero";
import { PartnerStrip } from "@/components/sections/PartnerStrip";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { AuditFlowSection } from "@/components/sections/AuditFlowSection";
import { ModulesSection } from "@/components/sections/ModulesSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { EditionsSection } from "@/components/sections/EditionsSection";
import { RoadmapSection } from "@/components/sections/RoadmapSection";
import { CaseStudiesSection } from "@/components/sections/CaseStudiesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export default async function HomePage() {
  const config = await getSiteConfig();
  const jsonLd = buildJsonLd(config);

  return (
    <>
      {/* Schema Markup JSON-LD (Satu-satunya pengecualian sah dangerouslySetInnerHTML) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Hero config={config} />
      <PartnerStrip />
      <SecuritySection />
      <AuditFlowSection />
      <ModulesSection />
      <ComparisonSection />
      <EditionsSection email={config.contact.email} />
      <RoadmapSection />
      <CaseStudiesSection />
      <FaqSection />
      <FinalCtaSection config={config} />
    </>
  );
}
