import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signOut, updateEmail } from "firebase/auth";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useStepioData } from "@/hooks/useStepioData";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/BottomNav";
import { createPortalSession } from "@/lib/billing";
import { exportDailyLogsToCsv } from "@/utils/exportDailyLogs";
import { parseISO } from "date-fns";

const Account = () => {
  const { data, loading, setUser, setChild, setNotificationSettings } = useStepioData();
  const navigate = useNavigate();
  const [name, setName] = useState(data.user?.name ?? "");
  const [email, setEmail] = useState(data.user?.email ?? auth.currentUser?.email ?? "");
  const [childName, setChildName] = useState(data.child?.name ?? "");
  const [childBirthDate, setChildBirthDate] = useState(data.child?.birthDate ?? "");
  const [childGender, setChildGender] = useState<'menina' | 'menino' | 'nao_informar'>(
    data.child?.gender ?? 'nao_informar'
  );
  const [notifyEvents, setNotifyEvents] = useState(data.settings?.notifyEvents ?? true);
  const [notifyMeds, setNotifyMeds] = useState(data.settings?.notifyMeds ?? true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    setName(data.user?.name ?? "");
    setEmail(data.user?.email ?? auth.currentUser?.email ?? "");
    setChildName(data.child?.name ?? "");
    setChildBirthDate(data.child?.birthDate ?? "");
    setChildGender(data.child?.gender ?? 'nao_informar');
    setNotifyEvents(data.settings?.notifyEvents ?? true);
    setNotifyMeds(data.settings?.notifyMeds ?? true);
  }, [data.user, data.child, data.settings]);

  if (loading) {
    return (
      <div className="mobile-container flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!data.user) {
    return null;
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (auth.currentUser && email && email !== auth.currentUser.email) {
        try {
          await updateEmail(auth.currentUser, email);
        } catch {
          setError("Email não pôde ser atualizado agora. Faça login novamente e tente.");
        }
      }
      setUser({
        ...data.user,
        name,
        email,
      });
      setChild({
        ...(data.child ?? { name: "", birthDate: "", condition: [] }),
        name: childName,
        birthDate: childBirthDate,
        gender: childGender,
      });
      setNotificationSettings({
        notifyEvents,
        notifyMeds,
      });
    } catch {
      setError("Erro ao salvar. Talvez seja preciso entrar novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mobile-container pb-24">
      <header className="stepio-header stepio-header-sm">
        <div className="stepio-header-content">
          <div className="stepio-header-card text-left">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm"
            >
              <ArrowLeft size={16} />
              Voltar ao menu
            </button>
            <h1 className="text-2xl font-bold">Minha Conta</h1>
            <p className="text-muted-foreground">Gerencie seus dados</p>
          </div>
        </div>
      </header>

      <main className="px-4 space-y-6">
        <form onSubmit={handleSave} className="stepio-card space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="stepio-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="stepio-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Nome da crianca</label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="stepio-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Nascimento da crianca</label>
            <input
              type="date"
              value={childBirthDate}
              onChange={(e) => setChildBirthDate(e.target.value)}
              className="stepio-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Genero</label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'menina', label: 'Menina' },
                  { id: 'menino', label: 'Menino' },
                  { id: 'nao_informar', label: 'Prefiro nao dizer' },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setChildGender(option.id)}
                  className={cn(
                    'p-3 rounded-xl border-2 text-sm font-medium transition-all',
                    childGender === option.id ? 'border-primary bg-primary/5' : 'border-border'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notificações</label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setNotifyEvents((prev) => !prev)}
                className={cn(
                  "w-full flex items-center justify-between rounded-2xl border-2 px-4 py-3",
                  notifyEvents ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <span className="text-sm font-medium">Compromissos</span>
                <span className="text-sm text-muted-foreground">
                  {notifyEvents ? "Ativado" : "Desativado"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setNotifyMeds((prev) => !prev)}
                className={cn(
                  "w-full flex items-center justify-between rounded-2xl border-2 px-4 py-3",
                  notifyMeds ? "border-primary bg-primary/5" : "border-border"
                )}
              >
                <span className="text-sm font-medium">Remédios</span>
                <span className="text-sm text-muted-foreground">
                  {notifyMeds ? "Ativado" : "Desativado"}
                </span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Compromissos: 1 dia e 30 min antes. Remédios: 1h e 5 min antes.
            </p>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            className={cn(
              "w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg transition-all",
              saving && "opacity-70",
            )}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar alteracoes"}
          </button>
        </form>

        <div className="stepio-card space-y-3">
          <p className="text-sm font-semibold">Assinatura</p>
          <p className="text-sm text-muted-foreground">
            {data.plan?.tier === "pro" && data.plan?.status === "active"
              ? "Plano Pro ativo"
              : "Plano Free"}
          </p>
          {data.plan?.tier === "pro" && data.plan?.status === "active" ? (
            <button
              type="button"
              onClick={async () => {
                setBillingLoading(true);
                try {
                  const url = await createPortalSession();
                  window.location.href = url;
                } catch {
                  setError("Não foi possível abrir o portal agora.");
                } finally {
                  setBillingLoading(false);
                }
              }}
              className={cn(
                "w-full py-3 rounded-2xl border border-border font-bold",
                billingLoading && "opacity-70",
              )}
              disabled={billingLoading}
            >
              {billingLoading ? "Abrindo..." : "Gerenciar assinatura"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/planos")}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold"
            >
              Assinar Pro
            </button>
          )}
        </div>

        <div className="stepio-card space-y-3">
          <p className="text-sm font-semibold">Exportar relatório</p>
          {data.plan?.tier === "pro" && data.plan?.status === "active" ? (
            <button
              type="button"
              onClick={() => {
                const logs = Object.values(data.dailyLogs ?? {});
                const now = new Date();
                const monthPrefix = now.toISOString().slice(0, 7);
                const monthLogs = logs.filter((log) => (log.date ?? "").startsWith(monthPrefix));
                exportDailyLogsToCsv(monthLogs, now);
              }}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold"
            >
              Exportar relatório
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowUpgrade(true)}
                className="w-full py-3 rounded-2xl border border-border font-bold opacity-60"
              >
                Exportar relatório
              </button>
              <p className="text-xs text-muted-foreground">
                Disponível apenas no Plano Pro.
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => signOut(auth)}
          className="w-full py-3 rounded-2xl border border-destructive text-destructive font-bold"
        >
          Sair da conta
        </button>
      </main>

      <BottomNav />

      {showUpgrade && (
        <div className="modal-overlay">
          <div className="modal-sheet">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Desbloqueie o Pro</h2>
              <button
                type="button"
                onClick={() => setShowUpgrade(false)}
                className="p-2 rounded-xl border border-border"
              >
                Fechar
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A exportação de relatórios é um recurso exclusivo do Plano Pro.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowUpgrade(false);
                navigate("/planos");
              }}
              className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold"
            >
              Ver planos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
