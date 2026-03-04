export type TipoOperacao = 'Antecipacao' | 'Quitacao';
export type StatusAntecipacao = 'Pendente' | 'Pago' | 'RepassePendente' | 'RepassadoFundo' | 'Cancelado';

export interface FiltroAntecipacao {
  convenio?: string;
  tipo?: TipoOperacao;
  status?: StatusAntecipacao;
  competencia?: string;
  busca?: string;
}

export interface RegistroAntecipacao {
  id: string;
  data_recebimento: string;
  cpf: string;
  servidor_nome: string;
  convenio_id: string;
  convenio_nome: string;
  operacao_id: string;
  tipo: TipoOperacao;
  parcelas_antecipadas: string;
  valor_recebido: number;
  repasse_qista: boolean;
  data_repasse: string;
  status: StatusAntecipacao;
  anexos: {
    boleto: boolean;
    comprovante_pagamento: boolean;
    planilha_calculo: boolean;
  };
  observacoes: string;
}

export interface KPIAntecipacao {
  qtde_antecipacoes: number;
  qtde_quitacoes: number;
  total_recebido: number;
  pendente_repasse: number;
  repassado_qista: number;
  tempo_medio_repasse: number;
}