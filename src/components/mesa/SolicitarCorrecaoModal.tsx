import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { EtapaCorrecao } from '../../types/propostas';

interface CorrecaoItem {
  etapa: EtapaCorrecao;
  comentario: string;
}

interface SolicitarCorrecaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmar: (correcoes: CorrecaoItem[]) => void;
  propostaNumero: string;
}

export function SolicitarCorrecaoModal({
  isOpen,
  onClose,
  onConfirmar,
  propostaNumero
}: SolicitarCorrecaoModalProps) {
  const [etapasSelecionadas, setEtapasSelecionadas] = useState<Record<EtapaCorrecao, boolean>>({
    cadastro: false,
    documentos: false,
    reserva: false
  });

  const [comentarios, setComentarios] = useState<Record<EtapaCorrecao, string>>({
    cadastro: '',
    documentos: '',
    reserva: ''
  });

  const etapasDisponiveis: { etapa: EtapaCorrecao; label: string }[] = [
    { etapa: 'cadastro', label: 'Cadastro' },
    { etapa: 'documentos', label: 'Documentos' },
    { etapa: 'reserva', label: 'Reserva' }
  ];

  const handleToggleEtapa = (etapa: EtapaCorrecao) => {
    setEtapasSelecionadas(prev => ({
      ...prev,
      [etapa]: !prev[etapa]
    }));
  };

  const handleComentarioChange = (etapa: EtapaCorrecao, valor: string) => {
    setComentarios(prev => ({
      ...prev,
      [etapa]: valor
    }));
  };

  const handleConfirmar = () => {
    const correcoes: CorrecaoItem[] = [];

    (Object.keys(etapasSelecionadas) as EtapaCorrecao[]).forEach(etapa => {
      if (etapasSelecionadas[etapa] && comentarios[etapa].trim()) {
        correcoes.push({
          etapa,
          comentario: comentarios[etapa].trim()
        });
      }
    });

    if (correcoes.length > 0) {
      onConfirmar(correcoes);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setEtapasSelecionadas({
      cadastro: false,
      documentos: false,
      reserva: false
    });
    setComentarios({
      cadastro: '',
      documentos: '',
      reserva: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const todasCorrecoesPreenchidasCorretamente = () => {
    return (Object.keys(etapasSelecionadas) as EtapaCorrecao[]).every(etapa => {
      if (etapasSelecionadas[etapa]) {
        return comentarios[etapa].trim().length > 0;
      }
      return true;
    });
  };

  const algumaEtapaSelecionada = Object.values(etapasSelecionadas).some(v => v);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Solicitar Correção</h2>
            <p className="text-sm text-gray-600 mt-1">Proposta: {propostaNumero}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-orange-900 font-medium">
                  Selecione as etapas que precisam de correção
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Para cada etapa selecionada, é obrigatório adicionar um comentário explicativo.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {etapasDisponiveis.map(({ etapa, label }) => (
              <div key={etapa} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`etapa-${etapa}`}
                    checked={etapasSelecionadas[etapa]}
                    onChange={() => handleToggleEtapa(etapa)}
                    className="mt-1 h-5 w-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`etapa-${etapa}`}
                      className="text-lg font-semibold text-gray-900 cursor-pointer block mb-3"
                    >
                      {label}
                    </label>

                    <div className={`transition-all ${etapasSelecionadas[etapa] ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comentário da correção {etapasSelecionadas[etapa] && <span className="text-red-600">*</span>}
                      </label>
                      <textarea
                        value={comentarios[etapa]}
                        onChange={(e) => handleComentarioChange(etapa, e.target.value)}
                        disabled={!etapasSelecionadas[etapa]}
                        placeholder={`Descreva detalhadamente o que precisa ser corrigido em ${label}...`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                        rows={3}
                      />
                      {etapasSelecionadas[etapa] && !comentarios[etapa].trim() && (
                        <p className="text-xs text-red-600 mt-1">
                          O comentário é obrigatório para etapas selecionadas
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {algumaEtapaSelecionada ? (
                <>
                  {Object.values(etapasSelecionadas).filter(v => v).length} {' '}
                  {Object.values(etapasSelecionadas).filter(v => v).length === 1 ? 'etapa selecionada' : 'etapas selecionadas'}
                </>
              ) : (
                'Nenhuma etapa selecionada'
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                disabled={!algumaEtapaSelecionada || !todasCorrecoesPreenchidasCorretamente()}
                className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Correção
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
