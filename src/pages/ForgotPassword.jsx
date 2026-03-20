import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem("theme-preference") || "auto";
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const [email, setEmail] = useState("");
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
        link: "text-emerald-400 hover:text-emerald-300",
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
        link: "text-emerald-600 hover:text-emerald-700",
      };

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!email) {
      setError("Informe seu e-mail.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atualizar-senha`,
    });

    if (error) {
      setError("Não foi possível enviar o e-mail de recuperação.");
      setLoading(false);
      return;
    }

    setMessage("Enviamos um link de recuperação para seu e-mail.");
    setLoading(false);
  };

  return (
    <div className={`${theme.page} transition-colors duration-300`}>
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/" className={`text-sm font-medium transition ${theme.link}`}>
              ← Voltar ao login
            </Link>

            <button
              type="button"
              onClick={cycleTheme}
              className={`rounded-2xl px-4 py-2 text-xs font-medium transition ${theme.toggleButton}`}
            >
              Tema: {themeLabel}
            </button>
          </div>

          <div className={`rounded-[2rem] p-8 ${theme.card}`}>
            <p className="text-sm font-medium text-emerald-500">Recuperação de acesso</p>
            <h1 className="mt-2 text-3xl font-semibold">Esqueci minha senha</h1>
            <p className={`mt-4 text-sm leading-7 ${theme.subtle}`}>
              Informe seu e-mail corporativo para receber o link de redefinição.
            </p>

            <form className="space-y-5 mt-6" onSubmit={handleResetRequest}>
              <div>
                <label className="mb-2 block text-sm font-medium">E-mail corporativo</label>
                <input
                  type="email"
                  placeholder="operacao@corretora.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Enviando..." : "Enviar link de recuperação"}
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