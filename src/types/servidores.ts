export interface ServidorBase {
  id: string;
  convenio: string;
  nome: string;
  cpf: string;
  matricula: string;
  categoria: string;
  dataCadastro: string;
  telefone: string;
  email: string;
  rg: string;
  rgNumero: string;
  rgOrgaoEmissor: string;
  rgUf: string;
  rgDataEmissao: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: 'Corrente' | 'Poupança';
  bloqueadoPorOrdemJudicial?: boolean;
}

export interface Servidor extends ServidorBase {
  cartaoCompras: 'Ativo' | 'Inativo';
  beneficioSaque: 'Ativo' | 'Inativo';
}

export interface ParcelaBeneficio {
  id: string;
  numero: number;
  vencimento: string;
  valorNominal: number;
  valorPresente: number;
  taxaMensal: number;
  status: 'À vencer' | 'Pago';
}

export interface OperacaoBeneficioSaque {
  id: string;
  numeroProposta: string;
  data: string;
  tipo: string;
  valor: number;
  valorParcela: number;
  prazo: number;
  valorLiberado: number;
  status: 'Ativo' | 'Quitado' | 'Quitado com Pendências';
  parcelas: ParcelaBeneficio[];
  taxaMensal: number;
}

export interface TransacaoCartao {
  id: string;
  data: string;
  estabelecimento: string;
  valor: number;
  tipo: 'Compra' | 'Estorno';
  competencia: string;
}

export interface FaturaCartao {
  competencia: string;
  periodoInicio: string;
  periodoFim: string;
  dataFechamento: string;
  competenciaFolha: string;
  valorTotal: number;
  statusDesconto: string;
  valorDescontado: number;
}

export interface LogAcaoCartao {
  id: string;
  dataHora: string;
  usuario: string;
  acao: string;
  situacaoAnterior: string;
  situacaoNova: string;
  motivo: string;
}

export interface CartaoDetalhes {
  temCartao: boolean;
  dataSolicitacao: string;
  status: 'Ativo' | 'Bloqueado';
  aproximacao: 'Ativo' | 'Inativo';
  compraOnline: 'Ativo' | 'Inativo';
  limite: number;
  valorConsumido: number;
  saldoDisponivel: number;
  faturas: FaturaCartao[];
  transacoes: TransacaoCartao[];
  logs: LogAcaoCartao[];
  dataCorteDia: number;
}

export interface OperacaoCartaoCompras {
  id: string;
  data: string;
  tipo: string;
  valor: number;
  status: 'Aprovado' | 'Pendente' | 'Estornado';
  estabelecimento?: string;
}

export interface Plano {
  id: string;
  nome: string;
  situacao: 'Ativo' | 'Inativo' | 'Cancelado';
  dataAdesao: string;
  valorMensal: number;
  beneficios: string[];
}

export interface DocumentoPessoal {
  id: string;
  tipo: 'RG/CNH' | 'Contracheque';
  dataEnvio: string;
  status: 'Enviado' | 'Não enviado';
  url: string;
  nomeArquivo: string;
}

export interface ServidorCompleto extends ServidorBase {
  cartaoCompras: 'Ativo' | 'Inativo';
  beneficioSaque: 'Ativo' | 'Inativo';
  plano: 'Ativo' | 'Inativo';
  beneficioSaqueDetalhes: {
    status: 'Ativo' | 'Inativo';
    quantidadeOperacoes: number;
    valorTotalLiberado: number;
    operacoes: OperacaoBeneficioSaque[];
  };
  cartaoComprasDetalhes: {
    status: 'Ativo' | 'Inativo';
    quantidadeOperacoes: number;
    valorTotalLiberado: number;
    operacoes: OperacaoCartaoCompras[];
  };
  cartaoDetalhesCompleto: CartaoDetalhes;
  planos: {
    quantidadePlanos: number;
    planos: Plano[];
  };
  documentos: DocumentoPessoal[];
}
