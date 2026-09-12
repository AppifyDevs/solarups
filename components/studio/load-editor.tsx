"use client";

import { useMemo, useState } from "react";
import { APPLIANCES, GROUPS, type Group } from "@/lib/appliances";
import type { LoadItem } from "@/lib/calc";
import { cn } from "@/lib/cn";
import { energy, watts } from "@/lib/format";
import { APPLIANCE_ICONS, ListMagnifyingGlass, Plus, Trash, X } from "@/components/icons";
import { CardHead, NumField, QtyStepper } from "@/components/studio/parts";

export function LoadEditor({
  loads,
  onUpdate,
  onRemove,
  onAdd,
  onAddCustom,
}: {
  loads: LoadItem[];
  onUpdate: (uid: string, patch: Partial<LoadItem>) => void;
  onRemove: (uid: string) => void;
  onAdd: (applianceId: string) => void;
  onAddCustom: () => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<Group | "All">("All");

  const grouped = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = APPLIANCES.filter(
      (a) =>
        (activeGroup === "All" || a.group === activeGroup) &&
        (needle === "" ||
          a.name.toLowerCase().includes(needle) ||
          a.group.toLowerCase().includes(needle)),
    );
    return GROUPS.map((group) => ({
      group,
      items: matches.filter((a) => a.group === group),
    })).filter((bucket) => bucket.items.length > 0) as { group: Group; items: typeof matches }[];
  }, [query, activeGroup]);

  return (
    <section id="load-editor" className="scroll-mt-28">
      <CardHead
        icon={ListMagnifyingGlass}
        title="Your load list"
        meta={`${loads.length} ${loads.length === 1 ? "line" : "lines"}`}
      />

      <div className="mt-4 space-y-2.5">
        {loads.map((load) => {
          const Icon = APPLIANCE_ICONS[load.icon] ?? APPLIANCE_ICONS.light;
          const rowWatts = load.qty * load.watts;
          return (
            <div
              key={load.uid}
              className="group rounded-[1.4rem] bg-white/[0.022] p-3 ring-1 ring-white/[0.05] transition-colors duration-500 ease-fluid hover:bg-white/[0.04]"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-solar ring-1 ring-white/[0.06]">
                  <Icon size={16} weight="light" aria-hidden />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-bone">{load.name}</p>
                      <p className="mt-0.5 font-mono text-[10px] tabular-nums text-mute-2">
                        {load.surge} W start · {energy(load.qty * load.watts * load.hours)}/day
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className="font-mono text-sm tabular-nums text-solar">
                        {watts(rowWatts)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemove(load.uid)}
                        aria-label={`Remove ${load.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-mute-2 transition-all duration-500 ease-fluid hover:bg-bad/15 hover:text-bad"
                      >
                        <Trash size={13} weight="light" aria-hidden />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <NumField
                      label="Qty"
                      value={load.qty}
                      min={1}
                      max={99}
                      onChange={(value) => onUpdate(load.uid, { qty: Math.round(value) })}
                    />
                    <NumField
                      label="Watts ea."
                      value={load.watts}
                      min={0}
                      max={100000}
                      suffix="W"
                      onChange={(value) => onUpdate(load.uid, { watts: value })}
                    />
                    <NumField
                      label="Surge ea."
                      value={load.surge}
                      min={0}
                      max={100000}
                      suffix="W"
                      onChange={(value) => onUpdate(load.uid, { surge: value })}
                    />
                    <NumField
                      label="Hours/day"
                      value={load.hours}
                      min={0}
                      max={24}
                      decimals={1}
                      suffix="h"
                      onChange={(value) => onUpdate(load.uid, { hours: value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {loads.length === 0 ? (
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="w-full rounded-[1.4rem] bg-white/[0.015] px-4 py-8 text-center text-sm text-mute ring-1 ring-dashed ring-white/[0.08] transition-colors duration-500 ease-fluid hover:bg-white/[0.03] hover:text-bone"
          >
            Nothing here yet. Tap to add your first appliance.
          </button>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPickerOpen((open) => !open)}
          aria-expanded={pickerOpen}
          className="group/btn flex items-center gap-2 rounded-full bg-solar py-2 pr-2 pl-4 text-sm font-medium text-ink transition-transform duration-500 ease-fluid active:scale-[0.98]"
        >
          Add appliance
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/12 transition-transform duration-500 ease-fluid group-hover/btn:translate-x-0.5 group-hover/btn:scale-105">
            <Plus size={12} weight="light" aria-hidden />
          </span>
        </button>
        <button
          type="button"
          onClick={onAddCustom}
          className="rounded-full bg-white/[0.05] px-4 py-2 text-sm text-bone/80 ring-1 ring-white/[0.07] transition-colors duration-500 ease-fluid hover:bg-white/[0.09] hover:text-bone"
        >
          Empty row
        </button>
      </div>

      {pickerOpen ? (
        <div className="mt-3 rounded-[1.4rem] bg-white/[0.02] p-3 ring-1 ring-white/[0.06]">
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.04] px-3 py-2 ring-1 ring-white/[0.06] focus-within:ring-solar/40">
            <ListMagnifyingGlass
              size={14}
              weight="light"
              className="shrink-0 text-mute-2"
              aria-hidden
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search appliances"
              autoComplete="off"
              className="w-full bg-transparent text-sm text-bone outline-none placeholder:text-mute-2"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="text-mute-2 transition-colors duration-300 hover:text-bone"
              >
                <X size={13} weight="light" aria-hidden />
              </button>
            ) : null}
          </div>

          <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-1">
            {(["All", ...GROUPS] as const).map((group) => {
              const active = group === activeGroup;
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => setActiveGroup(group)}
                  aria-pressed={active}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[11px] whitespace-nowrap ring-1 transition-all duration-500 ease-fluid",
                    active
                      ? "bg-solar text-ink ring-solar"
                      : "bg-white/[0.03] text-mute ring-white/[0.06] hover:bg-white/[0.07] hover:text-bone",
                  )}
                >
                  {group}
                </button>
              );
            })}
          </div>

          <div className="mt-3 max-h-[19rem] space-y-3 overflow-y-auto pr-1">
            {grouped.map((bucket) => (
              <div key={bucket.group}>
                {activeGroup === "All" ? (
                  <p className="px-1 text-[10px] font-medium tracking-[0.18em] text-mute-2 uppercase">
                    {bucket.group}
                  </p>
                ) : null}
                <div className="mt-1.5 grid gap-1.5 sm:grid-cols-2">
                  {bucket.items.map((appliance) => {
                    const Icon = APPLIANCE_ICONS[appliance.icon] ?? APPLIANCE_ICONS.light;
                    return (
                      <button
                        key={appliance.id}
                        type="button"
                        onClick={() => onAdd(appliance.id)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-xl bg-white/[0.02] px-2.5 py-2 text-left ring-1 ring-white/[0.05]",
                          "transition-all duration-500 ease-fluid hover:bg-white/[0.06] hover:ring-solar/25 active:scale-[0.99]",
                        )}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-solar">
                          <Icon size={13} weight="light" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs text-bone">
                            {appliance.name}
                          </span>
                          <span className="block font-mono text-[10px] tabular-nums text-mute-2">
                            {appliance.watts} W · {appliance.surge} W start
                          </span>
                        </span>
                        <Plus size={12} weight="light" className="shrink-0 text-mute-2" aria-hidden />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {grouped.length === 0 ? (
              <p className="px-1 py-4 text-center text-xs text-mute-2">
                No match. Use “Empty row” to type your own values.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
