import React from 'react';
import { Info } from 'lucide-react';
import type { ConvenioCompleto } from '../../../types/convenios';

interface InformacoesConvenioTabProps {
  convenio: ConvenioCompleto;
  modoEdicao: boolean;
}

export const InformacoesConvenioTab: React.FC<InformacoesConvenioTabProps> = ({
  convenio,
  modoEdicao
}) => {
  return (
    <div className="space-y-6">

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Dados Principais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Processadora
            </label>
            {modoEdicao ? (
              <select
                value={convenio.processadora}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Digimais">Digimais</option>
                <option value="Consignet">Consignet</option>
                <option value="Facta">Facta</option>
                <option value="Zetrasoft">Zetrasoft</option>
              </select>
            ) : (
              <p className="text-sm text-gray-900 py-2">{convenio.processadora}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razão Social
            </label>
            {modoEdicao ? (
              <input
                type="text"
                value={convenio.razaoSocial}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">{convenio.razaoSocial}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Fantasia
            </label>
            {modoEdicao ? (
              <input
                type="text"
                value={convenio.nomeFantasia}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">{convenio.nomeFantasia}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ
            </label>
            {modoEdicao ? (
              <input
                type="text"
                value={convenio.cnpj}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                maxLength={18}
              />
            ) : (
              <p className="text-sm text-gray-900 py-2 font-mono">{convenio.cnpj}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              Tempo de Reserva de Margem
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                  em dias corridos
                </div>
              </div>
            </label>
            {modoEdicao ? (
              <input
                type="number"
                value={convenio.tempoMargem}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">{convenio.tempoMargem} dias</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
              Tempo de Proposta Válida
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                  tempo de proposta válida para assinatura
                </div>
              </div>
            </label>
            {modoEdicao ? (
              <input
                type="number"
                value={convenio.diasProposta}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">{convenio.diasProposta} dias</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              % do Recolhimento
            </label>
            {modoEdicao ? (
              <input
                type="number"
                value={convenio.percentualRecolhimento}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">{convenio.percentualRecolhimento}%</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dia de Repasse
            </label>
            {modoEdicao ? (
              <input
                type="number"
                value={convenio.diaRepasse}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="31"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">Dia {convenio.diaRepasse}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dia de Corte
            </label>
            {modoEdicao ? (
              <input
                type="number"
                value={convenio.diaCorte}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="31"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">Dia {convenio.diaCorte}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
