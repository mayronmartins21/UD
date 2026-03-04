import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Download, ArrowUpDown } from 'lucide-react';
import type { DetailRow } from '../../types/dashboard';

interface DetailTableProps {
  data: DetailRow[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSort?: (field: keyof DetailRow) => void;
  onExport?: () => void;
  loading?: boolean;
}

export const DetailTable: React.FC<DetailTableProps> = ({
  data,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onSort,
  onExport,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof DetailRow | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const handleSort = (field: keyof DetailRow) => {
    setSortField(field);
    if (onSort) {
      onSort(field);
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="h-4 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Detalhamento de Operações</h3>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={onExport}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                <button onClick={() => handleSort('data')} className="flex items-center gap-1 hover:text-blue-600">
                  Data
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                <button onClick={() => handleSort('produto')} className="flex items-center gap-1 hover:text-blue-600">
                  Produto
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                <button onClick={() => handleSort('orgao')} className="flex items-center gap-1 hover:text-blue-600">
                  Órgão/Convênio
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                <button onClick={() => handleSort('canal')} className="flex items-center gap-1 hover:text-blue-600">
                  Canal
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                <button onClick={() => handleSort('qtdeOperacoes')} className="flex items-center gap-1 hover:text-blue-600 ml-auto">
                  Qtde Ops
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                <button onClick={() => handleSort('producao')} className="flex items-center gap-1 hover:text-blue-600 ml-auto">
                  Produção
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                <button onClick={() => handleSort('ticketMedio')} className="flex items-center gap-1 hover:text-blue-600 ml-auto">
                  Ticket Médio
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="py-3 px-4 text-sm text-gray-900">{formatDate(row.data)}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{row.produto}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{row.orgao}</td>
                <td className="py-3 px-4 text-sm">
                  <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                    {row.canal}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right">{row.qtdeOperacoes}</td>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(row.producao)}</td>
                <td className="py-3 px-4 text-sm text-gray-600 text-right">{formatCurrency(row.ticketMedio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600">
          Mostrando {startIndex} a {endIndex} de {total} registros
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {[...Array(Math.min(5, totalPages))].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
