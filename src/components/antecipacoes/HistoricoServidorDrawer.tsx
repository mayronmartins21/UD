import React, { useState } from 'react';
import { X, User, DollarSign, Calendar, Award } from 'lucide-react';

interface HistoricoServidorDrawerProps {
  cpf: string;
  onClose: () => void;
}

export const HistoricoServidorDrawer: React.FC<HistoricoServidorDrawerProps> = ({
  cpf,
  onClose
}) => {
  const [filtroMeses, setFiltroMeses] = useState('12');

  // Mock de dados do servidor
  const servidorInfo = {
    nome: 'João Silva Santos',
    cpf: '123.456.789-01',
    convenio: 'Governo de Goiás',
    matricula: '123456'
  };

  // Mock de histórico
  const historicoRegistros = [
    {
      id: '1',
      data: '2025-01-15',
      convenio: 'Governo de Goiás',
      operacao: 'OP123456',
      tipo: 'Antecipacao',
      parcelas: '58-60/60',
      valor: 4500.00,
      status: 'RepassadoFundo',
      repasse: true
    },
    {
      id: '2',
      data: '2024-11-20',
      convenio: 'Governo de Goiás',
      operacao: 'OP098765',
      tipo: 'Quitacao',
      parcelas: '—',
      valor: 8750.00,
      status: 'RepassadoFundo',
      repasse: true
    },
    {
      id: '3',
      data: '2024-08-10',
      convenio: 'Governo de Goiás',
      operacao: 'OP567890',
      tipo: 'Antecipacao',
      parcelas: '55-60/60',
      valor: 3200.00,
      status: 'RepassadoFundo',
      repasse: true
    },
    {
      id: '4',
      data: '2024-05-15',
      convenio: 'Governo de Goiás',
      operacao: 'OP234567',
      tipo: 'Antecipacao',
      parcelas: '57-60/60',
      valor: 2800.00,
      status: 'RepassadoFundo',
      repasse: true
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Pago': return 'bg-blue-100 text-blue-800';
      case 'RepassePendente': return 'bg-orange-100 text-orange-800';
      case 'RepassadoFundo': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'RepassadoFundo': return 'Repassado à Fundo';
      case 'RepassePendente': return 'Repasse Pendente';
      default: return status;
    }
  };

  // Calcular estatísticas
  const totalOperacoes = historicoRegistros.length;
  const totalRecebido = historicoRegistros.reduce((sum, reg) => sum + reg.valor, 0);
  const ultimoMovimento = historicoRegistros[0]?.data;
  const isRecorrente = totalOperacoes >= 2;

  // Filtrar por período
  const mesesAtras = parseInt(filtroMeses);
  const dataLimite = new Date();
  dataLimite.setMonth(dataLimite.getMonth() - mesesAtras);
  
  const registrosFiltrados = historicoRegistros.filter(reg => 
    new Date(reg.data) >= dataLimite
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-hidden z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <User className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Histórico do Servidor</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {servidorInfo.nome} • {servidorInfo.cpf}
                </p>
              </div>
              {isRecorrente && (
                <div className="ml-4">
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                    <Award className="w-3 h-3 mr-1" />
                    Recorrente
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Filtros */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período
              </label>
              <select
                className="w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filtroMeses}
                onChange={(e) => setFiltroMeses(e.target.value)}
              >
                <option value="12">Últimos 12 meses</option>
                <option value="24">Últimos 24 meses</option>
                <option value="36">Últimos 36 meses</option>
              </select>
            </div>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Total de Operações</p>
                    <p className="text-2xl font-bold text-blue-600">{registrosFiltrados.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Total Recebido</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(registrosFiltrados.reduce((sum, reg) => sum + reg.valor, 0))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Último Movimento</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {ultimoMovimento ? formatDate(ultimoMovimento) : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações do Servidor */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Informações do Servidor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Nome:</span>
                  <span className="ml-2 text-sm text-gray-900">{servidorInfo.nome}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">CPF:</span>
                  <span className="ml-2 text-sm text-gray-900 font-mono">{servidorInfo.cpf}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Convênio:</span>
                  <span className="ml-2 text-sm text-gray-900">{servidorInfo.convenio}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Matrícula:</span>
                  <span className="ml-2 text-sm text-gray-900 font-mono">{servidorInfo.matricula}</span>
                </div>
              </div>
            </div>

            {/* Tabela de Histórico */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Histórico de Operações - {registrosFiltrados.length} registro(s)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Convênio
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Operação
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parcelas
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Repasse
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrosFiltrados.map((registro) => (
                      <tr key={registro.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(registro.data)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {registro.convenio}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {registro.operacao}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            registro.tipo === 'Antecipacao' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {registro.tipo === 'Antecipacao' ? 'Antecipação' : 'Quitação'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {registro.parcelas}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          {formatCurrency(registro.valor)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(registro.status)}`}>
                            {getStatusLabel(registro.status)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {registro.repasse ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Sim
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {registrosFiltrados.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>Nenhum registro encontrado para o período selecionado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};