import { useEffect, useMemo, useState } from "react";
import { format, isWithinInterval, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { useStepioData } from "@/hooks/useStepioData";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const moodOptions = [
  { id: "irritado", label: "Irritado", emoji: "😤" },
  { id: "raiva", label: "Com raiva", emoji: "😡" },
  { id: "agressivo", label: "Agressivo", emoji: "😠" },
  { id: "calmo", label: "Calmo", emoji: "🙂" },
  { id: "vagaroso", label: "Vagaroso", emoji: "😴" },
];

const foodOptions = [
  { id: "bem", label: "Comendo bem", emoji: "😋" },
  { id: "seletivo", label: "Seletivo", emoji: "😕" },
  { id: "pouco", label: "Comeu pouco", emoji: "🍽️" },
  { id: "recusou", label: "Recusou", emoji: "🚫" },
  { id: "enjoo", label: "Enjoado", emoji: "🤢" },
];

const sleepOptions = [
  { id: "bem", label: "Dormiu bem", emoji: "😴" },
  { id: "acordou", label: "Acordou várias vezes", emoji: "🌙" },
  { id: "pouco", label: "Dormiu pouco", emoji: "😫" },
  { id: "cochilo", label: "Cochilou bem", emoji: "💤" },
  { id: "insonia", label: "Insônia", emoji: "😵" },
];

const crisisOptions = [
  { id: "sem", label: "Sem crise", emoji: "✅" },
  { id: "leve", label: "Leve", emoji: "⚡" },
  { id: "moderada", label: "Moderada", emoji: "🔥" },
  { id: "forte", label: "Forte", emoji: "🚨" },
];

const optionMap = {
  mood: Object.fromEntries(moodOptions.map((o) => [o.id, o])),
  food: Object.fromEntries(foodOptions.map((o) => [o.id, o])),
  sleep: Object.fromEntries(sleepOptions.map((o) => [o.id, o])),
  crisis: Object.fromEntries(crisisOptions.map((o) => [o.id, o])),
};

function OptionGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { id: string; label: string; emoji: string }[];
  value?: string;
  onChange: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold mb-2">{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "p-3 rounded-2xl border-2 flex items-center gap-2 text-left transition-all",
              value === option.id ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            <span className="text-xl">{option.emoji}</span>
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function DailyLog() {
  const { data, setDailyLog } = useStepioData();
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const existing = data.dailyLogs?.[today];
  const isPro = data.plan?.tier === "pro" && data.plan?.status === "active";

  const [mood, setMood] = useState(existing?.mood ?? "");
  const [food, setFood] = useState(existing?.food ?? "");
  const [sleep, setSleep] = useState(existing?.sleep ?? "");
  const [crisis, setCrisis] = useState(existing?.crisis ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [saved, setSaved] = useState(false);
  const [showMonth, setShowMonth] = useState(false);
  const [editing, setEditing] = useState(!existing);

  useEffect(() => {
    if (existing) {
      setMood(existing.mood ?? "");
      setFood(existing.food ?? "");
      setSleep(existing.sleep ?? "");
      setCrisis(existing.crisis ?? "");
      setNotes(existing.notes ?? "");
      setEditing(false);
      return;
    }

    setMood("");
    setFood("");
    setSleep("");
    setCrisis("");
    setNotes("");
    setEditing(true);
  }, [
    existing?.mood,
    existing?.food,
    existing?.sleep,
    existing?.crisis,
    existing?.notes,
  ]);

  const canSave = useMemo(() => mood || food || sleep || crisis || notes, [mood, food, sleep, crisis, notes]);

  const monthLogs = useMemo(() => {
    const logs = Object.values(data.dailyLogs ?? {});
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    return logs.filter((log) =>
      log.date && isWithinInterval(parseISO(log.date), { start, end })
    );
  }, [data.dailyLogs]);

  const handleSave = () => {
    setDailyLog(today, {
      mood,
      food,
      sleep,
      crisis,
      notes,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="stepio-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Registro Diário</h3>
          <p className="text-sm text-muted-foreground">{format(new Date(), "dd/MM/yyyy")}</p>
        </div>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-bold",
            isPro ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {isPro ? "PRO" : "FREE"}
        </span>
      </div>

      {editing && (
        <>
          <OptionGroup title="Humor" options={moodOptions} value={mood} onChange={setMood} />
          <OptionGroup title="Alimentação" options={foodOptions} value={food} onChange={setFood} />
          <OptionGroup title="Sono" options={sleepOptions} value={sleep} onChange={setSleep} />
          <OptionGroup title="Crises" options={crisisOptions} value={crisis} onChange={setCrisis} />
        </>
      )}

      {canSave && (
        <div className="flex flex-wrap gap-2">
          {mood && (
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
              <span>{optionMap.mood[mood]?.emoji}</span>
              {optionMap.mood[mood]?.label}
            </span>
          )}
          {food && (
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
              <span>{optionMap.food[food]?.emoji}</span>
              {optionMap.food[food]?.label}
            </span>
          )}
          {sleep && (
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
              <span>{optionMap.sleep[sleep]?.emoji}</span>
              {optionMap.sleep[sleep]?.label}
            </span>
          )}
          {crisis && (
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
              <span>{optionMap.crisis[crisis]?.emoji}</span>
              {optionMap.crisis[crisis]?.label}
            </span>
          )}
        </div>
      )}

      {editing && (
        <div>
          <label className="block text-sm font-semibold mb-2">Notas</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Escreva algo importante sobre o dia..."
            className="stepio-input w-full resize-none"
          />
        </div>
      )}

      {editing ? (
        <button
          type="button"
          onClick={() => {
            handleSave();
            setEditing(false);
          }}
          disabled={!canSave}
          className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg transition-all duration-200 disabled:opacity-50"
        >
          {saved ? "Salvo!" : "Salvar registro"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="w-full py-3 rounded-2xl border border-border font-bold"
        >
          Editar registro
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          if (isPro) {
            setShowMonth(true);
          } else {
            navigate("/planos");
          }
        }}
        className={cn(
          "w-full py-3 rounded-2xl border font-semibold",
          isPro ? "border-primary text-primary" : "border-border text-muted-foreground",
        )}
      >
        Ver registros do mês
      </button>

      {!isPro && (
        <p className="text-xs text-muted-foreground text-center">
          Recurso Pro: veja e exporte o mês completo.
        </p>
      )}

      <DailyLogMonthModal
        open={showMonth}
        onClose={() => setShowMonth(false)}
        logs={monthLogs}
      />
    </div>
  );
}

export function DailyLogMonthModal({
  open,
  onClose,
  logs,
}: {
  open: boolean;
  onClose: () => void;
  logs: { date: string; mood?: string; food?: string; sleep?: string; crisis?: string; notes?: string }[];
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-sheet">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Registros do mês</h2>
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-xl border border-border">
            Fechar
          </button>
        </div>
        <div className="space-y-3">
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum registro neste mês.</p>
          )}
          {logs.map((log) => (
            <div key={log.date} className="rounded-2xl border border-border p-3 space-y-2">
              <p className="text-sm font-semibold">{log.date}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {log.mood && (
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {optionMap.mood[log.mood]?.emoji} {optionMap.mood[log.mood]?.label}
                  </span>
                )}
                {log.food && (
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {optionMap.food[log.food]?.emoji} {optionMap.food[log.food]?.label}
                  </span>
                )}
                {log.sleep && (
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {optionMap.sleep[log.sleep]?.emoji} {optionMap.sleep[log.sleep]?.label}
                  </span>
                )}
                {log.crisis && (
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {optionMap.crisis[log.crisis]?.emoji} {optionMap.crisis[log.crisis]?.label}
                  </span>
                )}
              </div>
              {log.notes && <p className="text-xs text-muted-foreground">{log.notes}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
