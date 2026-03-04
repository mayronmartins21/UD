import React from 'react';
import { DollarSign, FileText, Calendar, BarChart3, Target, UserPlus } from 'lucide-react';
import type { KPIData } from '../../types/dashboard';

interface KPICardsProps {
  data: KPIData;
  loading?: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ data, loading }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const cards = [
    {
      title: 'Produção Total',
      value: formatCurrency(data.producaoTotal),
      icon: DollarSign,
      tooltip: 'Valor total de produção no período selecionado'
    },
    {
      title: 'Quantidade de Operações',
      value: formatNumber(data.qtdeOperacoes),
      icon: FileText,
      tooltip: 'Total de operações realizadas no período'
    },
    {
      title: 'Clientes',
      value: formatNumber(data.qtdeCadastros),
      icon: UserPlus,
      tooltip: 'Total de clientes cadastrados no período'
    },
    {
      title: 'Produção do Dia',
      value: formatCurrency(data.producaoDia),
      icon: Calendar,
      tooltip: 'Produção do último dia do período'
    },
    {
      title: 'Operações do Dia',
      value: formatNumber(data.operacoesDia),
      icon: BarChart3,
      tooltip: 'Operações realizadas no último dia do período'
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(data.ticketMedio),
      icon: Target,
      tooltip: 'Valor médio por operação'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all"
            title={card.tooltip}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#1A73E8]" />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">{card.title}</p>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
