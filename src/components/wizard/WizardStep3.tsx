import { useState } from 'react';
import { Puzzle, Check } from 'lucide-react';
import { ConditionType, conditionLabels } from '@/types/stepio';
import { cn } from '@/lib/utils';

interface WizardStep3Props {
  childName: string;
  onComplete: (conditions: ConditionType[]) => void;
  onBack: () => void;
}

const conditions: ConditionType[] = ['TEA', 'T21', 'PC', 'TDAH', 'Outro'];

export function WizardStep3({ childName, onComplete, onBack }: WizardStep3Props) {
  const [selected, setSelected] = useState<ConditionType[]>([]);

  const toggleCondition = (condition: ConditionType) => {
    setSelected((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(selected);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Puzzle className="w-10 h-10 text-primary" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-2">
        Sobre {childName} 🌟
      </h1>
      <p className="text-muted-foreground text-center mb-8">
        Selecione as condições que se aplicam (opcional)
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {conditions.map((condition) => {
            const isSelected = selected.includes(condition);
            return (
              <button
                key={condition}
                type="button"
                onClick={() => toggleCondition(condition)}
                className={cn(
                  'stepio-chip',
                  isSelected && 'stepio-chip-selected'
                )}
              >
                {isSelected && <Check size={16} />}
                {conditionLabels[condition]}
              </button>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Você pode pular esta etapa se preferir
        </p>

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
            className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg transition-all duration-200 active:scale-[0.98]"
          >
            Começar! 🎉
          </button>
        </div>
      </form>
    </div>
  );
}
