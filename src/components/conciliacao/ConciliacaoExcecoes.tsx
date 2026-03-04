import React, { useState } from 'react';
import { AlertTriangle, Eye, Edit, Trash } from 'lucide-react';

interface ConciliacaoExcecoesProps {
  convenioId: string;
  competencia: string;
}

interface ExcecaoConvenio {
  id: string;
  tipo: 'DiferencaValor' | 'FaltaComprovante' | 'AtrasoRepasse';
  convenio_nome: string;
  competencia: string;
  valor_enviado: number;
  valor_descontado: number;
  valor_recebido_conta: number;
  valor_repassado: number;
  data_limite_repasse: string;
  dias_atraso: number;
  motivo_excecao: string;
  observacoes: string;
  responsavel: string;
  data_identificacao: string;
}

const mockExcecoesData: ExcecaoConvenio[] = [
  {
    id: '1',
    tipo: 'DiferencaValor',
    convenio_nome: 'Governo de Goiás',
    competencia: '202401',
    valor_enviado: 2548750.00,
    valor_descontado: 2487320.50,
    valor_recebido_conta: 2480000.00,
    valor_repassado: 2487320.50,
    data_limite_repasse: '2024-02-10',
    dias_atraso: 0,
    motivo_excecao: 'Diferença entre valor descontado e valor recebido em conta superior a 0,5%',
    observacoes: 'Verificar com banco se houve desconto de tarifas não informadas',
    responsavel: 'ana.silva',
    data_identificacao: '2024-02-15'
  },
  {
    id: '2',
    tipo: 'FaltaComprovante',
    convenio_nome: 'Prefeitura do Rio de Janeiro',
    competencia: '202401',
    valor_enviado: 1875432.00,
    valor_descontado: 1798234.75,
    valor_recebido_conta: 1798234.75,
    valor_repassado: 1798234.75,
    data_limite_repasse: '2024-02-05',
    dias_atraso: 0,
    motivo_excecao: 'Repasse realizado mas comprovante não foi anexado no sistema',
    observacoes: 'Solicitado comprovante ao setor financeiro',
    responsavel: 'carlos.costa',
    data_identificacao: '2024-02-20'
  },
  {
    id: '3',
    tipo: 'AtrasoRepasse',
    convenio_nome: 'Governo do Paraná',
    competencia: '202401',
    valor_enviado: 2100000.00,
    valor_descontado: 1995000.00,
    valor_recebido_conta: 1995000.00,
    valor_repassado: 0,
    data_limite_repasse: '2024-02-03',
    dias_atraso: 25,
    motivo_excecao: 'Repasse em atraso há 25 dias - prazo limite ultrapassado',
    observacoes: 'Aguardando liberação do convênio para efetuar repasse',
    responsavel: 'ana.silva',
    data_identificacao: '2024-02-28'
  },
  {
    id: '4',
    tipo: 'DiferencaValor',
    convenio_nome: 'Prefeitura de Sorocaba',
    competencia: '202401',
    valor_enviado: 980000.00,
    valor_descontado: 931000.00,
    valor_recebido_conta: 925000.00,
    valor_repassado: 931000.00,
    data_limite_repasse: '2024-02-05',
    dias_atraso: 0,
    motivo_excecao: 'Valor recebido em conta inferior ao valor descontado - diferença de R$ 6.000,00',
    observacoes: 'Investigar possível retenção de impostos não informada',
    responsavel: 'carlos.costa',
    data_identificacao: '2024-02-18'
  }
];

