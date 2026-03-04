import React, { useState } from 'react';
import { Upload, FileText, Check, X } from 'lucide-react';
import { convenios } from '../../data/mockData';

interface UploadStepperProps {
  onClose: () => void;
  onComplete: (file: any) => void;
}

interface UploadState {
  currentStep: number;
  selectedFile: File | null;
  convenio: string;
  competencia: string;
  produto: string;
  isProcessing: boolean;
}

export const UploadStepper: React.FC<UploadStepperProps> = ({ onClose, onComplete }) => {
  const [state, setState] = useState<UploadState>({
    currentStep: 1,
    selectedFile: null,
    convenio: '',
    competencia: '',
    produto: '',
    isProcessing: false
  });

  const steps = [
    { number: 1, title: 'Selecionar Arquivo', description: 'Escolha o arquivo e configurações' },
    { number: 2, title: 'Processar', description: 'Importar e validar dados' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setState(prev => ({ ...prev, selectedFile: file }));
      
      // Simular detecção de hash para verificar duplicidade
      setTimeout(() => {
        if (Math.random() > 0.8) {
          alert('Arquivo já foi importado anteriormente. Deseja reprocessar?');
        }
      }, 500);
    }
  };

  const handleNext = () => {
    if (state.currentStep === 1) {
      if (!state.selectedFile || !state.convenio || !state.produto) {
        alert('Por favor, selecione um arquivo, convênio e produto.');
        return;
      }
      
      // Iniciar processamento diretamente
      setState(prev => ({ ...prev, isProcessing: true, currentStep: 2 }));
      
      // Simular processamento
      setTimeout(() => {
        setState(prev => ({ ...prev, isProcessing: false }));
        
        setTimeout(() => {
          onComplete({
            nome_arquivo: state.selectedFile?.name,
            convenio_id: state.convenio,
            competencia_ref: state.competencia || '202501',
            produto: state.produto,
            status: 'Concluido'
          });
        }, 2000);
      }, 3000);
    }
  };

  const handleBack = () => {
    setState(prev => ({ ...prev, currentStep: Math.max(1, prev.currentStep - 1) }));
  };

  const getStepIcon = (step: number) => {
    if (step < state.currentStep) return <Check className="w-5 h-5 text-white" />;
    if (step === state.currentStep) return <span className="text-white font-semibold">{step}</span>;
    return <span className="text-gray-500 font-semibold">{step}</span>;
  };

  const getStepColor = (step: number) => {
    if (step < state.currentStep) return 'bg-green-600';
    if (step === state.currentStep) return 'bg-blue-600';
    return 'bg-gray-300';
  };

  const renderStepContent = () => {
    switch (state.currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Arquivo *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload de arquivo</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept=".csv,.txt,.xlsx"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  <p className="text-xs text-gray-500">CSV, TXT, Excel até 10MB</p>
                  {state.selectedFile && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-900">{state.selectedFile.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Convênio *</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={state.convenio}
                  onChange={(e) => setState(prev => ({ ...prev, convenio: e.target.value }))}
                >
                  <option value="">Selecione um convênio</option>
                  <option value="1">Governo de Goiás</option>
                  <option value="2">Governo do Maranhão</option>
                  <option value="3">Governo do Paraná</option>
                  <option value="4">Prefeitura de Sorocaba</option>
                  <option value="5">Prefeitura de Hortolândia</option>
                  <option value="6">Prefeitura de Santo André</option>
                  <option value="7">Prefeitura do Rio de Janeiro</option>
                  <option value="8">Prefeitura de Guarulhos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Produto *</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={state.produto}
                  onChange={(e) => setState(prev => ({ ...prev, produto: e.target.value }))}
                >
                  <option value="">Selecione um produto</option>
                  <option value="Saque">Saque</option>
                  <option value="Compras">Compras</option>
                  <option value="Antecipacao">Antecipação</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Competência (opcional)</label>
                <select
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={state.competencia}
                  onChange={(e) => setState(prev => ({ ...prev, competencia: e.target.value }))}
                >
                  <option value="">Detectar automaticamente</option>
                <option value="202501">01/2025</option>
                <option value="202502">02/2025</option>
                <option value="202503">03/2025</option>
                <option value="202504">04/2025</option>
                <option value="202505">05/2025</option>
                <option value="202506">06/2025</option>
                <option value="202507">07/2025</option>
                <option value="202508">08/2025</option>
                <option value="202509">09/2025</option>
                <option value="202510">10/2025</option>
                <option value="202511">11/2025</option>
                <option value="202512">12/2025</option>
              </select>
            </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {state.isProcessing ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg mb-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-blue-900 font-medium">Processando arquivo...</span>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>✓ Importando arquivo...</p>
                    <p>✓ Validando estrutura...</p>
                    <p className="text-blue-600">• Detectando layout automaticamente...</p>
                    <p className="text-gray-400">• Normalizando dados...</p>
                    <p className="text-gray-400">• Criando registros...</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Importação Concluída!</h3>
                <p className="text-gray-600 mb-4">
                  Arquivo processado com sucesso. Redirecionando para a listagem...
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                  <h4 className="font-medium text-gray-900 mb-2">Resumo:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Arquivo: {state.selectedFile?.name}</li>
                    <li>• Convênio: {convenios.find(c => c.id === state.convenio)?.nome}</li>
                    <li>• Produto: {state.produto}</li>
                    <li>• Competência: {state.competencia ? `${state.competencia.substring(4, 6)}/${state.competencia.substring(0, 4)}` : 'Detectada automaticamente'}</li>
                    <li>• Total de linhas: 3.520</li>
                    <li>• Linhas processadas: 3.515</li>
                    <li>• Layout detectado automaticamente</li>
                    <li>• Status: Concluído com sucesso</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Importar Arquivo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStepColor(step.number)}`}>
                    {getStepIcon(step.number)}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 mb-8 ${
                    step.number < state.currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={state.currentStep === 1 || state.isProcessing}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Voltar
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={state.isProcessing}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            
            {state.currentStep === 1 ? (
              <button
                onClick={handleNext}
                disabled={state.isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Processar
              </button>
            ) : (
              <button
                onClick={() => onComplete({ status: 'completed' })}
                disabled={state.isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Concluir
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};