export interface Convenio {
  id: string;
  processadora: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  tempoMargem: number;
  diasProposta: number;
  percentualRecolhimento: number;
  diaRepasse: number;
  diaCorte: number;
  status: 'ativo' | 'inativo';
  createdAt: string;
  updatedAt: string;
}

export interface AgendaCorte {
  id: string;
  convenioId: string;
  dataInicio: string;
  dataFim: string;
  observacao: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
}

export interface ArquivoDebito {
  id: string;
  convenioId: string;
  nomeLayout: string;
  colunas: string;
  periodicidade: string;
  observacao: string;
  createdAt: string;
}

export interface ContatoConvenio {
  id: string;
  convenioId: string;
  nome: string;
  email: string;
  celular: string;
  telefone: string;
  departamento: string;
  tipo: 'principal' | 'financeiro' | 'juridico' | 'operacional' | 'ti';
  observacao?: string;
  ativo: boolean;
  createdAt: string;
}

export interface ParametrizacaoConvenio {
  id: string;
  convenioId: string;
  utilizaTokenConsulta: boolean;
  utilizaTokenAverbacao: boolean;
  utilizaSenhaConsignacao: boolean;
  ehEstabelecimento: boolean;
  cartaoComprasLiberado: boolean;
  atendimento: string;
  realizaOfertaSaqueFacil: boolean;
  cartaoSaqueFacilLiberado: boolean;
  categoriasCartaoCompras: string[];
  categoriasSaqueFacil: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PrazoParametrizacao {
  id: string;
  parametrizacaoId: string;
  tipoOperacao: string;
  parcelasMin: number;
  parcelasMax: number;
  carenciaDias: number;
  observacao?: string;
  createdAt: string;
}

export interface Decreto {
  id: string;
  convenioId: string;
  numero: string;
  dataPublicacao: string;
  ementa: string;
  arquivoUrl?: string;
  status: 'vigente' | 'revogado';
  dataVigenciaInicio: string;
  dataVigenciaFim?: string;
  principal: boolean;
  createdAt: string;
}

export interface RoteiroOperacional {
  id: string;
  convenioId: string;
  versao: string;
  dataVersao: string;
  responsavel: string;
  descricao: string;
  arquivoUrl?: string;
  versaoAtual: boolean;
  createdAt: string;
}

export interface ConvenioCompleto extends Convenio {
  agendasCorte: AgendaCorte[];
  arquivosDebito: ArquivoDebito[];
  contatos: ContatoConvenio[];
  parametrizacao?: ParametrizacaoConvenio;
  prazos: PrazoParametrizacao[];
  decretos: Decreto[];
  roteirosOperacionais: RoteiroOperacional[];
}
