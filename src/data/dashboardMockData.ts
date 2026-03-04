import type { TimeSeriesData, DistributionData, DetailRow } from '../types/dashboard';

const produtos = ['Saque Fácil', 'Cartão Compras', 'Plano Porto Seguro'];
const orgaos = [
  'Prefeitura de Sorocaba',
  'Prefeitura de Guarulhos',
  'Prefeitura de Hortolândia',
  'Prefeitura do Rio de Janeiro',
  'Governo de Goiás',
  'Governo do Paraná',
  'Governo do Maranhão',
  'Prefeitura de Santo André',
  'Convênio Neoconsig'
];
const canais = ['UD', 'Soft', 'Prisma'];

export const generateTimeSeriesData = (
  startDate: Date,
  endDate: Date,
  granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const baseProducao = 50000 + Math.random() * 150000;
    const trend = Math.sin((current.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30) * Math.PI) * 30000;
    const seasonal = current.getMonth() === 11 ? 50000 : 0;

    const producao = baseProducao + trend + seasonal;
    const operacoes = Math.floor(producao / (3000 + Math.random() * 2000));

    data.push({
      date: current.toISOString().split('T')[0],
      producao: Math.round(producao),
      operacoes
    });

    if (granularity === 'daily') {
      current.setDate(current.getDate() + 1);
    } else if (granularity === 'weekly') {
      current.setDate(current.getDate() + 7);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
  }

  return data;
};

export const generateDistributionByProduct = (
  startDate: Date,
  endDate: Date,
  filters: any
): DistributionData[] => {
  const colors = ['#3B82F6', '#10B981', '#8B5CF6'];
  const weights = [0.5, 0.35, 0.15];

  const totalProducao = Math.random() * 5000000 + 3000000;

  return produtos
    .filter(p => filters.produtos.length === 0 || filters.produtos.includes(p))
    .map((produto, idx) => ({
      name: produto,
      value: Math.round(totalProducao * weights[idx]),
      percentage: weights[idx] * 100,
      color: colors[idx]
    }));
};

export const generateDistributionByOrgao = (
  startDate: Date,
  endDate: Date,
  filters: any
): DistributionData[] => {
  const totalProducao = Math.random() * 5000000 + 3000000;
  const filteredOrgaos = filters.orgaos.length === 0 ? orgaos : orgaos.filter(o => filters.orgaos.includes(o));

  return filteredOrgaos
    .map(orgao => ({
      name: orgao,
      value: Math.round(totalProducao * (Math.random() * 0.25 + 0.05)),
      percentage: 0,
      color: '#3B82F6'
    }))
    .sort((a, b) => b.value - a.value)
    .map(item => ({
      ...item,
      percentage: (item.value / totalProducao) * 100
    }));
};

export const generateDistributionByCanal = (
  startDate: Date,
  endDate: Date,
  filters: any
): DistributionData[] => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B'];
  const weights = [0.6, 0.25, 0.15];

  const totalProducao = Math.random() * 5000000 + 3000000;
  const filteredCanais = filters.canais.length === 0 ? canais : canais.filter(c => filters.canais.includes(c));

  return filteredCanais.map((canal, idx) => ({
    name: canal,
    value: Math.round(totalProducao * weights[idx]),
    percentage: weights[idx] * 100,
    color: colors[idx]
  }));
};

export const generateDetailRows = (
  startDate: Date,
  endDate: Date,
  filters: any,
  page: number = 1,
  pageSize: number = 10
): { data: DetailRow[], total: number } => {
  const allRows: DetailRow[] = [];
  const current = new Date(startDate);
  let id = 1;

  while (current <= endDate) {
    const numRows = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numRows; i++) {
      const produto = produtos[Math.floor(Math.random() * produtos.length)];
      const orgao = orgaos[Math.floor(Math.random() * orgaos.length)];
      const canal = canais[Math.floor(Math.random() * canais.length)];

      const shouldInclude =
        (filters.produtos.length === 0 || filters.produtos.includes(produto)) &&
        (filters.orgaos.length === 0 || filters.orgaos.includes(orgao)) &&
        (filters.canais.length === 0 || filters.canais.includes(canal));

      if (shouldInclude) {
        const qtdeOperacoes = Math.floor(Math.random() * 30) + 5;
        const ticketMedio = Math.random() * 3000 + 2000;
        const producao = qtdeOperacoes * ticketMedio;

        allRows.push({
          id: `${id++}`,
          data: current.toISOString().split('T')[0],
          produto,
          orgao,
          canal,
          qtdeOperacoes,
          producao: Math.round(producao),
          ticketMedio: Math.round(ticketMedio)
        });
      }
    }

    current.setDate(current.getDate() + 1);
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    data: allRows.slice(start, end),
    total: allRows.length
  };
};

