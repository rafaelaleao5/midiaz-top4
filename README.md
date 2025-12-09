# 🏃 Midiaz B2B - Event Brand Report MVP

Solução analítica B2B que transforma fotos esportivas em insights sobre presença de marca usando IA generativa (LLM) e visão computacional.

**Disciplina:** IF1006 - Transformação Digital com IA (CIn/UFPE)  
**Equipe:** Matheus Augusto (Líder Técnico), Luís Felipe Pascoal (Cientista de Dados), Rafaela Leão (Designer de Produto)

---

## 📋 Sobre o Projeto

O **Event Brand Report** é o MVP do Midiaz B2B, um produto que:
- Processa fotos de eventos esportivos
- Detecta marcas e produtos nas fotos
- Gera relatórios analíticos com insights em linguagem natural
- Fornece métricas de share de marca, rankings e comparações

### Visão Geral

A **Midiaz** é uma startup que nasceu como marketplace de fotos profissionais em eventos esportivos (modelo B2C). Este projeto foca no **modelo B2B** — a camada de inteligência de dados e visão computacional que transforma imagens coletadas em informações estruturadas e insights acionáveis para marcas esportivas.

**Problema:** Marcas esportivas investem milhões em patrocínios sem ter dados confiáveis sobre presença real de seus produtos em eventos. Pesquisas declarativas são imprecisas e caras.

**Solução:** Automatizar a extração de dados visuais de eventos esportivos, transformando fotos em métricas objetivas de presença de marca, permitindo medição precisa de ROI de patrocínios e decisões baseadas em evidências visuais.

---

## 🚀 Quick Start

### 1. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL: `docs/context/database_schema_and_seed.sql`
3. Configure as credenciais no arquivo `.env`:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   ```

### 2. Instalar Dependências

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

### 3. Rodar o Backend

```bash
source venv/bin/activate
python -m app.main
# ou
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

O backend estará disponível em: `http://localhost:8000`  
Documentação da API: `http://localhost:8000/docs`

### 4. Rodar o Frontend

```bash
cd front-end
npm install
cp .env.example .env
# Editar .env: VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

O frontend estará disponível em: `http://localhost:8080`

---

## 📁 Estrutura do Projeto

```
midiaz-top4/
├── app/                     # Backend FastAPI
│   ├── api/                 # Rotas HTTP (controllers)
│   ├── core/                # Lógica de negócio (use cases)
│   ├── services/            # Serviços externos (database, etc)
│   ├── config.py            # Configurações centralizadas
│   └── main.py              # Entry point
├── front-end/               # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   └── hooks/           # React Hooks
│   └── package.json
├── docs/                    # Documentação
│   └── context/
│       ├── database_schema_and_seed.sql  # Schema do banco
│       └── arquivos_originais/           # Arquivos .docx e .pdf
├── tests/                   # Testes
├── CONTEXT.md               # Contexto e diretrizes para desenvolvimento
├── README.md                # Este arquivo
└── requirements.txt         # Dependências Python
```

---

## 🗄️ Banco de Dados

O banco está configurado no **Supabase** (PostgreSQL) e já vem populado com:
- **30 eventos** (14 provas + 16 treinos)
- **5.783 pessoas** cadastradas
- **13.792 itens** detectados (tênis, camisetas, shorts, óculos, bonés)
- **6 marcas**: Nike, Adidas, Mizuno, Track&Field, Asics, Olympikus
- **852 produtos específicos** identificados (ex: Nike Air Zoom Pegasus, Adidas Ultraboost 22)

### Estrutura do Schema

**Tabelas Principais:**
- `events`: Eventos esportivos
  - `event_type`: 'prova' ou 'treino'
  - `sport`: 'corrida', 'triathlon', 'ciclismo', 'vôlei', 'futebol'
- `event_persons`: Pessoas por evento (1 registro por pessoa por evento)
- `person_items`: Itens detectados associados a pessoas (marca, produto)
- `brand_event_summary`: View materializada com métricas de marcas por evento
- `product_event_summary`: View materializada com métricas de produtos por evento

O schema completo está em `docs/context/database_schema_and_seed.sql`.

---

## 🔧 Tecnologias

- **Backend**: FastAPI (Python) - API REST com arquitetura em camadas
- **Frontend**: React + TypeScript + Vite - Dashboard interativo
- **Banco de Dados**: PostgreSQL (Supabase) - Dados estruturados
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Charts**: Recharts
- **API Client**: Supabase Python Client (API REST)
- **LLM**: OpenAI API (planejado para geração de relatórios)
- **Validação**: Pydantic

---

## 📊 API Endpoints

### Eventos
- `GET /api/events` - Lista eventos com paginação
- `GET /api/events/{event_id}` - Detalhes de um evento
- `GET /api/events/{event_id}/brands` - Marcas do evento
- `GET /api/events/{event_id}/products` - Produtos do evento

### Métricas
- `GET /api/metrics/dashboard` - KPIs agregados para o dashboard

Documentação completa: `http://localhost:8000/docs`

---

## 🎯 Status do Projeto

### ✅ Implementado
1. Banco configurado no Supabase com dados de exemplo
2. API FastAPI básica implementada
3. Endpoints funcionais: eventos, marcas, produtos, métricas
4. Frontend React com dashboard interativo
5. Integração backend-frontend via React Query

