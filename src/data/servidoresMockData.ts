import type { ServidorCompleto } from '../types/servidores';

const convenios = [
  'Prefeitura de Sorocaba',
  'Prefeitura de Guarulhos',
  'Prefeitura de Hortolândia',
  'Prefeitura do Rio de Janeiro',
  'Governo de Goiás',
  'Governo do Paraná',
  'Governo do Maranhão',
  'Prefeitura de Santo André',
  'Convênio Neoconsig'
];
const categorias = ['Aposentado', 'Pensionista', 'Servidor Ativo', 'Militar', 'CLT'];
const nomes = [
  'Ana Paula Silva', 'Carlos Eduardo Santos', 'Maria José Oliveira', 'João Pedro Souza',
  'Fernanda Costa Lima', 'Ricardo Alves Pereira', 'Juliana Rodrigues', 'Paulo Henrique Martins',
  'Mariana Ferreira', 'Lucas Gabriel Almeida', 'Patricia Santos Costa', 'Roberto Carlos Silva',
  'Camila Oliveira Santos', 'Rafael Moreira Lima', 'Beatriz Souza Pereira', 'Felipe Augusto Costa',
  'Amanda Cristina Silva', 'Rodrigo Ferreira Santos', 'Larissa Maria Oliveira', 'Bruno Henrique Lima',
  'Gabriela Santos Souza', 'Thiago Costa Pereira', 'Vanessa Rodrigues Silva', 'Diego Santos Lima',
  'Natália Oliveira Costa', 'Marcelo Silva Santos', 'Renata Ferreira Souza', 'André Luiz Pereira',
  'Cristina Maria Silva', 'Leonardo Costa Santos', 'Bianca Oliveira Lima', 'Gustavo Henrique Souza',
  'Carolina Santos Pereira', 'Daniel Costa Silva', 'Priscila Ferreira Lima', 'Vinicius Santos Souza'
];

const tiposOperacaoBeneficio = ['Empréstimo Consignado', 'Antecipação Salarial', 'Refinanciamento'];
const tiposOperacaoCartao = ['Compra', 'Saque', 'Parcelamento'];
const estabelecimentos = ['Magazine Luiza', 'Casas Bahia', 'Extra', 'Carrefour', 'Americanas', 'Ponto Frio', 'Supermercado São Paulo', 'Farmácia Drogasil', 'Posto Shell', 'Restaurante Comida Boa', 'Loja de Roupas Fashion', 'Mercado Livre', 'Livraria Cultura'];
const nomesPlanos = ['Plano Saúde Premium', 'Plano Odontológico', 'Seguro de Vida', 'Previdência Privada', 'Plano Bem-Estar'];
const tiposDocumento: Array<'RG/CNH' | 'Contracheque'> = ['RG/CNH', 'Contracheque'];

