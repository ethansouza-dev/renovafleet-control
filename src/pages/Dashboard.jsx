import { useEffect, useMemo, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import { supabase } from "../lib/supabase";
import { runRobotSimulation } from "../lib/robotSimulator";

export default function Dashboard() {
  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem("theme-preference") || "auto";
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const [execucoes, setExecucoes] = useState([]);
  const [runningRobot, setRunningRobot] = useState(false);
  const [robotMessage, setRobotMessage] = useState("");
  const [robotError, setRobotError] = useState("");

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

  const loadExecucoes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("execucoes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setExecucoes(data || []);
    }
  };

  useEffect(() => {
    loadExecucoes();
  }, []);

  const handleRunRobot = async () => {
    setRunningRobot(true);
    setRobotMessage("");
    setRobotError("");

    try {
      const result = await runRobotSimulation();
      setRobotMessage(
        `Robô executado para a cotação ${result.cotacao} na seguradora ${result.seguradora}. Resultado: ${result.resultado}.`
      );
      await loadExecucoes();
    } catch (error) {
      setRobotError(error.message || "Falha ao executar o robô.");
    } finally {
      setRunningRobot(false);
    }
  };

  const totalExecucoes = execucoes.length;
  const totalErros = execucoes.filter((item) => item.status === "ERRO").length;
  const totalSucesso = execucoes.filter((item) => item.status === "SUCESSO").length;
  const taxaErro =
    totalExecucoes > 0 ? ((totalErros / totalExecucoes) * 100).toFixed(2) : "0.00";

  const latestByCotacao = Object.values(
    execucoes.reduce((acc, item) => {
      if (!acc[item.cotacao]) {
        acc[item.cotacao] = item;
      }
      return acc;
    }, {})
  );

  const errorsByStage = Object.values(
    execucoes
      .filter((item) => item.status === "ERRO")
      .reduce((acc, item) => {
        if (!acc[item.etapa]) {
          acc[item.etapa] = { etapa: item.etapa, total: 0 };
        }
        acc[item.etapa].total += 1;
        return acc;
      }, {})
  );

  const logsByHour = Object.values(
    execucoes.reduce((acc, item) => {
      const hora = new Date(item.created_at).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (!acc[hora]) {
        acc[hora] = {
          hora,
          erros: 0,
          sucessos: 0,
          total: 0,
        };
      }

      if (item.status === "ERRO") acc[hora].erros += 1;
      if (item.status === "SUCESSO") acc[hora].sucessos += 1;
      acc[hora].total += 1;

      return acc;
    }, {})
  );

  const maxStage = Math.max(...errorsByStage.map((item) => item.total), 1);
  const maxLogs = Math.max(...logsByHour.map((item) => item.total), 1);

  const theme = isDark
    ? {
        page: "min-h-screen bg-zinc-950 text-zinc-100",
        panel: "border-zinc-800 bg-zinc-900 shadow-black/20",
        subtle: "text-zinc-400",
        muted: "text-zinc-500",
        tableBorder: "border-zinc-800",
        rowBorder: "border-zinc-900/80",
        barBg: "bg-zinc-800",
        incidentCard: "border-zinc-800 bg-zinc-950",
        chip: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        primaryButton: "bg-white text-zinc-950 hover:bg-zinc-100",
      }
    : {
        page: "min-h-screen bg-zinc-100 text-zinc-900",
        panel: "border-zinc-200 bg-white shadow-zinc-200/60",
        subtle: "text-zinc-600",
        muted: "text-zinc-500",
        tableBorder: "border-zinc-200",
        rowBorder: "border-zinc-100",
        barBg: "bg-zinc-200",
        incidentCard: "border-zinc-200 bg-zinc-50",
        chip: "border-emerald-300 bg-emerald-50 text-emerald-700",
        primaryButton: "bg-zinc-900 text-white hover:bg-zinc-800",
      };

  const statusClass = (status) => {
    if (status === "ERRO") {
      return isDark
        ? "bg-red-500/15 text-red-300 border border-red-500/30"
        : "bg-red-50 text-red-700 border border-red-200";
    }

    if (status === "SUCESSO") {
      return isDark
        ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
        : "bg-emerald-50 text-emerald-700 border border-emerald-200";
    }

    return isDark
      ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
      : "bg-amber-50 text-amber-700 border border-amber-200";
  };

  return (
    <div className={`${theme.page} transition-colors duration-300`}>
      <AppNavbar
        isDark={isDark}
        themePreference={themePreference}
        onCycleTheme={cycleTheme}
      />

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-6 md:px-6 md:py-8">
        <header className="space-y-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm ${theme.chip}`}
              >
                RenovaFleet Control
              </div>

              <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight">
                Dashboard Operacional
              </h1>
              <p className={`${theme.subtle} mt-2 max-w-2xl`}>
                Painel visual para acompanhamento das execuções do robô, erros por
                etapa e rastreabilidade operacional.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className={`rounded-2xl border px-4 py-3 ${theme.panel}`}>
                <div className={`text-xs uppercase tracking-[0.2em] ${theme.muted}`}>
                  Última atualização
                </div>
                <div className="text-sm mt-1">Dados do banco Supabase</div>
              </div>

              <button
                type="button"
                onClick={handleRunRobot}
                disabled={runningRobot}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${theme.primaryButton} ${
                  runningRobot ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {runningRobot ? "Executando robô..." : "Executar robô"}
              </button>
            </div>
          </div>

          {robotMessage && <p className="text-emerald-500 text-sm">{robotMessage}</p>}
          {robotError && <p className="text-red-500 text-sm">{robotError}</p>}
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total de execuções", value: totalExecucoes },
            { label: "Total de erros", value: totalErros },
            { label: "Execuções com sucesso", value: totalSucesso },
            { label: "Taxa de erro", value: `${taxaErro}%` },
          ].map((card) => (
            <div key={card.label} className={`rounded-3xl border p-5 shadow-lg ${theme.panel}`}>
              <div className={`text-sm ${theme.subtle}`}>{card.label}</div>
              <div className="mt-3 text-3xl font-semibold">{card.value}</div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className={`xl:col-span-2 rounded-3xl border p-6 ${theme.panel}`}>
            <h2 className="text-xl font-semibold">Resumo de execuções</h2>
            <p className={`text-sm mt-1 mb-5 ${theme.subtle}`}>
              Últimas execuções registradas no fluxo automatizado.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left">
                <thead>
                  <tr className={`border-b text-sm ${theme.tableBorder} ${theme.subtle}`}>
                    <th className="pb-3 font-medium">Cotação</th>
                    <th className="pb-3 font-medium">Frota</th>
                    <th className="pb-3 font-medium">Seguradora</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Etapa</th>
                    <th className="pb-3 font-medium">Mensagem</th>
                  </tr>
                </thead>
                <tbody>
                  {execucoes.map((item) => (
                    <tr key={item.id} className={`border-b text-sm ${theme.rowBorder}`}>
                      <td className="py-4 pr-4 font-medium">{item.cotacao}</td>
                      <td className={`py-4 pr-4 ${theme.subtle}`}>{item.nome_frota}</td>
                      <td className={`py-4 pr-4 ${theme.subtle}`}>
                        {item.nome_seguradora}
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className={`py-4 pr-4 ${theme.subtle}`}>{item.etapa}</td>
                      <td className={`py-4 ${theme.subtle}`}>{item.mensagem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`rounded-3xl border p-6 ${theme.panel}`}>
            <h2 className="text-xl font-semibold">Erros por etapa</h2>
            <p className={`text-sm mt-1 mb-5 ${theme.subtle}`}>
              Distribuição das falhas registradas no processo.
            </p>

            <div className="space-y-4">
              {errorsByStage.length === 0 ? (
                <p className={`text-sm ${theme.subtle}`}>Nenhum erro registrado.</p>
              ) : (
                errorsByStage.map((item) => (
                  <div key={item.etapa}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>{item.etapa}</span>
                      <span className={theme.subtle}>{item.total}</span>
                    </div>
                    <div className={`h-3 overflow-hidden rounded-full ${theme.barBg}`}>
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${(item.total / maxStage) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className={`rounded-3xl border p-6 ${theme.panel}`}>
            <h2 className="text-xl font-semibold">Logs por hora</h2>
            <p className={`text-sm mt-1 mb-6 ${theme.subtle}`}>
              Volume agregado de eventos ao longo do tempo.
            </p>

            {logsByHour.length === 0 ? (
              <p className={`text-sm ${theme.subtle}`}>Nenhuma execução registrada.</p>
            ) : (
              <>
                <div className="flex h-56 items-end gap-4">
                  {logsByHour.map((item) => (
                    <div key={item.hora} className="flex flex-1 flex-col items-center gap-3">
                      <div className="flex h-44 w-full items-end justify-center gap-2">
                        <div
                          className="w-10 rounded-t-2xl bg-red-400/80"
                          style={{ height: `${(item.erros / maxLogs) * 100}%` }}
                        />
                        <div
                          className="w-10 rounded-t-2xl bg-emerald-400/80"
                          style={{ height: `${(item.sucessos / maxLogs) * 100}%` }}
                        />
                      </div>
                      <div className={`text-xs ${theme.subtle}`}>{item.hora}</div>
                    </div>
                  ))}
                </div>

                <div className={`mt-5 flex items-center gap-4 text-sm ${theme.subtle}`}>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400/80" />
                    Erros
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                    Sucessos
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={`rounded-3xl border p-6 ${theme.panel}`}>
            <h2 className="text-xl font-semibold">Incidentes recentes</h2>
            <p className={`text-sm mt-1 mb-5 ${theme.subtle}`}>
              Execuções com falha que exigem acompanhamento.
            </p>

            <div className="space-y-4">
              {latestByCotacao.filter((item) => item.status === "ERRO").length === 0 ? (
                <p className={`text-sm ${theme.subtle}`}>Nenhum incidente recente.</p>
              ) : (
                latestByCotacao
                  .filter((item) => item.status === "ERRO")
                  .map((item) => (
                    <div key={item.id} className={`rounded-2xl border p-4 ${theme.incidentCard}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-medium">{item.cotacao}</div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className={`mt-2 text-sm ${theme.subtle}`}>
                        {item.nome_frota} • {item.nome_seguradora}
                      </div>
                      <div className={`mt-3 text-sm ${theme.subtle}`}>Etapa: {item.etapa}</div>
                      <div className={`mt-1 text-sm ${theme.subtle}`}>{item.mensagem}</div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}