import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ConciliacaoStatus } from './ConciliacaoStatus';
import { ConciliacaoGrid } from './ConciliacaoGrid';
import type { FiltroGeral } from '../../types';

export const ConciliacaoTab: React.FC = () => {
  const [convenioSelecionado, setConvenioSelecionado] = useState('1');
  const [competenciaSelecionada, setCompetenciaSelecionada] = useState('202501');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conciliações</h2>
        <p className="text-gray-600">
          Processo mensal obrigatório de conciliação e fechamento de competência.
        </p>
      </div>

      {/* Seleção de Convênio e Competência */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-end gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Convênio
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={convenioSelecionado}
                onChange={(e) => setConvenioSelecionado(e.target.value)}
              >
                <option value="1">Governo de Goiás</option>
                <option value="7">Prefeitura do Rio de Janeiro</option>
                <option value="4">Prefeitura de Sorocaba</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Competência
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={competenciaSelecionada}
                onChange={(e) => setCompetenciaSelecionada(e.target.value)}
              >
                <option value="202501">01/2025</option>
                <option value="202502">02/2025</option>
                <option value="202503">03/2025</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={() => {
              console.log('Buscando conciliações:', { convenioSelecionado, competenciaSelecionada });
              // Aqui seria implementada a lógica de busca
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
        </div>
      </div>

      {/* Status da Competência */}
      <ConciliacaoStatus 
        convenioId={convenioSelecionado}
        competencia={competenciaSelecionada}
      />

      {/* Grade de Conciliação */}
      <ConciliacaoGrid 
        convenioId={convenioSelecionado}
        competencia={competenciaSelecionada}
      />
    </div>
  );
};