### 🔨 Em Desenvolvimento
- Geração de relatórios com LLM (design de prompt já definido)
- Integração de dados temporais no BrandChart (atualmente usa mock)

### 📋 Planejado
- Processamento de imagens com visão computacional
- Pipeline completo de detecção de marcas e produtos
- Páginas pendentes: Reports (parcial), Data, Settings, Api

---

## 🧭 Metodologia Sinfonia

O projeto segue a metodologia **Sinfonia** (IF1006):

### 1. Imersão ✅
**Canvas de Identificação do Domínio:**
- **Key Partners**: Plataformas de fotografia esportiva, APIs de visão computacional
- **Value Propositions**: Métricas de presença de marca, otimização de patrocínios, relatórios automatizados
- **Customer Segments**: Marcas esportivas, organizadores de eventos, agências de marketing
- **Revenue Streams**: Licenciamento de dados (SaaS), assinaturas corporativas, projetos customizados

**Canvas de Objetivos:**
- **Objetivo SMART**: Aplicar IA generativa e visão computacional para transformar fotos esportivas em dados e gerar insights automatizados sobre presença de marca
- **Timeline**: Imersão/Ideação (Aula 12), Protótipo (Aula 20), Validação (Aula 26)

### 2. Ideação ✅
**Solução Priorizada:**
- Sistema de detecção de marcas e produtos esportivos usando LLM + Dashboard com métricas de presença de marca
- **Justificativa**: Alto impacto, base para produtos futuros, resultados tangíveis rapidamente

**Design de Prompt (LLM):**
- **Template**: Analista de marketing esportivo que gera relatório executivo
- **Entrada**: Evento, local, data, total de atletas/imagens, lista de marcas detectadas
- **Saída**: Relatório 100-200 palavras em linguagem natural, formal, com insight estratégico
- **Critérios**: Mencionar 3+ marcas, 2+ produtos, contextualizar evento, sem alucinações

### 3. Produção 🔨
- Desenvolvimento incremental com versionamento Git
- Arquitetura em camadas (API → Core → Services)
- Código modular e testável

### 4. Validação 📋
- Testes e análises de escalabilidade
- Reflexão ética sobre uso de dados visuais
- Registro de lições aprendidas

---

## 🏗️ Arquitetura

### Backend (FastAPI)
```
app/
├── api/          # Camada de API (rotas HTTP)
├── core/         # Lógica de negócio (use cases)
├── services/     # Serviços externos (Supabase, OpenAI)
└── config.py     # Configurações
```

**Princípios:**
- Separação de Responsabilidades
- Clean Architecture (camadas bem definidas)
- Dependency Injection (via deps.py)
- SOLID (especialmente Single Responsibility)

### Frontend (React)
```
front-end/src/
├── components/   # Componentes reutilizáveis
├── pages/        # Páginas da aplicação
├── services/     # Clientes de API
└── hooks/        # React Hooks customizados
```

**Stack:**
- React 18 + TypeScript
- React Query para estado e cache
- shadcn/ui para componentes
- Tailwind CSS para estilização

---

## 📝 Design de Prompt para Relatórios

O sistema usa LLM (OpenAI) para gerar relatórios em linguagem natural. O prompt foi projetado seguindo boas práticas:

**Template:**
```
Você é um analista de marketing esportivo da plataforma Midiaz.

Com base nas seguintes informações visuais, gere um relatório executivo sobre a presença de marca.

Dados:
- Evento: {nome_evento}
- Local: {local_evento}
- Data: {data_evento}
- Total de atletas identificados: {total_atletas}
- Total de imagens analisadas: {total_imagens}
- Marcas detectadas e frequência: {lista_marcas}

Instruções:
1. Resuma os principais destaques sobre a presença de marca.
2. Destaque a marca mais recorrente e o tipo de produto mais identificado.
3. Contextualize brevemente o tipo de evento esportivo.
4. A saída deve estar em linguagem natural, formal e voltada para gestores de marketing esportivo.
5. Finalize o relatório com um insight estratégico curto (1 frase).
```

**Critérios de Qualidade:**
- 100-200 palavras
- Mencionar 3+ marcas e 2+ produtos
- Contextualizar tipo de evento e data
- Incluir insight estratégico
- Texto claro, formal, sem jargões técnicos
- Sem alucinações (informações não presentes na entrada)

---

## 🧪 Testes

```bash
# Testes unitários
pytest tests/unit/

# Testes de integração
pytest tests/integration/

# Todos os testes
pytest
```

---

## 📚 Documentação Adicional

- **CONTEXT.md**: Contexto do projeto e diretrizes para desenvolvimento (destinado ao Cursor AI e desenvolvedores)
- **docs/context/database_schema_and_seed.sql**: Schema completo do banco de dados
- **docs/context/arquivos_originais/**: Arquivos originais do projeto (.docx, .pdf)

---

## 👥 Equipe

- **Matheus Augusto** - Líder Técnico / Engenheiro de Dados
- **Luís Felipe Pascoal** - Cientista de Dados / IA
- **Rafaela Leão** - Designer de Produto / UX Researcher

---

## 📝 Licença

Este projeto faz parte do trabalho acadêmico da disciplina IF1006 - Transformação Digital com IA (CIn/UFPE).

---

## 🔗 Links Úteis

- [Supabase](https://supabase.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Query](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com/)
