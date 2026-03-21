import { supabase } from "./supabase";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function runRobotSimulation() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data: frotas, error: frotasError } = await supabase
    .from("frotas")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (frotasError) throw frotasError;
  if (!frotas || frotas.length === 0) {
    throw new Error("Nenhuma frota cadastrada.");
  }

  const { data: seguradoras, error: seguradorasError } = await supabase
    .from("seguradoras_corretora")
    .select("*")
    .eq("user_id", user.id)
    .eq("ativo", true)
    .order("created_at", { ascending: false })
    .limit(1);

  if (seguradorasError) throw seguradorasError;
  if (!seguradoras || seguradoras.length === 0) {
    throw new Error("Nenhuma seguradora ativa cadastrada.");
  }

  const frota = frotas[0];
  const seguradora = seguradoras[0];

  const etapas = [
    {
      status: "PROCESSANDO",
      etapa: "LOGIN",
      mensagem: `Login realizado na seguradora ${seguradora.nome_seguradora}.`,
    },
    {
      status: "PROCESSANDO",
      etapa: "ENVIO",
      mensagem: `Enviando cotação ${frota.cotacao}.`,
    },
  ];

  for (const item of etapas) {
    const { error } = await supabase.from("execucoes").insert([
      {
        user_id: user.id,
        frota_id: frota.id,
        cotacao: frota.cotacao,
        nome_frota: frota.nome_frota,
        nome_seguradora: seguradora.nome_seguradora,
        status: item.status,
        etapa: item.etapa,
        mensagem: item.mensagem,
      },
    ]);

    if (error) throw error;
    await wait(800);
  }

  const sucesso = Math.random() > 0.3;

  const etapaFinal = sucesso
    ? {
        status: "SUCESSO",
        etapa: "FINALIZADO",
        mensagem: `Cotação ${frota.cotacao} processada com sucesso.`,
      }
    : {
        status: "ERRO",
        etapa: "ENVIO",
        mensagem: `Falha ao enviar cotação ${frota.cotacao} para ${seguradora.nome_seguradora}.`,
      };

  const { error: finalError } = await supabase.from("execucoes").insert([
    {
      user_id: user.id,
      frota_id: frota.id,
      cotacao: frota.cotacao,
      nome_frota: frota.nome_frota,
      nome_seguradora: seguradora.nome_seguradora,
      status: etapaFinal.status,
      etapa: etapaFinal.etapa,
      mensagem: etapaFinal.mensagem,
    },
  ]);

  if (finalError) throw finalError;

  return {
    ok: true,
    cotacao: frota.cotacao,
    seguradora: seguradora.nome_seguradora,
    resultado: etapaFinal.status,
  };
}