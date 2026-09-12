"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { CaretDown } from "@/components/icons";
import { Bezel, Eyebrow } from "@/components/bezel";
import { Reveal } from "@/components/reveal";

const ITEMS = [
  {
    q: "Why does the start-up surge matter more than the average?",
    a: "Your inverter has to survive the instant a compressor or motor kicks in. A fridge that averages 63 W can pull 400 W for a moment, and a PC can spike when the GPU loads up. If the inverter cannot hold that instant, everything on the circuit drops — so the surge column is what actually decides the rating you buy.",
  },
  {
    q: "Lead-acid or lithium?",
    a: "Lead-acid is cheaper up front, but you can only cycle it to about half its nameplate before you start damaging it, and it fades within a few years. LiFePO4 costs more and lets you use 80% of the nameplate, with far more cycles. For long backup hours, lithium usually wins on cost per usable kilowatt-hour.",
  },
  {
    q: "How many sun hours should I assume?",
    a: "Bangladesh averages roughly 4 to 5 usable peak sun hours across the year. The rainy season is the real constraint, not the summer peak, so sizing around 4.5 hours and keeping some autonomy in the bank is the safer combination.",
  },
  {
    q: "Can this really run an air conditioner?",
    a: "Yes, with an inverter AC and an array sized for the daily energy it adds — that is usually the single biggest line on the list. A fixed-speed unit needs roughly three times its rated watts on start-up, which pushes you into a much larger inverter than the running load alone suggests.",
  },
  {
    q: "Is the budget figure a quote?",
    a: "No. It applies the unit rates in Assumptions to the quantities the calculator worked out, so it moves with your design and it is only as good as the rates you type in. Use it to compare options, then get real quotes.",
  },
  {
    q: "Why 12 V, 24 V or 48 V?",
    a: "Current is power divided by voltage, so doubling the voltage halves the current — thinner cable, less heat, less loss, and cheaper breakers. Small backup systems live happily at 12 V; once you are past a couple of kilovolt-amps, 48 V is where the DC side belongs.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>Questions</Eyebrow>
          <h2 className="mt-5 text-3xl leading-[1.05] sm:text-4xl">
            The things people ask before they buy.
          </h2>
        </Reveal>

        <div className="mt-10 space-y-2.5">
          {ITEMS.map((item, index) => {
            const isOpen = open === index;
            return (
              <Reveal key={item.q} delay={index * 50}>
                <Bezel tone="flat" radius="sm">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[13px] font-medium text-bone">{item.q}</span>
                    <CaretDown
                      size={15}
                      weight="light"
                      aria-hidden
                      className={cn(
                        "shrink-0 text-mute-2 transition-transform duration-700 ease-fluid",
                        isOpen && "rotate-180 text-solar",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-700 ease-fluid",
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[13px] leading-relaxed text-mute">{item.a}</p>
                    </div>
                  </div>
                </Bezel>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
