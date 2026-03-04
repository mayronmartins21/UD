import React from 'react';
import { User, Phone, Mail, FileText, MapPin, Building2, Pencil } from 'lucide-react';
import type { ServidorCompleto } from '../../../types/servidores';
import { LogsAlteracoesTabela } from '../../common/LogsAlteracoesTabela';
import { logsExemplo } from '../../../data/logsMockData';

interface DadosPessoaisTabProps {
  servidor: ServidorCompleto;
}

export const DadosPessoaisTab: React.FC<DadosPessoaisTabProps> = ({ servidor }) => {
  const InfoCard = ({ title, icon: Icon, children, onEdit }: { title: string; icon: any; children: React.ReactNode; onEdit?: () => void }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );

  const InfoField = ({ label, value }: { label: string; value: string | undefined }) => (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-gray-900 font-medium">{value || '-'}</p>
    </div>
  );

  const handleEditContato = () => {
    console.log('Editar Contato');
  };

  const handleEditEndereco = () => {
    console.log('Editar Endereço');
  };

  const handleEditDadosBancarios = () => {
    console.log('Editar Dados Bancários');
  };

  return (
    <div className="space-y-6">
      <InfoCard title="Identificação" icon={User}>
        <InfoField label="Nome Completo" value={servidor.nome} />
        <InfoField label="CPF" value={servidor.cpf} />
        <InfoField label="Matrícula" value={servidor.matricula} />
        <InfoField label="Categoria" value={servidor.categoria} />
        <InfoField label="Convênio" value={servidor.convenio} />
        <InfoField
          label="Data de Cadastro"
          value={new Date(servidor.dataCadastro).toLocaleDateString('pt-BR')}
        />
      </InfoCard>

      <InfoCard title="Contato" icon={Phone} onEdit={handleEditContato}>
        <InfoField label="Telefone" value={servidor.telefone} />
        <InfoField label="Email" value={servidor.email} />
      </InfoCard>

      <InfoCard title="Documentos" icon={FileText}>
        <InfoField label="RG" value={servidor.rg} />
        <InfoField label="Órgão Emissor" value={servidor.rgOrgaoEmissor} />
        <InfoField label="UF" value={servidor.rgUf} />
        <InfoField
          label="Data de Emissão"
          value={new Date(servidor.rgDataEmissao).toLocaleDateString('pt-BR')}
        />
      </InfoCard>

      <InfoCard title="Endereço" icon={MapPin} onEdit={handleEditEndereco}>
        <InfoField label="CEP" value={servidor.cep} />
        <InfoField label="Logradouro" value={servidor.logradouro} />
        <InfoField label="Número" value={servidor.numero} />
        <InfoField label="Complemento" value={servidor.complemento} />
        <InfoField label="Bairro" value={servidor.bairro} />
        <InfoField label="Cidade" value={servidor.cidade} />
        <InfoField label="UF" value={servidor.uf} />
      </InfoCard>

      <InfoCard title="Dados Bancários" icon={Building2} onEdit={handleEditDadosBancarios}>
        <InfoField label="Banco" value={servidor.banco} />
        <InfoField label="Agência" value={servidor.agencia} />
        <InfoField label="Conta" value={servidor.conta} />
        <InfoField label="Tipo de Conta" value={servidor.tipoConta} />
      </InfoCard>

      <LogsAlteracoesTabela logs={logsExemplo} />
    </div>
  );
};
