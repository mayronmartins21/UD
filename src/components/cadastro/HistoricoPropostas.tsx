import React, { useState } from 'react';
import { Eye, Download, Calendar, User, DollarSign, Edit, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface HistoricoPropostasProps {
  cpf?: string;
}

interface Proposta {
  id: string;
  numeroContrato: string;
  dataContrato: string;
  valorContratado: number;
  parcelas: number;
  status: 'Ativa' | 'Quitada' | 'Cancelada' | 'Pendente' | 'EmAnalise' | 'SolicitadoAjuste' | 'Reprovada';
  convenio: string;
  produto: string;
  motivoAjuste?: string;
  podeEditar?: boolean;
}

const mockPropostas: Proposta[] = [
  {
    id: '1',
    numeroContrato: 'CCB12345678',
    dataContrato: '2024-01-15',
    valorContratado: 5000.00,
    parcelas: 60,
    status: 'Ativa',
    convenio: 'Governo de Goiás',
    produto: 'Cartão Consignado'
  },
  {
    id: '2',
    numeroContrato: 'CCB87654321',
    dataContrato: '2023-08-22',
    valorContratado: 3000.00,
    parcelas: 36,
    status: 'Quitada',
    convenio: 'Governo de Goiás',
    produto: 'Empréstimo'
  },
  {
    id: '3',
    numeroContrato: 'PROP20250127001',
    dataContrato: '2025-01-27',
    valorContratado: 7500.00,
    parcelas: 72,
    status: 'EmAnalise',
    convenio: 'Prefeitura do Rio de Janeiro',
    produto: 'Antecipação FGTS'
  },
  {
    id: '4',
    numeroContrato: 'PROP20250126002',
    dataContrato: '2025-01-26',
    valorContratado: 4200.00,
    parcelas: 48,
    status: 'SolicitadoAjuste',
    convenio: 'Governo de Goiás',
    produto: 'Cartão Consignado',
    motivoAjuste: 'Necessário anexar contracheque mais recente e corrigir dados bancários',
    podeEditar: true
  },
  {
    id: '5',
    numeroContrato: 'PROP20250125003',
    dataContrato: '2025-01-25',
    valorContratado: 2800.00,
    parcelas: 36,
    status: 'Reprovada',
    convenio: 'Prefeitura de Sorocaba',
    produto: 'Empréstimo'
  }
];

export const HistoricoPropostas: React.FC<HistoricoPropostasProps> = ({ cpf }) => {
  const [showHistorico, setShowHistorico] = useState(false);
  const [editandoProposta, setEditandoProposta] = useState<string | null>(null);

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
      case 'Ativa':
        return 'bg-green-100 text-green-800';
      case 'Quitada':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'EmAnalise':
        return 'bg-purple-100 text-purple-800';
      case 'SolicitadoAjuste':
        return 'bg-orange-100 text-orange-800';
      case 'Reprovada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'EmAnalise':
        return 'Em Análise';
      case 'SolicitadoAjuste':
        return 'Solicitado Ajuste';
      case 'Reprovada':
        return 'Reprovada';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ativa':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Quitada':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'Cancelada':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Pendente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'EmAnalise':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'SolicitadoAjuste':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'Reprovada':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleVerDetalhes = (proposta: Proposta) => {
    if (proposta.status === 'SolicitadoAjuste') {
      alert(`Proposta ${proposta.numeroContrato} - Ajuste Solicitado\n\nMotivo do Ajuste:\n${proposta.motivoAjuste}\n\nClique em "Editar" para fazer as correções necessárias.`);
    } else {
      alert(`Detalhes da Proposta ${proposta.numeroContrato}\n\nValor: ${formatCurrency(proposta.valorContratado)}\nParcelas: ${proposta.parcelas}x\nStatus: ${getStatusLabel(proposta.status)}\nConvênio: ${proposta.convenio}`);
    }
  };

  const handleEditarProposta = (proposta: Proposta) => {
    if (proposta.status === 'SolicitadoAjuste') {
      // Simular navegação para edição da proposta
      alert(`Editando Proposta ${proposta.numeroContrato}\n\nMotivo do Ajuste:\n${proposta.motivoAjuste}\n\nVocê será redirecionado para a etapa apropriada do Formalizador para fazer as correções necessárias.\n\nApós as correções, a proposta será reenviada automaticamente para análise.`);
      setEditandoProposta(proposta.id);
      
      // Simular redirecionamento para o formalizador
      setTimeout(() => {
        setEditandoProposta(null);
        alert('Proposta corrigida e reenviada para análise com sucesso!');
      }, 2000);
    }
  };

  const handleDownloadContrato = (proposta: Proposta) => {
    if (['Ativa', 'Quitada'].includes(proposta.status)) {
      alert(`Download do contrato ${proposta.numeroContrato} iniciado.`);
    } else {
      alert('Download disponível apenas para contratos ativos ou quitados.');
    }
  };

  const renderAcoesProposta = (proposta: Proposta) => {
    return (
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => handleVerDetalhes(proposta)}
          className="text-blue-600 hover:text-blue-800"
          title="Ver Detalhes"
        >
          <Eye className="w-4 h-4" />
        </button>
        
        {proposta.podeEditar && proposta.status === 'SolicitadoAjuste' && (
          <button
            onClick={() => handleEditarProposta(proposta)}
            className={`text-orange-600 hover:text-orange-800 ${
              editandoProposta === proposta.id ? 'animate-pulse' : ''
            }`}
            title="Editar Proposta"
            disabled={editandoProposta === proposta.id}
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
        
        {['Ativa', 'Quitada'].includes(proposta.status) && (
          <button
            onClick={() => handleDownloadContrato(proposta)}
            className="text-green-600 hover:text-green-800"
            title="Download Contrato"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  // Só mostrar se houver CPF preenchido
  if (!cpf || cpf.length < 14) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Histórico de Propostas
            </h3>
          </div>
          
          <button
            onClick={() => setShowHistorico(!showHistorico)}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            {showHistorico ? 'Ocultar' : 'Mostrar'} Histórico
          </button>
        </div>
        
        <p className="text-gray-600 mt-1">
          Propostas anteriores para o CPF: {cpf}
        </p>
      </div>

      {showHistorico && (
        <div className="p-6">
          {mockPropostas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contrato/Proposta
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Convênio
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parcelas
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockPropostas.map((proposta) => (
                    <tr key={proposta.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 font-mono">
                          {proposta.numeroContrato}
                        </div>
                        {proposta.status === 'SolicitadoAjuste' && proposta.motivoAjuste && (
                          <div className="text-xs text-orange-600 mt-1 max-w-48 truncate" title={proposta.motivoAjuste}>
                            ⚠️ {proposta.motivoAjuste}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {formatDate(proposta.dataContrato)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{proposta.produto}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{proposta.convenio}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end text-sm font-medium text-gray-900">
                          <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                          {formatCurrency(proposta.valorContratado)}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{proposta.parcelas}x</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          {getStatusIcon(proposta.status)}
                          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposta.status)}`}>
                            {getStatusLabel(proposta.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        {renderAcoesProposta(proposta)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma proposta anterior encontrada para este CPF.</p>
            </div>
          )}

          {/* Legenda de Status */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Legenda de Status:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                <span className="text-gray-700">Ativa/Quitada: Contratos finalizados</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 text-purple-600 mr-1" />
                <span className="text-gray-700">Em Análise: Aguardando aprovação</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-3 h-3 text-orange-600 mr-1" />
                <span className="text-gray-700">Solicitado Ajuste: Requer correção</span>
              </div>
              <div className="flex items-center">
                <XCircle className="w-3 h-3 text-red-600 mr-1" />
                <span className="text-gray-700">Reprovada: Proposta rejeitada</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};