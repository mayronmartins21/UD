import React, { useState, useEffect } from 'react';
import { Filter, Download, ChevronDown, ChevronRight, X } from 'lucide-react';
import type { VencimentoContrato, VencimentoResumo } from '../../types/vencimentoContratos';
import { gerarContratosVencimento, gerarResumoGrupos } from '../../data/vencimentoContratosMockData';

const convenios = [
  'Prefeitura de Guarulhos',
  'Prefeitura de Hortolândia',
  'Prefeitura de Santo André',
  'Prefeitura do Rio de Janeiro',
  'Governo de Goiás',
  'Prefeitura de Sorocaba',
  'Prefeitura de São Gonçalo'
];

export const VencimentoContratosPage: React.FC = () => {
  const [selectedConvenios, setSelectedConvenios] = useState<string[]>([]);
  const [contratos, setContratos] = useState<VencimentoContrato[]>([]);
  const [contratosFiltrados, setContratosFiltrados] = useState<VencimentoContrato[]>([]);
  const [resumoGrupos, setResumoGrupos] = useState<VencimentoResumo[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    const contratosGerados = gerarContratosVencimento();
    setContratos(contratosGerados);
    setContratosFiltrados(contratosGerados);
    setResumoGrupos(gerarResumoGrupos(contratosGerados));
  }, []);

  const handleApplyFilters = () => {
    setLoading(true);

    setTimeout(() => {
      let filtered = [...contratos];

      if (selectedConvenios.length > 0) {
        filtered = filtered.filter(c => selectedConvenios.includes(c.convenio));
      }

      setContratosFiltrados(filtered);
      setResumoGrupos(gerarResumoGrupos(filtered));
      setLoading(false);
    }, 300);
  };

  const handleClearFilters = () => {
    setSelectedConvenios([]);
    setContratosFiltrados(contratos);
    setResumoGrupos(gerarResumoGrupos(contratos));
  };

  const handleConvenioSelect = (convenio: string) => {
    const updated = selectedConvenios.includes(convenio)
      ? selectedConvenios.filter(c => c !== convenio)
      : [...selectedConvenios, convenio];

    setSelectedConvenios(updated);
  };

  const toggleGroup = (grupo: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(grupo)) {
      newExpanded.delete(grupo);
    } else {
      newExpanded.add(grupo);
    }
    setExpandedGroups(newExpanded);
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

  const getContratosByGroup = (grupo: string) => {
    let faixaVencimento: 'ate30' | 'ate60' | 'ate90' | 'acima90' | null = null;

    if (grupo.includes('30 dias')) faixaVencimento = 'ate30';
    else if (grupo.includes('60 dias')) faixaVencimento = 'ate60';
    else if (grupo.includes('90 dias')) faixaVencimento = 'ate90';
    else if (grupo.includes('Acima de 90 dias')) faixaVencimento = 'acima90';

    if (!faixaVencimento) return [];

    return contratosFiltrados.filter(c => c.faixaVencimento === faixaVencimento);
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

          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Órgão / Convênio</label>
              <div className="relative">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  onChange={(e) => handleConvenioSelect(e.target.value)}
                  value=""
                >
                  <option value="">Selecionar órgão...</option>
                  {convenios.map(convenio => (
                    <option key={convenio} value={convenio}>{convenio}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
              {selectedConvenios.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedConvenios.map(c => (
                    <span key={c} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                      {c.replace('Prefeitura de ', 'Pref. ')}
                      <button onClick={() => handleConvenioSelect(c)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-end gap-3">
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
            </div>

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
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo por Grupo</h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando contratos...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider w-8"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Grupo</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Qtde Contratos</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Soma Valor Contratos</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Soma Valor Parcelas</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {resumoGrupos.map((resumo, index) => {
                    const isTotalRow = resumo.grupo === 'Total geral';
                    const isExpanded = expandedGroups.has(resumo.grupo);
                    const contratosDeste = getContratosByGroup(resumo.grupo);

                    return (
                      <React.Fragment key={index}>
                        <tr
                          className={`border-b border-gray-200 ${
                            isTotalRow
                              ? 'bg-gray-100 font-semibold'
                              : 'hover:bg-gray-50 cursor-pointer transition-colors'
                          }`}
                          onClick={() => !isTotalRow && toggleGroup(resumo.grupo)}
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {!isTotalRow && contratosDeste.length > 0 && (
                              isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{resumo.grupo}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{resumo.qtdeContratos}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(resumo.somaValorContratos)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(resumo.somaValorParcelas)}</td>
                        </tr>

                        {!isTotalRow && isExpanded && contratosDeste.length > 0 && (
                          <tr className="bg-gray-50">
                            <td colSpan={5} className="px-4 py-4">
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead className="bg-gray-100 border-b border-gray-200">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Convênio</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Proposta</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contrato</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CPF</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Matrícula</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Categoria</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Celular</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Valor Contrato</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Valor Parcela</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Parcelas</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Liquidadas</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Vencimento</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dias</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Canal</th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {contratosDeste.map((contrato) => (
                                        <tr key={contrato.id} className="hover:bg-gray-50 transition-colors">
                                          <td className="px-3 py-2 text-xs text-gray-900">{contrato.convenio.replace('Prefeitura de ', 'Pref. ')}</td>
                                          <td className="px-3 py-2 text-xs text-blue-600 font-medium">{contrato.numeroProposta}</td>
                                          <td className="px-3 py-2 text-xs text-gray-600">{contrato.contratoExterno}</td>
                                          <td className="px-3 py-2 text-xs text-gray-600">{contrato.cpf}</td>
                                          <td className="px-3 py-2 text-xs text-gray-600">{contrato.matricula}</td>
                                          <td className="px-3 py-2 text-xs text-gray-900">{contrato.nomeServidor}</td>
                                          <td className="px-3 py-2 text-xs text-gray-600">{contrato.categoria}</td>
                                          <td className="px-3 py-2 text-xs text-gray-600">{contrato.celular}</td>
                                          <td className="px-3 py-2 text-xs text-gray-900 font-medium">{formatCurrency(contrato.valorContrato)}</td>
                                          <td className="px-3 py-2 text-xs text-gray-900">{formatCurrency(contrato.valorParcela)}</td>
                                          <td className="px-3 py-2 text-xs text-gray-600">{contrato.qtdeTotalParcelas}x</td>
                                          <td className="px-3 py-2 text-xs text-green-600 font-medium">{contrato.qtdeParcelasLiquidadas}x</td>
                                          <td className="px-3 py-2 text-xs text-gray-600">{formatDate(contrato.vencimentoUltimaParcela)}</td>
                                          <td className="px-3 py-2 text-xs text-gray-900 font-medium">{contrato.diasParaVencimento} dias</td>
                                          <td className="px-3 py-2 text-xs text-gray-600">{contrato.canal}</td>
                                          <td className="px-3 py-2 text-xs">{getStatusBadge(contrato.statusOportunidade)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
