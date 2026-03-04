import React, { useState, useEffect } from 'react';
import { Search, X, Copy, FileEdit, AlertCircle } from 'lucide-react';
import { Proposta, PropostaComCorrecoes, ETAPAS_LABELS, STATUS_LABELS } from '../../types/propostas';

interface BuscarPropostaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAbrirProposta: (proposta: PropostaComCorrecoes) => void;
}

export function BuscarPropostaModal({ isOpen, onClose, onAbrirProposta }: BuscarPropostaModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [propostas, setPropostas] = useState<PropostaComCorrecoes[]>([]);
  const [filteredPropostas, setFilteredPropostas] = useState<PropostaComCorrecoes[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      carregarPropostas();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPropostas(propostas);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = propostas.filter(p =>
        p.numero_proposta.toLowerCase().includes(term) ||
        p.cpf_cliente.includes(term) ||
        p.nome_cliente.toLowerCase().includes(term)
      );
      setFilteredPropostas(filtered);
    }
  }, [searchTerm, propostas]);

  const carregarPropostas = async () => {
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
          id: '3',
          numero_proposta: 'PROP-2025-003',
          cpf_cliente: '456.789.123-00',
          nome_cliente: 'Carlos Eduardo Mendes',
          etapa_atual: 'ccb',
          status: 'pendente_assinatura',
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
          id: '4',
          numero_proposta: 'PROP-2025-004',
          cpf_cliente: '321.654.987-00',
          nome_cliente: 'Ana Paula Rodrigues',
          etapa_atual: 'documentos',
          status: 'correcao_solicitada',
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
            },
            {
              id: 'corr-3',
              proposta_id: '4',
              etapa: 'documentos',
              comentario: 'Falta comprovante de residência atualizado',
              solicitado_por: 'analista-1',
              solicitado_em: new Date().toISOString(),
              corrigido: false
            }
          ]
        }
      ];

      setPropostas(mockPropostas);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
    } finally {
      setLoading(false);
    }
  };

  const copiarNumero = async (numero: string) => {
    try {
      await navigator.clipboard.writeText(numero);
      setCopiedId(numero);
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

  const podeAbrirProposta = (proposta: Proposta) => {
    return proposta.status === 'em_andamento' || proposta.status === 'correcao_solicitada';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Buscar Proposta — UseDigi</h2>
            <p className="text-sm text-gray-600 mt-1">
              Pesquise por número da proposta, CPF ou nome do cliente
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Digite o número da proposta, CPF ou nome do cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Carregando propostas...</p>
            </div>
          ) : filteredPropostas.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-600">Nenhuma proposta encontrada</p>
              <p className="text-sm text-gray-500 mt-2">
                {searchTerm ? 'Tente ajustar os termos da busca' : 'Não há propostas para exibir'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Número</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">CPF</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Etapa Atual</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Correções</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Ações</th>
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
                        <span className="text-gray-900">{proposta.nome_cliente}</span>
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
                        {proposta.correcoes && proposta.correcoes.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-orange-600" />
                            <span className="text-sm font-medium text-orange-600">
                              {proposta.correcoes.length} {proposta.correcoes.length === 1 ? 'correção' : 'correções'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copiarNumero(proposta.numero_proposta)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Copiar número"
                          >
                            <Copy size={18} />
                          </button>
                          {copiedId === proposta.numero_proposta && (
                            <span className="text-xs text-green-600 font-medium">Copiado!</span>
                          )}
                          {podeAbrirProposta(proposta) && (
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
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredPropostas.length} {filteredPropostas.length === 1 ? 'proposta encontrada' : 'propostas encontradas'}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
