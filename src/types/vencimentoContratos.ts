export interface VencimentoContrato {
  id: string;
  convenio: string;
  numeroProposta: string;
  contratoExterno: string;
  cpf: string;
  matricula: string;
  nomeServidor: string;
  categoria: string;
  celular: string;
  email: string;
  valorContrato: number;
  valorParcela: number;
  qtdeTotalParcelas: number;
  qtdeParcelasLiquidadas: number;
  vencimentoUltimaParcela: Date;
  faixaVencimento: 'ate30' | 'ate60' | 'ate90' | 'acima90';
  diasParaVencimento: number;
  canal: string;
  statusOportunidade: 'alta' | 'media' | 'baixa';
}

export interface VencimentoFilters {
  dateRange: {
    start: Date;
    end: Date;
    preset?: string;
  };
  convenios: string[];
  canais: string[];
  faixaVencimento: string;
}

export interface VencimentoKPIData {
  totalContratos: number;
  valorTotalContratos: number;
  somaParcelas: number;
  contratosAte30Dias: number;
  contratosAte60Dias: number;
  contratosAte90Dias: number;
}

export interface VencimentoResumo {
  grupo: string;
  qtdeContratos: number;
  somaValorContratos: number;
  somaValorParcelas: number;
}
