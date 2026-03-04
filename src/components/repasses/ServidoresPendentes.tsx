import React, { useState } from 'react';
import { Download, Upload, Eye, Edit, Save, X } from 'lucide-react';
import type { FiltroGeral } from '../../types';

interface ServidoresPendentesProps {
  filtros: FiltroGeral;
}

interface ServidorPendente {
  id: string;
  convenio_id: string;
  convenio_nome: string;
  competencia: string;
  matricula: string;
  nome_servidor: string;
  valor_previsto: number;
  motivo_nao_desconto: string;
  status: 'Pendente' | 'Justificado' | 'RepassadoDireto' | 'Reprocessar';
  observacoes: string;
  justificativa_anexada: boolean;
}

const mockServidoresPendentes: ServidorPendente[] = [
  {
    id: '1',
    convenio_id: '1',
    convenio_nome: 'Governo de Goiás',
    competencia: '202501',
    matricula: '123456',
    nome_servidor: 'João Silva Santos',
    valor_previsto: 450.00,
    motivo_nao_desconto: '',
    status: 'Pendente',
    observacoes: '',
    justificativa_anexada: false
  },
  {
    id: '2',
    convenio_id: '1',
    convenio_nome: 'Governo de Goiás',
    competencia: '202501',
    matricula: '789012',
    nome_servidor: 'Maria Oliveira Costa',
    valor_previsto: 320.50,
    motivo_nao_desconto: '',
    status: 'Pendente',
    observacoes: '',
    justificativa_anexada: false
  },
  {
    id: '3',
    convenio_id: '7',
    convenio_nome: 'Prefeitura do Rio de Janeiro',
    competencia: '202501',
    matricula: '345678',
    nome_servidor: 'Carlos Eduardo Pereira',
    valor_previsto: 680.75,
    motivo_nao_desconto: '',
    status: 'Pendente',
    observacoes: '',
    justificativa_anexada: false
  },
  {
    id: '4',
    convenio_id: '4',
    convenio_nome: 'Prefeitura de Sorocaba',
    competencia: '202501',
    matricula: '901234',
    nome_servidor: 'Ana Paula Rodrigues',
    valor_previsto: 275.30,
    motivo_nao_desconto: '',
    status: 'Pendente',
    observacoes: '',
    justificativa_anexada: false
  },
  {
    id: '5',
    convenio_id: '2',
    convenio_nome: 'Governo do Maranhão',
    competencia: '202501',
    matricula: '567890',
    nome_servidor: 'Roberto Almeida Lima',
    valor_previsto: 520.00,
    motivo_nao_desconto: '',
    status: 'Pendente',
    observacoes: '',
    justificativa_anexada: false
  }
];

