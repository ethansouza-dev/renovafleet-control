import { useNavigate } from "react-router-dom";
import { Building2, Lock, Mail, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
          <div className="absolute -left-20 top-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 backdrop-blur">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-lg">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Plataforma de automação
                  </p>
                  <p className="text-sm font-semibold text-white">
                    RenovaFleet Control
                  </p>
                </div>
              </div>

              <div className="mt-16 max-w-xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-300/80">
                  Gestão de renovação para corretoras
                </p>
                <h1 className="mt-5 text-4xl font-bold leading-tight text-white xl:text-5xl">
                  Controle sua operação noturna com segurança, visibilidade e escala.
                </h1>
                <p className="mt-6 text-base leading-7 text-slate-300 xl:text-lg">
                  Um único painel para acompanhar filas de renovação, preparar acessos operacionais,
                  monitorar execuções do robô e organizar várias corretoras com fluxos independentes.
                </p>

                <div className="mt-8 rounded-3xl border border-slate-800 bg-white/5 p-5 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white">
                    Por que RenovaFleet Control?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    O nome une <strong>Renova</strong>, referente à renovação de seguros,
                    <strong> Fleet</strong>, ligado à gestão de frotas, e
                    <strong> Control</strong>, que reforça monitoramento, organização e rastreabilidade.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <div className="rounded-3xl border border-slate-800 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-300">Segregação por corretora</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Cada login acessa apenas sua própria fila, seguradoras, operadores e históricos.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-300">Fluxos configuráveis</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Ajuste janelas de preparação e regras operacionais para cada seguradora.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm font-medium text-slate-300">Operação rastreável</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Registre liberações, falhas e evidências com histórico completo.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
          <div className="w-full max-w-md">
            <div className="mb-6 lg:hidden">
              <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Plataforma de automação
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    RenovaFleet Control
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">
                  Por que esse nome?
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  <strong>Renova</strong> representa a renovação de seguros,
                  <strong> Fleet</strong> remete à gestão de frotas e
                  <strong> Control</strong> reforça o controle operacional e a rastreabilidade.
                </p>
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-emerald-600">
                    Acesso da corretora
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Entrar na plataforma
                  </h2>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-slate-900 text-white shadow-lg">
                  <ShieldCheck className="h-7 w-7" />
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Use as credenciais da sua corretora para acessar filas de renovação,
                liberações operacionais e logs do robô.
              </p>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    E-mail corporativo
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-slate-900 focus-within:bg-white">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="operacao@corretora.com.br"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Senha
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-slate-900 focus-within:bg-white">
                    <Lock className="h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Digite sua senha"
                      className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800"
                >
                  Entrar no painel
                </button>
              </form>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Ambiente
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Operação multi-corretora
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Acesso isolado por empresa, usuário e fluxo operacional.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Suporte
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Equipe de implantação
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Configuração de seguradoras, usuários e janelas de execução.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}