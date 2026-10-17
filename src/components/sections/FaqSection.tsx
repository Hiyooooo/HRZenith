"use client";

import React, { useState } from "react";
import { SectionShell } from "@/components/ui/SectionShell";
import { FAQ_ITEMS } from "@/lib/data";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first question

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <SectionShell
      id="faq"
      number="8.0"
      title="Pertanyaan dari tim keamanan dan pengadaan."
      description="Jawaban terhadap parameter evaluasi kepatuhan informasi, arsitektur data, dan skema pengadaan korporasi."
      bg="paper"
    >
      {/* KLAIM: jawaban 1, 3, 4, 5, 6 perlu dikonfirmasi pemilik/engineering */}
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `faq-btn-${item.id}`;
          const contentId = `faq-content-${item.id}`;

          return (
            <div
              key={item.id}
              className="border border-line rounded-[4px] overflow-hidden bg-paper transition-colors"
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-[15px] sm:text-[16px] text-ink hover:bg-canvas transition-colors select-none focus-visible:outline-brand"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-[12px] text-steel font-normal">
                      0{index + 1}.
                    </span>
                    <span>{item.question}</span>
                  </span>
                  <ChevronDown
                    className={clsx(
                      "w-4 h-4 text-steel shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180 text-brand"
                    )}
                    aria-hidden="true"
                  />
                </button>
              </h3>

              {isOpen && (
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-5 pb-5 pt-1 text-[14px] text-ink-2 leading-relaxed border-t border-line/40 bg-canvas/30"
                >
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
};
