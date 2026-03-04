export interface Processadora {
  id: string;
  cnpj: string;
  nomeFantasia: string;
  razaoSocial: string;
  status: 'ativo' | 'inativo';
  responsavelNome?: string;
  responsavelEmail?: string;
  responsavelCelular?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessadoraFormData {
  cnpj: string;
  nomeFantasia: string;
  razaoSocial: string;
  status: 'ativo' | 'inativo';
  responsavelNome?: string;
  responsavelEmail?: string;
  responsavelCelular?: string;
}
