# 🧠 CONTEXTO E DIRETRIZES — MIDIAZ B2B

> **Este documento é destinado ao Cursor AI e desenvolvedores.**  
> Ele estabelece o contexto do projeto, boas práticas e diretrizes que devem ser seguidas durante o desenvolvimento.

---

## 📍 Visão Geral do Projeto

A **Midiaz B2B** é uma solução analítica que transforma fotos de eventos esportivos em insights sobre presença de marca usando IA generativa (LLM) e visão computacional. Este é um projeto acadêmico da disciplina **IF1006 - Transformação Digital com IA (CIn/UFPE)**.

**Objetivo Principal:** Construir o núcleo de inteligência de dados que permite à Midiaz atuar como infraestrutura de insights visuais para o setor esportivo, transformando imagens em dados estruturados e insights acionáveis para marcas esportivas.

---

## 🏗️ Arquitetura e Stack

### Stack Atual
- **Backend**: FastAPI (Python) - API REST com arquitetura em camadas
- **Frontend**: React + TypeScript + Vite - Dashboard interativo
- **Banco de Dados**: PostgreSQL (Supabase) - Dados estruturados
- **IA/LLM**: OpenAI API (planejado para relatórios)
- **Visão Computacional**: Planejado (AWS Rekognition ou OpenAI Vision)

### Estrutura de Código
```
app/                    # Backend FastAPI
├── api/               # Rotas HTTP (controllers)
├── core/              # Lógica de negócio (use cases)
├── services/          # Serviços externos (database, OpenAI, etc)
├── config.py          # Configurações centralizadas
└── main.py            # Entry point

front-end/             # Frontend React
├── src/
│   ├── components/   # Componentes React reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── services/     # Clientes de API
│   └── hooks/         # React Hooks customizados
```

---

## ✅ Boas Práticas e Diretrizes

### 1. Arquitetura e Organização
- **Separação de Responsabilidades**: Manter camadas bem definidas (API → Core → Services)
- **Clean Architecture**: Lógica de negócio independente de frameworks
- **Dependency Injection**: Usar `deps.py` para injeção de dependências
- **Modularidade**: Cada módulo deve ter responsabilidade única e clara

### 2. Código e Qualidade
- **Clean Code**: Código legível, bem nomeado e documentado
- **SOLID**: Aplicar princípios SOLID, especialmente Single Responsibility
- **Type Hints**: Usar type hints em Python e TypeScript estrito
- **Docstrings**: Documentar funções e classes com docstrings claras
- **Error Handling**: Tratar erros adequadamente, não silenciar exceções

### 3. Banco de Dados
- **Schema**: O schema está definido em `docs/context/database_schema_and_seed.sql`
- **Estrutura Atual**:
  - `events`: Eventos esportivos (event_type: 'prova' ou 'treino', sport: 'corrida', 'triathlon', 'ciclismo', 'vôlei', 'futebol')
  - `event_persons`: Pessoas por evento (1 registro por pessoa por evento)
  - `person_items`: Itens detectados associados a pessoas (marca, produto)
  - Views materializadas: `brand_event_summary`, `product_event_summary`
- **Queries**: Usar Supabase Python Client (API REST), não conexão direta PostgreSQL
- **Validação**: Validar dados antes de inserir no banco

### 4. API e Endpoints
- **FastAPI**: Usar decoradores, Pydantic para validação, documentação automática
- **Versionamento**: Preparado para v1/ (atualmente sem prefixo de versão)
- **Error Responses**: Retornar erros HTTP apropriados com mensagens claras
- **Documentação**: Manter docstrings nos endpoints para Swagger

### 5. Frontend
- **React Query**: Usar para gerenciamento de estado e cache de dados da API
- **Componentes**: Componentes reutilizáveis em `components/`, específicos em `components/dashboard/`
- **TypeScript**: Tipos bem definidos, evitar `any`
- **UI**: Usar shadcn/ui para componentes, Tailwind CSS para estilização

