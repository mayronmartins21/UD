import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';
import { PropostaCorrecao, ETAPAS_LABELS } from '../../types/propostas';

interface AlertaCorrecaoProps {
  correcoes: PropostaCorrecao[];
  etapaAtual: string;
}

export function AlertaCorrecao({ correcoes, etapaAtual }: AlertaCorrecaoProps) {
  if (!correcoes || correcoes.length === 0) {
    return null;
  }

  const correcoesPendentes = correcoes.filter(c => !c.corrigido);

  if (correcoesPendentes.length === 0) {
    return null;
  }

  const correcoesEtapaAtual = correcoesPendentes.filter(c => c.etapa === etapaAtual);

  return (
    <div className="mb-6">
      <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="text-orange-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-orange-900 mb-2">
              Correção Solicitada
            </h3>
            <p className="text-sm text-orange-800 mb-4">
              Esta proposta está com correção solicitada. Revise os campos destacados e reenvie para análise.
            </p>

            {correcoesEtapaAtual.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={18} className="text-orange-600" />
                  <h4 className="font-semibold text-gray-900">
                    Correções para esta etapa ({ETAPAS_LABELS[etapaAtual as keyof typeof ETAPAS_LABELS]})
                  </h4>
                </div>
                <ul className="space-y-2">
                  {correcoesEtapaAtual.map((correcao) => (
                    <li key={correcao.id} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold mt-0.5">•</span>
                      <span className="text-gray-700 text-sm flex-1">{correcao.comentario}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {correcoesPendentes.length > correcoesEtapaAtual.length && (
              <div className="mt-3 bg-orange-100 rounded-lg p-3">
                <p className="text-sm text-orange-800">
                  <strong>Atenção:</strong> Existem correções solicitadas também em outras etapas:
                </p>
                <ul className="mt-2 space-y-1">
                  {correcoesPendentes
                    .filter(c => c.etapa !== etapaAtual)
                    .map(correcao => (
                      <li key={correcao.id} className="text-sm text-orange-700">
                        • <strong>{ETAPAS_LABELS[correcao.etapa as keyof typeof ETAPAS_LABELS]}:</strong> {correcao.comentario}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
