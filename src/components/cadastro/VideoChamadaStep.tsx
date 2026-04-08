import React, { useState } from 'react';
import { Video, Copy, ExternalLink, RefreshCw, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

export type StatusVideoChamada = 'pendente' | 'aprovada' | 'reprovada';

export interface VideoChamadaData {
  link: string;
  status: StatusVideoChamada;
}

interface VideoChamadaStepProps {
  data: VideoChamadaData;
  onChange: (data: VideoChamadaData) => void;
  onPrevious: () => void;
}

function gerarLink(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `https://validacao.usedigi.com/video/${id}`;
}

export const VideoChamadaStep: React.FC<VideoChamadaStepProps> = ({
  data,
  onChange,
  onPrevious
}) => {
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [regerando, setRegerando] = useState(false);

  const linkAtual = data.link || gerarLink();

  React.useEffect(() => {
    if (!data.link) {
      onChange({ ...data, link: linkAtual, status: data.status || 'pendente' });
    }
  }, []);

  const handleCopiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkAtual);
    } catch {
      const input = document.createElement('input');
      input.value = linkAtual;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2500);
  };

  const handleAbrirLink = () => {
    window.open(linkAtual, '_blank', 'noopener,noreferrer');
  };

  const handleRegerarLink = () => {
    setRegerando(true);
    setTimeout(() => {
      const novoLink = gerarLink();
      onChange({ ...data, link: novoLink, status: 'pendente' });
      setRegerando(false);
    }, 800);
  };

  const handleAlterarStatus = (novoStatus: StatusVideoChamada) => {
    onChange({ ...data, status: novoStatus });
  };

  const statusConfig = {
    pendente: {
      label: 'Pendente',
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconColor: 'text-yellow-500',
      Icon: Clock
    },
    aprovada: {
      label: 'Aprovada',
      className: 'bg-green-50 border-green-200 text-green-800',
      iconColor: 'text-green-500',
      Icon: CheckCircle
    },
    reprovada: {
      label: 'Reprovada',
      className: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-500',
      Icon: XCircle
    }
  };

  const statusAtual = statusConfig[data.status || 'pendente'];
  const StatusIcon = statusAtual.Icon;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Video className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Vídeo chamada</h3>
          <p className="text-sm text-gray-500">Validação de identidade via chamada de vídeo</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-base font-semibold text-gray-900 mb-1">Validação por vídeo chamada</h4>
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
                value={data.link || linkAtual}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm font-mono focus:outline-none cursor-default select-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleCopiarLink}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                linkCopiado
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {linkCopiado ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Link copiado com sucesso
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar link
                </>
              )}
            </button>

            <button
              onClick={handleAbrirLink}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir link
            </button>

            <button
              onClick={handleRegerarLink}
              disabled={regerando}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${regerando ? 'animate-spin' : ''}`} />
              {regerando ? 'Gerando...' : 'Regerar link'}
            </button>
          </div>

          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Status da validação</p>

            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border mb-4 ${statusAtual.className}`}>
              <StatusIcon className={`w-5 h-5 ${statusAtual.iconColor}`} />
              <span className="text-sm font-semibold">{statusAtual.label}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(statusConfig) as StatusVideoChamada[]).map((status) => {
                const cfg = statusConfig[status];
                const CfgIcon = cfg.Icon;
                const isSelected = (data.status || 'pendente') === status;
                return (
                  <button
                    key={status}
                    onClick={() => handleAlterarStatus(status)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                      isSelected
                        ? cfg.className + ' ring-2 ring-offset-1 ring-current'
                        : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <CfgIcon className="w-4 h-4" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {data.status === 'reprovada' && (
          <div className="mx-6 mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Validação reprovada</p>
              <p className="text-sm text-red-700 mt-1">
                A identidade do servidor não foi validada com sucesso. O processo de formalização não pode ser concluído.
              </p>
            </div>
          </div>
        )}

        {data.status === 'aprovada' && (
          <div className="mx-6 mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-800">Validação aprovada</p>
              <p className="text-sm text-green-700 mt-1">
                Identidade confirmada com sucesso. A proposta está pronta para finalização.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onPrevious}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Voltar
        </button>
        <button
          disabled={data.status === 'reprovada'}
          className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Concluir proposta
        </button>
      </div>
    </div>
  );
};
