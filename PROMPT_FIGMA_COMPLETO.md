# Prompt Completo para Design no Figma - Sistema de Gestão de Crédito Consignado

## CONTEXTO GERAL

Preciso que você crie o design completo de um **Sistema de Gestão de Crédito Consignado** no Figma. Este é um sistema web administrativo usado por operadores financeiros, gestores e analistas para gerenciar todo o ciclo de operações de crédito consignado, desde o cadastro de clientes até a conciliação de pagamentos.

**Público-alvo**: Profissionais administrativos e financeiros (mesa de operações, backoffice, gestores)

**Tipo de aplicação**: Web app desktop (responsive para tablets também)

**Tom visual**: Profissional, clean, confiável, moderno, com foco em produtividade e clareza de informação

---

## ESTRUTURA DO SISTEMA

O sistema possui **10 módulos principais** organizados em abas horizontais:

1. **Dashboard** - Visão geral gerencial com KPIs e gráficos
2. **Cadastro** - Cadastro de propostas de crédito em múltiplas etapas
3. **Mesa** - Análise e aprovação de propostas
4. **Convênios** - Gestão de convênios (órgãos públicos/entidades)
5. **Processadoras** - Gestão de empresas processadoras de folha
6. **Servidores** - Base de dados de servidores/clientes
7. **Repasses** - Gestão de repasses financeiros
8. **Conciliação** - Conciliação bancária e controle de pagamentos
9. **Antecipações** - Gestão de antecipações e quitações
10. **Upload** - Upload de arquivos de remessa/retorno

---

## PALETA DE CORES

**Cores Principais**:
- Primária (Ações principais): `#2563EB` (azul profissional)
- Secundária (Destaque): `#10B981` (verde sucesso)
- Fundo: `#F9FAFB` (cinza muito claro)
- Branco: `#FFFFFF` (cards e áreas principais)

**Cores de Status**:
- Verde (Aprovado/Ativo): `#10B981`
- Amarelo (Pendente/Em análise): `#F59E0B`
- Vermelho (Reprovado/Erro): `#EF4444`
- Azul (Em digitação/Novo): `#3B82F6`
- Cinza (Inativo/Cancelado): `#6B7280`

**Cores de Texto**:
- Texto principal: `#111827`
- Texto secundário: `#6B7280`
- Texto desabilitado: `#9CA3AF`

**Bordas e Divisores**:
- Borda padrão: `#E5E7EB`
- Borda hover: `#D1D5DB`
- Borda foco: `#2563EB`

---

## TIPOGRAFIA

**Fonte**: Inter ou similar (sem serifa, moderna, legível)

**Escala**:
- Título de página (H1): 24px, Bold (600)
- Título de seção (H2): 18px, Semibold (600)
- Título de card (H3): 16px, Semibold (600)
- Texto normal: 14px, Regular (400)
- Texto pequeno (labels, hints): 12px, Regular (400)
- Badges/Tags: 12px, Medium (500)

**Line Height**:
- Títulos: 120%
- Texto corpo: 150%

---

## COMPONENTES BASE

### 1. Navegação Principal
- Barra horizontal no topo da tela
- Logo à esquerda
- 10 tabs no centro (Dashboard, Cadastro, Mesa, etc.)
- Ícone de usuário e notificações à direita
- Tab ativa: fundo branco com borda inferior azul (`#2563EB`, 2px)
- Tabs inativos: texto cinza, hover com fundo `#F3F4F6`
- Altura: 56px
- Fundo: branco com sombra leve

### 2. Cards
- Fundo branco
- Borda: 1px sólida `#E5E7EB`
- Border radius: 8px
- Padding interno: 20px (1.25rem)
- Sombra sutil: `0 1px 3px rgba(0, 0, 0, 0.1)`

### 3. Tabelas
- Cabeçalho: fundo `#F9FAFB`, texto semibold 12px, uppercase, cinza escuro
- Linhas: hover com fundo `#F9FAFB`
- Altura da linha: 48px
- Padding das células: 12px
- Bordas horizontais entre linhas: 1px sólida `#E5E7EB`
- Ordenação: ícone de seta ao lado do título da coluna
- Última coluna sempre "Ações" com ícones (olho, lápis, lixeira, etc)

### 4. Botões

**Botão Primário**:
- Fundo: `#2563EB`
- Texto: branco, 14px, medium (500)
- Padding: 10px 20px
- Border radius: 6px
- Hover: `#1D4ED8`
- Shadow ao hover: `0 4px 6px rgba(37, 99, 235, 0.2)`

**Botão Secundário**:
- Fundo: branco
- Borda: 1px `#D1D5DB`
- Texto: `#374151`, 14px, medium
- Padding: 10px 20px
- Border radius: 6px
- Hover: fundo `#F9FAFB`

**Botão de Perigo**:
- Fundo: `#EF4444`
- Texto: branco
- Mesmo padding e border radius
- Hover: `#DC2626`

