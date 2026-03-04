import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Eye, FileText } from 'lucide-react';
import type { AprovacaoData, ClienteData, ReservaData } from './CadastroClienteTab';

interface AprovacaoStepProps {
  data: AprovacaoData;
  onChange: (data: AprovacaoData) => void;
  clienteData: ClienteData;
  reservaData: ReservaData;
  onNext: () => void;
  onPrevious: () => void;
}

export const AprovacaoStep: React.FC<AprovacaoStepProps> = ({
  data,
  onChange,
  clienteData,
  reservaData,
  onNext,
  onPrevious
}) => {
  const [isEnviando, setIsEnviando] = useState(false);

  // Simular envio para aprovação quando a etapa é carregada pela primeira vez
  useEffect(() => {
    if (data.status === 'aguardando' && !data.dataEnvio) {
      setIsEnviando(true);
      
      // Simular envio da proposta para análise
      setTimeout(() => {
        onChange({
          ...data,
          status: 'aguardando',
          dataEnvio: new Date().toISOString(),
          observacoes: 'Proposta enviada para análise da mesa de crédito'
        });
        setIsEnviando(false);
      }, 2000);
    }
  }, []);

  // Simular mudança de status (para demonstração)
  const simularMudancaStatus = (novoStatus: AprovacaoData['status']) => {
    onChange({
      ...data,
      status: novoStatus,
      dataAprovacao: novoStatus === 'aprovada' ? new Date().toISOString() : undefined,
      responsavel: novoStatus === 'aprovada' ? 'gerente.credito' : undefined,
      observacoes: novoStatus === 'aprovada' 
        ? 'Proposta aprovada pela mesa de crédito' 
        : novoStatus === 'reprovada'
        ? 'Proposta reprovada - renda insuficiente'
        : 'Solicitado ajuste nos documentos'
    });
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'aguardando':
        return <Clock className="w-8 h-8 text-yellow-600 animate-pulse" />;
      case 'aprovada':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'reprovada':
        return <XCircle className="w-8 h-8 text-red-600" />;
      case 'ajuste_solicitado':
        return <AlertTriangle className="w-8 h-8 text-orange-600" />;
      default:
        return <Clock className="w-8 h-8 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'aguardando':
        return 'border-yellow-300 bg-yellow-50';
      case 'aprovada':
        return 'border-green-300 bg-green-50';
      case 'reprovada':
        return 'border-red-300 bg-red-50';
      case 'ajuste_solicitado':
        return 'border-orange-300 bg-orange-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getStatusTitle = () => {
    switch (data.status) {
      case 'aguardando':
        return 'Aguardando Análise';
      case 'aprovada':
        return 'Proposta Aprovada ✅';
      case 'reprovada':
        return 'Proposta Reprovada ❌';
      case 'ajuste_solicitado':
        return 'Ajuste Solicitado ⚠️';
      default:
        return 'Status Desconhecido';
    }
  };

  const getStatusMessage = () => {
    switch (data.status) {
      case 'aguardando':
        return 'A proposta foi enviada para análise e aguarda aprovação de um responsável. Assim que for aprovada, a etapa de assinatura será liberada.';
      case 'aprovada':
        return 'Sua proposta foi aprovada! Agora você pode prosseguir para a geração da CCB e assinatura digital.';
      case 'reprovada':
        return 'Infelizmente a proposta foi reprovada pela mesa de crédito. Verifique os motivos abaixo e inicie uma nova proposta se necessário.';
      case 'ajuste_solicitado':
        return 'A mesa de crédito solicitou ajustes na proposta. Verifique as observações e faça as correções necessárias.';
      default:
        return 'Status não identificado.';
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const canProceed = () => {
    return data.status === 'aprovada';
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Em Aprovação</h3>
        <p className="text-gray-600">Análise interna da proposta</p>
      </div>

      <div className="space-y-6">
        {/* Status Principal */}
        {isEnviando ? (
          <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h4 className="font-medium text-blue-900 mb-2">Enviando Proposta para Análise...</h4>
            <p className="text-blue-700 text-sm">
              Aguarde enquanto enviamos sua proposta para a mesa de crédito.
            </p>
          </div>
        ) : (
          <div className={`border-2 rounded-lg p-8 text-center ${getStatusColor()}`}>
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              {getStatusTitle()}
            </h4>
            
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              {getStatusMessage()}
            </p>

            {/* Informações da Análise */}
            <div className="bg-white rounded-lg p-6 max-w-2xl mx-auto">
              <h5 className="font-medium text-gray-900 mb-4">Informações da Análise</h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Envio
                  </label>
                  <div className="text-sm text-gray-900">
                    {formatDateTime(data.dataEnvio)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status Atual
                  </label>
                  <div className="text-sm text-gray-900">
                    {getStatusTitle()}
                  </div>
                </div>
                
                {data.responsavel && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsável
                    </label>
                    <div className="text-sm text-gray-900">
                      {data.responsavel}
                    </div>
                  </div>
                )}
                
                {data.dataAprovacao && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data da Aprovação
                    </label>
                    <div className="text-sm text-gray-900">
                      {formatDateTime(data.dataAprovacao)}
                    </div>
                  </div>
                )}
              </div>
              
              {data.observacoes && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                    {data.observacoes}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resumo da Proposta */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Resumo da Proposta
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                {clienteData.nome || 'Nome não informado'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                {clienteData.cpf || 'CPF não informado'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Convênio</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                {clienteData.convenio || 'Convênio não informado'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status da Reserva</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                {reservaData.status === 'approved' ? '✅ Aprovada' : 'Não realizada'}
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Simulação (apenas para demonstração) */}
        {data.status === 'aguardando' && !isEnviando && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-3">Simulação de Status (Apenas para Teste)</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => simularMudancaStatus('aprovada')}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                Simular Aprovação
              </button>
              <button
                onClick={() => simularMudancaStatus('reprovada')}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Simular Reprovação
              </button>
              <button
                onClick={() => simularMudancaStatus('ajuste_solicitado')}
                className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
              >
                Simular Ajuste
              </button>
            </div>
            <p className="text-xs text-yellow-700 mt-2">
              Em produção, estes status seriam alterados automaticamente pela mesa de crédito.
            </p>
          </div>
        )}
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
          disabled={!canProceed()}
          className={`px-6 py-3 rounded-md font-medium transition-all ${
            canProceed()
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canProceed() ? 'Próximo: Gerar CCB' : 'Aguardando Aprovação'}
        </button>
      </div>
    </div>
  );
};