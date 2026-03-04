import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

interface Decreto {
  id: string;
  convenioId: string;
  numero: string;
  dataPublicacao: string;
  ementa: string;
  dataVigenciaInicio: string;
  dataVigenciaFim?: string;
  status: 'vigente' | 'revogado';
  principal: boolean;
  createdAt: string;
}

interface AnexarDecretoModalProps {
  convenioId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (decreto: Omit<Decreto, 'id' | 'createdAt'>) => Promise<void>;
}

export const AnexarDecretoModal: React.FC<AnexarDecretoModalProps> = ({
  convenioId,
  isOpen,
  onClose,
  onSave
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    numero: '',
    dataPublicacao: '',
    ementa: '',
    dataVigenciaInicio: '',
    dataVigenciaFim: '',
    status: 'vigente' as 'vigente' | 'revogado',
    principal: false
  });

  const handleClose = () => {
    setFormData({
      numero: '',
      dataPublicacao: '',
      ementa: '',
      dataVigenciaInicio: '',
      dataVigenciaFim: '',
      status: 'vigente',
      principal: false
    });
    setSelectedFile(null);
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.numero.trim()) {
      newErrors.numero = 'Número do decreto é obrigatório';
    }

    if (!formData.dataPublicacao) {
      newErrors.dataPublicacao = 'Data de publicação é obrigatória';
    }

    if (!formData.ementa.trim()) {
      newErrors.ementa = 'Ementa é obrigatória';
    }

    if (!formData.dataVigenciaInicio) {
      newErrors.dataVigenciaInicio = 'Data de início de vigência é obrigatória';
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
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        setErrors({ ...errors, arquivo: '' });
      } else {
        setErrors({ ...errors, arquivo: 'Tipo de arquivo inválido. Use PDF, PNG ou JPG' });
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
      const decretoData: Omit<Decreto, 'id' | 'createdAt'> = {
        convenioId,
        numero: formData.numero,
        dataPublicacao: new Date(formData.dataPublicacao).toISOString(),
        ementa: formData.ementa,
        dataVigenciaInicio: new Date(formData.dataVigenciaInicio).toISOString(),
        dataVigenciaFim: formData.dataVigenciaFim ? new Date(formData.dataVigenciaFim).toISOString() : undefined,
        status: formData.status,
        principal: formData.principal
      };

      await onSave(decretoData);
      handleClose();
    } catch (error) {
      console.error('Erro ao anexar decreto:', error);
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
            Anexar Decreto
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
                Arquivo do Decreto
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
                  id="decreto-file-upload"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="decreto-file-upload" className="cursor-pointer">
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
                        Formatos aceitos: PDF, PNG ou JPG
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
                  Número do Decreto
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => {
                    setFormData({ ...formData, numero: e.target.value });
                    setErrors({ ...errors, numero: '' });
                  }}
                  placeholder="Ex: 12345/2024"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.numero ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.numero && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="font-medium">!</span> {errors.numero}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data de Publicação
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dataPublicacao}
                  onChange={(e) => {
                    setFormData({ ...formData, dataPublicacao: e.target.value });
                    setErrors({ ...errors, dataPublicacao: '' });
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.dataPublicacao ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.dataPublicacao && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="font-medium">!</span> {errors.dataPublicacao}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ementa
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={formData.ementa}
                onChange={(e) => {
                  setFormData({ ...formData, ementa: e.target.value });
                  setErrors({ ...errors, ementa: '' });
                }}
                placeholder="Descreva o objeto do decreto"
                rows={3}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  errors.ementa ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.ementa && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <span className="font-medium">!</span> {errors.ementa}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data Início Vigência
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.dataVigenciaInicio}
                  onChange={(e) => {
                    setFormData({ ...formData, dataVigenciaInicio: e.target.value });
                    setErrors({ ...errors, dataVigenciaInicio: '' });
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.dataVigenciaInicio ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.dataVigenciaInicio && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="font-medium">!</span> {errors.dataVigenciaInicio}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data Fim Vigência
                </label>
                <input
                  type="date"
                  value={formData.dataVigenciaFim}
                  onChange={(e) => setFormData({ ...formData, dataVigenciaFim: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Deixe em branco se o decreto ainda estiver vigente
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'vigente' | 'revogado' })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="vigente">Vigente</option>
                  <option value="revogado">Revogado</option>
                </select>
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.principal}
                    onChange={(e) => setFormData({ ...formData, principal: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Marcar como Decreto Principal
                  </span>
                </label>
              </div>
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
