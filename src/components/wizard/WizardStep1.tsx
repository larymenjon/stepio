import { useState } from 'react';
import { User, Heart } from 'lucide-react';

interface WizardStep1Props {
  onNext: (name: string) => void;
}

export function WizardStep1({ onNext }: WizardStep1Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNext(name.trim());
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <Heart className="w-10 h-10 text-primary" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mb-2">
        Bem-vinda ao Stepio! 💚
      </h1>
      <p className="text-muted-foreground text-center mb-8">
        Vamos começar conhecendo você um pouquinho melhor
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Como você gostaria de ser chamada?
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="stepio-input w-full pl-12"
              autoFocus
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          Continuar
        </button>
      </form>
    </div>
  );
}
