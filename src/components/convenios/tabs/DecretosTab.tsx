import React, { useState } from 'react';
import { Upload, Eye, RefreshCw, FileText, Star } from 'lucide-react';
import type { ConvenioCompleto } from '../../../types/convenios';
import { AnexarDecretoModal } from '../modals/AnexarDecretoModal';
import { Toast } from '../../common/Toast';

interface DecretosTabProps {
  convenio: ConvenioCompleto;
  modoEdicao: boolean;
  onUpdateConvenio?: (convenio: ConvenioCompleto) => void;
}

export const DecretosTab: React.FC<DecretosTabProps> = ({
  convenio,
  modoEdicao,
  onUpdateConvenio
}) => {
  const [showDecretoModal, setShowDecretoModal] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSaveDecreto = async (decretoData: any) => {
    try {
      const novoDecreto = {
        ...decretoData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };

      const convenioAtualizado = {
        ...convenio,
        decretos: [...convenio.decretos, novoDecreto]
      };

      if (onUpdateConvenio) {
        onUpdateConvenio(convenioAtualizado);
      }

      showToast('success', 'Decreto anexado com sucesso');
    } catch (error) {
      console.error('Erro ao anexar decreto:', error);
      showToast('error', 'Erro ao anexar decreto');
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <AnexarDecretoModal
        convenioId={convenio.id}
        isOpen={showDecretoModal}
        onClose={() => setShowDecretoModal(false)}
        onSave={handleSaveDecreto}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Decretos Vinculados
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Anexar documentos em PDF, PNG ou outros formatos
            </p>
          </div>
          <button
            onClick={() => setShowDecretoModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            Anexar
          </button>
        </div>

        {convenio.decretos.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum documento anexado
            </h4>
            <p className="text-gray-600">
              Anexe decretos que regulamentam este convênio
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Número
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Data Publicação
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Ementa
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                    Vigência
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {convenio.decretos.map((decreto) => (
                  <tr key={decreto.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {decreto.principal && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                        <span className="text-sm text-gray-900 font-medium">
                          {decreto.numero}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {new Date(decreto.dataPublicacao).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      <div className="max-w-md truncate" title={decreto.ementa}>
                        {decreto.ementa}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900 text-center">
                      {new Date(decreto.dataVigenciaInicio).toLocaleDateString('pt-BR')}
                      {decreto.dataVigenciaFim && (
                        <> até {new Date(decreto.dataVigenciaFim).toLocaleDateString('pt-BR')}</>
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          decreto.status === 'vigente'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {decreto.status === 'vigente' ? 'Vigente' : 'Revogado'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Substituir"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
