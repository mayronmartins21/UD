import React, { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import type { ClienteData } from './CadastroClienteTab';

interface DadosClienteStepProps {
  data: ClienteData;
  onChange: (data: ClienteData) => void;
  onNext: () => void;
}

export const DadosClienteStep: React.FC<DadosClienteStepProps> = ({
  data,
  onChange,
  onNext
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  // Máscaras para formatação
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  // Buscar endereço por CEP
  const buscarEnderecoPorCEP = async (cep: string) => {
    if (cep.length === 9) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
        const endereco = await response.json();
        
        if (!endereco.erro) {
          onChange({
            ...data,
            endereco: endereco.logradouro,
            bairro: endereco.bairro,
            cidade: endereco.localidade,
            ufEndereco: endereco.uf
          });
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  // Validar CPF
  const validarCPF = async (cpf: string) => {
    if (cpf.length === 14) {
      setIsValidating(true);
      // Simular verificação de CPF existente
      setTimeout(() => {
        const cpfLimpo = cpf.replace(/\D/g, '');
        if (cpfLimpo === '12345678901') {
          setErrors(prev => ({
            ...prev,
            cpf: 'CPF já possui proposta ativa no sistema'
          }));
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.cpf;
            return newErrors;
          });
        }
        setIsValidating(false);
      }, 1000);
    }
  };

  const handleInputChange = (field: keyof ClienteData, value: string) => {
    let formattedValue = value;

    // Aplicar máscaras
    switch (field) {
      case 'cpf':
        formattedValue = formatCPF(value);
        if (formattedValue.length === 14) {
          validarCPF(formattedValue);
        }
        break;
      case 'cep':
        formattedValue = formatCEP(value);
        if (formattedValue.length === 9) {
          buscarEnderecoPorCEP(formattedValue);
        }
        break;
      case 'celular':
      case 'telefoneContato':
        formattedValue = formatPhone(value);
        break;
      case 'dataNascimento':
      case 'dataEmissao':
        formattedValue = formatDate(value);
        break;
    }

    onChange({ ...data, [field]: formattedValue });
  };

  // Validar campos obrigatórios
  const isFormValid = () => {
    // Permitir avanço sem validação obrigatória
    return Object.keys(errors).length === 0 && !isValidating;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Dados do Cliente</h3>
        <p className="text-gray-600">Preencha todas as informações do cliente</p>
      </div>

      <div className="space-y-8">
        {/* Dados Pessoais */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-blue-200">
            Dados Pessoais
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Processadora
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                value={data.processadora || ''}
                onChange={(e) => handleInputChange('processadora', e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="neoconsig">Neoconsig</option>
                <option value="zetra">Zetra</option>
                <option value="smartconsig">SmartConsig</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Convênio *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.convenio || ''}
                onChange={(e) => handleInputChange('convenio', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="governo_goias">Governo de Goiás</option>
                <option value="prefeitura_rio">Prefeitura do Rio de Janeiro</option>
                <option value="governo_maranhao">Governo do Maranhão</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.categoria || ''}
                onChange={(e) => handleInputChange('categoria', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="ativo">Ativo</option>
                <option value="aposentado">Aposentado</option>
                <option value="pensionista">Pensionista</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF *
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.cpf ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={data.cpf || ''}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
                {isValidating && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              {errors.cpf && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.cpf}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.matricula || ''}
                onChange={(e) => handleInputChange('matricula', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.nome || ''}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Situação Funcional
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.situacaoFuncional || ''}
                onChange={(e) => handleInputChange('situacaoFuncional', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Nascimento *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.dataNascimento || ''}
                onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.sexo || ''}
                onChange={(e) => handleInputChange('sexo', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Celular *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.celular || ''}
                onChange={(e) => handleInputChange('celular', e.target.value)}
                placeholder="(00) 00000-0000"
                maxLength={15}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail *
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Mãe *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.nomeMae || ''}
                onChange={(e) => handleInputChange('nomeMae', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Pai *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.nomePai || ''}
                onChange={(e) => handleInputChange('nomePai', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Civil *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.estadoCivil || ''}
                onChange={(e) => handleInputChange('estadoCivil', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="solteiro">Solteiro(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="viuvo">Viúvo(a)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nacionalidade
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.nacionalidade || 'Brasileira'}
                onChange={(e) => handleInputChange('nacionalidade', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo Documento *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.tipoDocumento || ''}
                onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="RG">RG</option>
                <option value="CNH">CNH</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.numeroDocumento || ''}
                onChange={(e) => handleInputChange('numeroDocumento', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UF *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.uf || ''}
                onChange={(e) => handleInputChange('uf', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="MG">MG</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="PR">PR</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Órgão Emissor *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.orgaoEmissor || ''}
                onChange={(e) => handleInputChange('orgaoEmissor', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Emissão *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.dataEmissao || ''}
                onChange={(e) => handleInputChange('dataEmissao', e.target.value)}
                placeholder="DD/MM/AAAA"
                maxLength={10}
                required
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-blue-200">
            Endereço
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP *
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={data.cep || ''}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 flex items-center"
                  onClick={() => buscarEnderecoPorCEP(data.cep)}
                >
                  <Search className="w-4 h-4 mr-1" />
                  Pesquisa
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.endereco || ''}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.bairro || ''}
                onChange={(e) => handleInputChange('bairro', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.numero || ''}
                onChange={(e) => handleInputChange('numero', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complemento
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.complemento || ''}
                onChange={(e) => handleInputChange('complemento', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de endereço *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.tipoEndereco || ''}
                onChange={(e) => handleInputChange('tipoEndereco', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="RESIDENCIAL">RESIDENCIAL</option>
                <option value="COMERCIAL">COMERCIAL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UF *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.ufEndereco || ''}
                onChange={(e) => handleInputChange('ufEndereco', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="MG">MG</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="PR">PR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.cidade || ''}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Renda Bruta
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.rendaBruta || ''}
                onChange={(e) => handleInputChange('rendaBruta', e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>
          </div>
        </div>

        {/* Dados Bancários */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-blue-200">
            Dados bancários
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banco *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.banco || ''}
                onChange={(e) => handleInputChange('banco', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="001">001 - Banco do Brasil</option>
                <option value="104">104 - Caixa Econômica</option>
                <option value="237">237 - Bradesco</option>
                <option value="341">341 - Itaú</option>
                <option value="033">033 - Santander</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agência *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.agencia || ''}
                onChange={(e) => handleInputChange('agencia', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conta *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.conta || ''}
                onChange={(e) => handleInputChange('conta', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dígito *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.digito || ''}
                onChange={(e) => handleInputChange('digito', e.target.value)}
                maxLength={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo Conta *
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.tipoConta || ''}
                onChange={(e) => handleInputChange('tipoConta', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                <option value="corrente">Conta Corrente</option>
                <option value="poupanca">Conta Poupança</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onNext}
          disabled={!isFormValid()}
          className={`px-6 py-3 rounded-md font-medium transition-all ${
            isFormValid()
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Próximo: Documentos
        </button>
      </div>
    </div>
  );
};