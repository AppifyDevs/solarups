"use client";

import { ArrowCounterClockwise } from "@phosphor-icons/react/dist/csr/ArrowCounterClockwise";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { ArrowUpRight } from "@phosphor-icons/react/dist/csr/ArrowUpRight";
import { BatteryCharging } from "@phosphor-icons/react/dist/csr/BatteryCharging";
import { BatteryMedium } from "@phosphor-icons/react/dist/csr/BatteryMedium";
import { Broadcast } from "@phosphor-icons/react/dist/csr/Broadcast";
import { CaretDown } from "@phosphor-icons/react/dist/csr/CaretDown";
import { ChartLine } from "@phosphor-icons/react/dist/csr/ChartLine";
import { Check } from "@phosphor-icons/react/dist/csr/Check";
import { CircleNotch } from "@phosphor-icons/react/dist/csr/CircleNotch";
import { CookingPot } from "@phosphor-icons/react/dist/csr/CookingPot";
import { Copy } from "@phosphor-icons/react/dist/csr/Copy";
import { Desktop } from "@phosphor-icons/react/dist/csr/Desktop";
import { Drop } from "@phosphor-icons/react/dist/csr/Drop";
import { Fan } from "@phosphor-icons/react/dist/csr/Fan";
import { Flame } from "@phosphor-icons/react/dist/csr/Flame";
import { Function as FunctionIcon } from "@phosphor-icons/react/dist/csr/Function";
import { GameController } from "@phosphor-icons/react/dist/csr/GameController";
import { Gauge } from "@phosphor-icons/react/dist/csr/Gauge";
import { HairDryer } from "@phosphor-icons/react/dist/csr/HairDryer";
import { House } from "@phosphor-icons/react/dist/csr/House";
import { Info } from "@phosphor-icons/react/dist/csr/Info";
import { Lamp } from "@phosphor-icons/react/dist/csr/Lamp";
import { Laptop } from "@phosphor-icons/react/dist/csr/Laptop";
import { Lightbulb } from "@phosphor-icons/react/dist/csr/Lightbulb";
import { Lightning } from "@phosphor-icons/react/dist/csr/Lightning";
import { ListMagnifyingGlass } from "@phosphor-icons/react/dist/csr/ListMagnifyingGlass";
import { Monitor } from "@phosphor-icons/react/dist/csr/Monitor";
import { Oven } from "@phosphor-icons/react/dist/csr/Oven";
import { Plug } from "@phosphor-icons/react/dist/csr/Plug";
import { Plus } from "@phosphor-icons/react/dist/csr/Plus";
import { Printer } from "@phosphor-icons/react/dist/csr/Printer";
import { SecurityCamera } from "@phosphor-icons/react/dist/csr/SecurityCamera";
import { ShareNetwork } from "@phosphor-icons/react/dist/csr/ShareNetwork";
import { ShirtFolded } from "@phosphor-icons/react/dist/csr/ShirtFolded";
import { SlidersHorizontal } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { Snowflake } from "@phosphor-icons/react/dist/csr/Snowflake";
import { SolarPanel } from "@phosphor-icons/react/dist/csr/SolarPanel";
import { SpeakerHigh } from "@phosphor-icons/react/dist/csr/SpeakerHigh";
import { Sun } from "@phosphor-icons/react/dist/csr/Sun";
import { SunHorizon } from "@phosphor-icons/react/dist/csr/SunHorizon";
import { Television } from "@phosphor-icons/react/dist/csr/Television";
import { ThermometerCold } from "@phosphor-icons/react/dist/csr/ThermometerCold";
import { Trash } from "@phosphor-icons/react/dist/csr/Trash";
import { Warning } from "@phosphor-icons/react/dist/csr/Warning";
import { WashingMachine } from "@phosphor-icons/react/dist/csr/WashingMachine";
import { WaveSine } from "@phosphor-icons/react/dist/csr/WaveSine";
import { X } from "@phosphor-icons/react/dist/csr/X";

import type { IconKey } from "@/lib/appliances";

export type PhosphorIcon = React.ComponentType<{
  size?: number | string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  className?: string;
  "aria-hidden"?: boolean;
}>;

export const APPLIANCE_ICONS: Record<IconKey, PhosphorIcon> = {
  ac: Snowflake,
  fan: Fan,
  fridge: ThermometerCold,
  light: Lightbulb,
  lamp: Lamp,
  rice: CookingPot,
  pc: Desktop,
  monitor: Monitor,
  router: Broadcast,
  tv: Television,
  laptop: Laptop,
  washer: WashingMachine,
  pump: Drop,
  oven: Oven,
  speaker: SpeakerHigh,
};

export {
  ArrowCounterClockwise,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  BatteryMedium,
  CaretDown,
  ChartLine,
  Check,
  CircleNotch,
  Copy,
  FunctionIcon,
  Gauge,
  House,
  Info,
  Lightning,
  ListMagnifyingGlass,
  Plus,
  Printer,
  ShareNetwork,
  SlidersHorizontal,
  SolarPanel,
  Sun,
  SunHorizon,
  Trash,
  Warning,
  WaveSine,
  X,
};
