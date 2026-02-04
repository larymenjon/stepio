import { User, Child } from '@/types/stepio';
import { calculateAge } from '@/utils/ageCalculator';
import { Calendar, Clock } from 'lucide-react';

interface HeroCardProps {
  user: User;
  child: Child;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function HeroCard({ user, child }: HeroCardProps) {
  const age = calculateAge(child.birthDate);
  const greeting = getGreeting();

  return (
    <div className="stepio-hero-gradient rounded-3xl p-5 text-primary-foreground animate-slide-up">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl overflow-hidden">
          {child.photo ? (
            <img src={child.photo} alt={child.name} className="w-full h-full object-cover" />
          ) : (
            '👶'
          )}
        </div>
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium">{greeting},</p>
          <h2 className="text-xl font-bold">
            {user.name} & {child.name}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/15 backdrop-blur rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar size={18} className="text-white/80" />
            <span className="text-white/80 text-xs font-medium">Meses</span>
          </div>
          <p className="text-3xl font-bold">{age.months}</p>
          <p className="text-xs text-white/70">meses de vida</p>
        </div>

        <div className="bg-white/15 backdrop-blur rounded-2xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock size={18} className="text-white/80" />
            <span className="text-white/80 text-xs font-medium">Semanas</span>
          </div>
          <p className="text-3xl font-bold">{age.weeks}</p>
          <p className="text-xs text-white/70">semanas de vida</p>
        </div>
      </div>
    </div>
  );
}
