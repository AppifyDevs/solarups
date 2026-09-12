import { ArrowRight, SolarPanel } from "@/components/icons";
import { Bezel } from "@/components/bezel";

const LINKS = [
  { href: "#calculator", label: "Calculator" },
  { href: "#library", label: "Appliance library" },
  { href: "#method", label: "Method" },
  { href: "#leaderboard", label: "Leaderboard" },
  { href: "#faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="px-4 pt-8 pb-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Bezel tone="solar" radius="lg" innerClassName="p-6 sm:p-9">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-md">
              <h2 className="text-2xl leading-tight sm:text-3xl">
                Ready to stop guessing?
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-bone/80">
                Your list is saved in this browser, and the share link carries the whole
                configuration to whoever is quoting your hardware.
              </p>
            </div>
            <a
              href="#calculator"
              className="group/btn flex items-center gap-2.5 rounded-full bg-solar py-2.5 pr-2.5 pl-6 text-sm font-medium text-ink transition-transform duration-500 ease-fluid active:scale-[0.97]"
            >
              Back to the calculator
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/12 transition-transform duration-500 ease-fluid group-hover/btn:translate-x-1 group-hover/btn:-translate-y-px group-hover/btn:scale-105">
                <ArrowRight size={14} weight="light" aria-hidden />
              </span>
            </a>
          </div>
        </Bezel>

        <div className="mt-10 grid gap-8 border-t border-white/[0.07] pt-8 sm:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-solar/12 text-solar ring-1 ring-solar/25">
                <SolarPanel size={15} weight="light" aria-hidden />
              </span>
              <span className="font-display text-sm tracking-tight text-bone">Solor</span>
            </div>
            <p className="mt-4 max-w-md text-[12px] leading-relaxed text-mute-2">
              A solar and UPS sizing calculator. Every output is an estimate derived from the
              assumptions you set — it is a planning tool, not a substitute for an installer
              checking your DC side, earthing and cable sizing on site.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2.5 sm:items-end">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[12px] text-mute transition-colors duration-500 ease-fluid hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-6">
          <p className="font-mono text-[10px] tracking-[0.1em] text-mute-2 uppercase">
            Estimates only · Solar · UPS · Bangladesh defaults
          </p>
          <p className="font-mono text-[10px] text-mute-2">
            Built with Next.js · no account, no tracking
          </p>
        </div>
      </div>
    </footer>
  );
}
