import React, { useState } from 'react';
import { Eye, Download, ArrowRight } from 'lucide-react';
import type { FiltroGeral } from '../../types';

interface RepassesTableProps {
  filtros: FiltroGeral;
}

interface ResumoItem {
  id: string;
  convenio: string;
  produto: string;
  competencia: string;
  enviado_valor: number;
  descontado_valor: number;
  nao_descontado_valor: number;
  efetivacao_pct: number;
  retroativo_valor: number;
  ultimo_retorno: string;
}

const mockResumoData: ResumoItem[] = [
  {
    id: '1',
    convenio: 'Prefeitura do Rio de Janeiro',
    produto: 'Compras',
    competencia: '202501',
    enviado_valor: 1250000.00,
    descontado_valor: 1187500.00,
    nao_descontado_valor: 62500.00,
    efetivacao_pct: 95.0,
    retroativo_valor: 12500.00,
    ultimo_retorno: '2024-02-10'
  },
  {
    id: '2',
    convenio: 'Prefeitura do Rio de Janeiro',
    produto: 'Saque',
    competencia: '202501',
    enviado_valor: 850000.00,
    descontado_valor: 799750.00,
    nao_descontado_valor: 50250.00,
    efetivacao_pct: 94.1,
    retroativo_valor: 8500.00,
    ultimo_retorno: '2024-02-10'
  },
  {
    id: '3',
    convenio: 'Governo de Goiás',
    produto: 'Antecipação',
    competencia: '202501',
    enviado_valor: 950000.00,
    descontado_valor: 912250.00,
    nao_descontado_valor: 37750.00,
    efetivacao_pct: 96.0,
    retroativo_valor: 19000.00,
    ultimo_retorno: '2024-02-08'
  },
  {
    id: '4',
    convenio: 'Governo do Maranhão',
    produto: 'Compras',
    competencia: '202501',
    enviado_valor: 650000.00,
    descontado_valor: 624000.00,
    nao_descontado_valor: 26000.00,
    efetivacao_pct: 96.0,
    retroativo_valor: 6500.00,
    ultimo_retorno: '2024-02-08'
  },
  {
    id: '5',
    convenio: 'Prefeitura de Sorocaba',
    produto: 'Saque',
    competencia: '202501',
    enviado_valor: 1300000.00,
    descontado_valor: 1235000.00,
    nao_descontado_valor: 65000.00,
    efetivacao_pct: 95.0,
    retroativo_valor: 26000.00,
    ultimo_retorno: '2024-02-12'
  }
];

export const RepassesTable: React.FC<RepassesTableProps> = ({ filtros }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCompetencia = (comp: string) => {
    return `${comp.substring(4, 6)}/${comp.substring(0, 4)}`;
  };

  const calcularInadimplencia = (naoDescontado: number, enviado: number) => {
    if (enviado === 0) return 0;
    return (naoDescontado / enviado) * 100;
  };

  const getInadimplenciaColor = (percentual: number) => {
    if (percentual <= 5) return 'text-green-600';
    if (percentual <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDataUpload = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const handleVerConciliacao = (item: ResumoItem) => {
    alert(`Navegando para Conciliação com filtros:\nConvênio: ${item.convenio}\nProduto: ${item.produto}\nCompetência: ${item.competencia}`);
  };

  const totalPages = Math.ceil(mockResumoData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = mockResumoData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Resumo por Convênio/Produto */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Resumo por Convênio/Produto/Competência</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Convênio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Competência
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enviado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descontado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Não Descontado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efetivação %
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Inadimplente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Upload
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.convenio}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {item.produto}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCompetencia(item.competencia)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(item.enviado_valor)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(item.descontado_valor)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-red-600">
                      {formatCurrency(item.nao_descontado_valor)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${
                      item.efetivacao_pct >= 95 ? 'text-green-600' :
                      item.efetivacao_pct >= 90 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.efetivacao_pct.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${
                      getInadimplenciaColor(calcularInadimplencia(item.nao_descontado_valor, item.enviado_valor))
                    }`}>
                      {calcularInadimplencia(item.nao_descontado_valor, item.enviado_valor).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDataUpload(item.ultimo_retorno)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleVerConciliacao(item)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100"
                    >
                      <ArrowRight className="w-3 h-3 mr-1" />
                      Ver Conciliação
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, mockResumoData.length)} de {mockResumoData.length} resultados
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded-md ${
                  page === currentPage 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};