import { useEffect, useMemo, useState } from "react";
import AppNavbar from "../components/AppNavbar";

export default function Dashboard() {
  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem("theme-preference") || "auto";
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

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

  const metrics = {
    totalExecucoes: 3,
    totalErros: 2,
    totalSucesso: 6,
    taxaErro: 25.0,
  };

  const recentExecutions = [
    {
      id: "COT-2026-0001",
      cliente: "Transportadora Souza",
      seguradora: "Porto Seguro",
      status: "ERRO",
      etapa: "ENVIO",
      mensagem: "Falha ao confirmar envio da cotacao",
    },
    {
      id: "COT-2026-0002",
      cliente: "Transportadora Atlas",
      seguradora: "Tokio Marine",
      status: "SUCESSO",
      etapa: "FINALIZADO",
      mensagem: "Cotacao enviada com sucesso",
    },
    {
      id: "COT-2026-0003",
      cliente: "Logistica Vix",
      seguradora: "Azul Seguros",
      status: "ERRO",
      etapa: "LOGIN",
      mensagem: "Falha ao realizar login na seguradora",
    },
  ];

  const errorsByStage = [
    { etapa: "ENVIO", total: 1 },
    { etapa: "LOGIN", total: 1 },
  ];

  const logsByHour = [
    { hora: "00:00", erros: 1, sucessos: 3, total: 4 },
    { hora: "21:00", erros: 1, sucessos: 3, total: 4 },
  ];

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
      };

  const statusClass = (status) => {
    if (status === "ERRO") {
      return isDark
        ? "bg-red-500/15 text-red-300 border border-red-500/30"
        : "bg-red-50 text-red-700 border border-red-200";
    }

    return isDark
      ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
      : "bg-emerald-50 text-emerald-700 border border-emerald-200";
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
          <div className={`inline-flex items-center rounded-full border px-3 py-1 text-sm ${theme.chip}`}>
            RenovaFleet Control
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
                Dashboard Operacional
              </h1>
              <p className={`${theme.subtle} mt-2 max-w-2xl`}>
                Painel visual para acompanhamento de execucoes, erros por etapa e rastreabilidade das renovacoes automatizadas.
              </p>
            </div>

            <div className={`rounded-2xl border px-4 py-3 ${theme.panel}`}>
              <div className={`text-xs uppercase tracking-[0.2em] ${theme.muted}`}>
                Ultima atualizacao
              </div>
              <div className="text-sm mt-1">Dados simulados do ambiente atual</div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total de execucoes", value: metrics.totalExecucoes },
            { label: "Total de erros", value: metrics.totalErros },
            { label: "Logs de sucesso", value: metrics.totalSucesso },
            { label: "Taxa de erro", value: `${metrics.taxaErro}%` },
          ].map((card) => (
            <div key={card.label} className={`rounded-3xl border p-5 shadow-lg ${theme.panel}`}>
              <div className={`text-sm ${theme.subtle}`}>{card.label}</div>
              <div className="mt-3 text-3xl font-semibold">{card.value}</div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className={`xl:col-span-2 rounded-3xl border p-6 ${theme.panel}`}>
            <h2 className="text-xl font-semibold">Resumo de execucoes</h2>
            <p className={`text-sm mt-1 mb-5 ${theme.subtle}`}>
              Ultimas cotacoes processadas pelo fluxo automatizado.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className={`border-b text-sm ${theme.tableBorder} ${theme.subtle}`}>
                    <th className="pb-3 font-medium">Cotacao</th>
                    <th className="pb-3 font-medium">Cliente</th>
                    <th className="pb-3 font-medium">Seguradora</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Etapa</th>
                    <th className="pb-3 font-medium">Mensagem</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExecutions.map((item) => (
                    <tr key={item.id} className={`border-b text-sm ${theme.rowBorder}`}>
                      <td className="py-4 pr-4 font-medium">{item.id}</td>
                      <td className={`py-4 pr-4 ${theme.subtle}`}>{item.cliente}</td>
                      <td className={`py-4 pr-4 ${theme.subtle}`}>{item.seguradora}</td>
                      <td className="py-4 pr-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(item.status)}`}>
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
              Distribuicao das falhas registradas no processo.
            </p>

            <div className="space-y-4">
              {errorsByStage.map((item) => (
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
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className={`rounded-3xl border p-6 ${theme.panel}`}>
            <h2 className="text-xl font-semibold">Logs por hora</h2>
            <p className={`text-sm mt-1 mb-6 ${theme.subtle}`}>
              Volume agregado de eventos ao longo do tempo.
            </p>

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
          </div>

          <div className={`rounded-3xl border p-6 ${theme.panel}`}>
            <h2 className="text-xl font-semibold">Incidentes recentes</h2>
            <p className={`text-sm mt-1 mb-5 ${theme.subtle}`}>
              Execucoes com falha que exigem acompanhamento.
            </p>

            <div className="space-y-4">
              {recentExecutions
                .filter((item) => item.status === "ERRO")
                .map((item) => (
                  <div key={item.id} className={`rounded-2xl border p-4 ${theme.incidentCard}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">{item.id}</div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className={`mt-2 text-sm ${theme.subtle}`}>
                      {item.cliente} • {item.seguradora}
                    </div>
                    <div className={`mt-3 text-sm ${theme.subtle}`}>Etapa: {item.etapa}</div>
                    <div className={`mt-1 text-sm ${theme.subtle}`}>{item.mensagem}</div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}