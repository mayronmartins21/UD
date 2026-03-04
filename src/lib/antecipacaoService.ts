import type { ParcelaBeneficio } from '../types/servidores';

export interface SimulacaoAntecipacaoRequest {
  parcelas: ParcelaBeneficio[];
  dataReferencia: string;
  taxaMensal: number;
}

export interface SimulacaoAntecipacaoResponse {
  saldoDevedor: number;
  valorNominalTotal: number;
  valorPresenteTotal: number;
  economiaEstimada: number;
  dataBase: string;
  quantidadeParcelas: number;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const simularAntecipacao = async (
  request: SimulacaoAntecipacaoRequest
): Promise<SimulacaoAntecipacaoResponse> => {
  await delay(1500 + Math.random() * 1000);

  if (Math.random() < 0.05) {
    throw new Error('Erro ao comunicar com o servidor do parceiro');
  }

  const dataBase = new Date(request.dataReferencia);
  const hoje = new Date();

  let valorNominalTotal = 0;
  let valorPresenteTotal = 0;

  request.parcelas.forEach(parcela => {
    const vencimento = new Date(parcela.vencimento);
    valorNominalTotal += parcela.valorNominal;

    const diasAteVencimento = Math.floor((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    const diasAteReferencia = Math.floor((dataBase.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    let vp: number;
    if (diasAteReferencia >= diasAteVencimento) {
      vp = parcela.valorNominal;
    } else {
      const mesesDesconto = (diasAteVencimento - diasAteReferencia) / 30;
      const taxa = request.taxaMensal / 100;
      vp = parcela.valorNominal / Math.pow(1 + taxa, mesesDesconto);
    }

    valorPresenteTotal += Math.max(0, vp);
  });

  const economiaEstimada = valorNominalTotal - valorPresenteTotal;

  return {
    saldoDevedor: valorPresenteTotal,
    valorNominalTotal,
    valorPresenteTotal,
    economiaEstimada: Math.max(0, economiaEstimada),
    dataBase: request.dataReferencia,
    quantidadeParcelas: request.parcelas.length
  };
};
