import { Medication } from '@/types/stepio';
import { parse, addHours, isAfter, isBefore, format, startOfDay, setHours, setMinutes } from 'date-fns';

export interface NextMedication {
  medication: Medication;
  nextTime: Date;
  isOverdue: boolean;
}

export function getNextMedicationTime(medication: Medication, referenceDate: Date = new Date()): Date {
  const [hours, minutes] = medication.startTime.split(':').map(Number);
  const today = startOfDay(referenceDate);
  let nextTime = setMinutes(setHours(today, hours), minutes);

  // Calculate interval based on frequency
  const intervalHours = medication.frequency === '8h' ? 8 : medication.frequency === '12h' ? 12 : 24;

  // Find the next occurrence
  while (isBefore(nextTime, referenceDate)) {
    nextTime = addHours(nextTime, intervalHours);
  }

  return nextTime;
}

export function getNextMedication(medications: Medication[]): NextMedication | null {
  if (medications.length === 0) return null;

  const now = new Date();
  let nearest: NextMedication | null = null;

  for (const med of medications) {
    if (med.frequency === 'sob_demanda') continue;

    const nextTime = getNextMedicationTime(med, now);
    
    if (!nearest || isBefore(nextTime, nearest.nextTime)) {
      nearest = {
        medication: med,
        nextTime,
        isOverdue: false, // Will be handled elsewhere if needed
      };
    }
  }

  return nearest;
}

export function formatMedicationTime(date: Date): string {
  return format(date, 'HH:mm');
}

export function getMedicationSchedule(medication: Medication): string[] {
  const [hours, minutes] = medication.startTime.split(':').map(Number);
  const times: string[] = [];
  
  let currentHour = hours;
  const intervalHours = medication.frequency === '8h' ? 8 : medication.frequency === '12h' ? 12 : 24;
  
  const count = medication.frequency === '8h' ? 3 : medication.frequency === '12h' ? 2 : 1;
  
  for (let i = 0; i < count; i++) {
    const h = currentHour % 24;
    times.push(`${h.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    currentHour += intervalHours;
  }
  
  return times.sort();
}
