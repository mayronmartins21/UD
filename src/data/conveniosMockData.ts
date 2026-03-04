import type { ConvenioCompleto } from '../types/convenios';

export const conveniosMock: ConvenioCompleto[] = [
  {
    id: 'conv-001',
    processadora: 'Digimais',
    razaoSocial: 'Estado de Goiás',
    nomeFantasia: 'Governo de Goiás',
    cnpj: '01.409.580/0001-38',
    tempoMargem: 30,
    diasProposta: 15,
    percentualRecolhimento: 3.5,
    diaRepasse: 15,
    diaCorte: 5,
    status: 'ativo',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-11-20T14:30:00Z',
    agendasCorte: [
      {
        id: 'ag-001',
        convenioId: 'conv-001',
        dataInicio: '2024-01-01',
        dataFim: '2024-12-31',
        observacao: 'Agenda padrão anual',
        status: 'ativo',
        createdAt: '2023-12-01T10:00:00Z'
      }
    ],
    arquivosDebito: [
      {
        id: 'arq-001',
        convenioId: 'conv-001',
        nomeLayout: 'Layout CNAB 240',
        colunas: 'Nome,CPF,Matrícula,Valor,DataDesconto',
        periodicidade: 'Mensal',
        observacao: 'Arquivo enviado até dia 10 de cada mês',
        createdAt: '2023-01-15T10:00:00Z'
      }
    ],
    contatos: [
      {
        id: 'cont-001',
        convenioId: 'conv-001',
        nome: 'Maria Silva',
        email: 'maria.silva@goias.gov.br',
        celular: '(62) 99999-1111',
        telefone: '(62) 3201-1234',
        departamento: 'Financeiro',
        tipo: 'principal',
        ativo: true,
        createdAt: '2023-01-15T10:00:00Z'
      },
      {
        id: 'cont-002',
        convenioId: 'conv-001',
        nome: 'João Santos',
        email: 'joao.santos@goias.gov.br',
        celular: '(62) 99888-2222',
        telefone: '(62) 3201-1235',
        departamento: 'TI',
        tipo: 'ti',
        observacao: 'Responsável por integrações',
        ativo: true,
        createdAt: '2023-02-10T10:00:00Z'
      }
    ],
    parametrizacao: {
      id: 'param-001',
      convenioId: 'conv-001',
      utilizaTokenConsulta: true,
      utilizaTokenAverbacao: true,
      utilizaSenhaConsignacao: false,
      ehEstabelecimento: false,
      cartaoComprasLiberado: true,
      atendimento: 'Atendimento SP',
      realizaOfertaSaqueFacil: true,
      cartaoSaqueFacilLiberado: true,
      categoriasCartaoCompras: ['Alimentação', 'Combustível', 'Farmácia', 'Vestuário'],
      categoriasSaqueFacil: ['Saque ATM', 'Saque Presencial'],
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2024-06-10T14:00:00Z'
    },
    prazos: [
      {
        id: 'prazo-001',
        parametrizacaoId: 'param-001',
        tipoOperacao: 'Novo',
        parcelasMin: 6,
        parcelasMax: 96,
        carenciaDias: 30,
        observacao: 'Prazo padrão para novas operações',
        createdAt: '2023-01-15T10:00:00Z'
      },
      {
        id: 'prazo-002',
        parametrizacaoId: 'param-001',
        tipoOperacao: 'Refinanciamento',
        parcelasMin: 12,
        parcelasMax: 84,
        carenciaDias: 60,
        createdAt: '2023-01-15T10:00:00Z'
      }
    ],
    decretos: [
      {
        id: 'dec-001',
        convenioId: 'conv-001',
        numero: '9.876/2023',
        dataPublicacao: '2023-01-10',
        ementa: 'Regulamenta consignações em folha de pagamento dos servidores públicos estaduais',
        arquivoUrl: '/documentos/decreto-9876-2023.pdf',
        status: 'vigente',
        dataVigenciaInicio: '2023-02-01',
        principal: true,
        createdAt: '2023-01-15T10:00:00Z'
      }
    ],
    roteirosOperacionais: [
      {
        id: 'ro-001',
        convenioId: 'conv-001',
        versao: 'v3.2',
        dataVersao: '2024-11-01',
        responsavel: 'Ana Paula Costa',
        descricao: 'Atualização de procedimentos de averbação',
        arquivoUrl: '/documentos/ro-goias-v3.2.pdf',
        versaoAtual: true,
        createdAt: '2024-11-01T10:00:00Z'
      },
      {
        id: 'ro-002',
        convenioId: 'conv-001',
        versao: 'v3.1',
        dataVersao: '2024-06-15',
        responsavel: 'Carlos Mendes',
        descricao: 'Inclusão de novos tipos de operação',
        arquivoUrl: '/documentos/ro-goias-v3.1.pdf',
        versaoAtual: false,
        createdAt: '2024-06-15T10:00:00Z'
      }
    ]
  },
  {
    id: 'conv-002',
    processadora: 'Consignet',
    razaoSocial: 'Município de Hortolândia',
    nomeFantasia: 'Prefeitura de Hortolândia',
    cnpj: '46.628.194/0001-97',
    tempoMargem: 45,
    diasProposta: 20,
    percentualRecolhimento: 4.0,
    diaRepasse: 20,
    diaCorte: 10,
    status: 'ativo',
    createdAt: '2023-03-20T10:00:00Z',
    updatedAt: '2024-10-15T16:45:00Z',
    agendasCorte: [],
    arquivosDebito: [],
    contatos: [
      {
        id: 'cont-003',
        convenioId: 'conv-002',
        nome: 'Pedro Oliveira',
        email: 'pedro.oliveira@hortolandia.sp.gov.br',
        celular: '(19) 98777-3333',
        telefone: '(19) 3897-1234',
        departamento: 'RH',
        tipo: 'principal',
        ativo: true,
        createdAt: '2023-03-20T10:00:00Z'
      }
    ],
    parametrizacao: {
      id: 'param-002',
      convenioId: 'conv-002',
      utilizaTokenConsulta: false,
      utilizaTokenAverbacao: false,
      utilizaSenhaConsignacao: true,
      ehEstabelecimento: true,
      cartaoComprasLiberado: false,
      atendimento: 'Atendimento RJ',
      realizaOfertaSaqueFacil: false,
      cartaoSaqueFacilLiberado: false,
      categoriasCartaoCompras: [],
      categoriasSaqueFacil: [],
      createdAt: '2023-03-20T10:00:00Z',
      updatedAt: '2024-05-10T14:00:00Z'
    },
    prazos: [
      {
        id: 'prazo-003',
        parametrizacaoId: 'param-002',
        tipoOperacao: 'Novo',
        parcelasMin: 12,
        parcelasMax: 72,
        carenciaDias: 45,
        createdAt: '2023-03-20T10:00:00Z'
      }
    ],
    decretos: [
      {
        id: 'dec-002',
        convenioId: 'conv-002',
        numero: '5.432/2023',
        dataPublicacao: '2023-03-15',
        ementa: 'Autoriza consignação em folha de servidores municipais',
        status: 'vigente',
        dataVigenciaInicio: '2023-04-01',
        principal: true,
        createdAt: '2023-03-20T10:00:00Z'
      }
    ],
    roteirosOperacionais: [
      {
        id: 'ro-003',
        convenioId: 'conv-002',
        versao: 'v2.0',
        dataVersao: '2024-10-01',
        responsavel: 'Fernanda Lima',
        descricao: 'Revisão completa dos procedimentos',
        arquivoUrl: '/documentos/ro-hortolandia-v2.0.pdf',
        versaoAtual: true,
        createdAt: '2024-10-01T10:00:00Z'
      }
    ]
  },
  {
    id: 'conv-003',
    processadora: 'Facta',
    razaoSocial: 'Estado do Maranhão',
    nomeFantasia: 'Governo do Maranhão',
    cnpj: '06.554.941/0001-71',
    tempoMargem: 60,
    diasProposta: 25,
    percentualRecolhimento: 3.0,
    diaRepasse: 25,
    diaCorte: 15,
    status: 'ativo',
    createdAt: '2023-05-10T10:00:00Z',
    updatedAt: '2024-09-20T11:20:00Z',
    agendasCorte: [],
    arquivosDebito: [],
    contatos: [
      {
        id: 'cont-004',
        convenioId: 'conv-003',
        nome: 'Lucia Costa',
        email: 'lucia.costa@ma.gov.br',
        celular: '(98) 99666-4444',
        telefone: '(98) 3194-5678',
        departamento: 'Contabilidade',
        tipo: 'principal',
        ativo: true,
        createdAt: '2023-05-10T10:00:00Z'
      }
    ],
    parametrizacao: {
      id: 'param-003',
      convenioId: 'conv-003',
      utilizaTokenConsulta: true,
      utilizaTokenAverbacao: false,
      utilizaSenhaConsignacao: true,
      ehEstabelecimento: false,
      cartaoComprasLiberado: true,
      atendimento: 'Atendimento SP',
      realizaOfertaSaqueFacil: true,
      cartaoSaqueFacilLiberado: false,
      categoriasCartaoCompras: ['Alimentação', 'Saúde'],
      categoriasSaqueFacil: ['Saque ATM'],
      createdAt: '2023-05-10T10:00:00Z',
      updatedAt: '2024-07-15T14:00:00Z'
    },
    prazos: [],
    decretos: [],
    roteirosOperacionais: []
  },
  {
    id: 'conv-004',
    processadora: 'Zetrasoft',
    razaoSocial: 'Município do Rio de Janeiro',
    nomeFantasia: 'Prefeitura do Rio de Janeiro',
    cnpj: '42.498.733/0001-48',
    tempoMargem: 30,
    diasProposta: 15,
    percentualRecolhimento: 3.8,
    diaRepasse: 10,
    diaCorte: 1,
    status: 'inativo',
    createdAt: '2022-11-05T10:00:00Z',
    updatedAt: '2024-08-10T09:15:00Z',
    agendasCorte: [],
    arquivosDebito: [],
    contatos: [],
    parametrizacao: {
      id: 'param-004',
      convenioId: 'conv-004',
      utilizaTokenConsulta: false,
      utilizaTokenAverbacao: false,
      utilizaSenhaConsignacao: false,
      ehEstabelecimento: false,
      cartaoComprasLiberado: false,
      atendimento: 'Atendimento RJ',
      realizaOfertaSaqueFacil: false,
      cartaoSaqueFacilLiberado: false,
      categoriasCartaoCompras: [],
      categoriasSaqueFacil: [],
      createdAt: '2022-11-05T10:00:00Z',
      updatedAt: '2024-08-10T09:15:00Z'
    },
    prazos: [],
    decretos: [],
    roteirosOperacionais: []
  },
  {
    id: 'conv-005',
    processadora: 'Digimais',
    razaoSocial: 'Estado do Paraná',
    nomeFantasia: 'Governo do Paraná',
    cnpj: '76.416.940/0001-28',
    tempoMargem: 30,
    diasProposta: 10,
    percentualRecolhimento: 2.5,
    diaRepasse: 5,
    diaCorte: 25,
    status: 'ativo',
    createdAt: '2023-07-22T10:00:00Z',
    updatedAt: '2024-12-01T15:30:00Z',
    agendasCorte: [],
    arquivosDebito: [],
    contatos: [
      {
        id: 'cont-005',
        convenioId: 'conv-005',
        nome: 'Roberto Almeida',
        email: 'roberto.almeida@pr.gov.br',
        celular: '(41) 99555-5555',
        telefone: '(41) 3320-2000',
        departamento: 'Secretaria de Administração',
        tipo: 'principal',
        ativo: true,
        createdAt: '2023-07-22T10:00:00Z'
      }
    ],
    parametrizacao: {
      id: 'param-005',
      convenioId: 'conv-005',
      utilizaTokenConsulta: true,
      utilizaTokenAverbacao: true,
      utilizaSenhaConsignacao: false,
      ehEstabelecimento: false,
      cartaoComprasLiberado: true,
      atendimento: 'Atendimento SP',
      realizaOfertaSaqueFacil: true,
      cartaoSaqueFacilLiberado: true,
      categoriasCartaoCompras: ['Alimentação', 'Combustível', 'Farmácia'],
      categoriasSaqueFacil: ['Saque ATM', 'Saque Presencial'],
      createdAt: '2023-07-22T10:00:00Z',
      updatedAt: '2024-12-01T15:30:00Z'
    },
    prazos: [],
    decretos: [],
    roteirosOperacionais: []
  }
];
