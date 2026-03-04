import React, { useState, useEffect } from 'react';
import { Shield, Key, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import type { ReservaData, ClienteData } from './CadastroClienteTab';

interface ReservaStepProps {
  data: ReservaData;
  onChange: (data: ReservaData) => void;
  clienteData: ClienteData;
  onNext: () => void;
  onPrevious: () => void;
}

export const ReservaStep: React.FC<ReservaStepProps> = ({
  data,
  onChange,
  clienteData,
  onNext,
  onPrevious
}) => {
  const [isReserving, setIsReserving] = useState(false);

  // Configurações de convênios e métodos de autenticação
  const conveniosConfig = {
    'governo_goias': { nome: 'Governo de Goiás', metodo: 'senha' },
    'prefeitura_rio': { nome: 'Prefeitura do Rio de Janeiro', metodo: 'token' },
    'governo_maranhao': { nome: 'Governo do Maranhão', metodo: 'sem_auth' },
    'governo_parana': { nome: 'Governo do Paraná', metodo: 'senha' },
    'prefeitura_sorocaba': { nome: 'Prefeitura de Sorocaba', metodo: 'token' }
  };

  useEffect(() => {
    if (clienteData.convenio) {
      const config = conveniosConfig[clienteData.convenio as keyof typeof conveniosConfig];
      if (config) {
        onChange({
          ...data,
          convenio: clienteData.convenio,
          metodoAutenticacao: config.metodo as any
        });
      }
    }
  }, [clienteData.convenio]);

  const handleReservar = async () => {
    setIsReserving(true);
    onChange({ ...data, status: 'loading' });

    // Simular chamada à API de reserva - SEMPRE APROVADA para facilitar teste
    setTimeout(() => {
      onChange({
        ...data,
        status: 'approved',
        codigoReserva: `RES${Date.now().toString().slice(-6)}`,
        dataExpiracao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
      });
      setIsReserving(false);
    }, 2000);
  };

  const getConvenioNome = () => {
    const config = conveniosConfig[clienteData.convenio as keyof typeof conveniosConfig];
    return config?.nome || clienteData.convenio;
  };

  const getMetodoDescricao = () => {
    switch (data.metodoAutenticacao) {
      case 'senha':
        return 'Senha de Consignação';
      case 'token':
        return 'Token de Segurança';
      case 'sem_auth':
        return 'Sem Autenticação';
      default:
        return 'Não definido';
    }
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'loading':
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>;
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      default:
        return <Shield className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'loading':
        return 'border-blue-300 bg-blue-50';
      case 'approved':
        return 'border-green-300 bg-green-50';
      case 'rejected':
        return 'border-red-300 bg-red-50';
      case 'pending':
        return 'border-yellow-300 bg-yellow-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const isFormValid = () => {
    if (data.metodoAutenticacao === 'senha') {
      return data.senha && data.senha.length > 0;
    }
    if (data.metodoAutenticacao === 'token') {
      return data.token && data.token.length > 0;
    }
    return true; // sem_auth não precisa de validação
  };

  const canProceed = () => {
    // Permitir avanço mesmo sem reserva aprovada
    return true;
  };

  // Auto-aprovar se não houver autenticação necessária
  useEffect(() => {
    if (data.metodoAutenticacao === 'sem_auth' && data.status !== 'approved') {
      setTimeout(() => {
        onChange({
          ...data,
          status: 'approved',
          codigoReserva: `RES${Date.now().toString().slice(-6)}`,
          dataExpiracao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
        });
      }, 500);
    }
  }, [data.metodoAutenticacao]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Reserva de Margem</h3>
        <p className="text-gray-600">Execute a reserva da margem consignável diretamente pelo sistema</p>
      </div>

      <div className="space-y-6">
        {/* Informações do Convênio */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Informações do Convênio</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Convênio Selecionado
              </label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                {getConvenioNome()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Método de Autenticação
              </label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md flex items-center">
                {data.metodoAutenticacao === 'senha' && <Key className="w-4 h-4 mr-2 text-blue-600" />}
                {data.metodoAutenticacao === 'token' && <Shield className="w-4 h-4 mr-2 text-green-600" />}
                {data.metodoAutenticacao === 'sem_auth' && <CheckCircle className="w-4 h-4 mr-2 text-gray-600" />}
                {getMetodoDescricao()}
              </div>
            </div>
          </div>
        </div>

        {/* Campo de Autenticação */}
        {data.metodoAutenticacao === 'senha' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha de Consignação *
            </label>
            <input
              type="password"
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={data.senha || ''}
              onChange={(e) => onChange({ ...data, senha: e.target.value })}
              placeholder="Digite a senha de consignação"
              disabled={isReserving || data.status === 'approved'}
            />
            <p className="text-sm text-gray-500 mt-1">
              Senha fornecida pelo servidor para autorizar a reserva
            </p>
          </div>
        )}

        {data.metodoAutenticacao === 'token' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token de Segurança *
            </label>
            <input
              type="text"
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={data.token || ''}
              onChange={(e) => onChange({ ...data, token: e.target.value })}
              placeholder="Digite o token de segurança"
              disabled={isReserving || data.status === 'approved'}
            />
            <p className="text-sm text-gray-500 mt-1">
              Token enviado por SMS ou gerado pelo app do convênio
            </p>
          </div>
        )}

        {data.metodoAutenticacao === 'sem_auth' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-blue-800">
                Este convênio não requer autenticação adicional para reserva de margem.
              </p>
            </div>
          </div>
        )}

        {/* Botão de Reserva */}
        {data.status !== 'approved' && data.metodoAutenticacao !== 'sem_auth' && (
          <div>
            <button
              onClick={handleReservar}
              disabled={!isFormValid() || isReserving}
              className={`px-6 py-3 rounded-md font-medium transition-all flex items-center ${
                isFormValid() && !isReserving
                  ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isReserving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Reservando...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Executar Reserva
                </>
              )}
            </button>
          </div>
        )}

        {/* Status da Reserva */}
        {data.status && data.status !== 'idle' && (
          <div className={`border-2 rounded-lg p-6 ${getStatusColor()}`}>
            <div className="flex items-center mb-4">
              {getStatusIcon()}
              <h4 className="font-medium text-gray-900 ml-3">
                {data.status === 'loading' && 'Processando Reserva...'}
                {data.status === 'approved' && 'Reserva Aprovada ✅'}
                {data.status === 'rejected' && 'Reserva Recusada ❌'}
                {data.status === 'pending' && 'Reserva Pendente ⏳'}
              </h4>
            </div>

            {data.status === 'loading' && (
              <div className="space-y-2 text-sm text-blue-700">
                <p>• Conectando com o sistema do convênio...</p>
                <p>• Validando dados do servidor...</p>
                <p>• Consultando margem disponível...</p>
                <p>• Processando reserva...</p>
              </div>
            )}

            {data.status === 'approved' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Código da Reserva
                    </label>
                    <div className="px-3 py-2 bg-white border border-green-300 rounded-md font-mono">
                      {data.codigoReserva}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Data de Expiração
                    </label>
                    <div className="px-3 py-2 bg-white border border-green-300 rounded-md">
                      {data.dataExpiracao}
                    </div>
                  </div>
                </div>
                <div className="bg-green-100 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-800">
                    ✅ Margem reservada com sucesso! A reserva é válida por 7 dias.
                  </p>
                </div>
              </div>
            )}

            {data.status === 'rejected' && (
              <div className="space-y-3">
                <div className="bg-red-100 border border-red-200 rounded-md p-3">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <p className="text-sm text-red-800 font-medium">Motivo da Recusa:</p>
                  </div>
                  <p className="text-sm text-red-700 mt-1">{data.motivo}</p>
                </div>
                <button
                  onClick={() => onChange({ ...data, status: 'idle' })}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Tentar Novamente
                </button>
              </div>
            )}

            {data.status === 'pending' && (
              <div className="bg-yellow-100 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  ⏳ Reserva em análise. O sistema do convênio está processando a solicitação.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botão para pular etapa (MOCK) */}
        {data.status === 'idle' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-yellow-800">Modo de Teste</h4>
                <p className="text-sm text-yellow-700">
                  Para facilitar os testes, você pode simular uma reserva aprovada
                </p>
              </div>
              <button
                onClick={() => {
                  onChange({
                    ...data,
                    status: 'approved',
                    codigoReserva: `RES${Date.now().toString().slice(-6)}`,
                    dataExpiracao: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
                  });
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
              >
                Simular Aprovação
              </button>
            </div>
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
          Próximo: Gerar CCB
        </button>
      </div>
    </div>
  );
};