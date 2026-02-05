import { User, Child, Medication, Event } from "@/types/stepio";
import { HeroCard } from "@/components/home/HeroCard";
import { MedicationStatus } from "@/components/home/MedicationStatus";
import { WeekAgenda } from "@/components/home/WeekAgenda";
import { MotivationalFooter } from "@/components/home/MotivationalFooter";
import stepioLogo from "@/assets/stepio-logo-3d.png";

const avatarMap: Record<string, string> = {
  "avatar:girl": "👧",
  "avatar:boy": "👦",
  "avatar:pet": "🐶",
};

const getAvatarEmoji = (value?: string) => avatarMap[value ?? ""] ?? "👩";

interface HomeProps {
  user: User;
  child: Child;
  medications: Medication[];
  events: Event[];
}

export function Home({ user, child, medications, events }: HomeProps) {
  const genderClass =
    child.gender === "menina"
      ? "stepio-header-girl"
      : child.gender === "menino"
        ? "stepio-header-boy"
        : "stepio-header-neutral";
  return (
    <div className="pb-24">
      <header className={`stepio-header stepio-header-lg ${genderClass}`}>
        <div className="stepio-header-wave" />
        <div className="stepio-header-content flex flex-col items-center justify-center gap-3 text-center">
          <img
            src={stepioLogo}
            alt="Stepio"
            className="w-24 h-24 object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]"
          />
          <span className="text-2xl font-bold text-primary">Stepio</span>
          <span className="mt-7 text-sm font-semibold text-slate-900/80">
            Cuidado, rotina e progresso do seu filho
          </span>
        </div>
      </header>

      <main className="px-4 space-y-4">
        <HeroCard user={user} child={child} />
        <MedicationStatus medications={medications} />
        <WeekAgenda events={events} />
        <MotivationalFooter />
      </main>
    </div>
  );
}
