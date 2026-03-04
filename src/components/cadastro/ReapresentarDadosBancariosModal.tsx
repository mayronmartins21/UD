import React, { useState } from 'react';
import { X, Save, RefreshCcw } from 'lucide-react';
import { PropostaComCorrecoes } from '../../types/propostas';

interface ReapresentarDadosBancariosModalProps {
  isOpen: boolean;
  proposta: PropostaComCorrecoes | null;
  onClose: () => void;
  onReapresentar: (dados: DadosBancarios) => void;
}

export interface DadosBancarios {
  banco: string;
  agencia: string;
  conta: string;
  tipo_conta: 'corrente' | 'poupanca';
  titular: string;
  cpf_titular: string;
}

export function ReapresentarDadosBancariosModal({
  isOpen,
  proposta,
  onClose,
  onReapresentar
}: ReapresentarDadosBancariosModalProps) {
  const [dados, setDados] = useState<DadosBancarios>({
    banco: '',
    agencia: '',
    conta: '',
    tipo_conta: 'corrente',
    titular: proposta?.nome_cliente || '',
    cpf_titular: proposta?.cpf_cliente || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DadosBancarios, string>>>({});

  const bancos = [
    { codigo: '001', nome: 'Banco do Brasil' },
    { codigo: '033', nome: 'Santander' },
    { codigo: '104', nome: 'Caixa Econômica Federal' },
    { codigo: '237', nome: 'Bradesco' },
    { codigo: '341', nome: 'Itaú' },
    { codigo: '077', nome: 'Banco Inter' },
    { codigo: '260', nome: 'Nubank' },
    { codigo: '323', nome: 'Mercado Pago' },
    { codigo: '290', nome: 'PagBank' }
  ];

  const validarCampos = (): boolean => {
    const novosErros: Partial<Record<keyof DadosBancarios, string>> = {};

    if (!dados.banco) novosErros.banco = 'Selecione um banco';
    if (!dados.agencia) novosErros.agencia = 'Informe a agência';
    if (!dados.conta) novosErros.conta = 'Informe a conta';
    if (!dados.titular) novosErros.titular = 'Informe o titular';
    if (!dados.cpf_titular) novosErros.cpf_titular = 'Informe o CPF do titular';

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validarCampos()) {
      onReapresentar(dados);
      handleClose();
    }
  };

  const handleClose = () => {
    setDados({
      banco: '',
      agencia: '',
      conta: '',
      tipo_conta: 'corrente',
      titular: proposta?.nome_cliente || '',
      cpf_titular: proposta?.cpf_cliente || ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen || !proposta) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Reapresentar Dados Bancários</h2>
              <p className="text-sm text-gray-600 mt-1">
                Proposta: <span className="font-mono font-medium">{proposta.numero_proposta}</span> - {proposta.nome_cliente}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <RefreshCcw className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Pagamento Devolvido</h3>
                <p className="text-sm text-red-800">
                  O pagamento desta proposta foi devolvido. Atualize os dados bancários e reapresente para processamento.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banco <span className="text-red-600">*</span>
              </label>
              <select
                value={dados.banco}
                onChange={(e) => setDados({ ...dados, banco: e.target.value })}
                className={`w-full rounded-lg border ${errors.banco ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Selecione o banco</option>
                {bancos.map((banco) => (
                  <option key={banco.codigo} value={banco.codigo}>
                    {banco.codigo} - {banco.nome}
                  </option>
                ))}
              </select>
              {errors.banco && <p className="text-sm text-red-600 mt-1">{errors.banco}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agência <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={dados.agencia}
                  onChange={(e) => setDados({ ...dados, agencia: e.target.value.replace(/\D/g, '') })}
                  placeholder="0000"
                  maxLength={4}
                  className={`w-full rounded-lg border ${errors.agencia ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.agencia && <p className="text-sm text-red-600 mt-1">{errors.agencia}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Conta <span className="text-red-600">*</span>
                </label>
                <select
                  value={dados.tipo_conta}
                  onChange={(e) => setDados({ ...dados, tipo_conta: e.target.value as 'corrente' | 'poupanca' })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="corrente">Conta Corrente</option>
                  <option value="poupanca">Conta Poupança</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número da Conta <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={dados.conta}
                onChange={(e) => setDados({ ...dados, conta: e.target.value })}
                placeholder="00000-0"
                className={`w-full rounded-lg border ${errors.conta ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              {errors.conta && <p className="text-sm text-red-600 mt-1">{errors.conta}</p>}
            </div>

            <div className="border-t border-gray-200 pt-4 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Dados do Titular</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo do Titular <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={dados.titular}
                  onChange={(e) => setDados({ ...dados, titular: e.target.value })}
                  className={`w-full rounded-lg border ${errors.titular ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.titular && <p className="text-sm text-red-600 mt-1">{errors.titular}</p>}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF do Titular <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={dados.cpf_titular}
                  onChange={(e) => setDados({ ...dados, cpf_titular: e.target.value })}
                  className={`w-full rounded-lg border ${errors.cpf_titular ? 'border-red-300' : 'border-gray-300'} px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  readOnly
                />
                {errors.cpf_titular && <p className="text-sm text-red-600 mt-1">{errors.cpf_titular}</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Reapresentar Dados
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
