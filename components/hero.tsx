import { APPLIANCES } from "@/lib/appliances";
import { compute, DEFAULT_SETTINGS, defaultLoads } from "@/lib/calc";
import { energy, num, watts } from "@/lib/format";
import {
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Gauge,
  Lightning,
  SunHorizon,
} from "@/components/icons";
import { Bezel, Eyebrow } from "@/components/bezel";

export function Hero() {
  const demo = compute(defaultLoads(), DEFAULT_SETTINGS);

  const outputs = [
    {
      icon: Lightning,
      label: "Inverter",
      value: `${num(demo.recommendedVA / 1000, 2)} kVA`,
      note: `carries ${watts(demo.surgeW)} of start-up surge`,
    },
    {
      icon: BatteryCharging,
      label: "Battery",
      value: `${demo.systemVoltage} V · ${num(demo.installedBankAh)} Ah`,
      note: `${demo.batteryCount} modules, ${num(demo.runtimeHours, 1)} h at full load`,
    },
    {
      icon: SunHorizon,
      label: "Array",
      value: `${num(demo.installedWp / 1000, 2)} kWp`,
      note: `${demo.panelCount} panels covering ${Math.min(100, Math.round(demo.coverage * 100))}% of daily use`,
    },
    {
      icon: Gauge,
      label: "Daily energy",
      value: energy(demo.dailyWh),
      note: `${num(demo.dailyWh * 30 / 1000, 0)} kWh across a month`,
    },
  ];

  return (
    <section id="top" className="relative px-4 pt-32 pb-16 sm:px-6 sm:pt-40 lg:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Eyebrow icon={Lightning}>Solar · UPS · Sizing</Eyebrow>

          <h1 className="mt-6 text-[clamp(2.5rem,7.4vw,4.6rem)] leading-[0.95] tracking-[-0.04em] text-bone">
            Size your solar and UPS{" "}
            <span className="text-glow text-solar">from the load up.</span>
          </h1>

          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-bone/80">
            Add your appliances and get the running load, the start-up surge, the battery bank, the
            array and a rough budget. Every formula is shown, so nothing is a black box.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#calculator"
              className="group/btn flex items-center gap-2.5 rounded-full bg-solar py-2.5 pr-2.5 pl-6 text-sm font-medium text-ink transition-transform duration-500 ease-fluid active:scale-[0.97]"
            >
              Start the calculator
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/12 transition-transform duration-500 ease-fluid group-hover/btn:translate-x-1 group-hover/btn:-translate-y-px group-hover/btn:scale-105">
                <ArrowRight size={14} weight="light" aria-hidden />
              </span>
            </a>
            <a
              href="#method"
              className="group/btn2 flex items-center gap-2 rounded-full bg-white/[0.05] py-2.5 pr-2.5 pl-5 text-sm text-bone ring-1 ring-white/[0.08] transition-colors duration-500 ease-fluid hover:bg-white/[0.09]"
            >
              See the method
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] transition-transform duration-500 ease-fluid group-hover/btn2:translate-x-1 group-hover/btn2:-translate-y-px">
                <ArrowUpRight size={13} weight="light" aria-hidden />
              </span>
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-2 gap-x-6 gap-y-5 border-t border-white/[0.07] pt-8">
            {[
              { term: String(APPLIANCES.length), detail: "appliances in the built-in library" },
              { term: "Surge-aware", detail: "motor inrush, not just averages" },
              { term: "7 lines", detail: "of arithmetic, all shown below" },
              { term: "Local", detail: "your list never leaves the browser" },
            ].map((item) => (
              <div key={item.term}>
                <dt className="font-display text-lg tracking-tight text-bone">{item.term}</dt>
                <dd className="mt-0.5 text-[11px] leading-snug text-mute-2">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-6 lg:pl-4">
          <Bezel
            tone="solar"
            className="shadow-[0_60px_120px_-60px_var(--brand-shadow)]"
            innerClassName="p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Eyebrow>Worked example</Eyebrow>
                <p className="mt-3 max-w-[15rem] text-[12px] leading-relaxed text-bone/60">
                  The seven-appliance home from the reference table, run through the same engine the
                  calculator uses.
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-ink/50 px-3 py-1 font-mono text-[10px] text-solar ring-1 ring-solar/20">
                live
              </span>
            </div>

            <div className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-white/[0.06] sm:grid-cols-2">
              {outputs.map((output) => (
                <div key={output.label} className="bg-ink-2/90 px-4 py-4">
                  <span className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-mute-2 uppercase">
                    <output.icon size={12} weight="light" aria-hidden />
                    {output.label}
                  </span>
                  <span className="mt-2 block font-mono text-lg leading-none tabular-nums text-bone">
                    {output.value}
                  </span>
                  <span className="mt-1.5 block text-[10px] leading-snug text-mute-2">
                    {output.note}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.07] pt-5">
              <span className="font-mono text-[11px] tabular-nums text-mute">
                running <span className="text-bone">{watts(demo.runningW)}</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums text-mute">
                surge <span className="text-solar">{watts(demo.surgeW)}</span>
              </span>
              <span className="font-mono text-[11px] tabular-nums text-mute">
                load <span className="text-bone">{num(demo.utilization * 100)}%</span>
              </span>
            </div>
          </Bezel>
        </div>
      </div>
    </section>
  );
}
