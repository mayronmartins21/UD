import type {
  Convenio, Operacao, Parcela, LayoutAverbadora, ArquivoRetorno,
  RetornoLinha, ConciliacaoParcela, CompetenciaFechamento, MotivoOcorrencia
} from '../types';

export const convenios: Convenio[] = [
  {
    id: '1',
    nome: 'Governo de Goiás',
    orgao: 'Estado de Goiás',
    averbadora: 'Neoconsig',
    empresa: 'UD',
    ativo: true,
    regras_json: {
      data_corte: '25',
      data_pagamento: '05',
      data_repasse: '10',
      tolerancia_divergencia: { CartaoCompras: 0.05, Emprestimo: 0.01 },
      regras_rubrica: {}
    }
  },
  {
    id: '2',
    nome: 'Governo do Maranhão',
    orgao: 'Estado do Maranhão',
    averbadora: 'Zetra',
    empresa: 'UD',
    ativo: true,
    regras_json: {
      data_corte: '20',
      data_pagamento: '30',
      data_repasse: '05',
      tolerancia_divergencia: { CartaoCompras: 0.05, FGTS: 0.02 },
      regras_rubrica: {}
    }
  },
  {
    id: '3',
    nome: 'Governo do Paraná',
    orgao: 'Estado do Paraná',
    averbadora: 'SmartConsig',
    empresa: 'UD',
    ativo: true,
    regras_json: {
      data_corte: '15',
      data_pagamento: '28',
      data_repasse: '03',
      tolerancia_divergencia: { Emprestimo: 0.01, CartaoSaque: 0.05 },
      regras_rubrica: {}
    }
  },
  {
    id: '4',
    nome: 'Prefeitura de Sorocaba',
    orgao: 'Município de Sorocaba',
    averbadora: 'Consigfácil',
    empresa: 'UD',
    ativo: true,
    regras_json: {
      data_corte: '20',
      data_pagamento: '30',
      data_repasse: '05',
      tolerancia_divergencia: { CartaoCompras: 0.05, Emprestimo: 0.01 },
      regras_rubrica: {}
    }
  },
  {
    id: '5',
    nome: 'Prefeitura de Hortolândia',
    orgao: 'Município de Hortolândia',
    averbadora: 'Fasitec',
    empresa: 'UD',
    ativo: true,
    regras_json: {
      data_corte: '25',
      data_pagamento: '05',
      data_repasse: '10',
      tolerancia_divergencia: { CartaoCompras: 0.05, FGTS: 0.02 },
      regras_rubrica: {}
    }
  },
  {
    id: '6',
    nome: 'Prefeitura de Santo André',
    orgao: 'Município de Santo André',
    averbadora: 'Neoconsig',
    empresa: 'UD',
    ativo: true,
    regras_json: {
      data_corte: '15',
      data_pagamento: '28',
      data_repasse: '03',
      tolerancia_divergencia: { Emprestimo: 0.01, CartaoSaque: 0.05 },
      regras_rubrica: {}
    }
  },
  {
    id: '7',
    nome: 'Prefeitura do Rio de Janeiro',
    orgao: 'Município do Rio de Janeiro',
    averbadora: 'Zetra',
    empresa: 'UD',
    ativo: true,
    regras_json: {
      data_corte: '20',
      data_pagamento: '30',
      data_repasse: '05',
      tolerancia_divergencia: { CartaoCompras: 0.05, Emprestimo: 0.01 },
      regras_rubrica: {}
    }
  },
  {
    id: '8',
    nome: 'Prefeitura de Guarulhos',
    orgao: 'Município de Guarulhos',
    averbadora: 'SmartConsig',
    empresa: 'UD',
    ativo: true,
    regras_json: {
      data_corte: '15',
      data_pagamento: '28',
      data_repasse: '03',
      tolerancia_divergencia: { Emprestimo: 0.01, CartaoSaque: 0.05 },
      regras_rubrica: {}
    }
  },
  {
    id: '9',
    nome: 'Convênio Neoconsig',
    orgao: 'Convênio Neoconsig',
    averbadora: 'Neoconsig',
    empresa: 'UD',
    ativo: true,
    regras_json: {
      data_corte: '20',
      data_pagamento: '30',
      data_repasse: '05',
      tolerancia_divergencia: { CartaoCompras: 0.05, Emprestimo: 0.01 },
      regras_rubrica: {}
    }
  }
];