export const ServidoresPendentes: React.FC<ServidoresPendentesProps> = ({ filtros }) => {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ServidorPendente>>({});
  const [selectedConvenio, setSelectedConvenio] = useState('');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-red-100 text-red-800';
      case 'Justificado':
        return 'bg-yellow-100 text-yellow-800';
      case 'RepassadoDireto':
        return 'bg-green-100 text-green-800';
      case 'Reprocessar':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'Pendente';
      case 'Justificado':
        return 'Justificado';
      case 'RepassadoDireto':
        return 'Repassado Direto';
      case 'Reprocessar':
        return 'Reprocessar';
      default:
        return status;
    }
  };

  const handleEdit = (servidor: ServidorPendente) => {
    setEditingRow(servidor.id);
    setFormData({
      motivo_nao_desconto: servidor.motivo_nao_desconto,
      status: servidor.status,
      observacoes: servidor.observacoes
    });
  };

  const handleSave = (servidorId: string) => {
    console.log('Salvando dados:', { servidorId, formData });
    setEditingRow(null);
    setFormData({});
    alert('Dados salvos com sucesso!');
  };

  const handleCancel = () => {
    setEditingRow(null);
    setFormData({});
  };

  const handleFileUpload = (servidorId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Upload de justificativa:', { servidorId, file: file.name });
      alert(`Justificativa ${file.name} anexada com sucesso!`);
    }
  };

  const handleExport = () => {
    const exportData = {
      convenio: selectedConvenio,
      competencia: '202501',
      data: new Date().toISOString(),
      tipo: 'servidores_pendentes'
    };
    
    alert(`Exportação iniciada:\nConvênio: ${selectedConvenio || 'Todos'}\nCompetência: 01/2025\nFormato: Excel`);
  };

  // Filtrar dados por convênio se selecionado
  const filteredData = mockServidoresPendentes.filter(servidor => 
    !selectedConvenio || servidor.convenio_id === selectedConvenio
  );

  // Agrupar por convênio
  const conveniosUnicos = [...new Set(filteredData.map(s => s.convenio_nome))];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Servidores Pendentes de Desconto - {filteredData.length} registro(s)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Contratos ativos sem desconto registrado na folha da competência vigente
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Filtro por Convênio */}
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por Convênio:</label>
          <select
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedConvenio}
            onChange={(e) => setSelectedConvenio(e.target.value)}
          >
            <option value="">Todos os Convênios</option>
            <option value="1">Governo de Goiás</option>
            <option value="2">Governo do Maranhão</option>
            <option value="4">Prefeitura de Sorocaba</option>
            <option value="7">Prefeitura do Rio de Janeiro</option>
          </select>
        </div>

        {/* Resumo por Convênio */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {conveniosUnicos.map(convenio => {
            const servidoresConvenio = filteredData.filter(s => s.convenio_nome === convenio);
            const valorTotal = servidoresConvenio.reduce((sum, s) => sum + s.valor_previsto, 0);
            
            return (
              <div key={convenio} className="bg-red-50 p-3 rounded-lg">
                <h4 className="font-medium text-red-900 text-sm mb-1">{convenio}</h4>
                <div className="text-lg font-bold text-red-600">{servidoresConvenio.length}</div>
                <div className="text-xs text-red-700">
                  Total: {formatCurrency(valorTotal)}
                </div>
              </div>
            );
          })}
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
                Matrícula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome do Servidor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Previsto em Folha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motivo do Não Desconto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observações
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Justificativa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((servidor) => (
              <tr key={servidor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {servidor.convenio_nome}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-mono text-gray-900">
                    {servidor.matricula}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {servidor.nome_servidor}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(servidor.valor_previsto)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {editingRow === servidor.id ? (
                    <input
                      type="text"
                      className="w-full text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                      value={formData.motivo_nao_desconto || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        motivo_nao_desconto: e.target.value
                      }))}
                      placeholder="Informe o motivo..."
                    />
                  ) : (
                    <div className="text-sm text-gray-900">
                      {servidor.motivo_nao_desconto || '-'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingRow === servidor.id ? (
                    <select
                      className="text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                      value={formData.status || servidor.status}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        status: e.target.value as any
                      }))}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Justificado">Justificado</option>
                      <option value="RepassadoDireto">Repassado Direto</option>
                      <option value="Reprocessar">Reprocessar</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(servidor.status)}`}>
                      {getStatusLabel(servidor.status)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingRow === servidor.id ? (
                    <textarea
                      className="w-full text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                      rows={2}
                      value={formData.observacoes || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        observacoes: e.target.value
                      }))}
                      placeholder="Adicionar observações..."
                    />
                  ) : (
                    <div className="text-sm text-gray-900">
                      {servidor.observacoes || '-'}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {servidor.justificativa_anexada ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        <Eye className="w-3 h-3 mr-1" />
                        Anexado
                      </span>
                    ) : (
                      <label className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full cursor-pointer hover:bg-gray-200">
                        <Upload className="w-3 h-3 mr-1" />
                        Anexar
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf"
                          onChange={(e) => handleFileUpload(servidor.id, e)}
                        />
                      </label>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {editingRow === servidor.id ? (
                      <>
                        <button
                          onClick={() => handleSave(servidor.id)}
                          className="text-green-600 hover:text-green-800"
                          title="Salvar"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-gray-600 hover:text-gray-800"
                          title="Cancelar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(servidor)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>Nenhum servidor pendente encontrado para os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};