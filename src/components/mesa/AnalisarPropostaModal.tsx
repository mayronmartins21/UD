import React, { useState } from 'react';
import { X, User, DollarSign, FileText, Shield, CheckCircle, XCircle, AlertTriangle, Download, Eye, Clock } from 'lucide-react';
import { SolicitarCorrecaoModal } from './SolicitarCorrecaoModal';
import { EtapaCorrecao } from '../../types/propostas';

interface PropostaAnalise {
  id: string;
  numero_proposta: string;
  nome_cliente: string;
  cpf: string;
  convenio: string;
  valor_liberado: number;
  situacao_reserva: 'Aprovada' | 'Pendente' | 'Recusada';
  atendente_responsavel: string;
  data_criacao: string;
  status_atual: 'Aguardando' | 'Aprovada' | 'Reprovada' | 'Ajuste';
}

interface AnalisarPropostaModalProps {
  proposta: PropostaAnalise;
  onClose: () => void;
  onDecisao: (propostaId: string, decisao: 'aprovar' | 'reprovar' | 'ajuste', comentario?: string) => void;
}

export const AnalisarPropostaModal: React.FC<AnalisarPropostaModalProps> = ({
  proposta,
  onClose,
  onDecisao
}) => {
  const [activeTab, setActiveTab] = useState('dados');
  const [showHistorico, setShowHistorico] = useState(false);
  const [comentario, setComentario] = useState('');
  const [showDecisaoModal, setShowDecisaoModal] = useState<'aprovar' | 'reprovar' | null>(null);
  const [showCorrecaoModal, setShowCorrecaoModal] = useState(false);

  // Mock de dados completos da proposta
  const dadosCompletos = {
    // Dados do Cliente
    cliente: {
      nome: proposta.nome_cliente,
      cpf: proposta.cpf,
      dataNascimento: '15/03/1985',
      idade: 39,
      categoria: 'Ativo',
      sexo: 'M',
      celular: '(62) 99999-9999',
      email: 'maria.silva@email.com',
      nomeMae: 'Ana Silva Santos',
      nomePai: 'José Silva Santos',
      estadoCivil: 'Casado(a)',
      nacionalidade: 'Brasileira',
      tipoDocumento: 'RG',
      numeroDocumento: '1234567',
      uf: 'GO',
      orgaoEmissor: 'SSP',
      dataEmissao: '10/01/2020',
      // Endereço
      cep: '74000-000',
      endereco: 'Rua das Flores, 123',
      bairro: 'Centro',
      numero: '123',
      complemento: 'Apto 101',
      cidade: 'Goiânia',
      ufEndereco: 'GO',
      // Dados Bancários
      banco: '001 - Banco do Brasil',
      agencia: '1234',
      conta: '56789',
      digito: '0',
      tipoConta: 'Conta Corrente'
    },
    // Simulação
    simulacao: {
      tipoSimulacao: 'Por valor total',
      valorSolicitado: 5000.00,
      valorAprovado: 5000.00,
      valorParcela: 125.50,
      prazo: 48,
      cetMensal: 2.5,
      cetAnual: 35.8,
      valorIOF: 19.00,
      primeiroVencimento: '05/03/2025',
      ultimoVencimento: '05/02/2029'
    },
    // Documentos
    documentos: [
      { tipo: 'RG Frente', status: 'Enviado', nome: 'rg_frente.pdf' },
      { tipo: 'RG Verso', status: 'Enviado', nome: 'rg_verso.pdf' },
      { tipo: 'Contracheque', status: 'Enviado', nome: 'contracheque.pdf' },
      { tipo: 'Comprovante Reserva', status: 'Não enviado', nome: null }
    ],
    // Reserva
    reserva: {
      codigo: 'RES123456',
      situacao: proposta.situacao_reserva,
      dataReserva: '27/01/2025 10:30',
      dataExpiracao: '03/02/2025',
      mensagemRetorno: proposta.situacao_reserva === 'Aprovada' ? 'Reserva aprovada com sucesso' : 
                      proposta.situacao_reserva === 'Pendente' ? 'Aguardando processamento' : 
                      'Margem insuficiente para o valor solicitado'
    }
  };

  // Mock de histórico
  const historicoAcoes = [
    {
      data: '27/01/2025 10:30',
      usuario: 'ana.silva',
      acao: 'Criação da proposta',
      detalhes: 'Proposta criada no Formalizador'
    },
    {
      data: '27/01/2025 10:35',
      usuario: 'ana.silva',
      acao: 'Dados do cliente preenchidos',
      detalhes: 'Cadastro completo realizado'
    },
    {
      data: '27/01/2025 10:40',
      usuario: 'ana.silva',
      acao: 'Documentos anexados',
      detalhes: 'RG e contracheque enviados'
    },
    {
      data: '27/01/2025 10:45',
      usuario: 'ana.silva',
      acao: 'Reserva de margem',
      detalhes: `Reserva ${dadosCompletos.reserva.codigo} - ${dadosCompletos.reserva.situacao}`
    },
    {
      data: '27/01/2025 10:50',
      usuario: 'sistema',
      acao: 'Enviado para análise',
      detalhes: 'Proposta enviada para mesa de análise'
    }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDecisaoFinal = () => {
    if (showDecisaoModal) {
      onDecisao(proposta.id, showDecisaoModal, comentario);
      setShowDecisaoModal(null);
      setComentario('');
    }
  };

  const handleSolicitarCorrecao = (correcoes: Array<{ etapa: EtapaCorrecao; comentario: string }>) => {
    console.log('Correções solicitadas:', correcoes);
    const comentarioCompleto = correcoes
      .map(c => `[${c.etapa.toUpperCase()}] ${c.comentario}`)
      .join(' | ');
    onDecisao(proposta.id, 'ajuste', comentarioCompleto);
  };

  const renderDadosCliente = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Dados Pessoais</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.nome}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CPF</label>
            <div className="mt-1 text-sm text-gray-900 font-mono">{dadosCompletos.cliente.cpf}</div>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-blue-800">Categoria</label>
            <div className="mt-1 text-lg font-bold text-blue-600">{dadosCompletos.cliente.categoria}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.dataNascimento}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <label className="block text-sm font-medium text-green-800">Idade</label>
            <div className="mt-1 text-lg font-bold text-green-600">{dadosCompletos.cliente.idade} anos</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sexo</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.sexo === 'M' ? 'Masculino' : 'Feminino'}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Celular</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.celular}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">E-mail</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da Mãe</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.nomeMae}</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Endereço</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.cep}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Endereço</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.endereco}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Bairro</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.bairro}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade/UF</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.cidade}/{dadosCompletos.cliente.ufEndereco}</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Dados Bancários</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Banco</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.banco}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Agência</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.agencia}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Conta</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.conta}-{dadosCompletos.cliente.digito}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.cliente.tipoConta}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSimulacao = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Dados da Simulação</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Simulação</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.simulacao.tipoSimulacao}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor Solicitado</label>
            <div className="mt-1 text-sm text-gray-900 font-semibold">{formatCurrency(dadosCompletos.simulacao.valorSolicitado)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor Aprovado</label>
            <div className="mt-1 text-sm text-green-600 font-semibold">{formatCurrency(dadosCompletos.simulacao.valorAprovado)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor da Parcela</label>
            <div className="mt-1 text-sm text-gray-900 font-semibold">{formatCurrency(dadosCompletos.simulacao.valorParcela)}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prazo</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.simulacao.prazo} meses</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Valor IOF</label>
            <div className="mt-1 text-sm text-gray-900">{formatCurrency(dadosCompletos.simulacao.valorIOF)}</div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Taxas e Vencimentos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">CET Mensal</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.simulacao.cetMensal}%</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">CET Anual</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.simulacao.cetAnual}%</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Primeiro Vencimento</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.simulacao.primeiroVencimento}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Último Vencimento</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.simulacao.ultimoVencimento}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentos = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900">Documentos Enviados</h4>
      <div className="space-y-3">
        {dadosCompletos.documentos.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">{doc.tipo}</div>
                {doc.nome && (
                  <div className="text-xs text-gray-500">{doc.nome}</div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {doc.status === 'Enviado' ? (
                <>
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Enviado
                  </span>
                  <button className="text-blue-600 hover:text-blue-800" title="Visualizar">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800" title="Download">
                    <Download className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Não enviado
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReserva = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Informações da Reserva</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Código da Reserva</label>
            <div className="mt-1 text-sm text-gray-900 font-mono">{dadosCompletos.reserva.codigo}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Situação</label>
            <div className="mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                dadosCompletos.reserva.situacao === 'Aprovada' ? 'bg-green-100 text-green-800' :
                dadosCompletos.reserva.situacao === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {dadosCompletos.reserva.situacao}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data da Reserva</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.reserva.dataReserva}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Data de Expiração</label>
            <div className="mt-1 text-sm text-gray-900">{dadosCompletos.reserva.dataExpiracao}</div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem de Retorno</label>
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="text-sm text-gray-900">{dadosCompletos.reserva.mensagemRetorno}</div>
        </div>
      </div>
    </div>
  );

  const renderHistorico = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900">Histórico de Ações</h4>
      <div className="space-y-3">
        {historicoAcoes.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{item.acao}</span>
                <span className="text-xs text-gray-500">{item.data}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.detalhes}</p>
              <p className="text-xs text-gray-500 mt-1">por {item.usuario}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-4 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white mb-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Análise de Proposta</h2>
              <p className="text-sm text-gray-600 mt-1">
                {proposta.numero_proposta} • {proposta.nome_cliente}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dados')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'dados'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Dados do Cliente
              </button>
              <button
                onClick={() => setActiveTab('simulacao')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'simulacao'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DollarSign className="w-4 h-4 inline mr-2" />
                Simulação
              </button>
              <button
                onClick={() => setActiveTab('documentos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documentos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Documentos
              </button>
              <button
                onClick={() => setActiveTab('reserva')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reserva'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Shield className="w-4 h-4 inline mr-2" />
                Reserva
              </button>
              <button
                onClick={() => setShowHistorico(!showHistorico)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  showHistorico
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Histórico
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto mb-6">
            {activeTab === 'dados' && renderDadosCliente()}
            {activeTab === 'simulacao' && renderSimulacao()}
            {activeTab === 'documentos' && renderDocumentos()}
            {activeTab === 'reserva' && renderReserva()}
            {showHistorico && renderHistorico()}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowCorrecaoModal(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 flex items-center"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Solicitar Correção
            </button>
            <button
              onClick={() => setShowDecisaoModal('reprovar')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reprovar
            </button>
            <button
              onClick={() => setShowDecisaoModal('aprovar')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprovar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Correção */}
      <SolicitarCorrecaoModal
        isOpen={showCorrecaoModal}
        onClose={() => setShowCorrecaoModal(false)}
        onConfirmar={handleSolicitarCorrecao}
        propostaNumero={proposta.numero_proposta}
      />

      {/* Modal de Decisão */}
      {showDecisaoModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-60">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {showDecisaoModal === 'aprovar' && 'Aprovar Proposta'}
                {showDecisaoModal === 'reprovar' && 'Reprovar Proposta'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {showDecisaoModal === 'aprovar' && 'A proposta será aprovada e a etapa CCB será liberada.'}
                {showDecisaoModal === 'reprovar' && 'A proposta será reprovada definitivamente.'}
              </p>
            </div>

            {showDecisaoModal === 'reprovar' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo da Reprovação *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Descreva detalhadamente o motivo da reprovação da proposta..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este motivo será registrado no histórico e informado ao atendente.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDecisaoModal(null);
                  setComentario('');
                }}
                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDecisaoFinal}
                disabled={showDecisaoModal === 'reprovar' && !comentario.trim()}
                className={`px-4 py-2 text-white rounded-md ${
                  showDecisaoModal === 'aprovar' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};