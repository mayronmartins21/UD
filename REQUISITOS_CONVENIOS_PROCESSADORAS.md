# Requisitos de Sistema - Módulos de Convênios e Processadoras

## 1. VISÃO GERAL

Este documento descreve os requisitos funcionais e não-funcionais para o desenvolvimento dos módulos de **Convênios** e **Processadoras** do sistema de gestão de crédito consignado.

**Objetivo**: Permitir o cadastro, gestão e parametrização completa de convênios e processadoras, incluindo suas regras de negócio, contatos, documentação e integrações.

---

## 2. MÓDULO DE CONVÊNIOS

### 2.1 LISTAGEM DE CONVÊNIOS

#### 2.1.1 Requisitos Funcionais

**RF-CONV-001**: O sistema deve exibir uma tabela com todos os convênios cadastrados contendo:
- Código do convênio
- Nome do convênio
- CNPJ
- Status (Ativo/Inativo)
- Processadoras vinculadas
- Data de cadastro
- Ações (Visualizar, Editar)

**RF-CONV-002**: A tabela deve permitir:
- Ordenação por qualquer coluna
- Busca por texto livre (nome, CNPJ, código)
- Filtro por status (Ativo/Inativo)
- Filtro por processadora vinculada
- Paginação (25, 50, 100 registros por página)

**RF-CONV-003**: Deve haver um botão "Cadastrar Convênio" que redireciona para a tela de cadastro

**RF-CONV-004**: Cada linha deve ter um botão de ações que permite:
- Visualizar detalhes
- Editar
- Ativar/Inativar

#### 2.1.2 Regras de Negócio

**RN-CONV-001**: Convênios inativos devem aparecer com indicação visual diferenciada (ex: texto cinza, badge)

**RN-CONV-002**: Apenas usuários com permissão "Gestor" ou superior podem inativar convênios

**RN-CONV-003**: Convênios com operações ativas não podem ser excluídos, apenas inativados

---

### 2.2 CADASTRO DE CONVÊNIO

#### 2.2.1 Requisitos Funcionais

**RF-CONV-005**: O formulário de cadastro deve conter as seguintes abas:
1. Informações do Convênio
2. Parametrizações
3. Contatos
4. Roteiro Operacional
5. Decretos
6. Logs de Alterações

#### 2.2.2 Aba: Informações do Convênio

**RF-CONV-006**: Campos obrigatórios:
- Código do convênio (alfanumérico, único)
- Nome do convênio
- CNPJ (validação de formato)
- Razão Social
- Status (Ativo/Inativo)
- Tipo (Estadual, Federal, Municipal, Privado)
- UF (se aplicável)
- Município (se aplicável)

**RF-CONV-007**: Campos opcionais:
- Site
- Endereço completo
- Telefone principal
- E-mail institucional
- Observações gerais

**RF-CONV-008**: Validações:
- CNPJ deve ser válido e único no sistema
- Código do convênio deve ser único
- Nome do convênio deve ter no mínimo 3 caracteres

#### 2.2.3 Aba: Parametrizações

**RF-CONV-009**: Deve permitir configurar para cada modalidade (Cartão de Compras e Saque Fácil):

**RF-CONV-010**: Toggle de habilitação:
- "Habilitar Cartão de Compras"
- "Habilitar Saque Fácil"

**RF-CONV-011**: Para cada modalidade habilitada, configurar:

**Categorias de Servidores Aceitas**:
- Campo de texto para adicionar categorias (ex: Estatutário, Aposentado, Pensionista)
- Botão "Adicionar" para incluir categoria
- Lista de categorias adicionadas com botão "X" para remover
- Suporte a múltiplas categorias

**Limites de Margem**:
- Percentual máximo de margem consignável (0-100%)
- Valor mínimo de operação (R$)
- Valor máximo de operação (R$)
- Prazo mínimo (meses)
- Prazo máximo (meses)

**Taxas e Comissões**:
- Taxa de juros mínima (% a.m.)
- Taxa de juros máxima (% a.m.)
- Taxa de administração (%)
- Percentual de comissão para correspondentes (%)

**Regras de Débito**:
- Dia de corte para débito (1-31 ou "Último dia útil")
- Dia de repasse para o convênio (1-31)
- Quantidade de dias para compensação
- Permite débito retroativo (Sim/Não)

**RF-CONV-012**: Agenda de Corte:
- Tabela com datas de corte cadastradas
- Colunas: Data Início, Data Fim, Dia de Corte, Status, Ações
- Botão "Adicionar Data de Corte"
- Modal para cadastrar nova data de corte com validações:
  - Data início deve ser menor que data fim
  - Não pode haver sobreposição de períodos
  - Dia de corte deve ser entre 1-31 ou "Último dia útil"

**RF-CONV-013**: Arquivo de Débito:
- Tabela com arquivos de débito cadastrados
- Colunas: Nome do Arquivo, Layout, Data Upload, Status, Ações
- Botão "Anexar Arquivo de Débito"
- Modal para anexar arquivo com campos:
  - Nome do arquivo
  - Tipo de layout (Posicional, CSV, XML, JSON)
  - Upload de arquivo (.txt, .csv, .xml, .json)
  - Descrição do layout
- Opção de visualizar/baixar arquivo anexado

#### 2.2.4 Aba: Contatos

**RF-CONV-014**: Deve permitir cadastrar múltiplos contatos com:
- Nome completo (obrigatório)
- Cargo/Função (obrigatório)
- Setor/Departamento
- Telefone fixo
- Celular (obrigatório)
- E-mail (obrigatório, validar formato)
- É contato principal? (checkbox)
- Observações

