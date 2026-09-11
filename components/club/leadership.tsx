import Image from "next/image";
import { leadership } from "@/data/leadership";
import { SectionLabel } from "@/components/shared/typography";
import { Reveal } from "@/components/shared/reveal";

function PhotoFrame({
  monogram,
  image,
  alt,
  className,
}: {
  monogram: string;
  image: string | null | undefined;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`corner-ticks relative aspect-[3/4] w-full overflow-hidden border border-accent/25 bg-forge-navy/40 ${className ?? ""}`}
    >
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 480px"
          className="object-cover"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="bg-noise absolute inset-0 opacity-20" />
          <span className="type-display text-accent/30">{monogram}</span>
        </div>
      )}
    </div>
  );
}

export function LeadershipSection() {
  const { vicePrincipal, hod, coordinators } = leadership;
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-16 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionLabel>DEPARTMENT LEADERSHIP</SectionLabel>
              <span className="mono-label text-ivory-dim/60">
                SS ⟷ CK · ONE DEPARTMENT — TWO CLUBS
              </span>
            </div>
            <div className="h-px w-full bg-ivory-dim/15" />
          </div>
        </Reveal>

        <Reveal>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col items-center text-center">
              <PhotoFrame
                monogram="VP"
                image={vicePrincipal.image}
                alt={vicePrincipal.name}
                className="max-w-sm"
              />
              <p className="mono-label mt-5 text-accent/70">[VP]</p>
              <h2 className="type-heading mt-2 text-ivory">{vicePrincipal.name}</h2>
              <p className="mono-label text-accent">{vicePrincipal.position}</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <PhotoFrame
                monogram="HOD"
                image={hod.image}
                alt={hod.name}
                className="max-w-sm"
              />
              <p className="mono-label mt-5 text-accent/70">[HOD]</p>
              <h2 className="type-heading mt-2 text-ivory">{hod.name}</h2>
              <p className="mono-label text-accent">{hod.position}</p>
            </div>
          </div>
        </Reveal>

        <div className="mt-24">
          <Reveal>
            <div className="mb-10 flex flex-col gap-3">
              <SectionLabel>FACULTY COORDINATORS</SectionLabel>
              <div className="h-px w-full bg-ivory-dim/15" />
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coordinators.map((coordinator, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="corner-ticks hover-lift flex flex-col gap-5 border border-accent/20 bg-forge-navy/20 p-5 transition-colors hover:border-accent">
                  <PhotoFrame
                    monogram={String(i + 1).padStart(2, "0")}
                    image={coordinator.image}
                    alt={coordinator.name}
                  />
                  <div className="flex flex-col gap-2">
                    <h3 className="type-heading text-lg text-ivory">
                      {coordinator.name}
                    </h3>
                    <p className="mono-label text-accent">
                      {coordinator.position}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <p className="mt-20 text-center font-sans text-2xl font-light tracking-wide text-ivory sm:text-3xl">
            TWO CLUBS. <span className="text-accent">ONE DEPARTMENT.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}