import { Home, Pill, Calendar, Brain, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Início" },
  { path: "/medicacao", icon: Pill, label: "Remédios" },
  { path: "/agenda", icon: Calendar, label: "Agenda" },
  { path: "/terapias", icon: Brain, label: "Terapias" },
  { path: "/conta", icon: User, label: "Conta" },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="stepio-bottom-nav safe-area-inset-bottom">
      <div className="stepio-bottom-nav-inner">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn("stepio-nav-item", isActive && "stepio-nav-item-active")}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
