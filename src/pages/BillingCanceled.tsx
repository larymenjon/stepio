import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

export default function BillingCanceled() {
  const navigate = useNavigate();

  return (
    <div className="mobile-container pb-24">
            <header className="stepio-header stepio-header-sm">
        <div className="stepio-header-content">
          <div className="stepio-header-card text-left">
            <h1 className="text-2xl font-bold">Pagamento cancelado</h1>
            <p className="text-muted-foreground">Sem problema, você pode tentar novamente</p>
          </div>
        </div>
      </header>

      <main className="px-4 space-y-4">
        <div className="stepio-card text-center space-y-3">
          <XCircle size={44} className="text-destructive mx-auto" />
          <p className="text-lg font-bold">Compra não concluída</p>
          <p className="text-sm text-muted-foreground">
            Se quiser, volte para os planos e escolha uma assinatura.
          </p>
          <button
            type="button"
            onClick={() => navigate("/planos")}
            className="w-full py-3 rounded-2xl border border-border font-bold"
          >
            Ver planos
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

