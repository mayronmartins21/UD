import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Clock, X, Trash } from 'lucide-react';
import { FilterPanel } from '../common/FilterPanel';
import { StatusChip } from '../common/StatusChip';
import { UploadStepper } from './UploadStepper';
import { ConveniosExpectativa } from './ConveniosExpectativa';
import { arquivosRetorno, convenios, layouts } from '../../data/mockData';
import type { FiltroGeral } from '../../types';

export const UploadTab: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltroGeral>({});
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluido':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'ConcluidoComAlertas':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Processando':
        return <Clock className="w-4 h-4 text-blue-600 animate-pulse" />;
      case 'Falhou':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };


  const handleLogs = (arquivo: any) => {
    let logs = `Logs de processamento - ${arquivo.nome_arquivo}\n\n`;
    logs += `• Upload iniciado: ${new Date(arquivo.data_upload).toLocaleString()}\n`;
    logs += `• Layout detectado: ${layouts.find(l => l.id === arquivo.layout_id)?.nome}\n`;
    logs += `• Processamento: ${arquivo.linhas_processadas}/${arquivo.total_linhas} linhas\n`;
    
    if (arquivo.erros_validacao) {
      logs += `\nAlertas/Erros:\n${arquivo.erros_validacao}`;
    }
    
    alert(logs);
  };


  const handleDelete = (arquivo: any) => {
    if (confirm(`Excluir arquivo ${arquivo.nome_arquivo}?\nEsta ação não pode ser desfeita.`)) {
      alert('Funcionalidade de exclusão seria implementada aqui');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload de Arquivos</h2>
        <p className="text-gray-600">
          Importe arquivos de retorno/repasse das averbadoras para conciliação automática.
        </p>
      </div>

      <FilterPanel
        filtros={filtros}
        onFiltroChange={setFiltros}
        onReset={() => setFiltros({})}
        isUploadTab={true}
      />

      {/* Grade de Convênios com Expectativa */}
      <ConveniosExpectativa 
        competenciaSelecionada={filtros.competencia?.[0] || '202501'}
        onImportarArquivo={(convenio) => {
          // Pre-selecionar o convênio no modal de upload
          setShowUploadModal(true);
        }}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Arquivos Importados</h3>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Importar Arquivo
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Upload
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Competência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Convênio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Averbadora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Linhas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {arquivosRetorno.map((arquivo) => {
                const convenio = convenios.find(c => c.id === arquivo.convenio_id);
                return (
                  <tr key={arquivo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(arquivo.status_processamento)}
                        <div className="ml-3">
                          <div className="text-sm text-gray-900">
                            {new Date(arquivo.data_upload).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(arquivo.data_upload).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {arquivo.competencia_ref.substring(4, 6)}/{arquivo.competencia_ref.substring(0, 4)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{convenio?.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{arquivo.averbadora}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusChip status={arquivo.status_processamento} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {arquivo.linhas_processadas.toLocaleString()} / {arquivo.total_linhas.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatFileSize(arquivo.tamanho_bytes)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {arquivo.usuario_upload}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleLogs(arquivo)}
                          className="text-gray-600 hover:text-gray-800"
                          title="Logs"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(arquivo)}
                          className="text-red-600 hover:text-red-800"
                          title="Excluir"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showUploadModal && (
        <UploadStepper
          onClose={() => setShowUploadModal(false)}
          onComplete={(file) => {
            setSelectedFile(file);
            setShowUploadModal(false);
          }}
        />
      )}
    </div>
  );
};