import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { DadosClienteStep } from './DadosClienteStep';
import { DocumentosStep } from './DocumentosStep';
import { ReservaStep } from './ReservaStep';
import { CCBStep } from './CCBStep';
import { HistoricoPropostas } from './HistoricoPropostas';
import { SimuladorStep } from './SimuladorStep';
import { AprovacaoStep } from './AprovacaoStep';
import { BuscarPropostaUnificadoModal } from './BuscarPropostaUnificadoModal';
import { ReapresentarDadosBancariosModal, DadosBancarios } from './ReapresentarDadosBancariosModal';
import { AlertaCorrecao } from './AlertaCorrecao';
import { SalvarProgressoModal } from './SalvarProgressoModal';
import { PropostaComCorrecoes } from '../../types/propostas';
import { propostaService } from '../../lib/propostaService';
import { ETAPAS_LABELS } from '../../types/propostas';

export interface ClienteData {
  // Dados Pessoais
  processadora: string;
  convenio: string;
  categoria: string;
  cpf: string;
  matricula: string;
  nome: string;
  situacaoFuncional: string;
  dataNascimento: string;
  sexo: string;
  celular: string;
  email: string;
  nomeMae: string;
  nomePai: string;
  estadoCivil: string;
  nacionalidade: string;
  tipoDocumento: string;
  numeroDocumento: string;
  uf: string;
  orgaoEmissor: string;
  dataEmissao: string;
  
  // Endereço
  cep: string;
  endereco: string;
  bairro: string;
  numero: string;
  complemento: string;
  tipoEndereco: string;
  ufEndereco: string;
  cidade: string;
  rendaBruta: string;
  
  // Dados Bancários
  banco: string;
  agencia: string;
  conta: string;
  digito: string;
  tipoConta: string;
}

export interface DocumentoData {
  id: string;
  tipo: 'rg_frente' | 'rg_verso' | 'contracheque' | 'comprovante_reserva';
  nome: string;
  arquivo: File;
  status: 'uploading' | 'success' | 'error';
  url?: string;
}

export interface ReservaData {
  convenio: string;
  metodoAutenticacao: 'senha' | 'token' | 'sem_auth';
  senha?: string;
  token?: string;
  status: 'idle' | 'loading' | 'approved' | 'pending' | 'rejected';
  codigoReserva?: string;
  dataExpiracao?: string;
  motivo?: string;
}

export interface CCBData {
  numeroContrato?: string;
  valorContratado?: number;
  prazo?: number;
  parcelas?: number;
  linkCCB?: string;
  status: 'idle' | 'generating' | 'generated' | 'error';
}

export interface AprovacaoData {
  status: 'aguardando' | 'aprovada' | 'reprovada' | 'ajuste_solicitado';
  dataEnvio?: string;
  observacoes?: string;
  responsavel?: string;
  dataAprovacao?: string;
}

export interface SimuladorData {
  convenio: string;
  cpf: string;
  matricula: string;
  dataNascimento: string;
  tipoSimulacao: 'por_valor_parcela' | 'por_valor_total';
  valor: string;
  prazo: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  resultados?: {
    valorLiberado: number;
    valorParcela: number;
    prazo: number;
    primeiroVencimento: string;
    ultimoVencimento: string;
    cetMensal: number;
    cetAnual: number;
    valorIOF: number;
  };
  erro?: string;
}

interface PropostaPendente {
  id: string;
  numero_proposta: string;
  nome_cliente: string;
  cpf: string;
  matricula: string;
  convenio: string;
  valor_liberado: number;
  status_ccb: string;
  link_ccb: string;
}

interface CadastroClienteTabProps {
  onPropostaEmAndamento?: (emAndamento: boolean) => void;
  mostrarPopupSalvar?: boolean;
  onConfirmarSalvar?: () => void;
  onCancelarSalvar?: () => void;
}

