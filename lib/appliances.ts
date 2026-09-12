export type IconKey =
  | "ac"
  | "fan"
  | "fridge"
  | "light"
  | "lamp"
  | "rice"
  | "pc"
  | "monitor"
  | "router"
  | "tv"
  | "laptop"
  | "washer"
  | "pump"
  | "oven"
  | "speaker"
  | "iron"
  | "heater"
  | "kettle"
  | "camera"
  | "console"
  | "hairdryer";

export type Group = "Cooling" | "Kitchen" | "Lighting" | "Work" | "Network" | "Home";

export type Appliance = {
  id: string;
  name: string;
  icon: IconKey;
  /** Running watts for one unit. */
  watts: number;
  /** Start-up / peak watts for one unit (motor inrush, compressor kick). */
  surge: number;
  /** Typical hours of use per day. */
  hours: number;
  group: Group;
  /** Sensible starting quantity when added to a load list. */
  qty: number;
  note?: string;
};

export const APPLIANCES: Appliance[] = [
  {
    id: "ac-inverter-1t",
    name: "1 Ton inverter AC",
    icon: "ac",
    watts: 690,
    surge: 1000,
    hours: 8,
    group: "Cooling",
    qty: 1,
    note: "Rated draw; inverter compressors ramp instead of slamming on.",
  },
  {
    id: "ac-inverter-1.5t",
    name: "1.5 Ton inverter AC",
    icon: "ac",
    watts: 1000,
    surge: 1500,
    hours: 8,
    group: "Cooling",
    qty: 1,
  },
  {
    id: "ac-noninverter-1t",
    name: "1 Ton non-inverter AC",
    icon: "ac",
    watts: 1100,
    surge: 3300,
    hours: 8,
    group: "Cooling",
    qty: 1,
    note: "Fixed-speed compressors pull roughly 3x rated watts on start.",
  },
  {
    id: "ceiling-fan",
    name: "Ceiling fan",
    icon: "fan",
    watts: 60,
    surge: 85,
    hours: 12,
    group: "Cooling",
    qty: 3,
  },
  {
    id: "table-fan",
    name: "Table / pedestal fan",
    icon: "fan",
    watts: 45,
    surge: 65,
    hours: 8,
    group: "Cooling",
    qty: 1,
  },
  {
    id: "fridge-165",
    name: "Fridge, 165 L",
    icon: "fridge",
    watts: 63,
    surge: 400,
    hours: 24,
    group: "Kitchen",
    qty: 1,
    note: "Compressor cycles, so the surge figure matters more than the average.",
  },
  {
    id: "fridge-300",
    name: "Fridge, 300 L",
    icon: "fridge",
    watts: 100,
    surge: 600,
    hours: 24,
    group: "Kitchen",
    qty: 1,
  },
  {
    id: "led-light",
    name: "LED light",
    icon: "light",
    watts: 12,
    surge: 12,
    hours: 6,
    group: "Lighting",
    qty: 5,
  },
  {
    id: "led-tube",
    name: "LED tube light",
    icon: "lamp",
    watts: 18,
    surge: 18,
    hours: 6,
    group: "Lighting",
    qty: 2,
  },
  {
    id: "rice-cooker",
    name: "Rice cooker",
    icon: "rice",
    watts: 600,
    surge: 700,
    hours: 1,
    group: "Kitchen",
    qty: 1,
  },
  {
    id: "microwave",
    name: "Microwave oven",
    icon: "oven",
    watts: 1200,
    surge: 1200,
    hours: 0.5,
    group: "Kitchen",
    qty: 1,
  },
  {
    id: "pc-dual-monitor",
    name: "PC + 2 × 27\u2033 monitor",
    icon: "pc",
    watts: 450,
    surge: 750,
    hours: 8,
    group: "Work",
    qty: 1,
    note: "Powers spike during gaming or rendering loads.",
  },
  {
    id: "laptop",
    name: "Laptop",
    icon: "laptop",
    watts: 65,
    surge: 90,
    hours: 8,
    group: "Work",
    qty: 1,
  },
  {
    id: "monitor",
    name: "Extra 27\u2033 monitor",
    icon: "monitor",
    watts: 30,
    surge: 30,
    hours: 8,
    group: "Work",
    qty: 1,
  },
  {
    id: "router-onu",
    name: "Router / ONU",
    icon: "router",
    watts: 10,
    surge: 10,
    hours: 24,
    group: "Network",
    qty: 3,
    note: "Runs around the clock, so it drives daily energy more than peak load.",
  },
  {
    id: "led-tv",
    name: "LED TV, 43\u2033",
    icon: "tv",
    watts: 60,
    surge: 60,
    hours: 5,
    group: "Home",
    qty: 1,
  },
  {
    id: "sound-system",
    name: "Speaker / sound system",
    icon: "speaker",
    watts: 80,
    surge: 80,
    hours: 3,
    group: "Home",
    qty: 1,
  },
  {
    id: "washing-machine",
    name: "Washing machine",
    icon: "washer",
    watts: 500,
    surge: 1200,
    hours: 1,
    group: "Home",
    qty: 1,
  },
  {
    id: "water-pump-0.5hp",
    name: "Water pump, 0.5 HP",
    icon: "pump",
    watts: 370,
    surge: 1100,
    hours: 1,
    group: "Home",
    qty: 1,
  },
  {
    id: "water-pump-1hp",
    name: "Water pump, 1 HP",
    icon: "pump",
    watts: 750,
    surge: 2200,
    hours: 1,
    group: "Home",
    qty: 1,
  },
  {
    id: "deep-freezer",
    name: "Deep freezer",
    icon: "fridge",
    watts: 200,
    surge: 900,
    hours: 24,
    group: "Kitchen",
    qty: 1,
    note: "Compressor surge dominates sizing, like the fridge.",
  },
  {
    id: "electric-kettle",
    name: "Electric kettle",
    icon: "kettle",
    watts: 1500,
    surge: 1500,
    hours: 0.15,
    group: "Kitchen",
    qty: 1,
  },
  {
    id: "toaster",
    name: "Toaster",
    icon: "kettle",
    watts: 800,
    surge: 800,
    hours: 0.1,
    group: "Kitchen",
    qty: 1,
  },
  {
    id: "blender",
    name: "Blender / mixer grinder",
    icon: "kettle",
    watts: 400,
    surge: 600,
    hours: 0.2,
    group: "Kitchen",
    qty: 1,
  },
  {
    id: "induction-cooktop",
    name: "Induction cooktop",
    icon: "oven",
    watts: 2000,
    surge: 2000,
    hours: 1,
    group: "Kitchen",
    qty: 1,
    note: "Draws close to rated power for the whole cook, unlike a microwave's short burst.",
  },
  {
    id: "exhaust-fan",
    name: "Exhaust fan",
    icon: "fan",
    watts: 50,
    surge: 70,
    hours: 4,
    group: "Cooling",
    qty: 1,
  },
  {
    id: "air-cooler",
    name: "Air cooler",
    icon: "fan",
    watts: 200,
    surge: 300,
    hours: 8,
    group: "Cooling",
    qty: 1,
  },
  {
    id: "geyser-instant",
    name: "Instant water heater (geyser)",
    icon: "heater",
    watts: 3000,
    surge: 3000,
    hours: 0.2,
    group: "Home",
    qty: 1,
    note: "One of the heaviest loads in the house; size the inverter around it separately if used.",
  },
  {
    id: "geyser-storage",
    name: "Storage water heater (geyser)",
    icon: "heater",
    watts: 1500,
    surge: 1500,
    hours: 1,
    group: "Home",
    qty: 1,
  },
  {
    id: "electric-iron",
    name: "Electric iron",
    icon: "iron",
    watts: 1000,
    surge: 1000,
    hours: 0.3,
    group: "Home",
    qty: 1,
  },
  {
    id: "hair-dryer",
    name: "Hair dryer",
    icon: "hairdryer",
    watts: 1200,
    surge: 1200,
    hours: 0.1,
    group: "Home",
    qty: 1,
  },
  {
    id: "cctv-4ch",
    name: "CCTV system, 4-channel",
    icon: "camera",
    watts: 40,
    surge: 40,
    hours: 24,
    group: "Network",
    qty: 1,
    note: "NVR plus cameras run around the clock, similar to the router.",
  },
  {
    id: "gaming-console",
    name: "Gaming console",
    icon: "console",
    watts: 150,
    surge: 200,
    hours: 3,
    group: "Work",
    qty: 1,
  },
];

