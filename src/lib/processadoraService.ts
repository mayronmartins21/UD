import type { Processadora, ProcessadoraFormData } from '../types/processadoras';

export const processadoraService = {
  async getAll(): Promise<Processadora[]> {
    console.log('Fetching all processadoras');
    return [];
  },

  async getById(id: string): Promise<Processadora | null> {
    console.log('Fetching processadora:', id);
    return null;
  },

  async create(data: ProcessadoraFormData): Promise<Processadora> {
    console.log('Creating processadora:', data);
    const newProcessadora: Processadora = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newProcessadora;
  },

  async update(id: string, data: Partial<ProcessadoraFormData>): Promise<Processadora> {
    console.log('Updating processadora:', id, data);
    const updatedProcessadora: Processadora = {
      id,
      cnpj: data.cnpj || '',
      nomeFantasia: data.nomeFantasia || '',
      razaoSocial: data.razaoSocial || '',
      status: data.status || 'ativo',
      responsavelNome: data.responsavelNome,
      responsavelEmail: data.responsavelEmail,
      responsavelCelular: data.responsavelCelular,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return updatedProcessadora;
  },

  async delete(id: string): Promise<void> {
    console.log('Deleting processadora:', id);
  },

  validateCNPJ(cnpj: string): boolean {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');

    if (cleanCNPJ.length !== 14) return false;

    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

    let sum = 0;
    let pos = 5;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * pos;
      pos = pos === 2 ? 9 : pos - 1;
    }
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (digit !== parseInt(cleanCNPJ.charAt(12))) return false;

    sum = 0;
    pos = 6;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * pos;
      pos = pos === 2 ? 9 : pos - 1;
    }
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (digit !== parseInt(cleanCNPJ.charAt(13))) return false;

    return true;
  },

  formatCNPJ(cnpj: string): string {
    const cleaned = cnpj.replace(/[^\d]/g, '');
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  },

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  formatPhone(phone: string): string {
    const cleaned = phone.replace(/[^\d]/g, '');
    if (cleaned.length === 11) {
      return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (cleaned.length === 10) {
      return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    }
    return phone;
  }
};
