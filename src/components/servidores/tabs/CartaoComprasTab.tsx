import React, { useState, useMemo } from 'react';
import { CreditCard, Lock, XCircle, FileText, ShoppingCart, RotateCcw } from 'lucide-react';
import type { ServidorCompleto, TransacaoCartao } from '../../../types/servidores';
import { AcaoCartaoModal } from './modals/AcaoCartaoModal';
import { LogsAlteracoesTabela } from '../../common/LogsAlteracoesTabela';
import { logsExemplo } from '../../../data/logsMockData';

interface CartaoComprasTabProps {
  servidor: ServidorCompleto;
}

export const CartaoComprasTab: React.FC<CartaoComprasTabProps> = ({ servidor }) => {
  const cartao = servidor.cartaoDetalhesCompleto;

  const [competenciaSelecionada, setCompetenciaSelecionada] = useState(
    cartao.temCartao && cartao.faturas.length > 0 ? cartao.faturas[0].competencia : ''
  );

  const [modalAberto, setModalAberto] = useState<'nova-via' | 'bloquear' | 'cancelar' | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const faturaAtual = useMemo(() => {
    return cartao.faturas.find(f => f.competencia === competenciaSelecionada);
  }, [cartao.faturas, competenciaSelecionada]);

  const transacoesDaCompetencia = useMemo(() => {
    return cartao.transacoes
      .filter(t => t.competencia === competenciaSelecionada)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  }, [cartao.transacoes, competenciaSelecionada]);

  const handleAcao = (acao: string, motivo: string) => {
    const log = {
      id: `LOG-${Date.now()}`,
      dataHora: new Date().toISOString(),
      usuario: 'Usuário Atual',
      acao,
      situacaoAnterior: cartao.status,
      situacaoNova: acao === 'Bloquear' ? 'Bloqueado' : cartao.status,
      motivo
    };

    console.log('Log de ação registrado:', log);
    alert(`Ação "${acao}" registrada com sucesso!\n\nMotivo: ${motivo}`);
  };

  if (!cartao.temCartao) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Cartão não contratado
          </h3>
          <p className="text-gray-600">
            Este cliente não possui Cartão Compras contratado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Resumo do Cartão</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Data de Solicitação
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {formatDate(cartao.dataSolicitacao)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Status do Cartão
            </p>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                cartao.status === 'Ativo'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {cartao.status}
            </span>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Aproximação (Contactless)
            </p>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                cartao.aproximacao === 'Ativo'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {cartao.aproximacao}
            </span>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Compra Online
            </p>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                cartao.compraOnline === 'Ativo'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {cartao.compraOnline}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Limite (Valor Averbado)
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(cartao.limite)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Consumido na Competência Atual
            </p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(cartao.valorConsumido)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Saldo Disponível
            </p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(cartao.saldoDisponivel)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações do Cartão</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setModalAberto('nova-via')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <CreditCard className="w-4 h-4" />
            Solicitar nova via
          </button>
          <button
            onClick={() => setModalAberto('bloquear')}
            className="flex items-center gap-2 px-4 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
            disabled={cartao.status === 'Bloqueado'}
          >
            <Lock className="w-4 h-4" />
            Bloquear cartão
          </button>
          <button
            onClick={() => setModalAberto('cancelar')}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <XCircle className="w-4 h-4" />
            Cancelar cartão
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Informações da Fatura</h3>
          </div>

          <select
            value={competenciaSelecionada}
            onChange={(e) => setCompetenciaSelecionada(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-sm"
          >
            {cartao.faturas.map((fatura) => (
              <option key={fatura.competencia} value={fatura.competencia}>
                {fatura.competencia}
              </option>
            ))}
          </select>
        </div>

        {faturaAtual ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Período de Consumo
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(faturaAtual.periodoInicio)} a {formatDate(faturaAtual.periodoFim)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Data de Fechamento
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(faturaAtual.dataFechamento)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Competência da Folha
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {faturaAtual.competenciaFolha}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Valor Total da Fatura
              </p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(faturaAtual.valorTotal)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Status do Desconto
              </p>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                {faturaAtual.statusDesconto}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Valor Já Descontado
              </p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(faturaAtual.valorDescontado)}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Selecione uma competência para ver os detalhes</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Transações da Competência {competenciaSelecionada}
            </h3>
          </div>
        </div>

        {transacoesDaCompetencia.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma transação encontrada
            </h4>
            <p className="text-gray-600">
              Não há transações para esta competência
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Estabelecimento
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Movimentação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transacoesDaCompetencia.map((transacao) => (
                  <tr key={transacao.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {formatDate(transacao.data)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transacao.estabelecimento}
                    </td>
                    <td className={`px-6 py-4 text-sm text-right font-semibold whitespace-nowrap ${
                      transacao.tipo === 'Estorno' ? 'text-gray-500' : 'text-gray-900'
                    }`}>
                      {transacao.tipo === 'Estorno' ? '-' : ''}{formatCurrency(Math.abs(transacao.valor))}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {transacao.tipo === 'Estorno' && (
                          <RotateCcw className="w-4 h-4 text-gray-500" />
                        )}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transacao.tipo === 'Compra'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {transacao.tipo}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LogsAlteracoesTabela logs={logsExemplo} />

      <AcaoCartaoModal
        isOpen={modalAberto === 'nova-via'}
        onClose={() => setModalAberto(null)}
        onConfirm={(motivo) => handleAcao('Solicitar nova via', motivo)}
        titulo="Solicitar nova via do cartão"
        descricao="Você está prestes a solicitar uma nova via do cartão. Por favor, informe o motivo desta solicitação."
        tipoBotao="primary"
      />

      <AcaoCartaoModal
        isOpen={modalAberto === 'bloquear'}
        onClose={() => setModalAberto(null)}
        onConfirm={(motivo) => handleAcao('Bloquear cartão', motivo)}
        titulo="Bloquear cartão"
        descricao="Você está prestes a bloquear o cartão. Esta ação impedirá novas transações. Por favor, informe o motivo do bloqueio."
        tipoBotao="warning"
      />

      <AcaoCartaoModal
        isOpen={modalAberto === 'cancelar'}
        onClose={() => setModalAberto(null)}
        onConfirm={(motivo) => handleAcao('Cancelar cartão', motivo)}
        titulo="Cancelar cartão"
        descricao="ATENÇÃO: Você está prestes a cancelar o cartão permanentemente. Esta ação não pode ser desfeita. Por favor, informe o motivo do cancelamento."
        tipoBotao="danger"
      />
    </div>
  );
};
