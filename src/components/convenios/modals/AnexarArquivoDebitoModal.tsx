import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import type { ArquivoDebito } from '../../../types/convenios';

interface AnexarArquivoDebitoModalProps {
  convenioId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (arquivo: Omit<ArquivoDebito, 'id' | 'createdAt'>) => Promise<void>;
}

export const AnexarArquivoDebitoModal: React.FC<AnexarArquivoDebitoModalProps> = ({
  convenioId,
  isOpen,
  onClose,
  onSave
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    nomeLayout: '',
    colunas: '',
    periodicidade: '',
    observacao: ''
  });

  const handleClose = () => {
    setFormData({
      nomeLayout: '',
      colunas: '',
      periodicidade: '',
      observacao: ''
    });
    setSelectedFile(null);
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeLayout.trim()) {
      newErrors.nomeLayout = 'Nome do layout é obrigatório';
    }

    if (!selectedFile) {
      newErrors.arquivo = 'Selecione um arquivo para anexar';
    }

    if (!formData.periodicidade) {
      newErrors.periodicidade = 'Periodicidade é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'text/plain', 'image/png'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setErrors({ ...errors, arquivo: '' });
      } else {
        setErrors({ ...errors, arquivo: 'Tipo de arquivo inválido. Use PDF, TXT ou PNG' });
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const arquivoData: Omit<ArquivoDebito, 'id' | 'createdAt'> = {
        convenioId,
        nomeLayout: formData.nomeLayout,
        colunas: formData.colunas,
        periodicidade: formData.periodicidade,
        observacao: formData.observacao
      };

      await onSave(arquivoData);
      handleClose();
    } catch (error) {
      console.error('Erro ao anexar arquivo:', error);
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

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Anexar Arquivo de Débito
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Arquivo
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  errors.arquivo
                    ? 'border-red-300 bg-red-50'
                    : selectedFile
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-blue-400 bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.txt,.png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  {selectedFile ? (
                    <div>
                      <p className="text-sm font-medium text-green-700">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        Clique para selecionar um arquivo
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Formatos aceitos: PDF, TXT ou PNG
                      </p>
                    </div>
                  )}
                </label>
              </div>
              {errors.arquivo && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="font-medium">!</span> {errors.arquivo}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Layout
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nomeLayout}
                  onChange={(e) => {
                    setFormData({ ...formData, nomeLayout: e.target.value });
                    setErrors({ ...errors, nomeLayout: '' });
                  }}
                  placeholder="Ex: Layout Folha Pagamento"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.nomeLayout ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.nomeLayout && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="font-medium">!</span> {errors.nomeLayout}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Periodicidade
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={formData.periodicidade}
                  onChange={(e) => {
                    setFormData({ ...formData, periodicidade: e.target.value });
                    setErrors({ ...errors, periodicidade: '' });
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.periodicidade ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="Diária">Diária</option>
                  <option value="Semanal">Semanal</option>
                  <option value="Quinzenal">Quinzenal</option>
                  <option value="Mensal">Mensal</option>
                  <option value="Bimestral">Bimestral</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                </select>
                {errors.periodicidade && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="font-medium">!</span> {errors.periodicidade}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Colunas do Layout
              </label>
              <input
                type="text"
                value={formData.colunas}
                onChange={(e) => setFormData({ ...formData, colunas: e.target.value })}
                placeholder="Ex: CPF, Nome, Matrícula, Valor"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Descreva as principais colunas do layout separadas por vírgula
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Observação
              </label>
              <textarea
                value={formData.observacao}
                onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                placeholder="Informações adicionais sobre o arquivo"
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
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