**Botão Ícone**:
- 36x36px
- Fundo transparente
- Ícone 20px
- Hover: fundo `#F3F4F6`, border radius 6px

### 5. Inputs e Formulários

**Input de Texto**:
- Altura: 40px
- Borda: 1px `#D1D5DB`
- Border radius: 6px
- Padding: 10px 12px
- Foco: borda azul `#2563EB`, ring externa azul claro
- Label acima: 12px, medium, `#374151`, margin-bottom 6px
- Placeholder: texto `#9CA3AF`

**Select/Dropdown**:
- Mesmas especificações do input
- Ícone chevron à direita

**Textarea**:
- Min height: 80px
- Mesmas especificações do input
- Resize vertical permitido

**Checkbox e Radio**:
- 20x20px
- Borda: 2px `#D1D5DB`
- Checked: fundo `#2563EB`, ícone check branco
- Border radius checkbox: 4px
- Border radius radio: 50%

**Toggle Switch**:
- Largura: 44px, Altura: 24px
- Fundo off: `#D1D5DB`
- Fundo on: `#2563EB`
- Círculo: 20px, branco, transição suave

### 6. Badges de Status
- Padding: 4px 10px
- Border radius: 9999px (totalmente arredondado)
- Texto: 12px, medium (500)
- Variações:
  - **Aprovado**: fundo `#D1FAE5`, texto `#065F46`
  - **Pendente**: fundo `#FEF3C7`, texto `#92400E`
  - **Reprovado**: fundo `#FEE2E2`, texto `#991B1B`
  - **Em Análise**: fundo `#DBEAFE`, texto `#1E40AF`
  - **Cancelado**: fundo `#F3F4F6`, texto `#374151`

### 7. Modais/Drawers

**Modal (Centro da tela)**:
- Overlay: fundo escuro 50% opacidade
- Card: fundo branco, max-width 600px
- Border radius: 12px
- Header: padding 24px, border-bottom `#E5E7EB`
- Body: padding 24px
- Footer: padding 16px 24px, border-top `#E5E7EB`, botões alinhados à direita
- Ícone X para fechar no canto superior direito

**Drawer (Lateral direita)**:
- Largura: 640px
- Altura: 100vh
- Fundo: branco
- Sombra à esquerda: grande e escura
- Mesma estrutura de header/body/footer do modal
- Animação de entrada da direita para esquerda

### 8. Filtros e Busca

**Barra de Busca**:
- Input com ícone de lupa à esquerda
- Placeholder: "Buscar..."
- Largura: 280px mínimo
- Altura: 40px

**Painel de Filtros**:
- Card ou drawer
- Cada filtro empilhado verticalmente
- Botões "Limpar Filtros" e "Aplicar" no rodapé
- Contador de filtros ativos em badge azul

### 9. KPI Cards
- Card branco com borda
- Ícone circular colorido à esquerda (48x48px)
- Título acima: 12px, uppercase, cinza
- Valor principal: 24px, bold, cinza escuro
- Subtexto/variação embaixo: 12px com ícone de seta (verde ↑ positivo, vermelho ↓ negativo)
- Padding: 20px
- Min width: 240px

### 10. Gráficos
- Use estilo minimalista
- Cores coordenadas com a paleta principal
- Legendas claras abaixo ou à direita
- Grid sutil em cinza claro
- Tooltips ao hover com fundo escuro e texto branco

---

## DETALHAMENTO POR MÓDULO

### MÓDULO 1: DASHBOARD

**Layout**:
- Título "Dashboard" no topo esquerdo (H1)
- Barra de filtros logo abaixo: dropdowns para Período, Loja/Correspondente, Convênio
- 4 KPI Cards em linha horizontal:
  1. Total de Propostas (ícone documento azul)
  2. Taxa de Aprovação (ícone check verde)
  3. Volume Aprovado (ícone cifrão verde)
  4. Ticket Médio (ícone gráfico laranja)
- Abaixo, 2 colunas (60% + 40%):
  - **Coluna Esquerda**:
    - Card "Tendência de Propostas" (gráfico de linha temporal)
    - Card "Distribuição por Status" (gráfico de barras horizontais)
  - **Coluna Direita**:
    - Card "Metas do Mês" com barras de progresso
    - Card "Insights Rápidos" com lista de bullets

**Gráfico de Tendência**:
- Eixo X: datas (últimos 30 dias)
- Eixo Y: quantidade de propostas
- Linhas suaves, coloridas (azul para total, verde para aprovadas, vermelho para reprovadas)
- Pontos marcadores ao hover

**Gráfico de Distribuição**:
- Barras horizontais
- Labels à esquerda (Aprovado, Em Análise, Pendente, Reprovado)
- Cores correspondentes aos status
- Valores no final de cada barra