**RF-CONV-015**: Funcionalidades:
- Botão "Adicionar Contato"
- Editar contato existente
- Excluir contato (com confirmação)
- No mínimo 1 contato deve ser cadastrado
- Apenas 1 contato pode ser marcado como principal

**RF-CONV-016**: Validações:
- E-mail deve ter formato válido
- Pelo menos um telefone (fixo ou celular) deve ser informado
- Ao excluir o contato principal, solicitar que outro seja marcado como principal

#### 2.2.5 Aba: Roteiro Operacional

**RF-CONV-017**: Deve permitir anexar documentos relacionados ao roteiro operacional:
- Botão "Anexar Roteiro"
- Modal de upload com campos:
  - Título do documento (obrigatório)
  - Tipo (Roteiro Completo, Procedimento Específico, Manual, Outro)
  - Arquivo (PDF, DOC, DOCX, até 10MB)
  - Versão do documento
  - Data de vigência
  - Descrição/Observações

**RF-CONV-018**: Listagem de roteiros:
- Tabela com roteiros anexados
- Colunas: Título, Tipo, Versão, Data Vigência, Data Upload, Ações
- Ações: Visualizar, Baixar, Editar info, Excluir
- Indicação visual do roteiro mais recente/vigente

**RF-CONV-019**: Controle de versão:
- Ao anexar novo roteiro com mesmo título, perguntar se é nova versão
- Manter histórico de versões anteriores
- Permitir visualizar versões anteriores

#### 2.2.6 Aba: Decretos

**RF-CONV-020**: Deve permitir cadastrar decretos e legislações relacionadas:
- Botão "Cadastrar Decreto"
- Modal com campos:
  - Número do decreto (obrigatório)
  - Data de publicação (obrigatório)
  - Data de vigência
  - Órgão emissor
  - Ementa/Descrição (obrigatório)
  - Arquivo do decreto (PDF, até 5MB)
  - Link externo (URL)
  - Status (Vigente, Revogado, Suspenso)

**RF-CONV-021**: Listagem de decretos:
- Tabela ordenada por data de publicação (mais recente primeiro)
- Colunas: Número, Data Publicação, Vigência, Status, Ações
- Filtro por status
- Busca por número ou ementa
- Ações: Visualizar, Editar, Baixar PDF, Excluir

**RF-CONV-022**: Validações:
- Data de vigência não pode ser anterior à data de publicação
- Número do decreto deve ser único para o convênio
- Pelo menos arquivo PDF ou link externo deve ser fornecido

#### 2.2.7 Aba: Logs de Alterações

**RF-CONV-023**: Deve exibir histórico completo de alterações:
- Tabela com todas as modificações
- Colunas:
  - Data/Hora da alteração
  - Usuário que realizou
  - Tipo de ação (Criação, Edição, Exclusão, Ativação, Inativação)
  - Campo alterado
  - Valor anterior
  - Valor novo
  - Observações (se houver)

**RF-CONV-024**: Funcionalidades:
- Filtro por período (data inicial e final)
- Filtro por usuário
- Filtro por tipo de ação
- Exportação para Excel/CSV
- Somente leitura (não permite alterações)

---

### 2.3 EDIÇÃO DE CONVÊNIO

#### 2.3.1 Requisitos Funcionais

**RF-CONV-025**: A edição deve usar o mesmo layout do cadastro, com todas as abas

**RF-CONV-026**: Deve haver dois modos de visualização:
- Modo Leitura: campos desabilitados, apenas visualização
- Modo Edição: campos habilitados para alteração

**RF-CONV-027**: Botões de ação:
- "Editar" (ativa modo de edição)
- "Salvar" (salva alterações e volta para modo leitura)
- "Cancelar" (descarta alterações e volta para modo leitura)
- "Voltar" (retorna para listagem)

**RF-CONV-028**: Validações:
- Ao clicar em "Cancelar" com alterações não salvas, exibir confirmação
- Ao salvar, validar todos os campos obrigatórios
- Registrar alterações no log automaticamente

#### 2.3.2 Regras de Negócio

**RN-CONV-004**: Alterações em parametrizações só devem valer para novas operações, não retroativas

**RN-CONV-005**: Ao alterar dados críticos (CNPJ, código), exigir confirmação adicional

**RN-CONV-006**: Alterações devem ser registradas com usuário, data/hora e campos modificados

---

### 2.4 VISUALIZAÇÃO DE DETALHES

#### 2.4.1 Requisitos Funcionais

**RF-CONV-029**: A visualização deve exibir todas as informações do convênio em modo somente leitura

**RF-CONV-030**: Deve haver indicadores visuais:
- Badge de status (Ativo/Inativo)
- Quantidade de operações ativas vinculadas ao convênio
- Quantidade de servidores cadastrados
- Volume total operado (últimos 12 meses)

**RF-CONV-031**: Botões de ação disponíveis:
- "Editar"
- "Exportar PDF" (gera relatório completo do convênio)
- "Voltar"

---

## 3. MÓDULO DE PROCESSADORAS

### 3.1 LISTAGEM DE PROCESSADORAS

#### 3.1.1 Requisitos Funcionais

**RF-PROC-001**: O sistema deve exibir uma tabela com todas as processadoras cadastradas contendo:
- Código da processadora
- Nome da processadora
- CNPJ
- Status (Ativo/Inativo)
- Convênios vinculados
- Data de cadastro
- Ações (Visualizar, Editar)

