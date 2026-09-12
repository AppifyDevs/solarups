import { DEFAULT_SETTINGS } from "@/lib/calc";
import { FunctionIcon } from "@/components/icons";
import { Bezel, Eyebrow } from "@/components/bezel";
import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    title: "Add up the running load",
    formula: "running = Σ qty × watts",
    body: "Everything that draws power at the same time, at steady state.",
  },
  {
    title: "Find the start-up surge",
    formula: "surge = Σ qty × peak watts",
    body: "Compressors and motors pull several times their rating for a moment on start.",
  },
  {
    title: "Convert to daily energy",
    formula: "daily = Σ qty × watts × hours",
    body: "This is the figure the battery and the array are ultimately sized against.",
  },
  {
    title: "Size the inverter or UPS",
    formula: "VA = max(running ÷ PF × 1.25, surge ÷ PF)",
    body: `Then rounded up to the next stock rating. Power factor defaults to ${DEFAULT_SETTINGS.powerFactor}, headroom to ${DEFAULT_SETTINGS.inverterHeadroom}×.`,
  },
  {
    title: "Pick the DC system voltage",
    formula: "≤1.5 kVA → 12 V · ≤3.5 kVA → 24 V · else 48 V",
    body: "Higher voltage means lower current, thinner cable and less loss over distance.",
  },
  {
    title: "Build the battery bank",
    formula: "Ah = (running × hours) ÷ (η × DoD × volts)",
    body: `η is inverter efficiency (${Math.round(DEFAULT_SETTINGS.inverterEfficiency * 100)}%). Depth of discharge is 50% for lead-acid, 80% for LiFePO4.`,
  },
  {
    title: "Size the array",
    formula: "Wp = daily ÷ (sun hours × derate)",
    body: `${DEFAULT_SETTINGS.peakSunHours} usable sun hours and a ${Math.round(DEFAULT_SETTINGS.systemDerate * 100)}% derate cover heat, dust and wiring losses.`,
  },
];

export function Method() {
  return (
    <section id="method" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow icon={FunctionIcon}>The method</Eyebrow>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <h2 className="max-w-lg text-3xl leading-[1.05] sm:text-4xl">
              Seven formulas, written out.
            </h2>
            <p className="max-w-sm text-[13px] leading-relaxed text-mute">
              No proprietary magic. If your installer disagrees with a number, you can point at
              exactly which line drove it.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} delay={(index % 2) * 70}>
              <Bezel className="h-full" tone="flat" innerClassName="p-5">
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 font-mono text-xs tabular-nums text-solar/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-medium tracking-tight text-bone">{step.title}</h3>
                    <p className="mt-2 overflow-x-auto rounded-xl bg-ink/60 px-3 py-2 font-mono text-[11px] whitespace-nowrap tabular-nums text-solar ring-1 ring-white/[0.05]">
                      {step.formula}
                    </p>
                    <p className="mt-2.5 text-[12px] leading-relaxed text-mute">{step.body}</p>
                  </div>
                </div>
              </Bezel>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
