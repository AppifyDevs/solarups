"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PRESETS } from "@/lib/appliances";
import {
  buildLoads,
  compute,
  DEFAULT_SETTINGS,
  defaultLoads,
  loadFromAppliance,
  makeUid,
  type LoadItem,
  type Settings,
} from "@/lib/calc";
import { cn } from "@/lib/cn";
import { decodeState, encodeState } from "@/lib/persist";
import { ArrowCounterClockwise, Check, Copy, Printer, SolarPanel } from "@/components/icons";
import { Bezel, Eyebrow } from "@/components/bezel";
import { LoadEditor } from "@/components/studio/load-editor";
import { ResultsBento, ResultsNote, VerdictCard } from "@/components/studio/results";
import { SettingsPanel } from "@/components/studio/settings-panel";

const STORAGE_KEY = "solor.state.v1";

export function Studio() {
  const [loads, setLoads] = useState<LoadItem[]>(defaultLoads);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [presetId, setPresetId] = useState<string | null>(PRESETS[0].id);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Storage is an external system, and the server has no access to it. The
    // read is deferred a tick so the first paint is the server-rendered default
    // and hydration stays consistent.
    const timer = window.setTimeout(() => {
      try {
        const token = new URLSearchParams(window.location.search).get("s");
        const stored = token ?? window.localStorage.getItem(STORAGE_KEY);
        const decoded = stored ? decodeState(stored) : null;
        if (decoded) {
          setLoads(decoded.loads);
          setSettings(decoded.settings);
          setPresetId(null);
        }
      } catch {
        /* storage unavailable — carry on with defaults */
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, encodeState(loads, settings));
    } catch {
      /* quota or privacy mode — ignore */
    }
  }, [loads, settings, ready]);

  const result = useMemo(() => compute(loads, settings), [loads, settings]);

  const update = useCallback((uid: string, patch: Partial<LoadItem>) => {
    setLoads((prev) => prev.map((item) => (item.uid === uid ? { ...item, ...patch } : item)));
    setPresetId(null);
  }, []);

  const remove = useCallback((uid: string) => {
    setLoads((prev) => prev.filter((item) => item.uid !== uid));
    setPresetId(null);
  }, []);

  const add = useCallback((applianceId: string) => {
    setLoads((prev) => [...prev, loadFromAppliance(applianceId)]);
    setPresetId(null);
  }, []);

  const addCustom = useCallback(() => {
    setLoads((prev) => [
      ...prev,
      {
        uid: makeUid(),
        applianceId: "custom",
        name: "Custom appliance",
        icon: "light",
        qty: 1,
        watts: 500,
        surge: 700,
        hours: 4,
      },
    ]);
    setPresetId(null);
  }, []);

  const applyPreset = useCallback((id: string) => {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) return;
    setLoads(buildLoads(preset.items, preset.id));
    setPresetId(preset.id);
  }, []);

  const patchSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetAll = useCallback(() => {
    setLoads(defaultLoads());
    setSettings(DEFAULT_SETTINGS);
    setPresetId(PRESETS[0].id);
  }, []);

  const share = useCallback(async () => {
    const token = encodeState(loads, settings);
    const url = `${window.location.origin}${window.location.pathname}?s=${token}`;
    window.history.replaceState(null, "", `?s=${token}`);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }, [loads, settings]);

  const activePreset = PRESETS.find((preset) => preset.id === presetId);

  return (
    <section id="calculator" className="scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Eyebrow icon={SolarPanel}>The calculator</Eyebrow>
          <h2 className="mt-4 max-w-xl text-3xl leading-[1.05] sm:text-4xl">
            Build the load list. The system sizes itself.
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={share}
            className="group/btn flex items-center gap-2 rounded-full bg-white/[0.05] py-2 pr-2 pl-4 text-sm text-bone ring-1 ring-white/[0.08] transition-all duration-500 ease-fluid hover:bg-white/[0.09] active:scale-[0.98]"
          >
            {copied ? "Link copied" : "Share link"}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.07] transition-transform duration-500 ease-fluid group-hover/btn:translate-x-0.5">
              {copied ? (
                <Check size={12} weight="light" aria-hidden />
              ) : (
                <Copy size={12} weight="light" aria-hidden />
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Print the summary"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-mute ring-1 ring-white/[0.08] transition-colors duration-500 ease-fluid hover:text-bone"
          >
            <Printer size={14} weight="light" aria-hidden />
          </button>
          <button
            type="button"
            onClick={resetAll}
            aria-label="Reset everything"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-mute ring-1 ring-white/[0.08] transition-colors duration-500 ease-fluid hover:text-bone"
          >
            <ArrowCounterClockwise size={14} weight="light" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible">
        {PRESETS.map((preset) => {
          const active = preset.id === presetId;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset.id)}
              aria-pressed={active}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs whitespace-nowrap ring-1 transition-all duration-500 ease-fluid active:scale-[0.98]",
                active
                  ? "bg-solar text-ink ring-solar"
                  : "bg-white/[0.04] text-bone/85 ring-white/[0.07] hover:bg-white/[0.08] hover:text-bone",
              )}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-mute-2">
        {activePreset
          ? activePreset.blurb
          : "Custom load list — edit any value and the sizing updates as you type."}
      </p>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-12">
        <Bezel className="lg:col-span-7" innerClassName="p-5">
          <LoadEditor
            loads={loads}
            onUpdate={update}
            onRemove={remove}
            onAdd={add}
            onAddCustom={addCustom}
          />
          <SettingsPanel
            settings={settings}
            onChange={patchSettings}
            onReset={() => setSettings(DEFAULT_SETTINGS)}
          />
        </Bezel>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <VerdictCard result={result} settings={settings} />
          </div>
        </div>
      </div>

      <ResultsBento result={result} settings={settings} />
      <ResultsNote />
    </section>
  );
}
