import type { LogAlteracao } from '../types/logs';

export const logsExemplo: LogAlteracao[] = [
  {
    id: 'LOG-001',
    dataHora: '2024-03-15T14:30:00',
    tipo: 'Edição de Dados',
    usuario: 'Maria Silva',
    motivo: 'Atualização de endereço residencial conforme solicitação do cliente'
  },
  {
    id: 'LOG-002',
    dataHora: '2024-03-14T10:15:00',
    tipo: 'Substituição de Documento',
    usuario: 'João Santos',
    motivo: 'Documento anterior estava ilegível'
  },
  {
    id: 'LOG-003',
    dataHora: '2024-03-12T16:45:00',
    tipo: 'Quitação Manual',
    usuario: 'Pedro Oliveira',
    motivo: 'Quitação antecipada com desconto negociado'
  },
  {
    id: 'LOG-004',
    dataHora: '2024-03-10T09:20:00',
    tipo: 'Refinanciamento',
    usuario: 'Ana Costa',
    motivo: 'Cliente solicitou redução de parcelas'
  },
  {
    id: 'LOG-005',
    dataHora: '2024-03-08T11:30:00',
    tipo: 'Edição de Dados',
    usuario: 'Sistema',
    motivo: 'Atualização automática via integração bancária'
  },
  {
    id: 'LOG-006',
    dataHora: '2024-03-05T15:10:00',
    tipo: 'Cadastro Inicial',
    usuario: 'Carlos Mendes',
    motivo: 'Primeiro cadastro do cliente no sistema'
  }
];

export const logsVazio: LogAlteracao[] = [];
