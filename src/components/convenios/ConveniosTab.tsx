import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus, CheckCircle, XCircle } from 'lucide-react';
import { ConveniosTable } from './ConveniosTable';
import { ConvenioDetalhesPage } from './ConvenioDetalhesPage';
import { CadastrarConvenioPage } from './CadastrarConvenioPage';
import { conveniosMock } from '../../data/conveniosMockData';
import { salvarConvenio, buscarConvenios } from '../../lib/convenioService';
import type { ConvenioCompleto, Convenio } from '../../types/convenios';

type ViewMode = 'listagem' | 'cadastro' | 'detalhes';

export const ConveniosTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [convenioSelecionado, setConvenioSelecionado] = useState<ConvenioCompleto | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('listagem');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [convenios, setConvenios] = useState<ConvenioCompleto[]>(conveniosMock);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    carregarConvenios();
  }, []);

  const carregarConvenios = async () => {
    try {
      setLoading(true);
      const conveniosDb = await buscarConvenios();
      if (conveniosDb.length > 0) {
        setConvenios(conveniosDb);
      }
    } catch (error) {
      console.error('Erro ao carregar convênios:', error);
    } finally {
      setLoading(false);
    }
  };

  const conveniosFiltrados = useMemo(() => {
    return convenios.filter(convenio => {
      const searchLower = searchTerm.toLowerCase();
      return (
        convenio.processadora.toLowerCase().includes(searchLower) ||
        convenio.nomeFantasia.toLowerCase().includes(searchLower) ||
        convenio.razaoSocial.toLowerCase().includes(searchLower) ||
        convenio.cnpj.includes(searchTerm)
      );
    });
  }, [searchTerm, convenios]);

  const totalPages = Math.ceil(conveniosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const conveniosPaginados = conveniosFiltrados.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCadastrar = () => {
    setViewMode('cadastro');
  };

  const handleSalvarNovoConvenio = async (convenio: Partial<ConvenioCompleto>) => {
    try {
      setLoading(true);
      const novoConvenio = await salvarConvenio(convenio);

      setConvenios(prev => [...prev, novoConvenio]);

      showToast('success', 'Convênio cadastrado com sucesso!');

      setTimeout(() => {
        setConvenioSelecionado(novoConvenio);
        setModoEdicao(false);
        setViewMode('detalhes');
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar convênio:', error);
      showToast('error', 'Erro ao cadastrar convênio. Tente novamente.');
      setLoading(false);
    }
  };

  const handleVisualizarConvenio = (convenio: Convenio) => {
    const convenioCompleto = convenios.find(c => c.id === convenio.id);
    if (convenioCompleto) {
      setConvenioSelecionado(convenioCompleto);
      setModoEdicao(false);
      setViewMode('detalhes');
    }
  };

  const handleEditarConvenio = (convenio: Convenio) => {
    const convenioCompleto = convenios.find(c => c.id === convenio.id);
    if (convenioCompleto) {
      setConvenioSelecionado(convenioCompleto);
      setModoEdicao(true);
      setViewMode('detalhes');
    }
  };

  const handleVoltar = () => {
    setViewMode('listagem');
    setConvenioSelecionado(null);
    setModoEdicao(false);
  };

  const handleUpdateConvenio = (convenioAtualizado: ConvenioCompleto) => {
    setConvenios(prev =>
      prev.map(c => (c.id === convenioAtualizado.id ? convenioAtualizado : c))
    );
    setConvenioSelecionado(convenioAtualizado);
  };

  if (viewMode === 'cadastro') {
    return (
      <>
        <CadastrarConvenioPage
          onVoltar={handleVoltar}
          onSalvar={handleSalvarNovoConvenio}
        />
        {toast && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                toast.type === 'success'
                  ? 'bg-green-600 text-white'
                  : 'bg-red-600 text-white'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  if (viewMode === 'detalhes' && convenioSelecionado) {
    return (
      <ConvenioDetalhesPage
        convenio={convenioSelecionado}
        modoEdicao={modoEdicao}
        onVoltar={handleVoltar}
        onAlterarModo={setModoEdicao}
        onUpdateConvenio={handleUpdateConvenio}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Convênios</h2>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie os convênios cadastrados no sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 justify-between">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por processadora, convênio, CNPJ ou razão social"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleCadastrar}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Cadastrar
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <span>
            Exibindo {startIndex + 1}–{Math.min(endIndex, conveniosFiltrados.length)} de {conveniosFiltrados.length} registros
          </span>
        </div>
      </div>

      {conveniosPaginados.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum convênio encontrado</h3>
            <p className="text-gray-600">
              Tente ajustar o termo de busca ou cadastre um novo convênio
            </p>
          </div>
        </div>
      ) : (
        <>
          <ConveniosTable
            convenios={conveniosPaginados}
            onVisualizarConvenio={handleVisualizarConvenio}
            onEditarConvenio={handleEditarConvenio}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
