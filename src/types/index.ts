// Tipos base do sistema
export type StatusCompetencia = 'Aberta' | 'EmConciliacao' | 'Conciliada' | 'Fechada';
export type StatusProcessamento = 'EmValidacao' | 'Processando' | 'Concluido' | 'ConcluidoComAlertas' | 'Falhou';
export type StatusConciliacao = 'Descontado' | 'NaoDescontado' | 'Divergencia' | 'NaoLocalizada' | 'EsperandoRetorno';
export type StatusOperacao = 'Ativa' | 'Cancelada' | 'Quitada';
export type StatusParcela = 'Aguardando' | 'Descontado' | 'NaoDescontado' | 'Divergencia' | 'EsperandoRetorno';
export type StatusLinha = 'OK' | 'Alerta' | 'Erro';
export type Produto = 'CartaoCompras' | 'CartaoSaque' | 'Emprestimo' | 'FGTS' | 'outros';
export type Empresa = 'UD' | 'Fundo';
export type CategoriaMotivo = 'Margem' | 'Rubrica' | 'Judicial' | 'Sistemico' | 'Cancelamento' | 'Outros';
export type PerfilUsuario = 'Operador' | 'Financeiro' | 'Admin';

export interface Convenio {
  id: string;
  nome: string;
  orgao: string;
  averbadora: string;
  empresa: Empresa;
  ativo: boolean;
  regras_json: {
    data_corte: string;
    data_pagamento: string;
    data_repasse: string;
    tolerancia_divergencia: { [produto: string]: number };
    regras_rubrica: any;
  };
}

export interface Operacao {
  id: string;
  convenio_id: string;
  produto: Produto;
  empresa: Empresa;
  cpf: string;
  matricula: string;
  rubrica: string;
  secretaria: string;
  nosso_numero: string;
  status_operacao: StatusOperacao;
}

export interface Parcela {
  id: string;
  operacao_id: string;
  competencia_ref: string;
  numero_parcela: number;
  valor_previsto: number;
  vencimento_folha: string;
  status_parcela: StatusParcela;
  valor_conciliado?: number;
}

export interface LayoutAverbadora {
  id: string;
  nome: string;
  averbadora: string;
  formato: 'csv' | 'txt_fixed';
  separador: string;
  header_rows: number;
  encoding: string;
  date_format: string;
  mapping_json: { [key: string]: string };
}

export interface ArquivoRetorno {
  id: string;
  convenio_id: string;
  averbadora: string;
  competencia_ref: string;
  nome_arquivo: string;
  hash_arquivo: string;
  tamanho_bytes: number;
  usuario_upload: string;
  data_upload: string;
  layout_id: string;
  status_processamento: StatusProcessamento;
  erros_validacao?: string;
  total_linhas: number;
  linhas_processadas: number;
}

export interface RetornoLinha {
  id: string;
  arquivo_id: string;
  competencia_ref: string;
  cpf: string;
  matricula: string;
  rubrica: string;
  nosso_numero: string;
  numero_parcela: number;
  valor_descontado: number;
  valor_informado?: number;
  codigo_ocorrencia: string;
  descricao_ocorrencia: string;
  data_evento: string;
  fingerprint: string;
  status_linha: StatusLinha;
}

export interface ConciliacaoParcela {
  id: string;
  parcela_id: string;
  retorno_linha_id?: string;
  status_conciliacao: StatusConciliacao;
  motivo: string;
  valor_conciliado?: number;
  divergencia?: number;
  retroativo: boolean;
  data_conciliacao: string;
}

export interface CompetenciaFechamento {
  id: string;
  convenio_id: string;
  competencia_ref: string;
  status: StatusCompetencia;
  usuario: string;
  data: string;
  tot_enviado: number;
  tot_descontado: number;
  tot_nao_descontado: number;
  tot_glosas: number;
  efetivacao_pct: number;
}

export interface MotivoOcorrencia {
  codigo: string;
  descricao: string;
  categoria: CategoriaMotivo;
}

export interface AuditoriaLog {
  id: string;
  entidade: string;
  entidade_id: string;
  acao: string;
  de_para_json: any;
  usuario: string;
  timestamp: string;
}

export interface KPIData {
  enviado_valor: number;
  enviado_qtd: number;
  descontado_valor: number;
  descontado_qtd: number;
  nao_descontado_valor: number;
  nao_descontado_qtd: number;
  divergencias_valor: number;
  divergencias_qtd: number;
  efetivacao_pct: number;
  retroativo_valor: number;
}

export interface FiltroGeral {
  ano?: number;
  competencia?: string[];
  convenio?: string[];
  averbadora?: string;
  produto?: Produto;
  empresa?: Empresa;
  secretaria?: string;
  rubrica?: string;
}