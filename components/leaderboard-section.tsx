"use client";

import { useEffect, useState } from "react";
import type { Submission } from "@/lib/leaderboard";
import { LeaderboardRow } from "@/components/leaderboard-row";
import { Bezel, Eyebrow } from "@/components/bezel";
import { ChartLine } from "@/components/icons";

const PAGE_SIZE = 25;

export function LeaderboardSection() {
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [entries, setEntries] = useState<Submission[] | null>(null);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/submissions?limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setConfigured(Boolean(data.configured));
        setEntries(data.entries ?? []);
      })
      .catch(() => {
        if (!cancelled) setEntries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return (
    <section id="leaderboard" className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Eyebrow icon={ChartLine}>Leaderboard</Eyebrow>
        <h2 className="mt-4 max-w-xl text-3xl leading-[1.05] sm:text-4xl">
          Every calculation, shared by users.
        </h2>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-mute">
          Anyone who taps "Add my result" in the calculator shows up here — a public, unranked
          feed of real load lists and the systems they sized.
        </p>

        <Bezel className="mt-6">
          <div className="p-5">
            {!configured ? (
              <p className="text-[12px] leading-relaxed text-mute-2">
                No shared leaderboard is connected yet.
              </p>
            ) : entries === null ? (
              <p className="text-[12px] text-mute-2">Loading…</p>
            ) : entries.length === 0 ? (
              <p className="text-[12px] text-mute-2">
                Nothing shared yet — sizing a system and tapping "Add my result" puts it here.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <LeaderboardRow key={entry.id} entry={entry} />
                  ))}
                </div>
                {entries.length >= limit ? (
                  <button
                    type="button"
                    onClick={() => setLimit((value) => value + PAGE_SIZE)}
                    disabled={loading}
                    className="mt-4 w-full rounded-full bg-white/[0.05] py-2.5 text-sm text-bone/80 ring-1 ring-white/[0.07] transition-colors duration-500 ease-fluid hover:bg-white/[0.09] hover:text-bone disabled:opacity-50"
                  >
                    {loading ? "Loading…" : "Load more"}
                  </button>
                ) : null}
              </>
            )}
          </div>
        </Bezel>
      </div>
    </section>
  );
}
