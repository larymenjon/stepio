import { useState } from 'react';
import { WizardStep1 } from './WizardStep1';
import { WizardStep2 } from './WizardStep2';
import { WizardStep3 } from './WizardStep3';
import { ConditionType } from '@/types/stepio';
import { Puzzle } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (data: {
    userName: string;
    childName: string;
    birthDate: string;
    conditions: ConditionType[];
  }) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [childName, setChildName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const handleStep1 = (name: string) => {
    setUserName(name);
    setStep(2);
  };

  const handleStep2 = (name: string, date: string) => {
    setChildName(name);
    setBirthDate(date);
    setStep(3);
  };

  const handleStep3 = (conditions: ConditionType[]) => {
    onComplete({
      userName,
      childName,
      birthDate,
      conditions,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
          <Puzzle className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-primary">Stepio</span>
      </div>

      {/* Progress */}
      <div className="px-6 mb-6">
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Passo {step} de 3
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8">
        {step === 1 && <WizardStep1 onNext={handleStep1} />}
        {step === 2 && (
          <WizardStep2
            onNext={handleStep2}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <WizardStep3
            childName={childName}
            onComplete={handleStep3}
            onBack={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
}
