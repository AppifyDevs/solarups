"use client";

import { Fragment } from "react";
import type { Result, Settings } from "@/lib/calc";
import { DEFAULT_SETTINGS } from "@/lib/calc";
import { cn } from "@/lib/cn";
import { energy, money, num, watts } from "@/lib/format";
import {
  APPLIANCE_ICONS,
  ArrowRight,
  BatteryCharging,
  ChartLine,
  Check,
  Gauge,
  Info,
  Lightning,
  SolarPanel,
  SunHorizon,
  Warning,
  WaveSine,
} from "@/components/icons";
import { Bezel, Eyebrow } from "@/components/bezel";
import { CardHead, Meter, Stat } from "@/components/studio/parts";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

function va(value: number): { value: string; unit: string } {
  if (value >= 1000) return { value: num(value / 1000, 2), unit: "kVA" };
  return { value: num(value), unit: "VA" };
}

function wp(value: number): { value: string; unit: string } {
  if (value >= 1000) return { value: num(value / 1000, 2), unit: "kWp" };
  return { value: num(value), unit: "Wp" };
}

const TONE_RING = {
  info: "text-volt",
  warn: "text-solar",
  good: "text-good",
};

const TONE_ICON = {
  info: Info,
  warn: Warning,
  good: Check,
};