**RF-PROC-002**: A tabela deve permitir:
- Ordenação por qualquer coluna
- Busca por texto livre (nome, CNPJ, código)
- Filtro por status (Ativo/Inativo)
- Filtro por convênio vinculado
- Paginação (25, 50, 100 registros por página)

**RF-PROC-003**: Deve haver um botão "Cadastrar Processadora" que redireciona para a tela de cadastro

**RF-PROC-004**: Cada linha deve ter um botão de ações que permite:
- Visualizar detalhes
- Editar
- Ativar/Inativar

#### 3.1.2 Regras de Negócio

**RN-PROC-001**: Processadoras inativas devem aparecer com indicação visual diferenciada

**RN-PROC-002**: Apenas usuários com permissão "Gestor" ou superior podem inativar processadoras

**RN-PROC-003**: Processadoras com operações ativas não podem ser excluídas, apenas inativadas

---

### 3.2 CADASTRO DE PROCESSADORA

#### 3.2.1 Requisitos Funcionais

**RF-PROC-005**: O formulário de cadastro deve conter as seguintes abas:
1. Informações da Processadora
2. Convênios Vinculados
3. Configurações de Integração
4. Contatos
5. Logs de Alterações

#### 3.2.2 Aba: Informações da Processadora

**RF-PROC-006**: Campos obrigatórios:
- Código da processadora (alfanumérico, único)
- Nome da processadora
- CNPJ (validação de formato)
- Razão Social
- Status (Ativo/Inativo)
- Tipo de serviço (Processamento Folha, Gestão de Margem, Ambos)

**RF-PROC-007**: Campos opcionais:
- Site
- Endereço completo
- Telefone principal
- E-mail institucional
- Horário de atendimento
- SLA de resposta (horas)
- Observações gerais

**RF-PROC-008**: Validações:
- CNPJ deve ser válido e único no sistema
- Código da processadora deve ser único
- Nome da processadora deve ter no mínimo 3 caracteres

#### 3.2.3 Aba: Convênios Vinculados

**RF-PROC-009**: Deve exibir e permitir gerenciar convênios vinculados:
- Tabela com convênios associados
- Colunas: Código Convênio, Nome, CNPJ, Status, Data Vinculação, Ações
- Botão "Vincular Convênio"
- Modal de busca para selecionar convênio a vincular
- Botão "Desvincular" em cada linha (com confirmação)

**RF-PROC-010**: Ao vincular um convênio:
- Permitir buscar por código, nome ou CNPJ
- Exibir apenas convênios ativos
- Não permitir vincular convênio já vinculado
- Solicitar data de início do vínculo
- Permitir adicionar observações sobre o vínculo

**RF-PROC-011**: Ao desvincular:
- Exibir confirmação
- Solicitar motivo do desvinculamento
- Registrar data de fim do vínculo
- Manter histórico de vínculos anteriores

#### 3.2.4 Aba: Configurações de Integração

**RF-PROC-012**: Deve permitir configurar parâmetros de integração técnica:

**Dados de Conexão**:
- Tipo de integração (API REST, WebService SOAP, SFTP, Outro)
- URL do endpoint principal
- URL do endpoint de homologação
- Porta de conexão
- Protocolo (HTTP, HTTPS)
- Método de autenticação (Bearer Token, OAuth2, Basic Auth, API Key)

**Credenciais** (campos sensíveis, exibir mascarados):
- Usuário/Client ID
- Senha/Client Secret
- API Key
- Token de acesso
- Certificado digital (upload)

**RF-PROC-013**: Configurações de timeout e retry:
- Timeout de conexão (segundos)
- Timeout de leitura (segundos)
- Número máximo de tentativas
- Intervalo entre tentativas (segundos)

**RF-PROC-014**: Formatos e layouts:
- Formato de envio de dados (JSON, XML, CSV)
- Formato de resposta esperado
- Layout de arquivo de remessa
- Layout de arquivo de retorno
- Upload de documentação técnica (PDF)

**RF-PROC-015**: Funcionalidades:
- Botão "Testar Conexão" (valida conectividade com endpoint)
- Histórico de testes de conexão (últimos 30 dias)
- Indicador visual de status da última conexão

**RF-PROC-016**: Segurança:
- Campos de credenciais devem ser criptografados no banco
- Exibir apenas últimos 4 caracteres de tokens/senhas
- Log de acessos às credenciais
- Exigir autenticação adicional para visualizar credenciais completas

#### 3.2.5 Aba: Contatos

**RF-PROC-017**: Deve permitir cadastrar múltiplos contatos com:
- Nome completo (obrigatório)
- Cargo/Função (obrigatório)
- Setor/Departamento (ex: Suporte Técnico, Comercial, Financeiro)
- Telefone fixo
- Celular
- E-mail (obrigatório, validar formato)
- É contato técnico? (checkbox)
- É contato comercial? (checkbox)
- Disponibilidade (Horário Comercial, 24x7, Sob Demanda)
- Observações

**RF-PROC-018**: Funcionalidades:
- Botão "Adicionar Contato"
- Editar contato existente
- Excluir contato (com confirmação)
- Filtro por tipo (Técnico, Comercial, Todos)
- No mínimo 1 contato deve ser cadastrado

**RF-PROC-019**: Validações:
- E-mail deve ter formato válido
- Pelo menos um telefone deve ser informado
- Deve haver pelo menos 1 contato técnico cadastrado

#### 3.2.6 Aba: Logs de Alterações

**RF-PROC-020**: Mesmo comportamento da aba de logs de convênios (RF-CONV-023 e RF-CONV-024)

---

### 3.3 EDIÇÃO DE PROCESSADORA

