import React, { useState } from 'react';
import { X, FileText, Download, Upload } from 'lucide-react';
import type { RegistroAntecipacao } from '../../types/antecipacoes';

interface EditarRegistroDrawerProps {
  registro: RegistroAntecipacao;
  onClose: () => void;
  onSave: (registro: RegistroAntecipacao) => void;
}

export const EditarRegistroDrawer: React.FC<EditarRegistroDrawerProps> = ({
  registro,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    ...registro,
    valor_recebido_formatted: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(registro.valor_recebido)
  });

  const [anexos, setAnexos] = useState({
    boleto: null as File | null,
    comprovante_pagamento: null as File | null,
    planilha_calculo: null as File | null,
    comprovante_repasse: null as File | null
  });

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    const formattedValue = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return formattedValue;
  };

  const handleInputChange = (field: string, value: any) => {
    if (field === 'valor_recebido_formatted') {
      const formatted = formatCurrency(value);
      setFormData(prev => ({
        ...prev,
        valor_recebido_formatted: formatted,
        valor_recebido: parseFloat(formatted.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleFileUpload = (tipo: keyof typeof anexos, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Tamanho máximo: 10MB');
      return;
    }
    setAnexos(prev => ({ ...prev, [tipo]: file }));
  };

  const handleSave = () => {
    const updatedRegistro: RegistroAntecipacao = {
      ...formData,
      anexos: {
        boleto: formData.anexos.boleto || !!anexos.boleto,
        comprovante_pagamento: formData.anexos.comprovante_pagamento || !!anexos.comprovante_pagamento,
        planilha_calculo: formData.anexos.planilha_calculo || !!anexos.planilha_calculo
      }
    };
    
    onSave(updatedRegistro);
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

  const canTransitionTo = (newStatus: string) => {
    const currentStatus = formData.status;
    
    // Regras de transição
    switch (currentStatus) {
      case 'Pendente':
        return ['Pago', 'Cancelado'].includes(newStatus);
      case 'Pago':
        return ['RepassePendente', 'Cancelado'].includes(newStatus);
      case 'RepassePendente':
        return ['RepassadoFundo', 'Cancelado'].includes(newStatus);
      case 'RepassadoFundo':
        return ['Cancelado'].includes(newStatus);
      case 'Cancelado':
        return false; // Cancelado é final
      default:
        return false;
    }
  };

  // Mock de histórico de alterações
  const historicoAlteracoes = [
    {
      data: '2025-01-15 10:30',
      usuario: 'ana.silva',
      acao: 'Criação do registro',
      detalhes: 'Registro criado com status Pendente'
    },
    {
      data: '2025-01-16 14:20',
      usuario: 'ana.silva',
      acao: 'Alteração de status',
      detalhes: 'Status alterado de Pendente para Pago'
    },
    {
      data: '2025-01-18 09:15',
      usuario: 'carlos.costa',
      acao: 'Anexo adicionado',
      detalhes: 'Comprovante de pagamento anexado'
    }
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-hidden z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Editar Registro</h2>
              <p className="text-sm text-gray-600 mt-1">
                {formData.servidor_nome} • {formData.operacao_id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Informações Básicas */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    value={formData.tipo === 'Antecipacao' ? 'Antecipação' : 'Quitação'}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Convênio
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    value={formData.convenio_nome}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    value={formData.cpf}
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Operação
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    value={formData.operacao_id}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Valores e Datas */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Valores e Datas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Recebido
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.valor_recebido_formatted}
                    onChange={(e) => handleInputChange('valor_recebido_formatted', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Recebimento
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.data_recebimento}
                    onChange={(e) => handleInputChange('data_recebimento', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Repasse
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.data_repasse}
                    onChange={(e) => handleInputChange('data_repasse', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                  >
                    <option value="Pendente" disabled={!canTransitionTo('Pendente')}>Pendente</option>
                    <option value="Pago" disabled={!canTransitionTo('Pago')}>Pago</option>
                    <option value="RepassePendente" disabled={!canTransitionTo('RepassePendente')}>Repasse Pendente</option>
                    <option value="RepassadoFundo" disabled={!canTransitionTo('RepassadoFundo')}>Repassado à Fundo</option>
                    <option value="Cancelado" disabled={!canTransitionTo('Cancelado')}>Cancelado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Repasse à Fundo */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={formData.repasse_qista}
                  onChange={(e) => handleInputChange('repasse_qista', e.target.checked)}
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Repasse à Fundo</span>
              </label>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
              />
            </div>

            {/* Anexos */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Anexos</h3>
              <div className="space-y-4">
                {/* Boleto */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Boleto</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.anexos.boleto && (
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <label className="cursor-pointer text-gray-600 hover:text-gray-800">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload('boleto', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>

                {/* Comprovante de Pagamento */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium">Comprovante de Pagamento</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.anexos.comprovante_pagamento && (
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <label className="cursor-pointer text-gray-600 hover:text-gray-800">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf"
                        onChange={(e) => handleFileUpload('comprovante_pagamento', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>

                {/* Planilha de Cálculo */}
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-sm font-medium">Planilha de Cálculo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {formData.anexos.planilha_calculo && (
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <label className="cursor-pointer text-gray-600 hover:text-gray-800">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.xlsx"
                        onChange={(e) => handleFileUpload('planilha_calculo', e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Histórico */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Alterações</h3>
              <div className="space-y-3">
                {historicoAlteracoes.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{item.acao}</span>
                        <span className="text-xs text-gray-500">{item.data}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.detalhes}</p>
                      <p className="text-xs text-gray-500 mt-1">por {item.usuario}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};