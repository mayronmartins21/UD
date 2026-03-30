import type { VencimentoContrato, VencimentoKPIData, VencimentoResumo } from '../types/vencimentoContratos';

const nomes = [
  'Maria da Silva Santos', 'José Carlos Oliveira', 'Ana Paula Costa', 'Paulo Roberto Lima',
  'Fernanda Souza Alves', 'Carlos Eduardo Pereira', 'Juliana Martins', 'Ricardo Henrique Rocha',
  'Patrícia Ferreira', 'Marcelo Antonio Silva', 'Luciana Oliveira Costa', 'Rafael dos Santos',
  'Beatriz Almeida Lima', 'Diego Carvalho', 'Camila Rodrigues', 'André Luiz Gomes',
  'Mariana Barbosa', 'Felipe Augusto Reis', 'Vanessa Cristina Souza', 'Bruno Henrique Dias',
  'Amanda Silva Pereira', 'Thiago Santos Costa', 'Aline Ribeiro', 'Leonardo Fernandes',
  'Gabriela Martins Lima', 'Rodrigo Alves Santos', 'Larissa Costa Oliveira', 'Daniel Souza',
  'Priscila Ferreira Rocha', 'Gustavo Lima Silva', 'Renata Almeida Costa', 'Marcos Paulo Santos'
];

const convenios = [
  'Prefeitura de Guarulhos',
  'Prefeitura de Hortolândia',
  'Prefeitura de Santo André',
  'Prefeitura do Rio de Janeiro',
  'Governo de Goiás',
  'Prefeitura de Sorocaba',
  'Prefeitura de São Gonçalo'
];

const categorias = ['Estatutário', 'Aposentado', 'Pensionista', 'CLT'];
const canais = ['UD', 'Soft', 'Prisma'];

function gerarCPF(): string {
  const num1 = Math.floor(Math.random() * 900) + 100;
  const num2 = Math.floor(Math.random() * 900) + 100;
  const num3 = Math.floor(Math.random() * 900) + 100;
  const num4 = Math.floor(Math.random() * 90) + 10;
  return `${num1}.${num2}.${num3}-${num4}`;
}

