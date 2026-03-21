import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import AppNavbar from "../components/AppNavbar";

export default function Seguradoras() {
  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem("theme-preference") || "auto";
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const [nomeSeguradora, setNomeSeguradora] = useState("");
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [site, setSite] = useState("");
  const [observacao, setObservacao] = useState("");
  const [ativo, setAtivo] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [seguradoras, setSeguradoras] = useState([]);

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

  const theme = isDark
    ? {
        page: "min-h-screen bg-zinc-950 text-zinc-100",
        panel: "border border-zinc-800 bg-zinc-900",
        input:
          "w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none",
        textarea:
          "w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none min-h-[110px]",
        button: "bg-white text-zinc-950 hover:bg-zinc-100",
        subtle: "text-zinc-400",
        tableBorder: "border-zinc-800",
        rowBorder: "border-zinc-900",
        switchBg: "bg-zinc-800",
        switchActive: "bg-emerald-500",
      }
    : {
        page: "min-h-screen bg-zinc-100 text-zinc-900",
        panel: "border border-zinc-200 bg-white",
        input:
          "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none",
        textarea:
          "w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none min-h-[110px]",
        button: "bg-zinc-900 text-white hover:bg-zinc-800",
        subtle: "text-zinc-600",
        tableBorder: "border-zinc-200",
        rowBorder: "border-zinc-100",
        switchBg: "bg-zinc-300",
        switchActive: "bg-emerald-500",
      };

  const loadSeguradoras = async () => {
    const { data, error } = await supabase
      .from("seguradoras_corretora")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setSeguradoras(data || []);
    }
  };

  useEffect(() => {
    loadSeguradoras();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!nomeSeguradora || !login || !senha) {
      setError("Preencha nome da seguradora, login e senha.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Usuário não autenticado.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("seguradoras_corretora").insert([
      {
        user_id: user.id,
        nome_seguradora: nomeSeguradora,
        login,
        senha,
        site,
        observacao,
        ativo,
      },
    ]);

    if (error) {
      setError("Não foi possível cadastrar a seguradora.");
      setLoading(false);
      return;
    }

    setMessage("Seguradora cadastrada com sucesso.");
    setNomeSeguradora("");
    setLogin("");
    setSenha("");
    setSite("");
    setObservacao("");
    setAtivo(true);
    setLoading(false);
    loadSeguradoras();
  };

  return (
    <div className={`${theme.page} transition-colors duration-300`}>
      <AppNavbar
        isDark={isDark}
        themePreference={themePreference}
        onCycleTheme={cycleTheme}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Seguradoras da Corretora
          </h1>
          <p className={`mt-2 ${theme.subtle}`}>
            Cadastre os acessos das seguradoras que o robô utilizará nas execuções.
          </p>
        </div>

        <section className={`rounded-3xl p-6 ${theme.panel}`}>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Nome da seguradora
              </label>
              <input
                type="text"
                value={nomeSeguradora}
                onChange={(e) => setNomeSeguradora(e.target.value)}
                placeholder="Ex.: Porto Seguro"
                className={theme.input}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Login</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="usuario@seguradora.com"
                className={theme.input}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite a senha"
                className={theme.input}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Site</label>
              <input
                type="text"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="https://portal.seguradora.com.br"
                className={theme.input}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">Observação</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex.: precisa aceitar cookies, possui dupla autenticação, etc."
                className={theme.textarea}
              />
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
              <button
                type="button"
                onClick={() => setAtivo((prev) => !prev)}
                className={`relative h-8 w-14 rounded-full transition ${
                  ativo ? theme.switchActive : theme.switchBg
                }`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${
                    ativo ? "left-7" : "left-1"
                  }`}
                />
              </button>

              <span className="text-sm">
                Status da seguradora:{" "}
                <strong>{ativo ? "Ativa" : "Inativa"}</strong>
              </span>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className={`rounded-2xl px-6 py-3 text-sm font-semibold transition ${theme.button} ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Salvando..." : "Cadastrar seguradora"}
              </button>
            </div>

            {message && (
              <p className="md:col-span-2 text-emerald-500 text-sm">
                {message}
              </p>
            )}

            {error && (
              <p className="md:col-span-2 text-red-500 text-sm">
                {error}
              </p>
            )}
          </form>
        </section>

        <section className={`rounded-3xl p-6 ${theme.panel}`}>
          <h2 className="text-xl font-semibold">Seguradoras cadastradas</h2>
          <p className={`mt-1 mb-5 text-sm ${theme.subtle}`}>
            Lista de acessos cadastrados para uso do robô.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className={`border-b ${theme.tableBorder} ${theme.subtle}`}>
                  <th className="pb-3 font-medium">Seguradora</th>
                  <th className="pb-3 font-medium">Login</th>
                  <th className="pb-3 font-medium">Senha</th>
                  <th className="pb-3 font-medium">Site</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {seguradoras.map((item) => (
                  <tr key={item.id} className={`border-b ${theme.rowBorder}`}>
                    <td className="py-4">{item.nome_seguradora}</td>
                    <td className="py-4">{item.login}</td>
                    <td className="py-4">••••••••</td>
                    <td className="py-4">{item.site || "-"}</td>
                    <td className="py-4">
                      {item.ativo ? "Ativa" : "Inativa"}
                    </td>
                    <td className="py-4">
                      {new Date(item.created_at).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}