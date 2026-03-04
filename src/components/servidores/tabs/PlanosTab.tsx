import React from 'react';
import { Package, Calendar, DollarSign, CheckCircle } from 'lucide-react';
import type { ServidorCompleto } from '../../../types/servidores';
import { LogsAlteracoesTabela } from '../../common/LogsAlteracoesTabela';
import { logsExemplo } from '../../../data/logsMockData';

interface PlanosTabProps {
  servidor: ServidorCompleto;
}

export const PlanosTab: React.FC<PlanosTabProps> = ({ servidor }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Inativo':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Planos</p>
              <p className="text-2xl font-bold text-gray-900">
                {servidor.planos.quantidadePlanos}
              </p>
            </div>
          </div>
        </div>
      </div>

      {servidor.planos.planos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhum plano encontrado</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {servidor.planos.planos.map((plano) => (
            <div
              key={plano.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {plano.nome}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSituacaoColor(
                        plano.situacao
                      )}`}
                    >
                      {plano.situacao}
                    </span>
                  </div>
                  <Package className="w-6 h-6 text-white opacity-80" />
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <p className="text-xs font-medium">Data de Adesão</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(plano.dataAdesao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <p className="text-xs font-medium">Valor Mensal</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(plano.valorMensal)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-3">Benefícios inclusos:</p>
                  <div className="space-y-2">
                    {plano.beneficios.map((beneficio, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-gray-700">{beneficio}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <LogsAlteracoesTabela logs={logsExemplo} />
    </div>
  );
};
