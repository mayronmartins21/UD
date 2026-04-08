export type EtapaProposta = 'simulador' | 'cadastro' | 'documentos' | 'reserva' | 'aprovacao' | 'ccb' | 'video_chamada' | 'concluida';
export type StatusProposta = 'em_andamento' | 'correcao_solicitada' | 'pendente_assinatura' | 'aprovada' | 'concluida';
export type EtapaCorrecao = 'cadastro' | 'documentos' | 'reserva';
export type StatusPagamento = 'pago' | 'devolvido' | 'pendente';

export interface Proposta {
  id: string;
  numero_proposta: string;
  cpf_cliente: string;
  nome_cliente: string;
  etapa_atual: EtapaProposta;
  status: StatusProposta;
  status_pagamento?: StatusPagamento;
  dados_simulador: Record<string, any>;
  dados_cadastro: Record<string, any>;
  dados_documentos: Record<string, any>;
  dados_reserva: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface PropostaCorrecao {
  id: string;
  proposta_id: string;
  etapa: EtapaCorrecao;
  comentario: string;
  solicitado_por: string;
  solicitado_em: string;
  corrigido: boolean;
  corrigido_em?: string;
}

export interface PropostaLog {
  id: string;
  proposta_id: string;
  acao: string;
  etapa_anterior?: string;
  etapa_nova?: string;
  usuario_id: string;
  detalhes: Record<string, any>;
  created_at: string;
}

export interface PropostaComCorrecoes extends Proposta {
  correcoes?: PropostaCorrecao[];
}

export const ETAPAS_LABELS: Record<EtapaProposta, string> = {
  simulador: 'Simulador',
  cadastro: 'Cadastro',
  documentos: 'Documentos',
  reserva: 'Reserva e Análise',
  aprovacao: 'Em Aprovação',
  ccb: 'CCB',
  video_chamada: 'Vídeo Chamada',
  concluida: 'Concluída'
};

export const STATUS_LABELS: Record<StatusProposta, string> = {
  em_andamento: 'Em Andamento',
  correcao_solicitada: 'Correção Solicitada',
  pendente_assinatura: 'Pendente de Assinatura',
  aprovada: 'Aprovada',
  concluida: 'Concluída'
};

export const STATUS_PAGAMENTO_LABELS: Record<StatusPagamento, string> = {
  pago: 'Pago',
  devolvido: 'Devolvido',
  pendente: 'Pendente'
};

export const ETAPAS_ORDEM: EtapaProposta[] = [
  'simulador',
  'cadastro',
  'reserva',
  'ccb',
  'video_chamada',
  'concluida'
];
