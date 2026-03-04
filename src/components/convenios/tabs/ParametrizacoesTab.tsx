import React, { useState } from 'react';
import { Settings, Plus, Edit2, Trash2, Upload, Eye, RefreshCw } from 'lucide-react';
import type { ConvenioCompleto, AgendaCorte, ArquivoDebito } from '../../../types/convenios';
import { AdicionarAgendaCorteModalV2 } from '../modals/AdicionarAgendaCorteModalV2';
import { AnexarArquivoDebitoModal } from '../modals/AnexarArquivoDebitoModal';
import { Toast } from '../../common/Toast';

interface ParametrizacoesTabProps {
  convenio: ConvenioCompleto;
  modoEdicao: boolean;
  onUpdateConvenio?: (convenio: ConvenioCompleto) => void;
}

export const ParametrizacoesTab: React.FC<ParametrizacoesTabProps> = ({
  convenio,
  modoEdicao,
  onUpdateConvenio
}) => {
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [showArquivoModal, setShowArquivoModal] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const parametrizacao = convenio.parametrizacao;

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSaveAgenda = async (agendaData: Omit<AgendaCorte, 'id' | 'createdAt'>) => {
    try {
      const novaAgenda: AgendaCorte = {
        ...agendaData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };

      const convenioAtualizado = {
        ...convenio,
        agendasCorte: [...convenio.agendasCorte, novaAgenda].sort((a, b) =>
          new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime()
        )
      };

      if (onUpdateConvenio) {
        onUpdateConvenio(convenioAtualizado);
      }

      showToast('success', 'Data de corte cadastrada com sucesso');
    } catch (error) {
      console.error('Erro ao salvar agenda:', error);
      showToast('error', 'Erro ao cadastrar data de corte');
      throw error;
    }
  };

  const handleSaveArquivo = async (arquivoData: Omit<ArquivoDebito, 'id' | 'createdAt'>) => {
    try {
      const novoArquivo: ArquivoDebito = {
        ...arquivoData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };

      const convenioAtualizado = {
        ...convenio,
        arquivosDebito: [...convenio.arquivosDebito, novoArquivo]
      };

      if (onUpdateConvenio) {
        onUpdateConvenio(convenioAtualizado);
      }

      showToast('success', 'Arquivo de débito anexado com sucesso');
    } catch (error) {
      console.error('Erro ao anexar arquivo:', error);
      showToast('error', 'Erro ao anexar arquivo de débito');
      throw error;
    }
  };

  const handleAdicionarCategoriaCartaoCompras = (categoria: string) => {
    if (!parametrizacao || !onUpdateConvenio) return;

    const convenioAtualizado = {
      ...convenio,
      parametrizacao: {
        ...parametrizacao,
        categoriasCartaoCompras: [...parametrizacao.categoriasCartaoCompras, categoria]
      }
    };

    onUpdateConvenio(convenioAtualizado);
    showToast('success', `Categoria "${categoria}" adicionada ao Cartão Compras`);
  };

  const handleRemoverCategoriaCartaoCompras = (categoria: string) => {
    if (!parametrizacao || !onUpdateConvenio) return;

    const convenioAtualizado = {
      ...convenio,
      parametrizacao: {
        ...parametrizacao,
        categoriasCartaoCompras: parametrizacao.categoriasCartaoCompras.filter(c => c !== categoria)
      }
    };

    onUpdateConvenio(convenioAtualizado);
    showToast('success', `Categoria "${categoria}" removida do Cartão Compras`);
  };

  const handleAdicionarCategoriaSaqueFacil = (categoria: string) => {
    if (!parametrizacao || !onUpdateConvenio) return;

    const convenioAtualizado = {
      ...convenio,
      parametrizacao: {
        ...parametrizacao,
        categoriasSaqueFacil: [...parametrizacao.categoriasSaqueFacil, categoria]
      }
    };

    onUpdateConvenio(convenioAtualizado);
    showToast('success', `Categoria "${categoria}" adicionada ao Saque Fácil`);
  };

  const handleRemoverCategoriaSaqueFacil = (categoria: string) => {
    if (!parametrizacao || !onUpdateConvenio) return;

    const convenioAtualizado = {
      ...convenio,
      parametrizacao: {
        ...parametrizacao,
        categoriasSaqueFacil: parametrizacao.categoriasSaqueFacil.filter(c => c !== categoria)
      }
    };

    onUpdateConvenio(convenioAtualizado);
    showToast('success', `Categoria "${categoria}" removida do Saque Fácil`);
  };

  if (!parametrizacao) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma parametrização configurada
          </h3>
          <p className="text-gray-600">
            Configure as parametrizações do convênio
          </p>
        </div>
      </div>
    );
  }

  const renderSwitch = (label: string, value: boolean) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {modoEdicao ? (
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked={value} className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      ) : (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
        }`}>
          {value ? 'Sim' : 'Não'}
        </span>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <AdicionarAgendaCorteModalV2
        convenioId={convenio.id}
        isOpen={showAgendaModal}
        onClose={() => setShowAgendaModal(false)}
        onSave={handleSaveAgenda}
        existingAgendas={convenio.agendasCorte}
      />

      <AnexarArquivoDebitoModal
        convenioId={convenio.id}
        isOpen={showArquivoModal}
        onClose={() => setShowArquivoModal(false)}
        onSave={handleSaveArquivo}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Consulta via API
        </h3>
        <div className="space-y-3">
          {renderSwitch('Utiliza Token na Consulta', parametrizacao.utilizaTokenConsulta)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Averbação
        </h3>
        <div className="space-y-3">
          {renderSwitch('Utiliza Token', parametrizacao.utilizaTokenAverbacao)}
          {renderSwitch('Utiliza Senha de Consignação', parametrizacao.utilizaSenhaConsignacao)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Estabelecimento
        </h3>
        <div className="space-y-3">
          {renderSwitch('É um Estabelecimento', parametrizacao.ehEstabelecimento)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Cartão Compras
        </h3>
        <div className="space-y-3">
          {renderSwitch('Cartão Compras Liberado', parametrizacao.cartaoComprasLiberado)}

          {parametrizacao.cartaoComprasLiberado && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorias de Servidores Aceitas
              </label>

              {modoEdicao && (
                <div className="mb-3 flex gap-2">
                  <input
                    id="input-cartao-compras"
                    type="text"
                    placeholder="Ex: Estatutário, Aposentado, Pensionista"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const value = input.value.trim();
                        if (value) {
                          handleAdicionarCategoriaCartaoCompras(value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    onClick={() => {
                      const input = document.getElementById('input-cartao-compras') as HTMLInputElement;
                      const value = input?.value.trim();
                      if (value) {
                        handleAdicionarCategoriaCartaoCompras(value);
                        input.value = '';
                      }
                    }}
                  >
                    Adicionar
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {parametrizacao.categoriasCartaoCompras.map((categoria, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {categoria}
                    {modoEdicao && (
                      <button
                        className="ml-1 hover:text-blue-900 text-lg leading-none"
                        onClick={() => handleRemoverCategoriaCartaoCompras(categoria)}
                        title="Remover categoria"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {parametrizacao.categoriasCartaoCompras.length === 0 && (
                  <p className="text-sm text-gray-500 italic">Nenhuma categoria cadastrada</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Saque Fácil
        </h3>
        <div className="space-y-3">
          {renderSwitch('Realiza Oferta de Saque Fácil', parametrizacao.realizaOfertaSaqueFacil)}
          {renderSwitch('Cartão Saque Fácil Liberado', parametrizacao.cartaoSaqueFacilLiberado)}

          {(parametrizacao.realizaOfertaSaqueFacil || parametrizacao.cartaoSaqueFacilLiberado) && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorias de Servidores Aceitas
              </label>

              {modoEdicao && (
                <div className="mb-3 flex gap-2">
                  <input
                    id="input-saque-facil"
                    type="text"
                    placeholder="Ex: Estatutário, Aposentado, Pensionista"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const value = input.value.trim();
                        if (value) {
                          handleAdicionarCategoriaSaqueFacil(value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                    onClick={() => {
                      const input = document.getElementById('input-saque-facil') as HTMLInputElement;
                      const value = input?.value.trim();
                      if (value) {
                        handleAdicionarCategoriaSaqueFacil(value);
                        input.value = '';
                      }
                    }}
                  >
                    Adicionar
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {parametrizacao.categoriasSaqueFacil.map((categoria, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {categoria}
                    {modoEdicao && (
                      <button
                        className="ml-1 hover:text-green-900 text-lg leading-none"
                        onClick={() => handleRemoverCategoriaSaqueFacil(categoria)}
                        title="Remover categoria"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {parametrizacao.categoriasSaqueFacil.length === 0 && (
                  <p className="text-sm text-gray-500 italic">Nenhuma categoria cadastrada</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Módulo Confia
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Centro de Atendimento
          </label>
          {modoEdicao ? (
            <select
              value={parametrizacao.atendimento}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione</option>
              <option value="Atendimento SP">Atendimento SP</option>
              <option value="Atendimento RJ">Atendimento RJ</option>
              <option value="Atendimento MG">Atendimento MG</option>
            </select>
          ) : (
            <p className="text-sm text-gray-900 py-2">{parametrizacao.atendimento || 'Não definido'}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Agendas de Corte
          </h3>
          {modoEdicao && (
            <button
              onClick={() => setShowAgendaModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Adicionar Agenda
            </button>
          )}
        </div>

        {convenio.agendasCorte.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhuma agenda de corte cadastrada
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Data Início
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Data Fim
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Observação
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  {modoEdicao && (
                    <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                      Ações
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {convenio.agendasCorte.map((agenda) => (
                  <tr key={agenda.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {new Date(agenda.dataInicio).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {new Date(agenda.dataFim).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {agenda.observacao || '-'}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          agenda.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {agenda.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    {modoEdicao && (
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Arquivos de Débito
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Layout em PDF, TXT ou PNG com o modelo para processamento de arquivo
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowArquivoModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Upload className="w-4 h-4" />
              Anexar
            </button>
          </div>
        </div>

        {convenio.arquivosDebito.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhum arquivo anexado
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Nome do Layout
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Periodicidade
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                    Observação
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-700 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {convenio.arquivosDebito.map((arquivo) => (
                  <tr key={arquivo.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900 font-medium">
                      {arquivo.nomeLayout}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {arquivo.periodicidade}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {arquivo.observacao || '-'}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Substituir"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
