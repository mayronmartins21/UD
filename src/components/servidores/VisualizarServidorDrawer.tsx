import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { ServidorCompleto } from '../../types/servidores';
import { DadosPessoaisTab } from './tabs/DadosPessoaisTab';
import { BeneficioSaqueTab } from './tabs/BeneficioSaqueTab';
import { CartaoComprasTab } from './tabs/CartaoComprasTab';
import { PlanosTab } from './tabs/PlanosTab';
import { DocumentosTab } from './tabs/DocumentosTab';

interface VisualizarServidorDrawerProps {
  servidor: ServidorCompleto;
  onClose: () => void;
}

type Tab = 'dados-pessoais' | 'beneficio-saque' | 'cartao-compras' | 'planos' | 'documentos';

export const VisualizarServidorDrawer: React.FC<VisualizarServidorDrawerProps> = ({
  servidor,
  onClose
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative bg-white h-full w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col animate-slide-in">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{servidor.nome}</h2>
            <p className="text-blue-100 text-sm mt-0.5">
              {servidor.cpf} • {servidor.matricula}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="border-b border-gray-200 bg-white px-6">
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

        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {activeTab === 'dados-pessoais' && <DadosPessoaisTab servidor={servidor} />}
          {activeTab === 'beneficio-saque' && <BeneficioSaqueTab servidor={servidor} />}
          {activeTab === 'cartao-compras' && <CartaoComprasTab servidor={servidor} />}
          {activeTab === 'planos' && <PlanosTab servidor={servidor} />}
          {activeTab === 'documentos' && <DocumentosTab servidor={servidor} />}
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