#### 3.3.1 Requisitos Funcionais

**RF-PROC-021**: Mesmo comportamento da edição de convênios (RF-CONV-025 a RF-CONV-028)

**RF-PROC-022**: Atenção especial para alterações em credenciais:
- Ao alterar credenciais, exigir senha do usuário logado
- Registrar alteração de forma destacada no log
- Enviar notificação para gestores do sistema

---

### 3.4 VISUALIZAÇÃO DE DETALHES

#### 3.4.1 Requisitos Funcionais

**RF-PROC-023**: A visualização deve exibir todas as informações da processadora em modo somente leitura

**RF-PROC-024**: Deve haver indicadores visuais:
- Badge de status (Ativo/Inativo)
- Quantidade de convênios vinculados
- Status da última conexão (Sucesso/Falha, data/hora)
- Quantidade de operações processadas (últimos 30 dias)

**RF-PROC-025**: Botões de ação disponíveis:
- "Editar"
- "Testar Conexão"
- "Exportar PDF" (gera relatório completo da processadora)
- "Voltar"

---

## 4. REQUISITOS TRANSVERSAIS

### 4.1 Segurança e Permissões

**RF-SEG-001**: Controle de acesso baseado em perfis:
- **Visualizador**: Apenas visualizar convênios e processadoras
- **Operador**: Visualizar e editar (exceto exclusão/inativação)
- **Gestor**: Todas as permissões, incluir ativar/inativar
- **Administrador**: Todas as permissões + acesso a credenciais completas

**RF-SEG-002**: Auditoria:
- Todas as ações devem ser registradas (quem, quando, o quê)
- Logs devem ser imutáveis
- Retenção de logs por no mínimo 5 anos

**RF-SEG-003**: Dados sensíveis:
- Credenciais de API devem ser criptografadas (AES-256)
- Documentos anexados devem ter controle de acesso
- Dados de contato devem respeitar LGPD

### 4.2 Performance

**RF-PERF-001**: Tempos de resposta:
- Listagens: máximo 2 segundos para 1000 registros
- Abertura de detalhes: máximo 1 segundo
- Salvamento: máximo 3 segundos

**RF-PERF-002**: Paginação:
- Listagens devem ser paginadas
- Carga sob demanda para grandes volumes

### 4.3 Usabilidade

**RF-UX-001**: Responsividade:
- Interface deve ser responsiva (desktop, tablet)
- Tabelas devem ter scroll horizontal em telas menores

**RF-UX-002**: Feedback ao usuário:
- Mensagens de sucesso/erro claras
- Loading indicators em operações demoradas
- Confirmação para ações destrutivas

**RF-UX-003**: Validações:
- Validação em tempo real nos formulários
- Mensagens de erro contextualizadas
- Destaque visual em campos obrigatórios

### 4.4 Integrações

**RF-INT-001**: O módulo deve se integrar com:
- Sistema de gestão de operações (consulta de operações por convênio)
- Sistema de gestão de servidores (consulta de servidores por convênio)
- Sistema de notificações (alertas de status de processadora)

**RF-INT-002**: APIs devem estar disponíveis para:
- Consulta de convênios ativos
- Consulta de processadoras ativas
- Consulta de parametrizações vigentes
- Validação de margem disponível

### 4.5 Relatórios e Exportações

**RF-REL-001**: Relatórios disponíveis:
- Listagem completa de convênios (Excel/PDF)
- Listagem completa de processadoras (Excel/PDF)
- Detalhamento de convênio individual (PDF)
- Detalhamento de processadora individual (PDF)
- Histórico de alterações por período (Excel)

**RF-REL-002**: Filtros para relatórios:
- Período
- Status
- Tipo de convênio/processadora
- Usuário que realizou alterações

---

## 5. MODELO DE DADOS

### 5.1 Tabela: convenios

```
id: UUID (PK)
codigo: VARCHAR(50) UNIQUE NOT NULL
nome: VARCHAR(255) NOT NULL
cnpj: VARCHAR(14) UNIQUE NOT NULL
razao_social: VARCHAR(255) NOT NULL
tipo: ENUM('Estadual', 'Federal', 'Municipal', 'Privado')
uf: VARCHAR(2)
municipio: VARCHAR(255)
status: ENUM('Ativo', 'Inativo') DEFAULT 'Ativo'
site: VARCHAR(255)
endereco_completo: TEXT
telefone: VARCHAR(20)
email: VARCHAR(255)
observacoes: TEXT
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
created_by: UUID (FK -> users)
updated_by: UUID (FK -> users)
```

### 5.2 Tabela: convenios_parametrizacoes

```
id: UUID (PK)
convenio_id: UUID (FK -> convenios) NOT NULL
modalidade: ENUM('Cartão Compras', 'Saque Fácil') NOT NULL
habilitado: BOOLEAN DEFAULT true
categorias_servidores: JSONB (array de strings)
percentual_maximo_margem: DECIMAL(5,2)
valor_minimo_operacao: DECIMAL(15,2)
valor_maximo_operacao: DECIMAL(15,2)
prazo_minimo_meses: INTEGER
prazo_maximo_meses: INTEGER
taxa_juros_minima: DECIMAL(8,4)
taxa_juros_maxima: DECIMAL(8,4)
taxa_administracao: DECIMAL(5,2)
percentual_comissao: DECIMAL(5,2)
dia_corte_debito: INTEGER
dia_repasse: INTEGER
dias_compensacao: INTEGER
permite_debito_retroativo: BOOLEAN DEFAULT false
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
```

