import { useMemo, useState } from "react";
import { Check, Crown } from "lucide-react";
import { openSubscriptionManagement, syncEntitlements } from "@/lib/billing";
import { useStepioData } from "@/hooks/useStepioData";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/BottomNav";

export default function Plans() {
  const { data, refreshPlan } = useStepioData();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);
  const isPro = data.plan?.tier === "pro" && data.plan?.status === "active";
  const priceLabel = useMemo(() => {
    return billing === "monthly" ? "R$ 29,90 / mÃªs" : "R$ 286 / ano";
  }, [billing]);

  const handleSync = async () => {
    setLoading(true);
    try {
      await syncEntitlements();
      await refreshPlan();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container pb-24">
            <header className="stepio-header stepio-header-sm">
        <div className="stepio-header-content">
          <div className="stepio-header-card text-left">
            <h1 className="text-2xl font-bold">Planos</h1>
            <p className="text-muted-foreground">Escolha o plano ideal para sua família</p>
          </div>
        </div>
      </header>

      <main className="px-4 space-y-6">
        <div className="stepio-card space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">Plano atual</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold">{isPro ? "Pro" : "Free"}</p>
              <p className="text-sm text-muted-foreground">
                {isPro ? "Assinatura ativa" : "Sem assinatura"}
              </p>
            </div>
            {isPro && (
              <button
                type="button"
                onClick={openSubscriptionManagement}
                className="px-4 py-2 rounded-xl border border-border text-sm font-semibold"
              >
                Gerenciar
              </button>
            )}
          </div>
        </div>

        <div className="stepio-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Free</h2>
            <span className="text-sm text-muted-foreground">R$ 0</span>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              Até 5 terapias/consultas por mês
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              Agenda e medicamentos
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              Notificações básicas
            </li>
          </ul>
        </div>

        <div className="stepio-card border-2 border-primary space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown size={18} className="text-primary" />
              <h2 className="text-lg font-bold">Pro</h2>
            </div>
            <span className="text-sm font-semibold text-primary">{priceLabel}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={cn(
                "rounded-xl border-2 px-3 py-2 text-sm font-semibold",
                billing === "monthly" ? "border-primary bg-primary/10" : "border-border",
              )}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={cn(
                "rounded-xl border-2 px-3 py-2 text-sm font-semibold",
                billing === "yearly" ? "border-primary bg-primary/10" : "border-border",
              )}
            >
              Anual
            </button>
          </div>

          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              Terapias e consultas ilimitadas
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              Exportar relatórios
            </li>
            <li className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              Histórico completo e avançado
            </li>
          </ul>

          <button
            type="button"
            onClick={openSubscriptionManagement}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg transition-all duration-200 disabled:opacity-50"
          >
            Assinar no app
          </button>

          <button
            type="button"
            onClick={handleSync}
            disabled={loading}
            className="w-full py-3 rounded-2xl border border-border text-sm font-semibold"
          >
            {loading ? "Sincronizando..." : "Sincronizar assinatura"}
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