export const layouts: LayoutAverbadora[] = [
  {
    id: '1',
    nome: 'Neoconsig Padrão v2.1',
    averbadora: 'Neoconsig',
    formato: 'csv',
    separador: ';',
    header_rows: 1,
    encoding: 'UTF-8',
    date_format: 'DD/MM/YYYY',
    mapping_json: {
      'CPF': 'cpf',
      'MATRICULA': 'matricula',
      'RUBRICA': 'rubrica',
      'PARCELA': 'numero_parcela',
      'COMPETENCIA': 'competencia_ref',
      'VALOR': 'valor_descontado',
      'COD_OCORRENCIA': 'codigo_ocorrencia',
      'DESC_OCORRENCIA': 'descricao_ocorrencia'
    }
  },
  {
    id: '2',
    nome: 'Zetra Padrão v1.5',
    averbadora: 'Zetra',
    formato: 'txt_fixed',
    separador: '',
    header_rows: 0,
    encoding: 'ISO-8859-1',
    date_format: 'YYYYMMDD',
    mapping_json: {
      'CPF[1:11]': 'cpf',
      'MATRICULA[12:22]': 'matricula',
      'VALOR[45:60]': 'valor_descontado',
      'DATA[61:68]': 'data_evento'
    }
  },
  {
    id: '3',
    nome: 'SmartConsig Padrão v2.0',
    averbadora: 'SmartConsig',
    formato: 'csv',
    separador: ',',
    header_rows: 1,
    encoding: 'UTF-8',
    date_format: 'DD/MM/YYYY',
    mapping_json: {
      'CPF': 'cpf',
      'MATRICULA': 'matricula',
      'RUBRICA': 'rubrica',
      'PARCELA': 'numero_parcela',
      'COMPETENCIA': 'competencia_ref',
      'VALOR': 'valor_descontado',
      'COD_OCORRENCIA': 'codigo_ocorrencia',
      'DESC_OCORRENCIA': 'descricao_ocorrencia'
    }
  },
  {
    id: '4',
    nome: 'Consigfácil Padrão v1.8',
    averbadora: 'Consigfácil',
    formato: 'csv',
    separador: ';',
    header_rows: 1,
    encoding: 'UTF-8',
    date_format: 'DD/MM/YYYY',
    mapping_json: {
      'CPF': 'cpf',
      'MATRICULA': 'matricula',
      'RUBRICA': 'rubrica',
      'PARCELA': 'numero_parcela',
      'COMPETENCIA': 'competencia_ref',
      'VALOR': 'valor_descontado',
      'COD_OCORRENCIA': 'codigo_ocorrencia',
      'DESC_OCORRENCIA': 'descricao_ocorrencia'
    }
  },
  {
    id: '5',
    nome: 'Fasitec Padrão v1.3',
    averbadora: 'Fasitec',
    formato: 'txt_fixed',
    separador: '',
    header_rows: 0,
    encoding: 'ISO-8859-1',
    date_format: 'YYYYMMDD',
    mapping_json: {
      'CPF[1:11]': 'cpf',
      'MATRICULA[12:22]': 'matricula',
      'VALOR[45:60]': 'valor_descontado',
      'DATA[61:68]': 'data_evento'
    }
  }
];

export const arquivosRetorno: ArquivoRetorno[] = [
  {
    id: '1',
    convenio_id: '1',
    averbadora: 'Neoconsig',
    competencia_ref: '202501',
    nome_arquivo: 'GOV_GO_202501_001.csv',
    hash_arquivo: 'sha256abc123',
    tamanho_bytes: 2548763,
    usuario_upload: 'ana.silva',
    data_upload: '2025-02-05T10:30:00',
    layout_id: '1',
    status_processamento: 'Concluido',
    total_linhas: 15420,
    linhas_processadas: 15420
  },
  {
    id: '2',
    convenio_id: '7',
    averbadora: 'Zetra',
    competencia_ref: '202502',
    nome_arquivo: 'PREF_RJ_202502_V2.txt',
    hash_arquivo: 'sha256def456',
    tamanho_bytes: 1875432,
    usuario_upload: 'carlos.costa',
    data_upload: '2025-03-08T14:15:00',
    layout_id: '2',
    status_processamento: 'ConcluidoComAlertas',
    erros_validacao: '15 linhas com competência em branco - usado filtro informado',
    total_linhas: 8950,
    linhas_processadas: 8935
  },
  {
    id: '3',
    convenio_id: '4',
    averbadora: 'Consigfácil',
    competencia_ref: '202503',
    nome_arquivo: 'PREF_SOROCABA_202503_001.csv',
    hash_arquivo: 'sha256ghi789',
    tamanho_bytes: 3124587,
    usuario_upload: 'ana.silva',
    data_upload: '2025-04-10T09:45:00',
    layout_id: '4',
    status_processamento: 'Processando',
    total_linhas: 18750,
    linhas_processadas: 12450
  }
];

