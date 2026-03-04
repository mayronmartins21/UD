import React, { useState, useEffect } from 'react';
import { Search, X, Copy, FileEdit, AlertCircle, RefreshCcw } from 'lucide-react';
import { PropostaComCorrecoes, ETAPAS_LABELS, STATUS_LABELS, STATUS_PAGAMENTO_LABELS, StatusPagamento } from '../../types/propostas';

interface CCBPendente {
  id: string;
  numero_proposta: string;
  nome_cliente: string;
  cpf: string;
  convenio: string;
  valor_liberado: number;
  status_ccb: string;
  link_ccb: string;
}

interface BuscarPropostaUnificadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAbrirProposta: (proposta: PropostaComCorrecoes) => void;
  onReapresentarDadosBancarios?: (proposta: PropostaComCorrecoes) => void;
}

export function BuscarPropostaUnificadoModal({
  isOpen,
  onClose,
  onAbrirProposta,
  onReapresentarDadosBancarios
}: BuscarPropostaUnificadoModalProps) {
  const [abaAtiva, setAbaAtiva] = useState<'propostas' | 'ccbs'>('propostas');
  const [searchTerm, setSearchTerm] = useState('');
  const [propostas, setPropostas] = useState<PropostaComCorrecoes[]>([]);
  const [ccbs, setCcbs] = useState<CCBPendente[]>([]);
  const [filteredPropostas, setFilteredPropostas] = useState<PropostaComCorrecoes[]>([]);
  const [filteredCcbs, setFilteredCcbs] = useState<CCBPendente[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      carregarDados();
    }
  }, [isOpen]);

  useEffect(() => {
    if (abaAtiva === 'propostas') {
      filtrarPropostas();
    } else {
      filtrarCcbs();
    }
  }, [searchTerm, propostas, ccbs, abaAtiva]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const mockPropostas: PropostaComCorrecoes[] = [
        {
          id: '1',
          numero_proposta: 'PROP-2025-001',
          cpf_cliente: '123.456.789-00',
          nome_cliente: 'João Silva Santos',
          etapa_atual: 'documentos',
          status: 'em_andamento',
          status_pagamento: 'pendente',
          dados_simulador: {},
          dados_cadastro: {},
          dados_documentos: {},
          dados_reserva: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'user-1',
          updated_by: 'user-1',
          correcoes: []
        },
        {
          id: '2',
          numero_proposta: 'PROP-2025-002',
          cpf_cliente: '987.654.321-00',
          nome_cliente: 'Maria Oliveira Costa',
          etapa_atual: 'cadastro',
          status: 'correcao_solicitada',
          status_pagamento: 'devolvido',
          dados_simulador: {},
          dados_cadastro: {},
          dados_documentos: {},
          dados_reserva: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'user-1',
          updated_by: 'user-1',
          correcoes: [
            {
              id: 'corr-1',
              proposta_id: '2',
              etapa: 'cadastro',
              comentario: 'Endereço incompleto - falta número e complemento',
              solicitado_por: 'analista-1',
              solicitado_em: new Date().toISOString(),
              corrigido: false
            }
          ]
        },
        {
          id: '4',
          numero_proposta: 'PROP-2025-004',
          cpf_cliente: '321.654.987-00',
          nome_cliente: 'Ana Paula Rodrigues',
          etapa_atual: 'documentos',
          status: 'correcao_solicitada',
          status_pagamento: 'pago',
          dados_simulador: {},
          dados_cadastro: {},
          dados_documentos: {},
          dados_reserva: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'user-1',
          updated_by: 'user-1',
          correcoes: [
            {
              id: 'corr-2',
              proposta_id: '4',
              etapa: 'documentos',
              comentario: 'Documento de identidade está ilegível',
              solicitado_por: 'analista-1',
              solicitado_em: new Date().toISOString(),
              corrigido: false
            }
          ]
        },
        {
          id: '5',
          numero_proposta: 'PROP-2025-005',
          cpf_cliente: '555.666.777-88',
          nome_cliente: 'Pedro Henrique Santos',
          etapa_atual: 'reserva',
          status: 'em_andamento',
          status_pagamento: 'pago',
          dados_simulador: {},
          dados_cadastro: {},
          dados_documentos: {},
          dados_reserva: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          created_by: 'user-1',
          updated_by: 'user-1',
          correcoes: []
        }
      ];

      const mockCcbs: CCBPendente[] = [
        {
          id: '1',
          numero_proposta: 'CCB-2025-001',
          nome_cliente: 'Carlos Eduardo Mendes',
          cpf: '456.789.123-00',
          convenio: 'Governo de Goiás',
          valor_liberado: 5000.00,
          status_ccb: 'Pendente de assinatura',
          link_ccb: 'https://ccb.usedigi.com.br/contrato/CCB-2025-001'
        },
        {
          id: '2',
          numero_proposta: 'CCB-2025-002',
          nome_cliente: 'Fernanda Lima Souza',
          cpf: '789.012.345-67',
          convenio: 'Prefeitura do Rio de Janeiro',
          valor_liberado: 7500.00,
          status_ccb: 'Pendente de assinatura',
          link_ccb: 'https://ccb.usedigi.com.br/contrato/CCB-2025-002'
        },
        {
          id: '3',
          numero_proposta: 'CCB-2025-003',
          nome_cliente: 'Roberto Carlos Silva',
          cpf: '234.567.890-12',
          convenio: 'Governo do Maranhão',
          valor_liberado: 3200.00,
          status_ccb: 'Pendente de assinatura',
          link_ccb: 'https://ccb.usedigi.com.br/contrato/CCB-2025-003'
        }
      ];

      setPropostas(mockPropostas);
      setCcbs(mockCcbs);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPropostas = () => {
    if (searchTerm.trim() === '') {
      setFilteredPropostas(propostas);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = propostas.filter(p =>
        p.numero_proposta.toLowerCase().includes(term) ||
        p.cpf_cliente.replace(/\D/g, '').includes(term.replace(/\D/g, '')) ||
        p.nome_cliente.toLowerCase().includes(term)
      );
      setFilteredPropostas(filtered);
    }
  };

  const filtrarCcbs = () => {
    if (searchTerm.trim() === '') {
      setFilteredCcbs(ccbs);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = ccbs.filter(c =>
        c.numero_proposta.toLowerCase().includes(term) ||
        c.cpf.replace(/\D/g, '').includes(term.replace(/\D/g, '')) ||
        c.nome_cliente.toLowerCase().includes(term)
      );
      setFilteredCcbs(filtered);
    }
  };

  const handleBuscar = () => {
    if (abaAtiva === 'propostas') {
      filtrarPropostas();
    } else {
      filtrarCcbs();
    }
  };

  const copiarLink = async (link: string, id: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'correcao_solicitada':
        return 'bg-orange-100 text-orange-800';
      case 'pendente_assinatura':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprovada':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusPagamentoColor = (statusPagamento?: StatusPagamento) => {
    switch (statusPagamento) {
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'devolvido':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleClose = () => {
    setSearchTerm('');
    setAbaAtiva('propostas');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Buscar Proposta — UseDigi</h2>
            <p className="text-sm text-gray-600 mt-1">
              Pesquise propostas em andamento ou CCBs pendentes de assinatura
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              onClick={() => setAbaAtiva('propostas')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                abaAtiva === 'propostas'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Propostas em Andamento
            </button>
            <button
              onClick={() => setAbaAtiva('ccbs')}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                abaAtiva === 'ccbs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              CCBs Pendentes
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Digite CPF, matrícula ou número da proposta"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleBuscar}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Search size={18} />
              Buscar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Carregando...</p>
            </div>
          ) : abaAtiva === 'propostas' ? (
            filteredPropostas.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-600 text-lg font-medium">
                  Nenhuma proposta encontrada para os filtros informados.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Número</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Nome do Cliente</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">CPF</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Etapa Atual</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Esteira</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status de Pagamento</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Correções</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPropostas.map((proposta) => (
                      <tr key={proposta.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm font-medium text-gray-900">
                            {proposta.numero_proposta}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">{proposta.nome_cliente}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600 font-mono text-sm">{proposta.cpf_cliente}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {ETAPAS_LABELS[proposta.etapa_atual]}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(proposta.status)}`}>
                            {STATUS_LABELS[proposta.status]}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusPagamentoColor(proposta.status_pagamento)}`}>
                            {proposta.status_pagamento ? STATUS_PAGAMENTO_LABELS[proposta.status_pagamento] : 'Pendente'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {proposta.correcoes && proposta.correcoes.length > 0 ? (
                            <div className="flex items-center gap-2">
                              <AlertCircle size={16} className="text-orange-600" />
                              <span className="text-sm font-medium text-orange-600">
                                {proposta.correcoes.length}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end">
                            {proposta.status_pagamento === 'devolvido' ? (
                              <button
                                onClick={() => onReapresentarDadosBancarios?.(proposta)}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                              >
                                <RefreshCcw size={18} />
                                Reapresentar dados bancários
                              </button>
                            ) : (
                              <button
                                onClick={() => onAbrirProposta(proposta)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                <FileEdit size={18} />
                                Abrir Proposta
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            filteredCcbs.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-600 text-lg font-medium">
                  Nenhuma proposta encontrada para os filtros informados.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Número</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Nome do Cliente</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">CPF</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Convênio</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Valor Liberado</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status da CCB</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCcbs.map((ccb) => (
                      <tr key={ccb.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm font-medium text-gray-900">
                            {ccb.numero_proposta}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">{ccb.nome_cliente}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600 font-mono text-sm">{ccb.cpf}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-900">{ccb.convenio}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(ccb.valor_liberado)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {ccb.status_ccb}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => copiarLink(ccb.link_ccb, ccb.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              <Copy size={18} />
                              Copiar link da CCB
                            </button>
                            {copiedId === ccb.id && (
                              <span className="text-xs text-green-600 font-medium">Copiado!</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {abaAtiva === 'propostas'
                ? `${filteredPropostas.length} ${filteredPropostas.length === 1 ? 'proposta encontrada' : 'propostas encontradas'}`
                : `${filteredCcbs.length} ${filteredCcbs.length === 1 ? 'CCB encontrada' : 'CCBs encontradas'}`
              }
            </p>
            <button
              onClick={handleClose}
              className="px-5 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
