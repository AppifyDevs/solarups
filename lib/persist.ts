import { APPLIANCES, type IconKey } from "./appliances";
import { DEFAULT_SETTINGS, type Chemistry, type LoadItem, type Settings } from "./calc";
import { clamp } from "./format";

const ICON_KEYS = new Set<string>(APPLIANCES.map((a) => a.icon));
const ID_BY_NAME = new Map(APPLIANCES.map((a) => [a.name, a.id]));

type PackedLoad = [string, string, string, number, number, number, number];

type Payload = {
  v: 1;
  l: PackedLoad[];
  s: Record<string, unknown>;
};

export function encodeState(loads: LoadItem[], settings: Settings): string {
  const payload: Payload = {
    v: 1,
    l: loads.map((l) => [
      l.applianceId,
      l.name,
      l.icon,
      l.qty,
      l.watts,
      l.surge,
      l.hours,
    ]),
    s: { ...settings },
  };
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeState(
  token: string,
): { loads: LoadItem[]; settings: Settings } | null {
  try {
    const normalized = token.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as Payload;
    if (parsed.v !== 1 || !Array.isArray(parsed.l)) return null;

    const loads: LoadItem[] = parsed.l.map((row, index) => {
      const [applianceId, name, icon, qty, watts, surge, hours] = row;
      const safeIcon = (ICON_KEYS.has(icon) ? icon : "light") as IconKey;
      return {
        uid: `s${index}`,
        applianceId: typeof applianceId === "string" ? applianceId : "custom",
        name: typeof name === "string" && name ? name.slice(0, 60) : "Appliance",
        icon: safeIcon,
        qty: clamp(Number(qty) || 1, 1, 99),
        watts: clamp(Number(watts) || 0, 0, 100000),
        surge: clamp(Number(surge) || 0, 0, 100000),
        hours: clamp(Number(hours) || 0, 0, 24),
      };
    });

    return { loads, settings: sanitizeSettings(parsed.s) };
  } catch {
    return null;
  }
}

function sanitizeSettings(raw: unknown): Settings {
  const source = (raw ?? {}) as Record<string, unknown>;
  const read = (key: keyof Settings, fallback: number, min: number, max: number) => {
    const value = Number(source[key]);
    return Number.isFinite(value) ? clamp(value, min, max) : fallback;
  };

  const chemistry: Chemistry = source.chemistry === "lithium" ? "lithium" : "lead";
  const voltageRaw = Number(source.systemVoltage);
  const systemVoltage: Settings["systemVoltage"] =
    voltageRaw === 12 || voltageRaw === 24 || voltageRaw === 48 ? voltageRaw : "auto";
  const currency: Settings["currency"] = source.currency === "USD" ? "USD" : "BDT";

  return {
    ...DEFAULT_SETTINGS,
    powerFactor: read("powerFactor", DEFAULT_SETTINGS.powerFactor, 0.5, 1),
    inverterEfficiency: read("inverterEfficiency", DEFAULT_SETTINGS.inverterEfficiency, 0.6, 1),
    inverterHeadroom: read("inverterHeadroom", DEFAULT_SETTINGS.inverterHeadroom, 1, 2),
    autonomyHours: read("autonomyHours", DEFAULT_SETTINGS.autonomyHours, 0.5, 48),
    chemistry,
    systemVoltage,
    moduleAh: read("moduleAh", DEFAULT_SETTINGS.moduleAh, 20, 1000),
    panelWatt: read("panelWatt", DEFAULT_SETTINGS.panelWatt, 20, 2000),
    peakSunHours: read("peakSunHours", DEFAULT_SETTINGS.peakSunHours, 2, 8),
    systemDerate: read("systemDerate", DEFAULT_SETTINGS.systemDerate, 0.4, 1),
    controllerHeadroom: read(
      "controllerHeadroom",
      DEFAULT_SETTINGS.controllerHeadroom,
      1,
      2,
    ),
    currency,
    costInverterPerVa: read("costInverterPerVa", DEFAULT_SETTINGS.costInverterPerVa, 0, 1000),
    costBatteryPerUnit: read(
      "costBatteryPerUnit",
      DEFAULT_SETTINGS.costBatteryPerUnit,
      0,
      1000000,
    ),
    costPanelPerWp: read("costPanelPerWp", DEFAULT_SETTINGS.costPanelPerWp, 0, 1000),
    costBos: read("costBos", DEFAULT_SETTINGS.costBos, 0, 10000000),
  };
}

export function iconForName(name: string): IconKey {
  const id = ID_BY_NAME.get(name);
  if (!id) return "light";
  return APPLIANCES.find((a) => a.id === id)?.icon ?? "light";
}