### 5.3 Tabela: convenios_agendas_corte

```
id: UUID (PK)
convenio_id: UUID (FK -> convenios) NOT NULL
data_inicio: DATE NOT NULL
data_fim: DATE NOT NULL
dia_corte: INTEGER NOT NULL
status: ENUM('Ativa', 'Inativa') DEFAULT 'Ativa'
observacoes: TEXT
created_at: TIMESTAMP DEFAULT NOW()
created_by: UUID (FK -> users)
```

### 5.4 Tabela: convenios_arquivos_debito

```
id: UUID (PK)
convenio_id: UUID (FK -> convenios) NOT NULL
nome_arquivo: VARCHAR(255) NOT NULL
tipo_layout: ENUM('Posicional', 'CSV', 'XML', 'JSON')
caminho_arquivo: VARCHAR(500) NOT NULL
descricao_layout: TEXT
uploaded_at: TIMESTAMP DEFAULT NOW()
uploaded_by: UUID (FK -> users)
```

### 5.5 Tabela: convenios_contatos

```
id: UUID (PK)
convenio_id: UUID (FK -> convenios) NOT NULL
nome_completo: VARCHAR(255) NOT NULL
cargo: VARCHAR(100) NOT NULL
setor: VARCHAR(100)
telefone_fixo: VARCHAR(20)
celular: VARCHAR(20) NOT NULL
email: VARCHAR(255) NOT NULL
is_principal: BOOLEAN DEFAULT false
observacoes: TEXT
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
```

### 5.6 Tabela: convenios_roteiros

```
id: UUID (PK)
convenio_id: UUID (FK -> convenios) NOT NULL
titulo: VARCHAR(255) NOT NULL
tipo: ENUM('Roteiro Completo', 'Procedimento Específico', 'Manual', 'Outro')
versao: VARCHAR(20)
data_vigencia: DATE
descricao: TEXT
caminho_arquivo: VARCHAR(500) NOT NULL
uploaded_at: TIMESTAMP DEFAULT NOW()
uploaded_by: UUID (FK -> users)
```

### 5.7 Tabela: convenios_decretos

```
id: UUID (PK)
convenio_id: UUID (FK -> convenios) NOT NULL
numero_decreto: VARCHAR(100) NOT NULL
data_publicacao: DATE NOT NULL
data_vigencia: DATE
orgao_emissor: VARCHAR(255)
ementa: TEXT NOT NULL
caminho_arquivo: VARCHAR(500)
link_externo: VARCHAR(500)
status: ENUM('Vigente', 'Revogado', 'Suspenso') DEFAULT 'Vigente'
created_at: TIMESTAMP DEFAULT NOW()
created_by: UUID (FK -> users)
updated_at: TIMESTAMP DEFAULT NOW()
```

### 5.8 Tabela: processadoras

```
id: UUID (PK)
codigo: VARCHAR(50) UNIQUE NOT NULL
nome: VARCHAR(255) NOT NULL
cnpj: VARCHAR(14) UNIQUE NOT NULL
razao_social: VARCHAR(255) NOT NULL
tipo_servico: ENUM('Processamento Folha', 'Gestão de Margem', 'Ambos')
status: ENUM('Ativo', 'Inativo') DEFAULT 'Ativo'
site: VARCHAR(255)
endereco_completo: TEXT
telefone: VARCHAR(20)
email: VARCHAR(255)
horario_atendimento: VARCHAR(100)
sla_resposta_horas: INTEGER
observacoes: TEXT
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
created_by: UUID (FK -> users)
updated_by: UUID (FK -> users)
```

### 5.9 Tabela: processadoras_convenios

```
id: UUID (PK)
processadora_id: UUID (FK -> processadoras) NOT NULL
convenio_id: UUID (FK -> convenios) NOT NULL
data_inicio_vinculo: DATE NOT NULL
data_fim_vinculo: DATE
motivo_desvinculamento: TEXT
observacoes: TEXT
created_at: TIMESTAMP DEFAULT NOW()
created_by: UUID (FK -> users)
```

### 5.10 Tabela: processadoras_configuracoes

```
id: UUID (PK)
processadora_id: UUID (FK -> processadoras) UNIQUE NOT NULL
tipo_integracao: ENUM('API REST', 'WebService SOAP', 'SFTP', 'Outro')
url_endpoint_producao: VARCHAR(500)
url_endpoint_homologacao: VARCHAR(500)
porta_conexao: INTEGER
protocolo: ENUM('HTTP', 'HTTPS')
metodo_autenticacao: ENUM('Bearer Token', 'OAuth2', 'Basic Auth', 'API Key')
usuario_client_id: VARCHAR(255) ENCRYPTED
senha_client_secret: VARCHAR(255) ENCRYPTED
api_key: VARCHAR(500) ENCRYPTED
token_acesso: TEXT ENCRYPTED
caminho_certificado: VARCHAR(500)
timeout_conexao_segundos: INTEGER DEFAULT 30
timeout_leitura_segundos: INTEGER DEFAULT 60
max_tentativas: INTEGER DEFAULT 3
intervalo_tentativas_segundos: INTEGER DEFAULT 5
formato_envio: ENUM('JSON', 'XML', 'CSV')
formato_resposta: ENUM('JSON', 'XML', 'CSV')
layout_remessa: TEXT
layout_retorno: TEXT
caminho_doc_tecnica: VARCHAR(500)
updated_at: TIMESTAMP DEFAULT NOW()
updated_by: UUID (FK -> users)
```

### 5.11 Tabela: processadoras_contatos

