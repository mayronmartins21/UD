import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Calendar, Filter, Download, Search, TrendingUp, Users,
  AlertCircle, CheckCircle, XCircle, HelpCircle
} from 'lucide-react';
import type { CadastroAplicativo, TipoProduto, ClassificacaoLead } from '../../types/aplicativo';
import {
  analisarCadastros,
  calcularKPIs,
  gerarResumoAnalise,
  gerarInsightsComerciais
} from '../../lib/analiseOportunidadesService';

interface AnaliseOportunidadesViewProps {
  cadastros: CadastroAplicativo[];
  onVoltar: () => void;
}

export function AnaliseOportunidadesView({ cadastros, onVoltar }: AnaliseOportunidadesViewProps) {
  const hoje = new Date();
  const trintaDiasAtras = new Date(hoje);
  trintaDiasAtras.setDate(hoje.getDate() - 30);

  const [dataInicio, setDataInicio] = useState(trintaDiasAtras.toISOString().split('T')[0]);
  const [dataFim, setDataFim] = useState(hoje.toISOString().split('T')[0]);
  const [convenioSelecionado, setConvenioSelecionado] = useState('todos');
  const [produtoSelecionado, setProdutoSelecionado] = useState<TipoProduto>('cartao_compras');
  const [classificacaoFiltro, setClassificacaoFiltro] = useState<ClassificacaoLead | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const conveniosUnicos = useMemo(() => {
    const convenios = new Set(cadastros.map(c => c.convenio));
    return Array.from(convenios).sort();
  }, [cadastros]);

  const cadastrosFiltradosPorPeriodo = useMemo(() => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    fim.setHours(23, 59, 59);

    return cadastros.filter(cadastro => {
      const dataCadastro = cadastro.dataCadastro;
      const dentroData = dataCadastro >= inicio && dataCadastro <= fim;
      const dentroConvenio = convenioSelecionado === 'todos' || cadastro.convenio === convenioSelecionado;
      return dentroData && dentroConvenio;
    });
  }, [cadastros, dataInicio, dataFim, convenioSelecionado]);

  const resultadosAnalise = useMemo(() => {
    return analisarCadastros(cadastrosFiltradosPorPeriodo, produtoSelecionado);
  }, [cadastrosFiltradosPorPeriodo, produtoSelecionado]);

  const resultadosFiltrados = useMemo(() => {
    return resultadosAnalise.filter(resultado => {
      const matchClassificacao = classificacaoFiltro === 'todos' || resultado.classificacao === classificacaoFiltro;
      const matchSearch = searchTerm === '' ||
        resultado.cadastro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resultado.cadastro.cpf.includes(searchTerm) ||
        resultado.cadastro.matricula.includes(searchTerm);
      return matchClassificacao && matchSearch;
    });
  }, [resultadosAnalise, classificacaoFiltro, searchTerm]);

  const kpis = useMemo(() => calcularKPIs(resultadosAnalise), [resultadosAnalise]);
  const resumos = useMemo(() => gerarResumoAnalise(resultadosAnalise), [resultadosAnalise]);
  const insights = useMemo(() => gerarInsightsComerciais(resultadosAnalise), [resultadosAnalise]);

  const getClassificacaoBadge = (classificacao: ClassificacaoLead) => {
    const badges = {
      oportunidade: {
        label: 'Oportunidade',
        className: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      lead_desqualificado: {
        label: 'Desqualificado',
        className: 'bg-red-100 text-red-800',
        icon: XCircle
      },
      possivel_lead: {
        label: 'Possível Lead',
        className: 'bg-yellow-100 text-yellow-800',
        icon: HelpCircle
      }
    };

    const badge = badges[classificacao];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const handleExportar = () => {
    alert('Exportação da análise em desenvolvimento');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onVoltar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Análise de Oportunidades</h2>
            <p className="text-sm text-gray-500 mt-1">
              Análise comercial dos cadastros do aplicativo
            </p>
          </div>
        </div>
        <button
          onClick={handleExportar}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
        >
          <Download className="w-4 h-4" />
          Exportar Análise
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Convênio
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={convenioSelecionado}
                onChange={(e) => setConvenioSelecionado(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="todos">Todos</option>
                {conveniosUnicos.map(convenio => (
                  <option key={convenio} value={convenio}>{convenio}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produto
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value as TipoProduto)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="cartao_compras">Cartão Compras</option>
                <option value="saque_facil">Saque Fácil</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Entradas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpis.totalEntradas}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Oportunidades</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{kpis.totalOportunidades}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Desqualificados</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{kpis.totalDesqualificados}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Possíveis Leads</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{kpis.totalPossiveisLeads}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <HelpCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Taxa Oportunidade</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{kpis.taxaOportunidade.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {insights.length > 0 && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Insights Comerciais</h3>
              <ul className="space-y-1">
                {insights.map((insight, index) => (
                  <li key={index} className="text-sm text-blue-800">
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {resumos.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Resumo da Análise</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Analisado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oportunidades
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Desqualificados
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Possíveis Leads
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taxa Oportunidade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resumos.map((resumo, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {resumo.produto}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {resumo.totalAnalisado}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                      {resumo.oportunidades}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">
                      {resumo.desqualificados}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-yellow-600">
                      {resumo.possiveisLeads}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {resumo.taxaOportunidade.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Análise Detalhada</h3>
              <p className="text-sm text-gray-500 mt-1">
                {resultadosFiltrados.length} registros encontrados
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={classificacaoFiltro}
                  onChange={(e) => setClassificacaoFiltro(e.target.value as ClassificacaoLead | 'todos')}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="todos">Todas classificações</option>
                  <option value="oportunidade">Oportunidades</option>
                  <option value="lead_desqualificado">Desqualificados</option>
                  <option value="possivel_lead">Possíveis Leads</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Cadastro
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Convênio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Idade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margem
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classificação
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motivo
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resultadosFiltrados.map((resultado, index) => {
                const margem = produtoSelecionado === 'cartao_compras'
                  ? resultado.cadastro.margemCompras
                  : resultado.cadastro.margemSaque;

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {resultado.cadastro.dataCadastro.toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {resultado.cadastro.convenio}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {resultado.cadastro.nome}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {resultado.cadastro.cpf}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {resultado.idade !== null ? `${resultado.idade} anos` : <span className="text-gray-400">N/D</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {resultado.cadastro.categoria || <span className="text-gray-400">N/D</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {margem !== null ? `R$ ${margem.toFixed(2)}` : <span className="text-gray-400">N/D</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getClassificacaoBadge(resultado.classificacao)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {resultado.motivo}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {resultadosFiltrados.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum resultado encontrado com os filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
}
