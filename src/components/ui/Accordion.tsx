"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpen((current) => (current === index ? null : index));
    window.setTimeout(() => ScrollTrigger.refresh(), 350);
  };

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={index}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-start text-base font-semibold transition hover:text-primary md:text-lg"
            >
              {item.q}
              <ChevronDown
                size={20}
                className={`shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                }`}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-5 leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
