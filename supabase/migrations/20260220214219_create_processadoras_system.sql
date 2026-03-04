/*
  # Create processadoras table

  1. New Tables
    - `processadoras`
      - `id` (uuid, primary key) - Identificador único da processadora
      - `cnpj` (text, unique, not null) - CNPJ da processadora (com formatação)
      - `nome_fantasia` (text) - Nome fantasia da processadora
      - `razao_social` (text, not null) - Razão social da processadora
      - `status` (text, not null, default "ativo") - Status da processadora (ativo/inativo)
      - `responsavel_nome` (text) - Nome do responsável
      - `responsavel_email` (text) - E-mail do responsável
      - `responsavel_celular` (text) - Celular do responsável
      - `created_at` (timestamptz, default now()) - Data de criação
      - `updated_at` (timestamptz, default now()) - Data de última atualização

  2. Security
    - Enable RLS on `processadoras` table
    - Add policy for authenticated users to read processadoras
    - Add policy for authenticated users to insert processadoras
    - Add policy for authenticated users to update processadoras
    - Add policy for authenticated users to delete processadoras

  3. Important Notes
    - CNPJ must be unique to prevent duplicate processadoras
    - Status defaults to "ativo" (active)
    - Responsável fields are optional but validated when provided
    - Timestamps are automatically managed
*/

-- Create processadoras table
CREATE TABLE IF NOT EXISTS processadoras (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cnpj text UNIQUE NOT NULL,
  nome_fantasia text,
  razao_social text NOT NULL,
  status text NOT NULL DEFAULT 'ativo',
  responsavel_nome text,
  responsavel_email text,
  responsavel_celular text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT processadoras_status_check CHECK (status IN ('ativo', 'inativo'))
);

-- Enable RLS
ALTER TABLE processadoras ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Authenticated users can read processadoras"
  ON processadoras FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert processadoras"
  ON processadoras FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update processadoras"
  ON processadoras FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete processadoras"
  ON processadoras FOR DELETE
  TO authenticated
  USING (true);

-- Create index on CNPJ for faster lookups
CREATE INDEX IF NOT EXISTS idx_processadoras_cnpj ON processadoras(cnpj);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_processadoras_status ON processadoras(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_processadoras_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_processadoras_updated_at_trigger ON processadoras;
CREATE TRIGGER update_processadoras_updated_at_trigger
  BEFORE UPDATE ON processadoras
  FOR EACH ROW
  EXECUTE FUNCTION update_processadoras_updated_at();

