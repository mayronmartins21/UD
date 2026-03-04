import type { ConvenioCompleto } from '../types/convenios';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface ConvenioInsert {
  processadora: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  tempo_margem: number;
  dias_proposta: number;
  percentual_recolhimento: number;
  dia_repasse: number;
  dia_corte: number;
  status: string;
}

export const salvarConvenio = async (convenio: Partial<ConvenioCompleto>): Promise<ConvenioCompleto> => {
  const convenioData: ConvenioInsert = {
    processadora: convenio.processadora || '',
    razao_social: convenio.razaoSocial || '',
    nome_fantasia: convenio.nomeFantasia || '',
    cnpj: convenio.cnpj || '',
    tempo_margem: convenio.tempoMargem || 30,
    dias_proposta: convenio.diasProposta || 15,
    percentual_recolhimento: convenio.percentualRecolhimento || 0,
    dia_repasse: convenio.diaRepasse || 1,
    dia_corte: convenio.diaCorte || 1,
    status: convenio.status || 'ativo'
  };

  const response = await fetch(`${SUPABASE_URL}/rest/v1/convenios`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(convenioData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro ao salvar convênio');
  }

  const [data] = await response.json();

  if (convenio.parametrizacao) {
    const parametrizacaoData = {
      convenio_id: data.id,
      utiliza_token_consulta: convenio.parametrizacao.utilizaTokenConsulta || false,
      utiliza_token_averbacao: convenio.parametrizacao.utilizaTokenAverbacao || false,
      utiliza_senha_consignacao: convenio.parametrizacao.utilizaSenhaConsignacao || false,
      eh_estabelecimento: convenio.parametrizacao.ehEstabelecimento || false,
      cartao_compras_liberado: convenio.parametrizacao.cartaoComprasLiberado || false,
      atendimento: convenio.parametrizacao.atendimento || '',
      realiza_oferta_saque_facil: convenio.parametrizacao.realizaOfertaSaqueFacil || false,
      cartao_saque_facil_liberado: convenio.parametrizacao.cartaoSaqueFacilLiberado || false,
      categorias_cartao_compras: convenio.parametrizacao.categoriasCartaoCompras || [],
      categorias_saque_facil: convenio.parametrizacao.categoriasSaqueFacil || []
    };

    await fetch(`${SUPABASE_URL}/rest/v1/parametrizacoes_convenio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(parametrizacaoData)
    });
  }

  if (convenio.contatos && convenio.contatos.length > 0) {
    const contatosData = convenio.contatos.map(contato => ({
      convenio_id: data.id,
      nome: contato.nome,
      email: contato.email,
      celular: contato.celular,
      telefone: contato.telefone,
      departamento: contato.departamento,
      tipo: contato.tipo,
      observacao: contato.observacao,
      ativo: contato.ativo
    }));

    await fetch(`${SUPABASE_URL}/rest/v1/contatos_convenio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify(contatosData)
    });
  }

  return {
    id: data.id,
    processadora: data.processadora,
    razaoSocial: data.razao_social,
    nomeFantasia: data.nome_fantasia,
    cnpj: data.cnpj,
    tempoMargem: data.tempo_margem,
    diasProposta: data.dias_proposta,
    percentualRecolhimento: data.percentual_recolhimento,
    diaRepasse: data.dia_repasse,
    diaCorte: data.dia_corte,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    agendasCorte: [],
    arquivosDebito: [],
    contatos: convenio.contatos || [],
    parametrizacao: convenio.parametrizacao,
    prazos: [],
    decretos: [],
    roteirosOperacionais: []
  };
};

export const buscarConvenios = async (): Promise<ConvenioCompleto[]> => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/convenios?select=*`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error('Erro ao buscar convênios');
  }

  const data = await response.json();

  return data.map((item: any) => ({
    id: item.id,
    processadora: item.processadora,
    razaoSocial: item.razao_social,
    nomeFantasia: item.nome_fantasia,
    cnpj: item.cnpj,
    tempoMargem: item.tempo_margem,
    diasProposta: item.dias_proposta,
    percentualRecolhimento: item.percentual_recolhimento,
    diaRepasse: item.dia_repasse,
    diaCorte: item.dia_corte,
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    agendasCorte: [],
    arquivosDebito: [],
    contatos: [],
    prazos: [],
    decretos: [],
    roteirosOperacionais: []
  }));
};
