import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function UpdatePassword() {
  const navigate = useNavigate();

  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem("theme-preference") || "auto";
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event) => setSystemPrefersDark(event.matches);

    if (media.addEventListener) {
      media.addEventListener("change", handler);
    } else {
      media.addListener(handler);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", handler);
      } else {
        media.removeListener(handler);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("theme-preference", themePreference);
  }, [themePreference]);

  const resolvedTheme = useMemo(() => {
    if (themePreference === "auto") {
      return systemPrefersDark ? "dark" : "light";
    }
    return themePreference;
  }, [themePreference, systemPrefersDark]);

  const isDark = resolvedTheme === "dark";

  const cycleTheme = () => {
    setThemePreference((prev) => {
      if (prev === "auto") return "dark";
      if (prev === "dark") return "light";
      return "auto";
    });
  };

  const themeLabel =
    themePreference === "auto"
      ? `Auto (${resolvedTheme})`
      : themePreference === "dark"
      ? "Dark"
      : "Light";

  const theme = isDark
    ? {
        page: "min-h-screen bg-zinc-950 text-zinc-100",
        card: "border border-zinc-800 bg-zinc-900/90 shadow-2xl shadow-black/20",
        input:
          "border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500",
        button: "bg-white text-zinc-950 hover:bg-zinc-100",
        subtle: "text-zinc-400",
        toggleButton:
          "border border-zinc-700 bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800",
      }
    : {
        page: "min-h-screen bg-zinc-100 text-zinc-900",
        card: "border border-zinc-200 bg-white shadow-xl shadow-zinc-200/60",
        input:
          "border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400",
        button: "bg-zinc-900 text-white hover:bg-zinc-800",
        subtle: "text-zinc-600",
        toggleButton:
          "border border-zinc-300 bg-white/90 text-zinc-700 hover:bg-zinc-100",
      };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!password || !confirmPassword) {
      setError("Preencha todos os campos.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError("Não foi possível atualizar a senha.");
      setLoading(false);
      return;
    }

    setMessage("Senha atualizada com sucesso. Redirecionando...");
    setLoading(false);

    setTimeout(() => {
      navigate("/");
    }, 1800);
  };

  return (
    <div className={`${theme.page} transition-colors duration-300`}>
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={cycleTheme}
              className={`rounded-2xl px-4 py-2 text-xs font-medium transition ${theme.toggleButton}`}
            >
              Tema: {themeLabel}
            </button>
          </div>

          <div className={`rounded-[2rem] p-8 ${theme.card}`}>
            <p className="text-sm font-medium text-emerald-500">Segurança de acesso</p>
            <h1 className="mt-2 text-3xl font-semibold">Definir nova senha</h1>
            <p className={`mt-4 text-sm leading-7 ${theme.subtle}`}>
              Escolha uma nova senha para acessar a plataforma.
            </p>

            <form className="space-y-5 mt-6" onSubmit={handleUpdatePassword}>
              <div>
                <label className="mb-2 block text-sm font-medium">Nova senha</label>
                <input
                  type="password"
                  placeholder="Digite a nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-2xl px-4 py-4 outline-none ${theme.input}`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Confirmar nova senha</label>
                <input
                  type="password"
                  placeholder="Confirme a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-2xl px-4 py-4 outline-none ${theme.input}`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-2xl px-4 py-4 text-sm font-semibold transition ${theme.button} ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Atualizando..." : "Salvar nova senha"}
              </button>

              {message && <p className="text-emerald-500 text-sm">{message}</p>}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}