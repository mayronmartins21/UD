import React, { useState } from 'react';
import { ArrowLeft, Save, Edit2, FileSpreadsheet } from 'lucide-react';
import type { ConvenioCompleto } from '../../types/convenios';
import { InformacoesConvenioTab } from './tabs/InformacoesConvenioTab';
import { ContatosTab } from './tabs/ContatosTab';
import { ParametrizacoesTab } from './tabs/ParametrizacoesTab';
import { DecretosTab } from './tabs/DecretosTab';
import { RoteiroOperacionalTab } from './tabs/RoteiroOperacionalTab';

interface ConvenioDetalhesPageProps {
  convenio: ConvenioCompleto;
  modoEdicao: boolean;
  onVoltar: () => void;
  onAlterarModo: (modo: boolean) => void;
  onUpdateConvenio?: (convenio: ConvenioCompleto) => void;
}

type TabType = 'informacoes' | 'contatos' | 'parametrizacoes' | 'decretos' | 'roteiro';

export const ConvenioDetalhesPage: React.FC<ConvenioDetalhesPageProps> = ({
  convenio,
  modoEdicao,
  onVoltar,
  onAlterarModo,
  onUpdateConvenio
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('informacoes');

  const tabs = [
    { id: 'informacoes' as TabType, label: 'Informações do Convênio' },
    { id: 'contatos' as TabType, label: 'Contatos' },
    { id: 'parametrizacoes' as TabType, label: 'Parametrizações' },
    { id: 'decretos' as TabType, label: 'Decretos' },
    { id: 'roteiro' as TabType, label: 'Roteiro Operacional' }
  ];

  const handleSalvar = () => {
    console.log('Salvando convênio...');
    onAlterarModo(false);
  };

  const handleExportar = () => {
    console.log('Exportar convênio');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'informacoes':
        return (
          <InformacoesConvenioTab
            convenio={convenio}
            modoEdicao={modoEdicao}
            onUpdateConvenio={onUpdateConvenio}
          />
        );
      case 'contatos':
        return <ContatosTab convenio={convenio} modoEdicao={modoEdicao} />;
      case 'parametrizacoes':
        return (
          <ParametrizacoesTab
            convenio={convenio}
            modoEdicao={modoEdicao}
            onUpdateConvenio={onUpdateConvenio}
          />
        );
      case 'decretos':
        return (
          <DecretosTab
            convenio={convenio}
            modoEdicao={modoEdicao}
            onUpdateConvenio={onUpdateConvenio}
          />
        );
      case 'roteiro':
        return (
          <RoteiroOperacionalTab
            convenio={convenio}
            modoEdicao={modoEdicao}
            onUpdateConvenio={onUpdateConvenio}
          />
        );
      default:
        return (
          <InformacoesConvenioTab
            convenio={convenio}
            modoEdicao={modoEdicao}
            onUpdateConvenio={onUpdateConvenio}
          />
        );
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
                Convênio - {modoEdicao ? 'Alterar' : 'Visualizar'}
              </h2>
              <p className="text-sm text-gray-600 mt-0.5">
                {convenio.nomeFantasia}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {!modoEdicao && (
              <button
                onClick={() => onAlterarModo(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            )}
            {modoEdicao && (
              <button
                onClick={handleSalvar}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                Salvar
              </button>
            )}
            <button
              onClick={onVoltar}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Voltar
            </button>
            <button
              onClick={handleExportar}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar
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
