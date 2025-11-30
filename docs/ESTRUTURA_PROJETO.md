# 📁 Estrutura de Pastas - MVP

Estrutura proposta seguindo boas práticas de engenharia de software para o MVP do Event Brand Report.

## 🏗️ Estrutura Proposta

```
midiaz-top4/
├── README.md                    # Documentação principal
├── requirements.txt             # Dependências Python
├── .env                         # Variáveis de ambiente (não commitado)
├── .gitignore                   # Arquivos ignorados
│
├── app/                         # 🎯 Código da aplicação (FastAPI)
│   ├── __init__.py
│   ├── main.py                  # Entry point da aplicação
│   ├── config.py                # Configurações (env vars, settings)
│   │
│   ├── api/                     # Camada de API (rotas)
│   │   ├── __init__.py
│   │   ├── deps.py              # Dependências (Supabase client, etc)
│   │   └── v1/                  # Versão 1 da API
│   │       ├── __init__.py
│   │       ├── events.py        # Rotas de eventos
│   │       ├── reports.py       # Rotas de relatórios
│   │       └── metrics.py       # Rotas de métricas
│   │
│   ├── core/                    # Lógica de negócio (use cases)
│   │   ├── __init__.py
│   │   ├── events.py            # Lógica de eventos
│   │   ├── metrics.py           # Cálculo de métricas
│   │   └── reports.py           # Geração de relatórios
│   │
│   ├── models/                  # Modelos Pydantic (schemas)
│   │   ├── __init__.py
│   │   ├── event.py             # Schemas de eventos
│   │   ├── metrics.py           # Schemas de métricas
│   │   └── report.py            # Schemas de relatórios
│   │
│   ├── services/                # Serviços externos
│   │   ├── __init__.py
│   │   ├── database.py         # Cliente Supabase (abstração)
│   │   ├── openai.py            # Cliente OpenAI (LLM)
│   │   └── report_generator.py  # Geração de PDFs
│   │
│   └── utils/                   # Utilitários
│       ├── __init__.py
│       └── helpers.py           # Funções auxiliares
│
├── tests/                       # 🧪 Testes
│   ├── __init__.py
│   ├── conftest.py              # Configuração pytest
│   ├── unit/                    # Testes unitários
│   │   ├── test_core/
│   │   └── test_services/
│   └── integration/             # Testes de integração
│       └── test_api/
│
├── docs/                        # 📚 Documentação
│   ├── context/                 # Contexto do projeto
│   │   ├── CONTEXT.md
│   │   ├── database_schema_and_seed.sql
│   │   └── event_brand_report_technical_plan.md
│   └── etapas/                  # Etapas do projeto
│       ├── 1-Imersão.md
│       └── 2-Ideação.md
│
└── scripts/                     # 🔧 Scripts utilitários
    └── example_connection.py    # Exemplo de conexão (pode remover depois)
```

## 📝 Explicação das Pastas

### `app/` - Código da Aplicação
- **`main.py`**: Entry point do FastAPI, configuração da app
- **`config.py`**: Centraliza todas as configurações (env vars)
- **`api/`**: Rotas HTTP (controllers)
  - `deps.py`: Injeção de dependências (Supabase client, etc)
  - `v1/`: Versionamento da API
- **`core/`**: Lógica de negócio pura (use cases)
- **`models/`**: Schemas Pydantic (validação de entrada/saída)
- **`services/`**: Integrações externas (Supabase, OpenAI)
- **`utils/`**: Funções auxiliares reutilizáveis

### `tests/` - Testes
- **`unit/`**: Testes unitários (lógica isolada)
- **`integration/`**: Testes de integração (API + banco)

### `docs/` - Documentação
- Mantém apenas documentação essencial
- Contexto do projeto e planos técnicos

### `scripts/` - Scripts
- Scripts utilitários temporários
- **Remover após uso** (seguindo sua preferência)

## 🎯 Princípios Aplicados

1. **Separação de Responsabilidades**: Cada pasta tem uma responsabilidade clara
2. **Clean Architecture**: Camadas bem definidas (API → Core → Services)
3. **Dependency Injection**: Dependências injetadas via `deps.py`
4. **Versionamento de API**: Preparado para evolução (`v1/`)
5. **Testabilidade**: Estrutura facilita testes isolados
6. **Manutenibilidade**: Fácil encontrar e modificar código

## 🚀 Próximos Passos

1. Criar estrutura de pastas
2. Implementar `app/config.py` (carregar .env)
3. Implementar `app/services/database.py` (wrapper Supabase)
4. Criar `app/main.py` (FastAPI básico)
5. Implementar primeiro endpoint (`/events`)