export const generateCadastrosCount = (
  startDate: Date,
  endDate: Date,
  filteredOrgaos: string[]
): number => {
  const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const baseCadastrosPorDia = 15;
  const totalCadastros = Math.floor(baseCadastrosPorDia * daysDiff * (0.8 + Math.random() * 0.4));

  if (filteredOrgaos.length === 0) {
    return totalCadastros;
  }

  const percentagePorOrgao = filteredOrgaos.length / orgaos.length;
  return Math.floor(totalCadastros * percentagePorOrgao);
};

export const calculateKPIs = (
  timeSeriesData: TimeSeriesData[],
  previousPeriodData: TimeSeriesData[],
  startDate: Date,
  endDate: Date,
  filteredOrgaos: string[] = []
) => {
  const totalProducao = timeSeriesData.reduce((sum, d) => sum + d.producao, 0);
  const totalOperacoes = timeSeriesData.reduce((sum, d) => sum + d.operacoes, 0);
  const lastDay = timeSeriesData[timeSeriesData.length - 1] || { producao: 0, operacoes: 0 };

  const previousProducao = previousPeriodData.reduce((sum, d) => sum + d.producao, 0);
  const crescimento = totalProducao - previousProducao;
  const crescimentoPerc = previousProducao > 0 ? (crescimento / previousProducao) * 100 : 0;

  const qtdeCadastros = generateCadastrosCount(startDate, endDate, filteredOrgaos);

  return {
    producaoTotal: totalProducao,
    qtdeOperacoes: totalOperacoes,
    producaoDia: lastDay.producao,
    operacoesDia: lastDay.operacoes,
    ticketMedio: totalOperacoes > 0 ? totalProducao / totalOperacoes : 0,
    crescimentoVsPeriodo: crescimento,
    crescimentoPercentual: crescimentoPerc,
    qtdeCadastros
  };
};

export const generateInsights = (
  kpis: any,
  distributionOrgaos: DistributionData[],
  distributionProdutos: DistributionData[],
  distributionCanais: DistributionData[],
  timeSeriesData: TimeSeriesData[]
) => {
  const insights = [];

  if (distributionOrgaos.length > 0) {
    const topOrgao = distributionOrgaos[0];
    insights.push({
      type: 'info' as const,
      icon: 'building',
      text: `O maior convênio no período foi ${topOrgao.name} com ${formatCurrency(topOrgao.value)} (${topOrgao.percentage.toFixed(1)}% do total).`
    });
  }

  if (kpis.crescimentoPercentual > 0) {
    insights.push({
      type: 'success' as const,
      icon: 'trending-up',
      text: `Crescimento de ${kpis.crescimentoPercentual.toFixed(1)}% em relação ao período anterior (+${formatCurrency(kpis.crescimentoVsPeriodo)}).`
    });
  } else if (kpis.crescimentoPercentual < 0) {
    insights.push({
      type: 'warning' as const,
      icon: 'trending-down',
      text: `Queda de ${Math.abs(kpis.crescimentoPercentual).toFixed(1)}% em relação ao período anterior (${formatCurrency(kpis.crescimentoVsPeriodo)}).`
    });
  }

  if (distributionCanais.length > 0) {
    const topCanal = distributionCanais[0];
    insights.push({
      type: 'info' as const,
      icon: 'users',
      text: `O canal com maior participação é ${topCanal.name} (${topCanal.percentage.toFixed(1)}%).`
    });
  }

  if (timeSeriesData.length > 0) {
    const bestDay = [...timeSeriesData].sort((a, b) => b.producao - a.producao)[0];
    insights.push({
      type: 'success' as const,
      icon: 'star',
      text: `O melhor dia do período foi ${formatDate(bestDay.date)} com ${formatCurrency(bestDay.producao)}.`
    });
  }

  return insights;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
};
