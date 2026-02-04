import { getDailyQuote } from '@/utils/motivationalQuotes';
import { Heart } from 'lucide-react';

export function MotivationalFooter() {
  const quote = getDailyQuote();

  return (
    <div className="text-center py-6 px-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <div className="inline-flex items-center gap-1 text-primary mb-2">
        <Heart size={14} fill="currentColor" />
        <span className="text-xs font-medium">Frase do dia</span>
        <Heart size={14} fill="currentColor" />
      </div>
      <p className="text-muted-foreground italic">"{quote}"</p>
    </div>
  );
}
