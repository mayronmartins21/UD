import React from 'react';
import { Search, Filter, Download, RotateCcw, AlertCircle } from 'lucide-react';
import type { FiltroGeral } from '../../types';

interface FilterPanelProps {
  filtros: FiltroGeral;
  onFiltroChange: (filtros: FiltroGeral) => void;
  showExport?: boolean;
  onExport?: () => void;
  onReset?: () => void;
  isUploadTab?: boolean;
  showInadimplenciaTotal?: boolean;
  onInadimplenciaTotal?: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filtros,
  onFiltroChange,
  showExport = false,
  onExport,
  onReset,
  isUploadTab = false,
  showInadimplenciaTotal = false,
  onInadimplenciaTotal
}) => {
  const currentYear = new Date().getFullYear();
  const anos = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  // Gerar competências no formato MM/AAAA para upload (apenas 2025) ou AAAAMM para outros
  const competencias = [];
  if (isUploadTab) {
    // Para upload: apenas 2025, ordem crescente (01/2025 até 12/2025)
    for (let mes = 1; mes <= 12; mes++) {
      competencias.push({
        value: `2025${mes.toString().padStart(2, '0')}`,
        label: `${mes.toString().padStart(2, '0')}/2025`
      });
    }
  } else {
    // Para outras abas: últimos 3 anos, ordem decrescente
    for (let ano = currentYear; ano >= currentYear - 2; ano--) {
      for (let mes = 12; mes >= 1; mes--) {
        competencias.push({
          value: `${ano}${mes.toString().padStart(2, '0')}`,
          label: `${mes.toString().padStart(2, '0')}/${ano}`
        });
      }
    }
  }

  const conveniosUpload = [
    { value: '1', label: 'Governo de Goiás' },
    { value: '2', label: 'Governo do Maranhão' },
    { value: '3', label: 'Governo do Paraná' },
    { value: '4', label: 'Prefeitura de Sorocaba' },
    { value: '5', label: 'Prefeitura de Hortolândia' },
    { value: '6', label: 'Prefeitura de Santo André' },
    { value: '7', label: 'Prefeitura do Rio de Janeiro' },
    { value: '8', label: 'Prefeitura de Guarulhos' }
  ];

  const averbadorasUpload = [
    'Neoconsig',
    'Zetra', 
    'SmartConsig',
    'Consigfácil',
    'Fasitec'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
          {isUploadTab || showExport ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Convênio</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filtros.convenio?.[0] || ''}
                  onChange={(e) => {
                    onFiltroChange({ ...filtros, convenio: e.target.value ? [e.target.value] : undefined });
                  }}
                >
                  <option value="">Selecione um convênio</option>
                  {conveniosUpload.map(convenio => (
                    <option key={convenio.value} value={convenio.value}>{convenio.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Averbadora</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filtros.averbadora || ''}
                  onChange={(e) => onFiltroChange({ ...filtros, averbadora: e.target.value || undefined })}
                >
                  <option value="">Todas</option>
                  {averbadorasUpload.map(averbadora => (
                    <option key={averbadora} value={averbadora}>{averbadora}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filtros.ano || ''}
                  onChange={(e) => onFiltroChange({ ...filtros, ano: e.target.value ? Number(e.target.value) : undefined })}
                >
                  <option value="">Todos</option>
                  {anos.map(ano => (
                    <option key={ano} value={ano}>{ano}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Competência</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filtros.competencia?.[0] || ''}
                  onChange={(e) => {
                    onFiltroChange({ ...filtros, competencia: e.target.value ? [e.target.value] : undefined });
                  }}
                >
                  <option value="">Selecione uma competência</option>
                  {(isUploadTab ? competencias.slice(0, 12) : competencias.slice(-12)).map(comp => (
                    <option key={comp.value} value={comp.value}>
                      {comp.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filtros.ano || ''}
                  onChange={(e) => onFiltroChange({ ...filtros, ano: e.target.value ? Number(e.target.value) : undefined })}
                >
                  <option value="">Todos</option>
                  {anos.map(ano => (
                    <option key={ano} value={ano}>{ano}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Competência</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  multiple
                  value={filtros.competencia || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    onFiltroChange({ ...filtros, competencia: values });
                  }}
                >
                  {competencias.slice(-12).map(comp => (
                    <option key={comp.value} value={comp.value}>
                      {comp.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filtros.produto || ''}
                  onChange={(e) => onFiltroChange({ ...filtros, produto: e.target.value as any || undefined })}
                >
                  <option value="">Todos</option>
                  <option value="Saque">Saque</option>
                  <option value="Compras">Compras</option>
                  <option value="Antecipacao">Antecipação</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Convênio</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  multiple
                  value={filtros.convenio || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value);
                    onFiltroChange({ ...filtros, convenio: values });
                  }}
                >
                  <option value="1">Governo de Goiás</option>
                  <option value="2">Governo do Maranhão</option>
                  <option value="3">Governo do Paraná</option>
                  <option value="4">Prefeitura de Sorocaba</option>
                  <option value="5">Prefeitura de Hortolândia</option>
                  <option value="6">Prefeitura de Santo André</option>
                  <option value="7">Prefeitura do Rio de Janeiro</option>
                  <option value="8">Prefeitura de Guarulhos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Averbadora</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filtros.averbadora || ''}
                  onChange={(e) => onFiltroChange({ ...filtros, averbadora: e.target.value || undefined })}
                >
                  <option value="">Todas</option>
                  <option value="Neoconsig">Neoconsig</option>
                  <option value="Zetra">Zetra</option>
                  <option value="SmartConsig">SmartConsig</option>
                  <option value="Consigfácil">Consigfácil</option>
                  <option value="Fasitec">Fasitec</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={filtros.produto || ''}
                  onChange={(e) => onFiltroChange({ ...filtros, produto: e.target.value as any || undefined })}
                >
                  <option value="">Todos</option>
                  <option value="Saque">Saque</option>
                  <option value="Compras">Compras</option>
                  <option value="Antecipacao">Antecipação</option>
                </select>
              </div>

            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isUploadTab || showExport ? (
            <button
              onClick={() => {
                // Aqui seria implementada a lógica de busca
                console.log('Executando busca com filtros:', filtros);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          ) : (
            onReset && (
              <button
                onClick={onReset}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Limpar
              </button>
            )
          )}
          
          {showExport && onExport && (
            <button
              onClick={onExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          )}

          {showInadimplenciaTotal && onInadimplenciaTotal && (
            <button
              onClick={onInadimplenciaTotal}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              Inadimplência Total
            </button>
          )}
        </div>
      </div>
    </div>
  );
};