import React from 'react';
import type { StatusConciliacao, StatusProcessamento, StatusCompetencia, StatusLinha } from '../../types';

interface StatusChipProps {
  status: StatusConciliacao | StatusProcessamento | StatusCompetencia | StatusLinha;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  // Status de Conciliação
  'Descontado': { color: 'bg-green-100 text-green-800', label: 'Descontado' },
  'NaoDescontado': { color: 'bg-red-100 text-red-800', label: 'Não Descontado' },
  'Divergencia': { color: 'bg-yellow-100 text-yellow-800', label: 'Divergência' },
  'NaoLocalizada': { color: 'bg-purple-100 text-purple-800', label: 'Não Localizada' },
  'EsperandoRetorno': { color: 'bg-gray-100 text-gray-800', label: 'Esperando Retorno' },
  
  // Status de Processamento
  'EmValidacao': { color: 'bg-blue-100 text-blue-800', label: 'Em Validação' },
  'Processando': { color: 'bg-blue-100 text-blue-800', label: 'Processando' },
  'Concluido': { color: 'bg-green-100 text-green-800', label: 'Concluído' },
  'ConcluidoComAlertas': { color: 'bg-yellow-100 text-yellow-800', label: 'Concluído c/ Alertas' },
  'Falhou': { color: 'bg-red-100 text-red-800', label: 'Falhou' },
  
  // Status de Competência
  'Aberta': { color: 'bg-yellow-100 text-yellow-800', label: 'Aberta' },
  'EmConciliacao': { color: 'bg-yellow-100 text-yellow-800', label: 'Em Conciliação' },
  'Conciliada': { color: 'bg-green-100 text-green-800', label: 'Conciliada' },
  'Fechada': { color: 'bg-gray-100 text-gray-800', label: 'Fechada' },
  
  // Status de Linha
  'OK': { color: 'bg-green-100 text-green-800', label: 'OK' },
  'Alerta': { color: 'bg-yellow-100 text-yellow-800', label: 'Alerta' },
  'Erro': { color: 'bg-red-100 text-red-800', label: 'Erro' }
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base'
};

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'sm' }) => {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  if (!config) return null;

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.color} ${sizeClass}`}>
      {config.label}
    </span>
  );
};