"use client";

import type { Settings } from "@/lib/calc";
import { DEFAULT_SETTINGS } from "@/lib/calc";
import { ArrowCounterClockwise, CaretDown, Gauge, SlidersHorizontal, SunHorizon } from "@/components/icons";
import { NumField, RangeField, Segmented } from "@/components/studio/parts";
import type { PhosphorIcon } from "@/components/icons";

function Panel({
  title,
  meta,
  children,
  defaultOpen = false,
  icon: Icon,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon: PhosphorIcon;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-[1.4rem] bg-white/[0.02] ring-1 ring-white/[0.05] transition-colors duration-500 ease-fluid hover:ring-white/[0.09]"
    >
      <summary className="flex items-center justify-between gap-3 rounded-[1.4rem] px-4 py-3.5">
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-solar ring-1 ring-white/[0.06]">
            <Icon size={14} weight="light" aria-hidden />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-bone">{title}</span>
            <span className="block truncate font-mono text-[10px] text-mute-2">{meta}</span>
          </span>
        </span>
        <CaretDown
          size={14}
          weight="light"
          aria-hidden
          className="shrink-0 text-mute-2 transition-transform duration-500 ease-fluid group-open:rotate-180"
        />
      </summary>
      <div className="space-y-4 border-t border-white/[0.05] px-4 py-4">{children}</div>
    </details>
  );
}

