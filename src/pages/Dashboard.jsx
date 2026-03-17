import { useNavigate } from "react-router-dom";
import {
  Building2,
  LogOut,
  Clock3,
  ShieldAlert,
  CircleCheckBig,
  TimerReset,
  TriangleAlert,
  FileSpreadsheet,
  RefreshCcw,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const atualizarCriticas = () => {
    alert("Críticas atualizadas com sucesso.");
  };

  const seguradoras = [
    { nome: "HDI", status: "Pronta", lote: 18, horario: "23:58" },
    { nome: "Yelum", status: "Pronta", lote: 9, horario: "23:57" },
    { nome: "Sura", status: "Aguardando liberação", lote: 11, horario: "23:56" },
    { nome: "Suhai", status: "Aguardando liberação", lote: 6, horario: "23:55" },
    { nome: "Tokio Marine", status: "Bloqueio detectado", lote: 7, horario: "23:54" },
  ];

  const criticas = [
    {
      placa: "ABC-1D23",
      cliente: "Frota Oliveira",
      seguradora: "HDI",
      vencimento: "17/03/2026",
      status: "Crítica",
      prioridade: "Alta",
      motivo: "CPF do condutor principal ausente",
      acao: "Revisar cadastro e completar dados antes da validação final",
      comunicacao: "Enviada",
      dataEnvio: "17/03/2026 23:41:08",
      canais: "E-mail / WhatsApp",
      protocolo: "MSG-20260317-234108",
    },
    {
      placa: "QWE-4R56",
      cliente: "Transportes Lima",
      seguradora: "Sura",
      vencimento: "17/03/2026",
      status: "Crítica",
      prioridade: "Alta",
      motivo: "Seguradora ainda não foi liberada para acesso",
      acao: "Executar liberação operacional antes das 23:55",
      comunicacao: "Pendente",
      dataEnvio: "-",
      canais: "-",
      protocolo: "-",
    },
    {
      placa: "ZXC-7T89",
      cliente: "Log Mais",
      seguradora: "Yelum",
      vencimento: "17/03/2026",
      status: "Sem crítica",
      prioridade: "Baixa",
      motivo: "Cadastro validado com sucesso",
      acao: "Sem ação necessária",
      comunicacao: "Não necessário",
      dataEnvio: "-",
      canais: "-",
      protocolo: "-",
    },
    {
      placa: "RTY-8U90",
      cliente: "Expresso Vitória",
      seguradora: "Suhai",
      vencimento: "17/03/2026",
      status: "Crítica",
      prioridade: "Média",
      motivo: "Divergência de placa entre planilha e portal da seguradora",
      acao: "Conferir planilha importada e corrigir registro",
      comunicacao: "Enviada",
      dataEnvio: "17/03/2026 23:43:12",
      canais: "WhatsApp / E-mail",
      protocolo: "MSG-20260317-234312",
    },
  ];

  const badgeStatus = (status) => {
    const estilos = {
      Pronta: "bg-green-100 text-green-700",
      "Aguardando liberação": "bg-amber-100 text-amber-700",
      "Bloqueio detectado": "bg-red-100 text-red-700",
      Crítica: "bg-red-100 text-red-700",
      "Sem crítica": "bg-green-100 text-green-700",
    };

    return estilos[status] || "bg-slate-100 text-slate-700";
  };

  const badgePrioridade = (prioridade) => {
    const estilos = {
      Alta: "bg-red-100 text-red-700",
      Média: "bg-amber-100 text-amber-700",
      Baixa: "bg-slate-100 text-slate-700",
    };

    return estilos[prioridade] || "bg-slate-100 text-slate-700";
  };

  const badgeComunicacao = (comunicacao) => {
    const estilos = {
      Enviada: "bg-green-100 text-green-700",
      Pendente: "bg-amber-100 text-amber-700",
      Falha: "bg-red-100 text-red-700",
      "Não necessário": "bg-slate-100 text-slate-700",
    };

    return estilos[comunicacao] || "bg-slate-100 text-slate-700";
  };

  const exportarCriticasCSV = () => {
    const somenteCriticas = criticas.filter((item) => item.status === "Crítica");

    const cabecalho = [
      "Placa",
      "Cliente/Frota",
      "Seguradora",
      "Vencimento",
      "Status",
      "Prioridade",
      "Motivo da Crítica",
      "Ação Recomendada",
      "Comunicação",
      "Data/Hora Envio",
      "Canais",
      "Protocolo",
    ];

    const linhas = somenteCriticas.map((item) => [
      item.placa,
      item.cliente,
      item.seguradora,
      item.vencimento,
      item.status,
      item.prioridade,
      item.motivo,
      item.acao,
      item.comunicacao,
      item.dataEnvio,
      item.canais,
      item.protocolo,
    ]);

    const conteudo = [cabecalho, ...linhas]
      .map((linha) =>
        linha.map((campo) => `"${String(campo).replace(/"/g, '""')}"`).join(";")
      )
      .join("\n");

    const blob = new Blob([conteudo], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "criticas-operacionais.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Plataforma de automação
              </p>
              <h1 className="text-lg font-bold">RenovaFleet Control</h1>
              <p className="text-sm text-slate-500">
                Corretora logada: Nova Opção Seguros
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs text-slate-600 md:text-sm">
              Operador: Ethan Souza
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6">
        <section className="rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-300">
                Operação crítica de meia-noite
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                Garantir envio às 00:00 para maximizar a exclusividade das cotações.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
                Este painel acompanha a preparação operacional, a fila da madrugada
                e os riscos que podem impedir o envio no horário exato.
              </p>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Por que RenovaFleet Control?</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  O nome une <strong>Renova</strong>, referente à renovação de seguros,
                  <strong> Fleet</strong>, relacionado à gestão de frotas, e
                  <strong> Control</strong>, que reforça controle operacional,
                  monitoramento e rastreabilidade do processo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-emerald-300" />
                  <p className="text-sm text-slate-300">Próxima execução</p>
                </div>
                <p className="mt-3 text-4xl font-bold">00:00</p>
                <p className="mt-2 text-sm text-slate-300">
                  Janela alvo para envio automático
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                <div className="flex items-center gap-3">
                  <TimerReset className="h-5 w-5 text-cyan-300" />
                  <p className="text-sm text-slate-300">Fila da madrugada</p>
                </div>
                <p className="mt-3 text-4xl font-bold">51</p>
                <p className="mt-2 text-sm text-slate-300">
                  Veículos programados para renovação
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                <div className="flex items-center gap-3">
                  <CircleCheckBig className="h-5 w-5 text-green-300" />
                  <p className="text-sm text-slate-300">Seguradoras prontas</p>
                </div>
                <p className="mt-3 text-4xl font-bold">2/5</p>
                <p className="mt-2 text-sm text-slate-300">
                  Preparadas para o disparo noturno
                </p>
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="h-5 w-5 text-amber-300" />
                  <p className="text-sm text-slate-300">Risco operacional</p>
                </div>
                <p className="mt-3 text-2xl font-bold">Moderado</p>
                <p className="mt-2 text-sm text-slate-300">
                  Existem liberações pendentes antes de 00:00
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold">Preparação por seguradora</h3>
                <p className="text-sm text-slate-500">
                  O foco aqui é deixar tudo pronto antes da virada.
                </p>
              </div>

              <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                Atualizar status
              </button>
            </div>

            <div className="space-y-4">
              {seguradoras.map((item) => (
                <div
                  key={item.nome}
                  className="rounded-3xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-semibold">{item.nome}</h4>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStatus(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        Horário sugerido de preparação: {item.horario} • lote previsto:{" "}
                        {item.lote} veículos
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                      <button className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium">
                        Liberar acesso
                      </button>
                      <button className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium">
                        Ver detalhes
                      </button>
                      <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                        Abrir console
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold">Alertas da virada</h3>
            <p className="mt-1 text-sm text-slate-500">
              Itens que podem comprometer o envio em 00:00.
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-3xl bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="mt-0.5 h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900">
                      2 seguradoras ainda aguardam liberação
                    </p>
                    <p className="mt-1 text-sm text-amber-800">
                      Sura e Suhai precisam de preparação operacional antes da janela crítica.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <TriangleAlert className="mt-0.5 h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">
                      Bloqueio detectado em Tokio Marine
                    </p>
                    <p className="mt-1 text-sm text-red-800">
                      Revisar acesso antes do lote previsto para evitar perda de tempo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  Recomendação operacional
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Finalizar todas as liberações até 23:55 para manter margem segura
                  antes do disparo automático das 00:00.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-bold">Críticas operacionais da madrugada</h3>
              <p className="text-sm text-slate-500">
                Veículos com pendências que podem impedir o envio exato às 00:00.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={atualizarCriticas}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                <RefreshCcw className="h-4 w-4" />
                Atualizar críticas
              </button>

              <button
                onClick={exportarCriticasCSV}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar críticas
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1400px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-medium">Placa</th>
                  <th className="px-3 py-3 font-medium">Cliente/Frota</th>
                  <th className="px-3 py-3 font-medium">Seguradora</th>
                  <th className="px-3 py-3 font-medium">Vencimento</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Prioridade</th>
                  <th className="px-3 py-3 font-medium">Motivo da crítica</th>
                  <th className="px-3 py-3 font-medium">Ação recomendada</th>
                  <th className="px-3 py-3 font-medium">Comunicação</th>
                  <th className="px-3 py-3 font-medium">Data/Hora envio</th>
                  <th className="px-3 py-3 font-medium">Canais</th>
                  <th className="px-3 py-3 font-medium">Protocolo</th>
                </tr>
              </thead>
              <tbody>
                {criticas.map((item) => (
                  <tr
                    key={item.placa}
                    className={`border-b border-slate-100 ${
                      item.status === "Crítica" ? "bg-red-50/40" : ""
                    }`}
                  >
                    <td className="px-3 py-4 font-medium whitespace-nowrap">{item.placa}</td>
                    <td className="px-3 py-4">{item.cliente}</td>
                    <td className="px-3 py-4 whitespace-nowrap">{item.seguradora}</td>
                    <td className="px-3 py-4 whitespace-nowrap">{item.vencimento}</td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStatus(item.status)}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${badgePrioridade(item.prioridade)}`}
                      >
                        {item.prioridade}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-slate-700">{item.motivo}</td>
                    <td className="px-3 py-4 text-slate-600">{item.acao}</td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${badgeComunicacao(item.comunicacao)}`}
                      >
                        {item.comunicacao}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">{item.dataEnvio}</td>
                    <td className="px-3 py-4 whitespace-nowrap">{item.canais}</td>
                    <td className="px-3 py-4 font-mono text-xs whitespace-nowrap">{item.protocolo}</td>
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