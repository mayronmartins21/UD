import React from 'react';
import { Save, X, AlertCircle } from 'lucide-react';

interface SalvarProgressoModalProps {
  isOpen: boolean;
  onSalvar: () => void;
  onDescartar: () => void;
  onCancelar: () => void;
  etapaAtual: string;
}

export function SalvarProgressoModal({
  isOpen,
  onSalvar,
  onDescartar,
  onCancelar,
  etapaAtual
}: SalvarProgressoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="text-orange-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Salvar Progresso?</h2>
          </div>
          <button
            onClick={onCancelar}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Você está saindo do Formalizador com uma proposta em andamento.
          </p>

          <p className="text-sm text-gray-600">
            Deseja salvar o progresso desta proposta para retomar mais tarde?
          </p>
        </div>

        <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <button
            onClick={onDescartar}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Descartar
          </button>
          <button
            onClick={onCancelar}
            className="flex-1 px-4 py-2.5 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            Continuar Editando
          </button>
          <button
            onClick={onSalvar}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Salvar e Sair
          </button>
        </div>
      </div>
    </div>
  );
}
