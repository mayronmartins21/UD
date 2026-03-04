import React, { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { Processadora } from '../../types/processadoras';

interface ProcessadorasTableProps {
  processadoras: Processadora[];
  onVisualizarProcessadora: (processadora: Processadora) => void;
  onEditarProcessadora: (processadora: Processadora) => void;
}

type SortField = 'id' | 'cnpj' | 'razaoSocial' | 'status';
type SortDirection = 'asc' | 'desc';

export const ProcessadorasTable: React.FC<ProcessadorasTableProps> = ({
  processadoras,
  onVisualizarProcessadora,
  onEditarProcessadora
}) => {
  const [sortField, setSortField] = useState<SortField>('razaoSocial');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProcessadoras = [...processadoras].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortButton: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
    >
      <span>{label}</span>
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? 'text-blue-600' : 'text-gray-400'}`} />
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="id" label="ID" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="cnpj" label="CNPJ" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="razaoSocial" label="Razão Social" />
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                <SortButton field="status" label="Status" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProcessadoras.map((processadora) => (
              <tr
                key={processadora.id}
                onClick={() => onVisualizarProcessadora(processadora)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                  {processadora.id.substring(0, 8)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                  {processadora.cnpj}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{processadora.razaoSocial}</div>
                  {processadora.nomeFantasia && (
                    <div className="text-xs text-gray-500">{processadora.nomeFantasia}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      processadora.status === 'ativo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {processadora.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