export const CadastroClienteTab: React.FC<CadastroClienteTabProps> = ({
  onPropostaEmAndamento,
  mostrarPopupSalvar = false,
  onConfirmarSalvar,
  onCancelarSalvar
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [simuladorData, setSimuladorData] = useState<SimuladorData>({} as SimuladorData);
  const [clienteData, setClienteData] = useState<ClienteData>({} as ClienteData);
  const [documentos, setDocumentos] = useState<DocumentoData[]>([]);
  const [reservaData, setReservaData] = useState<ReservaData>({} as ReservaData);
  const [ccbData, setCCBData] = useState<CCBData>({ status: 'idle' });
  const [aprovacaoData, setAprovacaoData] = useState<AprovacaoData>({ status: 'aguardando' });
  const [showBuscarModal, setShowBuscarModal] = useState(false);
  const [showReapresentarModal, setShowReapresentarModal] = useState(false);
  const [propostaAtual, setPropostaAtual] = useState<PropostaComCorrecoes | null>(null);
  const [propostaReapresentar, setPropostaReapresentar] = useState<PropostaComCorrecoes | null>(null);
  const userId = 'user-mock-id';
  const [temDadosPreenchidos, setTemDadosPreenchidos] = useState(false);

  // Mock de propostas pendentes
  const mockPropostas: PropostaPendente[] = [
    {
      id: '1',
      numero_proposta: 'CCB20250127001',
      nome_cliente: 'Maria Silva Santos',
      cpf: '123.456.789-01',
      matricula: '123456',
      convenio: 'Governo de Goiás',
      valor_liberado: 5000.00,
      status_ccb: 'Pendente de assinatura',
      link_ccb: 'https://ccb.usedigi.com.br/contrato/CCB20250127001'
    },
    {
      id: '2',
      numero_proposta: 'CCB20250127002',
      nome_cliente: 'João Carlos Oliveira',
      cpf: '987.654.321-09',
      matricula: '789012',
      convenio: 'Prefeitura do Rio de Janeiro',
      valor_liberado: 7500.00,
      status_ccb: 'Pendente de assinatura',
      link_ccb: 'https://ccb.usedigi.com.br/contrato/CCB20250127002'
    },
    {
      id: '3',
      numero_proposta: 'CCB20250127003',
      nome_cliente: 'Ana Paula Rodrigues',
      cpf: '456.789.123-45',
      matricula: '345678',
      convenio: 'Governo do Maranhão',
      valor_liberado: 3200.00,
      status_ccb: 'Pendente de assinatura',
      link_ccb: 'https://ccb.usedigi.com.br/contrato/CCB20250127003'
    }
  ];

  const steps = [
    { number: 1, title: 'Simulador', description: 'Simulação de proposta' },
    { number: 2, title: 'Dados Pessoais', description: 'Informações pessoais e endereço' },
    { number: 3, title: 'Documentos', description: 'Upload de documentos necessários' },
    { number: 4, title: 'Reserva', description: 'Reserva de margem consignável' },
    { number: 5, title: 'Em Aprovação', description: 'Análise interna da proposta' },
    { number: 6, title: 'CCB', description: 'Geração do contrato digital' }
  ];

  useEffect(() => {
    salvarProgressoAutomatico();
  }, [currentStep, simuladorData, clienteData, documentos, reservaData]);

  useEffect(() => {
    const possuiDados =
      currentStep > 1 &&
      ((clienteData && Object.keys(clienteData).length > 0) ||
      documentos.length > 0);

    setTemDadosPreenchidos(possuiDados);

    if (onPropostaEmAndamento) {
      onPropostaEmAndamento(possuiDados && currentStep < 6);
    }
  }, [currentStep, simuladorData, clienteData, documentos, onPropostaEmAndamento]);

  const salvarProgressoAutomatico = async () => {
    if (!propostaAtual) return;

    try {
      const etapaMap = {
        1: 'simulador' as const,
        2: 'cadastro' as const,
        3: 'documentos' as const,
        4: 'reserva' as const,
        5: 'aprovacao' as const,
        6: 'ccb' as const
      };

      await propostaService.salvarProgresso({
        numero_proposta: propostaAtual.numero_proposta,
        cpf_cliente: propostaAtual.cpf_cliente,
        nome_cliente: propostaAtual.nome_cliente,
        etapa_atual: etapaMap[currentStep as keyof typeof etapaMap],
        status: propostaAtual.status,
        dados_simulador: simuladorData,
        dados_cadastro: clienteData,
        dados_documentos: { documentos },
        dados_reserva: reservaData
      }, userId);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      const novaEtapa = currentStep + 1;
      const etapaMap = {
        1: 'simulador' as const,
        2: 'cadastro' as const,
        3: 'documentos' as const,
        4: 'reserva' as const,
        5: 'aprovacao' as const,
        6: 'ccb' as const
      };

      if (propostaAtual) {
        const etapaAtualNome = etapaMap[currentStep as keyof typeof etapaMap];
        const novaEtapaNome = etapaMap[novaEtapa as keyof typeof etapaMap];

        if (propostaService.validarAvancoEtapa(etapaAtualNome, novaEtapaNome)) {
          setCurrentStep(novaEtapa);
        } else {
          alert('Não é possível pular etapas. Complete a etapa atual antes de avançar.');
        }
      } else {
        setCurrentStep(novaEtapa);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSimuladorNext = (dadosCliente: Partial<ClienteData>) => {
    setClienteData(prev => ({ ...prev, ...dadosCliente }));
    handleNext();
  };

  const handleAbrirProposta = (proposta: PropostaComCorrecoes) => {
    setPropostaAtual(proposta);

    const etapaParaStep = {
      'simulador': 1,
      'cadastro': 2,
      'documentos': 3,
      'reserva': 4,
      'aprovacao': 5,
      'ccb': 6
    };

    const stepInicial = etapaParaStep[proposta.etapa_atual];
    setCurrentStep(stepInicial);

    if (proposta.dados_simulador) {
      setSimuladorData(proposta.dados_simulador as SimuladorData);
    }
    if (proposta.dados_cadastro) {
      setClienteData(proposta.dados_cadastro as ClienteData);
    }
    if (proposta.dados_documentos && proposta.dados_documentos.documentos) {
      setDocumentos(proposta.dados_documentos.documentos as DocumentoData[]);
    }
    if (proposta.dados_reserva) {
      setReservaData(proposta.dados_reserva as ReservaData);
    }

    setShowBuscarModal(false);
  };

  const handleReapresentarDadosBancarios = (proposta: PropostaComCorrecoes) => {
    setPropostaReapresentar(proposta);
    setShowBuscarModal(false);
    setShowReapresentarModal(true);
  };

  const handleSubmitReapresentacao = (dados: DadosBancarios) => {
    console.log('Reapresentando dados bancários:', dados);
    console.log('Proposta:', propostaReapresentar?.numero_proposta);

    alert(`Dados bancários reapresentados com sucesso!\n\nProposta: ${propostaReapresentar?.numero_proposta}\nBanco: ${dados.banco}\nAgência: ${dados.agencia}\nConta: ${dados.conta}`);

    setShowReapresentarModal(false);
    setPropostaReapresentar(null);
  };

  const getEtapaAtualNome = () => {
    const etapaMap: Record<number, string> = {
      1: 'simulador',
      2: 'cadastro',
      3: 'documentos',
      4: 'reserva',
      5: 'aprovacao',
      6: 'ccb'
    };
    return etapaMap[currentStep] || 'simulador';
  };

  const handleSalvarESair = async () => {
    if (!propostaAtual && temDadosPreenchidos) {
      const numeroProposta = `PROP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      const etapaMap = {
        1: 'simulador' as const,
        2: 'cadastro' as const,
        3: 'documentos' as const,
        4: 'reserva' as const,
        5: 'aprovacao' as const,
        6: 'ccb' as const
      };

      await propostaService.salvarProgresso({
        numero_proposta: numeroProposta,
        cpf_cliente: clienteData.cpf || simuladorData.cpf || '',
        nome_cliente: clienteData.nome || '',
        etapa_atual: etapaMap[currentStep as keyof typeof etapaMap],
        status: 'em_andamento',
        dados_simulador: simuladorData,
        dados_cadastro: clienteData,
        dados_documentos: { documentos },
        dados_reserva: reservaData
      }, userId);
    }

    if (onConfirmarSalvar) {
      onConfirmarSalvar();
    }
  };

  const handleDescartarESair = () => {
    if (onConfirmarSalvar) {
      onConfirmarSalvar();
    }
  };

  const handleContinuarEditando = () => {
    if (onCancelarSalvar) {
      onCancelarSalvar();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SimuladorStep
            data={simuladorData}
            onChange={setSimuladorData}
            onNext={handleSimuladorNext}
          />
        );
      case 2:
        return (
          <DadosClienteStep
            data={clienteData}
            onChange={setClienteData}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <DocumentosStep
            documentos={documentos}
            onChange={setDocumentos}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <ReservaStep
            data={reservaData}
            onChange={setReservaData}
            clienteData={clienteData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <AprovacaoStep
            data={aprovacaoData}
            onChange={setAprovacaoData}
            clienteData={clienteData}
            reservaData={reservaData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 6:
        return (
          <CCBStep
            data={ccbData}
            onChange={setCCBData}
            clienteData={clienteData}
            reservaData={reservaData}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Formalizador</h2>
            <p className="text-gray-600 mt-1">
              Processo completo de cadastro, documentação e formalização
            </p>
          </div>
          
          <button
            onClick={() => setShowBuscarModal(true)}
            className="px-4 py-2 rounded-lg border border-blue-300 text-blue-700 transition-all bg-blue-50 hover:bg-blue-100 hover:cursor-pointer flex items-center gap-2 font-medium shadow-sm"
          >
            <Search className="w-4 h-4" />
            Buscar Proposta
          </button>
        </div>

        <ProgressBar steps={steps} currentStep={currentStep} />
      </div>

      {propostaAtual && propostaAtual.correcoes && propostaAtual.correcoes.length > 0 && (
        <AlertaCorrecao
          correcoes={propostaAtual.correcoes}
          etapaAtual={getEtapaAtualNome()}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {renderStepContent()}
      </div>

      {/* Histórico de Propostas */}
      <div className="mt-8">
        <HistoricoPropostas cpf={clienteData.cpf} />
      </div>

      {/* Modal Buscar Proposta Unificado */}
      <BuscarPropostaUnificadoModal
        isOpen={showBuscarModal}
        onClose={() => setShowBuscarModal(false)}
        onAbrirProposta={handleAbrirProposta}
        onReapresentarDadosBancarios={handleReapresentarDadosBancarios}
      />

      {/* Modal Reapresentar Dados Bancários */}
      <ReapresentarDadosBancariosModal
        isOpen={showReapresentarModal}
        proposta={propostaReapresentar}
        onClose={() => {
          setShowReapresentarModal(false);
          setPropostaReapresentar(null);
        }}
        onReapresentar={handleSubmitReapresentacao}
      />

      {/* Modal Salvar Progresso */}
      <SalvarProgressoModal
        isOpen={mostrarPopupSalvar}
        onSalvar={handleSalvarESair}
        onDescartar={handleDescartarESair}
        onCancelar={handleContinuarEditando}
        etapaAtual={ETAPAS_LABELS[getEtapaAtualNome() as keyof typeof ETAPAS_LABELS] || 'Simulador'}
      />
    </div>
  );
};
