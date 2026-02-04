import { User, Child, Medication, Event } from '@/types/stepio';
import { HeroCard } from '@/components/home/HeroCard';
import { MedicationStatus } from '@/components/home/MedicationStatus';
import { WeekAgenda } from '@/components/home/WeekAgenda';
import { MotivationalFooter } from '@/components/home/MotivationalFooter';
import stepioLogo from '@/assets/stepio-logo.png';

interface HomeProps {
  user: User;
  child: Child;
  medications: Medication[];
  events: Event[];
}

export function Home({ user, child, medications, events }: HomeProps) {
  return (
    <div className="pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src={stepioLogo} alt="Stepio" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold text-primary">Stepio</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
          {user.photo ? (
            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg">👩</span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="px-4 space-y-4">
        <HeroCard user={user} child={child} />
        <MedicationStatus medications={medications} />
        <WeekAgenda events={events} />
        <MotivationalFooter />
      </main>
    </div>
  );
}
