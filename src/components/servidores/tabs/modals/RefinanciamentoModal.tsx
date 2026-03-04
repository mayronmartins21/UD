import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface RefinanciamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
  numeroProposta: string;
  quantidadeParcelas: number;
  saldoDevedor: number;
}

export const RefinanciamentoModal: React.FC<RefinanciamentoModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  numeroProposta,
  quantidadeParcelas,
  saldoDevedor
}) => {
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');

  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleConfirm = () => {
    if (!motivo.trim()) {
      setErro('O motivo é obrigatório');
      return;
    }
    onConfirm(motivo);
    setMotivo('');
    setErro('');
    onClose();
  };

  const handleClose = () => {
    setMotivo('');
    setErro('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleClose} />

        <div className="relative inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Refinanciar Operação
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Você está prestes a refinanciar a operação <strong>{numeroProposta}</strong> com {quantidadeParcelas} parcelas restantes.
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-orange-800 mb-2">
                  <strong>Saldo devedor:</strong> {formatCurrency(saldoDevedor)}
                </p>
                <p className="text-xs text-orange-800">
                  Esta ação irá quitar todas as parcelas pendentes e criar uma nova operação de crédito com o valor refinanciado.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
              Motivo do Refinanciamento <span className="text-red-500">*</span>
            </label>
            <textarea
              id="motivo"
              rows={4}
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value);
                setErro('');
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                erro ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ex: Solicitação do cliente para redução da parcela mensal"
            />
            {erro && (
              <p className="mt-1 text-sm text-red-600">{erro}</p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              Confirmar Refinanciamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
