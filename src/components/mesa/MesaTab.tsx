import React, { useState } from 'react';
import { Search, Filter, Eye, Calendar, User, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { AnalisarPropostaModal } from './AnalisarPropostaModal';

interface PropostaAnalise {
  id: string;
  numero_proposta: string;
  nome_cliente: string;
  cpf: string;
  convenio: string;
  valor_liberado: number;
  situacao_reserva: 'Aprovada' | 'Pendente' | 'Recusada';
  atendente_responsavel: string;
  data_criacao: string;
  status_atual: 'Aguardando' | 'Aprovada' | 'Reprovada' | 'Ajuste';
}

const mockPropostas: PropostaAnalise[] = [
  {
    id: '1',
    numero_proposta: 'PROP20250127001',
    nome_cliente: 'Maria Silva Santos',
    cpf: '123.456.789-01',
    convenio: 'Governo de Goiás',
    valor_liberado: 5000.00,
    situacao_reserva: 'Aprovada',
    atendente_responsavel: 'ana.silva',
    data_criacao: '2025-01-27T10:30:00',
    status_atual: 'Aguardando'
  },
  {
    id: '2',
    numero_proposta: 'PROP20250127002',
    nome_cliente: 'João Carlos Oliveira',
    cpf: '987.654.321-09',
    convenio: 'Prefeitura do Rio de Janeiro',
    valor_liberado: 7500.00,
    situacao_reserva: 'Aprovada',
    atendente_responsavel: 'carlos.costa',
    data_criacao: '2025-01-27T14:15:00',
    status_atual: 'Aguardando'
  },
  {
    id: '3',
    numero_proposta: 'PROP20250126003',
    nome_cliente: 'Ana Paula Rodrigues',
    cpf: '456.789.123-45',
    convenio: 'Governo do Maranhão',
    valor_liberado: 3200.00,
    situacao_reserva: 'Pendente',
    atendente_responsavel: 'ana.silva',
    data_criacao: '2025-01-26T16:45:00',
    status_atual: 'Ajuste'
  },
  {
    id: '4',
    numero_proposta: 'PROP20250126004',
    nome_cliente: 'Roberto Almeida Lima',
    cpf: '789.123.456-78',
    convenio: 'Governo do Paraná',
    valor_liberado: 4800.00,
    situacao_reserva: 'Aprovada',
    atendente_responsavel: 'carlos.costa',
    data_criacao: '2025-01-26T09:20:00',
    status_atual: 'Aprovada'
  },
  {
    id: '5',
    numero_proposta: 'PROP20250125005',
    nome_cliente: 'Fernanda Costa Pereira',
    cpf: '321.654.987-12',
    convenio: 'Prefeitura de Sorocaba',
    valor_liberado: 6200.00,
    situacao_reserva: 'Recusada',
    atendente_responsavel: 'ana.silva',
    data_criacao: '2025-01-25T11:10:00',
    status_atual: 'Reprovada'
  }
];

export const MesaTab: React.FC = () => {
  const [filtros, setFiltros] = useState({
    cpf: '',
    matricula: '',
    numero_proposta: '',
    atendente: '',
    data_inicio: '',
    data_fim: '',
    status: ''
  });
  
  const [selectedProposta, setSelectedProposta] = useState<PropostaAnalise | null>(null);
  const [showAnaliseModal, setShowAnaliseModal] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Aguardando':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'Aprovada':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Reprovada':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Ajuste':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aguardando':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aprovada':
        return 'bg-green-100 text-green-800';
      case 'Reprovada':
        return 'bg-red-100 text-red-800';
      case 'Ajuste':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Aguardando':
        return 'Aguardando análise';
      case 'Aprovada':
        return 'Aprovada';
      case 'Reprovada':
        return 'Reprovada';
      case 'Ajuste':
        return 'Solicitado ajuste';
      default:
        return status;
    }
  };

  const getReservaColor = (situacao: string) => {
    switch (situacao) {
      case 'Aprovada':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Recusada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAnalisar = (proposta: PropostaAnalise) => {
    setSelectedProposta(proposta);
    setShowAnaliseModal(true);
  };

  const handleDecisao = (propostaId: string, decisao: 'aprovar' | 'reprovar' | 'ajuste', comentario?: string) => {
    console.log('Decisão tomada:', { propostaId, decisao, comentario });
    
    let mensagem = '';
    switch (decisao) {
      case 'aprovar':
        mensagem = 'Proposta aprovada com sucesso! A etapa CCB foi liberada no Formalizador.';
        break;
      case 'reprovar':
        mensagem = 'Proposta reprovada. O processo foi finalizado.';
        break;
      case 'ajuste':
        mensagem = 'Solicitação de ajuste enviada. O atendente será notificado para correção.';
        break;
    }
    
    alert(mensagem);
    setShowAnaliseModal(false);
    setSelectedProposta(null);
  };

  const handleBuscar = () => {
    console.log('Aplicando filtros:', filtros);
  };

  const handleLimparFiltros = () => {
    setFiltros({
      cpf: '',
      matricula: '',
      numero_proposta: '',
      atendente: '',
      data_inicio: '',
      data_fim: '',
      status: ''
    });
  };

  // Filtrar propostas baseado nos filtros
  const propostasFiltradas = mockPropostas.filter(proposta => {
    if (filtros.cpf && !proposta.cpf.includes(filtros.cpf.replace(/\D/g, ''))) return false;
    if (filtros.numero_proposta && !proposta.numero_proposta.toLowerCase().includes(filtros.numero_proposta.toLowerCase())) return false;
    if (filtros.atendente && !proposta.atendente_responsavel.toLowerCase().includes(filtros.atendente.toLowerCase())) return false;
    if (filtros.status && proposta.status_atual !== filtros.status) return false;
    return true;
  });

  // Estatísticas
  const stats = {
    total: propostasFiltradas.length,
    aguardando: propostasFiltradas.filter(p => p.status_atual === 'Aguardando').length,
    aprovadas: propostasFiltradas.filter(p => p.status_atual === 'Aprovada').length,
    reprovadas: propostasFiltradas.filter(p => p.status_atual === 'Reprovada').length,
    ajustes: propostasFiltradas.filter(p => p.status_atual === 'Ajuste').length
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mesa de Análise</h2>
        <p className="text-gray-600">
          Análise e aprovação de propostas enviadas pelos atendentes.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="000.000.000-00"
              value={filtros.cpf}
              onChange={(e) => setFiltros({ ...filtros, cpf: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="123456"
              value={filtros.matricula}
              onChange={(e) => setFiltros({ ...filtros, matricula: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número da Proposta</label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="PROP20250127001"
              value={filtros.numero_proposta}
              onChange={(e) => setFiltros({ ...filtros, numero_proposta: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Atendente</label>
            <input
              type="text"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="ana.silva"
              value={filtros.atendente}
              onChange={(e) => setFiltros({ ...filtros, atendente: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
            <input
              type="date"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filtros.data_inicio}
              onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
            <input
              type="date"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filtros.data_fim}
              onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={filtros.status}
              onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
            >
              <option value="">Todos</option>
              <option value="Aguardando">Aguardando análise</option>
              <option value="Aprovada">Aprovada</option>
              <option value="Reprovada">Reprovada</option>
              <option value="Ajuste">Solicitado ajuste</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleBuscar}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
            <button
              onClick={handleLimparFiltros}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Propostas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Propostas Pendentes de Análise - {propostasFiltradas.length} registro(s)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número da Proposta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome do Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Convênio
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Liberado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Situação da Reserva
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atendente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Criação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Atual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {propostasFiltradas.map((proposta) => (
                <tr key={proposta.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono font-medium text-gray-900">
                      {proposta.numero_proposta}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {proposta.nome_cliente}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-gray-900">
                      {proposta.cpf}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {proposta.convenio}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(proposta.valor_liberado)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getReservaColor(proposta.situacao_reserva)}`}>
                      {proposta.situacao_reserva}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{proposta.atendente_responsavel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{formatDateTime(proposta.data_criacao)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(proposta.status_atual)}
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposta.status_atual)}`}>
                        {getStatusLabel(proposta.status_atual)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleAnalisar(proposta)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Analisar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {propostasFiltradas.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Nenhuma proposta encontrada para os filtros selecionados.</p>
          </div>
        )}
      </div>

      {/* Modal de Análise */}
      {showAnaliseModal && selectedProposta && (
        <AnalisarPropostaModal
          proposta={selectedProposta}
          onClose={() => {
            setShowAnaliseModal(false);
            setSelectedProposta(null);
          }}
          onDecisao={handleDecisao}
        />
      )}
    </div>
  );
};