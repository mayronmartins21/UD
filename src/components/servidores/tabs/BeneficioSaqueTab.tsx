import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import type { ServidorCompleto, OperacaoBeneficioSaque } from '../../../types/servidores';
import { OperacaoDetalheView } from './OperacaoDetalheView';
import { LogsAlteracoesTabela } from '../../common/LogsAlteracoesTabela';
import { logsExemplo } from '../../../data/logsMockData';

interface BeneficioSaqueTabProps {
  servidor: ServidorCompleto;
}

export const BeneficioSaqueTab: React.FC<BeneficioSaqueTabProps> = ({ servidor }) => {
  const [operacaoSelecionada, setOperacaoSelecionada] = useState<OperacaoBeneficioSaque | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Quitado':
        return 'bg-blue-100 text-blue-800';
      case 'Quitado com Pendências':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDuploClique = (operacao: OperacaoBeneficioSaque) => {
    setOperacaoSelecionada(operacao);
  };

  if (operacaoSelecionada) {
    return (
      <OperacaoDetalheView
        servidor={servidor}
        operacao={operacaoSelecionada}
        onVoltar={() => setOperacaoSelecionada(null)}
      />
    );
  }

  if (servidor.beneficioSaqueDetalhes.operacoes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Sem operações ativas
          </h3>
          <p className="text-gray-600">
            Este servidor não possui operações de Benefício Saque.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Operações</h3>
          <p className="text-sm text-gray-600 mt-1">Dê um duplo clique na operação para visualizar detalhes completos</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nº da Proposta
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Valor da Parcela
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Prazo
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Valor Liberado
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status da Operação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {servidor.beneficioSaqueDetalhes.operacoes.map((operacao) => (
                <tr
                  key={operacao.id}
                  onDoubleClick={() => handleDuploClique(operacao)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  title="Duplo clique para visualizar detalhes"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {formatDate(operacao.data)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {operacao.numeroProposta}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(operacao.valorParcela)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {operacao.prazo}x
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                    {formatCurrency(operacao.valorLiberado)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(operacao.status)}`}
                    >
                      {operacao.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Para visualizar os detalhes completos de uma operação, incluindo todas as parcelas e opções de quitação,
          dê um <strong>duplo clique</strong> na linha da operação desejada.
        </p>
      </div>

      <LogsAlteracoesTabela logs={logsExemplo} />
    </div>
  );
};
