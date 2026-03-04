import React from 'react';
import { CheckCircle, AlertCircle, Clock, Lock } from 'lucide-react';
import { StatusChip } from '../common/StatusChip';
import { fechamentos } from '../../data/mockData';

interface ConciliacaoStatusProps {
  convenioId: string;
  competencia: string;
}

export const ConciliacaoStatus: React.FC<ConciliacaoStatusProps> = ({ 
  convenioId, 
  competencia 
}) => {
  const fechamento = fechamentos.find(f => 
    f.convenio_id === convenioId && f.competencia_ref === competencia
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusInfo = () => {
    if (!fechamento) {
      return {
        status: 'Aberta',
        icon: <Clock className="w-5 h-5 text-yellow-600" />,
        color: 'bg-yellow-50 border-yellow-200',
        description: 'Competência está aberta para recebimento de arquivos e conciliação.'
      };
    }

    switch (fechamento.status) {
      case 'EmConciliacao':
        return {
          status: fechamento.status,
          icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
          color: 'bg-yellow-50 border-yellow-200',
          description: 'Conciliação em andamento. Aguardando finalização dos processos.'
        };
      case 'Conciliada':
        return {
          status: fechamento.status,
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          color: 'bg-green-50 border-green-200',
          description: 'Conciliação finalizada. Pronta para fechamento ou exportações.'
        };
      case 'Fechada':
        return {
          status: fechamento.status,
          icon: <Lock className="w-5 h-5 text-gray-600" />,
          color: 'bg-gray-50 border-gray-200',
          description: 'Competência fechada. Dados consolidados e bloqueados para alterações.'
        };
      default:
        return {
          status: 'Aberta',
          icon: <Clock className="w-5 h-5 text-blue-600" />,
          color: 'bg-blue-50 border-blue-200',
          description: 'Status não identificado.'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-6">
      {/* Card de Status */}
      <div className={`p-6 rounded-lg border-2 ${statusInfo.color} mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {statusInfo.icon}
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Status da Competência
              </h3>
              <p className="text-gray-600">{statusInfo.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <StatusChip status={statusInfo.status as any} size="md" />
          </div>
        </div>

      </div>

      {/* Resumo Financeiro */}
      {fechamento && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Total Enviado</div>
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(fechamento.tot_enviado)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Descontado</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(fechamento.tot_descontado)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Não Descontado</div>
            <div className="text-xl font-bold text-red-600">
              {formatCurrency(fechamento.tot_nao_descontado)}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Efetivação</div>
            <div className={`text-xl font-bold ${
              fechamento.efetivacao_pct >= 95 ? 'text-green-600' :
              fechamento.efetivacao_pct >= 90 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {fechamento.efetivacao_pct.toFixed(2)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
};