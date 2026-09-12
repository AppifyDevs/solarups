"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { ArrowUpRight, SolarPanel } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "#calculator", label: "Calculator" },
  { href: "#library", label: "Appliances" },
  { href: "#method", label: "Method" },
  { href: "#reference", label: "Reference" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
        <nav
          aria-label="Main"
          className="flex w-full max-w-5xl items-center justify-between gap-3 rounded-full border border-white/[0.09] bg-ink/85 py-2 pr-2 pl-4 shadow-[0_20px_50px_-30px_var(--nav-shadow)] backdrop-blur-2xl"
        >
          <a href="#top" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-solar/12 text-solar ring-1 ring-solar/25">
              <SolarPanel size={15} weight="light" aria-hidden />
            </span>
            <span className="font-display text-sm tracking-tight text-bone">Solor</span>
          </a>

          <div className="hidden items-center gap-0.5 md:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-3.5 py-1.5 text-xs text-bone/85 transition-colors duration-500 ease-fluid hover:bg-white/[0.06] hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#calculator"
              className="group/btn hidden items-center gap-2 rounded-full bg-solar py-1.5 pr-1.5 pl-4 text-xs font-medium text-ink transition-transform duration-500 ease-fluid active:scale-[0.97] md:flex"
            >
              Size my system
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/12 transition-transform duration-500 ease-fluid group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px">
                <ArrowUpRight size={12} weight="light" aria-hidden />
              </span>
            </a>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/[0.08] transition-colors duration-500 ease-fluid hover:bg-white/[0.1] md:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-4 bg-bone transition-transform duration-500 ease-fluid",
                  open ? "rotate-45" : "-translate-y-1",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-4 bg-bone transition-transform duration-500 ease-fluid",
                  open ? "-rotate-45" : "translate-y-1",
                )}
              />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-center gap-1 bg-ink/85 px-8 backdrop-blur-3xl transition-opacity duration-700 ease-fluid md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        {LINKS.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            style={{
              transitionDelay: open ? `${140 + index * 55}ms` : "0ms",
            }}
            className={cn(
              "font-display border-b border-white/[0.06] py-4 text-3xl tracking-tight text-bone transition-all duration-700 ease-fluid",
              open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
            )}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#calculator"
          onClick={() => setOpen(false)}
          style={{ transitionDelay: open ? `${140 + LINKS.length * 55}ms` : "0ms" }}
          className={cn(
            "mt-6 flex w-max items-center gap-2 rounded-full bg-solar py-2.5 pr-2.5 pl-5 text-sm font-medium text-ink transition-all duration-700 ease-fluid",
            open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
          )}
        >
          Size my system
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink/12">
            <ArrowUpRight size={13} weight="light" aria-hidden />
          </span>
        </a>
      </div>
    </>
  );
}
