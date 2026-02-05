import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { FirebaseError } from "firebase/app";

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof FirebaseError) {
        const code = err.code;
        if (code === "auth/invalid-email") {
          setError("Email inválido.");
        } else if (code === "auth/weak-password") {
          setError("Senha fraca. Use pelo menos 6 caracteres.");
        } else if (code === "auth/email-already-in-use") {
          setError("Este email já está em uso.");
        } else if (code === "auth/unauthorized-domain") {
          setError("Domínio não autorizado no Firebase.");
        } else if (code === "auth/invalid-api-key") {
          setError("Chave do Firebase inválida (confira o .env).");
        } else {
          setError(`Erro: ${code}`);
        }
      } else {
        setError("Erro inesperado. Verifique seus dados e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-container flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md stepio-card">
        <h1 className="text-2xl font-bold mb-2">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "login"
            ? "Acesse sua conta para continuar."
            : "Crie sua conta para começar a jornada."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block text-sm font-semibold mb-2">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="stepio-input w-full"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="stepio-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="stepio-input w-full"
              required
            />
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <button
            type="submit"
            className={cn(
              "w-full py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-lg transition-all",
              loading && "opacity-70",
            )}
            disabled={loading}
          >
            {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 text-sm font-semibold text-primary w-full"
        >
          {mode === "login" ? "Quero criar uma conta" : "Já tenho uma conta"}
        </button>
      </div>
    </div>
  );
};

export default Login;