export const fechamentos: CompetenciaFechamento[] = [
  {
    id: '1',
    convenio_id: '1',
    competencia_ref: '202501',
    status: 'Fechada',
    usuario: 'ana.silva',
    data: '2025-02-08T16:30:00',
    tot_enviado: 2548750.00,
    tot_descontado: 2487320.50,
    tot_nao_descontado: 61429.50,
    tot_glosas: 0,
    efetivacao_pct: 97.59
  },
  {
    id: '2',
    convenio_id: '7',
    competencia_ref: '202502',
    status: 'Conciliada',
    usuario: 'carlos.costa',
    data: '2025-03-12T11:20:00',
    tot_enviado: 1875432.00,
    tot_descontado: 1798234.75,
    tot_nao_descontado: 77197.25,
    tot_glosas: 2450.00,
    efetivacao_pct: 95.88
  },
  {
    id: '3',
    convenio_id: '4',
    competencia_ref: '202503',
    status: 'EmConciliacao',
    usuario: 'ana.silva',
    data: '2025-04-10T10:00:00',
    tot_enviado: 3124587.00,
    tot_descontado: 0,
    tot_nao_descontado: 0,
    tot_glosas: 0,
    efetivacao_pct: 0
  }
];

export const motivosOcorrencia: MotivoOcorrencia[] = [
  { codigo: '001', descricao: 'Desconto efetuado com sucesso', categoria: 'Sistemico' },
  { codigo: '002', descricao: 'Servidor não encontrado na folha', categoria: 'Sistemico' },
  { codigo: '003', descricao: 'Margem consignável insuficiente', categoria: 'Margem' },
  { codigo: '004', descricao: 'Rubrica não autorizada para desconto', categoria: 'Rubrica' },
  { codigo: '005', descricao: 'Bloqueio judicial', categoria: 'Judicial' },
  { codigo: '006', descricao: 'Operação cancelada pelo servidor', categoria: 'Cancelamento' },
  { codigo: '007', descricao: 'Servidor afastado/licenciado', categoria: 'Sistemico' }
];

// Mock de dados agregados para KPIs
export const mockKPIData = {
  enviado_valor: 5000000.00,
  enviado_qtd: 25000,
  descontado_valor: 4685000.00,
  descontado_qtd: 23250,
  nao_descontado_valor: 315000.00,
  nao_descontado_qtd: 1750,
  descontado_parcial_valor: 12500.00,
  descontado_parcial_divergencia: 8750.00,
  descontado_parcial_qtd: 125,
  inadimplente_pct: 6.3,
  // Variações vs mês anterior
  descontado_variacao: 2.3,
  nao_descontado_variacao: -1.5
};

export const mockChartData = {
  conveniosProdutos: [
    { convenio: 'Governo de Goiás', produto: 'CartaoCompras', enviado: 1200000, descontado: 1140000 },
    { convenio: 'Governo do Maranhão', produto: 'Emprestimo', enviado: 800000, descontado: 752000 },
    { convenio: 'Governo do Paraná', produto: 'CartaoCompras', enviado: 950000, descontado: 893500 },
    { convenio: 'Prefeitura do Rio de Janeiro', produto: 'FGTS', enviado: 920000, descontado: 874000 },
    { convenio: 'Prefeitura de Sorocaba', produto: 'CartaoCompras', enviado: 750000, descontado: 712500 },
    { convenio: 'Prefeitura de Guarulhos', produto: 'Emprestimo', enviado: 1300000, descontado: 1187000 },
    { convenio: 'Prefeitura de Hortolândia', produto: 'CartaoCompras', enviado: 680000, descontado: 646000 },
    { convenio: 'Prefeitura de Santo André', produto: 'Emprestimo', enviado: 890000, descontado: 845000 },
    { convenio: 'Convênio Neoconsig', produto: 'CartaoCompras', enviado: 540000, descontado: 513000 }
  ],
  inadimplenciaTempo: [
    { mes: 'Ago/24', inadimplencia: 5.8 },
    { mes: 'Set/24', inadimplencia: 6.2 },
    { mes: 'Out/24', inadimplencia: 4.9 },
    { mes: 'Nov/24', inadimplencia: 7.3 },
    { mes: 'Dez/24', inadimplencia: 2.4 },
    { mes: 'Jan/25', inadimplencia: 4.1 }
  ]
};