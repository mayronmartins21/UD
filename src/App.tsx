import React, { useState } from 'react';
import {
  Upload, BarChart3, GitMerge, Settings, Users, ChevronDown, ChevronRight,
  Home, Shield, User, Building, CreditCard, UserCheck, Calculator,
  FileText, Umbrella, LogOut, Menu, X, DollarSign, Clock, Smartphone, Package
} from 'lucide-react';
import { UploadTab } from './components/upload/UploadTab';
import { RepassesTab } from './components/repasses/RepassesTab';
import { ConciliacaoTab } from './components/conciliacao/ConciliacaoTab';
import { CadastroClienteTab } from './components/cadastro/CadastroClienteTab';
import { AntecipacaoQuitacaoTab } from './components/antecipacoes/AntecipacaoQuitacaoTab';
import { MesaTab } from './components/mesa/MesaTab';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { ServidoresTab } from './components/servidores/ServidoresTab';
import { ConveniosTab } from './components/convenios/ConveniosTab';
import { ProcessadorasTab } from './components/processadoras/ProcessadorasTab';
import { VencimentoContratosPage } from './components/relatorios/VencimentoContratosPage';

type TabType = 'upload' | 'repasses' | 'conciliacao' | string;

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  children?: MenuItem[];
}

interface MenuGroup {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  items: MenuItem[];
}

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard-geral');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['dashboard']);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [propostaEmAndamento, setPropostaEmAndamento] = useState(false);
  const [abaDesejada, setAbaDesejada] = useState<string | null>(null);
  const [servidorSelecionadoCpf, setServidorSelecionadoCpf] = useState<string | null>(null);
  const [propostaSelecionada, setPropostaSelecionada] = useState<string | null>(null);

  const menuGroups: MenuGroup[] = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Home,
      items: [
        { id: 'dashboard-geral', name: 'Visão Geral', icon: BarChart3 }
      ]
    },
    {
      id: 'administrativo',
      name: 'Administrativo',
      icon: Shield,
      items: [
        { id: 'perfil', name: 'Perfil', icon: User },
        { id: 'usuarios', name: 'Usuários', icon: Users },
        { id: 'servidores', name: 'Clientes', icon: Users },
        { id: 'convenios', name: 'Convênios', icon: Building },
        { id: 'processadoras', name: 'Processadoras', icon: CreditCard },
        { id: 'empresas-parceiras', name: 'Empresas Parceiras', icon: Building }
      ]
    },
    {
      id: 'operacional',
      name: 'Operacional',
      icon: Settings,
      items: [
        { id: 'cadastro-cliente', name: 'Formalizador', icon: User },
        { id: 'mesa', name: 'Mesa', icon: UserCheck },
        { id: 'simulador', name: 'Simulador', icon: Calculator }
      ]
    },
    {
      id: 'gerencial',
      name: 'Gerencial',
      icon: FileText,
      items: [
        {
          id: 'relatorios',
          name: 'Relatórios',
          icon: FileText,
          children: [
            { id: 'relatorios-aplicativo', name: 'Aplicativo', icon: Smartphone },
            { id: 'relatorios-seguros', name: 'Seguros', icon: Umbrella },
            { id: 'relatorios-assinaturas', name: 'Assinaturas', icon: Package },
            { id: 'relatorios-facajus', name: 'Façajus', icon: FileText },
            {
              id: 'cartao-beneficios',
              name: 'Cartão Benefícios',
              icon: CreditCard,
              children: [
                { id: 'saque-facil', name: 'Saque Fácil', icon: DollarSign },
                { id: 'vencimento-contratos', name: 'Vencimento de Contratos', icon: Clock }
              ]
            }
          ]
        },
        { id: 'seguro-oferta', name: 'Seguro Oferta', icon: Umbrella }
      ]
    },
    {
      id: 'financeiro',
      name: 'Financeiro',
      icon: DollarSign,
      items: [
        { id: 'upload', name: 'Upload', icon: Upload },
        { id: 'repasses', name: 'Repasses', icon: BarChart3 },
        { id: 'conciliacao', name: 'Conciliação', icon: GitMerge },
        { id: 'antecipacoes', name: 'Liquidação Antecipada', icon: DollarSign }
      ]
    }
  ];

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleMenuClick = (itemId: string) => {
    if (activeTab === 'cadastro-cliente' && propostaEmAndamento && itemId !== 'cadastro-cliente') {
      setAbaDesejada(itemId);
      return;
    }

    if (['upload', 'repasses', 'conciliacao', 'antecipacoes', 'dashboard-geral', 'servidores', 'convenios', 'processadoras', 'vencimento-contratos'].includes(itemId)) {
      setActiveTab(itemId);
    } else if (['cadastro-cliente', 'mesa'].includes(itemId)) {
      setActiveTab(itemId);
    } else {
      alert(`Navegando para: ${itemId}\n\nEsta funcionalidade será implementada em breve.`);
    }
  };

  const confirmarMudancaAba = () => {
    if (abaDesejada) {
      setPropostaEmAndamento(false);
      if (['upload', 'repasses', 'conciliacao', 'antecipacoes', 'dashboard-geral', 'servidores', 'convenios', 'processadoras', 'vencimento-contratos'].includes(abaDesejada)) {
        setActiveTab(abaDesejada);
      } else if (['cadastro-cliente', 'mesa'].includes(abaDesejada)) {
        setActiveTab(abaDesejada);
      }
      setAbaDesejada(null);
    }
  };

  const cancelarMudancaAba = () => {
    setAbaDesejada(null);
  };

  const handleNavigateToServidor = (cpf: string, numeroProposta: string) => {
    setServidorSelecionadoCpf(cpf);
    setPropostaSelecionada(numeroProposta);
    setActiveTab('servidores');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard-geral':
        return <DashboardTab />;
      case 'upload':
        return <UploadTab />;
      case 'repasses':
        return <RepassesTab />;
      case 'conciliacao':
        return <ConciliacaoTab />;
      case 'cadastro-cliente':
        return (
          <CadastroClienteTab
            onPropostaEmAndamento={setPropostaEmAndamento}
            mostrarPopupSalvar={abaDesejada !== null}
            onConfirmarSalvar={confirmarMudancaAba}
            onCancelarSalvar={cancelarMudancaAba}
          />
        );
      case 'mesa':
        return <MesaTab />;
      case 'antecipacoes':
        return <AntecipacaoQuitacaoTab />;
      case 'servidores':
        return <ServidoresTab cpfInicial={servidorSelecionadoCpf} propostaInicial={propostaSelecionada} />;
      case 'convenios':
        return <ConveniosTab />;
      case 'processadoras':
        return <ProcessadorasTab />;
      case 'vencimento-contratos':
        return <VencimentoContratosPage onNavigateToServidor={handleNavigateToServidor} />;
      default:
        return <DashboardTab />;
    }
  };

  const getCurrentPageTitle = () => {
    const financialTabs = {
      'dashboard-geral': 'Dashboard - Visão Geral',
      upload: 'Upload de Arquivos',
      repasses: 'Dashboard de Repasses',
      conciliacao: 'Conciliações',
      'cadastro-cliente': 'Formalizador',
      'mesa': 'Mesa de Análise',
      'antecipacoes': 'Liquidação Antecipada',
      'servidores': 'Clientes',
      'convenios': 'Convênios',
      'processadoras': 'Processadoras',
      'vencimento-contratos': 'Vencimento de Contratos'
    };

    return financialTabs[activeTab as keyof typeof financialTabs] || 'Sistema UseDigi';
  };

  const getCurrentBreadcrumb = () => {
    if (activeTab === 'dashboard-geral') {
      return 'Dashboard → Visão Geral';
    } else if (activeTab === 'cadastro-cliente') {
      return 'Operacional → Formalizador';
    } else if (activeTab === 'mesa') {
      return 'Operacional → Mesa de Análise';
    } else if (activeTab === 'servidores') {
      return 'Administrativo → Clientes';
    } else if (activeTab === 'convenios') {
      return 'Administrativo → Convênios';
    } else if (activeTab === 'processadoras') {
      return 'Administrativo → Processadoras';
    } else if (activeTab === 'vencimento-contratos') {
      return 'Gerencial → Relatórios → Cartão Benefícios → Vencimento de Contratos';
    } else if (['upload', 'repasses', 'conciliacao', 'antecipacoes'].includes(activeTab)) {
      return 'Financeiro → ' + getCurrentPageTitle().replace('Dashboard de ', '');
    }
    return 'Sistema UseDigi';
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        {/* Logo e Toggle */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">UD</span>
                </div>
                <div className="ml-3">
                  <h1 className="text-lg font-bold text-gray-900">UseDigi</h1>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto flex-1">
          {menuGroups.map((group) => {
            const Icon = group.icon;
            const isExpanded = expandedGroups.includes(group.id);

            const renderMenuItem = (item: MenuItem, level: number = 0) => {
              const ItemIcon = item.icon;
              const isActive = activeTab === item.id;
              const hasChildren = item.children && item.children.length > 0;
              const isItemExpanded = expandedGroups.includes(item.id);
              const marginLeft = level * 16;

              return (
                <div key={item.id}>
                  <button
                    onClick={() => {
                      if (hasChildren) {
                        toggleGroup(item.id);
                      } else {
                        handleMenuClick(item.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-2 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{ marginLeft: `${marginLeft}px` }}
                  >
                    <div className="flex items-center">
                      <ItemIcon className="w-4 h-4 mr-2" />
                      {item.name}
                    </div>
                    {hasChildren && (
                      isItemExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
                    )}
                  </button>

                  {hasChildren && isItemExpanded && (
                    <div className="mt-1 space-y-1">
                      {item.children!.map((child) => renderMenuItem(child, level + 1))}
                    </div>
                  )}
                </div>
              );
            };

            return (
              <div key={group.id}>
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3" />
                    {sidebarOpen && <span className="font-medium">{group.name}</span>}
                  </div>
                  {sidebarOpen && (
                    isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Group Items */}
                {isExpanded && sidebarOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {group.items.map((item) => renderMenuItem(item))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Logout */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => alert('Logout realizado com sucesso!')}
              className="w-full flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {sidebarOpen && <span>Sair</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getCurrentPageTitle()}</h2>
                <p className="text-sm text-gray-500">{getCurrentBreadcrumb()}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Usuário: ana.silva (Financeiro)</span>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {renderTabContent()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                © 2024 UseDigi - Sistema de Repasses por Competência v2.1.0
              </div>
              <div className="flex items-center space-x-4">
                <span>Última atualização: {new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span>Ambiente: Produção</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;