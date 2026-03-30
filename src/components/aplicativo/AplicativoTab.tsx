import React, { useState, useMemo } from 'react';
import { Search, Download, TrendingUp, Filter } from 'lucide-react';
import { gerarCadastrosAplicativo } from '../../data/aplicativoMockData';
import type { CadastroAplicativo } from '../../types/aplicativo';
import { AnaliseOportunidadesView } from './AnaliseOportunidadesView';

export function AplicativoTab() {
  const [cadastros] = useState<CadastroAplicativo[]>(() => gerarCadastrosAplicativo(120));
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroConvenio, setFiltroConvenio] = useState('todos');
  const [filtroOperadora, setFiltroOperadora] = useState('todos');
  const [mostrarAnalise, setMostrarAnalise] = useState(false);

  const conveniosUnicos = useMemo(() => {
    const convenios = new Set(cadastros.map(c => c.convenio));
    return Array.from(convenios).sort();
  }, [cadastros]);

  const operadorasUnicas = useMemo(() => {
    const operadoras = new Set(cadastros.map(c => c.operadora));
    return Array.from(operadoras).sort();
  }, [cadastros]);

  const cadastrosFiltrados = useMemo(() => {
    return cadastros.filter(cadastro => {
      const matchSearch = searchTerm === '' ||
        cadastro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cadastro.cpf.includes(searchTerm) ||
        cadastro.matricula.includes(searchTerm);

      const matchConvenio = filtroConvenio === 'todos' || cadastro.convenio === filtroConvenio;
      const matchOperadora = filtroOperadora === 'todos' || cadastro.operadora === filtroOperadora;

      return matchSearch && matchConvenio && matchOperadora;
    });
  }, [cadastros, searchTerm, filtroConvenio, filtroOperadora]);

  const handleExportar = () => {
    alert('Exportação de relatório em desenvolvimento');
  };

  if (mostrarAnalise) {
    return (
      <AnaliseOportunidadesView
        cadastros={cadastros}
        onVoltar={() => setMostrarAnalise(false)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cadastros do Aplicativo</h2>
          <p className="text-sm text-gray-500 mt-1">
            Clientes que baixaram e se cadastraram no aplicativo UseDigi
          </p>
        </div>
        <button
          onClick={() => setMostrarAnalise(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
        >
          <TrendingUp className="w-4 h-4" />
          Análise de Oportunidades
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou matrícula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filtroConvenio}
                onChange={(e) => setFiltroConvenio(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="todos">Todos os convênios</option>
                {conveniosUnicos.map(convenio => (
                  <option key={convenio} value={convenio}>{convenio}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filtroOperadora}
                onChange={(e) => setFiltroOperadora(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="todos">Todas as operadoras</option>
                {operadorasUnicas.map(operadora => (
                  <option key={operadora} value={operadora}>{operadora}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Cadastros Registrados
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {cadastrosFiltrados.length} cadastros encontrados
            </p>
          </div>
          <button
            onClick={handleExportar}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Cadastro
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operadora
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
                  Matrícula
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Nascimento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margem Compras
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Margem Saque
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cadastrosFiltrados.map((cadastro) => (
                <tr key={cadastro.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {cadastro.dataCadastro.toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {cadastro.operadora}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {cadastro.convenio}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {cadastro.nome}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {cadastro.cpf}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {cadastro.matricula}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {cadastro.dataNascimento
                      ? cadastro.dataNascimento.toLocaleDateString('pt-BR')
                      : <span className="text-gray-400">Não informado</span>
                    }
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {cadastro.categoria || <span className="text-gray-400">Não informado</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {cadastro.margemCompras !== null
                      ? `R$ ${cadastro.margemCompras.toFixed(2)}`
                      : <span className="text-gray-400">Não informado</span>
                    }
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {cadastro.margemSaque !== null
                      ? `R$ ${cadastro.margemSaque.toFixed(2)}`
                      : <span className="text-gray-400">Não informado</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cadastrosFiltrados.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            Nenhum cadastro encontrado com os filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
}
