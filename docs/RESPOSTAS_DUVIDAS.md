# 💬 Respostas às Dúvidas sobre o Plano

Este documento responde às questões levantadas sobre o plano de desenvolvimento.

---

## 1. 📋 Modelos Pydantic são opcionais?

### Resposta: ✅ SIM, são opcionais!

**O que é Pydantic?**
- Biblioteca Python para validação de dados
- Cria "schemas" (modelos) que validam automaticamente entrada/saída
- Útil para APIs grandes, mas adiciona complexidade

**Para MVP:**
- Podemos usar `dict` diretamente
- FastAPI já valida tipos básicos (int, str, etc)
- Validação manual quando necessário

**Exemplo:**

```python
# COM Pydantic (mais complexo)
from pydantic import BaseModel

class EventResponse(BaseModel):
    id: str
    name: str
    date: str

# SEM Pydantic (mais simples)
def get_event(event_id: str) -> dict:
    return {
        "id": event_id,
        "name": "Maratona",
        "date": "2024-04-07"
    }
```

**Decisão:** ❌ Remover `models/` do plano. Usar `dict` diretamente.

---

## 2. 🤔 Por que dividir em `metrics` e `events`?

### Resposta: Podemos simplificar!

**Ideia original:**
- `events.py` → Endpoints sobre eventos (GET /events, GET /events/{id})
- `metrics.py` → Endpoints sobre métricas (GET /metrics/dashboard, GET /events/{id}/brands)

**Problema:** Para MVP, isso adiciona complexidade desnecessária.

**Solução simplificada:**
- ✅ **Tudo em `events.py`** (mais simples para começar)
- Podemos separar depois se necessário

**Estrutura:**

```
app/api/
└── events.py          # TODAS as rotas aqui
    ├── GET /api/events
    ├── GET /api/events/{id}
    ├── GET /api/events/{id}/brands
    ├── GET /api/events/{id}/products
    └── GET /api/metrics/dashboard
```

**Decisão:** ✅ Tudo em `events.py` por enquanto.

---

## 3. 📁 Repositório "cheio" de arquivos?

### Resposta: É normal, mas vamos organizar!

**Arquivos que você vê no `front-end/`:**

| Arquivo | O que é? | Necessário? |
|---------|----------|-------------|
| `bun.lockb` | Lock file do Bun | ✅ Sim (mas pode ignorar no git) |
| `package-lock.json` | Lock file do npm | ✅ Sim (mas pode ignorar no git) |
| `components.json` | Config do shadcn/ui | ✅ Sim |
| `eslint.config.js` | Config do ESLint | ✅ Sim |
| `tailwind.config.ts` | Config do Tailwind | ✅ Sim |
| `tsconfig.*.json` | Configs TypeScript | ✅ Sim |
| `vite.config.ts` | Config do Vite | ✅ Sim |
| `node_modules/` | Dependências | ✅ Sim (mas já no .gitignore) |

**São arquivos normais de um projeto React/Vite moderno!**

**O que fazer:**
1. ✅ Atualizar `.gitignore` para ignorar lock files (já feito)
2. ✅ Documentar quais arquivos são necessários
3. ❌ Não precisa mover nada (está organizado assim por padrão)

**Decisão:** ✅ Manter como está. Apenas garantir `.gitignore` completo.

---

## 4. 🔢 Versionamento `v1/` é necessário?

### Resposta: ❌ NÃO para MVP!

**O que é versionamento de API?**
- `v1/`, `v2/` → Múltiplas versões da API rodando simultaneamente
- Útil quando você tem clientes usando versões antigas
- Adiciona complexidade

**Para MVP:**
- Não precisamos de múltiplas versões
- Podemos ter rotas diretas: `app/api/events.py`
- Se precisar versionar depois, é fácil adicionar

**Estrutura:**

```
# ANTES (com v1/)
app/api/v1/events.py
→ GET /api/v1/events

# DEPOIS (simples)
app/api/events.py
→ GET /api/events
```

**Decisão:** ❌ Remover `v1/`. Rotas diretas em `api/events.py`.

---

## 📊 Comparação: Original vs Simplificado

| Aspecto | Original | Simplificado | Motivo |
|---------|----------|--------------|--------|
| **Pydantic** | ✅ Sim | ❌ Não | MVP não precisa validação complexa |
| **Versionamento** | ✅ v1/ | ❌ Direto | Não temos múltiplas versões |
| **Separação** | events + metrics | ✅ Tudo em events | Mais simples para começar |
| **Core** | ✅ Obrigatório | ✅ Opcional | Útil mas não obrigatório |
| **Tasks** | 24 tasks | 16 tasks | Menos complexidade |

---

## ✅ Estrutura Final Simplificada

### Backend

```
app/
├── main.py
├── config.py
├── api/
│   ├── deps.py          # Injeção de dependências (opcional)
│   └── events.py        # TODAS as rotas aqui
├── core/
│   └── events.py        # Lógica de negócio (opcional mas útil)
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

**Arquivos de config na raiz do `front-end/`:** ✅ Normais e necessários. Não mover.

---

## 🎯 Próximos Passos

1. ✅ Aprovar versão simplificada
2. ✅ Começar Task 1: Simplificar estrutura de pastas
3. ✅ Desenvolver incrementalmente

---

**Última atualização:** 2025-01-XX

