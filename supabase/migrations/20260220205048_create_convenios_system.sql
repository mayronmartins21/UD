/*
  # Sistema de Convênios

  1. Tabelas Criadas
    - `convenios`
      - `id` (uuid, primary key)
      - `processadora` (text)
      - `razao_social` (text)
      - `nome_fantasia` (text)
      - `cnpj` (text, unique)
      - `tempo_margem` (integer)
      - `dias_proposta` (integer)
      - `percentual_recolhimento` (numeric)
      - `dia_repasse` (integer)
      - `dia_corte` (integer)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `agendas_corte`
      - `id` (uuid, primary key)
      - `convenio_id` (uuid, foreign key)
      - `data_inicio` (date)
      - `data_fim` (date)
      - `observacao` (text)
      - `status` (text)
      - `created_at` (timestamptz)

    - `arquivos_debito`
      - `id` (uuid, primary key)
      - `convenio_id` (uuid, foreign key)
      - `nome_layout` (text)
      - `colunas` (text)
      - `periodicidade` (text)
      - `observacao` (text)
      - `created_at` (timestamptz)

    - `contatos_convenio`
      - `id` (uuid, primary key)
      - `convenio_id` (uuid, foreign key)
      - `nome` (text)
      - `email` (text)
      - `celular` (text)
      - `telefone` (text)
      - `departamento` (text)
      - `tipo` (text)
      - `observacao` (text)
      - `ativo` (boolean)
      - `created_at` (timestamptz)

    - `parametrizacoes_convenio`
      - `id` (uuid, primary key)
      - `convenio_id` (uuid, foreign key, unique)
      - `utiliza_token_consulta` (boolean)
      - `utiliza_token_averbacao` (boolean)
      - `utiliza_senha_consignacao` (boolean)
      - `eh_estabelecimento` (boolean)
      - `cartao_compras_liberado` (boolean)
      - `atendimento` (text)
      - `realiza_oferta_saque_facil` (boolean)
      - `cartao_saque_facil_liberado` (boolean)
      - `categorias_cartao_compras` (text[])
      - `categorias_saque_facil` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `prazos_parametrizacao`
      - `id` (uuid, primary key)
      - `parametrizacao_id` (uuid, foreign key)
      - `tipo_operacao` (text)
      - `parcelas_min` (integer)
      - `parcelas_max` (integer)
      - `carencia_dias` (integer)
      - `observacao` (text)
      - `created_at` (timestamptz)

    - `decretos`
      - `id` (uuid, primary key)
      - `convenio_id` (uuid, foreign key)
      - `numero` (text)
      - `data_publicacao` (date)
      - `ementa` (text)
      - `arquivo_url` (text)
      - `status` (text)
      - `data_vigencia_inicio` (date)
      - `data_vigencia_fim` (date)
      - `principal` (boolean)
      - `created_at` (timestamptz)

    - `roteiros_operacionais`
      - `id` (uuid, primary key)
      - `convenio_id` (uuid, foreign key)
      - `versao` (text)
      - `data_versao` (date)
      - `responsavel` (text)
      - `descricao` (text)
      - `arquivo_url` (text)
      - `versao_atual` (boolean)
      - `created_at` (timestamptz)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Criar políticas para usuários autenticados
*/

-- Tabela principal de convênios
CREATE TABLE IF NOT EXISTS convenios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  processadora text NOT NULL,
  razao_social text NOT NULL,
  nome_fantasia text NOT NULL,
  cnpj text UNIQUE NOT NULL,
  tempo_margem integer NOT NULL DEFAULT 30,
  dias_proposta integer NOT NULL DEFAULT 15,
  percentual_recolhimento numeric(5,2) NOT NULL DEFAULT 0,
  dia_repasse integer NOT NULL CHECK (dia_repasse >= 1 AND dia_repasse <= 31),
  dia_corte integer NOT NULL CHECK (dia_corte >= 1 AND dia_corte <= 31),
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE convenios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem visualizar convênios"
  ON convenios FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir convênios"
  ON convenios FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar convênios"
  ON convenios FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar convênios"
  ON convenios FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de agendas de corte
