# 🏗️ Melhorias Propostas na Estrutura do Projeto

Este documento detalha as melhorias propostas na estrutura de pastas para seguir clean architecture e boas práticas de engenharia de software.

---

## 📁 Backend (`app/`)

### Estrutura Atual

```
app/
├── api/
│   └── v1/
│       └── __init__.py
├── core/
│   └── __init__.py
├── models/
│   └── __init__.py
├── services/
│   └── database.py
└── utils/
    └── __init__.py
```

### Estrutura Proposta (Clean Architecture)

```
app/
├── __init__.py
├── main.py                    # ✅ JÁ EXISTE
├── config.py                   # ✅ JÁ EXISTE
│
├── api/                        # 🌐 Camada de API (Controllers)
│   ├── __init__.py
│   ├── deps.py                # ✨ NOVO: Injeção de dependências
│   └── v1/
│       ├── __init__.py
│       ├── events.py          # ✨ NOVO: Rotas de eventos
│       ├── metrics.py         # ✨ NOVO: Rotas de métricas
│       └── reports.py          # ✨ NOVO: Rotas de relatórios (futuro)
│
├── core/                       # 🧠 Lógica de Negócio (Use Cases)
│   ├── __init__.py
│   ├── events.py              # ✨ NOVO: Lógica de eventos
│   └── metrics.py             # ✨ NOVO: Cálculo de métricas
│
├── models/                     # 📋 Schemas Pydantic (DTOs)
│   ├── __init__.py
│   ├── event.py               # ✨ NOVO: Schemas de eventos
│   ├── metrics.py             # ✨ NOVO: Schemas de métricas
│   └── common.py              # ✨ NOVO: Schemas comuns (pagination, etc)
│
├── services/                   # 🔌 Serviços Externos
│   ├── __init__.py
│   ├── database.py            # ✅ JÁ EXISTE: Melhorar
│   └── openai.py              # 🔮 FUTURO: Cliente OpenAI
│
└── utils/                      # 🛠️ Utilitários
    ├── __init__.py
    └── helpers.py              # ✨ NOVO: Funções auxiliares
```

### Explicação das Camadas

#### `api/` - Camada de API (Controllers)
- **Responsabilidade**: Receber requisições HTTP, validar entrada, chamar lógica de negócio, retornar respostas
- **Não deve conter**: Lógica de negócio, acesso direto ao banco
- **Exemplo**: `GET /api/v1/events` → valida parâmetros → chama `core.events.list_events()` → retorna resposta

#### `core/` - Lógica de Negócio (Use Cases)
- **Responsabilidade**: Implementar regras de negócio, orquestrar serviços
- **Não deve conter**: Detalhes de HTTP, acesso direto ao banco
- **Exemplo**: `core.events.list_events()` → usa `DatabaseService` → aplica filtros → retorna dados

#### `models/` - Schemas Pydantic (DTOs)
- **Responsabilidade**: Definir estruturas de dados, validação de entrada/saída
- **Exemplo**: `EventResponse`, `EventListResponse`, `PaginationParams`

#### `services/` - Serviços Externos
- **Responsabilidade**: Abstrair integrações externas (Supabase, OpenAI, etc)
- **Exemplo**: `DatabaseService` encapsula todas as chamadas ao Supabase

---

## 📁 Frontend (`front-end/src/`)

### Estrutura Atual

```
src/
├── components/
│   ├── dashboard/
│   └── ui/
├── data/
│   └── mockData.ts
├── hooks/
├── lib/
├── pages/
└── App.tsx
```

### Estrutura Proposta (Modular)

```
src/
├── App.tsx                     # ✅ JÁ EXISTE
├── main.tsx                    # ✅ JÁ EXISTE
│
├── services/                   # 🔌 Camada de Serviços
│   └── api/
│       ├── client.ts          # ✨ NOVO: Cliente HTTP configurado
│       ├── events.ts          # ✨ NOVO: API de eventos
│       └── metrics.ts         # ✨ NOVO: API de métricas
│
├── types/                      # 📋 TypeScript Types/Interfaces
│   └── api.ts                 # ✨ NOVO: Types alinhados com backend
│
├── hooks/                      # 🎣 React Hooks
│   ├── use-mobile.tsx         # ✅ JÁ EXISTE
│   ├── use-toast.ts           # ✅ JÁ EXISTE
│   ├── useEvents.ts           # ✨ NOVO: Hook para eventos (React Query)
│   └── useMetrics.ts          # ✨ NOVO: Hook para métricas (React Query)
│
├── components/                 # 🧩 Componentes React
│   ├── dashboard/             # ✅ JÁ EXISTE
│   └── ui/                    # ✅ JÁ EXISTE
│
├── pages/                      # 📄 Páginas
│   └── ...                    # ✅ JÁ EXISTE
│
├── lib/                        # 🛠️ Utilitários
│   └── utils.ts               # ✅ JÁ EXISTE
│
└── data/                       # 🗑️ REMOVER DEPOIS
    └── mockData.ts            # Substituir por API real
```

### Explicação das Camadas

#### `services/api/` - Camada de API
- **Responsabilidade**: Fazer chamadas HTTP ao backend, transformar dados
- **Exemplo**: `getEvents()`, `getEventById(id)`, `getBrandSummary(eventId)`

#### `types/` - TypeScript Types
- **Responsabilidade**: Definir interfaces TypeScript alinhadas com schemas do backend
- **Exemplo**: `Event`, `EventPerson`, `BrandSummary`, `DashboardKPIs`

#### `hooks/` - React Hooks
- **Responsabilidade**: Gerenciar estado e side effects usando React Query
- **Exemplo**: `useEvents()` retorna `{ data, isLoading, error }`

---

## 🔄 Fluxo de Dados

### Backend

```
HTTP Request
    ↓
api/v1/events.py (rota)
    ↓
core/events.py (lógica de negócio)
    ↓
services/database.py (acesso ao banco)
    ↓
Supabase
```

### Frontend

```
Component (página)
    ↓
hooks/useEvents.ts (React Query)
    ↓
services/api/events.ts (chamada HTTP)
    ↓
Backend API
```

---

## ✅ Benefícios da Nova Estrutura

1. **Separação de Responsabilidades**: Cada camada tem uma responsabilidade clara
2. **Testabilidade**: Fácil testar cada camada isoladamente
3. **Manutenibilidade**: Fácil encontrar e modificar código
4. **Escalabilidade**: Fácil adicionar novas features sem quebrar código existente
5. **Reutilização**: Lógica de negócio pode ser reutilizada em diferentes contextos

---

## 🚀 Próximos Passos

1. Revisar esta proposta
2. Aprovar ou sugerir ajustes
3. Implementar incrementalmente (Task 1)
4. Commitar após cada melhoria

---

**Última atualização:** 2025-01-XX

