# 🚀 Plano de Desenvolvimento Simplificado - MVP Event Brand Report

Versão simplificada do plano, focada em simplicidade e praticidade para MVP/POC.

---

## 📋 Respostas às Dúvidas

### 1. **Modelos Pydantic são opcionais?**
✅ **SIM!** Para um MVP simples, podemos usar `dict` diretamente. Pydantic adiciona validação automática, mas para começar podemos validar manualmente ou usar validação básica do FastAPI. **Vamos simplificar e remover essa camada.**

### 2. **Por que dividir em `metrics` e `events`?**
A ideia era:
- **`events.py`**: Endpoints sobre eventos (listar, buscar por ID, etc)
- **`metrics.py`**: Endpoints sobre métricas/KPIs (dashboard, brand share, etc)

**Mas podemos simplificar!** Podemos:
- **Opção A**: Tudo em `events.py` (mais simples)
- **Opção B**: Renomear para algo mais claro como `routes.py` ou `api.py`

**Vamos com Opção A: tudo em `events.py` por enquanto.**

### 3. **Repositório "cheio" de arquivos?**
Os arquivos que você vê no `front-end/` são **normais** de um projeto React/Vite:
- `bun.lockb`, `package-lock.json` → lock files (dependências)
- `components.json`, `eslint.config.js`, `tailwind.config.ts` → configs
- `tsconfig.*.json` → configs TypeScript
- `node_modules/` → dependências (já no .gitignore)

**Mas podemos organizar melhor:**
- Mover configs para uma pasta `config/` (opcional)
- Garantir que `.gitignore` está completo
- Documentar quais arquivos são necessários

**Para MVP, está OK assim. Vamos apenas garantir que `.gitignore` está bom.**

### 4. **Versionamento `v1` é necessário?**
❌ **NÃO para MVP!** O `v1/` é útil quando você tem múltiplas versões da API rodando simultaneamente. Para MVP simples, podemos ter:
- `app/api/events.py` diretamente (sem `v1/`)

**Vamos simplificar e remover o `v1/`.**

---

## 🏗️ Estrutura Simplificada

### Backend (`app/`)

```
app/
├── __init__.py
├── main.py                    # ✅ JÁ EXISTE
├── config.py                  # ✅ JÁ EXISTE
│
├── api/                       # 🌐 Rotas HTTP (simples)
│   ├── __init__.py
│   ├── deps.py               # ✨ NOVO: Injeção de dependências (opcional, mas útil)
│   └── events.py             # ✨ NOVO: TODAS as rotas aqui (events + metrics)
│
├── core/                      # 🧠 Lógica de Negócio (opcional, mas recomendado)
│   ├── __init__.py
│   └── events.py             # ✨ NOVO: Lógica de eventos e métricas
│
├── services/                  # 🔌 Serviços Externos
│   ├── __init__.py
│   └── database.py           # ✅ JÁ EXISTE: Melhorar métodos
│
└── utils/                     # 🛠️ Utilitários (se necessário)
    └── __init__.py
```

**Simplificações:**
- ❌ Sem `models/` (Pydantic) - usar `dict` diretamente
- ❌ Sem `v1/` - rotas diretas em `api/events.py`
- ✅ `core/` opcional, mas recomendado para organizar lógica

### Frontend (`front-end/src/`)

```
src/
├── services/                  # 🔌 API calls
│   └── api/
│       ├── client.ts         # ✨ NOVO: Cliente HTTP
│       └── events.ts         # ✨ NOVO: Todas as chamadas de API
│
├── hooks/                     # 🎣 React Hooks
│   ├── useEvents.ts          # ✨ NOVO: Hook para eventos
│   └── useMetrics.ts         # ✨ NOVO: Hook para métricas (ou tudo em useEvents)
│
├── components/                # ✅ JÁ EXISTE
├── pages/                     # ✅ JÁ EXISTE
└── ...
```

**Nota:** Os arquivos de config na raiz do `front-end/` são normais e necessários. Não precisamos mover.

---

## 📝 Tasks Simplificadas (16 tasks)

### **FASE 1: Estrutura Básica (Tasks 1-2)**

- ✅ **Task 1**: Simplificar estrutura de pastas (remover `v1/`, criar `api/events.py`)
- ✅ **Task 2**: Melhorar `services/database.py` (adicionar métodos necessários)

### **FASE 2: Lógica de Negócio (Tasks 3-4)**

- ✅ **Task 3**: Criar `core/events.py` (lógica de eventos e métricas)
- ✅ **Task 4**: Criar `api/deps.py` (injeção de dependências - opcional mas útil)

### **FASE 3: API Endpoints (Tasks 5-9)**

- ✅ **Task 5**: `GET /api/events` (listar eventos)
- ✅ **Task 6**: `GET /api/events/{event_id}` (detalhes do evento)
- ✅ **Task 7**: `GET /api/events/{event_id}/brands` (marcas do evento)
- ✅ **Task 8**: `GET /api/events/{event_id}/products` (produtos do evento)
- ✅ **Task 9**: `GET /api/metrics/dashboard` (KPIs do dashboard)

### **FASE 4: Frontend - Estrutura (Tasks 10-12)**

- ✅ **Task 10**: Criar `src/services/api/client.ts` (cliente HTTP)
- ✅ **Task 11**: Criar `src/services/api/events.ts` (chamadas de API)
- ✅ **Task 12**: Criar `src/hooks/useEvents.ts` (React Query hook)

### **FASE 5: Integração (Tasks 13-15)**

- ✅ **Task 13**: Integrar `Index.tsx` com API real
- ✅ **Task 14**: Integrar `Events.tsx` com API real
- ✅ **Task 15**: Integrar `Brands.tsx` com API real (ajustar marcas)

### **FASE 6: Polimento (Task 16)**

- ✅ **Task 16**: Adicionar tratamento de erros e loading states

---

## 🎯 Diferenças da Versão Original

| Aspecto | Original | Simplificado |
|---------|----------|--------------|
| **Pydantic** | ✅ Sim (models/) | ❌ Não (usar dict) |
| **Versionamento** | ✅ v1/ | ❌ Direto em api/ |
| **Separação** | events.py + metrics.py | ✅ Tudo em events.py |
| **Core** | ✅ Obrigatório | ✅ Opcional mas recomendado |
| **Tasks** | 24 tasks | 16 tasks |

---

## 📦 Estrutura Final Proposta

### Backend

```
app/
├── main.py
├── config.py
├── api/
│   ├── deps.py          # Injeção de dependências
│   └── events.py        # TODAS as rotas aqui
├── core/
│   └── events.py        # Lógica de negócio
└── services/
    └── database.py      # Supabase client
```

### Frontend

```
front-end/src/
├── services/api/
│   ├── client.ts        # Cliente HTTP
│   └── events.ts        # Chamadas de API
├── hooks/
│   └── useEvents.ts     # React Query hook
└── ... (resto igual)
```

---

## ✅ Próximos Passos

1. Aprovar esta versão simplificada
2. Começar pela **Task 1**: Simplificar estrutura de pastas
3. Desenvolver incrementalmente

---

**Última atualização:** 2025-01-XX  
**Versão:** Simplificada para MVP

