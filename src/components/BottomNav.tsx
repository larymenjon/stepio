import { Home, Pill, Calendar, Trophy } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/medicacao', icon: Pill, label: 'Remédios' },
  { path: '/agenda', icon: Calendar, label: 'Agenda' },
  { path: '/marcos', icon: Trophy, label: 'Marcos' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="stepio-bottom-nav safe-area-inset-bottom">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              'stepio-nav-item',
              isActive && 'stepio-nav-item-active'
            )}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
