import React, { useState } from 'react';
import { FileText, Copy, Check, Download, Send, ExternalLink } from 'lucide-react';
import type { CCBData, ClienteData, ReservaData } from './CadastroClienteTab';

interface CCBStepProps {
  data: CCBData;
  onChange: (data: CCBData) => void;
  clienteData: ClienteData;
  reservaData: ReservaData;
  onPrevious: () => void;
  onNext?: () => void;
}

export const CCBStep: React.FC<CCBStepProps> = ({
  data,
  onChange,
  clienteData,
  reservaData,
  onPrevious,
  onNext
}) => {
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGerarCCB = async () => {
    setIsGenerating(true);
    onChange({ ...data, status: 'generating' });

    // Simular geração da CCB
    setTimeout(() => {
      const sucesso = Math.random() > 0.1; // 90% de chance de sucesso
      
      if (sucesso) {
        const numeroContrato = `CCB${Date.now().toString().slice(-8)}`;
        const linkCCB = `https://ccb.usedigi.com.br/contrato/${numeroContrato}`;
        
        onChange({
          ...data,
          status: 'generated',
          numeroContrato,
          valorContratado: 5000.00,
          prazo: 60,
          parcelas: 60,
          linkCCB
        });
      } else {
        onChange({ ...data, status: 'error' });
      }
      setIsGenerating(false);
    }, 3000);
  };

  const handleCopiarLink = () => {
    if (data.linkCCB) {
      navigator.clipboard.writeText(data.linkCCB);
      setLinkCopiado(true);
      setTimeout(() => setLinkCopiado(false), 3000);
    }
  };

  const handleEnviarWhatsApp = () => {
    if (data.linkCCB && clienteData.celular) {
      const telefone = clienteData.celular.replace(/\D/g, '');
      const mensagem = encodeURIComponent(
        `Olá ${clienteData.nome}! Seu contrato digital está pronto para assinatura. Acesse o link: ${data.linkCCB}`
      );
      window.open(`https://wa.me/55${telefone}?text=${mensagem}`, '_blank');
    }
  };

  const handleEnviarEmail = () => {
    if (data.linkCCB && clienteData.email) {
      const assunto = encodeURIComponent('Contrato Digital - UseDigi');
      const corpo = encodeURIComponent(
        `Olá ${clienteData.nome},\n\nSeu contrato digital está pronto para assinatura.\n\nNúmero do Contrato: ${data.numeroContrato}\nValor: ${formatCurrency(data.valorContratado || 0)}\nParcelas: ${data.parcelas}x\n\nAcesse o link para assinar: ${data.linkCCB}\n\nAtenciosamente,\nEquipe UseDigi`
      );
      window.open(`mailto:${clienteData.email}?subject=${assunto}&body=${corpo}`, '_blank');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'generating':
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>;
      case 'generated':
        return <Check className="w-6 h-6 text-green-600" />;
      case 'error':
        return <FileText className="w-6 h-6 text-red-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'generating':
        return 'border-blue-300 bg-blue-50';
      case 'generated':
        return 'border-green-300 bg-green-50';
      case 'error':
        return 'border-red-300 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Geração da CCB</h3>
        <p className="text-gray-600">Gere o contrato digital e forneça o link para envio ao cliente</p>
      </div>

      <div className="space-y-6">
        {/* Resumo da Proposta */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-4">Resumo da Proposta</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                {clienteData.nome}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                {clienteData.cpf}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Convênio</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md">
                {clienteData.convenio}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Proposta</label>
              <div className="px-3 py-2 bg-white border border-gray-300 rounded-md font-mono">
                {reservaData.codigoReserva ? '****' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Botão Gerar CCB */}
        {data.status === 'idle' && (
          <div className="text-center">
            <button
              onClick={handleGerarCCB}
              disabled={isGenerating}
              className="px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 hover:shadow-md transition-all flex items-center mx-auto"
            >
              <FileText className="w-5 h-5 mr-2" />
              Gerar CCB
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Clique para gerar o contrato digital baseado nos dados informados
            </p>
          </div>
        )}

        {/* Status da Geração */}
        {data.status !== 'idle' && (
          <div className={`border-2 rounded-lg p-6 ${getStatusColor()}`}>
            <div className="flex items-center mb-4">
              {getStatusIcon()}
              <h4 className="font-medium text-gray-900 ml-3">
                {data.status === 'generating' && 'Gerando CCB...'}
                {data.status === 'generated' && 'CCB Gerada com Sucesso! ✅'}
                {data.status === 'error' && 'Erro na Geração da CCB ❌'}
              </h4>
            </div>

            {data.status === 'generating' && (
              <div className="space-y-2 text-sm text-blue-700">
                <p>• Validando dados da proposta...</p>
                <p>• Consultando tabela de juros...</p>
                <p>• Gerando contrato digital...</p>
                <p>• Criando link de assinatura...</p>
              </div>
            )}

            {data.status === 'generated' && (
              <div className="space-y-6">
                {/* Dados do Contrato */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Número do Contrato
                    </label>
                    <div className="px-3 py-2 bg-white border border-green-300 rounded-md font-mono">
                      {data.numeroContrato}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Valor Contratado
                    </label>
                    <div className="px-3 py-2 bg-white border border-green-300 rounded-md font-semibold">
                      {formatCurrency(data.valorContratado || 0)}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Prazo
                    </label>
                    <div className="px-3 py-2 bg-white border border-green-300 rounded-md">
                      {data.prazo} meses
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">
                      Parcelas
                    </label>
                    <div className="px-3 py-2 bg-white border border-green-300 rounded-md">
                      {data.parcelas}x
                    </div>
                  </div>
                </div>

                {/* Link da CCB */}
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">
                    Link da CCB para Assinatura
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={data.linkCCB || ''}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-md font-mono text-sm"
                    />
                    <button
                      onClick={handleCopiarLink}
                      className={`px-4 py-2 rounded-md font-medium transition-all flex items-center ${
                        linkCopiado
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {linkCopiado ? (
                        <>
                          <Check className="w-4 h-4 mr-1" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copiar Link
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Ações de Envio */}
                <div className="bg-green-100 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-900 mb-3">Enviar CCB para o Cliente</h5>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleEnviarWhatsApp}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar por WhatsApp
                    </button>
                    
                    <button
                      onClick={handleEnviarEmail}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar por E-mail
                    </button>
                    
                    <button
                      onClick={() => window.open(data.linkCCB, '_blank')}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Abrir CCB
                    </button>
                  </div>
                  
                  <p className="text-sm text-green-700 mt-3">
                    💡 O cliente receberá o link e poderá assinar digitalmente usando certificado digital ou assinatura eletrônica.
                  </p>
                </div>

                {/* Próximos Passos */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">Próximos Passos</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Cliente recebe o link da CCB</li>
                    <li>• Cliente assina digitalmente o contrato</li>
                    <li>• Sistema processa a liberação do crédito</li>
                    <li>• Valor é depositado na conta do cliente</li>
                  </ul>
                </div>
              </div>
            )}

            {data.status === 'error' && (
              <div className="space-y-3">
                <div className="bg-red-100 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    ❌ Erro ao gerar a CCB. Verifique os dados e tente novamente.
                  </p>
                </div>
                <button
                  onClick={() => onChange({ ...data, status: 'idle' })}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  Tentar Novamente
                </button>
              </div>
            )}
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
        
        {data.status === 'generated' && (
          <button
            onClick={onNext}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Próximo: Vídeo Chamada
          </button>
        )}
      </div>
    </div>
  );
};