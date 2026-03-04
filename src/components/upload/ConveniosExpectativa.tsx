import React from 'react';
import { Upload, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { convenios } from '../../data/mockData';

interface ConveniosExpectativaProps {
  competenciaSelecionada: string;
  onImportarArquivo: (convenio: any) => void;
}

interface ConvenioExpectativa {
  id: string;
  nome: string;
  averbadora: string;
  data_limite: string;
  status_arquivo: 'Recebido' | 'Pendente';
  data_recebimento?: string;
  nome_arquivo?: string;
}

export const ConveniosExpectativa: React.FC<ConveniosExpectativaProps> = ({
  competenciaSelecionada,
  onImportarArquivo
}) => {
  // Mock de dados de expectativa baseado nos convênios existentes
  const conveniosExpectativa: ConvenioExpectativa[] = convenios.map(convenio => {
    // Simular alguns arquivos já recebidos
    const jaRecebido = ['1', '7', '4'].includes(convenio.id);
    
    return {
      id: convenio.id,
      nome: convenio.nome,
      averbadora: convenio.averbadora,
      data_limite: '2025-02-10', // Data limite padrão
      status_arquivo: jaRecebido ? 'Recebido' : 'Pendente',
      data_recebimento: jaRecebido ? '2025-02-05' : undefined,
      nome_arquivo: jaRecebido ? `${convenio.nome.replace(/\s+/g, '_')}_${competenciaSelecionada}.csv` : undefined
    };
  });

  const formatCompetencia = (comp: string) => {
    return `${comp.substring(4, 6)}/${comp.substring(0, 4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Recebido':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pendente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recebido':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Recebido':
        return 'Recebido';
      case 'Pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  // Estatísticas
  const recebidos = conveniosExpectativa.filter(c => c.status_arquivo === 'Recebido').length;
  const pendentes = conveniosExpectativa.filter(c => c.status_arquivo === 'Pendente').length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Expectativa de Arquivos - Competência {formatCompetencia(competenciaSelecionada)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Convênios com expectativa de recebimento de arquivo de retorno para esta competência
            </p>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-900 text-sm mb-1">Total de Convênios</h4>
            <div className="text-xl font-bold text-blue-600">{conveniosExpectativa.length}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-medium text-green-900 text-sm mb-1">Arquivos Recebidos</h4>
            <div className="text-xl font-bold text-green-600">{recebidos}</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-medium text-yellow-900 text-sm mb-1">Pendentes</h4>
            <div className="text-xl font-bold text-yellow-600">{pendentes}</div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Convênio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Averbadora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Limite
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status do Arquivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Recebimento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome do Arquivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {conveniosExpectativa.map((convenio) => (
              <tr key={convenio.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {convenio.nome}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{convenio.averbadora}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(convenio.data_limite)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(convenio.status_arquivo)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(convenio.status_arquivo)}`}>
                      {getStatusLabel(convenio.status_arquivo)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {convenio.data_recebimento ? formatDate(convenio.data_recebimento) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {convenio.nome_arquivo || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {convenio.status_arquivo !== 'Recebido' ? (
                    <button
                      onClick={() => onImportarArquivo(convenio)}
                      className="inline-flex items-center px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Importar Arquivo
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500">Arquivo já recebido</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};