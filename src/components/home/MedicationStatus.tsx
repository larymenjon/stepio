import { Medication } from '@/types/stepio';
import { getNextMedication, formatMedicationTime } from '@/utils/medicationUtils';
import { CheckCircle2, Pill, Clock } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MedicationStatusProps {
  medications: Medication[];
}

export function MedicationStatus({ medications }: MedicationStatusProps) {
  const next = getNextMedication(medications);

  if (!next) {
    return (
      <div className="stepio-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Medicação</p>
            <p className="font-bold text-success">Tudo em dia! ✓</p>
          </div>
        </div>
      </div>
    );
  }

  const timeLabel = isToday(next.nextTime)
    ? `Hoje às ${formatMedicationTime(next.nextTime)}`
    : isTomorrow(next.nextTime)
    ? `Amanhã às ${formatMedicationTime(next.nextTime)}`
    : format(next.nextTime, "dd/MM 'às' HH:mm", { locale: ptBR });

  return (
    <div className="stepio-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center">
          <Pill className="w-6 h-6 text-warning" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">Próxima medicação</p>
          <p className="font-bold">{next.medication.name}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock size={14} />
            <span>{timeLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