**Card de Metas**:
- Lista de metas (ex: Propostas, Volume, Taxa de Aprovação)
- Cada linha com label, barra de progresso, e valor atual vs. meta
- Progresso acima de 100% em verde forte, 80-100% verde claro, 50-80% amarelo, abaixo de 50% vermelho

---

### MÓDULO 2: CADASTRO

**Layout**: Formulário de múltiplas etapas (wizard)

**Barra de Progresso no Topo**:
- 5 etapas numeradas horizontalmente:
  1. Simulador
  2. Dados do Cliente
  3. Documentos
  4. Reserva
  5. CCB
- Etapa atual: círculo azul preenchido, número branco
- Etapas completas: círculo verde com check branco
- Etapas futuras: círculo cinza claro com número cinza
- Linha conectando os círculos (completa: verde, futura: cinza)

**Conteúdo de Cada Etapa**:

**Etapa 1: Simulador**
- Card com título "Simulação de Crédito"
- Formulário em 2 colunas:
  - Coluna 1: CPF (campo obrigatório), Botão "Buscar Margem"
  - Coluna 2: Convênio (select), Matrícula, Data de Nascimento
- Abaixo: Informações de margem em cards coloridos:
  - Margem Disponível: valor grande em verde
  - Margem Comprometida: valor em laranja
  - Margem Total: valor em azul
- Campos da simulação:
  - Valor Solicitado (input com R$)
  - Quantidade de Parcelas (select de 1-96)
  - Taxa de Juros % a.m. (input)
  - Valor da Parcela (calculado automaticamente, readonly, destaque em azul)
  - CET % a.a. (calculado, readonly)
- Botões: "Limpar" (secundário) e "Avançar" (primário)

**Etapa 2: Dados do Cliente**
- Título "Dados do Cliente"
- Seções organizadas em accordions ou cards separados:

1. **Dados Pessoais** (sempre expandido):
   - Nome Completo (input largo)
   - CPF (preenchido, readonly)
   - RG, Órgão Emissor, Data Emissão (3 colunas)
   - Data de Nascimento (readonly), Sexo (select), Estado Civil (select)
   - Nome da Mãe (input largo)
   - E-mail, Celular (2 colunas)

2. **Endereço**:
   - CEP (com botão "Buscar")
   - Logradouro, Número, Complemento
   - Bairro, Cidade, UF
   - Tempo de Residência

3. **Dados Bancários**:
   - Banco (select com busca)
   - Agência, Conta, Dígito
   - Tipo de Conta (select: Corrente, Poupança, Salário)
   - Checkbox "Mesma conta do convênio"

4. **Dados Profissionais**:
   - Matrícula (readonly)
   - Convênio (readonly)
   - Cargo/Função
   - Data de Admissão
   - Salário Bruto

- Botões: "Voltar", "Salvar e Continuar Depois", "Avançar"

**Etapa 3: Documentos**
- Grid de cards de upload (2 ou 3 por linha)
- Cada card:
  - Ícone de documento no topo
  - Nome do documento (ex: "RG Frente")
  - Status: "Pendente" em amarelo ou "Anexado" em verde com nome do arquivo
  - Área de drag & drop ou botão "Escolher Arquivo"
  - Ícone de olho para visualizar (se anexado)
  - Ícone de lixeira para remover (se anexado)
- Documentos necessários:
  - RG Frente e Verso
  - CPF
  - Comprovante de Residência
  - Contracheque
  - Extrato Bancário
  - Foto Selfie
- Indicador no topo: "3 de 7 documentos anexados"
- Botões: "Voltar", "Salvar Progresso", "Avançar"

**Etapa 4: Reserva**
- Card principal com título "Realizar Reserva de Margem"
- Resumo da operação em destaque:
  - Valor Solicitado
  - Prazo
  - Valor da Parcela
  - Taxa
- Informações do servidor:
  - Nome, CPF, Matrícula, Convênio
- Status da reserva:
  - Botão "Solicitar Reserva" (se ainda não reservado)
  - Ou card verde com check mostrando "Reserva Realizada" + Protocolo + Data/Hora
  - Ou card vermelho mostrando "Reserva Falhou" + Motivo + Botão "Tentar Novamente"
- Loading state enquanto processa
- Botões: "Voltar", "Avançar" (desabilitado se reserva não concluída)

**Etapa 5: CCB**
- Card "Geração de CCB"
- Preview do documento CCB (iframe ou imagem)
- Informações finais:
  - Número da CCB
  - Data de Emissão
  - Valor Total Financiado
  - IOF
  - Valor Total a Pagar
- Checkbox "Confirmo que todos os dados estão corretos"
- Checkbox "Cliente ciente das condições do contrato"
- Botões: "Voltar", "Gerar CCB e Finalizar" (primário, grande)
- Após finalizar: mensagem de sucesso verde com número da proposta e botões "Nova Proposta" e "Ver Histórico"

