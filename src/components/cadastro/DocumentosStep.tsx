import React, { useState } from 'react';
import { Upload, FileText, Check, X, Trash2, Eye } from 'lucide-react';
import type { DocumentoData } from './CadastroClienteTab';

interface DocumentosStepProps {
  documentos: DocumentoData[];
  onChange: (documentos: DocumentoData[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const DocumentosStep: React.FC<DocumentosStepProps> = ({
  documentos,
  onChange,
  onNext,
  onPrevious
}) => {
  const [dragOver, setDragOver] = useState<string | null>(null);

  const documentosObrigatorios = [
    { tipo: 'rg_frente', nome: 'RG/CNH - Frente', aceita: 'PDF, JPG, PNG' },
    { tipo: 'rg_verso', nome: 'RG/CNH - Verso', aceita: 'PDF, JPG, PNG' },
    { tipo: 'contracheque', nome: 'Contracheque Atual', aceita: 'PDF, JPG, PNG' }
  ];

  const documentosOpcionais = [
    { tipo: 'comprovante_reserva', nome: 'Comprovante de Reserva', aceita: 'PDF, JPG, PNG' }
  ];

  const handleFileUpload = (tipo: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Tamanho máximo: 5MB');
      return;
    }

    // Validar tipo
    const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!tiposPermitidos.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Use PDF, JPG ou PNG');
      return;
    }

    const novoDocumento: DocumentoData = {
      id: Date.now().toString(),
      tipo: tipo as any,
      nome: file.name,
      arquivo: file,
      status: 'uploading'
    };

    // Remover documento anterior do mesmo tipo
    const documentosAtualizados = documentos.filter(doc => doc.tipo !== tipo);
    documentosAtualizados.push(novoDocumento);
    onChange(documentosAtualizados);

    // Simular upload
    setTimeout(() => {
      const documentosComStatus = documentosAtualizados.map(doc => 
        doc.id === novoDocumento.id 
          ? { ...doc, status: 'success' as const, url: URL.createObjectURL(file) }
          : doc
      );
      onChange(documentosComStatus);
    }, 2000);
  };

  const handleRemoveDocument = (id: string) => {
    const documentosAtualizados = documentos.filter(doc => doc.id !== id);
    onChange(documentosAtualizados);
  };

  const handlePreview = (documento: DocumentoData) => {
    if (documento.url) {
      window.open(documento.url, '_blank');
    }
  };

  const getDocumento = (tipo: string) => {
    return documentos.find(doc => doc.tipo === tipo);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'success':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'error':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'border-blue-300 bg-blue-50';
      case 'success':
        return 'border-green-300 bg-green-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const isFormValid = () => {
    // Permitir avanço sem documentos obrigatórios
    return true;
  };

  const renderUploadArea = (docConfig: any, isOptional = false) => {
    const documento = getDocumento(docConfig.tipo);
    const isDragOver = dragOver === docConfig.tipo;

    return (
      <div
        key={docConfig.tipo}
        className={`border-2 border-dashed rounded-lg p-6 transition-all ${
          isDragOver ? 'border-blue-400 bg-blue-50' : 
          documento ? getStatusColor(documento.status) : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(docConfig.tipo);
        }}
        onDragLeave={() => setDragOver(null)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(null);
          handleFileUpload(docConfig.tipo, e.dataTransfer.files);
        }}
      >
        <div className="text-center">
          {documento ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <FileText className="w-8 h-8 text-blue-600 mr-2" />
                {getStatusIcon(documento.status)}
              </div>
              
              <div>
                <p className="font-medium text-gray-900">{documento.nome}</p>
                <p className="text-sm text-gray-500">
                  {documento.status === 'uploading' && 'Enviando...'}
                  {documento.status === 'success' && '✅ Enviado com sucesso'}
                  {documento.status === 'error' && '❌ Erro no envio'}
                </p>
              </div>

              {documento.status === 'success' && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handlePreview(documento)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Visualizar
                  </button>
                  <button
                    onClick={() => handleRemoveDocument(documento.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remover
                  </button>
                </div>
              )}

              {documento.status !== 'uploading' && (
                <label className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Substituir Arquivo
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(docConfig.tipo, e.target.files)}
                  />
                </label>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <h4 className="font-medium text-gray-900">
                  {docConfig.nome} {!isOptional && '*'}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  Arraste e solte ou clique para selecionar
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {docConfig.aceita} • Máximo 5MB
                </p>
              </div>
              
              <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Selecionar Arquivo
                <input
                  type="file"
                  className="sr-only"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(docConfig.tipo, e.target.files)}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Inclusão de Documentos</h3>
        <p className="text-gray-600">Faça o upload dos documentos necessários para formalização</p>
      </div>

      <div className="space-y-8">
        {/* Documentos Obrigatórios */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-blue-200">
            Documentos Obrigatórios
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentosObrigatorios.map(doc => renderUploadArea(doc, false))}
          </div>
        </div>

        {/* Documentos Opcionais */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Documentos Opcionais
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentosOpcionais.map(doc => renderUploadArea(doc, true))}
          </div>
        </div>

        {/* Resumo dos Documentos */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-3">Resumo dos Documentos</h4>
          <div className="space-y-2">
            {documentosObrigatorios.map(doc => {
              const documento = getDocumento(doc.tipo);
              return (
                <div key={doc.tipo} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{doc.nome}</span>
                  <span className={`text-sm font-medium ${
                    documento && documento.status === 'success' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {documento && documento.status === 'success' ? '✅ Enviado' : '❌ Pendente'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onPrevious}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
        >
          Voltar
        </button>
        
        <button
          onClick={onNext}
          disabled={!isFormValid()}
          className={`px-6 py-3 rounded-md font-medium transition-all ${
            isFormValid()
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Próximo: Reserva
        </button>
      </div>
    </div>
  );
};