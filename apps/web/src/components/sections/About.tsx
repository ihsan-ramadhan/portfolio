import { useEffect, useState } from "react";
import {
  MapPin,
  Terminal,
  Image as ImageIcon,
  Globe,
  Clock,
  Heart,
  Code2,
} from "lucide-react";
import SectionHeader from "../ui/SectionHeader";
import AnimatedSection from "../ui/AnimatedSection";
import ErrorState from "../ui/ErrorState";
import Skeleton from "../ui/Skeleton";
import type { Profile } from "../../types";
import { useSkills } from "../../hooks/use-skills";
import { useInterests } from "../../hooks/use-interests";

export default function About({
  profile,
  isLoading,
}: {
  profile?: Profile;
  isLoading: boolean;
}) {
  const [localTime, setLocalTime] = useState<string>("");
  const { data: skills = [], isLoading: isLoadingSkills, isError: isErrorSkills } = useSkills();
  const { data: interests = [], isLoading: isLoadingInterests, isError: isErrorInterests } = useInterests();

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setLocalTime(
        new Intl.DateTimeFormat("en-US", options).format(new Date()),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <section
        id="about"
        className="py-20 w-full border-t border-[var(--color-border)]"
      >
        <AnimatedSection>
          <SectionHeader icon={Terminal} title="whoami" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(120px,_auto)]">
            <Skeleton className="md:col-span-2 md:row-span-2 rounded-xl w-full min-h-[260px]" />
            <Skeleton className="md:col-span-1 md:row-span-2 rounded-xl w-full min-h-[260px]" />
            <Skeleton className="h-[120px] rounded-xl w-full" />
            <Skeleton className="h-[120px] rounded-xl w-full" />
            <Skeleton className="h-[120px] rounded-xl w-full" />
          </div>
        </AnimatedSection>
      </section>
    );
  }

  if (!profile) {
    return (
      <section
        id="about"
        className="py-20 w-full border-t border-[var(--color-border)]"
      >
        <AnimatedSection>
          <SectionHeader icon={Terminal} title="whoami" />
          <ErrorState message="Biography data is temporarily unavailable." />
        </AnimatedSection>
      </section>
    );
  }

  const highlightTech = [...skills]
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 6);

  return (
    <section
      id="about"
      className="py-20 w-full border-t border-[var(--color-border)]"
    >
      <AnimatedSection>
        <SectionHeader icon={Terminal} title="whoami" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(120px,_auto)]">
          {/* CARD 1: Bio / Introduction (Spans 2 cols, 2 rows) */}
          <div className="md:col-span-2 md:row-span-2 glass-panel hover-glow p-6 rounded-xl shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={16} className="text-[var(--color-primary)]" />
                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                  guest@ihsan-portfolio:~/bio
                </span>
              </div>
              <div className="text-[var(--color-text-muted)] leading-relaxed font-sans whitespace-pre-wrap text-sm md:text-base">
                {profile.bio}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)]">
              <span className="text-[var(--color-primary)] font-bold">~</span>
              <span>cat bio.txt</span>
            </div>
          </div>

          {/* CARD 2: Profile Photo (Spans 1 col, 2 rows) */}
          <div className="md:col-span-1 md:row-span-2 glass-panel hover-glow p-4 rounded-xl shadow-md flex flex-col justify-between">
            <div className="relative aspect-square w-full rounded-lg overflow-hidden flex items-center justify-center">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt="Ihsan"
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-text-muted)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg">
                  <ImageIcon
                    size={40}
                    className="mb-2 opacity-40 animate-pulse"
                  />
                  <span className="font-mono text-xs">/assets/profile.jpg</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <span className="font-sans font-bold text-[var(--color-text)] text-sm">
                Muhammad Ihsan Ramadhan
              </span>
              <span className="font-mono text-xs text-[var(--color-primary)]">
                {profile.headline || "Full Stack Developer"}
              </span>
            </div>
          </div>

          <div className="glass-panel hover-glow p-6 rounded-xl shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                /location
              </span>
              <Globe size={16} className="text-[var(--color-primary)]" />
            </div>
             <div className="mt-3 space-y-2">
               <div className="flex items-center gap-2 text-[var(--color-text-muted)] font-mono text-xs">
                 <MapPin
                   size={12}
                   className="text-[var(--color-primary)] shrink-0"
                 />
                 <span>
                   Location:{" "}
                   <span className="text-[var(--color-text)] font-semibold">
                     {profile.location || "Bandung, ID"}
                   </span>
                 </span>
               </div>
               {localTime && (
                 <div className="flex items-center gap-2 text-[var(--color-text-muted)] font-mono text-xs">
                   <Clock
                     size={12}
                     className="text-[var(--color-primary)] shrink-0"
                   />
                   <span>
                     Local Time:{" "}
                     <span className="text-[var(--color-text)] font-semibold">
                       {localTime}
                     </span>{" "}
                     (GMT+7)
                   </span>
                 </div>
               )}
             </div>
          </div>

          {/* CARD 4: Core Tech Highlights (Spans 1 col) */}
          <div className="glass-panel hover-glow p-6 rounded-xl shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                /stack.quick
              </span>
              <Code2 size={16} className="text-[var(--color-primary)]" />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {isErrorSkills ? (
                <ErrorState
                  message="Skills data is temporarily unavailable."
                  className="py-4 text-xs"
                />
              ) : isLoadingSkills ? (
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] animate-pulse">
                  {">"} loading skills...
                </span>
              ) : skills.length > 0 ? (
                highlightTech.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-1 bg-[var(--color-bg)] border border-[var(--color-border)] px-2.5 py-1 rounded-md text-[10px] font-mono text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-text)] transition-all duration-300"
                  >
                    <img
                      src={`https://cdn.simpleicons.org/${tech.icon || tech.name.toLowerCase()}/3b82f6`}
                      alt={tech.name}
                      className="w-3.5 h-3.5 object-contain"
                    />
                    <span>{tech.name}</span>
                  </div>
                ))
              ) : (
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  {">"} no skills found
                </span>
              )}
            </div>
          </div>

          {/* CARD 5: Interests / Hobbies (Spans 1 col) */}
          <div className="glass-panel hover-glow p-6 rounded-xl shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                /interests
              </span>
              <Heart size={16} className="text-[var(--color-primary)]" />
            </div>
            <div className="mt-3">
              {isErrorInterests ? (
                <ErrorState
                  message="Interests data is temporarily unavailable."
                  className="py-4 text-xs"
                />
              ) : isLoadingInterests ? (
                <span className="text-[10px] font-mono text-[var(--color-text-muted)] animate-pulse">
                  {">"} loading interests...
                </span>
              ) : interests.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((interest) => (
                    <span
                      key={interest.id}
                      className="px-2 py-0.5 rounded bg-[var(--color-bg)] text-[10px] font-mono text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-text)] transition-colors duration-300"
                    >
                      {interest.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  {">"} no interests found
                </span>
              )}
              <p className="font-mono text-[9px] text-[var(--color-text-muted)] mt-2 leading-relaxed">
                Primary areas of curiosity and building.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
