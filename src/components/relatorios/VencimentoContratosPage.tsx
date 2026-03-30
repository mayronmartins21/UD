import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download, ChevronDown, X, Search, FileText, DollarSign, CreditCard, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import type { VencimentoContrato, VencimentoFilters, VencimentoKPIData, VencimentoResumo } from '../../types/vencimentoContratos';
import { gerarContratosVencimento, calcularKPIs, gerarResumoGrupos } from '../../data/vencimentoContratosMockData';

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

const convenios = [
  'Prefeitura de Guarulhos',
  'Prefeitura de Hortolândia',
  'Prefeitura de Santo André',
  'Prefeitura do Rio de Janeiro',
  'Governo de Goiás',
  'Prefeitura de Sorocaba',
  'Prefeitura de São Gonçalo'
];

const canais = ['UD', 'Soft', 'Prisma'];

const faixasVencimento = [
  { label: 'Vence em 30 dias', value: 'ate30' },
  { label: 'Vence em 60 dias', value: 'ate60' },
  { label: 'Vence em 90 dias', value: 'ate90' },
  { label: 'Acima de 90 dias', value: 'acima90' },
  { label: 'Todos', value: 'todos' }
];

export const VencimentoContratosPage: React.FC = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [filters, setFilters] = useState<VencimentoFilters>({
    dateRange: {
      start: firstDayOfMonth,
      end: today,
      preset: 'currentMonth'
    },
    convenios: [],
    canais: [],
    faixaVencimento: 'todos'
  });

  const [appliedFilters, setAppliedFilters] = useState<VencimentoFilters>(filters);
  const [contratos, setContratos] = useState<VencimentoContrato[]>([]);
  const [contratosFiltrados, setContratosFiltrados] = useState<VencimentoContrato[]>([]);
  const [kpiData, setKpiData] = useState<VencimentoKPIData | null>(null);
  const [resumoGrupos, setResumoGrupos] = useState<VencimentoResumo[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const contratosGerados = gerarContratosVencimento();
    setContratos(contratosGerados);
    setContratosFiltrados(contratosGerados);
    setKpiData(calcularKPIs(contratosGerados));
    setResumoGrupos(gerarResumoGrupos(contratosGerados));
  }, []);

  const handleApplyFilters = () => {
    setLoading(true);
    setAppliedFilters({ ...filters });

    setTimeout(() => {
      let filtered = [...contratos];

      if (filters.convenios.length > 0) {
        filtered = filtered.filter(c => filters.convenios.includes(c.convenio));
      }

      if (filters.canais.length > 0) {
        filtered = filtered.filter(c => filters.canais.includes(c.canal));
      }

      if (filters.faixaVencimento !== 'todos') {
        filtered = filtered.filter(c => c.faixaVencimento === filters.faixaVencimento);
      }

      setContratosFiltrados(filtered);
      setKpiData(calcularKPIs(filtered));
      setResumoGrupos(gerarResumoGrupos(filtered));
      setCurrentPage(1);
      setLoading(false);
    }, 500);
  };

  const handleClearFilters = () => {
    const defaultFilters: VencimentoFilters = {
      dateRange: {
        start: firstDayOfMonth,
        end: today,
        preset: 'currentMonth'
      },
      convenios: [],
      canais: [],
      faixaVencimento: 'todos'
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setContratosFiltrados(contratos);
    setKpiData(calcularKPIs(contratos));
    setResumoGrupos(gerarResumoGrupos(contratos));
  };

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

    setFilters({
      ...filters,
      dateRange: { start, end, preset }
    });
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    const date = new Date(value);
    setFilters({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: date,
        preset: undefined
      }
    });
  };

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleMultiSelect = (field: 'convenios' | 'canais', value: string) => {
    const current = filters[field];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    setFilters({
      ...filters,
      [field]: updated
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR');
  };

  const getFilterSummary = () => {
    const parts = [];
    const periodLabel = filters.dateRange.preset
      ? datePresets.find(p => p.value === filters.dateRange.preset)?.label
      : `${formatDate(filters.dateRange.start)} até ${formatDate(filters.dateRange.end)}`;

    parts.push(`Período: ${periodLabel}`);
    parts.push(`Órgãos: ${filters.convenios.length === 0 ? 'Todos' : filters.convenios.length + ' selecionados'}`);
    parts.push(`Canais: ${filters.canais.length === 0 ? 'Todos' : filters.canais.join(', ')}`);

    const faixaLabel = faixasVencimento.find(f => f.value === filters.faixaVencimento)?.label || 'Todos';
    parts.push(`Faixa: ${faixaLabel}`);

    return parts.join(' | ');
  };

  const contratosPesquisados = contratosFiltrados.filter(c =>
    c.nomeServidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cpf.includes(searchTerm) ||
    c.numeroProposta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contratosAte30 = contratosPesquisados.filter(c => c.faixaVencimento === 'ate30');
  const contratosAte60 = contratosPesquisados.filter(c => c.faixaVencimento === 'ate60');
  const contratosAte90 = contratosPesquisados.filter(c => c.faixaVencimento === 'ate90');
  const contratosAcima90 = contratosPesquisados.filter(c => c.faixaVencimento === 'acima90');

  const getStatusBadge = (status: 'alta' | 'media' | 'baixa') => {
    const configs = {
      alta: 'bg-green-100 text-green-700',
      media: 'bg-yellow-100 text-yellow-700',
      baixa: 'bg-gray-100 text-gray-700'
    };

    const labels = {
      alta: 'Alta Oportunidade',
      media: 'Média Oportunidade',
      baixa: 'Baixa Oportunidade'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${configs[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const ContratosTable: React.FC<{ contratos: VencimentoContrato[]; titulo: string }> = ({ contratos, titulo }) => {
    if (contratos.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 bg-gray-50 px-4 py-3 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700">{titulo}</h3>
          <span className="text-xs text-gray-600">{contratos.length} contratos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Convênio</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Proposta</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contrato</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CPF</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Matrícula</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Celular</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Valor Contrato</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Valor Parcela</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Parcelas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Liquidadas</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vencimento</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dias</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Canal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contratos.map((contrato) => (
                <tr key={contrato.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{contrato.convenio.replace('Prefeitura de ', 'Pref. ')}</td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium">{contrato.numeroProposta}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contrato.contratoExterno}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contrato.cpf}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contrato.matricula}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{contrato.nomeServidor}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contrato.categoria}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contrato.celular}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{formatCurrency(contrato.valorContrato)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(contrato.valorParcela)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contrato.qtdeTotalParcelas}x</td>
                  <td className="px-4 py-3 text-sm text-green-600 font-medium">{contrato.qtdeParcelasLiquidadas}x</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(contrato.vencimentoUltimaParcela)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{contrato.diasParaVencimento} dias</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{contrato.canal}</td>
                  <td className="px-4 py-3 text-sm">{getStatusBadge(contrato.statusOportunidade)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vencimento de Contratos</h1>
        <p className="text-sm text-gray-600">
          Visualize os contratos de Saque Fácil que estão próximos da quitação integral, permitindo identificar liberações de margem e oportunidades de nova oferta.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
              <input
                type="date"
                value={formatDateForInput(filters.dateRange.start)}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
              <input
                type="date"
                value={formatDateForInput(filters.dateRange.end)}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Órgão / Convênio</label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  onChange={(e) => handleMultiSelect('convenios', e.target.value)}
                  value=""
                >
                  <option value="">Selecionar órgão...</option>
                  {convenios.map(convenio => (
                    <option key={convenio} value={convenio}>{convenio}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
              {filters.convenios.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.convenios.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
                      {c.replace('Prefeitura de ', 'Pref. ')}
                      <button onClick={() => handleMultiSelect('convenios', c)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Canal / Parceiro</label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  onChange={(e) => handleMultiSelect('canais', e.target.value)}
                  value=""
                >
                  <option value="">Selecionar canal...</option>
                  {canais.map(canal => (
                    <option key={canal} value={canal}>{canal}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
              {filters.canais.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters.canais.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                      {c}
                      <button onClick={() => handleMultiSelect('canais', c)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Faixa de Vencimento</label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  value={filters.faixaVencimento}
                  onChange={(e) => setFilters({ ...filters, faixaVencimento: e.target.value })}
                >
                  {faixasVencimento.map(faixa => (
                    <option key={faixa.value} value={faixa.value}>{faixa.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleApplyFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Aplicar filtros
            </button>
            <button
              onClick={handleClearFilters}
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
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Exportar CSV</button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Exportar XLSX</button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm">Exportar PDF</button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">{getFilterSummary()}</p>
          </div>
        </div>
      </div>

      {kpiData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Total de Contratos</p>
            <p className="text-xl font-bold text-gray-900">{kpiData.totalContratos}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Valor Total Contratos</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(kpiData.valorTotalContratos)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Soma das Parcelas</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(kpiData.somaParcelas)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Vence em 30 Dias</p>
            <p className="text-xl font-bold text-gray-900">{kpiData.contratosAte30Dias}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Vence em 60 Dias</p>
            <p className="text-xl font-bold text-gray-900">{kpiData.contratosAte60Dias}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Vence em 90 Dias</p>
            <p className="text-xl font-bold text-gray-900">{kpiData.contratosAte90Dias}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Grupo</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Grupo</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Qtde Contratos</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Soma Valor Contratos</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Soma Valor Parcelas</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resumoGrupos.map((resumo, index) => (
                <tr
                  key={index}
                  className={resumo.grupo === 'Total geral' ? 'bg-gray-50 font-semibold' : 'hover:bg-gray-50'}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{resumo.grupo}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{resumo.qtdeContratos}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(resumo.somaValorContratos)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(resumo.somaValorParcelas)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Contratos Detalhados</h3>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou proposta"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando contratos...</p>
          </div>
        ) : (
          <>
            <ContratosTable contratos={contratosAte30} titulo="Vencimento em: 30 dias" />
            <ContratosTable contratos={contratosAte60} titulo="Vencimento em: 60 dias" />
            <ContratosTable contratos={contratosAte90} titulo="Vencimento em: 90 dias" />
            <ContratosTable contratos={contratosAcima90} titulo="Vencimento em: Acima de 90 dias" />
          </>
        )}
      </div>
    </div>
  );
};
