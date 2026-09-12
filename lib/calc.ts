import {
  APPLIANCE_BY_ID,
  DEFAULT_PRESET_ID,
  PRESETS,
  type IconKey,
  type PresetItem,
} from "./appliances";

export type LoadItem = {
  uid: string;
  applianceId: string;
  name: string;
  icon: IconKey;
  qty: number;
  /** Running watts for one unit. */
  watts: number;
  /** Start-up / peak watts for one unit. */
  surge: number;
  /** Hours of use per day. */
  hours: number;
};

export type Chemistry = "lead" | "lithium";

export type Settings = {
  powerFactor: number;
  inverterEfficiency: number;
  inverterHeadroom: number;
  autonomyHours: number;
  chemistry: Chemistry;
  systemVoltage: "auto" | 12 | 24 | 48;
  moduleAh: number;
  panelWatt: number;
  peakSunHours: number;
  systemDerate: number;
  controllerHeadroom: number;
  currency: "BDT" | "USD";
  costInverterPerVa: number;
  costBatteryPerUnit: number;
  costPanelPerWp: number;
  costBos: number;
};

/** Off-the-shelf inverter / hybrid UPS ratings, in VA. */
export const INVERTER_SIZES = [
  600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 8000, 10000,
  12500, 15000,
];

export const DOD: Record<Chemistry, number> = { lead: 0.5, lithium: 0.8 };

export const DEFAULT_SETTINGS: Settings = {
  powerFactor: 0.8,
  inverterEfficiency: 0.9,
  inverterHeadroom: 1.25,
  autonomyHours: 4,
  chemistry: "lead",
  systemVoltage: "auto",
  moduleAh: 200,
  panelWatt: 550,
  peakSunHours: 4.5,
  systemDerate: 0.75,
  controllerHeadroom: 1.25,
  currency: "BDT",
  costInverterPerVa: 22,
  costBatteryPerUnit: 24000,
  costPanelPerWp: 32,
  costBos: 25000,
};

let uidCounter = 0;

export function makeUid(): string {
  uidCounter += 1;
  return `u${uidCounter.toString(36)}${Date.now().toString(36).slice(-4)}`;
}

export function loadFromAppliance(
  applianceId: string,
  qty?: number,
  hours?: number,
  uid?: string,
): LoadItem {
  const appliance = APPLIANCE_BY_ID.get(applianceId) ?? APPLIANCES_FALLBACK;
  return {
    uid: uid ?? makeUid(),
    applianceId: appliance.id,
    name: appliance.name,
    icon: appliance.icon,
    qty: qty ?? appliance.qty,
    watts: appliance.watts,
    surge: appliance.surge,
    hours: hours ?? appliance.hours,
  };
}

const APPLIANCES_FALLBACK = {
  id: "custom",
  name: "Custom appliance",
  icon: "light" as IconKey,
  watts: 100,
  surge: 100,
  hours: 4,
  group: "Home" as const,
  qty: 1,
};

export function buildLoads(items: PresetItem[], tag: string): LoadItem[] {
  return items.map((item, index) =>
    loadFromAppliance(item.applianceId, item.qty, item.hours, `${tag}:${index}`),
  );
}

export function defaultLoads(): LoadItem[] {
  const preset = PRESETS.find((p) => p.id === DEFAULT_PRESET_ID) ?? PRESETS[0];
  return buildLoads(preset.items, preset.id);
}

export type Breakdown = {
  uid: string;
  name: string;
  icon: IconKey;
  watts: number;
  dailyWh: number;
  share: number;
  surgeDelta: number;
};

export type Insight = {
  tone: "info" | "warn" | "good";
  text: string;
};

