import React, { useState } from 'react';
import { Eye, Edit, Clock, FileText, Download } from 'lucide-react';
import { StatusChip } from '../common/StatusChip';
import type { FiltroAntecipacao, RegistroAntecipacao } from '../../types/antecipacoes';

interface AntecipacaoGridProps {
  filtros: FiltroAntecipacao;
  onEditar: (registro: RegistroAntecipacao) => void;
  onHistorico: (cpf: string) => void;
  onMarcarRepasse: (registro: RegistroAntecipacao) => void;
}

const mockRegistros: RegistroAntecipacao[] = [
  {
    id: '1',
    data_recebimento: '2025-01-15',
    cpf: '123.456.789-01',
    servidor_nome: 'João Silva Santos',
    convenio_id: '1',
    convenio_nome: 'Governo de Goiás',
    operacao_id: 'OP123456',
    tipo: 'Antecipacao',
    parcelas_antecipadas: '58-60/60',
    valor_recebido: 4500.00,
    repasse_qista: true,
    data_repasse: '2025-01-20',
    status: 'RepassadoFundo',
    anexos: {
      boleto: true,
      comprovante_pagamento: true,
      planilha_calculo: false
    },
    observacoes: 'Antecipação das 3 últimas parcelas'
  },
  {
    id: '2',
    data_recebimento: '2025-01-18',
    cpf: '987.654.321-09',
    servidor_nome: 'Maria Oliveira Costa',
    convenio_id: '7',
    convenio_nome: 'Prefeitura do Rio de Janeiro',
    operacao_id: 'OP789012',
    tipo: 'Quitacao',
    parcelas_antecipadas: '—',
    valor_recebido: 12500.00,
    repasse_qista: true,
    data_repasse: '',
    status: 'RepassePendente',
    anexos: {
      boleto: true,
      comprovante_pagamento: true,
      planilha_calculo: true
    },
    observacoes: 'Quitação integral do contrato'
  },
  {
    id: '3',
    data_recebimento: '2025-01-22',
    cpf: '456.789.123-45',
    servidor_nome: 'Carlos Eduardo Pereira',
    convenio_id: '4',
    convenio_nome: 'Prefeitura de Sorocaba',
    operacao_id: 'OP345678',
    tipo: 'Antecipacao',
    parcelas_antecipadas: '55-60/60',
    valor_recebido: 6750.00,
    repasse_qista: false,
    data_repasse: '',
    status: 'Pago',
    anexos: {
      boleto: true,
      comprovante_pagamento: false,
      planilha_calculo: true
    },
    observacoes: ''
  }
];

export const AntecipacaoGrid: React.FC<AntecipacaoGridProps> = ({
  filtros,
  onEditar,
  onHistorico,
  onMarcarRepasse
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pago':
        return 'bg-blue-100 text-blue-800';
      case 'RepassePendente':
        return 'bg-orange-100 text-orange-800';
      case 'RepassadoFundo':
        return 'bg-green-100 text-green-800';
      case 'Cancelado':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'Pendente';
      case 'Pago':
        return 'Pago';
      case 'RepassePendente':
        return 'Repasse Pendente';
      case 'RepassadoFundo':
        return 'Repassado à Fundo';
      case 'Cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getRepasseChip = (repasse: boolean, status: string) => {
    if (!repasse) return <span className="text-gray-400">—</span>;
    
    if (status === 'RepassadoFundo') {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Repassado</span>;
    }
    
    return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Pendente</span>;
  };

  const renderAnexos = (anexos: any) => {
    return (
      <div className="flex items-center space-x-1">
        {anexos.boleto && (
          <FileText className="w-4 h-4 text-blue-600" title="Boleto" />
        )}
        {anexos.comprovante_pagamento && (
          <FileText className="w-4 h-4 text-green-600" title="Comprovante de Pagamento" />
        )}
        {anexos.planilha_calculo && (
          <FileText className="w-4 h-4 text-purple-600" title="Planilha de Cálculo" />
        )}
      </div>
    );
  };

  // Filtrar dados (mock)
  const filteredData = mockRegistros.filter(registro => {
    if (filtros.convenio && registro.convenio_id !== filtros.convenio) return false;
    if (filtros.tipo && registro.tipo !== filtros.tipo) return false;
    if (filtros.status && registro.status !== filtros.status) return false;
    if (filtros.busca) {
      const busca = filtros.busca.toLowerCase();
      return (
        registro.cpf.includes(busca) ||
        registro.servidor_nome.toLowerCase().includes(busca) ||
        registro.operacao_id.toLowerCase().includes(busca)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Registros do Mês - {filteredData.length} registro(s)
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Competência de recebimento: {filtros.competencia ? `${filtros.competencia.substring(4, 6)}/${filtros.competencia.substring(0, 4)}` : 'Todas'}
        </p>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Recebimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servidor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Convênio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parcelas Antecipadas
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Recebido
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Repasse à Fundo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Repasse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anexos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((registro) => (
              <tr key={registro.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(registro.data_recebimento)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900">{registro.cpf}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{registro.servidor_nome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{registro.convenio_nome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900">{registro.operacao_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    registro.tipo === 'Antecipacao' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {registro.tipo === 'Antecipacao' ? 'Antecipação' : 'Quitação'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {registro.parcelas_antecipadas}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(registro.valor_recebido)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRepasseChip(registro.repasse_qista, registro.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(registro.data_repasse)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(registro.status)}`}>
                    {getStatusLabel(registro.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderAnexos(registro.anexos)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditar(registro)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onHistorico(registro.cpf)}
                      className="text-gray-600 hover:text-gray-800"
                      title="Histórico do Servidor"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {registro.status === 'RepassePendente' && (
                      <button
                        onClick={() => onMarcarRepasse(registro)}
                        className="text-green-600 hover:text-green-800"
                        title="Marcar Repasse"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} resultados
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    page === currentPage 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>
      )}

      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>Nenhum registro encontrado para os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};