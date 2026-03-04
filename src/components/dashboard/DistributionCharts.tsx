import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, Building, Users } from 'lucide-react';
import type { DistributionData } from '../../types/dashboard';

interface DistributionChartsProps {
  produtoData: DistributionData[];
  orgaoData: DistributionData[];
  canalData: DistributionData[];
  loading?: boolean;
}

export const DistributionCharts: React.FC<DistributionChartsProps> = ({
  produtoData,
  orgaoData,
  canalData,
  loading
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-4 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
            <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  const renderDistributionCard = (
    title: string,
    icon: React.ReactNode,
    data: DistributionData[]
  ) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {item.name}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-[#1A73E8]"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 min-w-[100px] text-right">
                {formatCurrency(item.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {renderDistributionCard(
        'Produção por Produto',
        <Package className="w-5 h-5 text-[#1A73E8]" />,
        produtoData
      )}
      {renderDistributionCard(
        'Produção por Órgão',
        <Building className="w-5 h-5 text-[#1A73E8]" />,
        orgaoData
      )}
      {renderDistributionCard(
        'Produção por Canal',
        <Users className="w-5 h-5 text-[#1A73E8]" />,
        canalData
      )}
    </div>
  );
};