export type Result = {
  runningW: number;
  surgeW: number;
  dailyWh: number;
  surgeDeltaW: number;

  continuousVA: number;
  surgeVA: number;
  /** Surge-safe rating: carries the worst-case simultaneous start without leaning on short-term surge headroom. */
  requiredVA: number;
  /** What you'd need if you never started everything at once. */
  leanVA: number;
  recommendedVA: number;
  oversizeVA: boolean;
  utilization: number;
  inverterW: number;

  systemVoltage: number;
  voltageAuto: boolean;

  usableWhNeeded: number;
  dod: number;
  bankWh: number;
  bankAh: number;
  seriesCount: number;
  parallelCount: number;
  batteryCount: number;
  installedBankAh: number;
  installedBankWh: number;
  usableInstalledWh: number;
  runtimeHours: number;

  arrayWp: number;
  panelCount: number;
  installedWp: number;
  controllerAmps: number;
  dailyGenerationWh: number;
  coverage: number;

  costInverter: number;
  costBattery: number;
  costPanel: number;
  costBos: number;
  costTotal: number;

  breakdown: Breakdown[];
  insights: Insight[];
};

function pickInverter(requiredVA: number): number {
  const match = INVERTER_SIZES.find((size) => size >= requiredVA);
  if (match) return match;
  return Math.ceil(requiredVA / 1000) * 1000;
}

function resolveVoltage(choice: Settings["systemVoltage"], requiredVA: number): number {
  if (choice !== "auto") return choice;
  if (requiredVA <= 1500) return 12;
  if (requiredVA <= 3500) return 24;
  return 48;
}

export function compute(loads: LoadItem[], settings: Settings): Result {
  const runningW = loads.reduce((total, l) => total + l.qty * l.watts, 0);
  const surgeW = loads.reduce((total, l) => total + l.qty * l.surge, 0);
  const dailyWh = loads.reduce((total, l) => total + l.qty * l.watts * l.hours, 0);
  const surgeDeltaW = Math.max(0, surgeW - runningW);

  const continuousVA = runningW / settings.powerFactor;
  const surgeVA = surgeW / settings.powerFactor;
  const leanVA = continuousVA * settings.inverterHeadroom;
  const requiredVA = Math.max(leanVA, surgeVA);
  const recommendedVA = pickInverter(requiredVA);
  const oversizeVA = recommendedVA < requiredVA;
  const inverterW = recommendedVA * settings.powerFactor;
  const utilization = inverterW > 0 ? runningW / inverterW : 0;

  const voltageAuto = settings.systemVoltage === "auto";
  const systemVoltage = resolveVoltage(settings.systemVoltage, requiredVA);

  const usableWhNeeded = (runningW * settings.autonomyHours) / settings.inverterEfficiency;
  const dod = DOD[settings.chemistry];
  const bankWh = usableWhNeeded / dod;
  const bankAh = systemVoltage > 0 ? bankWh / systemVoltage : 0;
  const seriesCount = Math.max(1, Math.round(systemVoltage / 12));
  const parallelCount = Math.max(1, Math.ceil(bankAh / settings.moduleAh));
  const installedBankAh = parallelCount * settings.moduleAh;
  const installedBankWh = installedBankAh * systemVoltage;
  const usableInstalledWh = installedBankWh * dod * settings.inverterEfficiency;
  const batteryCount = seriesCount * parallelCount;
  const runtimeHours = runningW > 0 ? usableInstalledWh / runningW : 0;

  const arrayWp = dailyWh / (settings.peakSunHours * settings.systemDerate);
  const panelCount = dailyWh > 0 ? Math.max(1, Math.ceil(arrayWp / settings.panelWatt)) : 0;
  const installedWp = panelCount * settings.panelWatt;
  const controllerAmps = systemVoltage > 0 ? (installedWp / systemVoltage) * settings.controllerHeadroom : 0;
  const dailyGenerationWh = installedWp * settings.peakSunHours * settings.systemDerate;
  const coverage = dailyWh > 0 ? dailyGenerationWh / dailyWh : 0;

  const costInverter = recommendedVA * settings.costInverterPerVa;
  const costBattery = batteryCount * settings.costBatteryPerUnit;
  const costPanel = installedWp * settings.costPanelPerWp;
  const costBos = settings.costBos;
  const costTotal = costInverter + costBattery + costPanel + costBos;

  const breakdown: Breakdown[] = loads
    .map((l) => {
      const watts = l.qty * l.watts;
      const day = watts * l.hours;
      return {
        uid: l.uid,
        name: l.name,
        icon: l.icon,
        watts,
        dailyWh: day,
        share: dailyWh > 0 ? day / dailyWh : 0,
        surgeDelta: Math.max(0, l.qty * (l.surge - l.watts)),
      };
    })
    .sort((a, b) => b.dailyWh - a.dailyWh);

  const insights = buildInsights({
    loads,
    runningW,
    surgeW,
    surgeDeltaW,
    dailyWh,
    requiredVA,
    recommendedVA,
    oversizeVA,
    bankAh,
    systemVoltage,
    autonomyHours: settings.autonomyHours,
    chemistry: settings.chemistry,
    controllerAmps,
    breakdown,
    coverage,
  });

  return {
    runningW,
    surgeW,
    dailyWh,
    surgeDeltaW,
    continuousVA,
    surgeVA,
    requiredVA,
    leanVA,
    recommendedVA,
    oversizeVA,
    utilization,
    inverterW,
    systemVoltage,
    voltageAuto,
    usableWhNeeded,
    dod,
    bankWh,
    bankAh,
    seriesCount,
    parallelCount,
    batteryCount,
    installedBankAh,
    installedBankWh,
    usableInstalledWh,
    runtimeHours,
    arrayWp,
    panelCount,
    installedWp,
    controllerAmps,
    dailyGenerationWh,
    coverage,
    costInverter,
    costBattery,
    costPanel,
    costBos,
    costTotal,
    breakdown,
    insights,
  };
}

