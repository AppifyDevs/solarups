export function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function num(value: number, decimals = 0): string {
  if (!Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Watts as either `820 W` or `1.42 kW`. */
export function watts(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1000) return `${num(value / 1000, 2)} kW`;
  return `${num(value)} W`;
}

/** Watt-hours as either `840 Wh` or `14.6 kWh`. */
export function energy(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1000) return `${num(value / 1000, 2)} kWh`;
  return `${num(value)} Wh`;
}

export function duration(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "—";
  if (hours < 1) return `${num(hours * 60)} min`;
  return `${num(hours, 1)} h`;
}

const SYMBOLS: Record<string, string> = { BDT: "৳", USD: "$" };

export function money(value: number, currency = "BDT"): string {
  if (!Number.isFinite(value)) return "—";
  const symbol = SYMBOLS[currency] ?? "";
  return `${symbol}${num(Math.round(value))}`;
}

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

/** Parse a user-typed numeric field, tolerating blanks and stray characters. */
export function parseNum(raw: string, fallback = 0, min = 0, max = Infinity): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  if (cleaned === "") return fallback;
  const parsed = Number.parseFloat(cleaned);
  if (!Number.isFinite(parsed)) return fallback;
  return clamp(parsed, min, max);
}
