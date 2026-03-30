export interface CadastroAplicativo {
  id: string;
  dataCadastro: Date;
  operadora: string;
  convenio: string;
  nome: string;
  cpf: string;
  matricula: string;
  celular: string;
  email: string;
  dataNascimento: Date | null;
  categoria: string | null;
  margemCompras: number | null;
  margemSaque: number | null;
}

export type ClassificacaoLead = 'oportunidade' | 'lead_desqualificado' | 'possivel_lead';

export type TipoProduto = 'cartao_compras' | 'saque_facil' | 'todos';

export interface RegraProduto {
  produto: TipoProduto;
  idadeMinima: number;
  idadeMaxima: number;
  categoriasElegiveis: string[] | 'todas';
  margemMinima: number;
}

export interface ResultadoAnalise {
  cadastro: CadastroAplicativo;
  produto: TipoProduto;
  classificacao: ClassificacaoLead;
  motivo: string;
  idade: number | null;
}

export interface KPIAnaliseOportunidades {
  totalEntradas: number;
  totalOportunidades: number;
  totalDesqualificados: number;
  totalPossiveisLeads: number;
  taxaOportunidade: number;
}

export interface ResumoAnalise {
  produto: string;
  totalAnalisado: number;
  oportunidades: number;
  desqualificados: number;
  possiveisLeads: number;
  taxaOportunidade: number;
}

export interface FiltroAnaliseOportunidades {
  dataInicio: Date;
  dataFim: Date;
  convenio: string;
  produto: TipoProduto;
  operadora?: string;
  classificacao?: ClassificacaoLead | 'todos';
}
