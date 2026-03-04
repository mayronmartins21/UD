import React, { useState, useEffect } from 'react';
import { FilterBar } from './FilterBar';
import { KPICards } from './KPICards';
import { TrendCharts } from './TrendCharts';
import { DistributionCharts } from './DistributionCharts';
import { GoalsCard } from './GoalsCard';
import { Toast } from '../common/Toast';
import {
  generateTimeSeriesData,
  generateDistributionByProduct,
  generateDistributionByOrgao,
  generateDistributionByCanal,
  calculateKPIs
} from '../../data/dashboardMockData';
import type { DashboardFilters, KPIData, TimeSeriesData, DistributionData, GoalData } from '../../types/dashboard';

export const DashboardTab: React.FC = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: {
      start: firstDayOfMonth,
      end: today,
      preset: 'currentMonth'
    },
    produtos: [],
    orgaos: [],
    canais: []
  });

  const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>(filters);
  const [loading, setLoading] = useState(false);
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [previousTimeSeriesData, setPreviousTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [productData, setProductData] = useState<DistributionData[]>([]);
  const [orgaoData, setOrgaoData] = useState<DistributionData[]>([]);
  const [canalData, setCanalData] = useState<DistributionData[]>([]);
  const [goalData, setGoalData] = useState<GoalData | null>(null);
  const [monthlyGoals, setMonthlyGoals] = useState<Record<string, number>>({
    [`${today.getMonth()}-${today.getFullYear()}`]: 5000000
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const getGoalKey = (month: number, year: number) => `${month}-${year}`;

  const getGoalForPeriod = (month: number, year: number): number => {
    const key = getGoalKey(month, year);
    return monthlyGoals[key] || 5000000;
  };

  const loadData = async () => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const timeSeries = generateTimeSeriesData(appliedFilters.dateRange.start, appliedFilters.dateRange.end, granularity);

    const daysDiff = Math.floor((appliedFilters.dateRange.start.getTime() - appliedFilters.dateRange.end.getTime()) / (1000 * 60 * 60 * 24));
    const previousStart = new Date(appliedFilters.dateRange.start);
    previousStart.setDate(previousStart.getDate() + daysDiff);
    const previousEnd = new Date(appliedFilters.dateRange.start);
    previousEnd.setDate(previousEnd.getDate() - 1);
    const previousTimeSeries = generateTimeSeriesData(previousStart, previousEnd, granularity);

    const kpis = calculateKPIs(
      timeSeries,
      previousTimeSeries,
      appliedFilters.dateRange.start,
      appliedFilters.dateRange.end,
      appliedFilters.orgaos
    );

    const prodDist = generateDistributionByProduct(appliedFilters.dateRange.start, appliedFilters.dateRange.end, appliedFilters);
    const orgDist = generateDistributionByOrgao(appliedFilters.dateRange.start, appliedFilters.dateRange.end, appliedFilters);
    const canDist = generateDistributionByCanal(appliedFilters.dateRange.start, appliedFilters.dateRange.end, appliedFilters);

    const isCurrentMonth =
      appliedFilters.dateRange.start.getMonth() === today.getMonth() &&
      appliedFilters.dateRange.start.getFullYear() === today.getFullYear();

    let goals: GoalData | null = null;
    if (isCurrentMonth) {
      const filterMonth = appliedFilters.dateRange.start.getMonth();
      const filterYear = appliedFilters.dateRange.start.getFullYear();
      const metaMes = getGoalForPeriod(filterMonth, filterYear);
      const diasDecorridos = today.getDate();
      const diasNoMes = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const diasRestantes = diasNoMes - diasDecorridos;
      const producaoAtual = kpis.producaoTotal;
      const faltante = metaMes - producaoAtual;
      const mediaDiariaNecessaria = faltante / diasRestantes;
      const mediaDiariaAtual = producaoAtual / diasDecorridos;
      const progresso = (producaoAtual / metaMes) * 100;

      goals = {
        metaMes,
        producaoAtual,
        faltante,
        mediaDiariaNecessaria,
        mediaDiariaAtual,
        progresso,
        diasRestantes
      };
    }

    setKpiData(kpis);
    setTimeSeriesData(timeSeries);
    setPreviousTimeSeriesData(previousTimeSeries);
    setProductData(prodDist);
    setOrgaoData(orgDist);
    setCanalData(canDist);
    setGoalData(goals);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [appliedFilters, granularity, monthlyGoals]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
  };

  const handleClearFilters = () => {
    const defaultFilters: DashboardFilters = {
      dateRange: {
        start: firstDayOfMonth,
        end: today,
        preset: 'currentMonth'
      },
      produtos: [],
      orgaos: [],
      canais: []
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    alert(`Exportando dashboard em formato ${format.toUpperCase()}...`);
  };

  const handleSetGoal = async (newGoal: number, month: number, year: number) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const key = getGoalKey(month, year);
      setMonthlyGoals(prev => ({
        ...prev,
        [key]: newGoal
      }));

      setToastType('success');
      setToastMessage('Meta atualizada com sucesso');
      setToastVisible(true);

      setTimeout(() => {
        loadData();
      }, 100);
    } catch (error) {
      setToastType('error');
      setToastMessage('Não foi possível atualizar a meta');
      setToastVisible(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onExport={handleExport}
      />

      {kpiData && (
        <KPICards data={kpiData} loading={loading} />
      )}

      <TrendCharts
        data={timeSeriesData}
        previousData={previousTimeSeriesData}
        loading={loading}
        onGranularityChange={setGranularity}
      />

      <DistributionCharts
        produtoData={productData}
        orgaoData={orgaoData}
        canalData={canalData}
        loading={loading}
      />

      {goalData && (
        <GoalsCard
          data={goalData}
          onSetGoal={handleSetGoal}
          currentMonth={appliedFilters.dateRange.start.getMonth()}
          currentYear={appliedFilters.dateRange.start.getFullYear()}
        />
      )}

      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};
