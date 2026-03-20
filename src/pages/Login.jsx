import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Shield } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem("theme-preference") || "auto";
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const carouselItems = [
    {
      title: "Controle sua operação com precisão",
      description:
        "Monitore execuções, erros e resultados do robô em tempo real com total visibilidade.",
    },
    {
      title: "Monitoramento em tempo real",
      description:
        "Acompanhe execuções, falhas e eventos críticos do robô com visibilidade operacional contínua.",
    },
    {
      title: "Rastreabilidade completa",
      description:
        "Registre cada etapa da renovação com histórico de logs, mensagens e status por execução.",
    },
    {
      title: "Operação multi-corretora",
      description:
        "Organize acessos, filas e fluxos independentes para diferentes corretoras e seguradoras.",
    },
  ];

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselItems.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [carouselItems.length]);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Preencha todos os campos.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  const theme = isDark
    ? {
        page: "min-h-screen bg-zinc-950 text-zinc-100",
        leftPanel:
          "bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_30%),linear-gradient(135deg,#020617_0%,#020c2b_45%,#010814_100%)]",
        badge:
          "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        card: "border border-zinc-800 bg-zinc-900/90 shadow-2xl shadow-black/20",
        input:
          "border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder:text-zinc-500",
        primaryButton: "bg-white text-zinc-950 hover:bg-zinc-100",
        secondaryCard: "border border-zinc-800 bg-zinc-950/70",
        subtle: "text-zinc-400",
        muted: "text-zinc-500",
        title: "text-zinc-100",
        iconCard: "bg-zinc-800 text-emerald-400",
        link: "text-emerald-400 hover:text-emerald-300",
        carouselCard:
          "border border-emerald-500/10 bg-zinc-950/50 backdrop-blur-sm",
        dotActive: "bg-emerald-400",
        dotInactive: "bg-zinc-700",
      }
    : {
        page: "min-h-screen bg-zinc-100 text-zinc-900",
        leftPanel:
          "bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.10),_transparent_30%),linear-gradient(135deg,#ecfeff_0%,#eff6ff_45%,#f8fafc_100%)]",
        badge: "border border-emerald-200 bg-emerald-50 text-emerald-700",
        card: "border border-zinc-200 bg-white shadow-xl shadow-zinc-200/60",
        input:
          "border border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400",
        primaryButton: "bg-zinc-900 text-white hover:bg-zinc-800",
        secondaryCard: "border border-zinc-200 bg-zinc-50/80",
        subtle: "text-zinc-600",
        muted: "text-zinc-500",
        title: "text-zinc-950",
        iconCard: "bg-zinc-900 text-white",
        link: "text-emerald-600 hover:text-emerald-700",
        carouselCard:
          "border border-emerald-100 bg-white/70 backdrop-blur-sm shadow-lg shadow-zinc-200/40",
        dotActive: "bg-emerald-500",
        dotInactive: "bg-zinc-300",
      };

  return (
    <div className={`${theme.page} transition-colors duration-300 relative`}>
      <div className="absolute top-6 right-6 z-50">
        <button
          type="button"
          onClick={cycleTheme}
          className={`relative w-14 h-8 flex items-center rounded-full transition ${
            isDark ? "bg-emerald-500" : "bg-zinc-300"
          }`}
          title={isDark ? "Tema escuro" : "Tema claro"}
        >
          <span
            className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition ${
              isDark ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        <section className={`${theme.leftPanel} relative overflow-hidden`}>
          <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-12">
            <div
              className={`inline-flex items-center gap-3 rounded-full px-4 py-2 ${theme.badge}`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zinc-900">
                🏢
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] opacity-80">
                  Plataforma de automação
                </div>
                <div className="text-sm font-semibold">RenovaFleet Control</div>
              </div>
            </div>

            <div className="flex-1 flex items-center">
              <div className={`w-full max-w-xl rounded-[2rem] p-8 ${theme.carouselCard}`}>
                <p className="text-sm uppercase tracking-[0.35em] text-emerald-400 mb-4">
                  Gestão de renovação para corretoras
                </p>

                <div className="min-h-[220px]">
                  <h2 className={`text-3xl md:text-4xl font-semibold leading-tight ${theme.title}`}>
                    {carouselItems[activeSlide].title}
                  </h2>

                  <p className={`mt-6 text-base md:text-lg leading-8 ${theme.subtle}`}>
                    {carouselItems[activeSlide].description}
                  </p>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  {carouselItems.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        activeSlide === index
                          ? `w-8 ${theme.dotActive}`
                          : `w-2.5 ${theme.dotInactive}`
                      }`}
                      aria-label={`Ir para slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-8">
          <div className={`w-full max-w-md rounded-[2rem] p-8 ${theme.card}`}>
            <div className="mb-6 flex justify-between items-start">
              <div>
                <p className="text-sm text-emerald-500">Acesso da corretora</p>
                <h2 className="text-3xl font-semibold">Entrar na plataforma</h2>
              </div>

              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ${theme.iconCard}`}
              >
                <Shield size={30} strokeWidth={2.2} />
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl p-4 ${theme.input}`}
              />

              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl p-4 ${theme.input}`}
              />

              <div className="text-right">
                <Link to="/recuperar-senha" className={theme.link}>
                  Esqueci minha senha
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full p-4 rounded-xl transition ${theme.primaryButton} ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}