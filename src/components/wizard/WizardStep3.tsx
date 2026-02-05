import { useMemo, useState } from 'react';
import { Puzzle, Check, ChevronDown, Plus } from 'lucide-react';
import { ConditionType, conditionLabels, conditionOptions } from '@/types/stepio';
import { cn } from '@/lib/utils';

interface WizardStep3Props {
  childName: string;
  onComplete: (conditions: ConditionType[]) => void;
  onBack: () => void;
}

export function WizardStep3({ childName, onComplete, onBack }: WizardStep3Props) {
  const [selected, setSelected] = useState<ConditionType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');

  const toggleCondition = (condition: ConditionType) => {
    setSelected((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const options = useMemo(() => {
    const mapped = conditionOptions.map((opt) => ({ id: opt.id, label: opt.label }));
    const extra = customOptions.map((opt) => ({ id: opt, label: opt }));
    return [...mapped, ...extra];
  }, [customOptions]);

  const addCustom = () => {
    const value = customInput.trim();
    if (!value) return;
    if (!customOptions.includes(value)) {
      setCustomOptions((prev) => [...prev, value]);
    }
    if (!selected.includes(value)) {
      setSelected((prev) => [...prev, value]);
    }
    setCustomInput('');
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
        <div className="stepio-card">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full flex items-center justify-between py-3 font-semibold"
          >
            <span>Selecionar condições</span>
            <ChevronDown size={18} className={cn('transition-transform', isOpen && 'rotate-180')} />
          </button>

          {isOpen && (
            <div className="mt-3 space-y-3">
              <div className="grid gap-2">
                {options.map((option) => {
                  const isSelected = selected.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleCondition(option.id)}
                      className={cn(
                        'w-full flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left',
                        isSelected ? 'border-primary bg-primary/5' : 'border-border'
                      )}
                    >
                      <span className="text-sm font-medium">{option.label}</span>
                      {isSelected && <Check size={16} className="text-primary" />}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Adicionar outra condição</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Ex: Paralisia cerebral infantil"
                    className="stepio-input w-full"
                  />
                  <button
                    type="button"
                    onClick={addCustom}
                    className="px-4 rounded-2xl bg-primary text-primary-foreground"
                    aria-label="Adicionar condição"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {selected.map((condition) => (
              <span key={condition} className="stepio-chip stepio-chip-selected">
                {conditionLabels[condition] ?? condition}
              </span>
            ))}
          </div>
        )}

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
