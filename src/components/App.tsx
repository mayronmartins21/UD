import { CadastroClienteTab } from './components/cadastro/CadastroClienteTab';
import { AntecipacaoQuitacaoTab } from './components/antecipacoes/AntecipacaoQuitacaoTab';
import { MesaTab } from './components/mesa/MesaTab';

type TabType = 'upload' | 'repasses' | 'conciliacao' | string;

const getCurrentBreadcrumb = () => {
  if (activeTab === 'cadastro-cliente') {
    return 'Operacional → Formalizador';
  } else if (activeTab === 'mesa') {
    return 'Operacional → Mesa de Análise';
  }
  return 'Financeiro → Repasses por Competência';