### 6. Testes e Qualidade
- **Testes Unitários**: Testar lógica de negócio isoladamente
- **Testes de Integração**: Testar integração com banco e APIs externas
- **Cobertura**: Buscar cobertura mínima de 60% nos módulos principais

### 7. Versionamento
- **Commits Semânticos**: Usar convenção de commits (feat:, fix:, docs:, etc)
- **Branches**: Usar branches para features, manter main estável
- **PRs**: Revisar código antes de merge

### 8. Documentação
- **README.md**: Manter atualizado com instruções de setup e uso
- **CONTEXT.md**: Este arquivo - não modificar sem necessidade
- **Código**: Comentários apenas quando necessário, código auto-explicativo preferível

### 9. Scripts e Utilitários
- **Scripts Temporários**: Scripts criados para testes pontuais e específicos que não serão reutilizados **DEVEM ser excluídos após seu uso**
- **Scripts Permanentes**: Apenas scripts que serão usados regularmente devem ser mantidos (ex: scripts de deploy, migração, etc)
- **Pasta scripts/**: Manter limpa, remover scripts obsoletos periodicamente

---

## 🚫 O Que NÃO Fazer

1. **NÃO criar novos arquivos .md** sem necessidade explícita
2. **NÃO modificar a estrutura de pastas** sem consultar
3. **NÃO hardcodar credenciais** - sempre usar variáveis de ambiente
4. **NÃO ignorar tratamento de erros** - sempre tratar exceções
5. **NÃO criar dependências circulares** entre módulos
6. **NÃO misturar lógica de negócio com código de infraestrutura**
7. **NÃO fazer queries SQL diretas** - usar Supabase Client
8. **NÃO criar código sem propósito claro** - sempre questionar necessidade
9. **NÃO deixar scripts temporários no repositório** - remover após uso

---

## 🎯 Estado Atual do Projeto

### ✅ Implementado
- Banco de dados configurado (30 eventos, 5.783 pessoas, 13.792 itens)
- API FastAPI com endpoints funcionais (eventos, marcas, produtos, métricas)
- Frontend React com dashboard básico
- Integração backend-frontend via React Query

### 🔨 Em Desenvolvimento
- Geração de relatórios com LLM (design de prompt já definido)
- Integração de dados temporais no BrandChart (atualmente usa mock)

### 📋 Planejado
- Processamento de imagens com visão computacional
- Pipeline completo de detecção de marcas e produtos
- Páginas pendentes: Reports (parcial), Data, Settings, Api

---

## 🔍 Quando em Dúvida

1. **Arquitetura**: Consultar `docs/context/event_brand_report_technical_plan.md` (se ainda existir)
2. **Schema do Banco**: Consultar `docs/context/database_schema_and_seed.sql`
3. **Decisões Técnicas**: Preferir soluções simples e testáveis
4. **Novas Features**: Sempre questionar se é necessário no MVP
5. **Dúvidas**: Perguntar antes de implementar mudanças grandes

---

## 📝 Metodologia Sinfonia

O projeto segue a metodologia **Sinfonia** (IF1006):
- **Imersão**: ✅ Completa (Canvas de domínio definido)
- **Ideação**: ✅ Completa (Solução priorizada, design de prompts)
- **Produção**: 🔨 Em andamento (desenvolvimento incremental)
- **Validação**: 📋 Planejada

---

## 🎓 Contexto Acadêmico

- **Disciplina**: IF1006 - Transformação Digital com IA
- **Instituição**: CIn/UFPE
- **Equipe**: Matheus Augusto (Líder Técnico), Luís Felipe Pascoal (Cientista de Dados), Rafaela Leão (Designer de Produto)
- **Objetivo**: Protótipo funcional hospedado com documentação completa

---

> **Lembre-se**: Este é um projeto acadêmico focado em aprendizado e boas práticas. Priorize código limpo, bem documentado e testável sobre complexidade desnecessária.

