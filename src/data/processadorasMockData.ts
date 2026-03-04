import type { Processadora } from '../types/processadoras';

export const processadorasMock: Processadora[] = [
  {
    id: '1',
    cnpj: '12.345.678/0001-90',
    nomeFantasia: 'Digimais',
    razaoSocial: 'Digimais Tecnologia Ltda',
    status: 'ativo',
    responsavelNome: 'João Silva',
    responsavelEmail: 'joao.silva@digimais.com.br',
    responsavelCelular: '(11) 98765-4321',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    cnpj: '23.456.789/0001-01',
    nomeFantasia: 'Consignet',
    razaoSocial: 'Consignet Processamento de Dados S.A.',
    status: 'ativo',
    responsavelNome: 'Maria Santos',
    responsavelEmail: 'maria.santos@consignet.com.br',
    responsavelCelular: '(21) 97654-3210',
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-10T14:30:00Z'
  },
  {
    id: '3',
    cnpj: '34.567.890/0001-12',
    nomeFantasia: 'Facta',
    razaoSocial: 'Facta Financeira S.A.',
    status: 'ativo',
    responsavelNome: 'Pedro Oliveira',
    responsavelEmail: 'pedro.oliveira@facta.com.br',
    responsavelCelular: '(11) 96543-2109',
    createdAt: '2024-03-05T09:15:00Z',
    updatedAt: '2024-03-05T09:15:00Z'
  },
  {
    id: '4',
    cnpj: '45.678.901/0001-23',
    nomeFantasia: 'Zetrasoft',
    razaoSocial: 'Zetrasoft Sistemas Ltda',
    status: 'ativo',
    responsavelNome: 'Ana Costa',
    responsavelEmail: 'ana.costa@zetrasoft.com.br',
    responsavelCelular: '(31) 95432-1098',
    createdAt: '2024-04-20T11:45:00Z',
    updatedAt: '2024-04-20T11:45:00Z'
  },
  {
    id: '5',
    cnpj: '56.789.012/0001-34',
    nomeFantasia: 'PayTech',
    razaoSocial: 'PayTech Soluções em Pagamento Ltda',
    status: 'inativo',
    responsavelNome: 'Carlos Mendes',
    responsavelEmail: 'carlos.mendes@paytech.com.br',
    responsavelCelular: '(85) 94321-0987',
    createdAt: '2023-11-10T16:20:00Z',
    updatedAt: '2024-05-15T13:30:00Z'
  },
  {
    id: '6',
    cnpj: '67.890.123/0001-45',
    nomeFantasia: 'FinancePro',
    razaoSocial: 'FinancePro Processamento e Serviços S.A.',
    status: 'ativo',
    responsavelNome: 'Juliana Ferreira',
    responsavelEmail: 'juliana.ferreira@financepro.com.br',
    responsavelCelular: '(41) 93210-9876',
    createdAt: '2024-05-01T08:00:00Z',
    updatedAt: '2024-05-01T08:00:00Z'
  },
  {
    id: '7',
    cnpj: '78.901.234/0001-56',
    nomeFantasia: 'DataConsig',
    razaoSocial: 'DataConsig Tecnologia da Informação Ltda',
    status: 'ativo',
    responsavelNome: 'Roberto Alves',
    responsavelEmail: 'roberto.alves@dataconsig.com.br',
    responsavelCelular: '(48) 92109-8765',
    createdAt: '2024-06-15T10:30:00Z',
    updatedAt: '2024-06-15T10:30:00Z'
  },
  {
    id: '8',
    cnpj: '89.012.345/0001-67',
    nomeFantasia: 'ConsigSys',
    razaoSocial: 'ConsigSys Sistemas de Consignação Ltda',
    status: 'inativo',
    responsavelNome: 'Fernanda Lima',
    responsavelEmail: 'fernanda.lima@consigsys.com.br',
    responsavelCelular: '(61) 91098-7654',
    createdAt: '2023-09-20T15:45:00Z',
    updatedAt: '2024-07-10T17:20:00Z'
  }
];