function Insights({ result }: { result: Result }) {
  if (result.insights.length === 0) return null;
  return (
    <ul className="mt-4 space-y-2">
      {result.insights.map((insight, index) => {
        const Icon = TONE_ICON[insight.tone];
        return (
          <li
            key={index}
            className="flex items-start gap-2.5 rounded-2xl bg-ink/40 px-3 py-2.5 ring-1 ring-white/[0.05]"
          >
            <Icon
              size={13}
              weight="light"
              aria-hidden
              className={cn("mt-0.5 shrink-0", TONE_RING[insight.tone])}
            />
            <span className="text-[12px] leading-relaxed text-bone/85">{insight.text}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function VerdictCard({ result, settings }: { result: Result; settings: Settings }) {
  const inverter = va(result.recommendedVA);
  const array = wp(result.installedWp);
  const hasLoad = result.runningW > 0;
  const runtimeTone = result.runtimeHours >= settings.autonomyHours ? "text-good" : "text-solar";

  return (
    <Bezel tone="solar" className="shadow-[0_30px_80px_-40px_rgba(34,197,94,0.35)]">
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <Eyebrow icon={Lightning}>Recommended system</Eyebrow>
          <span className="font-mono text-[10px] text-mute-2">
            {result.voltageAuto ? "auto voltage" : `${result.systemVoltage} V fixed`}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6">
          <Stat
            label="Inverter / UPS"
            value={hasLoad ? inverter.value : "—"}
            unit={hasLoad ? inverter.unit : undefined}
            sub={hasLoad ? `${Math.round(result.utilization * 100)}% loaded at run` : "add a load"}
            tone="solar"
          />
          <Stat
            label="Battery bank"
            value={hasLoad ? num(result.installedBankAh) : "—"}
            unit={hasLoad ? "Ah" : undefined}
            sub={`${result.systemVoltage} V · ${result.batteryCount} × ${settings.moduleAh} Ah`}
          />
          <Stat
            label="Solar array"
            value={hasLoad ? array.value : "—"}
            unit={hasLoad ? array.unit : undefined}
            sub={`${result.panelCount} × ${settings.panelWatt} W panels`}
          />
          <Stat
            label="Rough budget"
            value={hasLoad ? money(result.costTotal, settings.currency) : "—"}
            sub="at your editable rates"
          />
        </div>

        <div className="mt-5 rounded-2xl bg-ink/50 px-3.5 py-3 ring-1 ring-white/[0.06]">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11px] tracking-[0.1em] text-mute uppercase">
              Backup at full load
            </span>
            <span className={cn("font-mono text-sm tabular-nums", runtimeTone)}>
              ≈ {num(result.runtimeHours, 1)} h
            </span>
          </div>
          <Meter
            className="mt-2.5"
            value={
              settings.autonomyHours > 0 ? result.runtimeHours / settings.autonomyHours : 0
            }
            tone={result.runtimeHours >= settings.autonomyHours ? "good" : "solar"}
          />
          <p className="mt-2 text-[11px] leading-snug text-mute-2">
            Sized for {settings.autonomyHours} h of autonomy on a{" "}
            {settings.chemistry === "lead" ? "lead-acid" : "LiFePO4"} bank.
          </p>
        </div>

        <Insights result={result} />
      </div>
    </Bezel>
  );
}

function FlowStrip({ result, settings }: { result: Result; settings: Settings }) {
  const nodes = [
    {
      label: "Load",
      value: watts(result.runningW),
      sub: `${watts(result.surgeW)} start`,
      icon: WaveSine,
    },
    {
      label: "Inverter",
      value: `${va(result.recommendedVA).value} ${va(result.recommendedVA).unit}`,
      sub: `${Math.round(settings.powerFactor * 100)}% PF`,
      icon: Lightning,
    },
    {
      label: "Battery",
      value: `${result.systemVoltage} V ${num(result.installedBankAh)} Ah`,
      sub: `${result.batteryCount} modules`,
      icon: BatteryCharging,
    },
    {
      label: "Array",
      value: `${wp(result.installedWp).value} ${wp(result.installedWp).unit}`,
      sub: `${result.panelCount} panels`,
      icon: SolarPanel,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 lg:flex lg:items-stretch">
      {nodes.map((node, index) => (
        <Fragment key={node.label}>
          <div className="min-w-0 flex-1 rounded-2xl bg-white/[0.025] px-3 py-3 ring-1 ring-white/[0.05]">
            <span className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-mute-2 uppercase">
              <node.icon size={12} weight="light" aria-hidden />
              {node.label}
            </span>
            <span className="mt-1.5 block truncate font-mono text-sm tabular-nums text-bone">
              {node.value}
            </span>
            <span className="block truncate font-mono text-[10px] text-mute-2">{node.sub}</span>
          </div>
          {index < nodes.length - 1 ? (
            <ArrowRight
              size={14}
              weight="light"
              aria-hidden
              className="hidden shrink-0 self-center text-mute-2 lg:block"
            />
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  tone?: "solar" | "bone";
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className={cn("text-[12px]", strong ? "text-bone" : "text-mute")}>{label}</span>
      <span
        className={cn(
          "font-mono tabular-nums",
          strong ? "text-sm text-bone" : "text-[12px] text-bone/80",
          tone === "solar" && "text-solar",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function InverterCard({ result, settings }: { result: Result; settings: Settings }) {
  return (
    <Bezel className="lg:col-span-4">
      <div className="p-5">
        <CardHead
          icon={Lightning}
          title="Inverter / UPS"
          meta={`${Math.round(settings.inverterEfficiency * 100)}% eff.`}
        />

        <div className="mt-5">
          <span className="block text-[10px] tracking-[0.16em] text-mute-2 uppercase">
            Recommended rating
          </span>
          <span className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl leading-none tabular-nums text-solar">
              {va(result.recommendedVA).value}
            </span>
            <span className="text-sm text-mute">{va(result.recommendedVA).unit}</span>
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11px] text-mute">Load on the inverter</span>
            <span className="font-mono text-[11px] tabular-nums text-bone/80">
              {Math.round(result.utilization * 100)}%
            </span>
          </div>
          <Meter className="mt-2" value={result.utilization} />
        </div>

        <div className="mt-4 border-t border-white/[0.06] pt-2">
          <Row label="Running load" value={watts(result.runningW)} />
          <Row label="Start-up surge" value={watts(result.surgeW)} />
          <Row label="Continuous demand" value={`${num(result.continuousVA)} VA`} />
          <Row label="Surge demand" value={`${num(result.surgeVA)} VA`} />
          <Row
            label="Surge-safe rating"
            value={`${num(result.requiredVA)} VA`}
            strong
            tone="solar"
          />
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-mute-2">
          The rating carries the worst-case simultaneous start without leaning on short-term surge
          headroom. Sequence your big motor loads and you can size closer to{" "}
          {num(result.leanVA)} VA.
        </p>
      </div>
    </Bezel>
  );
}

function BatteryCard({ result, settings }: { result: Result; settings: Settings }) {
  const chemistry = settings.chemistry === "lead" ? "Lead-acid" : "LiFePO4";
  return (
    <Bezel className="lg:col-span-4">
      <div className="p-5">
        <CardHead icon={BatteryCharging} title="Battery bank" meta={chemistry} />

        <div className="mt-5">
          <span className="block text-[10px] tracking-[0.16em] text-mute-2 uppercase">
            Bank to install
          </span>
          <span className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl leading-none tabular-nums text-bone">
              {num(result.installedBankAh)}
            </span>
            <span className="text-sm text-mute">
              Ah @ {result.systemVoltage} V
            </span>
          </span>
        </div>

        <div className="mt-4 rounded-2xl bg-white/[0.03] px-3.5 py-3 ring-1 ring-white/[0.05]">
          <p className="font-mono text-[11px] tabular-nums text-bone/85">
            {result.seriesCount} × {settings.moduleAh} Ah in series
            {result.parallelCount > 1 ? ` · ${result.parallelCount} strings parallel` : ""}
          </p>
          <p className="mt-1 font-mono text-[10px] tabular-nums text-mute-2">
            {result.batteryCount} × 12 V {settings.moduleAh} Ah = {energy(result.installedBankWh)}
          </p>
        </div>

        <div className="mt-4 border-t border-white/[0.06] pt-2">
          <Row label="Stored energy" value={energy(result.installedBankWh)} />
          <Row label="Usable energy" value={energy(result.usableInstalledWh)} />
          <Row label="Depth of discharge" value={`${Math.round(result.dod * 100)}%`} />
          <Row label="Runtime at full load" value={`${num(result.runtimeHours, 1)} h`} strong tone="solar" />
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-mute-2">
          {chemistry} can be cycled to {Math.round(result.dod * 100)}% of its nameplate. Sizing to{" "}
          {settings.autonomyHours} h needs {energy(result.bankWh)} of nameplate storage before that
          limit.
        </p>
      </div>
    </Bezel>
  );
}

function SolarCard({ result, settings }: { result: Result; settings: Settings }) {
  const pct = Math.round(result.coverage * 100);
  return (
    <Bezel className="lg:col-span-4">
      <div className="p-5">
        <CardHead
          icon={SunHorizon}
          title="Solar array"
          meta={`${settings.peakSunHours} sun h`}
        />

        <div className="mt-5">
          <span className="block text-[10px] tracking-[0.16em] text-mute-2 uppercase">
            Array to install
          </span>
          <span className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl leading-none tabular-nums text-volt">
              {wp(result.installedWp).value}
            </span>
            <span className="text-sm text-mute">{wp(result.installedWp).unit}</span>
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11px] text-mute">Share of daily use covered</span>
            <span className="font-mono text-[11px] tabular-nums text-bone/80">{pct}%</span>
          </div>
          <Meter className="mt-2" value={result.coverage} tone="volt" />
        </div>

        <div className="mt-4 border-t border-white/[0.06] pt-2">
          <Row label="Daily consumption" value={energy(result.dailyWh)} />
          <Row label="Array required" value={`${num(result.arrayWp)} Wp`} />
          <Row
            label="Panels"
            value={`${result.panelCount} × ${settings.panelWatt} W`}
            strong
            tone="solar"
          />
          <Row label="Daily generation" value={energy(result.dailyGenerationWh)} />
          <Row label="Charge current" value={`≈ ${num(result.controllerAmps)} A`} />
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-mute-2">
          Derated to {Math.round(settings.systemDerate * 100)}% to account for heat, dust and wiring
          losses — {energy(result.dailyGenerationWh)} of real-world output per day.
        </p>
      </div>
    </Bezel>
  );
}

function EnergyCard({ result }: { result: Result }) {
  const monthly = result.dailyWh * 30;
  return (
    <Bezel className="lg:col-span-7">
      <div className="p-5">
        <CardHead
          icon={ChartLine}
          title="Where the energy goes"
          meta={`${energy(monthly)} / month`}
        />

        <div className="mt-5 flex items-baseline gap-2">
          <span className="font-mono text-3xl leading-none tabular-nums text-bone">
            {energy(result.dailyWh)}
          </span>
          <span className="text-sm text-mute">per day</span>
        </div>

        <ul className="mt-5 space-y-3">
          {result.breakdown.map((item) => {
            const Icon = APPLIANCE_ICONS[item.icon] ?? APPLIANCE_ICONS.light;
            return (
              <li key={item.uid} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-solar">
                  <Icon size={12} weight="light" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[12px] text-bone/90">{item.name}</span>
                    <span className="shrink-0 font-mono text-[11px] tabular-nums text-mute">
                      {energy(item.dailyWh)}
                    </span>
                  </span>
                  <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <span
                      className="block h-full origin-left rounded-full bg-solar/70"
                      style={{
                        transform: `scaleX(${Math.max(0.01, Math.min(1, item.share))})`,
                        transition: `transform 700ms ${EASE}`,
                      }}
                    />
                  </span>
                </span>
                <span className="w-9 shrink-0 text-right font-mono text-[10px] tabular-nums text-mute-2">
                  {Math.round(item.share * 100)}%
                </span>
              </li>
            );
          })}
        </ul>

        {result.breakdown.length === 0 ? (
          <p className="mt-4 text-[12px] text-mute-2">No loads yet.</p>
        ) : null}
      </div>
    </Bezel>
  );
}

function CostCard({ result, settings }: { result: Result; settings: Settings }) {
  const currency = settings.currency;
  const share = (value: number) => (result.costTotal > 0 ? value / result.costTotal : 0);
  return (
    <Bezel className="lg:col-span-5">
      <div className="p-5">
        <CardHead icon={Gauge} title="Rough budget" meta={currency} />

        <div className="mt-5">
          <span className="block text-[10px] tracking-[0.16em] text-mute-2 uppercase">
            Estimated total
          </span>
          <span className="mt-1 block font-mono text-3xl leading-none tabular-nums text-bone">
            {money(result.costTotal, currency)}
          </span>
        </div>

        <div className="mt-4 border-t border-white/[0.06] pt-2">
          <Row
            label={`Inverter · ${num(result.recommendedVA)} VA`}
            value={money(result.costInverter, currency)}
          />
          <Row
            label={`Battery · ${result.batteryCount} modules`}
            value={money(result.costBattery, currency)}
          />
          <Row
            label={`Panels · ${num(result.installedWp)} Wp`}
            value={money(result.costPanel, currency)}
          />
          <Row label="Mounting, wiring, install" value={money(result.costBos, currency)} />
          <Row label="Total" value={money(result.costTotal, currency)} strong tone="solar" />
        </div>

        <div className="mt-4 space-y-3">
          {[
            { label: "Inverter", value: result.costInverter, tone: "solar" as const },
            { label: "Battery", value: result.costBattery, tone: "volt" as const },
            { label: "Panels", value: result.costPanel, tone: "good" as const },
            { label: "Balance of system", value: result.costBos, tone: "bad" as const },
          ].map((line) => (
            <div key={line.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[11px] text-mute-2">{line.label}</span>
                <span className="font-mono text-[10px] tabular-nums text-mute-2">
                  {Math.round(share(line.value) * 100)}%
                </span>
              </div>
              <Meter className="mt-1.5" value={share(line.value)} tone={line.tone} />
            </div>
          ))}
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-mute-2">
          Battery typically dominates the bill. Shaving autonomy by an hour or two usually moves the
          total more than shopping for a cheaper inverter.
        </p>
      </div>
    </Bezel>
  );
}

export function ResultsBento({ result, settings }: { result: Result; settings: Settings }) {
  return (
    <div className="mt-4">
      <FlowStrip result={result} settings={settings} />
      <div className="mt-4 grid gap-4 lg:grid-cols-12">
        <InverterCard result={result} settings={settings} />
        <BatteryCard result={result} settings={settings} />
        <SolarCard result={result} settings={settings} />
        <EnergyCard result={result} />
        <CostCard result={result} settings={settings} />
      </div>
    </div>
  );
}

export function ResultsNote() {
  return (
    <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-mute-2">
      <Info size={13} weight="light" aria-hidden className="mt-0.5 shrink-0" />
      Every number here is an estimate built from the assumptions above — the defaults for{" "}
      {DEFAULT_SETTINGS.peakSunHours} sun hours, {Math.round(DEFAULT_SETTINGS.systemDerate * 100)}%
      derate and a {DEFAULT_SETTINGS.powerFactor} power factor suit Bangladesh. Check the DC side
      with an installer before you buy.
    </p>
  );
}
