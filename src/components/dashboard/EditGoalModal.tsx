import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: number, month: number, year: number) => void;
  currentGoal?: number;
  currentMonth?: number;
  currentYear?: number;
}

export const EditGoalModal: React.FC<EditGoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentGoal,
  currentMonth,
  currentYear
}) => {
  const [value, setValue] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (isOpen) {
      if (currentGoal) {
        setValue(formatCurrencyInput(currentGoal));
      }
      if (currentMonth !== undefined) {
        setSelectedMonth(currentMonth);
      }
      if (currentYear !== undefined) {
        setSelectedYear(currentYear);
      }
    } else {
      setValue('');
      setSelectedMonth(new Date().getMonth());
      setSelectedYear(new Date().getFullYear());
    }
  }, [isOpen, currentGoal, currentMonth, currentYear]);

  const formatCurrencyInput = (num: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^\d]/g, '');

    if (inputValue === '') {
      setValue('');
      return;
    }

    const numValue = parseInt(inputValue) / 100;
    setValue(formatCurrencyInput(numValue));
  };

  const handleSave = () => {
    const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));

    if (!isNaN(numericValue) && numericValue > 0) {
      onSave(numericValue, selectedMonth, selectedYear);
      onClose();
    }
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const todayYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => todayYear - 1 + i);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Editar meta mensal</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent appearance-none bg-white text-gray-900"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent appearance-none bg-white text-gray-900"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selecione o mês e ano para definir a meta.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor da meta
            </label>
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="R$ 0,00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A73E8] focus:border-transparent text-lg"
            />
            <p className="text-xs text-gray-500 mt-2">
              Digite o valor da meta para o período selecionado.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-[#1A73E8] hover:bg-blue-700 rounded-lg transition-colors font-medium"
          >
            Salvar meta
          </button>
        </div>
      </div>
    </div>
  );
};