**Funcionalidade Extra**:
- Botão "Buscar Proposta" no topo direito que abre modal com:
  - Campo de busca por CPF ou Número da Proposta
  - Tabela de resultados
  - Clicar em uma proposta abre no estado correto para continuar

---

### MÓDULO 3: MESA

**Layout**: Lista de propostas para análise

**Topo**:
- Título "Mesa de Análise"
- Filtros rápidos em tabs: "Todas", "Pendentes de Análise", "Em Análise por Mim", "Aguardando Correção"
- Barra de busca (CPF, nome, número da proposta)
- Botão "Filtros Avançados" que abre painel lateral

**Tabela de Propostas**:
Colunas:
- Checkbox (para seleção múltipla)
- Número da Proposta (link clicável)
- Data/Hora (entrada na mesa)
- Cliente (Nome + CPF embaixo)
- Convênio
- Valor Solicitado
- Prazo
- Status (badge colorido)
- Analista (se já pegou para analisar)
- Ações (botão "Analisar" primário ou "Ver Detalhes" se já em análise)

**Modal de Análise** (ao clicar em "Analisar"):
- Drawer lateral (640px)
- Header: "Análise de Proposta #[número]"
- Tabs internas:
  1. **Resumo**: Dados principais + simulação
  2. **Documentos**: Grid de documentos com visualizador
  3. **Histórico**: Timeline de eventos
- Área de observações (textarea grande)
- Checklist de verificações:
  - [ ] Documentos completos e legíveis
  - [ ] Margem disponível confirmada
  - [ ] Dados bancários validados
  - [ ] Score de crédito dentro da política
- Botões de ação no footer:
  - "Solicitar Correção" (abre modal para descrever o que corrigir) - amarelo
  - "Reprovar" (abre modal para justificativa) - vermelho
  - "Aprovar" (abre confirmação) - verde, destaque

---

### MÓDULO 4: CONVÊNIOS

**Layout**: Lista + Detalhes

**Página de Listagem**:
- Título "Gestão de Convênios"
- Botão "Cadastrar Convênio" (primário, topo direito)
- Barra de busca + filtros (Status: Ativo/Inativo, Tipo: Federal/Estadual/Municipal/Privado)
- Tabela com colunas:
  - Código
  - Nome do Convênio
  - CNPJ
  - Tipo
  - Status (badge)
  - Processadoras Vinculadas (lista ou contador)
  - Data de Cadastro
  - Ações (olho, lápis)

**Página de Detalhes/Edição**:
- Breadcrumb: Convênios > [Nome do Convênio]
- Header com:
  - Nome do Convênio (grande)
  - Badge de status
  - Botões: "Editar" / "Salvar" / "Cancelar" (muda conforme modo)
  - Botão "Voltar"
- Tabs horizontais:

**1. Informações do Convênio**
- Cards organizados em seções:
  - Identificação: Código, Nome, CNPJ, Razão Social
  - Classificação: Tipo, UF, Município
  - Contato: Site, Telefone, E-mail
  - Endereço: Logradouro completo
  - Observações: textarea
- Modo visualização: campos com fundo cinza claro, readonly
- Modo edição: campos normais editáveis

**2. Parametrizações**
- Dois blocos principais (cards lado a lado ou empilhados):

**Bloco A: Cartão de Compras**
- Toggle no topo: "Habilitar Cartão de Compras"
- Se habilitado, mostra:
  - **Categorias de Servidores Aceitas**:
    - Input + botão "Adicionar"
    - Tags removíveis embaixo (ex: "Estatutário" [x], "Aposentado" [x], "Pensionista" [x])
    - Tags com fundo azul claro e texto azul escuro
  - **Limites de Margem**:
    - Percentual Máximo (input com %)
    - Valor Mínimo e Máximo (inputs com R$)
    - Prazo Mínimo e Máximo (inputs com "meses")
  - **Taxas**:
    - Taxa de Juros Min/Max (% a.m.)
    - Taxa de Administração (%)
    - Comissão (%)
  - **Regras de Débito**:
    - Dia de Corte (select 1-31 ou "Último dia útil")
    - Dia de Repasse (select)
    - Dias de Compensação (input)
    - Toggle "Permite Débito Retroativo"

**Bloco B: Saque Fácil**
- Mesma estrutura do Cartão de Compras
- Tags com fundo verde claro e texto verde escuro

**Agenda de Corte**:
- Card separado
- Tabela com colunas: Data Início, Data Fim, Dia de Corte, Status, Ações
- Botão "Adicionar Data de Corte" abre modal com:
  - Date pickers para início e fim
  - Select para dia de corte
  - Validação visual de conflitos de período

**Arquivo de Débito**:
- Card separado
- Tabela com: Nome Arquivo, Layout, Data Upload, Ações (ver, baixar, excluir)
- Botão "Anexar Arquivo de Débito" abre modal com upload

