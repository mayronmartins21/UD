import React from 'react';
import type { ServidorCompleto } from '../../types/servidores';

interface ServidoresTableProps {
  servidores: ServidorCompleto[];
  onVisualizarServidor: (servidor: ServidorCompleto) => void;
}

export const ServidoresTable: React.FC<ServidoresTableProps> = ({
  servidores,
  onVisualizarServidor
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Convênio
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Nome do Servidor
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                CPF
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Matrícula
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Cartão Compras
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Benefício Saque
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Plano
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {servidores.map((servidor) => (
              <tr
                key={servidor.id}
                onDoubleClick={() => onVisualizarServidor(servidor)}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 text-sm text-gray-900">
                  {servidor.convenio}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {servidor.nome}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {servidor.cpf}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {servidor.matricula}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      servidor.cartaoCompras === 'Ativo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {servidor.cartaoCompras}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      servidor.beneficioSaque === 'Ativo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {servidor.beneficioSaque}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      servidor.plano === 'Ativo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {servidor.plano}
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
