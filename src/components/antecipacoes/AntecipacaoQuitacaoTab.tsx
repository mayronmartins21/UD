import React, { useState } from 'react';
import { FilterPanel } from '../common/FilterPanel';
import { KPICard } from '../common/KPICard';
import { AntecipacaoGrid } from './AntecipacaoGrid';
import { NovoRegistroModal } from './NovoRegistroModal';
import { EditarRegistroDrawer } from './EditarRegistroDrawer';
import { HistoricoServidorDrawer } from './HistoricoServidorDrawer';
import { 
  DollarSign, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  Plus,
  Download
} from 'lucide-react';
import type { FiltroAntecipacao, RegistroAntecipacao } from '../../types/antecipacoes';

export const AntecipacaoQuitacaoTab: React.FC = () => {
  const [filtros, setFiltros] = useState<FiltroAntecipacao>({
    competencia: '202501'
  });
  const [showNovoModal, setShowNovoModal] = useState(false);
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showHistoricoDrawer, setShowHistoricoDrawer] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroAntecipacao | null>(null);
  const [selectedCpf, setSelectedCpf] = useState<string>('');

  // Mock de dados para KPIs
  const mockKPIs = {
    qtde_antecipacoes: 45,
    qtde_quitacoes: 23,
    total_recebido: 1250000.00,
    pendente_repasse: 320000.00,
    repassado_qista: 930000.00,
    tempo_medio_repasse: 5.2
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatCompetencia = (comp: string) => {
    return `${comp.substring(4, 6)}/${comp.substring(0, 4)}`;
  };

  const handleBuscar = () => {
    console.log('Aplicando filtros:', filtros);
    // Aqui seria implementada a lógica de busca
  };

  const handleExportar = () => {
    const exportData = {
      filtros,
      data: new Date().toISOString(),
      tipo: 'antecipacoes_quitacoes'
    };
    
    alert(`Exportação iniciada:\n\nArquivos que serão gerados:\n• kpis.csv\n• registros.csv\n• repasses_qista.csv\n\nFiltros aplicados:\n${JSON.stringify(filtros, null, 2)}`);
  };

  const handleEditarRegistro = (registro: RegistroAntecipacao) => {
    setSelectedRegistro(registro);
    setShowEditDrawer(true);
  };

  const handleHistoricoServidor = (cpf: string) => {
    setSelectedCpf(cpf);
    setShowHistoricoDrawer(true);
  };

  const handleMarcarRepasse = (registro: RegistroAntecipacao) => {
    const dataRepasse = prompt('Data do repasse (DD/MM/AAAA):');
    if (dataRepasse) {
      alert(`Repasse marcado para ${registro.servidor_nome}\nData: ${dataRepasse}\nValor: ${formatCurrency(registro.valor_recebido)}`);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Liquidação Antecipada</h2>
        <p className="text-gray-600">
          Controle mensal de antecipações e quitações por competência de recebimento.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Filtros</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Convênio</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filtros.convenio || ''}
                onChange={(e) => setFiltros({ ...filtros, convenio: e.target.value || undefined })}
              >
                <option value="">Todos</option>
                <option value="1">Governo de Goiás</option>
                <option value="2">Governo do Maranhão</option>
                <option value="3">Governo do Paraná</option>
                <option value="4">Prefeitura de Sorocaba</option>
                <option value="7">Prefeitura do Rio de Janeiro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filtros.tipo || ''}
                onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value as any || undefined })}
              >
                <option value="">Todos</option>
                <option value="Antecipacao">Antecipação</option>
                <option value="Quitacao">Quitação</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filtros.status || ''}
                onChange={(e) => setFiltros({ ...filtros, status: e.target.value as any || undefined })}
              >
                <option value="">Todos</option>
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="RepassePendente">Repasse Pendente</option>
                <option value="RepassadoFundo">Repassado à Fundo</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Competência</label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={filtros.competencia || ''}
                onChange={(e) => setFiltros({ ...filtros, competencia: e.target.value || undefined })}
              >
                <option value="202501">01/2025</option>
                <option value="202502">02/2025</option>
                <option value="202503">03/2025</option>
                <option value="202504">04/2025</option>
                <option value="202505">05/2025</option>
                <option value="202506">06/2025</option>
                <option value="202507">07/2025</option>
                <option value="202508">08/2025</option>
                <option value="202509">09/2025</option>
                <option value="202510">10/2025</option>
                <option value="202511">11/2025</option>
                <option value="202512">12/2025</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Busca</label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="CPF / Nome / Operação"
                value={filtros.busca || ''}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value || undefined })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBuscar}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              Buscar
            </button>
            
            <button
              onClick={() => setShowNovoModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Registro
            </button>
            
            <button
              onClick={handleExportar}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Qtde Antecipações"
          value={mockKPIs.qtde_antecipacoes.toString()}
          subtitle={`Competência ${formatCompetencia(filtros.competencia || '202501')}`}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          color="blue"
        />
        
        <KPICard
          title="Qtde Quitações"
          value={mockKPIs.qtde_quitacoes.toString()}
          subtitle={`Competência ${formatCompetencia(filtros.competencia || '202501')}`}
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
          color="green"
        />
        
        <KPICard
          title="Total Recebido"
          value={formatCurrency(mockKPIs.total_recebido)}
          subtitle="Antecipações + Quitações"
          icon={<DollarSign className="w-6 h-6 text-purple-600" />}
          color="purple"
        />
        
        <KPICard
          title="Repassado à Fundo"
          value={formatCurrency(mockKPIs.repassado_qista)}
          subtitle="Já repassado"
          icon={<DollarSign className="w-6 h-6 text-green-600" />}
          color="green"
        />
      </div>

      {/* Grade Principal */}
      <AntecipacaoGrid 
        filtros={filtros}
        onEditar={handleEditarRegistro}
        onHistorico={handleHistoricoServidor}
        onMarcarRepasse={handleMarcarRepasse}
      />

      {/* Modais e Drawers */}
      {showNovoModal && (
        <NovoRegistroModal
          onClose={() => setShowNovoModal(false)}
          onSave={(registro) => {
            console.log('Novo registro:', registro);
            setShowNovoModal(false);
            alert('Registro criado com sucesso!');
          }}
        />
      )}

      {showEditDrawer && selectedRegistro && (
        <EditarRegistroDrawer
          registro={selectedRegistro}
          onClose={() => setShowEditDrawer(false)}
          onSave={(registro) => {
            console.log('Registro editado:', registro);
            setShowEditDrawer(false);
            alert('Registro atualizado com sucesso!');
          }}
        />
      )}

      {showHistoricoDrawer && (
        <HistoricoServidorDrawer
          cpf={selectedCpf}
          onClose={() => setShowHistoricoDrawer(false)}
        />
      )}
    </div>
  );
};