**3. Contatos**
- Tabela de contatos
- Colunas: Nome, Cargo, Setor, Telefone, E-mail, Principal (badge), Ações
- Botão "Adicionar Contato" abre modal com formulário
- Modal de edição/criação:
  - Nome Completo (input)
  - Cargo, Setor (inputs)
  - Telefone Fixo, Celular (inputs com máscara)
  - E-mail (input com validação)
  - Checkbox "Contato Principal"
  - Observações (textarea)

**4. Roteiro Operacional**
- Lista/tabela de documentos anexados
- Cada item mostra:
  - Ícone de PDF
  - Título do Roteiro
  - Tipo (badge)
  - Versão
  - Data de Vigência
  - Data de Upload
  - Badge "Vigente" se for o atual
  - Ações: visualizar, baixar, editar info, excluir
- Botão "Anexar Roteiro" abre modal de upload com:
  - Título (input)
  - Tipo (select: Roteiro Completo, Procedimento, Manual, Outro)
  - Versão (input)
  - Data de Vigência (date picker)
  - Upload de arquivo (drag & drop)
  - Descrição (textarea)

**5. Decretos**
- Lista de decretos em cards ou tabela
- Cada item:
  - Número do Decreto (destaque)
  - Data de Publicação e Vigência
  - Órgão Emissor
  - Ementa (texto resumido)
  - Badge de Status (Vigente/Revogado/Suspenso)
  - Ícone de PDF (se anexado) + Link Externo (se houver)
  - Ações: ver, editar, baixar, excluir
- Botão "Cadastrar Decreto" abre modal com:
  - Número do Decreto
  - Datas (publicação e vigência)
  - Órgão Emissor
  - Ementa (textarea)
  - Upload de PDF
  - Link Externo (input URL)
  - Status (select)

**6. Logs de Alterações**
- Tabela somente leitura
- Colunas: Data/Hora, Usuário, Ação, Campo Alterado, Valor Anterior, Valor Novo
- Filtros: período, usuário, tipo de ação
- Botão "Exportar" (Excel)
- Paginação

---

### MÓDULO 5: PROCESSADORAS

**Layout**: Similar ao de Convênios

**Página de Listagem**:
- Título "Gestão de Processadoras"
- Botão "Cadastrar Processadora"
- Busca + filtros
- Tabela: Código, Nome, CNPJ, Tipo de Serviço, Status, Convênios Vinculados, Data Cadastro, Ações

**Página de Detalhes/Edição**:
- Breadcrumb: Processadoras > [Nome]
- Header similar ao de Convênios
- Tabs:

**1. Informações da Processadora**
- Similar a Informações do Convênio
- Campos específicos:
  - Tipo de Serviço (select: Processamento Folha, Gestão de Margem, Ambos)
  - Horário de Atendimento
  - SLA de Resposta (input com "horas")

**2. Convênios Vinculados**
- Tabela de convênios associados
- Colunas: Código, Nome, CNPJ, Status, Data Vinculação, Ações (desvincular)
- Botão "Vincular Convênio" abre modal com:
  - Campo de busca/select de convênio
  - Data de início do vínculo
  - Observações
- Ao desvincular: modal de confirmação solicitando motivo

**3. Configurações de Integração**
- **ATENÇÃO**: Esta aba contém dados sensíveis, use indicadores visuais de segurança

Card "Dados de Conexão":
- Tipo de Integração (select)
- URL Produção e Homologação (inputs)
- Porta (input)
- Protocolo (radio: HTTP/HTTPS)
- Método de Autenticação (select)

Card "Credenciais" (fundo levemente amarelado como aviso):
- Ícone de cadeado no topo
- Usuário/Client ID (input, mascarado como *****)
- Senha/Client Secret (input password, mascarado)
- API Key (input, mascarado)
- Token de Acesso (textarea, mascarado)
- Upload de Certificado Digital (se aplicável)
- Botão "Revelar" ao lado de cada campo (requer confirmação adicional)
- Aviso em texto pequeno: "Dados criptografados. Acesso registrado em log."

Card "Timeouts e Retry":
- Timeout de Conexão (input com "segundos")
- Timeout de Leitura (input com "segundos")
- Máx. Tentativas (input número)
- Intervalo entre Tentativas (input com "segundos")

Card "Formatos e Layouts":
- Formato Envio (select: JSON, XML, CSV)
- Formato Resposta (select)
- Layout Remessa (textarea ou upload)
- Layout Retorno (textarea ou upload)
- Upload Documentação Técnica (PDF)

**Teste de Conexão**:
- Botão grande "Testar Conexão" (azul, com ícone de sinal)
- Ao clicar: loading spinner
- Resultado em card:
  - Se sucesso: fundo verde claro, ícone de check, mensagem "Conexão estabelecida com sucesso", tempo de resposta
  - Se falha: fundo vermelho claro, ícone de X, mensagem de erro detalhada
