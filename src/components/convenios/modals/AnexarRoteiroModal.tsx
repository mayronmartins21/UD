import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

interface RoteiroOperacional {
  id: string;
  convenioId: string;
  versao: string;
  dataVersao: string;
  responsavel: string;
  descricao: string;
  versaoAtual: boolean;
  createdAt: string;
}

interface AnexarRoteiroModalProps {
  convenioId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (roteiro: Omit<RoteiroOperacional, 'id' | 'createdAt'>) => Promise<void>;
}

export const AnexarRoteiroModal: React.FC<AnexarRoteiroModalProps> = ({
  convenioId,
  isOpen,
  onClose,
  onSave
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    versao: '',
    dataVersao: '',
    responsavel: '',
    descricao: '',
    versaoAtual: false
  });

  const handleClose = () => {
    setFormData({
      versao: '',
      dataVersao: '',
      responsavel: '',
      descricao: '',
      versaoAtual: false
    });
    setSelectedFile(null);
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.versao.trim()) {
      newErrors.versao = 'Versão é obrigatória';
    }

    if (!formData.dataVersao) {
      newErrors.dataVersao = 'Data da versão é obrigatória';
    }

    if (!formData.responsavel.trim()) {
      newErrors.responsavel = 'Responsável é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!selectedFile) {
      newErrors.arquivo = 'Selecione um arquivo para anexar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setErrors({ ...errors, arquivo: '' });
      } else {
        setErrors({ ...errors, arquivo: 'Tipo de arquivo inválido. Use PDF, PNG, JPG ou DOCX' });
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
      const roteiroData: Omit<RoteiroOperacional, 'id' | 'createdAt'> = {
        convenioId,
        versao: formData.versao,
        dataVersao: new Date(formData.dataVersao).toISOString(),
        responsavel: formData.responsavel,
        descricao: formData.descricao,
        versaoAtual: formData.versaoAtual
      };

      await onSave(roteiroData);
      handleClose();
    } catch (error) {
      console.error('Erro ao anexar roteiro:', error);
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

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            Anexar Roteiro Operacional
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
                Arquivo do Roteiro
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
                  id="roteiro-file-upload"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="roteiro-file-upload" className="cursor-pointer">
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
                        Formatos aceitos: PDF, PNG, JPG ou DOCX
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
                  Versão
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.versao}
                  onChange={(e) => {
                    setFormData({ ...formData, versao: e.target.value });
                    setErrors({ ...errors, versao: '' });
                  }}
                  placeholder="Ex: v1.0, v2.1, etc."
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.versao ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.versao && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="font-medium">!</span> {errors.versao}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data da Versão
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dataVersao}
                  onChange={(e) => {
                    setFormData({ ...formData, dataVersao: e.target.value });
                    setErrors({ ...errors, dataVersao: '' });
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.dataVersao ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.dataVersao && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="font-medium">!</span> {errors.dataVersao}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Responsável
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.responsavel}
                onChange={(e) => {
                  setFormData({ ...formData, responsavel: e.target.value });
                  setErrors({ ...errors, responsavel: '' });
                }}
                placeholder="Nome do responsável pela versão"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.responsavel ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.responsavel && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="font-medium">!</span> {errors.responsavel}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição das Alterações
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => {
                  setFormData({ ...formData, descricao: e.target.value });
                  setErrors({ ...errors, descricao: '' });
                }}
                placeholder="Descreva as principais alterações desta versão"
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.descricao ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.descricao && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="font-medium">!</span> {errors.descricao}
                </p>
              )}
            </div>

            <div className="flex items-center pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.versaoAtual}
                  onChange={(e) => setFormData({ ...formData, versaoAtual: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Marcar como Versão Atual
                </span>
              </label>
              <p className="ml-6 text-xs text-gray-500">
                Esta será a versão de referência do roteiro operacional
              </p>
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
