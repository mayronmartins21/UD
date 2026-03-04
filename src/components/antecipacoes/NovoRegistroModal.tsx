import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import type { RegistroAntecipacao } from '../../types/antecipacoes';

interface NovoRegistroModalProps {
  onClose: () => void;
  onSave: (registro: Partial<RegistroAntecipacao>) => void;
}

export const NovoRegistroModal: React.FC<NovoRegistroModalProps> = ({
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    tipo: '',
    convenio_id: '',
    cpf: '',
    operacao_id: '',
    parcelas_selecionadas: [] as number[],
    valor_recebido: '',
    data_recebimento: '',
    repasse_qista: false,
    data_repasse: '',
    observacoes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [anexos, setAnexos] = useState({
    boleto: null as File | null,
    comprovante_pagamento: null as File | null,
    planilha_calculo: null as File | null,
    comprovante_repasse: null as File | null
  });

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

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
    let formattedValue = value;

    switch (field) {
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'valor_recebido':
        formattedValue = formatCurrency(value);
        break;
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (tipo: keyof typeof anexos, file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      alert('Arquivo muito grande. Tamanho máximo: 10MB');
      return;
    }

    setAnexos(prev => ({ ...prev, [tipo]: file }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tipo) newErrors.tipo = 'Tipo é obrigatório';
    if (!formData.convenio_id) newErrors.convenio_id = 'Convênio é obrigatório';
    if (!formData.cpf || formData.cpf.length < 14) newErrors.cpf = 'CPF inválido';
    if (!formData.operacao_id) newErrors.operacao_id = 'Operação é obrigatória';
    if (!formData.valor_recebido) newErrors.valor_recebido = 'Valor é obrigatório';
    if (!formData.data_recebimento) newErrors.data_recebimento = 'Data de recebimento é obrigatória';

    if (formData.tipo === 'Antecipacao' && formData.parcelas_selecionadas.length === 0) {
      newErrors.parcelas_selecionadas = 'Selecione as parcelas para antecipação';
    }

    if (formData.repasse_qista && !formData.data_repasse) {
      newErrors.data_repasse = 'Data de repasse é obrigatória quando repasse à Fundo está marcado';
    }

    if (formData.repasse_qista && !anexos.comprovante_repasse) {
      newErrors.comprovante_repasse = 'Comprovante de repasse é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const registro: Partial<RegistroAntecipacao> = {
      tipo: formData.tipo as any,
      convenio_id: formData.convenio_id,
      cpf: formData.cpf,
      operacao_id: formData.operacao_id,
      parcelas_antecipadas: formData.tipo === 'Quitacao' ? '—' : 
        formData.parcelas_selecionadas.length > 0 ? 
        `${Math.min(...formData.parcelas_selecionadas)}-${Math.max(...formData.parcelas_selecionadas)}/60` : '',
      valor_recebido: parseFloat(formData.valor_recebido.replace(/[^\d,]/g, '').replace(',', '.')),
      data_recebimento: formData.data_recebimento,
      repasse_qista: formData.repasse_qista,
      data_repasse: formData.data_repasse,
      status: formData.repasse_qista && formData.data_repasse ? 'RepassadoFundo' : 
              formData.repasse_qista ? 'RepassePendente' : 'Pago',
      observacoes: formData.observacoes,
      anexos: {
        boleto: !!anexos.boleto,
        comprovante_pagamento: !!anexos.comprovante_pagamento,
        planilha_calculo: !!anexos.planilha_calculo
      }
    };

    onSave(registro);
  };

  // Mock de parcelas disponíveis para antecipação (últimas parcelas)
  const parcelasDisponiveis = Array.from({ length: 10 }, (_, i) => 51 + i); // 51-60

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Novo Registro</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Tipo e Convênio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.tipo ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.tipo}
                onChange={(e) => handleInputChange('tipo', e.target.value)}
              >
                <option value="">Selecione o tipo</option>
                <option value="Antecipacao">Antecipação</option>
                <option value="Quitacao">Quitação</option>
              </select>
              {errors.tipo && <p className="text-red-600 text-sm mt-1">{errors.tipo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Convênio *
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.convenio_id ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.convenio_id}
                onChange={(e) => handleInputChange('convenio_id', e.target.value)}
              >
                <option value="">Selecione um convênio</option>
                <option value="1">Governo de Goiás</option>
                <option value="2">Governo do Maranhão</option>
                <option value="3">Governo do Paraná</option>
                <option value="4">Prefeitura de Sorocaba</option>
                <option value="7">Prefeitura do Rio de Janeiro</option>
              </select>
              {errors.convenio_id && <p className="text-red-600 text-sm mt-1">{errors.convenio_id}</p>}
            </div>
          </div>

          {/* CPF e Operação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cpf ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {errors.cpf && <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operação/Contrato *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.operacao_id ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.operacao_id}
                onChange={(e) => handleInputChange('operacao_id', e.target.value)}
                placeholder="OP123456"
              />
              {errors.operacao_id && <p className="text-red-600 text-sm mt-1">{errors.operacao_id}</p>}
            </div>
          </div>

          {/* Parcelas (apenas para Antecipação) */}
          {formData.tipo === 'Antecipacao' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parcelas para Antecipação *
              </label>
              <div className="grid grid-cols-5 gap-2">
                {parcelasDisponiveis.map(parcela => (
                  <label key={parcela} className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={formData.parcelas_selecionadas.includes(parcela)}
                      onChange={(e) => {
                        const parcelas = e.target.checked
                          ? [...formData.parcelas_selecionadas, parcela]
                          : formData.parcelas_selecionadas.filter(p => p !== parcela);
                        handleInputChange('parcelas_selecionadas', parcelas);
                      }}
                    />
                    <span className="ml-2 text-sm text-gray-700">{parcela}</span>
                  </label>
                ))}
              </div>
              {errors.parcelas_selecionadas && (
                <p className="text-red-600 text-sm mt-1">{errors.parcelas_selecionadas}</p>
              )}
            </div>
          )}

          {/* Valor e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Recebido *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.valor_recebido ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.valor_recebido}
                onChange={(e) => handleInputChange('valor_recebido', e.target.value)}
                placeholder="R$ 0,00"
              />
              {errors.valor_recebido && <p className="text-red-600 text-sm mt-1">{errors.valor_recebido}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Recebimento *
              </label>
              <input
                type="date"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.data_recebimento ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.data_recebimento}
                onChange={(e) => handleInputChange('data_recebimento', e.target.value)}
              />
              {errors.data_recebimento && <p className="text-red-600 text-sm mt-1">{errors.data_recebimento}</p>}
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
              <span className="ml-2 text-sm font-medium text-gray-700">Repasse à Fundo?</span>
            </label>
          </div>

          {/* Data de Repasse (se repasse marcado) */}
          {formData.repasse_qista && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Repasse *
              </label>
              <input
                type="date"
                className={`w-full max-w-xs px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.data_repasse ? 'border-red-300' : 'border-gray-300'
                }`}
                value={formData.data_repasse}
                onChange={(e) => handleInputChange('data_repasse', e.target.value)}
              />
              {errors.data_repasse && <p className="text-red-600 text-sm mt-1">{errors.data_repasse}</p>}
            </div>
          )}

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
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Anexos */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Anexos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Boleto (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload('boleto', e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comprovante de Pagamento (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload('comprovante_pagamento', e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planilha de Cálculo (PDF/XLSX)
                </label>
                <input
                  type="file"
                  accept=".pdf,.xlsx"
                  onChange={(e) => handleFileUpload('planilha_calculo', e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {formData.repasse_qista && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comprovante de Repasse * (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload('comprovante_repasse', e.target.files?.[0] || null)}
                    className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                      errors.comprovante_repasse ? 'border border-red-300 rounded-md' : ''
                    }`}
                  />
                  {errors.comprovante_repasse && (
                    <p className="text-red-600 text-sm mt-1">{errors.comprovante_repasse}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
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
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};