import type { CadastroAplicativo } from '../types/aplicativo';

const nomes = [
  'Maria Aparecida Santos', 'João Pedro Silva', 'Ana Carolina Costa', 'Carlos Eduardo Lima',
  'Fernanda Oliveira Souza', 'Roberto Carlos Pereira', 'Juliana Martins Alves', 'Ricardo Henrique Rocha',
  'Patrícia Ferreira Costa', 'Marcelo Antonio Silva', 'Luciana Oliveira', 'Rafael dos Santos Lima',
  'Beatriz Almeida', 'Diego Carvalho Santos', 'Camila Rodrigues Costa', 'André Luiz Gomes',
  'Mariana Barbosa Silva', 'Felipe Augusto Reis', 'Vanessa Cristina Souza', 'Bruno Henrique Dias',
  'Amanda Silva Pereira', 'Thiago Santos Costa', 'Aline Ribeiro Martins', 'Leonardo Fernandes',
  'Gabriela Martins Lima', 'Rodrigo Alves Santos', 'Larissa Costa Oliveira', 'Daniel Souza Silva',
  'Priscila Ferreira', 'Gustavo Lima Silva', 'Renata Almeida Costa', 'Marcos Paulo Santos',
  'Isabela Rodrigues', 'Henrique Costa Lima', 'Tatiana Souza Alves', 'Eduardo Pereira Santos',
  'Cristina Martins', 'Paulo Ricardo Oliveira', 'Sandra Regina Costa', 'Alexandre Santos Silva',
  'Débora Almeida', 'Francisco José Lima', 'Silvia Helena Souza', 'Rodrigo Ferreira Costa',
  'Carla Cristina Santos', 'Márcio Roberto Silva', 'Luciane Oliveira Lima', 'Fábio Augusto Costa',
  'Adriana Paula Santos', 'Sérgio Luiz Pereira', 'Mônica Silva Costa', 'Rafael Eduardo Lima'
];

const convenios = [
  'Prefeitura de Guarulhos',
  'Prefeitura de Hortolândia',
  'Prefeitura de Santo André',
  'Prefeitura do Rio de Janeiro',
  'Governo de Goiás',
  'Prefeitura de Sorocaba',
  'Prefeitura de São Gonçalo',
  'Prefeitura de São Paulo',
  'Governo do Estado de São Paulo'
];

const categorias = ['Efetivo', 'Aposentado', 'Pensionista', 'CLT', 'Comissionado'];
const operadoras = ['UD', 'Soft', 'Prisma', 'Digio'];

function gerarCPF(): string {
  const num1 = Math.floor(Math.random() * 900) + 100;
  const num2 = Math.floor(Math.random() * 900) + 100;
  const num3 = Math.floor(Math.random() * 900) + 100;
  const num4 = Math.floor(Math.random() * 90) + 10;
  return `${num1}.${num2}.${num3}-${num4}`;
}

function gerarMatricula(): string {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

function gerarCelular(): string {
  const ddd = Math.floor(Math.random() * 20) + 11;
  const num = Math.floor(Math.random() * 90000000) + 910000000;
  return `(${ddd}) 9${String(num).substring(0, 4)}-${String(num).substring(4)}`;
}

function gerarEmail(nome: string): string {
  const nomeLimpo = nome.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')[0];
  const sobrenome = nome.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')[1] || '';
  const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com'];
  const dominio = dominios[Math.floor(Math.random() * dominios.length)];
  return `${nomeLimpo}.${sobrenome}@${dominio}`;
}

function gerarDataNascimento(idadeMin: number, idadeMax: number): Date {
  const hoje = new Date();
  const idade = Math.floor(Math.random() * (idadeMax - idadeMin + 1)) + idadeMin;
  const ano = hoje.getFullYear() - idade;
  const mes = Math.floor(Math.random() * 12);
  const dia = Math.floor(Math.random() * 28) + 1;
  return new Date(ano, mes, dia);
}

export function gerarCadastrosAplicativo(quantidade: number = 120): CadastroAplicativo[] {
  const cadastros: CadastroAplicativo[] = [];
  const hoje = new Date();

  for (let i = 0; i < quantidade; i++) {
    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const temDadosCompletos = Math.random() > 0.15;

    const diasAtras = Math.floor(Math.random() * 90);
    const dataCadastro = new Date(hoje);
    dataCadastro.setDate(dataCadastro.getDate() - diasAtras);

    let margemCompras: number | null = null;
    let margemSaque: number | null = null;
    let dataNascimento: Date | null = null;
    let categoria: string | null = null;

    if (temDadosCompletos) {
      const idadeRange = Math.random();
      if (idadeRange < 0.1) {
        dataNascimento = gerarDataNascimento(16, 17);
      } else if (idadeRange < 0.85) {
        dataNascimento = gerarDataNascimento(18, 79);
      } else {
        dataNascimento = gerarDataNascimento(80, 85);
      }

      categoria = categorias[Math.floor(Math.random() * categorias.length)];

      const margemType = Math.random();
      if (margemType < 0.7) {
        margemCompras = Math.floor(Math.random() * 400) + 10;
        margemSaque = Math.floor(Math.random() * 300) + 10;
      } else if (margemType < 0.85) {
        margemCompras = Math.floor(Math.random() * 20);
        margemSaque = Math.floor(Math.random() * 20);
      } else {
        margemCompras = Math.floor(Math.random() * 15);
        margemSaque = 0;
      }
    } else {
      if (Math.random() > 0.5) {
        dataNascimento = gerarDataNascimento(18, 79);
      }
      if (Math.random() > 0.5) {
        categoria = categorias[Math.floor(Math.random() * categorias.length)];
      }
      if (Math.random() > 0.3) {
        margemCompras = Math.floor(Math.random() * 300) + 10;
        margemSaque = Math.floor(Math.random() * 200) + 10;
      }
    }

    cadastros.push({
      id: `APP-${Date.now()}-${i}`,
      dataCadastro,
      operadora: operadoras[Math.floor(Math.random() * operadoras.length)],
      convenio: convenios[Math.floor(Math.random() * convenios.length)],
      nome,
      cpf: gerarCPF(),
      matricula: gerarMatricula(),
      celular: gerarCelular(),
      email: gerarEmail(nome),
      dataNascimento,
      categoria,
      margemCompras,
      margemSaque
    });
  }

  return cadastros.sort((a, b) => b.dataCadastro.getTime() - a.dataCadastro.getTime());
}
