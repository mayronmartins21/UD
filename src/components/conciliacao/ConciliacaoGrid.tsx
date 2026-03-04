import React, { useState } from 'react';
import { Eye, Edit, Save, Calendar, Upload as UploadIcon, FileText, ChevronDown, ChevronRight, ExternalLink, Download, RefreshCw, FileDown } from 'lucide-react';

interface ConciliacaoGridProps {
  convenioId: string;
  competencia: string;
}

interface ConciliacaoTotal {
  id: string;
  convenio_nome: string;
  competencia: string;
  valor_total_enviado: number;
  valor_total_descontado: number;
  percentual_retido: number;
  valor_recebido_conta: number;
  valor_a_repassar: number;
  valor_repassado: number;
  data_repasse: string;
  status: 'Pendente' | 'Parcial' | 'Concluido';
  comprovante_anexado: boolean;
  observacoes: string;
}

interface ProdutoDetalhe {
  produto: string;
  valor_total_enviado: number;
  valor_total_descontado: number;
  nao_descontado: number;
  descontado_parcial: number;
  inadimplente_pct: number;
}

const mockConciliacaoData: ConciliacaoTotal[] = [
  {
    id: '1',
    convenio_nome: 'Governo de Goiás',
    competencia: '202501',
    valor_total_enviado: 2548750.00,
    valor_total_descontado: 2487320.50,
    percentual_retido: 2.41,
    valor_recebido_conta: 2487320.50,
    valor_a_repassar: 2548750.00,
    valor_repassado: 2487320.50,
    data_repasse: '2024-02-15',
    status: 'Concluido',
    comprovante_anexado: true,
    observacoes: 'Repasse realizado conforme cronograma'
  },
  {
    id: '2',
    convenio_nome: 'Governo do Maranhão',
    competencia: '202501',
    valor_total_enviado: 1875432.00,
    valor_total_descontado: 1798234.75,
    percentual_retido: 4.12,
    valor_recebido_conta: 0,
    valor_a_repassar: 0,
    valor_repassado: 0,
    data_repasse: '',
    status: 'Pendente',
    comprovante_anexado: false,
    observacoes: ''
  },
  {
    id: '3',
    convenio_nome: 'Governo do Paraná',
    competencia: '202501',
    valor_total_enviado: 2100000.00,
    valor_total_descontado: 1995000.00,
    percentual_retido: 5.00,
    valor_recebido_conta: 0,
    valor_a_repassar: 0,
    valor_repassado: 0,
    data_repasse: '',
    status: 'Pendente',
    comprovante_anexado: false,
    observacoes: ''
  },
  {
    id: '4',
    convenio_nome: 'Prefeitura do Rio de Janeiro',
    competencia: '202501',
    valor_total_enviado: 1320000.00,
    valor_total_descontado: 1254000.00,
    percentual_retido: 5.00,
    valor_recebido_conta: 0,
    valor_a_repassar: 0,
    valor_repassado: 0,
    data_repasse: '',
    status: 'Pendente',
    comprovante_anexado: false,
    observacoes: ''
  },
  {
    id: '5',
    convenio_nome: 'Prefeitura de Sorocaba',
    competencia: '202501',
    valor_total_enviado: 980000.00,
    valor_total_descontado: 931000.00,
    percentual_retido: 5.00,
    valor_recebido_conta: 0,
    valor_a_repassar: 0,
    valor_repassado: 0,
    data_repasse: '',
    status: 'Pendente',
    comprovante_anexado: false,
    observacoes: ''
  },
  {
    id: '6',
    convenio_nome: 'Prefeitura de Hortolândia',
    competencia: '202501',
    valor_total_enviado: 750000.00,
    valor_total_descontado: 712500.00,
    percentual_retido: 5.00,
    valor_recebido_conta: 0,
    valor_a_repassar: 0,
    valor_repassado: 0,
    data_repasse: '',
    status: 'Pendente',
    comprovante_anexado: false,
    observacoes: ''
  },
  {
    id: '7',
    convenio_nome: 'Prefeitura de Santo André',
    competencia: '202501',
    valor_total_enviado: 1450000.00,
    valor_total_descontado: 1377500.00,
    percentual_retido: 5.00,
    valor_recebido_conta: 0,
    valor_a_repassar: 0,
    valor_repassado: 0,
    data_repasse: '',
    status: 'Pendente',
    comprovante_anexado: false,
    observacoes: ''
  },
  {
    id: '8',
    convenio_nome: 'Prefeitura de Guarulhos',
    competencia: '202501',
    valor_total_enviado: 1800000.00,
    valor_total_descontado: 1710000.00,
    percentual_retido: 5.00,
    valor_recebido_conta: 0,
    valor_a_repassar: 0,
    valor_repassado: 0,
    data_repasse: '',
    status: 'Pendente',
    comprovante_anexado: false,
    observacoes: ''
  }
];

