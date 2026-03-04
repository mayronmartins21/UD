import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import type { ConvenioCompleto, ContatoConvenio } from '../../../types/convenios';

interface ContatosTabProps {
  convenio: ConvenioCompleto;
  modoEdicao: boolean;
}

export const ContatosTab: React.FC<ContatosTabProps> = ({
  convenio,
  modoEdicao
}) => {
  const [showContatoModal, setShowContatoModal] = useState(false);

  const contatoPrincipal = convenio.contatos.find(c => c.tipo === 'principal');
  const contatosAdicionais = convenio.contatos.filter(c => c.tipo !== 'principal');

  const getTipoBadge = (tipo: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      principal: { color: 'bg-blue-100 text-blue-800', label: 'Principal' },
      financeiro: { color: 'bg-green-100 text-green-800', label: 'Financeiro' },
      juridico: { color: 'bg-purple-100 text-purple-800', label: 'Jurídico' },
      operacional: { color: 'bg-orange-100 text-orange-800', label: 'Operacional' },
      ti: { color: 'bg-gray-100 text-gray-800', label: 'TI' }
    };
    return badges[tipo] || badges.principal;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Responsável Principal
        </h3>

        {contatoPrincipal ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Responsável
              </label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={contatoPrincipal.nome}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-sm text-gray-900 py-2">{contatoPrincipal.nome}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email do Responsável
              </label>
              {modoEdicao ? (
                <input
                  type="email"
                  value={contatoPrincipal.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-sm text-gray-900 py-2">{contatoPrincipal.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Celular do Responsável
              </label>
              {modoEdicao ? (
                <input
                  type="tel"
                  value={contatoPrincipal.celular}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-sm text-gray-900 py-2">{contatoPrincipal.celular}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone do Responsável
              </label>
              {modoEdicao ? (
                <input
                  type="tel"
                  value={contatoPrincipal.telefone}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-sm text-gray-900 py-2">{contatoPrincipal.telefone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              {modoEdicao ? (
                <input
                  type="text"
                  value={contatoPrincipal.departamento}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-sm text-gray-900 py-2">{contatoPrincipal.departamento}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhum responsável principal cadastrado
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Contatos Adicionais
          </h3>
          {modoEdicao && (
            <button
              onClick={() => setShowContatoModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar Contato
            </button>
          )}
        </div>

        {contatosAdicionais.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhum contato adicional cadastrado
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Nome
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Celular
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Departamento
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                    Tipo
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  {modoEdicao && (
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                      Ações
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contatosAdicionais.map((contato) => {
                  const badge = getTipoBadge(contato.tipo);
                  return (
                    <tr key={contato.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                        {contato.nome}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {contato.email}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {contato.celular}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {contato.departamento}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            contato.ativo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {contato.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      {modoEdicao && (
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
