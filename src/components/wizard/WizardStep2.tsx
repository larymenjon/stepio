import { useState } from 'react';
import { Baby, Calendar } from 'lucide-react';
import { format, parse, isValid as isValidDate } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WizardStep2Props {
  onNext: (childName: string, birthDate: string) => void;
  onBack: () => void;
}

export function WizardStep2({ onNext, onBack }: WizardStep2Props) {
  const [childName, setChildName] = useState('');
  const [birthDateInput, setBirthDateInput] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  const handleDateChange = (value: string) => {
    // Format: DD/MM/YYYY
    let formatted = value.replace(/\D/g, '');
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
    }
    if (formatted.length > 5) {
      formatted = formatted.slice(0, 5) + '/' + formatted.slice(5, 9);
    }
    setBirthDateInput(formatted);

    if (formatted.length === 10) {
      const parsed = parse(formatted, 'dd/MM/yyyy', new Date());
      if (isValidDate(parsed) && parsed <= new Date()) {
        setBirthDate(parsed);
      } else {
        setBirthDate(null);
      }
    } else {
      setBirthDate(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (childName.trim() && birthDate) {
      onNext(childName.trim(), birthDate.toISOString());
    }
  };

  const isFormValid = childName.trim() && birthDate;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Baby className="w-10 h-10 text-primary" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-2">
        Conte sobre seu pequeno 👶
      </h1>
      <p className="text-muted-foreground text-center mb-8">
        Essas informações nos ajudam a personalizar a experiência
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Nome da criança
          </label>
          <div className="relative">
            <Baby className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Nome do seu filho(a)"
              className="stepio-input w-full pl-12"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Data de nascimento
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={birthDateInput}
              onChange={(e) => handleDateChange(e.target.value)}
              placeholder="DD/MM/AAAA"
              maxLength={10}
              inputMode="numeric"
              className="stepio-input w-full pl-12"
            />
          </div>
          {birthDate && (
            <p className="text-sm text-primary mt-2 font-medium">
              ✓ {format(birthDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 rounded-2xl border-2 border-border text-foreground font-bold text-lg transition-all duration-200 active:scale-[0.98]"
          >
            Voltar
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