```
id: UUID (PK)
processadora_id: UUID (FK -> processadoras) NOT NULL
nome_completo: VARCHAR(255) NOT NULL
cargo: VARCHAR(100) NOT NULL
setor: VARCHAR(100)
telefone_fixo: VARCHAR(20)
celular: VARCHAR(20)
email: VARCHAR(255) NOT NULL
is_contato_tecnico: BOOLEAN DEFAULT false
is_contato_comercial: BOOLEAN DEFAULT false
disponibilidade: ENUM('Horário Comercial', '24x7', 'Sob Demanda')
observacoes: TEXT
created_at: TIMESTAMP DEFAULT NOW()
updated_at: TIMESTAMP DEFAULT NOW()
```

### 5.12 Tabela: processadoras_testes_conexao

```
id: UUID (PK)
processadora_id: UUID (FK -> processadoras) NOT NULL
data_hora_teste: TIMESTAMP DEFAULT NOW()
status_resultado: ENUM('Sucesso', 'Falha') NOT NULL
tempo_resposta_ms: INTEGER
mensagem_erro: TEXT
realizado_por: UUID (FK -> users)
```

### 5.13 Tabela: logs_alteracoes

```
id: UUID (PK)
entidade_tipo: ENUM('Convênio', 'Processadora')
entidade_id: UUID NOT NULL
data_hora: TIMESTAMP DEFAULT NOW()
usuario_id: UUID (FK -> users) NOT NULL
tipo_acao: ENUM('Criação', 'Edição', 'Exclusão', 'Ativação', 'Inativação')
campo_alterado: VARCHAR(100)
valor_anterior: TEXT
valor_novo: TEXT
observacoes: TEXT
ip_origem: VARCHAR(45)
```

---

## 6. CASOS DE USO PRINCIPAIS

### 6.1 UC-CONV-001: Cadastrar Novo Convênio

**Ator**: Gestor

**Pré-condições**: Usuário autenticado com perfil Gestor ou superior

**Fluxo Principal**:
1. Usuário acessa a listagem de convênios
2. Usuário clica em "Cadastrar Convênio"
3. Sistema exibe formulário vazio
4. Usuário preenche aba "Informações do Convênio"
5. Usuário preenche aba "Parametrizações"
6. Usuário adiciona ao menos um contato na aba "Contatos"
7. Usuário clica em "Salvar"
8. Sistema valida todos os campos obrigatórios
9. Sistema verifica se CNPJ e código são únicos
10. Sistema cria o registro no banco de dados
11. Sistema registra ação no log de alterações
12. Sistema exibe mensagem de sucesso
13. Sistema redireciona para visualização do convênio criado

**Fluxos Alternativos**:

**FA1 - Dados inválidos**:
- No passo 8, se validação falhar:
  - Sistema exibe mensagens de erro nos campos inválidos
  - Sistema mantém usuário no formulário
  - Fluxo retorna ao passo 4

**FA2 - CNPJ duplicado**:
- No passo 9, se CNPJ já existir:
  - Sistema exibe mensagem "CNPJ já cadastrado"
  - Sistema oferece opção de visualizar convênio existente
  - Fluxo é encerrado

**FA3 - Cancelamento**:
- A qualquer momento, usuário pode clicar em "Cancelar"
  - Sistema exibe confirmação se houver dados preenchidos
  - Se confirmado, sistema descarta alterações
  - Sistema retorna para listagem

### 6.2 UC-CONV-002: Editar Parametrizações de Convênio

**Ator**: Gestor

**Pré-condições**:
- Usuário autenticado com perfil Gestor ou superior
- Convênio já cadastrado

**Fluxo Principal**:
1. Usuário acessa detalhes do convênio
2. Usuário clica em "Editar"
3. Sistema habilita campos para edição
4. Usuário navega até aba "Parametrizações"
5. Usuário altera valores desejados
6. Usuário clica em "Salvar"
7. Sistema valida alterações
8. Sistema exibe confirmação destacando que mudanças valerão apenas para novas operações
9. Usuário confirma
10. Sistema atualiza registros
11. Sistema registra alterações detalhadas no log
12. Sistema exibe mensagem de sucesso
13. Sistema volta para modo visualização

**Fluxos Alternativos**:

**FA1 - Dados inválidos**:
- Similar ao UC-CONV-001 FA1

**FA2 - Cancelamento durante edição**:
- No passo 9, usuário pode cancelar:
  - Sistema não salva alterações
  - Sistema volta para modo visualização com dados originais

### 6.3 UC-PROC-001: Cadastrar Nova Processadora

**Ator**: Administrador

**Pré-condições**: Usuário autenticado com perfil Administrador

**Fluxo Principal**:
1. Usuário acessa a listagem de processadoras
2. Usuário clica em "Cadastrar Processadora"
3. Sistema exibe formulário vazio
4. Usuário preenche aba "Informações da Processadora"
5. Usuário vincula convênios na aba "Convênios Vinculados"
6. Usuário preenche configurações técnicas na aba "Configurações de Integração"
7. Usuário adiciona ao menos um contato técnico na aba "Contatos"
8. Usuário clica em "Salvar"
9. Sistema valida todos os campos obrigatórios
10. Sistema verifica se CNPJ e código são únicos
11. Sistema criptografa credenciais sensíveis
12. Sistema cria os registros no banco de dados
13. Sistema registra ação no log de alterações
14. Sistema exibe mensagem de sucesso
15. Sistema redireciona para visualização da processadora criada

**Fluxos Alternativos**:

