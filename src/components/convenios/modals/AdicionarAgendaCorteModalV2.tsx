import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AgendaCorte } from '../../../types/convenios';

interface AdicionarAgendaCorteModalV2Props {
  convenioId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (agenda: Omit<AgendaCorte, 'id' | 'createdAt'>) => Promise<void>;
  existingAgendas: AgendaCorte[];
}

export const AdicionarAgendaCorteModalV2: React.FC<AdicionarAgendaCorteModalV2Props> = ({
  convenioId,
  isOpen,
  onClose,
  onSave,
  existingAgendas
}) => {
  const [formData, setFormData] = useState({
    dataCorte: '',
    mesPrimeiraParcela: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedAgendas = [...existingAgendas].sort((a, b) => {
    const dateA = new Date(a.dataInicio);
    const dateB = new Date(b.dataInicio);
    return dateB.getTime() - dateA.getTime();
  });

  const totalPages = Math.ceil(sortedAgendas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAgendas = sortedAgendas.slice(startIndex, endIndex);

  const handleClose = () => {
    setFormData({ dataCorte: '', mesPrimeiraParcela: '' });
    setCurrentPage(1);
    onClose();
  };

  const handleSalvar = async () => {
    if (!formData.dataCorte || !formData.mesPrimeiraParcela) {
      return;
    }

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
    setFormData({ dataCorte: '', mesPrimeiraParcela: '' });
  };

  const formatAnoMes = (dataIso: string) => {
    const date = new Date(dataIso);
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    return `${ano}/${mes}`;
  };

  const getDiaCorte = (dataIso: string) => {
    const date = new Date(dataIso);
    return date.getDate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Agenda de cortes
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 mb-6">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Ano/Mês ↑↓
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Dia Corte ↑↓
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Data Inicial ↑↓
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Data Final ↑↓
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Mês Primeira Parcela ↑↓
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedAgendas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                      Nenhuma agenda de corte cadastrada
                    </td>
                  </tr>
                ) : (
                  paginatedAgendas.map((agenda) => (
                    <tr key={agenda.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatAnoMes(agenda.dataInicio)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {getDiaCorte(agenda.dataInicio)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(agenda.dataInicio).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(agenda.dataFim).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatAnoMes(agenda.dataFim)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {sortedAgendas.length > 0 && (
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <ChevronLeft className="w-4 h-4 -ml-3" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-sm rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {totalPages > 4 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className={`px-3 py-1.5 text-sm rounded ${
                        currentPage === totalPages
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                  <ChevronRight className="w-4 h-4 -ml-3" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Apresenta 1 a {Math.min(itemsPerPage, sortedAgendas.length)} de {sortedAgendas.length} registros
                </span>
                <select
                  value={itemsPerPage}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Cadastrar nova data de corte
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="date"
                  value={formData.dataCorte}
                  onChange={(e) => setFormData({ ...formData, dataCorte: e.target.value })}
                  placeholder="Data de Corte"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="month"
                  value={formData.mesPrimeiraParcela}
                  onChange={(e) => setFormData({ ...formData, mesPrimeiraParcela: e.target.value })}
                  placeholder="Mês Primeira Parcela"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleSalvar}
              disabled={!formData.dataCorte || !formData.mesPrimeiraParcela}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