// Mock de dados por produto
const mockProdutoData: { [key: string]: ProdutoDetalhe[] } = {
  '1': [
    {
      produto: 'Cartão Compras',
      valor_total_enviado: 1548750.00,
      valor_total_descontado: 1487320.50,
      nao_descontado: 41429.50,
      descontado_parcial: 20000.00,
      inadimplente_pct: 2.67
    },
    {
      produto: 'Saque',
      valor_total_enviado: 1000000.00,
      valor_total_descontado: 1000000.00,
      nao_descontado: 0,
      descontado_parcial: 0,
      inadimplente_pct: 0
    }
  ],
  '2': [
    {
      produto: 'Cartão Compras',
      valor_total_enviado: 1200000.00,
      valor_total_descontado: 1150000.00,
      nao_descontado: 50000.00,
      descontado_parcial: 0,
      inadimplente_pct: 4.17
    },
    {
      produto: 'Saque',
      valor_total_enviado: 675432.00,
      valor_total_descontado: 648234.75,
      nao_descontado: 27197.25,
      descontado_parcial: 0,
      inadimplente_pct: 4.03
    }
  ],
  '3': [
    {
      produto: 'Cartão Compras',
      valor_total_enviado: 1400000.00,
      valor_total_descontado: 1330000.00,
      nao_descontado: 70000.00,
      descontado_parcial: 0,
      inadimplente_pct: 5.00
    },
    {
      produto: 'Saque',
      valor_total_enviado: 700000.00,
      valor_total_descontado: 665000.00,
      nao_descontado: 35000.00,
      descontado_parcial: 0,
      inadimplente_pct: 5.00
    }
  ],
  '4': [
    {
      produto: 'Cartão Compras',
      valor_total_enviado: 820000.00,
      valor_total_descontado: 779000.00,
      nao_descontado: 41000.00,
      descontado_parcial: 0,
      inadimplente_pct: 5.00
    },
    {
      produto: 'Saque',
      valor_total_enviado: 500000.00,
      valor_total_descontado: 475000.00,
      nao_descontado: 25000.00,
      descontado_parcial: 0,
      inadimplente_pct: 5.00
    }
  ]
};

