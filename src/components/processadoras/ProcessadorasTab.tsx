import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus, FileSpreadsheet } from 'lucide-react';
import { ProcessadorasTable } from './ProcessadorasTable';
import { ProcessadoraDetalhesPage } from './ProcessadoraDetalhesPage';
import { CadastrarProcessadoraPage } from './CadastrarProcessadoraPage';
import { processadorasMock } from '../../data/processadorasMockData';
import type { Processadora, ProcessadoraFormData } from '../../types/processadoras';
import { Toast } from '../common/Toast';

type ViewMode = 'lista' | 'detalhes' | 'cadastro';

export const ProcessadorasTab: React.FC = () => {
  const [processadoras, setProcessadoras] = useState<Processadora[]>(processadorasMock);
  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [selectedProcessadora, setSelectedProcessadora] = useState<Processadora | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const itemsPerPage = 10;

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCadastrar = () => {
    setViewMode('cadastro');
  };

  const handleSalvarNovaProcessadora = async (data: ProcessadoraFormData) => {
    try {
      const newProcessadora: Processadora = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setProcessadoras(prev => [newProcessadora, ...prev]);
      setSelectedProcessadora(newProcessadora);
      setViewMode('detalhes');
      showToast('success', 'Processadora cadastrada com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao cadastrar processadora');
      console.error('Erro ao salvar processadora:', error);
    }
  };

  const handleVisualizarProcessadora = (processadora: Processadora) => {
    setSelectedProcessadora(processadora);
    setViewMode('detalhes');
  };

  const handleEditarProcessadora = (processadora: Processadora) => {
    setSelectedProcessadora(processadora);
    setViewMode('detalhes');
  };

  const handleVoltar = () => {
    setSelectedProcessadora(null);
    setViewMode('lista');
    setCurrentPage(1);
  };

  const handleSalvarEdicao = async (data: Partial<ProcessadoraFormData>) => {
    if (!selectedProcessadora) return;

    try {
      const updatedProcessadora: Processadora = {
        ...selectedProcessadora,
        ...data,
        updatedAt: new Date().toISOString()
      };

      setProcessadoras(prev =>
        prev.map(p => (p.id === selectedProcessadora.id ? updatedProcessadora : p))
      );
      setSelectedProcessadora(updatedProcessadora);
      showToast('success', 'Processadora atualizada com sucesso!');
    } catch (error) {
      showToast('error', 'Erro ao atualizar processadora');
      console.error('Erro ao atualizar processadora:', error);
    }
  };

  const handleExportXLS = () => {
    console.log('Exportar para XLS');
    showToast('success', 'Exportação iniciada com sucesso!');
  };

  const processadorasFiltradas = useMemo(() => {
    if (!searchTerm.trim()) return processadoras;

    const term = searchTerm.toLowerCase();
    return processadoras.filter(
      p =>
        p.id.toLowerCase().includes(term) ||
        p.cnpj.toLowerCase().includes(term) ||
        p.razaoSocial.toLowerCase().includes(term) ||
        (p.nomeFantasia && p.nomeFantasia.toLowerCase().includes(term)) ||
        p.status.toLowerCase().includes(term)
    );
  }, [processadoras, searchTerm]);

  const totalPages = Math.ceil(processadorasFiltradas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const processadorasPaginadas = processadorasFiltradas.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (viewMode === 'cadastro') {
    return (
      <CadastrarProcessadoraPage
        onVoltar={handleVoltar}
        onSalvar={handleSalvarNovaProcessadora}
      />
    );
  }

  if (viewMode === 'detalhes' && selectedProcessadora) {
    return (
      <ProcessadoraDetalhesPage
        processadora={selectedProcessadora}
        onVoltar={handleVoltar}
        onSalvar={handleSalvarEdicao}
      />
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Processadoras</h2>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie as processadoras cadastradas no sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 justify-between">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por CNPJ ou razão social"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCadastrar}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Cadastrar
            </button>
            <button
              onClick={handleExportXLS}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Exportar
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <span>
            Exibindo {startIndex + 1}–{Math.min(endIndex, processadorasFiltradas.length)} de{' '}
            {processadorasFiltradas.length} registros
          </span>
        </div>
      </div>

      {processadorasPaginadas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma processadora encontrada
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Tente ajustar os termos de busca'
                : 'Comece cadastrando uma nova processadora'}
            </p>
          </div>
        </div>
      ) : (
        <>
          <ProcessadorasTable
            processadoras={processadorasPaginadas}
            onVisualizarProcessadora={handleVisualizarProcessadora}
            onEditarProcessadora={handleEditarProcessadora}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>

              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Página <span className="font-medium">{currentPage}</span> de{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {getPageNumbers().map((page, index) =>
                      page === '...' ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page as number)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
