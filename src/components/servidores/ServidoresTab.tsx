import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { ServidoresTable } from './ServidoresTable';
import { ServidorDetalhesPage } from './ServidorDetalhesPage';
import { servidoresMock } from '../../data/servidoresMockData';
import type { ServidorCompleto } from '../../types/servidores';

interface ServidoresTabProps {
  cpfInicial?: string | null;
}

export const ServidoresTab: React.FC<ServidoresTabProps> = ({ cpfInicial }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [servidorSelecionado, setServidorSelecionado] = useState<ServidorCompleto | null>(null);
  const itemsPerPage = 20;

  useEffect(() => {
    if (cpfInicial) {
      const servidor = servidoresMock.find(s => s.cpf === cpfInicial);
      if (servidor) {
        setServidorSelecionado(servidor);
      }
    }
  }, [cpfInicial]);

  const servidoresFiltrados = useMemo(() => {
    return servidoresMock.filter(servidor => {
      const matchSearch = searchTerm === '' ||
        servidor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servidor.cpf.includes(searchTerm) ||
        servidor.matricula.toLowerCase().includes(searchTerm.toLowerCase());

      return matchSearch;
    });
  }, [searchTerm]);

  const totalPages = Math.ceil(servidoresFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const servidoresPaginados = servidoresFiltrados.slice(startIndex, endIndex);

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

  const handleExportXLS = () => {
    console.log('Exportar para XLS');
  };

  if (servidorSelecionado) {
    return (
      <ServidorDetalhesPage
        servidor={servidorSelecionado}
        onVoltar={() => setServidorSelecionado(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
        <p className="text-sm text-gray-600 mt-1">
          Consulte e gerencie os clientes cadastrados no sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 justify-between">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou matrícula"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleExportXLS}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Exportar XLS
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <span>
            Exibindo {startIndex + 1}–{Math.min(endIndex, servidoresFiltrados.length)} de {servidoresFiltrados.length} registros
          </span>
        </div>
      </div>

      {servidoresPaginados.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum servidor encontrado</h3>
            <p className="text-gray-600">
              Tente ajustar o termo de busca
            </p>
          </div>
        </div>
      ) : (
        <>
          <ServidoresTable
            servidores={servidoresPaginados}
            onVisualizarServidor={setServidorSelecionado}
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