export function SettingsPanel({
  settings,
  onChange,
  onReset,
}: {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
}) {
  return (
    <section className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05] text-solar ring-1 ring-white/[0.06]">
            <SlidersHorizontal size={14} weight="light" aria-hidden />
          </span>
          <h3 className="text-sm font-medium tracking-tight text-bone">Assumptions</h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] text-mute-2 transition-colors duration-500 ease-fluid hover:text-bone"
        >
          <ArrowCounterClockwise size={11} weight="light" aria-hidden />
          reset
        </button>
      </div>

      <div className="mt-3 space-y-2">
        <Panel
          title="System"
          meta={`${settings.systemVoltage === "auto" ? "auto" : settings.systemVoltage + " V"} · ${settings.chemistry === "lead" ? "lead-acid" : "LiFePO4"}`}
          icon={Gauge}
          defaultOpen
        >
          <Segmented
            label="DC system voltage"
            value={settings.systemVoltage}
            options={[
              { value: "auto", label: "auto" },
              { value: 12, label: "12 V" },
              { value: 24, label: "24 V" },
              { value: 48, label: "48 V" },
            ]}
            onChange={(value) => onChange({ systemVoltage: value })}
            hint="Auto picks 12 V up to 1.5 kVA, 24 V to 3.5 kVA, then 48 V."
          />
          <Segmented
            label="Battery chemistry"
            value={settings.chemistry}
            options={[
              { value: "lead", label: "Lead-acid" },
              { value: "lithium", label: "LiFePO4" },
            ]}
            onChange={(value) => onChange({ chemistry: value })}
            hint={`Usable depth of discharge: ${settings.chemistry === "lead" ? "50%" : "80%"}.`}
          />
          <RangeField
            label="Backup hours"
            value={settings.autonomyHours}
            min={1}
            max={24}
            step={0.5}
            display={`${settings.autonomyHours} h`}
            onChange={(value) => onChange({ autonomyHours: value })}
            hint="How long the bank should carry the full load with no sun."
          />
          <RangeField
            label="Inverter power factor"
            value={settings.powerFactor}
            min={0.5}
            max={1}
            step={0.05}
            display={settings.powerFactor.toFixed(2)}
            onChange={(value) => onChange({ powerFactor: value })}
            hint="Motors and switch-mode supplies drag this below 1."
          />
          <RangeField
            label="Inverter headroom"
            value={settings.inverterHeadroom}
            min={1}
            max={1.5}
            step={0.05}
            display={`${settings.inverterHeadroom.toFixed(2)}×`}
            onChange={(value) => onChange({ inverterHeadroom: value })}
          />
          <RangeField
            label="Inverter efficiency"
            value={settings.inverterEfficiency}
            min={0.7}
            max={0.98}
            step={0.01}
            display={`${Math.round(settings.inverterEfficiency * 100)}%`}
            onChange={(value) => onChange({ inverterEfficiency: value })}
          />
        </Panel>

        <Panel
          title="Array & bank"
          meta={`${settings.peakSunHours} sun h · ${settings.panelWatt} W panels`}
          icon={SunHorizon}
        >
          <RangeField
            label="Peak sun hours"
            value={settings.peakSunHours}
            min={2}
            max={8}
            step={0.25}
            display={`${settings.peakSunHours} h`}
            onChange={(value) => onChange({ peakSunHours: value })}
            hint="Bangladesh averages roughly 4–5 usable sun hours across the year."
          />
          <RangeField
            label="System derate"
            value={settings.systemDerate}
            min={0.5}
            max={0.95}
            step={0.05}
            display={`${Math.round(settings.systemDerate * 100)}%`}
            onChange={(value) => onChange({ systemDerate: value })}
            hint="Covers heat, dust, wiring and charge-controller losses."
          />
          <Segmented
            label="Panel rating"
            value={settings.panelWatt}
            options={[
              { value: 450, label: "450 W" },
              { value: 550, label: "550 W" },
              { value: 700, label: "700 W" },
            ]}
            onChange={(value) => onChange({ panelWatt: value })}
          />
          <Segmented
            label="Battery module"
            value={settings.moduleAh}
            options={[
              { value: 100, label: "100 Ah" },
              { value: 150, label: "150 Ah" },
              { value: 200, label: "200 Ah" },
              { value: 250, label: "250 Ah" },
            ]}
            onChange={(value) => onChange({ moduleAh: value })}
            hint="12 V modules, wired in series to reach the system voltage."
          />
          <RangeField
            label="Charge controller headroom"
            value={settings.controllerHeadroom}
            min={1}
            max={1.5}
            step={0.05}
            display={`${settings.controllerHeadroom.toFixed(2)}×`}
            onChange={(value) => onChange({ controllerHeadroom: value })}
          />
        </Panel>

        <Panel
          title="Budget rates"
          meta={settings.currency === "BDT" ? "৳ per unit" : "$ per unit"}
          icon={Gauge}
        >
          <Segmented
            label="Currency"
            value={settings.currency}
            options={[
              { value: "BDT", label: "BDT ৳" },
              { value: "USD", label: "USD $" },
            ]}
            onChange={(value) => onChange({ currency: value })}
            hint="Switching currency relabels the numbers — edit the rates to match your market."
          />
          <div className="grid grid-cols-2 gap-2">
            <NumField
              label="Inverter / VA"
              value={settings.costInverterPerVa}
              min={0}
              max={1000}
              decimals={0}
              onChange={(value) => onChange({ costInverterPerVa: value })}
            />
            <NumField
              label="Battery ea."
              value={settings.costBatteryPerUnit}
              min={0}
              max={1000000}
              onChange={(value) => onChange({ costBatteryPerUnit: value })}
            />
            <NumField
              label="Panel / Wp"
              value={settings.costPanelPerWp}
              min={0}
              max={1000}
              decimals={0}
              onChange={(value) => onChange({ costPanelPerWp: value })}
            />
            <NumField
              label="Mounting + install"
              value={settings.costBos}
              min={0}
              max={10000000}
              onChange={(value) => onChange({ costBos: value })}
            />
          </div>
          <p className="text-[11px] leading-snug text-mute-2">
            Defaults: {DEFAULT_SETTINGS.costInverterPerVa} /VA,{" "}
            {DEFAULT_SETTINGS.costBatteryPerUnit.toLocaleString("en-US")} per 12 V module,{" "}
            {DEFAULT_SETTINGS.costPanelPerWp} /Wp. Treat them as a starting sketch, not a quote.
          </p>
        </Panel>
      </div>
    </section>
  );
}
