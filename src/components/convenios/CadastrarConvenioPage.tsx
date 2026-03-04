import React, { useState } from 'react';
import { ArrowLeft, Save, Info } from 'lucide-react';
import type { ConvenioCompleto, Convenio } from '../../types/convenios';
import { InformacoesConvenioTab } from './tabs/InformacoesConvenioTab';
import { ContatosTab } from './tabs/ContatosTab';
import { ParametrizacoesTab } from './tabs/ParametrizacoesTab';
import { DecretosTab } from './tabs/DecretosTab';
import { RoteiroOperacionalTab } from './tabs/RoteiroOperacionalTab';

interface CadastrarConvenioPageProps {
  onVoltar: () => void;
  onSalvar: (convenio: Partial<ConvenioCompleto>) => void;
}

type TabType = 'informacoes' | 'contatos' | 'parametrizacoes' | 'decretos' | 'roteiro';

export const CadastrarConvenioPage: React.FC<CadastrarConvenioPageProps> = ({
  onVoltar,
  onSalvar
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('informacoes');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<ConvenioCompleto>>({
    processadora: '',
    razaoSocial: '',
    nomeFantasia: '',
    cnpj: '',
    tempoMargem: 30,
    diasProposta: 15,
    percentualRecolhimento: 0,
    diaRepasse: 1,
    diaCorte: 1,
    status: 'ativo',
    agendasCorte: [],
    arquivosDebito: [],
    contatos: [],
    prazos: [],
    decretos: [],
    roteirosOperacionais: [],
    parametrizacao: {
      id: '',
      convenioId: '',
      utilizaTokenConsulta: false,
      utilizaTokenAverbacao: false,
      utilizaSenhaConsignacao: false,
      ehEstabelecimento: false,
      cartaoComprasLiberado: false,
      atendimento: '',
      realizaOfertaSaqueFacil: false,
      cartaoSaqueFacilLiberado: false,
      categoriasCartaoCompras: [],
      categoriasSaqueFacil: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });

  const tabs = [
    { id: 'informacoes' as TabType, label: 'Informações do Convênio' },
    { id: 'contatos' as TabType, label: 'Contatos' },
    { id: 'parametrizacoes' as TabType, label: 'Parametrizações' },
    { id: 'decretos' as TabType, label: 'Decretos' },
    { id: 'roteiro' as TabType, label: 'Roteiro Operacional' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.processadora) {
      newErrors.processadora = 'Processadora é obrigatória';
    }

    if (!formData.razaoSocial || formData.razaoSocial.trim() === '') {
      newErrors.razaoSocial = 'Razão Social é obrigatória';
    }

    if (!formData.nomeFantasia || formData.nomeFantasia.trim() === '') {
      newErrors.nomeFantasia = 'Nome Fantasia é obrigatório';
    }

    if (!formData.cnpj || formData.cnpj.trim() === '') {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (formData.cnpj.replace(/\D/g, '').length !== 14) {
      newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
    }

    if (!formData.diaCorte || formData.diaCorte < 1 || formData.diaCorte > 31) {
      newErrors.diaCorte = 'Dia de corte deve ser entre 1 e 31';
    }

    if (!formData.diaRepasse || formData.diaRepasse < 1 || formData.diaRepasse > 31) {
      newErrors.diaRepasse = 'Dia de repasse deve ser entre 1 e 31';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = () => {
    if (!validateForm()) {
      setActiveTab('informacoes');
      return;
    }

    onSalvar(formData);
  };

  const handleUpdateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const convenioTemp: ConvenioCompleto = {
    id: 'temp',
    processadora: formData.processadora || '',
    razaoSocial: formData.razaoSocial || '',
    nomeFantasia: formData.nomeFantasia || '',
    cnpj: formData.cnpj || '',
    tempoMargem: formData.tempoMargem || 30,
    diasProposta: formData.diasProposta || 15,
    percentualRecolhimento: formData.percentualRecolhimento || 0,
    diaRepasse: formData.diaRepasse || 1,
    diaCorte: formData.diaCorte || 1,
    status: formData.status || 'ativo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    agendasCorte: formData.agendasCorte || [],
    arquivosDebito: formData.arquivosDebito || [],
    contatos: formData.contatos || [],
    parametrizacao: formData.parametrizacao,
    prazos: formData.prazos || [],
    decretos: formData.decretos || [],
    roteirosOperacionais: formData.roteirosOperacionais || []
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'informacoes':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Dados Principais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Processadora <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.processadora}
                    onChange={(e) => handleUpdateFormData('processadora', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.processadora ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione</option>
                    <option value="Digimais">Digimais</option>
                    <option value="Consignet">Consignet</option>
                    <option value="Facta">Facta</option>
                    <option value="Zetrasoft">Zetrasoft</option>
                  </select>
                  {errors.processadora && (
                    <p className="text-xs text-red-500 mt-1">{errors.processadora}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razão Social <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.razaoSocial}
                    onChange={(e) => handleUpdateFormData('razaoSocial', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.razaoSocial ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Digite a razão social"
                  />
                  {errors.razaoSocial && (
                    <p className="text-xs text-red-500 mt-1">{errors.razaoSocial}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Fantasia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nomeFantasia}
                    onChange={(e) => handleUpdateFormData('nomeFantasia', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.nomeFantasia ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Digite o nome fantasia"
                  />
                  {errors.nomeFantasia && (
                    <p className="text-xs text-red-500 mt-1">{errors.nomeFantasia}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 14) {
                        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
                        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
                        value = value.replace(/(\d{4})(\d)/, '$1-$2');
                        handleUpdateFormData('cnpj', value);
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
                      errors.cnpj ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                  />
                  {errors.cnpj && (
                    <p className="text-xs text-red-500 mt-1">{errors.cnpj}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    Tempo de Reserva de Margem
                    <div className="relative group">
                      <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                        em dias corridos
                      </div>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.tempoMargem}
                    onChange={(e) => handleUpdateFormData('tempoMargem', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    Tempo de Proposta Válida
                    <div className="relative group">
                      <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                        tempo de proposta válida para assinatura
                      </div>
                    </div>
                  </label>
                  <input
                    type="number"
                    value={formData.diasProposta}
                    onChange={(e) => handleUpdateFormData('diasProposta', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    % do Recolhimento
                  </label>
                  <input
                    type="number"
                    value={formData.percentualRecolhimento}
                    onChange={(e) => handleUpdateFormData('percentualRecolhimento', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dia de Repasse <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.diaRepasse}
                    onChange={(e) => handleUpdateFormData('diaRepasse', parseInt(e.target.value) || 1)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.diaRepasse ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1"
                    max="31"
                  />
                  {errors.diaRepasse && (
                    <p className="text-xs text-red-500 mt-1">{errors.diaRepasse}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dia de Corte <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.diaCorte}
                    onChange={(e) => handleUpdateFormData('diaCorte', parseInt(e.target.value) || 1)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.diaCorte ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1"
                    max="31"
                  />
                  {errors.diaCorte && (
                    <p className="text-xs text-red-500 mt-1">{errors.diaCorte}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleUpdateFormData('status', e.target.value as 'ativo' | 'inativo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contatos':
        return <ContatosTab convenio={convenioTemp} modoEdicao={true} />;
      case 'parametrizacoes':
        return <ParametrizacoesTab convenio={convenioTemp} modoEdicao={true} />;
      case 'decretos':
        return <DecretosTab convenio={convenioTemp} modoEdicao={true} />;
      case 'roteiro':
        return <RoteiroOperacionalTab convenio={convenioTemp} modoEdicao={true} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onVoltar}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Convênio - Cadastrar
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Preencha os dados para cadastrar um novo convênio
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSalvar}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              Salvar
            </button>
            <button
              onClick={onVoltar}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 text-sm font-medium text-center border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};