const gerarCompetencia = (mesesAtras: number): string => {
  const data = new Date();
  data.setMonth(data.getMonth() - mesesAtras);
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${meses[data.getMonth()]}/${data.getFullYear()}`;
};

const calcularPeriodoFatura = (competencia: string, dataCorteDia: number) => {
  const [mes, ano] = competencia.split('/');
  const mesIndex = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].indexOf(mes);

  const dataFim = new Date(parseInt(ano), mesIndex, dataCorteDia - 1);
  const dataInicio = new Date(dataFim);
  dataInicio.setMonth(dataInicio.getMonth() - 1);
  dataInicio.setDate(dataCorteDia);

  const dataFechamento = new Date(dataFim);
  dataFechamento.setDate(dataFechamento.getDate() + 1);

  return {
    periodoInicio: dataInicio.toISOString().split('T')[0],
    periodoFim: dataFim.toISOString().split('T')[0],
    dataFechamento: dataFechamento.toISOString().split('T')[0]
  };
};

const gerarCPF = (index: number): string => {
  const base = String(index).padStart(9, '0');
  return `${base.slice(0, 3)}.${base.slice(3, 6)}.${base.slice(6, 9)}-${(index % 100).toString().padStart(2, '0')}`;
};

const gerarMatricula = (index: number): string => {
  return `MAT${String(index).padStart(6, '0')}`;
};

const gerarTelefone = (index: number): string => {
  const ddd = 11 + (index % 78);
  const numero = String(900000000 + index).slice(0, 9);
  return `(${ddd}) ${numero.slice(0, 5)}-${numero.slice(5)}`;
};

const gerarEmail = (nome: string): string => {
  const username = nome.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return `${username}@email.com`;
};

const gerarData = (diasAtras: number): string => {
  const data = new Date();
  data.setDate(data.getDate() - diasAtras);
  return data.toISOString().split('T')[0];
};

const gerarCEP = (index: number): string => {
  const cep = String(10000000 + (index * 123) % 90000000).padStart(8, '0');
  return `${cep.slice(0, 5)}-${cep.slice(5)}`;
};

const bancos = [
  'Banco do Brasil', 'Caixa Econômica Federal', 'Bradesco',
  'Itaú', 'Santander', 'Banco Inter', 'Nubank'
];

const ufs = ['SP', 'RJ', 'MG', 'BA', 'PR', 'RS', 'PE', 'CE', 'PA', 'SC'];
const cidades = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Curitiba', 'Porto Alegre', 'Recife', 'Fortaleza', 'Belém', 'Florianópolis'];

export const gerarServidoresMock = (): ServidorCompleto[] => {
  const servidores: ServidorCompleto[] = [];

  for (let i = 1; i <= 250; i++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const convenio = convenios[Math.floor(Math.random() * convenios.length)];
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    const ufIndex = Math.floor(Math.random() * ufs.length);

    const hasCartaoCompras = Math.random() > 0.3;
    const hasBeneficioSaque = Math.random() > 0.3;

    const qtdOperacoesBeneficio = hasBeneficioSaque ? Math.floor(Math.random() * 5) + 1 : 0;
    const qtdOperacoesCartao = hasCartaoCompras ? Math.floor(Math.random() * 20) + 5 : 0;
    const qtdPlanos = Math.floor(Math.random() * 3);

    const operacoesBeneficio = Array.from({ length: qtdOperacoesBeneficio }, (_, j) => {
      const prazo = [12, 24, 36, 48, 60, 72, 84][Math.floor(Math.random() * 7)];
      const valorLiberado = Math.floor(Math.random() * 40000 + 5000);
      const taxaMensal = 2.0 + Math.random() * 3.0;
      const valorParcela = (valorLiberado * (taxaMensal / 100) * Math.pow(1 + taxaMensal / 100, prazo)) / (Math.pow(1 + taxaMensal / 100, prazo) - 1);

      const dataInicio = new Date();
      dataInicio.setMonth(dataInicio.getMonth() - Math.floor(Math.random() * 24));

      const parcelasPagas = Math.floor(Math.random() * (prazo * 0.5));
      const statusOptions: Array<'Ativo' | 'Quitado' | 'Quitado com Pendências'> = parcelasPagas === prazo ? ['Quitado'] : (Math.random() > 0.9 ? ['Quitado com Pendências'] : ['Ativo']);

      const parcelas = Array.from({ length: prazo }, (_, k) => {
        const dataVencimento = new Date(dataInicio);
        dataVencimento.setMonth(dataVencimento.getMonth() + k + 1);

        const hoje = new Date();
        const diasAteVencimento = Math.floor((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        const mesesAteVencimento = diasAteVencimento / 30;
        const vp = mesesAteVencimento > 0 ? valorParcela / Math.pow(1 + taxaMensal / 100, mesesAteVencimento) : valorParcela;

        return {
          id: `PARC-${i}-${j}-${k}`,
          numero: k + 1,
          vencimento: dataVencimento.toISOString().split('T')[0],
          valorNominal: valorParcela,
          valorPresente: Math.max(0, vp),
          taxaMensal: taxaMensal,
          status: (k < parcelasPagas ? 'Pago' : 'À vencer') as 'Pago' | 'À vencer'
        };
      });

      return {
        id: `BEN-${i}-${j}`,
        numeroProposta: `PROP-${String(i).padStart(4, '0')}-${String(j + 1).padStart(2, '0')}`,
        data: gerarData(Math.floor(Math.random() * 730)),
        tipo: tiposOperacaoBeneficio[Math.floor(Math.random() * tiposOperacaoBeneficio.length)],
        valor: valorLiberado,
        valorParcela,
        prazo,
        valorLiberado,
        status: statusOptions[0],
        parcelas,
        taxaMensal
      };
    });

    const operacoesCartao = Array.from({ length: qtdOperacoesCartao }, (_, j) => {
      const statusOptions: Array<'Aprovado' | 'Pendente' | 'Estornado'> = ['Aprovado', 'Pendente', 'Estornado'];

      return {
        id: `CART-${i}-${j}`,
        data: gerarData(Math.floor(Math.random() * 180)),
        tipo: tiposOperacaoCartao[Math.floor(Math.random() * tiposOperacaoCartao.length)],
        valor: Math.random() * 2000 + 50,
        status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
        estabelecimento: estabelecimentos[Math.floor(Math.random() * estabelecimentos.length)]
      };
    });

    const planos = Array.from({ length: qtdPlanos }, (_, j) => {
      const situacaoOptions: Array<'Ativo' | 'Inativo' | 'Cancelado'> = ['Ativo', 'Inativo', 'Cancelado'];

      return {
        id: `PLAN-${i}-${j}`,
        nome: nomesPlanos[Math.floor(Math.random() * nomesPlanos.length)],
        situacao: situacaoOptions[Math.floor(Math.random() * situacaoOptions.length)],
        dataAdesao: gerarData(Math.floor(Math.random() * 1095)),
        valorMensal: Math.random() * 500 + 50,
        beneficios: ['Cobertura Nacional', 'Atendimento 24h', 'Sem Carência']
      };
    });

    const documentos = tiposDocumento.map((tipo, j) => {
      const statusOptions: Array<'Enviado' | 'Não enviado'> = ['Enviado', 'Não enviado'];
      const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

      return {
        id: `DOC-${i}-${j}`,
        tipo,
        dataEnvio: status === 'Enviado' ? gerarData(Math.floor(Math.random() * 365)) : '',
        status,
        url: status === 'Enviado' ? '#' : '',
        nomeArquivo: status === 'Enviado' ? `documento_${i}_${j}.pdf` : ''
      };
    });

    const valorTotalBeneficio = operacoesBeneficio.reduce((acc, op) => acc + op.valor, 0);
    const valorTotalCartao = operacoesCartao.reduce((acc, op) => acc + op.valor, 0);

    const dataCorteDia = convenio === 'Prefeitura Municipal' ? 15 : 10;
    const limite = hasCartaoCompras ? Math.floor(Math.random() * 3000 + 1000) : 0;

    const faturas = hasCartaoCompras ? Array.from({ length: 6 }, (_, j) => {
      const comp = gerarCompetencia(j);
      const periodo = calcularPeriodoFatura(comp, dataCorteDia);
      const valorTotal = Math.floor(Math.random() * limite * 0.7 + 100);

      return {
        competencia: comp,
        periodoInicio: periodo.periodoInicio,
        periodoFim: periodo.periodoFim,
        dataFechamento: periodo.dataFechamento,
        competenciaFolha: gerarCompetencia(j - 1),
        valorTotal,
        statusDesconto: j === 0 ? 'Aguardando desconto' : (j === 1 ? 'Em processamento' : 'Descontado'),
        valorDescontado: j > 1 ? valorTotal : 0
      };
    }) : [];

    const transacoes = hasCartaoCompras ? Array.from({ length: Math.floor(Math.random() * 40 + 10) }, (_, j) => {
      const competenciaIdx = Math.floor(Math.random() * Math.min(3, faturas.length));
      const fatura = faturas[competenciaIdx];
      const dataInicio = new Date(fatura.periodoInicio);
      const dataFim = new Date(fatura.periodoFim);
      const diasDiferenca = Math.floor((dataFim.getTime() - dataInicio.getTime()) / (1000 * 60 * 60 * 24));
      const dataTransacao = new Date(dataInicio);
      dataTransacao.setDate(dataTransacao.getDate() + Math.floor(Math.random() * diasDiferenca));

      const tipoTransacao: 'Compra' | 'Estorno' = Math.random() > 0.9 ? 'Estorno' : 'Compra';

      return {
        id: `TRANS-${i}-${j}`,
        data: dataTransacao.toISOString().split('T')[0],
        estabelecimento: estabelecimentos[Math.floor(Math.random() * estabelecimentos.length)],
        valor: tipoTransacao === 'Estorno' ? -(Math.random() * 500 + 50) : (Math.random() * 800 + 20),
        tipo: tipoTransacao,
        competencia: fatura.competencia
      };
    }) : [];

    const valorConsumido = hasCartaoCompras && faturas.length > 0 ? faturas[0].valorTotal : 0;
    const saldoDisponivel = limite - valorConsumido;

    const cartaoDetalhesCompleto = {
      temCartao: hasCartaoCompras,
      dataSolicitacao: hasCartaoCompras ? gerarData(Math.floor(Math.random() * 365 + 180)) : '',
      status: (hasCartaoCompras ? (Math.random() > 0.9 ? 'Bloqueado' : 'Ativo') : 'Ativo') as 'Ativo' | 'Bloqueado',
      aproximacao: (hasCartaoCompras ? (Math.random() > 0.3 ? 'Ativo' : 'Inativo') : 'Inativo') as 'Ativo' | 'Inativo',
      compraOnline: (hasCartaoCompras ? (Math.random() > 0.2 ? 'Ativo' : 'Inativo') : 'Inativo') as 'Ativo' | 'Inativo',
      limite,
      valorConsumido,
      saldoDisponivel,
      faturas,
      transacoes,
      logs: [],
      dataCorteDia
    };

    const hasPlanoAtivo = planos.some(p => p.situacao === 'Ativo');
    const bloqueadoPorOJ = i % 10 === 0;

    servidores.push({
      id: `SRV-${String(i).padStart(4, '0')}`,
      convenio,
      nome,
      cpf: gerarCPF(i),
      matricula: gerarMatricula(i),
      categoria,
      dataCadastro: gerarData(Math.floor(Math.random() * 1095)),
      cartaoCompras: hasCartaoCompras ? 'Ativo' : 'Inativo',
      beneficioSaque: hasBeneficioSaque ? 'Ativo' : 'Inativo',
      plano: hasPlanoAtivo ? 'Ativo' : 'Inativo',
      bloqueadoPorOrdemJudicial: bloqueadoPorOJ,
      telefone: gerarTelefone(i),
      email: gerarEmail(nome),
      rg: `${String(i * 123).padStart(8, '0')}-${(i % 10)}`,
      rgNumero: String(i * 123).padStart(8, '0'),
      rgOrgaoEmissor: 'SSP',
      rgUf: ufs[ufIndex],
      rgDataEmissao: gerarData(Math.floor(Math.random() * 7300)),
      cep: gerarCEP(i),
      logradouro: `Rua ${nome.split(' ')[0]}`,
      numero: String(Math.floor(Math.random() * 9999) + 1),
      complemento: Math.random() > 0.5 ? `Apto ${Math.floor(Math.random() * 200) + 1}` : undefined,
      bairro: `Bairro ${i % 20 + 1}`,
      cidade: cidades[ufIndex],
      uf: ufs[ufIndex],
      banco: bancos[Math.floor(Math.random() * bancos.length)],
      agencia: String(1000 + (i % 9000)).padStart(4, '0'),
      conta: String(10000 + (i * 7) % 90000).padStart(8, '0') + '-' + (i % 10),
      tipoConta: Math.random() > 0.5 ? 'Corrente' : 'Poupança',
      beneficioSaqueDetalhes: {
        status: hasBeneficioSaque ? 'Ativo' : 'Inativo',
        quantidadeOperacoes: qtdOperacoesBeneficio,
        valorTotalLiberado: valorTotalBeneficio,
        operacoes: operacoesBeneficio
      },
      cartaoComprasDetalhes: {
        status: hasCartaoCompras ? 'Ativo' : 'Inativo',
        quantidadeOperacoes: qtdOperacoesCartao,
        valorTotalLiberado: valorTotalCartao,
        operacoes: operacoesCartao
      },
      cartaoDetalhesCompleto,
      planos: {
        quantidadePlanos: qtdPlanos,
        planos
      },
      documentos
    });
  }

  return servidores;
};

export const servidoresMock = gerarServidoresMock();
