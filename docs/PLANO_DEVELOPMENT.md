# 🚀 Plano de Desenvolvimento - MVP Event Brand Report

Este documento detalha o plano de desenvolvimento incremental do MVP, seguindo boas práticas de engenharia de software, clean architecture e desenvolvimento modular.

## 📋 Princípios de Desenvolvimento

1. **Clean Architecture**: Separação clara de responsabilidades (API → Core → Services)
2. **Modularidade**: Código organizado em módulos coesos e desacoplados
3. **Testabilidade**: Estrutura que facilita testes unitários e de integração
4. **Incremental**: Desenvolvimento em pequenos incrementos com commits frequentes
5. **Simplicidade**: Complexidade baixa a média, adequada para MVP/POC

---

## 🏗️ Melhorias Propostas na Estrutura

### Backend (`app/`)

**Estrutura Atual vs. Proposta:**

```
app/
├── api/
│   ├── deps.py          # ✨ NOVO: Injeção de dependências
│   └── v1/
│       ├── events.py    # ✨ NOVO: Rotas de eventos
│       ├── metrics.py   # ✨ NOVO: Rotas de métricas
│       └── reports.py    # ✨ NOVO: Rotas de relatórios (futuro)
├── core/                # ✨ MELHORAR: Lógica de negócio pura
│   ├── events.py        # ✨ NOVO: Use cases de eventos
│   └── metrics.py       # ✨ NOVO: Cálculo de métricas
├── models/              # ✨ MELHORAR: Schemas Pydantic
│   ├── event.py         # ✨ NOVO: Schemas de eventos
│   ├── metrics.py       # ✨ NOVO: Schemas de métricas
│   └── common.py        # ✨ NOVO: Schemas comuns (pagination, etc)
└── services/
    └── database.py      # ✅ JÁ EXISTE: Melhorar métodos
```

### Frontend (`front-end/src/`)

**Estrutura Proposta:**

```
src/
├── services/            # ✨ NOVO: Camada de serviços
│   └── api/
│       ├── client.ts   # Cliente HTTP configurado
│       ├── events.ts   # API de eventos
│       └── metrics.ts  # API de métricas
├── types/              # ✨ NOVO: TypeScript types/interfaces
│   └── api.ts          # Types alinhados com backend
├── hooks/              # ✅ EXISTE: Expandir
│   ├── useEvents.ts   # ✨ NOVO: Hook para eventos
│   └── useMetrics.ts   # ✨ NOVO: Hook para métricas
└── components/         # ✅ EXISTE: Manter estrutura
```

---

## 📝 Tasks Organizadas por Fase

### **FASE 1: Estrutura e Modelos (Tasks 1-2)**

**Objetivo:** Organizar estrutura de pastas e criar modelos de dados.

- ✅ **Task 1**: Refatorar estrutura de pastas do backend
- ✅ **Task 2**: Criar modelos Pydantic (schemas)

**Entregáveis:**
- Estrutura de pastas organizada
- Schemas Pydantic completos e validados

---

### **FASE 2: Lógica de Negócio (Tasks 3-5)**

**Objetivo:** Implementar lógica de negócio pura (sem dependências de API).

- ✅ **Task 3**: Implementar `app/api/deps.py` (injeção de dependências)
- ✅ **Task 4**: Criar `app/core/events.py` (lógica de eventos)
- ✅ **Task 5**: Criar `app/core/metrics.py` (cálculo de métricas)

**Entregáveis:**
- Lógica de negócio testável e isolada
- Dependências injetadas corretamente

---

### **FASE 3: API Endpoints (Tasks 6-10)**

**Objetivo:** Criar endpoints REST para o frontend consumir.

- ✅ **Task 6**: `GET /api/v1/events` (listar eventos)
- ✅ **Task 7**: `GET /api/v1/events/{event_id}` (detalhes)
- ✅ **Task 8**: `GET /api/v1/events/{event_id}/brands` (marcas)
- ✅ **Task 9**: `GET /api/v1/events/{event_id}/products` (produtos)
- ✅ **Task 10**: `GET /api/v1/metrics/dashboard` (KPIs)

**Entregáveis:**
- API REST completa e documentada
- Endpoints testados manualmente

---

### **FASE 4: Integração Frontend (Tasks 11-17)**

**Objetivo:** Organizar frontend e criar camada de integração com backend.

- ✅ **Task 11**: Refatorar estrutura de pastas do frontend
- ✅ **Task 12**: Criar `src/types/api.ts` (TypeScript types)
- ✅ **Task 13**: Criar `src/services/api/client.ts` (cliente HTTP)
- ✅ **Task 14**: Criar `src/services/api/events.ts` (API de eventos)
- ✅ **Task 15**: Criar `src/services/api/metrics.ts` (API de métricas)
- ✅ **Task 16**: Criar `src/hooks/useEvents.ts` (React Query)
- ✅ **Task 17**: Criar `src/hooks/useMetrics.ts` (React Query)

**Entregáveis:**
- Estrutura modular do frontend
- Camada de API configurada
- Hooks React Query prontos

---

### **FASE 5: Substituição de Mocks (Tasks 18-21)**

**Objetivo:** Substituir dados mockados por chamadas reais à API.

- ✅ **Task 18**: Integrar Index.tsx com API real
- ✅ **Task 19**: Integrar Events.tsx com API real
- ✅ **Task 20**: Integrar Brands.tsx (ajustar marcas permitidas)
- ✅ **Task 21**: Adicionar tratamento de erros e loading states

**Entregáveis:**
- Frontend totalmente integrado com backend
- UX com loading e tratamento de erros

---

### **FASE 6: Testes e Documentação (Tasks 22-24)**

**Objetivo:** Garantir qualidade e documentação.

- ✅ **Task 22**: Testes unitários básicos
- ✅ **Task 23**: Testes de integração básicos
- ✅ **Task 24**: Documentação completa

**Entregáveis:**
- Cobertura de testes básica
- Documentação atualizada

---

## 🎯 Ordem de Execução Recomendada

1. **Fase 1** → Fundação (estrutura e modelos)
2. **Fase 2** → Lógica de negócio (testável)
3. **Fase 3** → API (endpoints REST)
4. **Fase 4** → Frontend (estrutura e integração)
5. **Fase 5** → Integração completa
6. **Fase 6** → Qualidade e documentação

---

## 📦 Commits Incrementais

Cada task deve ser commitada individualmente ou em pequenos grupos lógicos:

```
feat: criar estrutura de pastas e modelos Pydantic
feat: implementar lógica de negócio para eventos
feat: adicionar endpoint GET /api/v1/events
feat: criar camada de serviços no frontend
feat: integrar dashboard com API real
test: adicionar testes unitários para core/events
docs: atualizar README com instruções de API
```

---

## 🔍 Critérios de Qualidade

Cada task deve atender:

- ✅ Código limpo e legível
- ✅ Separação de responsabilidades
- ✅ Tratamento de erros adequado
- ✅ Type hints / TypeScript types
- ✅ Docstrings / comentários quando necessário
- ✅ Sem código duplicado
- ✅ Testável (estrutura permite testes)

---

## 🚦 Próximos Passos

1. Revisar este plano
2. Começar pela **Fase 1 - Task 1**
3. Desenvolver incrementalmente
4. Commitar após cada task concluída
5. Testar manualmente antes de prosseguir

---

**Última atualização:** 2025-01-XX  
**Status:** Em desenvolvimento