- Histórico de testes embaixo (últimos 10): data/hora, status, tempo

**4. Contatos**
- Similar à aba de Contatos dos Convênios
- Campos adicionais:
  - Checkbox "Contato Técnico"
  - Checkbox "Contato Comercial"
  - Disponibilidade (select: Horário Comercial, 24x7, Sob Demanda)
- Filtro por tipo de contato

**5. Logs de Alterações**
- Idêntico aos Logs de Convênios

---

### MÓDULO 6: SERVIDORES

**Layout**: Lista + Drawer de detalhes

**Página de Listagem**:
- Título "Base de Servidores"
- Busca por CPF, nome, matrícula
- Filtros: Convênio, Status (Ativo/Inativo), Possui Operações Ativas
- Tabela:
  - CPF
  - Nome
  - Matrícula
  - Convênio
  - Margem Disponível (destaque em verde)
  - Operações Ativas (contador)
  - Status
  - Ações (olho para ver detalhes)

**Drawer de Detalhes** (lateral direita, 640px):
- Header: Nome do Servidor + Badge de Status
- Tabs internas:

**1. Dados Pessoais**
- Exibição em formato chave-valor:
  - CPF, RG, Órgão Emissor
  - Data de Nascimento, Sexo, Estado Civil
  - Nome da Mãe
  - E-mail, Celular
  - Endereço Completo
- Ícone de lápis para editar (abre modal)

**2. Dados do Convênio**
- Matrícula
- Convênio (link clicável)
- Cargo/Função
- Data de Admissão
- Salário Bruto
- Margem Disponível (valor grande em destaque)
- Margem Comprometida
- Margem Total
- Botão "Atualizar Margem" (busca na processadora)

**3. Operações Ativas**
- Lista de cartões de operações
- Cada cartão mostra:
  - Tipo (Cartão Compras ou Saque Fácil) com ícone
  - Número do Contrato
  - Valor Original
  - Saldo Devedor
  - Valor da Parcela
  - Parcelas Pagas / Total
  - Barra de progresso do pagamento
  - Data da Última Parcela
  - Botão "Ver Detalhes" (abre modal ou navegação)
- Se não houver operações: mensagem vazia "Nenhuma operação ativa"

**4. Planos (Cartão de Compras)**
- Lista de planos de cartão de compras
- Cada item:
  - Nome do Plano
  - Valor do Plano
  - Data de Adesão
  - Status (Ativo/Cancelado)
  - Ações (ver detalhes, cancelar)

**5. Benefício Saque (Saque Fácil)**
- Informações de saques disponíveis
- Lista de saques realizados (data, valor, status)

**6. Documentos**
- Grid de documentos anexados (mesmo estilo da etapa de documentos do cadastro)
- Possibilidade de anexar novos ou substituir

---

### MÓDULO 7: REPASSES

**Layout**: Tabela + Gráficos

**Topo**:
- Título "Gestão de Repasses"
- Filtros: Período (date range), Convênio, Processadora, Status
- Botão "Gerar Arquivo de Repasse"

**KPIs em Linha**:
- Total a Repassar (valor em azul)
- Repassado Este Mês (valor em verde)
- Pendente (valor em amarelo)
- Atrasado (valor em vermelho, se houver)

**Gráfico de Repasses**:
- Gráfico de barras agrupadas por mês
- Barras: Previsto vs. Realizado
- Cores: azul para previsto, verde para realizado

**Tabela de Repasses**:
- Colunas:
  - Data Prevista
  - Convênio
  - Processadora
  - Valor
  - Status (Pendente, Processando, Concluído, Atrasado)
  - Data Realização
  - Arquivo (link para download, se disponível)
  - Ações (ver detalhes, processar, baixar)
- Seleção múltipla para processar em lote

**Drawer de Detalhes de Repasse**:
- Informações do repasse
- Tabela de operações incluídas (servidor, contrato, parcela, valor)
- Botão "Confirmar Repasse" / "Marcar como Processado"

---

### MÓDULO 8: CONCILIAÇÃO

**Layout**: Painel de conciliação

**Topo**:
- Título "Conciliação Bancária"
- Filtros: Período, Banco, Status (Conciliado, Pendente, Com Divergência)
- Botão "Importar Extrato" (upload de OFX, CSV, etc.)

**3 Cards de Status**:
- Conciliados (verde): quantidade e valor
- Pendentes (amarelo): quantidade e valor
- Divergências (vermelho): quantidade e valor

**Abas**:

**1. Movimentos a Conciliar**
- Duas tabelas lado a lado (ou empilhadas):
  - **Lançamentos Internos** (do sistema)
  - **Lançamentos Bancários** (do extrato importado)