**FA1 - Teste de conexão durante cadastro**:
- No passo 6, usuário pode clicar em "Testar Conexão":
  - Sistema valida se campos de conexão estão preenchidos
  - Sistema tenta estabelecer conexão com endpoint
  - Sistema exibe resultado (sucesso/falha) com detalhes
  - Sistema registra teste na tabela de testes de conexão
  - Fluxo retorna ao passo 6

**FA2 - Credenciais inválidas**:
- No passo 6, durante preenchimento:
  - Sistema oferece opção de validar credenciais
  - Se inválidas, sistema alerta mas permite prosseguir
  - Sistema registra alerta no log

### 6.4 UC-PROC-002: Vincular Convênio a Processadora

**Ator**: Gestor

**Pré-condições**:
- Usuário autenticado com perfil Gestor ou superior
- Processadora já cadastrada
- Convênio a ser vinculado já cadastrado e ativo

**Fluxo Principal**:
1. Usuário acessa detalhes da processadora
2. Usuário clica em "Editar"
3. Usuário navega até aba "Convênios Vinculados"
4. Usuário clica em "Vincular Convênio"
5. Sistema exibe modal de busca
6. Usuário busca por código, nome ou CNPJ do convênio
7. Sistema exibe resultados filtrados (apenas convênios ativos não vinculados)
8. Usuário seleciona convênio desejado
9. Sistema exibe campos adicionais:
   - Data de início do vínculo (obrigatório)
   - Observações (opcional)
10. Usuário preenche e confirma
11. Sistema valida se convênio não está já vinculado
12. Sistema cria registro de vínculo
13. Sistema registra ação no log
14. Sistema exibe mensagem de sucesso
15. Sistema atualiza tabela de convênios vinculados

**Fluxos Alternativos**:

**FA1 - Convênio já vinculado**:
- No passo 11, se convênio já estiver vinculado:
  - Sistema exibe mensagem "Convênio já está vinculado a esta processadora"
  - Sistema não permite prosseguir
  - Fluxo é encerrado

**FA2 - Convênio inativo**:
- No passo 7, convênios inativos não aparecem na busca
- Se usuário tenta vincular convênio inativo diretamente:
  - Sistema exibe alerta
  - Sistema não permite vínculo

### 6.5 UC-PROC-003: Testar Conexão com Processadora

**Ator**: Operador, Gestor ou Administrador

**Pré-condições**:
- Usuário autenticado
- Processadora já cadastrada com configurações de integração

**Fluxo Principal**:
1. Usuário acessa detalhes da processadora
2. Usuário clica em "Testar Conexão"
3. Sistema valida se configurações estão completas
4. Sistema exibe modal de confirmação com detalhes do teste
5. Usuário confirma
6. Sistema inicia tentativa de conexão
7. Sistema exibe indicador de carregamento
8. Sistema tenta conectar ao endpoint configurado
9. Sistema mede tempo de resposta
10. Sistema recebe resposta ou timeout
11. Sistema registra resultado na tabela de testes
12. Sistema exibe resultado ao usuário:
    - Se sucesso: mensagem verde + tempo de resposta
    - Se falha: mensagem vermelha + detalhes do erro
13. Sistema registra teste no log de alterações

**Fluxos Alternativos**:

**FA1 - Configurações incompletas**:
- No passo 3, se configurações incompletas:
  - Sistema exibe alerta identificando campos faltantes
  - Sistema não permite prosseguir com teste
  - Fluxo é encerrado

**FA2 - Timeout**:
- No passo 10, se timeout ocorrer:
  - Sistema registra como falha
  - Sistema exibe mensagem "Tempo de resposta excedido"
  - Sistema sugere verificar conectividade e configurações
  - Fluxo continua no passo 11

**FA3 - Erro de autenticação**:
- No passo 10, se erro 401/403:
  - Sistema identifica erro de autenticação
  - Sistema exibe mensagem "Credenciais inválidas"
  - Sistema sugere revisar configurações de autenticação
  - Fluxo continua no passo 11

---

## 7. CRITÉRIOS DE ACEITAÇÃO

### 7.1 Funcionalidades Obrigatórias

- [ ] Cadastro completo de convênios com todas as abas funcionais
- [ ] Cadastro completo de processadoras com todas as abas funcionais
- [ ] Edição com modo leitura/edição bem definido
- [ ] Validações de campos obrigatórios e formatos
- [ ] CNPJ e códigos únicos por entidade
- [ ] Gestão de categorias (adicionar/remover) funcional
- [ ] Gestão de contatos (criar/editar/excluir) funcional
- [ ] Vínculo entre processadoras e convênios funcional
- [ ] Upload de arquivos (roteiros, decretos, layouts) funcional
- [ ] Agenda de corte com validação de períodos
- [ ] Configurações de integração com campos sensíveis criptografados
- [ ] Teste de conexão com processadora funcional
- [ ] Logs de alterações completos e imutáveis
- [ ] Busca e filtros nas listagens
- [ ] Paginação nas tabelas
- [ ] Exportação para Excel/PDF

### 7.2 Qualidade

- [ ] Todas as validações de formulário implementadas
- [ ] Mensagens de erro claras e contextualizadas
- [ ] Confirmações para ações destrutivas
- [ ] Loading indicators em operações assíncronas
- [ ] Tratamento de erros de API/Banco
- [ ] Interface responsiva (desktop e tablet)
- [ ] Acessibilidade básica (WCAG 2.1 Nível A)

### 7.3 Segurança

