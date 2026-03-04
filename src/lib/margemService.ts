export interface ConvenioConfig {
  id: string;
  nome: string;
  requiresToken: boolean;
}

export const convenios: ConvenioConfig[] = [
  { id: 'governo_goias', nome: 'Governo de Goiás', requiresToken: true },
  { id: 'prefeitura_hortolandia', nome: 'Prefeitura de Hortolândia', requiresToken: true },
  { id: 'governo_maranhao', nome: 'Governo do Maranhão', requiresToken: true },
  { id: 'prefeitura_rio', nome: 'Prefeitura do Rio de Janeiro', requiresToken: false },
  { id: 'governo_parana', nome: 'Governo do Paraná', requiresToken: false },
  { id: 'prefeitura_sorocaba', nome: 'Prefeitura de Sorocaba', requiresToken: false },
];

export interface MargemConsultaRequest {
  convenio: string;
  cpf: string;
  matricula: string;
  token?: string;
}

export interface MargemConsultaResponse {
  success: boolean;
  margem?: number;
  error?: string;
}

export const consultarMargem = async (
  request: MargemConsultaRequest
): Promise<MargemConsultaResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const convenioConfig = convenios.find((c) => c.id === request.convenio);

      if (!convenioConfig) {
        resolve({ success: false, error: 'Convênio não encontrado' });
        return;
      }

      if (convenioConfig.requiresToken && !request.token) {
        resolve({ success: false, error: 'Token é obrigatório para este convênio' });
        return;
      }

      if (convenioConfig.requiresToken && request.token) {
        if (request.token.length < 6) {
          resolve({ success: false, error: 'Token inválido. Tente novamente.' });
          return;
        }
      }

      const cpfNumerico = request.cpf.replace(/\D/g, '');
      if (cpfNumerico.length !== 11) {
        resolve({ success: false, error: 'CPF inválido' });
        return;
      }

      if (!request.matricula || request.matricula.trim() === '') {
        resolve({ success: false, error: 'Matrícula inválida' });
        return;
      }

      const margemAleatoria = Math.random() * 3000 + 500;
      const margemFormatada = Math.round(margemAleatoria * 100) / 100;

      resolve({
        success: true,
        margem: margemFormatada,
      });
    }, 1200);
  });
};

export const requiresToken = (convenioId: string): boolean => {
  const convenio = convenios.find((c) => c.id === convenioId);
  return convenio ? convenio.requiresToken : false;
};