export const ConciliacaoExcecoes: React.FC<ConciliacaoExcecoesProps> = ({ 
  convenioId, 
  competencia 
}) => {
  const [filtroTipo, setFiltroTipo] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleVisualizarDetalhes = (excecao: ExcecaoConvenio) => {
    alert(`Detalhes da Exceção ${excecao.id}\n\nTipo: ${excecao.tipo}\nConvênio: ${excecao.convenio_nome}\nCompetência: ${excecao.competencia}\nMotivo: ${excecao.motivo_excecao}\nResponsável: ${excecao.responsavel}`);
  };

  const handleCorrigir = (excecao: ExcecaoConvenio) => {
    if (excecao.tipo === 'DiferencaValor') {
      alert(`Modal de Correção - Diferença de Valor\n\nPermitir:\n• Ajustar valor recebido em conta\n• Registrar justificativa para diferença\n• Marcar como resolvido`);
    } else if (excecao.tipo === 'FaltaComprovante') {
      alert(`Modal de Correção - Falta Comprovante\n\nPermitir:\n• Upload do comprovante em atraso\n• Solicitar reenvio do comprovante\n• Marcar prazo para regularização`);
    } else {
      alert(`Modal de Correção - Atraso no Repasse\n\nPermitir:\n• Registrar nova data prevista\n• Adicionar justificativa do atraso\n• Notificar convênio sobre pendência`);
    }
  };

  const handleExcluir = (excecao: ExcecaoConvenio) => {
    if (confirm(`Excluir exceção ${excecao.id}?\n\nEsta ação será registrada na auditoria.`)) {
      alert('Exceção excluída e log de auditoria criado.');
    }
  };

  const filteredData = mockExcecoesData.filter(item => 
    !filtroTipo || item.tipo === filtroTipo
  );

  const diferencaValor = mockExcecoesData.filter(e => e.tipo === 'DiferencaValor');
  const faltaComprovante = mockExcecoesData.filter(e => e.tipo === 'FaltaComprovante');
  const atrasoRepasse = mockExcecoesData.filter(e => e.tipo === 'AtrasoRepasse');

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'DiferencaValor':
        return 'bg-red-100 text-red-800';
      case 'FaltaComprovante':
        return 'bg-yellow-100 text-yellow-800';
      case 'AtrasoRepasse':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'DiferencaValor':
        return 'Diferença de Valor';
      case 'FaltaComprovante':
        return 'Falta Comprovante';
      case 'AtrasoRepasse':
        return 'Atraso no Repasse';
      default:
        return tipo;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Exceções da Conciliação - {filteredData.length} itens
            </h3>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Atenção - Exceções Pendentes</h4>
              <p className="text-yellow-700 text-sm mt-1">
                Estas exceções representam inconsistências na conciliação por convênio/competência 
                que precisam ser resolvidas antes do fechamento.
              </p>
            </div>
          </div>
        </div>

        {/* Resumo das Exceções */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Diferenças de Valor</h4>
            <div className="text-2xl font-bold text-red-600">{diferencaValor.length}</div>
            <div className="text-sm text-red-700">
              Divergências entre valores descontados e recebidos
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Falta Comprovante</h4>
            <div className="text-2xl font-bold text-yellow-600">{faltaComprovante.length}</div>
            <div className="text-sm text-yellow-700">
              Repasses sem comprovante anexado
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Atrasos no Repasse</h4>
            <div className="text-2xl font-bold text-purple-600">{atrasoRepasse.length}</div>
            <div className="text-sm text-purple-700">
              Repasses em atraso ou não realizados
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Filtrar por tipo:</span>
          <button
            onClick={() => setFiltroTipo('')}
            className={`px-3 py-1 text-sm rounded-full border ${
              !filtroTipo ? 'bg-gray-100 text-gray-800 border-gray-300' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            Todas ({mockExcecoesData.length})
          </button>
          <button
            onClick={() => setFiltroTipo('DiferencaValor')}
            className={`px-3 py-1 text-sm rounded-full border ${
              filtroTipo === 'DiferencaValor' ? 'bg-red-100 text-red-800 border-red-300' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            Diferenças ({diferencaValor.length})
          </button>
          <button
            onClick={() => setFiltroTipo('FaltaComprovante')}
            className={`px-3 py-1 text-sm rounded-full border ${
              filtroTipo === 'FaltaComprovante' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            Comprovantes ({faltaComprovante.length})
          </button>
          <button
            onClick={() => setFiltroTipo('AtrasoRepasse')}
            className={`px-3 py-1 text-sm rounded-full border ${
              filtroTipo === 'AtrasoRepasse' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            Atrasos ({atrasoRepasse.length})
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Convênio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Competência
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Enviado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Descontado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Recebido
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Repassado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Limite
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dias Atraso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motivo da Exceção
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((excecao) => (
              <tr 
                key={excecao.id} 
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(excecao.tipo)}`}>
                    {getTipoLabel(excecao.tipo)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{excecao.convenio_nome}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {excecao.competencia.substring(4, 6)}/{excecao.competencia.substring(0, 4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {formatCurrency(excecao.valor_enviado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-green-600">
                  {formatCurrency(excecao.valor_descontado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600">
                  {formatCurrency(excecao.valor_recebido_conta)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className={`font-medium ${
                    excecao.valor_repassado > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {excecao.valor_repassado > 0 ? formatCurrency(excecao.valor_repassado) : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(excecao.data_limite_repasse)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {excecao.dias_atraso > 0 ? (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      excecao.dias_atraso <= 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {excecao.dias_atraso} dias
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-64 truncate" title={excecao.motivo_excecao}>
                    {excecao.motivo_excecao}
                  </div>
                  {excecao.observacoes && (
                    <div className="text-xs text-gray-500 max-w-64 truncate mt-1" title={excecao.observacoes}>
                      {excecao.observacoes}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {excecao.responsavel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleVisualizarDetalhes(excecao)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Ver Detalhes"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCorrigir(excecao)}
                      className="text-green-600 hover:text-green-800"
                      title="Corrigir"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExcluir(excecao)}
                      className="text-red-600 hover:text-red-800"
                      title="Excluir"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-gray-400" />
          <p>Nenhuma exceção encontrada para os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};