- Colunas: Data, Descrição, Valor, Status
- Função drag & drop ou checkbox para parear lançamentos
- Botão "Conciliar Selecionados"
- Lançamentos conciliados: fundo verde claro com ícone de check

**2. Conciliados**
- Tabela de lançamentos já conciliados
- Colunas: Data Conciliação, Data Lançamento, Descrição, Valor, Responsável, Ações (desfazer)

**3. Divergências**
- Tabela de divergências encontradas
- Colunas: Data, Descrição, Valor Sistema, Valor Banco, Diferença, Ações (investigar, ajustar)
- Cada linha clicável abre drawer com detalhes e opções de resolução

---

### MÓDULO 9: ANTECIPAÇÕES

**Layout**: Tabela + Forms

**Topo**:
- Título "Gestão de Antecipações e Quitações"
- Tabs: "Antecipações" | "Quitações"
- Botão "Novo Registro"

**Aba Antecipações**:
- Filtros: Período, Convênio, Status
- Tabela:
  - Data Solicitação
  - Servidor (Nome + CPF)
  - Matrícula
  - Contrato Original
  - Valor Antecipado
  - Desconto Aplicado (%)
  - Status (Solicitado, Aprovado, Processado, Recusado)
  - Ações (ver, aprovar, recusar, processar)

**Aba Quitações**:
- Estrutura similar
- Colunas adicionais: Valor Quitação, Saldo Devedor, Data Quitação

**Modal "Novo Registro de Antecipação"**:
- Busca de servidor (CPF ou nome)
- Após selecionar, mostra operações ativas
- Usuário seleciona operação
- Sistema calcula valor de antecipação com descontos
- Campos:
  - Tipo (Antecipação Parcial, Antecipação Total, Quitação)
  - Valor
  - Desconto (%)
  - Observações
- Botão "Registrar"

**Drawer de Detalhes**:
- Informações completas da antecipação/quitação
- Histórico de status
- Documentos anexados
- Botões de ação conforme status

---

### MÓDULO 10: UPLOAD

**Layout**: Área de upload + Tabela de arquivos

**Topo**:
- Título "Upload de Arquivos de Remessa/Retorno"
- Subtítulo explicativo: "Envie arquivos de margem, retorno de processadoras e outros layouts"

**Área de Upload** (card grande, destaque):
- Ícone de nuvem + seta para cima (grande, central)
- Texto: "Arraste arquivos aqui ou clique para selecionar"
- Tipos aceitos: .txt, .csv, .ret, .rem, .xml
- Tamanho máximo: 50MB
- Ao arrastar arquivo sobre a área: borda azul pulsante
- Durante upload: barra de progresso + percentual + nome do arquivo

**Seleção de Tipo de Arquivo** (antes ou depois do upload):
- Radio buttons ou select grande:
  - Arquivo de Margem (Consignável)
  - Arquivo de Retorno (Processadora)
  - Arquivo de Débito
  - Arquivo de Repasse
  - Outro
- Select de Convênio ou Processadora (dependendo do tipo)

**Tabela de Arquivos Enviados**:
- Colunas:
  - Data/Hora Upload
  - Nome do Arquivo
  - Tipo
  - Convênio/Processadora
  - Tamanho
  - Status (Processando, Processado, Erro)
  - Registros Processados / Total
  - Ações (ver log, baixar, reprocessar, excluir)
- Filtros: Período, Tipo, Status

**Card de "Convênios com Upload Pendente"** (embaixo ou lateral):
- Lista de convênios
- Cada item mostra:
  - Nome do Convênio
  - Expectativa de próximo upload (data)
  - Status: "Dentro do prazo" (verde) ou "Atrasado" (vermelho)
  - Botão "Upload Rápido" (abre modal direto)

---

## PADRÕES DE INTERAÇÃO

### Estados dos Componentes

**Loading**:
- Spinner circular azul (24px)
- Ou skeleton screens para tabelas/cards (blocos cinzas animados)
- Texto "Carregando..." embaixo

**Vazio**:
- Ícone grande cinza (48px) relacionado ao contexto
- Título: "Nenhum [item] encontrado"
- Subtexto: sugestão de ação
- Botão de ação primária (ex: "Cadastrar Primeiro Convênio")

**Erro**:
- Card ou toast com fundo vermelho claro
- Ícone de alerta
- Mensagem de erro clara
- Botão "Tentar Novamente" ou "Reportar Problema"

**Sucesso**:
- Toast no canto superior direito
- Fundo verde, texto branco
- Ícone de check
- Auto-dismiss após 5 segundos
- Ou permanece se houver ações (botões)

