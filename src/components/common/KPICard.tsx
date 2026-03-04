import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
}

const colorConfig = {
  blue: 'border-blue-200 bg-blue-50',
  green: 'border-green-200 bg-green-50',
  red: 'border-red-200 bg-red-50',
  yellow: 'border-yellow-200 bg-yellow-50',
  purple: 'border-purple-200 bg-purple-50',
  gray: 'border-gray-200 bg-gray-50'
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'blue'
}) => {
  return (
    <div className={`p-6 rounded-lg border-2 relative ${colorConfig[color]}`}>
      {icon && (
        <div className="absolute top-3 right-3">
          <div className={`p-2 rounded-lg ${color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'red' ? 'bg-red-100' : color === 'yellow' ? 'bg-yellow-100' : color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'}`}>
            {icon}
          </div>
        </div>
      )}
      <div className="pr-16">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center">
          <span className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? '↗' : '↘'} {Math.abs(trend.value)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
        </div>
      )}
    </div>
  );
};