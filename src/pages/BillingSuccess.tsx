import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

export default function BillingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="mobile-container pb-24">
            <header className="stepio-header stepio-header-sm">
        <div className="stepio-header-content">
          <div className="stepio-header-card text-left">
            <h1 className="text-2xl font-bold">Assinatura ativa</h1>
            <p className="text-muted-foreground">Obrigado por apoiar o Stepio</p>
          </div>
        </div>
      </header>

      <main className="px-4 space-y-4">
        <div className="stepio-card text-center space-y-3">
          <CheckCircle2 size={44} className="text-primary mx-auto" />
          <p className="text-lg font-bold">Pagamento aprovado</p>
          <p className="text-sm text-muted-foreground">
            O plano Pro já está liberado. Aproveite os recursos avançados!
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold"
          >
            Ir para o início
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

