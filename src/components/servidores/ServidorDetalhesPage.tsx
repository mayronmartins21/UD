import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { ServidorCompleto } from '../../types/servidores';
import { DadosPessoaisTab } from './tabs/DadosPessoaisTab';
import { BeneficioSaqueTab } from './tabs/BeneficioSaqueTab';
import { CartaoComprasTab } from './tabs/CartaoComprasTab';
import { PlanosTab } from './tabs/PlanosTab';
import { DocumentosTab } from './tabs/DocumentosTab';

interface ServidorDetalhesPageProps {
  servidor: ServidorCompleto;
  onVoltar: () => void;
}

type Tab = 'dados-pessoais' | 'beneficio-saque' | 'cartao-compras' | 'planos' | 'documentos';

export const ServidorDetalhesPage: React.FC<ServidorDetalhesPageProps> = ({
  servidor,
  onVoltar
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dados-pessoais');

  const tabs = [
    { id: 'dados-pessoais', label: 'Dados Pessoais' },
    { id: 'beneficio-saque', label: 'Benefício Saque' },
    { id: 'cartao-compras', label: 'Cartão Compras' },
    { id: 'planos', label: 'Planos' },
    { id: 'documentos', label: 'Documentos Pessoais' }
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onVoltar}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para lista
        </button>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{servidor.nome}</h2>
          <p className="text-blue-100 text-sm mt-1">
            {servidor.cpf} • {servidor.matricula}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6">
          <nav className="flex gap-6 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
          {activeTab === 'dados-pessoais' && <DadosPessoaisTab servidor={servidor} />}
          {activeTab === 'beneficio-saque' && <BeneficioSaqueTab servidor={servidor} />}
          {activeTab === 'cartao-compras' && <CartaoComprasTab servidor={servidor} />}
          {activeTab === 'planos' && <PlanosTab servidor={servidor} />}
          {activeTab === 'documentos' && <DocumentosTab servidor={servidor} />}
        </div>
      </div>
    </div>
  );
};