- [ ] Controle de acesso por perfil implementado
- [ ] Credenciais criptografadas no banco (AES-256)
- [ ] Logs de auditoria completos
- [ ] Proteção contra SQL Injection
- [ ] Proteção contra XSS
- [ ] Validação de upload de arquivos (tipo, tamanho)
- [ ] Conformidade com LGPD para dados pessoais

### 7.4 Performance

- [ ] Listagens carregam em até 2 segundos (1000 registros)
- [ ] Detalhes carregam em até 1 segundo
- [ ] Salvamento completa em até 3 segundos
- [ ] Queries otimizadas com índices adequados
- [ ] Imagens/arquivos otimizados

---

## 8. ENTREGÁVEIS

### 8.1 Código

- [ ] Código-fonte versionado no Git
- [ ] Migrations de banco de dados
- [ ] Seeds de dados de teste
- [ ] Testes unitários (cobertura mínima 70%)
- [ ] Testes de integração para fluxos principais
- [ ] Documentação de APIs (Swagger/OpenAPI)

### 8.2 Documentação

- [ ] Manual do usuário (PDF)
- [ ] Documentação técnica de APIs
- [ ] Diagrama de Entidade-Relacionamento (DER)
- [ ] Diagrama de casos de uso
- [ ] Guia de instalação e configuração

### 8.3 Ambientes

- [ ] Deploy em ambiente de desenvolvimento
- [ ] Deploy em ambiente de homologação
- [ ] Scripts de deploy automatizado
- [ ] Configuração de CI/CD

---

## 9. CRONOGRAMA SUGERIDO

### Sprint 1 (2 semanas) - Fundação
- Criação do modelo de dados
- Migrations e estrutura inicial
- Listagem básica de convênios e processadoras
- CRUD básico de convênios

### Sprint 2 (2 semanas) - Convênios
- Aba de parametrizações completa
- Gestão de categorias
- Agenda de corte
- Arquivo de débito
- Aba de contatos

### Sprint 3 (2 semanas) - Convênios (continuação)
- Roteiro operacional
- Decretos
- Logs de alterações
- Modo edição/visualização

### Sprint 4 (2 semanas) - Processadoras
- CRUD completo de processadoras
- Configurações de integração
- Gestão de contatos técnicos
- Vínculo com convênios

### Sprint 5 (2 semanas) - Integrações e Testes
- Teste de conexão com processadora
- Histórico de testes
- Criptografia de credenciais
- APIs de integração

### Sprint 6 (1 semana) - Relatórios e Refinamentos
- Exportações (Excel/PDF)
- Relatórios gerenciais
- Ajustes de usabilidade
- Testes de aceitação

### Sprint 7 (1 semana) - Homologação
- Testes em homologação
- Correções de bugs
- Documentação
- Preparação para produção

---

## 10. CONSIDERAÇÕES TÉCNICAS

### 10.1 Stack Tecnológica Sugerida

**Backend**:
- Node.js com TypeScript ou Python (FastAPI)
- PostgreSQL como banco de dados
- Supabase para autenticação e RLS

**Frontend**:
- React com TypeScript
- Tailwind CSS para estilização
- React Query para gestão de estado servidor
- React Hook Form para formulários
- Zod para validações

**Infraestrutura**:
- Docker para containerização
- CI/CD com GitHub Actions ou GitLab CI
- Monitoramento com Sentry

### 10.2 Padrões de Código

- Clean Code e SOLID
- Commits semânticos (Conventional Commits)
- Code review obrigatório
- Linting com ESLint/Pylint
- Formatação com Prettier/Black

### 10.3 Testes

- Testes unitários com Jest/Pytest
- Testes de integração com Testing Library
- Testes E2E com Cypress/Playwright (opcional)
- Cobertura mínima de 70%

---

## 11. GLOSSÁRIO

**Convênio**: Órgão público ou entidade privada que possui acordo com a instituição financeira para oferecer crédito consignado aos seus servidores/funcionários.

**Processadora**: Empresa especializada em processar folhas de pagamento e/ou gerenciar margens consignáveis para múltiplos convênios.

**Margem Consignável**: Percentual do salário ou benefício que pode ser comprometido com empréstimos consignados.

**Agenda de Corte**: Calendário que define os dias em que os débitos serão realizados nas folhas de pagamento dos servidores.

**Layout de Arquivo**: Estrutura padronizada de arquivo (posicional, CSV, XML, JSON) usada para troca de informações entre sistemas.

**RLS (Row Level Security)**: Controle de acesso a nível de linha no banco de dados PostgreSQL.

**LGPD**: Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).

**SLA**: Service Level Agreement - Acordo de nível de serviço que define tempo de resposta esperado.

---

## 12. ANEXOS

### Anexo A - Exemplo de Layout Posicional

```
Posição    Tamanho    Tipo        Descrição
001-011    11         Numérico    CPF do servidor
012-061    50         Alfanum     Nome completo
062-076    15         Numérico    Matrícula
077-089    13         Decimal     Valor do salário (10 int + 2 dec)
090-094    5          Decimal     Margem disponível % (3 int + 2 dec)
```

### Anexo B - Exemplo de Resposta de API

```json
{
  "success": true,
  "data": {
    "convenio_codigo": "CONV001",
    "margem_disponivel": 1250.50,
    "percentual_comprometido": 35.75,
    "operacoes_ativas": 2
  },
  "timestamp": "2024-01-15T14:30:00Z"
}
```

---

## CONTROLE DE VERSÕES

| Versão | Data       | Autor | Descrição                          |
|--------|------------|-------|------------------------------------|
| 1.0    | 2024-01-15 | PO    | Versão inicial do documento        |

---

**FIM DO DOCUMENTO**