CREATE TABLE IF NOT EXISTS agendas_corte (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid NOT NULL REFERENCES convenios(id) ON DELETE CASCADE,
  data_inicio date NOT NULL,
  data_fim date NOT NULL,
  observacao text,
  status text NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE agendas_corte ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem visualizar agendas de corte"
  ON agendas_corte FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir agendas de corte"
  ON agendas_corte FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar agendas de corte"
  ON agendas_corte FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar agendas de corte"
  ON agendas_corte FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de arquivos de débito
CREATE TABLE IF NOT EXISTS arquivos_debito (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid NOT NULL REFERENCES convenios(id) ON DELETE CASCADE,
  nome_layout text NOT NULL,
  colunas text NOT NULL,
  periodicidade text NOT NULL,
  observacao text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE arquivos_debito ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem visualizar arquivos de débito"
  ON arquivos_debito FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir arquivos de débito"
  ON arquivos_debito FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar arquivos de débito"
  ON arquivos_debito FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar arquivos de débito"
  ON arquivos_debito FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de contatos do convênio
CREATE TABLE IF NOT EXISTS contatos_convenio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid NOT NULL REFERENCES convenios(id) ON DELETE CASCADE,
  nome text NOT NULL,
  email text NOT NULL,
  celular text NOT NULL,
  telefone text NOT NULL,
  departamento text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('principal', 'financeiro', 'juridico', 'operacional', 'ti')),
  observacao text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contatos_convenio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem visualizar contatos"
  ON contatos_convenio FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir contatos"
  ON contatos_convenio FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar contatos"
  ON contatos_convenio FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar contatos"
  ON contatos_convenio FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de parametrizações do convênio
CREATE TABLE IF NOT EXISTS parametrizacoes_convenio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid UNIQUE NOT NULL REFERENCES convenios(id) ON DELETE CASCADE,
  utiliza_token_consulta boolean DEFAULT false,
  utiliza_token_averbacao boolean DEFAULT false,
  utiliza_senha_consignacao boolean DEFAULT false,
  eh_estabelecimento boolean DEFAULT false,
  cartao_compras_liberado boolean DEFAULT false,
  atendimento text NOT NULL DEFAULT '',
  realiza_oferta_saque_facil boolean DEFAULT false,
  cartao_saque_facil_liberado boolean DEFAULT false,
  categorias_cartao_compras text[] DEFAULT '{}',
  categorias_saque_facil text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE parametrizacoes_convenio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem visualizar parametrizações"
  ON parametrizacoes_convenio FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir parametrizações"
  ON parametrizacoes_convenio FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar parametrizações"
  ON parametrizacoes_convenio FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar parametrizações"
  ON parametrizacoes_convenio FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de prazos de parametrização
CREATE TABLE IF NOT EXISTS prazos_parametrizacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parametrizacao_id uuid NOT NULL REFERENCES parametrizacoes_convenio(id) ON DELETE CASCADE,
  tipo_operacao text NOT NULL,
  parcelas_min integer NOT NULL CHECK (parcelas_min > 0),
  parcelas_max integer NOT NULL CHECK (parcelas_max > 0),
  carencia_dias integer NOT NULL DEFAULT 0 CHECK (carencia_dias >= 0),
  observacao text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prazos_parametrizacao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem visualizar prazos"
  ON prazos_parametrizacao FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir prazos"
  ON prazos_parametrizacao FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar prazos"
  ON prazos_parametrizacao FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar prazos"
  ON prazos_parametrizacao FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de decretos
CREATE TABLE IF NOT EXISTS decretos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid NOT NULL REFERENCES convenios(id) ON DELETE CASCADE,
  numero text NOT NULL,
  data_publicacao date NOT NULL,
  ementa text NOT NULL,
  arquivo_url text,
  status text NOT NULL DEFAULT 'vigente' CHECK (status IN ('vigente', 'revogado')),
  data_vigencia_inicio date NOT NULL,
  data_vigencia_fim date,
  principal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE decretos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem visualizar decretos"
  ON decretos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir decretos"
  ON decretos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar decretos"
  ON decretos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar decretos"
  ON decretos FOR DELETE
  TO authenticated
  USING (true);

-- Tabela de roteiros operacionais
CREATE TABLE IF NOT EXISTS roteiros_operacionais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  convenio_id uuid NOT NULL REFERENCES convenios(id) ON DELETE CASCADE,
  versao text NOT NULL,
  data_versao date NOT NULL,
  responsavel text NOT NULL,
  descricao text NOT NULL,
  arquivo_url text,
  versao_atual boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE roteiros_operacionais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem visualizar roteiros operacionais"
  ON roteiros_operacionais FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem inserir roteiros operacionais"
  ON roteiros_operacionais FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar roteiros operacionais"
  ON roteiros_operacionais FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar roteiros operacionais"
  ON roteiros_operacionais FOR DELETE
  TO authenticated
  USING (true);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_convenios_status ON convenios(status);
CREATE INDEX IF NOT EXISTS idx_convenios_cnpj ON convenios(cnpj);
CREATE INDEX IF NOT EXISTS idx_agendas_corte_convenio ON agendas_corte(convenio_id);
CREATE INDEX IF NOT EXISTS idx_arquivos_debito_convenio ON arquivos_debito(convenio_id);
CREATE INDEX IF NOT EXISTS idx_contatos_convenio ON contatos_convenio(convenio_id);
CREATE INDEX IF NOT EXISTS idx_parametrizacoes_convenio ON parametrizacoes_convenio(convenio_id);
CREATE INDEX IF NOT EXISTS idx_prazos_parametrizacao ON prazos_parametrizacao(parametrizacao_id);
CREATE INDEX IF NOT EXISTS idx_decretos_convenio ON decretos(convenio_id);
CREATE INDEX IF NOT EXISTS idx_roteiros_operacionais_convenio ON roteiros_operacionais(convenio_id);
