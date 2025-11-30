# 🏃 Midiaz B2B - Event Brand Report MVP

Solução analítica B2B que transforma fotos esportivas em insights sobre presença de marca usando IA generativa (LLM) e visão computacional.

## 📋 Sobre o Projeto

O **Event Brand Report** é o MVP do Midiaz B2B, um produto que:
- Processa fotos de eventos esportivos
- Detecta marcas e produtos nas fotos
- Gera relatórios analíticos com insights em linguagem natural
- Fornece métricas de share de marca, rankings e comparações

## 🚀 Quick Start

### 1. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o script SQL: `docs/database_schema_and_seed.sql`
3. Configure as credenciais no arquivo `.env`

📖 **Guia completo**: Veja [docs/SETUP.md](docs/SETUP.md) ou [docs/SUPABASE_QUICK_START.md](docs/SUPABASE_QUICK_START.md)

### 2. Instalar Dependências

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

### 3. Testar Conexão

```bash
python scripts/example_connection.py
```

## 📁 Estrutura do Projeto

```
midiaz-top4/
├── docs/                    # Documentação
│   ├── SETUP.md            # Guia de setup completo
│   ├── SUPABASE_QUICK_START.md  # Quick start Supabase
│   ├── COMO_ENCONTRAR_CREDENCIAIS.md  # Guia de credenciais
│   ├── database_schema_and_seed.sql  # Schema e dados artificiais
│   ├── validate_data.sql   # Queries de validação
│   ├── event_brand_report_technical_plan.md  # Plano técnico completo
│   └── etapas/             # Documentação das etapas do projeto
│       ├── 1-Imersão.md
│       └── 2-Ideação.md
├── scripts/                 # Scripts úteis
│   └── example_connection.py  # Exemplos de conexão com Supabase
├── .env                     # Credenciais (não commitado)
├── .gitignore              # Arquivos ignorados pelo Git
├── requirements.txt        # Dependências Python
└── README.md              # Este arquivo
```

## 🗄️ Banco de Dados

O banco está configurado no **Supabase** e já vem populado com:
- **3 eventos** de exemplo
- **950 pessoas** cadastradas
- **~2.300 itens** (tênis, camisetas, shorts, óculos, bonés)
- **6 marcas**: Nike, Adidas, Mizuno, Track&Field, Asics, Olympikus

## 🔧 Tecnologias

- **Backend**: FastAPI (Python)
- **Banco de Dados**: PostgreSQL (Supabase)
- **API Client**: Supabase Python Client (API REST)
- **LLM**: OpenAI API (para geração de relatórios)
- **Validação**: Pydantic

## 📚 Documentação

- [Setup Completo](docs/SETUP.md)
- [Quick Start Supabase](docs/SUPABASE_QUICK_START.md)
- [Como Encontrar Credenciais](docs/COMO_ENCONTRAR_CREDENCIAIS.md)
- [Plano Técnico](docs/event_brand_report_technical_plan.md)
- [Validação de Dados](docs/validate_data.sql)

## 🎯 Próximos Passos

1. ✅ Banco configurado no Supabase
2. 🔨 Criar API FastAPI básica
3. 📊 Conectar ao banco e testar queries
4. 🎨 Criar endpoints para consultar dados
5. 📄 Gerar relatórios com LLM

## 👥 Equipe

- Matheus Augusto (Líder Técnico)
- Luís Felipe Pascoal (Cientista de Dados)
- Rafaela Leão (Designer de Produto)

## 📝 Licença

Este projeto faz parte do trabalho acadêmico da disciplina IF1006.

