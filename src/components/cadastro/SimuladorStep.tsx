import React, { useState, useEffect } from 'react';
import { Calculator, CheckCircle, AlertCircle, Search } from 'lucide-react';
import type { SimuladorData, ClienteData } from './CadastroClienteTab';
import { consultarMargem, requiresToken } from '../../lib/margemService';

interface SimuladorStepProps {
  data: SimuladorData;
  onChange: (data: SimuladorData) => void;
  onNext: (clienteData: Partial<ClienteData>) => void;
}

export const SimuladorStep: React.FC<SimuladorStepProps> = ({
  data,
  onChange,
  onNext
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [token, setToken] = useState('');
  const [margemDisponivel, setMargemDisponivel] = useState<number | null>(null);
  const [margemLoading, setMargemLoading] = useState(false);
  const [margemError, setMargemError] = useState<string | null>(null);
  const [convenioRequiresToken, setConvenioRequiresToken] = useState(false);

  useEffect(() => {
    if (data.convenio) {
      const needsToken = requiresToken(data.convenio);
      setConvenioRequiresToken(needsToken);
      setMargemDisponivel(null);
      setMargemError(null);
      setToken('');
    }
  }, [data.convenio]);

  useEffect(() => {
    if (!convenioRequiresToken && data.convenio && data.cpf && data.matricula) {
      const cpfNumerico = data.cpf.replace(/\D/g, '');
      if (cpfNumerico.length === 11 && data.matricula.trim() !== '') {
        consultarMargemAutomaticamente();
      }
    }
  }, [data.convenio, data.cpf, data.matricula, convenioRequiresToken]);

  const consultarMargemAutomaticamente = async () => {
    setMargemLoading(true);
    setMargemError(null);
    setMargemDisponivel(null);

    const resultado = await consultarMargem({
      convenio: data.convenio!,
      cpf: data.cpf!,
      matricula: data.matricula!,
    });

    setMargemLoading(false);

    if (resultado.success && resultado.margem) {
      setMargemDisponivel(resultado.margem);
    } else {
      setMargemError(resultado.error || 'Não foi possível consultar a margem. Tente novamente.');
    }
  };

  const consultarMargemComToken = async () => {
    if (!token || token.trim() === '') {
      setMargemError('Por favor, informe o token');
      return;
    }

    setMargemLoading(true);
    setMargemError(null);
    setMargemDisponivel(null);

    const resultado = await consultarMargem({
      convenio: data.convenio!,
      cpf: data.cpf!,
      matricula: data.matricula!,
      token: token,
    });

    setMargemLoading(false);

    if (resultado.success && resultado.margem) {
      setMargemDisponivel(resultado.margem);
    } else {
      setMargemError(resultado.error || 'Não foi possível consultar a margem. Tente novamente.');
    }
  };

  // Máscaras para formatação
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return formattedValue;
  };

  const formatDisplayCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleInputChange = (field: keyof SimuladorData, value: string) => {
    let formattedValue = value;

    // Aplicar máscaras
    switch (field) {
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'dataNascimento':
        formattedValue = formatDate(value);
        break;
      case 'valor':
        formattedValue = formatCurrency(value);
        break;
    }

    onChange({ ...data, [field]: formattedValue });

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.convenio) newErrors.convenio = 'Selecione um convênio';
    if (!data.cpf || data.cpf.length < 14) newErrors.cpf = 'CPF inválido';
    if (!data.matricula) newErrors.matricula = 'Matrícula é obrigatória';
    if (!data.dataNascimento || data.dataNascimento.length < 10) newErrors.dataNascimento = 'Data inválida';
    if (!data.tipoSimulacao) newErrors.tipoSimulacao = 'Selecione o tipo de simulação';
    if (!data.valor) newErrors.valor = 'Valor é obrigatório';
    if (!data.prazo) newErrors.prazo = 'Selecione o prazo';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSimular = async () => {
    if (!validateForm()) return;

    setIsSimulating(true);
    onChange({ ...data, status: 'loading' });

    // Simular chamada à API de simulação
    setTimeout(() => {
      const sucesso = Math.random() > 0.1; // 90% de chance de sucesso
      
      if (sucesso) {
        // Calcular valores mockados baseados nos dados informados
        const valorNumerico = parseFloat(data.valor.replace(/[^\d,]/g, '').replace(',', '.'));
        const prazoNumerico = parseInt(data.prazo);
        
        let valorLiberado, valorParcela;
        
        if (data.tipoSimulacao === 'por_valor_parcela') {
          valorParcela = valorNumerico;
          valorLiberado = valorParcela * prazoNumerico * 0.85; // Desconto aproximado
        } else {
          valorLiberado = valorNumerico;
          valorParcela = valorLiberado / prazoNumerico * 1.15; // Acréscimo aproximado
        }

        const dataAtual = new Date();
        const primeiroVencimento = new Date(dataAtual);
        primeiroVencimento.setMonth(primeiroVencimento.getMonth() + 1);
        
        const ultimoVencimento = new Date(primeiroVencimento);
        ultimoVencimento.setMonth(ultimoVencimento.getMonth() + prazoNumerico - 1);

        const resultados = {
          valorLiberado: valorLiberado,
          valorParcela: valorParcela,
          prazo: prazoNumerico,
          primeiroVencimento: primeiroVencimento.toLocaleDateString('pt-BR'),
          ultimoVencimento: ultimoVencimento.toLocaleDateString('pt-BR'),
          cetMensal: 2.5,
          cetAnual: 35.8,
          valorIOF: valorLiberado * 0.0038
        };

        onChange({
          ...data,
          status: 'success',
          resultados
        });
      } else {
        onChange({
          ...data,
          status: 'error',
          erro: 'Margem insuficiente para os valores solicitados'
        });
      }
      setIsSimulating(false);
    }, 2000);
  };

  const handleContinuar = () => {
    // Preparar dados do cliente baseados na simulação
    const clienteData: Partial<ClienteData> = {
      convenio: data.convenio,
      cpf: data.cpf,
      matricula: data.matricula,
      dataNascimento: data.dataNascimento
    };

    onNext(clienteData);
  };

  const isFormValid = () => {
    // Permitir avanço com validação mínima (apenas sem erros)
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Simulação de Proposta — UseDigi</h3>
        <p className="text-gray-600">Realize a simulação antes de iniciar o processo de formalização</p>
      </div>

      <div className="space-y-6">
        {/* Dados da Simulação */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-blue-200">
            Dados da Simulação
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Convênio *
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.convenio ? 'border-red-300' : 'border-gray-300'
                }`}
                value={data.convenio || ''}
                onChange={(e) => handleInputChange('convenio', e.target.value)}
              >
                <option value="">Selecione um convênio</option>
                <option value="governo_goias">Governo de Goiás</option>
                <option value="prefeitura_hortolandia">Prefeitura de Hortolândia</option>
                <option value="governo_maranhao">Governo do Maranhão</option>
                <option value="prefeitura_rio">Prefeitura do Rio de Janeiro</option>
                <option value="governo_parana">Governo do Paraná</option>
                <option value="prefeitura_sorocaba">Prefeitura de Sorocaba</option>
              </select>
              {errors.convenio && (
                <p className="text-red-600 text-sm mt-1">{errors.convenio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.cpf ? 'border-red-300' : 'border-gray-300'
                }`}
                value={data.cpf || ''}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
              />
              {errors.cpf && (
                <p className="text-red-600 text-sm mt-1">{errors.cpf}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matrícula *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.matricula ? 'border-red-300' : 'border-gray-300'
                }`}
                value={data.matricula || ''}
                onChange={(e) => handleInputChange('matricula', e.target.value)}
              />
              {errors.matricula && (
                <p className="text-red-600 text-sm mt-1">{errors.matricula}</p>
              )}

              {convenioRequiresToken && data.convenio && data.cpf && data.matricula && (
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Informe o token para consultar a margem"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-[70%] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm h-10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          consultarMargemComToken();
                        }
                      }}
                    />
                    <button
                      onClick={consultarMargemComToken}
                      disabled={margemLoading}
                      className="w-[30%] h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      {margemLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Consultando...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          <span>Consultar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {!convenioRequiresToken && margemLoading && data.convenio && data.cpf && data.matricula && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Consultando margem disponível...</span>
                </div>
              )}

              {margemDisponivel !== null && (
                <div className="mt-2 text-sm text-gray-700">
                  <span className="font-medium">Margem disponível:</span>{' '}
                  <span className="text-green-600 font-semibold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(margemDisponivel)}
                  </span>
                </div>
              )}

              {margemError && (
                <div className="mt-2 text-sm text-red-600">
                  {margemError}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.dataNascimento ? 'border-red-300' : 'border-gray-300'
                }`}
                value={data.dataNascimento || ''}
                onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                placeholder="DD/MM/AAAA"
                maxLength={10}
              />
              {errors.dataNascimento && (
                <p className="text-red-600 text-sm mt-1">{errors.dataNascimento}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Simulação *
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.tipoSimulacao ? 'border-red-300' : 'border-gray-300'
                }`}
                value={data.tipoSimulacao || ''}
                onChange={(e) => handleInputChange('tipoSimulacao', e.target.value)}
              >
                <option value="">Selecione o tipo</option>
                <option value="por_valor_parcela">Por valor de parcela</option>
                <option value="por_valor_total">Por valor total</option>
              </select>
              {errors.tipoSimulacao && (
                <p className="text-red-600 text-sm mt-1">{errors.tipoSimulacao}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor *
              </label>
              <input
                type="text"
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.valor ? 'border-red-300' : 'border-gray-300'
                }`}
                value={data.valor || ''}
                onChange={(e) => handleInputChange('valor', e.target.value)}
                placeholder="R$ 0,00"
              />
              {errors.valor && (
                <p className="text-red-600 text-sm mt-1">{errors.valor}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prazo *
              </label>
              <select
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.prazo ? 'border-red-300' : 'border-gray-300'
                }`}
                value={data.prazo || ''}
                onChange={(e) => handleInputChange('prazo', e.target.value)}
              >
                <option value="">Selecione o prazo</option>
                <option value="12">12 meses</option>
                <option value="24">24 meses</option>
                <option value="36">36 meses</option>
                <option value="48">48 meses</option>
                <option value="60">60 meses</option>
                <option value="72">72 meses</option>
                <option value="84">84 meses</option>
                <option value="96">96 meses</option>
              </select>
              {errors.prazo && (
                <p className="text-red-600 text-sm mt-1">{errors.prazo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Botão Simular */}
        {data.status !== 'success' && (
          <div className="text-center">
            <button
              onClick={handleSimular}
              disabled={!isFormValid() || isSimulating}
              className={`px-8 py-4 rounded-lg font-medium transition-all flex items-center mx-auto ${
                isFormValid() && !isSimulating
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSimulating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Simulando...
                </>
              ) : (
                <>
                  <Calculator className="w-5 h-5 mr-2" />
                  Simular
                </>
              )}
            </button>
          </div>
        )}

        {/* Status da Simulação */}
        {data.status === 'loading' && (
          <div className="border-2 border-blue-300 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <h4 className="font-medium text-blue-900">Processando Simulação...</h4>
            </div>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Consultando margem disponível...</p>
              <p>• Calculando valores e taxas...</p>
              <p>• Validando condições do convênio...</p>
            </div>
          </div>
        )}

        {/* Resultados da Simulação */}
        {data.status === 'success' && data.resultados && (
          <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h4 className="font-medium text-green-900 text-lg">Simulação Realizada com Sucesso!</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-green-800 mb-1">
                  Valor Liberado
                </label>
                <div className="text-xl font-bold text-green-600">
                  {formatDisplayCurrency(data.resultados.valorLiberado)}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-green-800 mb-1">
                  Valor da Parcela
                </label>
                <div className="text-xl font-bold text-green-600">
                  {formatDisplayCurrency(data.resultados.valorParcela)}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-green-800 mb-1">
                  Prazo
                </label>
                <div className="text-xl font-bold text-green-600">
                  {data.resultados.prazo} meses
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-green-800 mb-1">
                  Valor IOF
                </label>
                <div className="text-xl font-bold text-green-600">
                  {formatDisplayCurrency(data.resultados.valorIOF)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-green-800 mb-1">
                  Primeiro Desconto
                </label>
                <div className="text-xl font-bold text-green-600">
                  {new Date(data.resultados.primeiroVencimento.split('/').reverse().join('-')).toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' }).replace('/', '/')}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-green-800 mb-1">
                  Primeiro Vencimento
                </label>
                <div className="text-lg font-semibold text-green-600">
                  {data.resultados.primeiroVencimento}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-green-800 mb-1">
                  Último Vencimento
                </label>
                <div className="text-lg font-semibold text-green-600">
                  {data.resultados.ultimoVencimento}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-green-800 mb-1">
                  Taxa CET Mensal
                </label>
                <div className="text-lg font-semibold text-green-600">
                  {data.resultados.cetMensal.toFixed(2)}%
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-green-200">
                <label className="block text-sm font-medium text-green-800 mb-1">
                  Taxa CET Anual
                </label>
                <div className="text-lg font-semibold text-green-600">
                  {data.resultados.cetAnual.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleContinuar}
                className="px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 hover:shadow-md transition-all"
              >
                Continuar para Formalização
              </button>
            </div>
          </div>
        )}

        {/* Erro na Simulação */}
        {data.status === 'error' && (
          <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <h4 className="font-medium text-red-900">Erro na Simulação</h4>
            </div>
            <p className="text-red-700 mb-4">{data.erro}</p>
            <button
              onClick={() => onChange({ ...data, status: 'idle' })}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Tentar Novamente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};