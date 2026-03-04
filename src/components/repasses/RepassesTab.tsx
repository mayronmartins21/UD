import React, { useState } from 'react';
import { FilterPanel } from '../common/FilterPanel';
import { KPICard } from '../common/KPICard';
import { RepassesCharts } from './RepassesCharts';
import { RepassesTable } from './RepassesTable';
import { ServidoresPendentes } from './ServidoresPendentes';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Percent
} from 'lucide-react';
import { mockKPIData, mockChartData } from '../../data/mockData';
import type { FiltroGeral } from '../../types';

export const RepassesTab: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltroGeral>({});

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const handleExport = () => {
    // Simular exportação
    const exportData = {
      filtros,
      data: new Date().toISOString(),
      tipo: 'dashboard_repasses'
    };

    alert(`Exportação iniciada:\n${JSON.stringify(exportData, null, 2)}`);
  };

  const handleInadimplenciaTotal = () => {
    alert('Gerando relatório de Inadimplência Total...\n\nEste relatório incluirá todos os registros não descontados e parcialmente descontados com suas respectivas análises de risco.');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard de Repasses</h2>
        <p className="text-gray-600">
          Visão executiva dos repasses por competência com KPIs e análise de efetivação.
        </p>
      </div>

      <FilterPanel
        filtros={filtros}
        onFiltroChange={setFiltros}
        showExport
        onExport={handleExport}
        onReset={() => setFiltros({})}
        showInadimplenciaTotal
        onInadimplenciaTotal={handleInadimplenciaTotal}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <KPICard
          title="Enviado"
          value={formatCurrency(mockKPIData.enviado_valor)}
          subtitle={`${formatNumber(mockKPIData.enviado_qtd)} parcelas`}
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        
        <KPICard
          title="Descontado"
          value={formatCurrency(mockKPIData.descontado_valor)}
          subtitle={`${formatNumber(mockKPIData.descontado_qtd)} parcelas`}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          color="green"
          trend={{ value: mockKPIData.descontado_variacao, positive: true }}
        />
        
        <KPICard
          title="Não Descontado"
          value={formatCurrency(mockKPIData.nao_descontado_valor)}
          subtitle={`${formatNumber(mockKPIData.nao_descontado_qtd)} parcelas`}
          icon={<TrendingDown className="w-6 h-6 text-red-600" />}
          color="red"
          trend={{ value: mockKPIData.nao_descontado_variacao, positive: false }}
        />
        
        <KPICard
          title="Descontado Parcial"
          value={formatCurrency(mockKPIData.descontado_parcial_valor)}
          subtitle={`Divergência: ${formatCurrency(mockKPIData.descontado_parcial_divergencia)} • ${formatNumber(mockKPIData.descontado_parcial_qtd)} casos`}
          icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
          color="yellow"
        />
        
        <KPICard
          title="% Inadimplente"
          value={`${mockKPIData.inadimplente_pct.toFixed(1)}%`}
          subtitle="Taxa de inadimplência"
          icon={<Percent className="w-6 h-6 text-purple-600" />}
          color="purple"
        />
      </div>

      {/* Gráficos */}
      <RepassesCharts data={mockChartData} />

      {/* Tabela Resumo */}
      <RepassesTable filtros={filtros} />

      {/* Servidores Pendentes */}
      <div className="mt-8">
        <ServidoresPendentes filtros={filtros} />
      </div>
    </div>
  );
};