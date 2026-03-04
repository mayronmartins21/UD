import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowLeft, FileText, FileSpreadsheet, FileDown, Copy, FolderOpen, Download, Lock } from 'lucide-react';
import type { ServidorCompleto, OperacaoBeneficioSaque } from '../../../types/servidores';
import { QuitacaoManualModal } from './modals/QuitacaoManualModal';
import { RefinanciamentoModal } from './modals/RefinanciamentoModal';
import { PainelSimulacaoAntecipacao } from './PainelSimulacaoAntecipacao';
import { LogsAlteracoesTabela } from '../../common/LogsAlteracoesTabela';
import { logsExemplo } from '../../../data/logsMockData';

interface OperacaoDetalheViewProps {
  servidor: ServidorCompleto;
  operacao: OperacaoBeneficioSaque;
  onVoltar: () => void;
}

export const OperacaoDetalheView: React.FC<OperacaoDetalheViewProps> = ({
  servidor,
  operacao,
  onVoltar
}) => {
  const [parcelasSelecionadas, setParcelasSelecionadas] = useState<Set<string>>(new Set());
  const [modalQuitacao, setModalQuitacao] = useState(false);
  const [modalRefinanciamento, setModalRefinanciamento] = useState(false);
  const [mostrarSimulacao, setMostrarSimulacao] = useState(false);
  const [mostrarDocumentos, setMostrarDocumentos] = useState(false);
  const [loadingVP, setLoadingVP] = useState(true);
  const documentosRef = useRef<HTMLDivElement>(null);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Quitado':
        return 'bg-blue-100 text-blue-800';
      case 'Quitado com Pendências':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getParcelaStatusColor = (status: string) => {
    switch (status) {
      case 'Pago':
        return 'bg-blue-100 text-blue-700';
      case 'À vencer':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const parcelasDisponiveis = useMemo(() => {
    return operacao.parcelas.filter(p => p.status === 'À vencer');
  }, [operacao.parcelas]);

  const todasParcelasSelecionadas = useMemo(() => {
    if (parcelasDisponiveis.length === 0) return false;
    return parcelasDisponiveis.every(p => parcelasSelecionadas.has(p.id));
  }, [parcelasDisponiveis, parcelasSelecionadas]);

  const valorTotalSelecionado = useMemo(() => {
    const parcelas = operacao.parcelas.filter(p => parcelasSelecionadas.has(p.id));
    return parcelas.reduce((acc, p) => acc + p.valorPresente, 0);
  }, [operacao.parcelas, parcelasSelecionadas]);

  const parcelasSelecionadasArray = useMemo(() => {
    return operacao.parcelas.filter(p => parcelasSelecionadas.has(p.id));
  }, [operacao.parcelas, parcelasSelecionadas]);

  useEffect(() => {
    const carregarValoresVP = async () => {
      setLoadingVP(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
      } finally {
        setLoadingVP(false);
      }
    };

    carregarValoresVP();
  }, [operacao.numeroProposta]);

  const handleToggleParcela = (parcelaId: string) => {
    const novaSelecao = new Set(parcelasSelecionadas);
    if (novaSelecao.has(parcelaId)) {
      novaSelecao.delete(parcelaId);
    } else {
      novaSelecao.add(parcelaId);
    }
    setParcelasSelecionadas(novaSelecao);
    setMostrarSimulacao(false);
  };

  const handleToggleTodasParcelas = () => {
    if (todasParcelasSelecionadas) {
      setParcelasSelecionadas(new Set());
    } else {
      const todasIds = parcelasDisponiveis.map(p => p.id);
      setParcelasSelecionadas(new Set(todasIds));
    }
    setMostrarSimulacao(false);
  };

  const handleCalcularAntecipacao = () => {
    if (parcelasSelecionadas.size === 0) return;
    setMostrarSimulacao(true);
  };

  const handleQuitacao = (motivo: string) => {
    const log = {
      dataHora: new Date().toISOString(),
      usuario: 'Usuário Atual',
      acao: 'Quitação Manual',
      operacao: operacao.numeroProposta,
      parcelas: Array.from(parcelasSelecionadas),
      valor: valorTotalSelecionado,
      motivo
    };
    console.log('Log de quitação:', log);
    alert(`Quitação registrada com sucesso!\n\nOperação: ${operacao.numeroProposta}\nParcelas: ${parcelasSelecionadas.size}\nValor: ${formatCurrency(valorTotalSelecionado)}\nMotivo: ${motivo}`);
    setParcelasSelecionadas(new Set());
    setMostrarSimulacao(false);
  };

  const handleRefinanciamento = (motivo: string) => {
    const log = {
      dataHora: new Date().toISOString(),
      usuario: 'Usuário Atual',
      acao: 'Refinanciamento',
      operacao: operacao.numeroProposta,
      parcelas: parcelasDisponiveis.length,
      saldoDevedor: valorTotalSelecionado,
      motivo
    };
    console.log('Log de refinanciamento:', log);
    alert(`Refinanciamento registrado com sucesso!\n\nOperação: ${operacao.numeroProposta}\nSaldo devedor: ${formatCurrency(valorTotalSelecionado)}\nMotivo: ${motivo}`);
    setParcelasSelecionadas(new Set());
    setMostrarSimulacao(false);
  };

  const handleExportarXLS = () => {
    console.log('Exportando para XLS:', {
      operacao: operacao.numeroProposta,
      servidor: servidor.nome,
      parcelas: operacao.parcelas
    });
    alert('Exportação XLS iniciada!\n\nOs dados da operação serão baixados em formato Excel.');
  };

  const handleExportarPDF = () => {
    console.log('Exportando para PDF:', {
      operacao: operacao.numeroProposta,
      servidor: servidor.nome,
      parcelas: operacao.parcelas
    });
    alert('Exportação PDF iniciada!\n\nO relatório da operação será baixado em formato PDF.');
  };

  const handleCopiarNumeroContrato = () => {
    navigator.clipboard.writeText(operacao.numeroProposta);
    alert('Número do contrato copiado para a área de transferência!');
  };

  const registrarLogExportacao = (tipoDocumento: string) => {
    const log = {
      dataHora: new Date().toISOString(),
      usuario: 'Usuário Atual',
      numeroProposta: operacao.numeroProposta,
      documentoExportado: tipoDocumento
    };
    console.log('Log de exportação de documento:', log);
  };

  const handleExportarDocumento = (tipo: 'CCB' | 'Trilha' | 'Selfie') => {
    const nomeArquivo = {
      'CCB': `CCB_${operacao.numeroProposta}.pdf`,
      'Trilha': `TrilhaAuditoria_${operacao.numeroProposta}.pdf`,
      'Selfie': `Selfie_${operacao.numeroProposta}.jpg`
    }[tipo];

    registrarLogExportacao(tipo);

    console.log(`Exportando documento: ${tipo}`, {
      arquivo: nomeArquivo,
      proposta: operacao.numeroProposta,
      servidor: servidor.nome
    });

    alert(`Documento "${tipo}" exportado com sucesso!\n\nArquivo: ${nomeArquivo}\nProposta: ${operacao.numeroProposta}`);
    setMostrarDocumentos(false);
  };

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (documentosRef.current && !documentosRef.current.contains(event.target as Node)) {
        setMostrarDocumentos(false);
      }
    };

    if (mostrarDocumentos) {
      document.addEventListener('mousedown', handleClickFora);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickFora);
    };
  }, [mostrarDocumentos]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={onVoltar}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar para operações</span>
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{servidor.nome}</h2>
              <p className="text-sm text-gray-600">
                CPF: {servidor.cpf} • Matrícula: {servidor.matricula} • {servidor.convenio}
              </p>
            </div>
            {servidor.bloqueadoPorOrdemJudicial && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6C757D] text-white rounded-full text-xs font-medium">
                <Lock className="w-3.5 h-3.5" />
                <span>Acesso bloqueado por OJ</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900">Contrato #{operacao.numeroProposta}</h3>
                    <button
                      onClick={handleCopiarNumeroContrato}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copiar número do contrato"
                    >
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{operacao.data}</p>
                </div>
              </div>
              <div className="relative" ref={documentosRef}>
                <button
                  onClick={() => setMostrarDocumentos(!mostrarDocumentos)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  Documentos
                </button>

                {mostrarDocumentos && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">CCB assinada</span>
                        </div>
                        <button
                          onClick={() => handleExportarDocumento('CCB')}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Exportar
                        </button>
                      </div>

                      <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Trilha de auditoria</span>
                        </div>
                        <button
                          onClick={() => handleExportarDocumento('Trilha')}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Exportar
                        </button>
                      </div>

                      <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Selfie</span>
                        </div>
                        <button
                          onClick={() => handleExportarDocumento('Selfie')}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Exportar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-4 gap-x-6 gap-y-5">
              <div>
                <p className="text-xs text-gray-500 mb-1">Originador</p>
                <p className="text-sm font-semibold text-gray-900">Use Digi (UD)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Data de contratação</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(operacao.data)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Produto</p>
                <p className="text-sm font-semibold text-gray-900">CARTÃO BENEFÍCIO</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Convênio</p>
                <p className="text-sm font-semibold text-gray-900">{servidor.convenio}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Valor Presente</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(operacao.parcelas.reduce((acc, p) => acc + p.valorPresente, 0))}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Valor Liberado</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(operacao.valorLiberado)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Valor Futuro</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(operacao.valorParcela * operacao.prazo)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Valor Parcela</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(operacao.valorParcela)}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Taxa Contrato</p>
                <p className="text-sm font-semibold text-gray-900">{formatPercent(operacao.taxaMensal)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Parcelas</p>
                <p className="text-sm font-semibold text-gray-900">{operacao.prazo}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Dia Vencimento</p>
                <p className="text-sm font-semibold text-gray-900">15</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Primeiro Vencimento</p>
                <p className="text-sm font-semibold text-gray-900">
                  {operacao.parcelas.length > 0 ? formatDate(operacao.parcelas[0].vencimento) : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Último Vencimento</p>
                <p className="text-sm font-semibold text-gray-900">
                  {operacao.parcelas.length > 0 ? formatDate(operacao.parcelas[operacao.parcelas.length - 1].vencimento) : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Tarifa</p>
                <p className="text-sm font-semibold text-gray-900">R$ 0,38</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">CET Anual</p>
                <p className="text-sm font-semibold text-gray-900">87.00%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h4 className="text-base font-semibold text-gray-900">Parcelas do Contrato</h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={todasParcelasSelecionadas && parcelasDisponiveis.length > 0}
                          onChange={handleToggleTodasParcelas}
                          disabled={parcelasDisponiveis.length === 0}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nº</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Vencimento</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Valor Nominal</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Valor Presente (VP)</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Taxa a.m.</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {operacao.parcelas.map((parcela) => (
                      <tr key={parcela.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={parcelasSelecionadas.has(parcela.id)}
                            onChange={() => handleToggleParcela(parcela.id)}
                            disabled={parcela.status === 'Pago'}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{String(parcela.numero).padStart(2, '0')}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{formatDate(parcela.vencimento)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                          {formatCurrency(parcela.valorNominal)}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-600 text-right font-semibold">
                          {loadingVP ? (
                            <div className="flex justify-end">
                              <div className="h-5 w-24 bg-blue-100 rounded animate-pulse"></div>
                            </div>
                          ) : (
                            formatCurrency(parcela.valorPresente)
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">{formatPercent(parcela.taxaMensal)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getParcelaStatusColor(parcela.status)}`}>
                            {parcela.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {parcelasSelecionadas.size > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h5 className="text-sm font-semibold text-gray-900 mb-4">Parcelas Selecionadas</h5>
                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Quantidade</p>
                    <p className="text-2xl font-bold text-gray-900">{parcelasSelecionadas.size}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Valor Total (VP)</p>
                    {loadingVP ? (
                      <div className="h-7 w-40 bg-blue-100 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(valorTotalSelecionado)}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleCalcularAntecipacao}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm"
                  >
                    Calcular antecipação (VP)
                  </button>

                  <button
                    onClick={() => setModalQuitacao(true)}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Realizar quitação manual
                  </button>

                  {todasParcelasSelecionadas && (
                    <button
                      onClick={() => setModalRefinanciamento(true)}
                      className="w-full px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
                    >
                      Refinanciar operação
                    </button>
                  )}
                </div>
              </div>
            )}

            {mostrarSimulacao && parcelasSelecionadas.size > 0 && (
              <PainelSimulacaoAntecipacao
                parcelas={parcelasSelecionadasArray}
                taxaMensal={operacao.taxaMensal}
                onClose={() => setMostrarSimulacao(false)}
                servidor={{
                  nome: servidor.nome,
                  cpf: servidor.cpf,
                  convenio: servidor.convenio
                }}
                operacao={{
                  numeroProposta: operacao.numeroProposta,
                  data: operacao.data,
                  valorLiberado: operacao.valorLiberado,
                  prazo: operacao.prazo,
                  valorParcela: operacao.valorParcela
                }}
              />
            )}
          </div>
        </div>
      </div>

      <LogsAlteracoesTabela logs={logsExemplo} />

      <QuitacaoManualModal
        isOpen={modalQuitacao}
        onClose={() => setModalQuitacao(false)}
        onConfirm={handleQuitacao}
        quantidadeParcelas={parcelasSelecionadas.size}
        valorTotal={valorTotalSelecionado}
      />

      <RefinanciamentoModal
        isOpen={modalRefinanciamento}
        onClose={() => setModalRefinanciamento(false)}
        onConfirm={handleRefinanciamento}
        numeroProposta={operacao.numeroProposta}
        quantidadeParcelas={parcelasDisponiveis.length}
        saldoDevedor={valorTotalSelecionado}
      />
    </div>
  );
};