function buildInsights(input: {
  loads: LoadItem[];
  runningW: number;
  surgeW: number;
  surgeDeltaW: number;
  dailyWh: number;
  requiredVA: number;
  recommendedVA: number;
  oversizeVA: boolean;
  bankAh: number;
  systemVoltage: number;
  autonomyHours: number;
  chemistry: Chemistry;
  controllerAmps: number;
  breakdown: Breakdown[];
  coverage: number;
}): Insight[] {
  const out: Insight[] = [];

  if (input.loads.length === 0 || input.dailyWh === 0) {
    out.push({
      tone: "info",
      text: "Add at least one appliance with running hours to see a sizing recommendation.",
    });
    return out;
  }

  const topSurge = [...input.breakdown].sort((a, b) => b.surgeDelta - a.surgeDelta)[0];
  if (topSurge && input.surgeDeltaW > 0 && topSurge.surgeDelta / input.surgeDeltaW > 0.45) {
    out.push({
      tone: "info",
      text: `${topSurge.name} drives ${Math.round((topSurge.surgeDelta / input.surgeDeltaW) * 100)}% of your start-up surge. Staggering its start lets you size a smaller inverter.`,
    });
  }

  if (input.oversizeVA) {
    out.push({
      tone: "warn",
      text: `This load needs about ${Math.round(input.requiredVA)} VA, beyond the largest single unit listed. Plan for parallel inverters or split the load across circuits.`,
    });
  }

  if (input.bankAh > 600) {
    out.push({
      tone: "warn",
      text: `A ${Math.round(input.bankAh)} Ah bank at ${input.systemVoltage} V means very heavy DC cabling. A higher system voltage halves the current for the same energy.`,
    });
  }

  if (input.autonomyHours > 8 && input.chemistry === "lead") {
    out.push({
      tone: "info",
      text: "Beyond roughly 8 hours of autonomy, lead-acid gets expensive per usable kWh. Lithium or a solar-first setup usually works out cheaper.",
    });
  }

  if (input.controllerAmps > 100) {
    out.push({
      tone: "info",
      text: `The array implies about ${Math.round(input.controllerAmps)} A of charge current — plan for parallel charge controllers rather than one oversized unit.`,
    });
  }

  if (input.coverage >= 1) {
    out.push({
      tone: "good",
      text: "The array covers 100% of your estimated daily consumption, with the surplus going into the bank.",
    });
  }

  return out.slice(0, 4);
}
