import React, { useState, useEffect, useCallback } from 'react';
import { Video, Copy, CheckCircle, Clock, XCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export type StatusVideoChamada = 'pendente' | 'em_validacao' | 'aprovada' | 'reprovada';

export interface VideoChamadaData {
  link: string;
  status: StatusVideoChamada;
  sessionId?: string;
}

interface VideoChamadaStepProps {
  data: VideoChamadaData;
  onChange: (data: VideoChamadaData) => void;
}

const MOCK_LINK = 'https://validacao.usedigi.com/video/abc12345';
const MOCK_SESSION_ID = 'session_abc12345';

const statusConfig: Record<StatusVideoChamada, {
  label: string;
  badgeClass: string;
  dotClass: string;
  Icon: React.ElementType;
}> = {
  pendente: {
    label: 'Pendente',
    badgeClass: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    dotClass: 'bg-yellow-400',
    Icon: Clock
  },
  em_validacao: {
    label: 'Em validação',
    badgeClass: 'bg-blue-50 border-blue-200 text-blue-700',
    dotClass: 'bg-blue-400',
    Icon: Loader2
  },
  aprovada: {
    label: 'Aprovada',
    badgeClass: 'bg-green-50 border-green-200 text-green-700',
    dotClass: 'bg-green-500',
    Icon: CheckCircle
  },
  reprovada: {
    label: 'Reprovada',
    badgeClass: 'bg-red-50 border-red-200 text-red-700',
    dotClass: 'bg-red-500',
    Icon: XCircle
  }
};

async function consultarStatusNuvidio(sessionId: string): Promise<StatusVideoChamada> {
  await new Promise(r => setTimeout(r, 1200));
  return 'pendente';
}

export const VideoChamadaStep: React.FC<VideoChamadaStepProps> = ({ data, onChange }) => {
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [consultando, setConsultando] = useState(false);
  const [erroConclusao, setErroConclusao] = useState(false);
  const [concluindo, setConcluindo] = useState(false);

  useEffect(() => {
    if (!data.link) {
      onChange({
        link: MOCK_LINK,
        status: 'pendente',
        sessionId: MOCK_SESSION_ID
      });
    }
  }, []);

  const handleCopiarLink = async () => {
    const link = data.link || MOCK_LINK;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const input = document.createElement('input');
      input.value = link;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2500);
  };

  const handleAtualizarStatus = useCallback(async () => {
    if (consultando) return;
    setConsultando(true);
    try {
      const novoStatus = await consultarStatusNuvidio(data.sessionId || MOCK_SESSION_ID);
      onChange({ ...data, status: novoStatus });
    } finally {
      setConsultando(false);
    }
  }, [consultando, data, onChange]);

  const handleConcluir = async () => {
    setErroConclusao(false);
    setConcluindo(true);
    try {
      const statusAtualizado = await consultarStatusNuvidio(data.sessionId || MOCK_SESSION_ID);
      onChange({ ...data, status: statusAtualizado });
      if (statusAtualizado !== 'aprovada') {
        setErroConclusao(true);
      }
    } finally {
      setConcluindo(false);
    }
  };

  const statusAtual = statusConfig[data.status || 'pendente'];
  const StatusIcon = statusAtual.Icon;
  const link = data.link || MOCK_LINK;

  return (
    <div className="min-h-[480px] flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4">
            <Video className="w-7 h-7 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Vídeo chamada</h3>
          <p className="text-sm text-gray-500 mt-1">Validação de identidade via chamada de vídeo</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100 text-center">
            <h4 className="text-base font-semibold text-gray-900 mb-2">Validação por vídeo chamada</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Para concluir a formalização da proposta, é necessário realizar a validação de identidade do servidor por meio de uma vídeo chamada.
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link da Vídeo Chamada
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={link}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm font-mono focus:outline-none cursor-default"
                />
                <button
                  onClick={handleCopiarLink}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border whitespace-nowrap ${
                    linkCopiado
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {linkCopiado ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar link
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Status da validação</p>
                <button
                  onClick={handleAtualizarStatus}
                  disabled={consultando}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${consultando ? 'animate-spin' : ''}`} />
                  Atualizar
                </button>
              </div>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${statusAtual.badgeClass}`}>
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusAtual.dotClass} ${data.status === 'em_validacao' ? 'animate-pulse' : ''}`} />
                <StatusIcon className={`w-4 h-4 ${data.status === 'em_validacao' ? 'animate-spin' : ''}`} />
                {statusAtual.label}
              </div>

              {data.status === 'pendente' && (
                <p className="text-xs text-gray-400 mt-2">
                  Aguardando o servidor iniciar a vídeo chamada de validação.
                </p>
              )}
              {data.status === 'em_validacao' && (
                <p className="text-xs text-blue-500 mt-2">
                  Vídeo chamada em andamento. Aguarde a conclusão da validação.
                </p>
              )}
            </div>
          </div>

          {data.status === 'reprovada' && (
            <div className="mx-6 mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">
                A identidade do servidor não foi validada com sucesso. O processo de formalização não pode ser concluído.
              </p>
            </div>
          )}

          {data.status === 'aprovada' && (
            <div className="mx-6 mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-700">
                Identidade confirmada com sucesso. A proposta está pronta para finalização.
              </p>
            </div>
          )}
        </div>

        {erroConclusao && (
          <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">
              A proposta não pode ser concluída. A validação por vídeo chamada ainda não foi finalizada ou não foi aprovada.
            </p>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <button
            onClick={handleConcluir}
            disabled={concluindo}
            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {concluindo ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verificando...
              </>
            ) : (
              'Concluir proposta'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