export const APPLIANCE_BY_ID = new Map(APPLIANCES.map((a) => [a.id, a]));

export const GROUPS: Group[] = [
  "Cooling",
  "Kitchen",
  "Lighting",
  "Work",
  "Network",
  "Home",
];

export type PresetItem = { applianceId: string; qty: number; hours: number };

export type Preset = {
  id: string;
  name: string;
  blurb: string;
  items: PresetItem[];
};

export const PRESETS: Preset[] = [
  {
    id: "as-pictured",
    name: "Home — as listed",
    blurb: "The exact appliance list from the reference table: one AC, three fans, a fridge, lights, a rice cooker, a PC and the network gear.",
    items: [
      { applianceId: "ac-inverter-1t", qty: 1, hours: 8 },
      { applianceId: "ceiling-fan", qty: 3, hours: 12 },
      { applianceId: "fridge-165", qty: 1, hours: 24 },
      { applianceId: "led-light", qty: 5, hours: 6 },
      { applianceId: "rice-cooker", qty: 1, hours: 1 },
      { applianceId: "pc-dual-monitor", qty: 1, hours: 8 },
      { applianceId: "router-onu", qty: 3, hours: 24 },
    ],
  },
  {
    id: "essentials",
    name: "Load-shedding essentials",
    blurb: "A small bank that keeps fans, lights, the fridge and the internet alive through a cut.",
    items: [
      { applianceId: "ceiling-fan", qty: 2, hours: 12 },
      { applianceId: "led-light", qty: 4, hours: 6 },
      { applianceId: "fridge-165", qty: 1, hours: 24 },
      { applianceId: "router-onu", qty: 3, hours: 24 },
      { applianceId: "laptop", qty: 1, hours: 8 },
      { applianceId: "led-tv", qty: 1, hours: 5 },
    ],
  },
  {
    id: "work-desk",
    name: "Work-from-home desk",
    blurb: "A full workstation plus the comforts that make a long day bearable.",
    items: [
      { applianceId: "pc-dual-monitor", qty: 1, hours: 8 },
      { applianceId: "monitor", qty: 1, hours: 8 },
      { applianceId: "laptop", qty: 1, hours: 8 },
      { applianceId: "router-onu", qty: 3, hours: 24 },
      { applianceId: "led-light", qty: 3, hours: 6 },
      { applianceId: "ceiling-fan", qty: 1, hours: 12 },
      { applianceId: "ac-inverter-1t", qty: 1, hours: 6 },
    ],
  },
  {
    id: "whole-home",
    name: "Whole home + AC",
    blurb: "Everything running on solar: cooling, kitchen, laundry, the pump and the network.",
    items: [
      { applianceId: "ac-inverter-1t", qty: 1, hours: 8 },
      { applianceId: "ceiling-fan", qty: 4, hours: 12 },
      { applianceId: "fridge-300", qty: 1, hours: 24 },
      { applianceId: "led-light", qty: 8, hours: 6 },
      { applianceId: "led-tube", qty: 3, hours: 6 },
      { applianceId: "rice-cooker", qty: 1, hours: 1 },
      { applianceId: "microwave", qty: 1, hours: 0.5 },
      { applianceId: "pc-dual-monitor", qty: 1, hours: 8 },
      { applianceId: "router-onu", qty: 3, hours: 24 },
      { applianceId: "led-tv", qty: 1, hours: 5 },
      { applianceId: "washing-machine", qty: 1, hours: 1 },
      { applianceId: "water-pump-0.5hp", qty: 1, hours: 1 },
    ],
  },
];

export const DEFAULT_PRESET_ID = "as-pictured";
