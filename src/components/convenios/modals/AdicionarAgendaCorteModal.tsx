import React, { useState } from 'react';
import { X, Calendar, Loader2 } from 'lucide-react';
import type { AgendaCorte } from '../../../types/convenios';

interface AdicionarAgendaCorteModalProps {
  convenioId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (agenda: Omit<AgendaCorte, 'id' | 'createdAt'>) => Promise<void>;
}

export const AdicionarAgendaCorteModal: React.FC<AdicionarAgendaCorteModalProps> = ({
  convenioId,
  isOpen,
  onClose,
  onSave
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    dataCorte: '',
    mesPrimeiraParcela: ''
  });

  const handleClose = () => {
    setFormData({ dataCorte: '', mesPrimeiraParcela: '' });
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.dataCorte) {
      newErrors.dataCorte = 'Data de corte é obrigatória';
    }

    if (!formData.mesPrimeiraParcela) {
      newErrors.mesPrimeiraParcela = 'Mês de referência é obrigatório';
    }

    if (formData.dataCorte && formData.mesPrimeiraParcela) {
      const dataCorteDate = new Date(formData.dataCorte);
      const [ano, mes] = formData.mesPrimeiraParcela.split('-').map(Number);
      const mesReferenciaDate = new Date(ano, mes - 1, 1);

      if (mesReferenciaDate < new Date(dataCorteDate.getFullYear(), dataCorteDate.getMonth(), 1)) {
        newErrors.mesPrimeiraParcela = 'Mês de referência não pode ser anterior ao mês da data de corte';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const dataCorteDate = new Date(formData.dataCorte);
      const diaCorte = dataCorteDate.getDate();
      const [ano, mes] = formData.mesPrimeiraParcela.split('-').map(Number);

      const dataInicio = new Date(dataCorteDate.getFullYear(), dataCorteDate.getMonth(), diaCorte);
      const dataFim = new Date(ano, mes - 1, diaCorte - 1);

      if (dataFim < dataInicio) {
        dataFim.setMonth(dataFim.getMonth() + 12);
      }

      const agendaData: Omit<AgendaCorte, 'id' | 'createdAt'> = {
        convenioId,
        dataInicio: dataInicio.toISOString(),
        dataFim: dataFim.toISOString(),
        observacao: `Agenda de corte - Dia ${diaCorte} - Mês primeira parcela: ${formData.mesPrimeiraParcela}`,
        status: 'ativo'
      };

      await onSave(agendaData);
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar agenda:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Adicionar Nova Data de Corte
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Data de Corte
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dataCorte}
                onChange={(e) => {
                  setFormData({ ...formData, dataCorte: e.target.value });
                  setErrors({ ...errors, dataCorte: '' });
                }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.dataCorte ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.dataCorte && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="font-medium">!</span> {errors.dataCorte}
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-500">
                Selecione a data em que ocorrerá o corte
              </p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Mês de Referência (Mês Primeira Parcela)
                <span className="text-red-500">*</span>
              </label>
              <input
                type="month"
                value={formData.mesPrimeiraParcela}
                onChange={(e) => {
                  setFormData({ ...formData, mesPrimeiraParcela: e.target.value });
                  setErrors({ ...errors, mesPrimeiraParcela: '' });
                }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.mesPrimeiraParcela ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.mesPrimeiraParcela && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="font-medium">!</span> {errors.mesPrimeiraParcela}
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-500">
                Formato: AAAA/MM (ex: 2026/12)
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Atenção:</span> A agenda será criada automaticamente com base nos dados informados.
              O período de vigência será calculado do dia de corte até o último dia antes do próximo corte.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
