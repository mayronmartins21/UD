/*
  # Sistema de Propostas e Correções

  1. Novas Tabelas
    - `propostas`
      - `id` (uuid, chave primária)
      - `numero_proposta` (text, único) - Número identificador da proposta
      - `cpf_cliente` (text) - CPF do cliente
      - `nome_cliente` (text) - Nome do cliente
      - `etapa_atual` (text) - Etapa atual: simulador, cadastro, documentos, reserva, aprovacao, ccb, concluida
      - `status` (text) - Status: em_andamento, correcao_solicitada, pendente_assinatura, aprovada, concluida
      - `dados_simulador` (jsonb) - Dados preenchidos no simulador
      - `dados_cadastro` (jsonb) - Dados preenchidos no cadastro
      - `dados_documentos` (jsonb) - Dados dos documentos
      - `dados_reserva` (jsonb) - Dados da reserva
      - `created_at` (timestamptz) - Data de criação
      - `updated_at` (timestamptz) - Última atualização
      - `created_by` (uuid) - Usuário que criou (referência a auth.users)
      - `updated_by` (uuid) - Último usuário que atualizou
    
    - `propostas_correcoes`
      - `id` (uuid, chave primária)
      - `proposta_id` (uuid, referência a propostas)
      - `etapa` (text) - Etapa que precisa correção: cadastro, documentos, reserva
      - `comentario` (text) - Comentário do analista
      - `solicitado_por` (uuid) - Usuário que solicitou (referência a auth.users)
      - `solicitado_em` (timestamptz) - Data da solicitação
      - `corrigido` (boolean) - Se já foi corrigido
      - `corrigido_em` (timestamptz) - Data da correção
    
    - `propostas_log`
      - `id` (uuid, chave primária)
      - `proposta_id` (uuid, referência a propostas)
      - `acao` (text) - Ação realizada
      - `etapa_anterior` (text) - Etapa anterior
      - `etapa_nova` (text) - Nova etapa
      - `usuario_id` (uuid) - Usuário que realizou a ação
      - `detalhes` (jsonb) - Detalhes adicionais
      - `created_at` (timestamptz) - Data da ação

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para usuários autenticados
*/

-- Criar tabela de propostas
CREATE TABLE IF NOT EXISTS propostas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_proposta text UNIQUE NOT NULL,
  cpf_cliente text NOT NULL,
  nome_cliente text NOT NULL,
  etapa_atual text NOT NULL DEFAULT 'simulador',
  status text NOT NULL DEFAULT 'em_andamento',
  dados_simulador jsonb DEFAULT '{}'::jsonb,
  dados_cadastro jsonb DEFAULT '{}'::jsonb,
  dados_documentos jsonb DEFAULT '{}'::jsonb,
  dados_reserva jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- Criar tabela de correções
CREATE TABLE IF NOT EXISTS propostas_correcoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposta_id uuid REFERENCES propostas(id) ON DELETE CASCADE,
  etapa text NOT NULL,
  comentario text NOT NULL,
  solicitado_por uuid REFERENCES auth.users(id),
  solicitado_em timestamptz DEFAULT now(),
  corrigido boolean DEFAULT false,
  corrigido_em timestamptz
);

-- Criar tabela de log
CREATE TABLE IF NOT EXISTS propostas_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposta_id uuid REFERENCES propostas(id) ON DELETE CASCADE,
  acao text NOT NULL,
  etapa_anterior text,
  etapa_nova text,
  usuario_id uuid REFERENCES auth.users(id),
  detalhes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_propostas_numero ON propostas(numero_proposta);
CREATE INDEX IF NOT EXISTS idx_propostas_cpf ON propostas(cpf_cliente);
CREATE INDEX IF NOT EXISTS idx_propostas_status ON propostas(status);
CREATE INDEX IF NOT EXISTS idx_propostas_etapa ON propostas(etapa_atual);
CREATE INDEX IF NOT EXISTS idx_correcoes_proposta ON propostas_correcoes(proposta_id);
CREATE INDEX IF NOT EXISTS idx_log_proposta ON propostas_log(proposta_id);

-- Habilitar RLS
ALTER TABLE propostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE propostas_correcoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE propostas_log ENABLE ROW LEVEL SECURITY;

-- Políticas para propostas
CREATE POLICY "Usuários autenticados podem visualizar propostas"
  ON propostas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar propostas"
  ON propostas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Usuários autenticados podem atualizar propostas"
  ON propostas FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (auth.uid() = updated_by);

-- Políticas para correções
CREATE POLICY "Usuários autenticados podem visualizar correções"
  ON propostas_correcoes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar correções"
  ON propostas_correcoes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = solicitado_por);

CREATE POLICY "Usuários autenticados podem atualizar correções"
  ON propostas_correcoes FOR UPDATE
  TO authenticated
  USING (true);

-- Políticas para log
CREATE POLICY "Usuários autenticados podem visualizar log"
  ON propostas_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar log"
  ON propostas_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = usuario_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_propostas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER propostas_updated_at
  BEFORE UPDATE ON propostas
  FOR EACH ROW
  EXECUTE FUNCTION update_propostas_updated_at();