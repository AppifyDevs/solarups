import { APPLIANCES, GROUPS } from "@/lib/appliances";
import { ApplianceIcon, ListMagnifyingGlass } from "@/components/icons";
import { Bezel, Eyebrow } from "@/components/bezel";
import { Reveal } from "@/components/reveal";

export function Library() {
  return (
    <section id="library" className="scroll-mt-28 px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow icon={ListMagnifyingGlass}>The library</Eyebrow>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
            <h2 className="max-w-lg text-3xl leading-[1.05] sm:text-4xl">
              {APPLIANCES.length} appliances, already filled in.
            </h2>
            <p className="max-w-sm text-[13px] leading-relaxed text-mute">
              Typical running watts and start-up peaks for the gear most homes actually run. Every
              figure is editable once it is on your list.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((group, index) => {
            const items = APPLIANCES.filter((appliance) => appliance.group === group);
            if (items.length === 0) return null;
            return (
              <Reveal key={group} delay={index * 70}>
                <Bezel className="h-full" innerClassName="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-sm font-medium tracking-tight text-bone">{group}</h3>
                    <span className="font-mono text-[10px] text-mute-2">
                      {String(items.length).padStart(2, "0")}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2.5">
                    {items.map((appliance) => {
                      return (
                        <li key={appliance.id} className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-solar/85">
                            <ApplianceIcon icon={appliance.icon} size={13} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12px] text-bone/90">
                              {appliance.name}
                            </span>
                            <span className="block font-mono text-[10px] tabular-nums text-mute-2">
                              {appliance.watts} W · peak {appliance.surge} W
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </Bezel>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
