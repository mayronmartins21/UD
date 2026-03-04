import React, { useState } from 'react';
import { Calendar, Filter, X, Download, ChevronDown } from 'lucide-react';
import type { DashboardFilters } from '../../types/dashboard';

interface FilterBarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  onApply: () => void;
  onClear: () => void;
  onExport: (format: 'csv' | 'xlsx' | 'pdf') => void;
}

const datePresets = [
  { label: 'Hoje', value: 'today' },
  { label: 'Ontem', value: 'yesterday' },
  { label: 'Últimos 7 dias', value: 'last7days' },
  { label: 'Últimos 30 dias', value: 'last30days' },
  { label: 'Mês atual', value: 'currentMonth' },
  { label: 'Mês anterior', value: 'lastMonth' },
  { label: 'Ano atual', value: 'currentYear' },
  { label: 'Desde o início', value: 'allTime' }
];

const produtos = ['Saque Fácil', 'Cartão Compras', 'Plano Porto Seguro'];
const orgaos = [
  'Prefeitura de Guarulhos',
  'Prefeitura de Hortolândia',
  'Prefeitura de Santo André',
  'Prefeitura do Rio de Janeiro',
  'Governo de Goiás',
  'Prefeitura de Sorocaba',
  'Prefeitura de São Gonçalo'
];
const canais = ['UD', 'Soft', 'Prisma'];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onClear,
  onExport
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handlePresetChange = (preset: string) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (preset) {
      case 'today':
        start = today;
        break;
      case 'yesterday':
        start.setDate(today.getDate() - 1);
        end.setDate(today.getDate() - 1);
        break;
      case 'last7days':
        start.setDate(today.getDate() - 7);
        break;
      case 'last30days':
        start.setDate(today.getDate() - 30);
        break;
      case 'currentMonth':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'currentYear':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      case 'allTime':
        start = new Date(2023, 9, 1);
        break;
    }

    onFiltersChange({
      ...filters,
      dateRange: { start, end, preset }
    });
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const date = new Date(value);
    const newDateRange = {
      ...filters.dateRange,
      [field]: date,
      preset: undefined
    };

    onFiltersChange({
      ...filters,
      dateRange: newDateRange
    });
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleMultiSelect = (field: 'produtos' | 'orgaos' | 'canais', value: string) => {
    const current = filters[field];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    onFiltersChange({
      ...filters,
      [field]: updated
    });
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getFilterSummary = () => {
    const parts = [];

    const periodLabel = filters.dateRange.preset
      ? datePresets.find(p => p.value === filters.dateRange.preset)?.label
      : `${formatDateForDisplay(filters.dateRange.start)} até ${formatDateForDisplay(filters.dateRange.end)}`;

    parts.push(`Período: ${periodLabel}`);
    parts.push(`Produtos: ${filters.produtos.length === 0 ? 'Todos' : filters.produtos.length}`);
    parts.push(`Órgãos: ${filters.orgaos.length === 0 ? 'Todos' : filters.orgaos.length + ' selecionados'}`);
    parts.push(`Canais: ${filters.canais.length === 0 ? 'Todos' : filters.canais.length}`);

    return parts.join(' | ');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-0 z-10">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Data Inicial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={formatDateForInput(filters.dateRange.start)}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Data Final */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={formatDateForInput(filters.dateRange.end)}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Atalhos de Período */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 inline mr-1" />
            Atalhos rápidos
          </label>
          <div className="flex flex-wrap gap-2">
            {datePresets.map(preset => (
              <button
                key={preset.value}
                onClick={() => handlePresetChange(preset.value)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filters.dateRange.preset === preset.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Produtos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Produto
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                onChange={(e) => handleMultiSelect('produtos', e.target.value)}
                value=""
              >
                <option value="">Selecionar produto...</option>
                {produtos.map(produto => (
                  <option key={produto} value={produto}>
                    {produto}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
            {filters.produtos.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {filters.produtos.map(p => (
                  <span key={p} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                    {p}
                    <button onClick={() => handleMultiSelect('produtos', p)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Órgãos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Órgão / Convênio
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                onChange={(e) => handleMultiSelect('orgaos', e.target.value)}
                value=""
              >
                <option value="">Selecionar órgão...</option>
                {orgaos.map(orgao => (
                  <option key={orgao} value={orgao}>
                    {orgao}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
            {filters.orgaos.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {filters.orgaos.map(o => (
                  <span key={o} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                    {o.replace('Prefeitura de ', 'Pref. ')}
                    <button onClick={() => handleMultiSelect('orgaos', o)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Canais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Canal / Parceiro
            </label>
            <div className="relative">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                onChange={(e) => handleMultiSelect('canais', e.target.value)}
                value=""
              >
                <option value="">Selecionar canal...</option>
                {canais.map(canal => (
                  <option key={canal} value={canal}>
                    {canal}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
            {filters.canais.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {filters.canais.map(c => (
                  <span key={c} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
                    {c}
                    <button onClick={() => handleMultiSelect('canais', c)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onApply}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Aplicar filtros
          </button>
          <button
            onClick={onClear}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Limpar
          </button>
          <div className="relative ml-auto">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={() => { onExport('csv'); setShowExportMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  Exportar CSV
                </button>
                <button
                  onClick={() => { onExport('xlsx'); setShowExportMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  Exportar XLSX
                </button>
                <button
                  onClick={() => { onExport('pdf'); setShowExportMenu(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  Exportar PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Resumo dos filtros */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">{getFilterSummary()}</p>
        </div>
      </div>
    </div>
  );
};
