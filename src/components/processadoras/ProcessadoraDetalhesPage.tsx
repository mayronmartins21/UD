import React, { useState } from 'react';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import type { Processadora, ProcessadoraFormData } from '../../types/processadoras';
import { processadoraService } from '../../lib/processadoraService';

interface ProcessadoraDetalhesPageProps {
  processadora: Processadora;
  onVoltar: () => void;
  onSalvar: (data: Partial<ProcessadoraFormData>) => void;
}

export const ProcessadoraDetalhesPage: React.FC<ProcessadoraDetalhesPageProps> = ({
  processadora,
  onVoltar,
  onSalvar
}) => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [formData, setFormData] = useState<ProcessadoraFormData>({
    cnpj: processadora.cnpj,
    nomeFantasia: processadora.nomeFantasia || '',
    razaoSocial: processadora.razaoSocial,
    status: processadora.status,
    responsavelNome: processadora.responsavelNome || '',
    responsavelEmail: processadora.responsavelEmail || '',
    responsavelCelular: processadora.responsavelCelular || ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUpdateField = (field: keyof ProcessadoraFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.cnpj) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (!processadoraService.validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido';
    }

    if (!formData.razaoSocial) {
      newErrors.razaoSocial = 'Razão social é obrigatória';
    }

    if (formData.responsavelEmail && !processadoraService.validateEmail(formData.responsavelEmail)) {
      newErrors.responsavelEmail = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = () => {
    if (validateForm()) {
      onSalvar(formData);
      setModoEdicao(false);
    }
  };

  const handleCancelar = () => {
    setFormData({
      cnpj: processadora.cnpj,
      nomeFantasia: processadora.nomeFantasia || '',
      razaoSocial: processadora.razaoSocial,
      status: processadora.status,
      responsavelNome: processadora.responsavelNome || '',
      responsavelEmail: processadora.responsavelEmail || '',
      responsavelCelular: processadora.responsavelCelular || ''
    });
    setErrors({});
    setModoEdicao(false);
  };

  const formatCNPJInput = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '');
    let formatted = cleaned;
    if (cleaned.length <= 14) {
      formatted = processadoraService.formatCNPJ(cleaned);
    }
    handleUpdateField('cnpj', formatted);
  };

  const formatPhoneInput = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '');
    let formatted = cleaned;
    if (cleaned.length <= 11) {
      formatted = processadoraService.formatPhone(cleaned);
    }
    handleUpdateField('responsavelCelular', formatted);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onVoltar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {modoEdicao ? 'Editar Processadora' : 'Detalhes da Processadora'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              ID: {processadora.id}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {modoEdicao ? (
            <>
              <button
                onClick={handleCancelar}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            </>
          ) : (
            <button
              onClick={() => setModoEdicao(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Dados Cadastrais
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ <span className="text-red-500">*</span>
            </label>
            {modoEdicao ? (
              <>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={(e) => formatCNPJInput(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
                    errors.cnpj ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
                {errors.cnpj && (
                  <p className="text-xs text-red-500 mt-1">{errors.cnpj}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-900 py-2 font-mono">{processadora.cnpj}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Fantasia
            </label>
            {modoEdicao ? (
              <input
                type="text"
                value={formData.nomeFantasia}
                onChange={(e) => handleUpdateField('nomeFantasia', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome fantasia"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">{processadora.nomeFantasia || '-'}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Razão Social <span className="text-red-500">*</span>
            </label>
            {modoEdicao ? (
              <>
                <input
                  type="text"
                  value={formData.razaoSocial}
                  onChange={(e) => handleUpdateField('razaoSocial', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.razaoSocial ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Razão social"
                />
                {errors.razaoSocial && (
                  <p className="text-xs text-red-500 mt-1">{errors.razaoSocial}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-900 py-2">{processadora.razaoSocial}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            {modoEdicao ? (
              <select
                value={formData.status}
                onChange={(e) => handleUpdateField('status', e.target.value as 'ativo' | 'inativo')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            ) : (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  processadora.status === 'ativo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {processadora.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Dados do Responsável
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            {modoEdicao ? (
              <input
                type="text"
                value={formData.responsavelNome}
                onChange={(e) => handleUpdateField('responsavelNome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nome completo"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">{processadora.responsavelNome || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            {modoEdicao ? (
              <>
                <input
                  type="email"
                  value={formData.responsavelEmail}
                  onChange={(e) => handleUpdateField('responsavelEmail', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.responsavelEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@exemplo.com"
                />
                {errors.responsavelEmail && (
                  <p className="text-xs text-red-500 mt-1">{errors.responsavelEmail}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-900 py-2">{processadora.responsavelEmail || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Celular
            </label>
            {modoEdicao ? (
              <input
                type="text"
                value={formData.responsavelCelular}
                onChange={(e) => formatPhoneInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            ) : (
              <p className="text-sm text-gray-900 py-2 font-mono">{processadora.responsavelCelular || '-'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
