import type { LoadItem, Result, Settings } from "./calc";
import { energy, money, num, watts } from "./format";

export function buildReport(loads: LoadItem[], settings: Settings, result: Result): string {
  const lines: string[] = [];
  const rule = "-".repeat(48);

  lines.push("SOLOR — SOLAR & UPS SIZING SUMMARY");
  lines.push(new Date().toLocaleString());
  lines.push(rule);
  lines.push("");

  lines.push("LOAD LIST");
  for (const load of loads) {
    lines.push(
      `- ${load.name}  x${load.qty}  ${watts(load.qty * load.watts)} running, ${watts(
        load.qty * load.surge,
      )} start, ${load.hours} h/day`,
    );
  }
  lines.push("");

  lines.push("RECOMMENDED SYSTEM");
  lines.push(`Inverter / UPS:   ${num(result.recommendedVA)} VA`);
  lines.push(
    `Battery bank:     ${num(result.installedBankAh)} Ah @ ${result.systemVoltage} V (${result.batteryCount} x ${settings.moduleAh} Ah)`,
  );
  lines.push(`Solar array:      ${num(result.installedWp)} Wp (${result.panelCount} x ${settings.panelWatt} W)`);
  lines.push(`Backup at full load: ~${num(result.runtimeHours, 1)} h`);
  lines.push(`Rough budget:     ${money(result.costTotal, settings.currency)}`);
  lines.push("");

  lines.push("LOAD DETAIL");
  lines.push(`Running load:     ${watts(result.runningW)}`);
  lines.push(`Start-up surge:   ${watts(result.surgeW)}`);
  lines.push(`Daily energy:     ${energy(result.dailyWh)}`);
  lines.push(`Monthly energy:   ${energy(result.dailyWh * 30)}`);
  lines.push("");

  lines.push("ASSUMPTIONS");
  lines.push(`Autonomy:         ${settings.autonomyHours} h`);
  lines.push(`Battery chemistry: ${settings.chemistry === "lead" ? "Lead-acid" : "LiFePO4"}`);
  lines.push(`Peak sun hours:   ${settings.peakSunHours}`);
  lines.push(`System derate:    ${Math.round(settings.systemDerate * 100)}%`);
  lines.push(`Power factor:     ${settings.powerFactor}`);
  lines.push("");

  if (result.insights.length > 0) {
    lines.push("NOTES");
    for (const insight of result.insights) {
      lines.push(`- ${insight.text}`);
    }
    lines.push("");
  }

  lines.push(rule);
  lines.push("Every figure here is an estimate — check the DC side with an installer before you buy.");

  return lines.join("\n");
}

export function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
