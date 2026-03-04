import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, BarChart3 } from 'lucide-react';
import type { TimeSeriesData } from '../../types/dashboard';

interface TrendChartsProps {
  data: TimeSeriesData[];
  previousData?: TimeSeriesData[];
  loading?: boolean;
  onGranularityChange?: (granularity: 'daily' | 'weekly' | 'monthly') => void;
}

export const TrendCharts: React.FC<TrendChartsProps> = ({
  data,
  previousData,
  loading,
  onGranularityChange
}) => {
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showComparison, setShowComparison] = useState(false);

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
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const handleGranularityChange = (newGranularity: 'daily' | 'weekly' | 'monthly') => {
    setGranularity(newGranularity);
    if (onGranularityChange) {
      onGranularityChange(newGranularity);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-4 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
            <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  const chartData = showComparison && previousData
    ? data.map((d, i) => ({
        ...d,
        producaoPrevious: previousData[i]?.producao || 0,
        operacoesPrevious: previousData[i]?.operacoes || 0
      }))
    : data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Produção ao longo do tempo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1A73E8]" />
            <h3 className="text-lg font-semibold text-gray-900">Produção ao Longo do Tempo</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleGranularityChange('daily')}
              className={`px-3 py-1 text-sm rounded-md ${granularity === 'daily' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Diário
            </button>
            <button
              onClick={() => handleGranularityChange('weekly')}
              className={`px-3 py-1 text-sm rounded-md ${granularity === 'weekly' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Semanal
            </button>
            <button
              onClick={() => handleGranularityChange('monthly')}
              className={`px-3 py-1 text-sm rounded-md ${granularity === 'monthly' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Mensal
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorProducao" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#1A73E8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => formatDate(label)}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="producao"
              stroke="#1A73E8"
              strokeWidth={2}
              fill="url(#colorProducao)"
              name="Produção"
            />
            {showComparison && (
              <Area
                type="monotone"
                dataKey="producaoPrevious"
                stroke="#9CA3AF"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="none"
                name="Período Anterior"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showComparison ? 'Ocultar' : 'Comparar com período anterior'}
          </button>
        </div>
      </div>

      {/* Quantidade de Operações */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#43A047]" />
            <h3 className="text-lg font-semibold text-gray-900">Quantidade de Operações</h3>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              labelFormatter={(label) => formatDate(label)}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            />
            <Legend />
            <Bar
              dataKey="operacoes"
              fill="#43A047"
              radius={[4, 4, 0, 0]}
              name="Operações"
            />
            {showComparison && (
              <Bar
                dataKey="operacoesPrevious"
                fill="#D1D5DB"
                radius={[4, 4, 0, 0]}
                name="Período Anterior"
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
