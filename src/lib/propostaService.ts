import { Proposta, PropostaComCorrecoes, PropostaCorrecao, PropostaLog, EtapaProposta, StatusProposta } from '../types/propostas';

export interface SalvarPropostaDTO {
  numero_proposta: string;
  cpf_cliente: string;
  nome_cliente: string;
  etapa_atual: EtapaProposta;
  status: StatusProposta;
  dados_simulador?: Record<string, any>;
  dados_cadastro?: Record<string, any>;
  dados_documentos?: Record<string, any>;
  dados_reserva?: Record<string, any>;
}

export interface RegistrarLogDTO {
  proposta_id: string;
  acao: string;
  etapa_anterior?: EtapaProposta;
  etapa_nova?: EtapaProposta;
  detalhes?: Record<string, any>;
}

export interface SolicitarCorrecaoDTO {
  proposta_id: string;
  correcoes: Array<{
    etapa: string;
    comentario: string;
  }>;
}

class PropostaService {
  async buscarPropostas(): Promise<PropostaComCorrecoes[]> {
    return [];
  }

  async buscarPropostaPorId(id: string): Promise<PropostaComCorrecoes | null> {
    return null;
  }

  async buscarPropostaPorNumero(numero: string): Promise<PropostaComCorrecoes | null> {
    return null;
  }

  async salvarProgresso(proposta: SalvarPropostaDTO, userId: string): Promise<Proposta> {
    const propostaSalva: Proposta = {
      id: Math.random().toString(36).substring(7),
      numero_proposta: proposta.numero_proposta,
      cpf_cliente: proposta.cpf_cliente,
      nome_cliente: proposta.nome_cliente,
      etapa_atual: proposta.etapa_atual,
      status: proposta.status,
      dados_simulador: proposta.dados_simulador || {},
      dados_cadastro: proposta.dados_cadastro || {},
      dados_documentos: proposta.dados_documentos || {},
      dados_reserva: proposta.dados_reserva || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: userId,
      updated_by: userId
    };

    await this.registrarLog({
      proposta_id: propostaSalva.id,
      acao: 'Progresso salvo',
      etapa_nova: proposta.etapa_atual,
      detalhes: { etapa: proposta.etapa_atual }
    }, userId);

    return propostaSalva;
  }

  async avancarEtapa(
    propostaId: string,
    etapaAtual: EtapaProposta,
    novaEtapa: EtapaProposta,
    dados: Record<string, any>,
    userId: string
  ): Promise<void> {
    await this.registrarLog({
      proposta_id: propostaId,
      acao: 'Etapa avançada',
      etapa_anterior: etapaAtual,
      etapa_nova: novaEtapa,
      detalhes: { dados }
    }, userId);
  }

  async solicitarCorrecao(dto: SolicitarCorrecaoDTO, userId: string): Promise<void> {
    await this.registrarLog({
      proposta_id: dto.proposta_id,
      acao: 'Correção solicitada',
      detalhes: { correcoes: dto.correcoes }
    }, userId);
  }

  async marcarCorrecaoRealizada(correcaoId: string): Promise<void> {
    console.log('Marcando correção como realizada:', correcaoId);
  }

  async buscarCorrecoesAtivas(propostaId: string): Promise<PropostaCorrecao[]> {
    return [];
  }

  async registrarLog(dto: RegistrarLogDTO, userId: string): Promise<PropostaLog> {
    const log: PropostaLog = {
      id: Math.random().toString(36).substring(7),
      proposta_id: dto.proposta_id,
      acao: dto.acao,
      etapa_anterior: dto.etapa_anterior,
      etapa_nova: dto.etapa_nova,
      usuario_id: userId,
      detalhes: dto.detalhes || {},
      created_at: new Date().toISOString()
    };

    return log;
  }

  validarAvancoEtapa(etapaAtual: EtapaProposta, proximaEtapa: EtapaProposta): boolean {
    const ordemEtapas: EtapaProposta[] = [
      'simulador',
      'cadastro',
      'documentos',
      'reserva',
      'aprovacao',
      'ccb',
      'concluida'
    ];

    const indexAtual = ordemEtapas.indexOf(etapaAtual);
    const indexProxima = ordemEtapas.indexOf(proximaEtapa);

    return indexProxima === indexAtual + 1;
  }

  podeEditarEtapa(etapa: EtapaProposta, status: StatusProposta): boolean {
    if (status === 'correcao_solicitada') {
      return ['cadastro', 'documentos', 'reserva'].includes(etapa);
    }

    if (status === 'em_andamento') {
      return true;
    }

    return false;
  }
}

export const propostaService = new PropostaService();
