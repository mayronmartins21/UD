import React, { useState, useEffect } from 'react';
import { Calendar, Loader2, AlertCircle, DollarSign, FileDown } from 'lucide-react';
import type { ParcelaBeneficio } from '../../../types/servidores';
import { simularAntecipacao, type SimulacaoAntecipacaoResponse } from '../../../lib/antecipacaoService';

interface PainelSimulacaoAntecipacaoProps {
  parcelas: ParcelaBeneficio[];
  taxaMensal: number;
  onClose: () => void;
  servidor?: {
    nome: string;
    cpf: string;
    convenio: string;
  };
  operacao?: {
    numeroProposta: string;
    data: string;
    valorLiberado: number;
    prazo: number;
    valorParcela: number;
  };
}

type SimulacaoState = 'idle' | 'loading' | 'success' | 'error';

export const PainelSimulacaoAntecipacao: React.FC<PainelSimulacaoAntecipacaoProps> = ({
  parcelas,
  taxaMensal,
  onClose,
  servidor,
  operacao
}) => {
  const [state, setState] = useState<SimulacaoState>('idle');
  const [dataReferencia, setDataReferencia] = useState('');
  const [resultado, setResultado] = useState<SimulacaoAntecipacaoResponse | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const hoje = new Date();
    setDataReferencia(hoje.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (dataReferencia) {
      calcularSimulacao();
    }
  }, [dataReferencia]);

  const calcularSimulacao = async () => {
    if (!dataReferencia || parcelas.length === 0) return;

    setState('loading');
    setErro('');

    try {
      const response = await simularAntecipacao({
        parcelas,
        dataReferencia,
        taxaMensal
      });

      setResultado(response);
      setState('success');
    } catch (error) {
      setErro('Não foi possível obter o saldo devedor. Tente novamente ou contate o suporte.');
      setState('error');
    }
  };

  const handleSimularData = (dias: number) => {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    setDataReferencia(data.toISOString().split('T')[0]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const handleExportarCalculoPDF = () => {
    if (!resultado) return;

    const valorFuturo = parcelas.reduce((acc, p) => acc + p.valorNominal, 0);
    const primeiraParcelaVencimento = parcelas.length > 0 ? parcelas[0].vencimento : '';
    const ultimaParcelaVencimento = parcelas.length > 0 ? parcelas[parcelas.length - 1].vencimento : '';

    const dadosExportacao = {
      dataExportacao: new Date().toISOString(),
      dataReferencia: resultado.dataBase,
      cliente: {
        nome: servidor?.nome || 'Cliente não informado',
        cpf: servidor?.cpf || 'CPF não informado'
      },
      contrato: {
        originador: 'USEDIGI MEIOS DE PAGAMENTO LTDA.',
        cedente: 'N/A',
        dataCessao: operacao?.data || new Date().toISOString(),
        valorAquisicao: operacao?.valorLiberado || 0,
        dataOriginacao: operacao?.data || new Date().toISOString(),
        tipoInstrumento: 'CCB',
        produto: 'BENEFÍCIO SAQUE',
        convenio: servidor?.convenio || 'Convênio não informado',
        numeroProposta: operacao?.numeroProposta || 'N/A'
      },
      financeiro: {
        valorPresente: resultado.saldoDevedor,
        valorLiberado: operacao?.valorLiberado || 0,
        valorFuturo: valorFuturo,
        valorParcela: operacao?.valorParcela || 0,
        taxaContrato: taxaMensal,
        taxaCessao: 0,
        totalParcelas: resultado.quantidadeParcelas,
        diaVencimento: 15,
        primeiroVencimento: primeiraParcelaVencimento,
        ultimoVencimento: ultimaParcelaVencimento,
        tarifa: 0,
        cetAnual: 0
      },
      parcelas: parcelas.map(p => ({
        numero: p.numero,
        vencimento: p.vencimento,
        valorNominal: p.valorNominal,
        valorPresente: p.valorPresente,
        taxaMensal: p.taxaMensal,
        status: p.status
      })),
      totais: {
        valorPresente: resultado.saldoDevedor,
        quantidadeParcelas: resultado.quantidadeParcelas
      }
    };

    console.log('Exportando cálculo em PDF:', dadosExportacao);
    alert(`Exportação de Cálculo PDF iniciada!\n\nContrato: ${operacao?.numeroProposta || 'N/A'}\nCliente: ${servidor?.nome || 'N/A'}\nParcelas: ${resultado.quantidadeParcelas}\nSaldo Devedor: ${formatCurrency(resultado.saldoDevedor)}\n\nO relatório detalhado será gerado em formato PDF.`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50">
        <h4 className="text-base font-semibold text-gray-900">Simulação de Antecipação</h4>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Data de referência para quitação
          </label>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => handleSimularData(0)}
                disabled={state === 'loading'}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hoje
              </button>
              <button
                onClick={() => handleSimularData(1)}
                disabled={state === 'loading'}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +1 dia
              </button>
              <button
                onClick={() => handleSimularData(7)}
                disabled={state === 'loading'}
                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +7 dias
              </button>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={dataReferencia}
                onChange={(e) => setDataReferencia(e.target.value)}
                disabled={state === 'loading'}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {state === 'loading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-900">Calculando saldo devedor</p>
            <p className="text-xs text-gray-500 mt-1">Consultando parceiro financeiro...</p>
          </div>
        )}

        {state === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-red-900 mb-1">Erro ao processar simulação</h5>
                <p className="text-sm text-red-700 mb-4">{erro}</p>
                <button
                  onClick={calcularSimulacao}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          </div>
        )}

        {state === 'success' && resultado && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Parcelas selecionadas</p>
                  <p className="text-lg font-bold text-gray-900">{resultado.quantidadeParcelas}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Valor nominal total</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(resultado.valorNominalTotal)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-6 border-2 border-teal-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-teal-600 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">Saldo devedor para quitação</p>
                  <p className="text-xs text-gray-500">Em {formatDate(resultado.dataBase)}</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-teal-900">{formatCurrency(resultado.saldoDevedor)}</p>
            </div>

            <button
              onClick={handleExportarCalculoPDF}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm shadow-sm"
            >
              <FileDown className="w-4 h-4" />
              Exportar Cálculo (PDF)
            </button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs text-yellow-800">
                <strong>Atenção:</strong> Os valores simulados são baseados na data de referência escolhida e podem sofrer alterações.
                A confirmação definitiva será fornecida pelo parceiro financeiro no momento da quitação.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
