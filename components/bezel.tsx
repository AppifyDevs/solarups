import { cn } from "@/lib/cn";
import type { PhosphorIcon } from "@/components/icons";

type BezelProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: "default" | "solar" | "flat";
  radius?: "lg" | "sm";
};

const OUTER_TONE = {
  default: "bg-white/[0.028] ring-white/[0.07]",
  solar: "bg-solar/[0.07] ring-solar/25",
  flat: "bg-white/[0.015] ring-white/[0.05]",
};

const INNER_TONE = {
  default: "bg-ink-2",
  solar: "bezel-solar-bg",
  flat: "bg-ink-2/60",
};

export function Bezel({
  children,
  className,
  innerClassName,
  tone = "default",
  radius = "lg",
}: BezelProps) {
  const outerRadius = radius === "lg" ? "rounded-[2rem]" : "rounded-[1.4rem]";
  const innerRadius =
    radius === "lg" ? "rounded-[calc(2rem-0.375rem)]" : "rounded-[calc(1.4rem-0.3rem)]";

  return (
    <div
      className={cn(
        "p-1.5 ring-1 backdrop-blur-none",
        outerRadius,
        OUTER_TONE[tone],
        className,
      )}
    >
      <div
        className={cn(
          "inner-hi h-full ring-1 ring-white/[0.04]",
          innerRadius,
          INNER_TONE[tone],
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Eyebrow({
  children,
  className,
  icon: Icon,
}: {
  children: React.ReactNode;
  className?: string;
  icon?: PhosphorIcon;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-bone/70 uppercase ring-1 ring-white/[0.07]",
        className,
      )}
    >
      {Icon ? <Icon size={12} weight="light" aria-hidden /> : null}
      {children}
    </span>
  );
}
