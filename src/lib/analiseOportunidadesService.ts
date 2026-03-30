import type {
  CadastroAplicativo,
  RegraProduto,
  ResultadoAnalise,
  ClassificacaoLead,
  TipoProduto,
  KPIAnaliseOportunidades,
  ResumoAnalise
} from '../types/aplicativo';

const REGRAS_PADRAO: Record<string, RegraProduto> = {
  cartao_compras: {
    produto: 'cartao_compras',
    idadeMinima: 18,
    idadeMaxima: 80,
    categoriasElegiveis: 'todas',
    margemMinima: 25
  },
  saque_facil: {
    produto: 'saque_facil',
    idadeMinima: 18,
    idadeMaxima: 79,
    categoriasElegiveis: ['Efetivo', 'Aposentado', 'Pensionista'],
    margemMinima: 25
  }
};

function calcularIdade(dataNascimento: Date): number {
  const hoje = new Date();
  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = dataNascimento.getMonth();

  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }

  return idade;
}

function analisarElegibilidade(
  cadastro: CadastroAplicativo,
  regra: RegraProduto
): { classificacao: ClassificacaoLead; motivo: string; idade: number | null } {
  const produto = regra.produto === 'cartao_compras' ? 'Cartão Compras' : 'Saque Fácil';
  const margem = regra.produto === 'cartao_compras' ? cadastro.margemCompras : cadastro.margemSaque;

  if (!cadastro.dataNascimento) {
    return {
      classificacao: 'possivel_lead',
      motivo: 'Dados insuficientes: data de nascimento não informada',
      idade: null
    };
  }

  const idade = calcularIdade(cadastro.dataNascimento);

  if (!cadastro.categoria) {
    return {
      classificacao: 'possivel_lead',
      motivo: 'Dados insuficientes: categoria não informada',
      idade
    };
  }

  if (margem === null || margem === undefined) {
    return {
      classificacao: 'possivel_lead',
      motivo: `Dados insuficientes: margem de ${produto} não informada`,
      idade
    };
  }

  if (idade < regra.idadeMinima) {
    return {
      classificacao: 'lead_desqualificado',
      motivo: `Idade fora da política: ${idade} anos (mínimo ${regra.idadeMinima} anos)`,
      idade
    };
  }

  if (idade > regra.idadeMaxima) {
    return {
      classificacao: 'lead_desqualificado',
      motivo: `Idade fora da política: ${idade} anos (máximo ${regra.idadeMaxima} anos)`,
      idade
    };
  }

  if (regra.categoriasElegiveis !== 'todas') {
    if (!regra.categoriasElegiveis.includes(cadastro.categoria)) {
      return {
        classificacao: 'lead_desqualificado',
        motivo: `Categoria não elegível: ${cadastro.categoria}`,
        idade
      };
    }
  }

  if (margem < regra.margemMinima) {
    return {
      classificacao: 'lead_desqualificado',
      motivo: `Margem insuficiente: R$ ${margem.toFixed(2)} (mínimo R$ ${regra.margemMinima.toFixed(2)})`,
      idade
    };
  }

  return {
    classificacao: 'oportunidade',
    motivo: `Elegível para ${produto}`,
    idade
  };
}

export function analisarCadastro(
  cadastro: CadastroAplicativo,
  produto: TipoProduto
): ResultadoAnalise | ResultadoAnalise[] {
  if (produto === 'todos') {
    return [
      {
        cadastro,
        produto: 'cartao_compras',
        ...analisarElegibilidade(cadastro, REGRAS_PADRAO.cartao_compras)
      },
      {
        cadastro,
        produto: 'saque_facil',
        ...analisarElegibilidade(cadastro, REGRAS_PADRAO.saque_facil)
      }
    ];
  }

  const regra = REGRAS_PADRAO[produto];
  return {
    cadastro,
    produto,
    ...analisarElegibilidade(cadastro, regra)
  };
}

