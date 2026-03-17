export default function RoboCorretoraUI() {
    const seguradoras = [
      { nome: 'HDI', status: 'Aguardando liberação', horario: '22:00', vencimentos: 18 },
      { nome: 'Yelum', status: 'Liberada', horario: '21:30', vencimentos: 9 },
      { nome: 'Suhai', status: 'Pendente', horario: '22:15', vencimentos: 6 },
      { nome: 'Sura', status: 'Aguardando liberação', horario: '21:45', vencimentos: 11 },
      { nome: 'Tokio Marine', status: 'Bloqueio detectado', horario: '22:10', vencimentos: 7 },
    ];
  
    const filas = [
      { placa: 'ABC-1D23', cliente: 'Frota Oliveira', seguradora: 'HDI', vencimento: '2026-03-17', status: 'Na fila' },
      { placa: 'QWE-4R56', cliente: 'Transportes Lima', seguradora: 'Sura', vencimento: '2026-03-17', status: 'Captcha liberado' },
      { placa: 'ZXC-7T89', cliente: 'Log Mais', seguradora: 'Yelum', vencimento: '2026-03-17', status: 'Pronto para envio' },
    ];
  
    const badge = (status) => {
      const styles = {
        'Liberada': 'bg-green-100 text-green-700',
        'Captcha liberado': 'bg-green-100 text-green-700',
        'Pronto para envio': 'bg-blue-100 text-blue-700',
        'Aguardando liberação': 'bg-amber-100 text-amber-700',
        'Pendente': 'bg-slate-100 text-slate-700',
        'Bloqueio detectado': 'bg-red-100 text-red-700',
        'Na fila': 'bg-slate-100 text-slate-700',
      };
      return styles[status] || 'bg-slate-100 text-slate-700';
    };
  
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Painel operacional</p>
                <h1 className="text-3xl font-bold tracking-tight">Robô de Renovação da Corretora</h1>
                <p className="mt-2 max-w-3xl text-sm text-slate-600">
                  Interface para acompanhamento da fila, liberação operacional prévia e monitoramento das execuções noturnas.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs text-slate-500">Seguradoras ativas</p>
                  <p className="mt-1 text-2xl font-semibold">5</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs text-slate-500">Fila de hoje</p>
                  <p className="mt-1 text-2xl font-semibold">51</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs text-slate-500">Liberadas</p>
                  <p className="mt-1 text-2xl font-semibold">2</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-4">
                  <p className="text-xs text-slate-500">Falhas</p>
                  <p className="mt-1 text-2xl font-semibold">1</p>
                </div>
              </div>
            </div>
          </header>
  
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Liberação operacional por seguradora</h2>
                  <p className="text-sm text-slate-500">A equipe prepara o acesso antecipadamente para as execuções agendadas.</p>
                </div>
                <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  Atualizar status
                </button>
              </div>
  
              <div className="space-y-4">
                {seguradoras.map((item) => (
                  <div key={item.nome} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{item.nome}</h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          Janela operacional sugerida: {item.horario} • veículos previstos: {item.vencimentos}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium">
                          Marcar como pronta
                        </button>
                        <button className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium">
                          Registrar bloqueio
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
  
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Checklist pré-execução</h2>
              <div className="mt-4 space-y-3 text-sm">
                <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <input type="checkbox" className="mt-1" />
                  <span>Validar credenciais da seguradora antes do início da fila.</span>
                </label>
                <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <input type="checkbox" className="mt-1" />
                  <span>Confirmar que o operador realizou a etapa manual permitida pelo portal.</span>
                </label>
                <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <input type="checkbox" className="mt-1" />
                  <span>Verificar se a fila de veículos foi importada da planilha.</span>
                </label>
                <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3">
                  <input type="checkbox" className="mt-1" />
                  <span>Conferir se o agendamento noturno está ativo no servidor.</span>
                </label>
              </div>
  
              <div className="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
                <p className="text-sm font-medium">Próxima execução</p>
                <p className="mt-2 text-2xl font-bold">23:58</p>
                <p className="mt-2 text-sm text-slate-300">HDI • lote com 18 veículos</p>
              </div>
            </div>
          </section>
  
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Fila de veículos</h2>
                <p className="text-sm text-slate-500">Itens importados da planilha e preparados para execução.</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium">Importar planilha</button>
                <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">Executar validação</button>
              </div>
            </div>
  
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-medium">Placa</th>
                    <th className="px-3 py-3 font-medium">Cliente</th>
                    <th className="px-3 py-3 font-medium">Seguradora</th>
                    <th className="px-3 py-3 font-medium">Vencimento</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {filas.map((item) => (
                    <tr key={item.placa} className="border-b border-slate-100">
                      <td className="px-3 py-4 font-medium">{item.placa}</td>
                      <td className="px-3 py-4">{item.cliente}</td>
                      <td className="px-3 py-4">{item.seguradora}</td>
                      <td className="px-3 py-4">{item.vencimento}</td>
                      <td className="px-3 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <button className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium">Detalhes</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    );
  }