export const ConciliacaoGrid: React.FC<ConciliacaoGridProps> = ({ 
  convenioId, 
  competencia 
}) => {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ConciliacaoTotal>>({});
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set());
  const [productCache, setProductCache] = useState<{ [key: string]: ProdutoDetalhe[] }>({});

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Concluido':
        return 'bg-green-100 text-green-800';
      case 'Parcial':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendente':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Concluido':
        return 'Concluído';
      case 'Parcial':
        return 'Parcial';
      case 'Pendente':
        return 'Pendente';
      default:
        return status;
    }
  };

  const getProdutoColor = (produto: string) => {
    switch (produto) {
      case 'Cartão Compras':
        return 'bg-blue-100 text-blue-800';
      case 'Saque':
        return 'bg-green-100 text-green-800';
      case 'Empréstimo':
        return 'bg-purple-100 text-purple-800';
      case 'FGTS':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExpandRow = async (itemId: string) => {
    const newExpandedRows = new Set(expandedRows);
    
    if (expandedRows.has(itemId)) {
      // Recolher
      newExpandedRows.delete(itemId);
    } else {
      // Expandir
      newExpandedRows.add(itemId);
      
      // Se não está no cache, buscar dados
      if (!productCache[itemId]) {
        setLoadingProducts(prev => new Set(prev).add(itemId));
        
        // Simular busca de dados (lazy load)
        setTimeout(() => {
          const produtos = mockProdutoData[itemId] || [];
          setProductCache(prev => ({ ...prev, [itemId]: produtos }));
          setLoadingProducts(prev => {
            const newSet = new Set(prev);
            newSet.delete(itemId);
            return newSet;
          });
        }, 500);
      }
    }
    
    setExpandedRows(newExpandedRows);
  };

  const handleVerRepasses = (convenio: string, produto: string, competencia: string) => {
    alert(`Navegando para Dashboard de Repasses com filtros:\nConvênio: ${convenio}\nProduto: ${produto}\nCompetência: ${competencia.substring(4, 6)}/${competencia.substring(0, 4)}`);
  };

  const handleExportarProduto = (convenio: string, produto: string, competencia: string) => {
    alert(`Exportando base do produto:\nConvênio: ${convenio}\nProduto: ${produto}\nCompetência: ${competencia.substring(4, 6)}/${competencia.substring(0, 4)}\nFormato: CSV`);
  };

  const handleExportarCSV = () => {
    const headers = [
      'Convênio',
      'Competência',
      'Valor Total Enviado',
      'Valor Total Descontado',
      '% Retido pelo Convênio',
      'Não Descontado',
      'Valor Recebido em Conta',
      'Data de Recebimento',
      'Descontado Parcial',
      '% Inadimplente',
      'Valor a Repassar',
      'Valor Repassado',
      'Data de Repasse',
      'Status',
      'Comprovante Anexado',
      'Observações'
    ];

    const csvData = filteredData.map(item => {
      const naoDescontado = item.valor_total_enviado - item.valor_total_descontado;
      const descontadoParcial = naoDescontado * 0.1;
      const inadimplentePct = (naoDescontado / item.valor_total_enviado) * 100;

      return [
        item.convenio_nome,
        `${item.competencia.substring(4, 6)}/${item.competencia.substring(0, 4)}`,
        item.valor_total_enviado.toFixed(2),
        item.valor_total_descontado.toFixed(2),
        item.percentual_retido.toFixed(2),
        naoDescontado.toFixed(2),
        item.valor_recebido_conta.toFixed(2),
        item.status === 'Concluido' ? '15/02/2024' : '-',
        descontadoParcial.toFixed(2),
        inadimplentePct.toFixed(2),
        item.valor_a_repassar.toFixed(2),
        item.valor_repassado.toFixed(2),
        formatDate(item.data_repasse),
        getStatusLabel(item.status),
        item.comprovante_anexado ? 'Sim' : 'Não',
        item.observacoes || ''
      ].join(',');
    });

    const csv = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `conciliacao_${competencia}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAtualizarDados = () => {
    alert('Atualizando dados da conciliação...');
    console.log('Recarregando dados para:', { convenioId, competencia });
  };

  const handleEdit = (item: ConciliacaoTotal) => {
    setEditingRow(item.id);
    setFormData({
      valor_recebido_conta: item.valor_recebido_conta,
      valor_repassado: item.valor_repassado,
      data_repasse: item.data_repasse,
      observacoes: item.observacoes
    });
  };

  const handleSave = (itemId: string) => {
    // Aqui seria implementada a lógica de salvamento
    console.log('Salvando dados:', { itemId, formData });
    setEditingRow(null);
    setFormData({});
    alert('Dados salvos com sucesso!');
  };

  const handleCancel = () => {
    setEditingRow(null);
    setFormData({});
  };

  const handleFileUpload = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Aqui seria implementada a lógica de upload
      console.log('Upload de comprovante:', { itemId, file: file.name });
      alert(`Comprovante ${file.name} anexado com sucesso!`);
    }
  };

  const filteredData = mockConciliacaoData.filter(item => 
    (!convenioId || true) &&
    (!competencia || item.competencia === competencia)
  );

  const renderProductRows = (parentItem: ConciliacaoTotal) => {
    if (!expandedRows.has(parentItem.id)) return null;

    if (loadingProducts.has(parentItem.id)) {
      return (
        <tr key={`${parentItem.id}-loading`} className="bg-gray-50">
          <td colSpan={16} className="px-6 py-4">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-gray-600">Carregando produtos...</span>
            </div>
          </td>
        </tr>
      );
    }

    const produtos = productCache[parentItem.id] || [];
    
    return produtos.map((produto, index) => (
      <tr key={`${parentItem.id}-produto-${index}`} className="bg-gray-50 border-l-4 border-blue-200">
        <td className="px-6 py-3 pl-12">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProdutoColor(produto.produto)}`}>
            {produto.produto}
          </span>
        </td>
        <td className="px-6 py-3 text-sm text-gray-600">—</td>
        <td className="px-6 py-3 text-right text-sm font-medium text-gray-700">
          {formatCurrency(produto.valor_total_enviado)}
        </td>
        <td className="px-6 py-3 text-right text-sm font-medium text-green-600">
          {formatCurrency(produto.valor_total_descontado)}
        </td>
        <td className="px-6 py-3 text-right text-sm text-gray-600">—</td>
        <td className="px-6 py-3 text-right text-sm font-medium text-red-600">
          {formatCurrency(produto.nao_descontado)}
        </td>
        <td className="px-6 py-3 text-right text-sm text-gray-600">—</td>
        <td className="px-6 py-3 text-right text-sm font-medium text-yellow-600">
          {formatCurrency(produto.descontado_parcial)}
        </td>
        <td className="px-6 py-3 text-right text-sm font-medium">
          <span className={`${
            produto.inadimplente_pct <= 3 ? 'text-green-600' :
            produto.inadimplente_pct <= 5 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {produto.inadimplente_pct.toFixed(2)}%
          </span>
        </td>
        <td className="px-6 py-3 text-sm text-gray-600">—</td>
        <td className="px-6 py-3 text-sm text-gray-600">—</td>
        <td className="px-6 py-3 text-sm text-gray-600">—</td>
        <td className="px-6 py-3 text-sm text-gray-600">—</td>
        <td className="px-6 py-3 text-sm text-gray-600">—</td>
        <td className="px-6 py-3 text-sm text-gray-600">—</td>
        <td className="px-6 py-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVerRepasses(parentItem.convenio_nome, produto.produto, parentItem.competencia)}
              className="text-blue-600 hover:text-blue-800 text-xs"
              title="Ver no Dashboard de Repasses"
            >
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleExportarProduto(parentItem.convenio_nome, produto.produto, parentItem.competencia)}
              className="text-gray-600 hover:text-gray-800 text-xs"
              title="Exportar base do produto"
            >
              <Download className="w-3 h-3" />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Cabeçalho */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Grade de Conciliação - {filteredData.length} registro(s)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Conciliação total por convênio e competência
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAtualizarDados}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
              title="Atualizar dados"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
            <button
              onClick={handleExportarCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
              title="Exportar para CSV"
            >
              <FileDown className="w-4 h-4" />
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Convênio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Competência
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Valor Total Enviado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Valor Total Descontado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  % Retido pelo Convênio
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Não Descontado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Valor Recebido em Conta
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Data de Recebimento
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Descontado Parcial
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  % Inadimplente
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Valor a Repassar
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Valor Repassado
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  Data de Repasse
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                  Comprovante
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                  Observações
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item) => {
                const isExpanded = expandedRows.has(item.id);
                const naoDescontado = item.valor_total_enviado - item.valor_total_descontado;
                const descontadoParcial = naoDescontado * 0.1; // Mock - 10% do não descontado como parcial
                const inadimplentePct = (naoDescontado / item.valor_total_enviado) * 100;
                
                return (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleExpandRow(item.id)}
                            className="mr-2 p-1 hover:bg-gray-200 rounded"
                            aria-label={`Detalhar produtos de ${item.convenio_nome}`}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          <div className="text-sm font-medium text-gray-900">
                            {item.convenio_nome}
                          </div>
                        </div>
                      </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.competencia.substring(4, 6)}/{item.competencia.substring(0, 4)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(item.valor_total_enviado)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                    {formatCurrency(item.valor_total_descontado)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${
                      item.percentual_retido <= 3 ? 'text-green-600' :
                      item.percentual_retido <= 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {item.percentual_retido.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-red-600">
                    {formatCurrency(naoDescontado)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    {editingRow === item.id ? (
                      <input
                        type="number"
                        step="0.01"
                        className="w-full text-right text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        value={formData.valor_recebido_conta || 0}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          valor_recebido_conta: parseFloat(e.target.value) || 0
                        }))}
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {formatCurrency(item.valor_recebido_conta)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.status === 'Concluido' ? '15/02/2024' : '—'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-yellow-600">
                    {formatCurrency(descontadoParcial)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-medium ${
                      inadimplentePct <= 3 ? 'text-green-600' :
                      inadimplentePct <= 5 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {inadimplentePct.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-blue-600 font-medium">
                    {formatCurrency(item.valor_a_repassar)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    {editingRow === item.id ? (
                      <input
                        type="number"
                        step="0.01"
                        className="w-full text-right text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        value={formData.valor_repassado || 0}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          valor_repassado: parseFloat(e.target.value) || 0
                        }))}
                      />
                    ) : (
                      <span className={`text-sm font-medium ${
                        item.valor_repassado > 0 ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {item.valor_repassado > 0 ? formatCurrency(item.valor_repassado) : 'Pendente'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {editingRow === item.id ? (
                      <input
                        type="date"
                        className="w-full text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        value={formData.data_repasse || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          data_repasse: e.target.value
                        }))}
                      />
                    ) : (
                      <span className="text-sm text-gray-900">
                        {formatDate(item.data_repasse)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {item.comprovante_anexado ? (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          <FileText className="w-3 h-3 mr-1" />
                          Anexado
                        </span>
                      ) : (
                        <label className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full cursor-pointer hover:bg-gray-200">
                          <UploadIcon className="w-3 h-3 mr-1" />
                          Anexar
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(item.id, e)}
                          />
                        </label>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {editingRow === item.id ? (
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
                      <span className="text-sm text-gray-600">
                        {item.observacoes || '-'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {editingRow === item.id ? (
                        <>
                          <button
                            onClick={() => handleSave(item.id)}
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
                            ×
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                    </tr>
                    {renderProductRows(item)}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredData.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>Nenhum registro encontrado para os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
};