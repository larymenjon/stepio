export interface User {
  name: string;
  photo?: string;
}

export interface Child {
  name: string;
  birthDate: string; // ISO date string
  condition: ConditionType[];
  photo?: string;
}

export type ConditionType = 'TEA' | 'T21' | 'PC' | 'TDAH' | 'Outro';

export interface Medication {
  id: string;
  name: string;
  type: 'xarope' | 'comprimido' | 'gotas' | 'pomada';
  dosage: string;
  frequency: 'diario' | '8h' | '12h' | 'sob_demanda';
  startTime: string; // HH:mm format
  notes?: string;
}

export interface Event {
  id: string;
  title: string;
  professional?: string;
  datetime: string; // ISO datetime string
  type: 'therapy' | 'doctor' | 'school';
  notes?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  photo?: string;
}

export interface StepioData {
  user: User | null;
  child: Child | null;
  medications: Medication[];
  events: Event[];
  milestones: Milestone[];
  isOnboarded: boolean;
}

export const conditionLabels: Record<ConditionType, string> = {
  TEA: 'Autismo (TEA)',
  T21: 'Síndrome de Down (T21)',
  PC: 'Paralisia Cerebral',
  TDAH: 'TDAH',
  Outro: 'Outro',
};

export const medicationTypeLabels: Record<Medication['type'], string> = {
  xarope: 'Xarope',
  comprimido: 'Comprimido',
  gotas: 'Gotas',
  pomada: 'Pomada',
};

export const frequencyLabels: Record<Medication['frequency'], string> = {
  diario: '1x ao dia',
  '8h': 'A cada 8 horas',
  '12h': 'A cada 12 horas',
  sob_demanda: 'Sob demanda',
};

export const eventTypeLabels: Record<Event['type'], string> = {
  therapy: 'Terapia',
  doctor: 'Consulta',
  school: 'Escola',
};