### Tooltips
- Fundo cinza escuro (#1F2937)
- Texto branco, 12px
- Padding: 6px 10px
- Border radius: 6px
- Seta apontando para o elemento
- Aparecem ao hover após 500ms

### Confirmações
- Modal pequeno (max-width 400px)
- Ícone de alerta ou interrogação no topo
- Título em bold: "Confirmar [ação]?"
- Texto explicativo
- Dois botões: "Cancelar" (secundário) e "Confirmar" (primário ou perigo)

### Paginação
- No rodapé das tabelas
- Info: "Mostrando 1-25 de 142 registros"
- Botões: "Anterior", números de página (1, 2, 3, ..., 10), "Próximo"
- Página atual: fundo azul, texto branco
- Outras páginas: fundo branco, hover cinza claro

### Ordenação de Tabelas
- Ícone de setas duplas ao lado do título da coluna
- Ao clicar: alterna entre ascendente (↑), descendente (↓), sem ordenação
- Coluna ordenada: ícone destacado em azul

### Busca com Autocomplete
- Resultados aparecem em dropdown abaixo do input
- Cada resultado clicável
- Hover: fundo cinza claro
- Destaque do termo buscado em negrito
- "Nenhum resultado encontrado" se vazio

---

## RESPONSIVIDADE (TABLET)

**Breakpoint**: 768px - 1024px

**Ajustes**:
- Navegação principal: tabs podem scroll horizontal se não couberem
- Grids de 3 colunas viram 2 colunas
- Grids de 2 colunas viram 1 coluna
- Formulários de 2 colunas viram 1 coluna
- Drawers laterais ocupam 80% da largura (não fixo 640px)
- Tabelas: scroll horizontal, ou versão simplificada (menos colunas)
- KPI Cards: 2 por linha ao invés de 4
- Padding reduzido nas laterais (16px ao invés de 24px)

---

## ACESSIBILIDADE

- Contraste mínimo de 4.5:1 para textos normais
- Contraste mínimo de 3:1 para textos grandes e ícones
- Foco visível: outline azul 2px em todos os elementos interativos
- Labels descritivos em todos os inputs
- Mensagens de erro associadas aos campos (aria-describedby)
- Ícones com alternativa textual
- Navegação por teclado fluida (tab order lógico)
- Modais e drawers trapam o foco (não permite tab para fora)
- Botões de fechar sempre visíveis e acessíveis

---

## ÍCONES SUGERIDOS

Use biblioteca Lucide, Heroicons, ou similar. Exemplos:

- **Dashboard**: BarChart3, TrendingUp, PieChart
- **Cadastro**: FileText, UserPlus, ClipboardList
- **Mesa**: Briefcase, CheckSquare, FileSearch
- **Convênios**: Building2, FileContract, Landmark
- **Processadoras**: Server, Database, Plug
- **Servidores**: Users, User, UserCheck
- **Repasses**: ArrowRightCircle, DollarSign, Send
- **Conciliação**: Calculator, CheckCircle2, AlertTriangle
- **Antecipações**: FastForward, Zap, Clock
- **Upload**: Upload, Cloud, FileUp
- **Ações Gerais**: Eye (ver), Pencil (editar), Trash2 (excluir), Download, X (fechar), Plus (adicionar), Filter, Search, Settings, ChevronDown, ChevronUp, ChevronRight, ChevronLeft, MoreVertical (menu 3 pontos)

---

## OBSERVAÇÕES FINAIS

1. **Consistência é fundamental**: Use os mesmos componentes, espaçamentos, cores e tipografia em todo o sistema.

2. **Hierarquia visual**: Destaque as informações mais importantes. Use tamanho, cor e peso da fonte estrategicamente.

3. **Feedback imediato**: Todo clique, hover, input deve ter resposta visual instantânea.

4. **Proteção contra erros**: Confirmações para ações destrutivas, validações claras, mensagens úteis.

5. **Estados visuais**: Sempre considere os estados: normal, hover, ativo, foco, desabilitado, loading, erro, sucesso, vazio.

6. **Dados reais**: Use dados realistas nos protótipos (nomes brasileiros, CPFs fictícios mas formatados, valores monetários, datas)

7. **Fluxos completos**: Mostre não só as telas, mas as transições entre elas (modais abrindo, drawers deslizando, etc.)

8. **Componentes reutilizáveis**: Crie um sistema de componentes no Figma para manter consistência.

9. **Anotações**: Adicione notes nos frames explicando comportamentos dinâmicos (ex: "Este botão só aparece se status = Pendente")

10. **Mobile**: Se houver tempo, considere versões mobile dos módulos principais (Dashboard, Cadastro básico, Mesa).

---

## ENTREGÁVEL ESPERADO

Por favor, crie no Figma:

1. **Página de Componentes**: Todos os componentes base documentados (botões, inputs, cards, badges, etc.)

2. **10 Módulos Completos**: Cada módulo com suas telas principais e fluxos

3. **Protótipo Interativo**: Navegação funcional entre telas principais

4. **Documentação**: Notes explicando padrões de uso e comportamentos

5. **Variações de Estado**: Mostrar estados de loading, erro, vazio, sucesso onde aplicável

Obrigado!