function gerarMatricula(): string {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

function gerarCelular(): string {
  const ddd = Math.floor(Math.random() * 20) + 11;
  const num = Math.floor(Math.random() * 90000000) + 910000000;
  return `(${ddd}) 9${String(num).substring(0, 4)}-${String(num).substring(4)}`;
}

function gerarEmail(nome: string): string {
  const nomeLimpo = nome.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')[0];
  const sobrenome = nome.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')[1] || '';
  const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com'];
  const dominio = dominios[Math.floor(Math.random() * dominios.length)];
  return `${nomeLimpo}.${sobrenome}@${dominio}`;
}

function determinarStatusOportunidade(parcelasRestantes: number, totalParcelas: number): 'alta' | 'media' | 'baixa' {
  const progresso = ((totalParcelas - parcelasRestantes) / totalParcelas) * 100;

  if (progresso >= 90) return 'alta';
  if (progresso >= 75) return 'media';
  return 'baixa';
}

function gerarContratos(quantidade: number, faixaDias: { min: number; max: number }): VencimentoContrato[] {
  const contratos: VencimentoContrato[] = [];

  for (let i = 0; i < quantidade; i++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const totalParcelas = [24, 36, 48, 60, 72, 84][Math.floor(Math.random() * 6)];
    const diasParaVencimento = Math.floor(Math.random() * (faixaDias.max - faixaDias.min + 1)) + faixaDias.min;

    let faixaVencimento: 'ate30' | 'ate60' | 'ate90' | 'acima90';
    if (diasParaVencimento <= 30) faixaVencimento = 'ate30';
    else if (diasParaVencimento <= 60) faixaVencimento = 'ate60';
    else if (diasParaVencimento <= 90) faixaVencimento = 'ate90';
    else faixaVencimento = 'acima90';

    let parcelasRestantes: number;
    if (faixaVencimento === 'ate30') {
      parcelasRestantes = Math.floor(Math.random() * 2);
    } else if (faixaVencimento === 'ate60') {
      parcelasRestantes = Math.floor(Math.random() * 2) + 1;
    } else if (faixaVencimento === 'ate90') {
      parcelasRestantes = Math.floor(Math.random() * 2) + 2;
    } else {
      parcelasRestantes = Math.floor(Math.random() * 8) + 4;
    }

    if (parcelasRestantes > totalParcelas - 1) {
      parcelasRestantes = totalParcelas - 1;
    }

    const parcelasLiquidadas = totalParcelas - parcelasRestantes;

    const vencimentoData = new Date();
    vencimentoData.setMonth(vencimentoData.getMonth() + parcelasRestantes);

    const valorParcela = Math.floor(Math.random() * 300) + 200;
    const valorContrato = valorParcela * totalParcelas;

    const statusOportunidade = determinarStatusOportunidade(parcelasRestantes, totalParcelas);

    contratos.push({
      id: `CONT-${Date.now()}-${i}`,
      convenio: convenios[Math.floor(Math.random() * convenios.length)],
      numeroProposta: `SF-${Math.floor(Math.random() * 900000) + 100000}`,
      contratoExterno: `EXT-${Math.floor(Math.random() * 9000000) + 1000000}`,
      cpf: gerarCPF(),
      matricula: gerarMatricula(),
      nomeServidor: nome,
      categoria: categorias[Math.floor(Math.random() * categorias.length)],
      celular: gerarCelular(),
      email: gerarEmail(nome),
      valorContrato,
      valorParcela,
      qtdeTotalParcelas: totalParcelas,
      qtdeParcelasLiquidadas: parcelasLiquidadas,
      vencimentoUltimaParcela: vencimentoData,
      faixaVencimento,
      diasParaVencimento,
      canal: canais[Math.floor(Math.random() * canais.length)],
      statusOportunidade
    });
  }

  return contratos;
}

export function gerarContratosVencimento(): VencimentoContrato[] {
  return [
    ...gerarContratos(35, { min: 1, max: 30 }),
    ...gerarContratos(28, { min: 31, max: 60 }),
    ...gerarContratos(22, { min: 61, max: 90 }),
    ...gerarContratos(18, { min: 91, max: 180 })
  ];
}

export function calcularKPIs(contratos: VencimentoContrato[]): VencimentoKPIData {
  return {
    totalContratos: contratos.length,
    valorTotalContratos: contratos.reduce((sum, c) => sum + c.valorContrato, 0),
    somaParcelas: contratos.reduce((sum, c) => sum + c.valorParcela, 0),
    contratosAte30Dias: contratos.filter(c => c.faixaVencimento === 'ate30').length,
    contratosAte60Dias: contratos.filter(c => c.faixaVencimento === 'ate60').length,
    contratosAte90Dias: contratos.filter(c => c.faixaVencimento === 'ate90').length
  };
}

export function gerarResumoGrupos(contratos: VencimentoContrato[]): VencimentoResumo[] {
  const grupos = [
    { key: 'ate30', label: 'Daqui a 30 dias' },
    { key: 'ate60', label: 'Daqui a 60 dias' },
    { key: 'ate90', label: 'Daqui a 90 dias' },
    { key: 'acima90', label: 'Acima de 90 dias' }
  ];

  const resumos = grupos.map(grupo => {
    const contratosFaixa = contratos.filter(c => c.faixaVencimento === grupo.key);

    return {
      grupo: grupo.label,
      qtdeContratos: contratosFaixa.length,
      somaValorContratos: contratosFaixa.reduce((sum, c) => sum + c.valorContrato, 0),
      somaValorParcelas: contratosFaixa.reduce((sum, c) => sum + c.valorParcela, 0)
    };
  });

  const total: VencimentoResumo = {
    grupo: 'Total geral',
    qtdeContratos: contratos.length,
    somaValorContratos: contratos.reduce((sum, c) => sum + c.valorContrato, 0),
    somaValorParcelas: contratos.reduce((sum, c) => sum + c.valorParcela, 0)
  };

  return [...resumos, total];
}
