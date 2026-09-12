"use client";

import { useEffect, useState } from "react";
import type { Result, Settings } from "@/lib/calc";
import type { Submission } from "@/lib/leaderboard";
import { Bezel } from "@/components/bezel";
import { CardHead } from "@/components/studio/parts";
import { LeaderboardRow } from "@/components/leaderboard-row";
import { Check, ChartLine } from "@/components/icons";

const NAME_KEY = "solor.leaderboard.name";

export function LeaderboardPanel({
  applianceCount,
  result,
  settings,
}: {
  applianceCount: number;
  result: Result;
  settings: Settings;
}) {
  const [name, setName] = useState("");
  const [recent, setRecent] = useState<Submission[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setName(window.localStorage.getItem(NAME_KEY) ?? "");
      } catch {
        /* privacy mode */
      }
      fetchRecent();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function fetchRecent() {
    try {
      const res = await fetch("/api/submissions?limit=10");
      const data = await res.json();
      setConfigured(Boolean(data.configured));
      setRecent(data.entries ?? []);
    } catch {
      setRecent([]);
    }
  }

  async function submit() {
    if (result.runningW <= 0 || applianceCount === 0) return;
    setStatus("saving");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          applianceCount,
          runningW: result.runningW,
          dailyWh: result.dailyWh,
          recommendedVA: result.recommendedVA,
          systemVoltage: result.systemVoltage,
          installedBankAh: result.installedBankAh,
          installedWp: result.installedWp,
          costTotal: result.costTotal,
          currency: settings.currency,
        }),
      });
      if (!res.ok) throw new Error("failed");
      try {
        window.localStorage.setItem(NAME_KEY, name);
      } catch {
        /* privacy mode */
      }
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 2400);
      fetchRecent();
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2400);
    }
  }

  return (
    <Bezel className="mt-4">
      <div className="p-5">
        <CardHead icon={ChartLine} title="Community leaderboard" meta="public" />

        {!configured ? (
          <p className="mt-4 text-[12px] leading-relaxed text-mute-2">
            No shared leaderboard is connected yet — this is a local preview only.
          </p>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name (optional)"
                maxLength={40}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full bg-white/[0.04] px-4 py-2 text-sm text-bone outline-none ring-1 ring-white/[0.06] placeholder:text-mute-2 focus:ring-solar/40"
              />
              <button
                type="button"
                onClick={submit}
                disabled={status === "saving" || result.runningW <= 0}
                className="flex items-center gap-2 rounded-full bg-solar py-2 pr-4 pl-4 text-sm font-medium text-ink transition-transform duration-500 ease-fluid active:scale-[0.98] disabled:opacity-40"
              >
                {status === "saved" ? (
                  <>
                    <Check size={13} weight="light" aria-hidden />
                    Added
                  </>
                ) : status === "saving" ? (
                  "Adding…"
                ) : (
                  "Add my result"
                )}
              </button>
            </div>
            {status === "error" ? (
              <p className="mt-2 text-[11px] text-bad">Could not save that — try again.</p>
            ) : null}
            <p className="mt-2 text-[11px] leading-relaxed text-mute-2">
              Publishes your load, inverter, battery, array and budget publicly. No account, no
              contact info collected.
            </p>

            <div className="mt-4 space-y-2">
              {recent === null ? (
                <p className="text-[12px] text-mute-2">Loading recent calculations…</p>
              ) : recent.length === 0 ? (
                <p className="text-[12px] text-mute-2">
                  No calculations shared yet — be the first.
                </p>
              ) : (
                recent.map((entry) => <LeaderboardRow key={entry.id} entry={entry} />)
              )}
            </div>
          </>
        )}
      </div>
    </Bezel>
  );
}
