import React, { useState } from 'react';
import { Target, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import type { GoalData } from '../../types/dashboard';
import { EditGoalModal } from './EditGoalModal';

interface GoalsCardProps {
  data: GoalData | null;
  onSetGoal?: (goal: number, month: number, year: number) => void;
  currentMonth?: number;
  currentYear?: number;
}

export const GoalsCard: React.FC<GoalsCardProps> = ({
  data,
  onSetGoal,
  currentMonth = new Date().getMonth(),
  currentYear = new Date().getFullYear()
}) => {
  const [showModal, setShowModal] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleSaveGoal = (value: number, month: number, year: number) => {
    if (onSetGoal) {
      onSetGoal(value, month, year);
    }
  };

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Configure a Meta do Mês</h3>
          <p className="text-sm text-gray-600 mb-4">
            Defina uma meta mensal para acompanhar o ritmo de produção.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-[#1A73E8] text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Definir Meta do Mês
          </button>
        </div>

        <EditGoalModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveGoal}
          currentMonth={currentMonth}
          currentYear={currentYear}
        />
      </div>
    );
  }

  const progressColor = data.progresso >= 100 ? 'bg-[#43A047]' : 'bg-[#FB8C00]';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#1A73E8]" />
          <h3 className="text-lg font-semibold text-gray-900">Ritmo do Mês</h3>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm text-[#1A73E8] hover:text-blue-700 font-medium"
        >
          Editar meta
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso da Meta</span>
          <span className="text-2xl font-bold text-gray-900">{data.progresso.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${Math.min(data.progresso, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-[#1A73E8]" />
            </div>
            <span className="text-xs font-medium text-gray-600 uppercase">Meta do Mês</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(data.metaMes || 0)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#43A047]" />
            </div>
            <span className="text-xs font-medium text-gray-600 uppercase">Produção Atual</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(data.producaoAtual)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <Target className="w-4 h-4 text-[#FB8C00]" />
            </div>
            <span className="text-xs font-medium text-gray-600 uppercase">Faltante</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(Math.max(data.faltante, 0))}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-gray-600" />
            </div>
            <span className="text-xs font-medium text-gray-600 uppercase">Dias Restantes</span>
          </div>
          <p className="text-lg font-bold text-gray-900">{data.diasRestantes}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Média diária necessária:</span>
            <p className="font-semibold text-gray-900">{formatCurrency(data.mediaDiariaNecessaria)}</p>
          </div>
          <div>
            <span className="text-gray-600">Média diária atual:</span>
            <p className={`font-semibold ${data.mediaDiariaAtual >= data.mediaDiariaNecessaria ? 'text-[#43A047]' : 'text-[#FB8C00]'}`}>
              {formatCurrency(data.mediaDiariaAtual)}
            </p>
          </div>
        </div>
      </div>

      <EditGoalModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveGoal}
        currentGoal={data.metaMes}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </div>
  );
};
