export interface DashboardFilters {
  dateRange: {
    start: Date;
    end: Date;
    preset?: string;
  };
  produtos: string[];
  orgaos: string[];
  canais: string[];
}

export interface KPIData {
  producaoTotal: number;
  qtdeOperacoes: number;
  producaoDia: number;
  operacoesDia: number;
  ticketMedio: number;
  crescimentoVsPeriodo: number;
  crescimentoPercentual: number;
  qtdeCadastros: number;
}

export interface TimeSeriesData {
  date: string;
  producao: number;
  operacoes: number;
}

export interface DistributionData {
  name: string;
  value: number;
  percentage: number;
  color?: string;
}

export interface DetailRow {
  id: string;
  data: string;
  produto: string;
  orgao: string;
  canal: string;
  qtdeOperacoes: number;
  producao: number;
  ticketMedio: number;
}

export interface GoalData {
  metaMes: number | null;
  producaoAtual: number;
  faltante: number;
  mediaDiariaNecessaria: number;
  mediaDiariaAtual: number;
  progresso: number;
  diasRestantes: number;
}

export interface InsightData {
  type: 'info' | 'success' | 'warning';
  icon: string;
  text: string;
}