export function analisarCadastros(
  cadastros: CadastroAplicativo[],
  produto: TipoProduto
): ResultadoAnalise[] {
  const resultados: ResultadoAnalise[] = [];

  cadastros.forEach(cadastro => {
    const resultado = analisarCadastro(cadastro, produto);
    if (Array.isArray(resultado)) {
      resultados.push(...resultado);
    } else {
      resultados.push(resultado);
    }
  });

  return resultados;
}

export function calcularKPIs(resultados: ResultadoAnalise[]): KPIAnaliseOportunidades {
  const cadastrosUnicos = new Set(resultados.map(r => r.cadastro.id));
  const totalEntradas = cadastrosUnicos.size;

  const oportunidades = resultados.filter(r => r.classificacao === 'oportunidade');
  const desqualificados = resultados.filter(r => r.classificacao === 'lead_desqualificado');
  const possiveisLeads = resultados.filter(r => r.classificacao === 'possivel_lead');

  const totalOportunidades = oportunidades.length;
  const taxaOportunidade = resultados.length > 0
    ? (totalOportunidades / resultados.length) * 100
    : 0;

  return {
    totalEntradas,
    totalOportunidades,
    totalDesqualificados: desqualificados.length,
    totalPossiveisLeads: possiveisLeads.length,
    taxaOportunidade
  };
}

export function gerarResumoAnalise(resultados: ResultadoAnalise[]): ResumoAnalise[] {
  const produtos = ['cartao_compras', 'saque_facil'] as const;
  const resumos: ResumoAnalise[] = [];

  produtos.forEach(produtoKey => {
    const resultadosProduto = resultados.filter(r => r.produto === produtoKey);

    if (resultadosProduto.length === 0) return;

    const oportunidades = resultadosProduto.filter(r => r.classificacao === 'oportunidade').length;
    const desqualificados = resultadosProduto.filter(r => r.classificacao === 'lead_desqualificado').length;
    const possiveisLeads = resultadosProduto.filter(r => r.classificacao === 'possivel_lead').length;
    const taxaOportunidade = resultadosProduto.length > 0
      ? (oportunidades / resultadosProduto.length) * 100
      : 0;

    resumos.push({
      produto: produtoKey === 'cartao_compras' ? 'Cartão Compras' : 'Saque Fácil',
      totalAnalisado: resultadosProduto.length,
      oportunidades,
      desqualificados,
      possiveisLeads,
      taxaOportunidade
    });
  });

  return resumos;
}

export function gerarInsightsComerciais(resultados: ResultadoAnalise[]): string[] {
  const insights: string[] = [];

  const oportunidadesCartao = resultados.filter(
    r => r.produto === 'cartao_compras' && r.classificacao === 'oportunidade'
  ).length;

  const oportunidadesSaque = resultados.filter(
    r => r.produto === 'saque_facil' && r.classificacao === 'oportunidade'
  ).length;

  const possiveisLeads = resultados.filter(r => r.classificacao === 'possivel_lead').length;

  const desqualificadosPorIdade = resultados.filter(
    r => r.classificacao === 'lead_desqualificado' && r.motivo.includes('Idade fora')
  ).length;

  const desqualificadosPorMargem = resultados.filter(
    r => r.classificacao === 'lead_desqualificado' && r.motivo.includes('Margem insuficiente')
  ).length;

  if (oportunidadesCartao > 0) {
    insights.push(`${oportunidadesCartao} cadastros são elegíveis para Cartão Compras`);
  }

  if (oportunidadesSaque > 0) {
    insights.push(`${oportunidadesSaque} cadastros são elegíveis para Saque Fácil`);
  }

  if (possiveisLeads > 0) {
    insights.push(`${possiveisLeads} registros necessitam de enriquecimento de dados`);
  }

  if (desqualificadosPorIdade > 0) {
    insights.push(`${desqualificadosPorIdade} leads desqualificados por idade fora da política`);
  }

  if (desqualificadosPorMargem > 0) {
    insights.push(`${desqualificadosPorMargem} leads com margem insuficiente`);
  }

  if (insights.length === 0) {
    insights.push('Nenhuma análise disponível para o período selecionado');
  }

  return insights;
}
