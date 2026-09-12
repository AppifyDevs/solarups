"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import type { PhosphorIcon } from "@/components/icons";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export function NumField({
  label,
  value,
  onChange,
  min = 0,
  max = Infinity,
  decimals = 0,
  suffix,
  className,
  inputClassName,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  decimals?: number;
  suffix?: string;
  className?: string;
  inputClassName?: string;
}) {
  const [draft, setDraft] = useState(() => value.toFixed(decimals));
  const [snapshot, setSnapshot] = useState(value);
  const [focused, setFocused] = useState(false);
  const id = useId();

  // Re-sync from the outside world (presets, resets, shared links) without
  // clobbering whatever the user is currently typing.
  if (!focused && value !== snapshot) {
    setSnapshot(value);
    setDraft(value.toFixed(decimals));
  }

  return (
    <label
      htmlFor={id}
      className={cn(
        "block rounded-xl bg-white/[0.035] px-2.5 py-2 ring-1 ring-white/[0.06] transition-[box-shadow,background-color] duration-500 ease-fluid focus-within:bg-white/[0.06] focus-within:ring-solar/45",
        className,
      )}
    >
      <span className="block truncate text-[9px] font-medium tracking-[0.16em] text-mute-2 uppercase">
        {label}
      </span>
      <span className="mt-0.5 flex items-baseline gap-1">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={draft}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setDraft(value.toFixed(decimals));
          }}
          onChange={(event) => {
            const raw = event.target.value;
            setDraft(raw);
            if (raw.trim() === "" || raw === ".") return;
            const parsed = Number.parseFloat(raw);
            if (!Number.isFinite(parsed)) return;
            onChange(Math.min(max, Math.max(min, parsed)));
          }}
          className={cn(
            "w-full min-w-0 bg-transparent font-mono text-sm tabular-nums text-bone outline-none",
            inputClassName,
          )}
        />
        {suffix ? (
          <span className="shrink-0 font-mono text-[10px] text-mute-2">{suffix}</span>
        ) : null}
      </span>
    </label>
  );
}

export function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  display,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  display: string;
  hint?: string;
}) {
  const id = useId();
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-[11px] font-medium tracking-[0.08em] text-mute uppercase"
        >
          {label}
        </label>
        <span className="font-mono text-sm tabular-nums text-bone">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-solar [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_var(--thumb-glow)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-300 hover:[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-solar"
        style={{
          background: `linear-gradient(to right, var(--color-solar) ${pct}%, var(--track-empty) ${pct}%)`,
        }}
      />
      {hint ? <p className="mt-1.5 text-[11px] leading-snug text-mute-2">{hint}</p> : null}
    </div>
  );
}

export function Segmented<T extends string | number>({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  hint?: string;
}) {
  return (
    <div>
      <span className="text-[11px] font-medium tracking-[0.08em] text-mute uppercase">
        {label}
      </span>
      <div className="mt-2 flex gap-1 rounded-xl bg-white/[0.03] p-1 ring-1 ring-white/[0.06]">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={cn(
                "flex-1 rounded-lg px-2 py-1.5 font-mono text-xs tabular-nums transition-all duration-500 ease-fluid",
                active
                  ? "bg-solar text-ink shadow-[0_2px_12px_var(--chip-shadow)]"
                  : "text-mute hover:bg-white/[0.05] hover:text-bone",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {hint ? <p className="mt-1.5 text-[11px] leading-snug text-mute-2">{hint}</p> : null}
    </div>
  );
}

export function Meter({
  value,
  tone = "solar",
  className,
}: {
  value: number;
  tone?: "solar" | "volt" | "good" | "bad";
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  const tones = {
    solar: "bg-solar",
    volt: "bg-volt",
    good: "bg-good",
    bad: "bg-bad",
  };
  return (
    <div
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]", className)}
      role="presentation"
    >
      <div
        className={cn("h-full origin-left rounded-full", tones[tone])}
        style={{
          transform: `scaleX(${clamped})`,
          transition: `transform 700ms ${EASE}`,
        }}
      />
    </div>
  );
}

export function Stat({
  label,
  value,
  unit,
  sub,
  tone = "bone",
  className,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  tone?: "bone" | "solar" | "volt" | "good";
  className?: string;
}) {
  const tones = {
    bone: "text-bone",
    solar: "text-solar",
    volt: "text-volt",
    good: "text-good",
  };
  return (
    <div className={cn("min-w-0", className)}>
      <span className="block truncate text-[10px] font-medium tracking-[0.16em] text-mute-2 uppercase">
        {label}
      </span>
      <span className="mt-1 flex items-baseline gap-1">
        <span
          className={cn(
            "font-mono text-2xl leading-none tabular-nums tracking-tight",
            tones[tone],
          )}
        >
          {value}
        </span>
        {unit ? <span className="text-xs text-mute">{unit}</span> : null}
      </span>
      {sub ? (
        <span className="mt-1 block truncate text-[11px] text-mute-2">{sub}</span>
      ) : null}
    </div>
  );
}

export function CardHead({
  icon: Icon,
  title,
  meta,
  className,
}: {
  icon: PhosphorIcon;
  title: string;
  meta?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05] text-solar ring-1 ring-white/[0.06]">
          <Icon size={14} weight="light" aria-hidden />
        </span>
        <h3 className="text-sm font-medium tracking-tight text-bone">{title}</h3>
      </div>
      {meta ? <span className="font-mono text-[10px] text-mute-2">{meta}</span> : null}
    </div>
  );
}
