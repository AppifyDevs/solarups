import type { Submission } from "@/lib/leaderboard";
import { energy, money, num, watts } from "@/lib/format";
import { BatteryCharging, Lightning, SolarPanel } from "@/components/icons";

function timeAgo(ms: number): string {
  const seconds = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function LeaderboardRow({ entry }: { entry: Submission }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06]">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-medium text-bone">{entry.name}</span>
          <span className="shrink-0 font-mono text-[10px] text-mute-2">
            {timeAgo(entry.createdAt)}
          </span>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-mute-2">
          {entry.applianceCount} appliances · {watts(entry.runningW)} running ·{" "}
          {energy(entry.dailyWh)}/day
        </span>
      </div>

      <span className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-solar">
        <Lightning size={12} weight="light" aria-hidden />
        {num(entry.recommendedVA)} VA
      </span>
      <span className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-bone/80">
        <BatteryCharging size={12} weight="light" aria-hidden />
        {num(entry.installedBankAh)} Ah
      </span>
      <span className="flex items-center gap-1.5 font-mono text-[11px] tabular-nums text-bone/80">
        <SolarPanel size={12} weight="light" aria-hidden />
        {num(entry.installedWp)} Wp
      </span>
      <span className="shrink-0 font-mono text-[11px] tabular-nums text-mute">
        {money(entry.costTotal, entry.currency)}
      </span>
    </div>
  );
}
