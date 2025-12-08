# 🧠 CONTEXTO DO PROJETO — MIDIAZ B2B  
*Disciplina IF1006 - Transformação Digital com IA (CIn/UFPE)*

---

## 📍 Visão Geral

A **Midiaz** é uma startup que nasceu como um **marketplace de fotos profissionais em eventos esportivos, acadêmicos e sociais**, conectando **fotógrafos** e **atletas amadores** em uma plataforma inteligente de descoberta e compra de fotos (modelo **B2C**).

Embora esse modelo de origem (B2C) continue sendo parte do ecossistema da Midiaz, **o foco deste projeto acadêmico é exclusivamente o desenvolvimento do modelo B2B** — a camada de **inteligência de dados e visão computacional** que transforma as imagens coletadas pela Midiaz em **informações estruturadas e insights acionáveis para marcas esportivas**.

---

## 🚀 Conceito Central

O mercado atual de fotografia esportiva é dominado por plataformas como **Foco Radical, Fotop, Fotto e Banlek**, que acumulam milhões de imagens contendo **dados visuais valiosos** ainda pouco explorados.

A **Midiaz B2B** propõe usar **IA e visão computacional** para transformar essas imagens em dados estruturados, capazes de revelar:

- Marcas de roupas, calçados e acessórios em uso real.  
- Locais e contextos de prática esportiva.  
- Frequência e recorrência de atletas em eventos.  
- Tipos de esporte e perfis comportamentais.  

Esses dados possibilitam **medir presença de marca no mundo físico**, **analisar comportamento esportivo real** e **avaliar o ROI de patrocínios** — desafios hoje enfrentados com baixa precisão e alto custo.

---

## 🧩 Escopo do Projeto

O **escopo deste projeto (Midiaz B2B)**, desenvolvido no contexto da disciplina **IF1006 - Transformação Digital com IA**, se concentra na **camada analítica e técnica** da solução.

O sistema deverá:

1. **Coletar e organizar fotos esportivas** (dados visuais de referência).  
2. **Processar e extrair informações com IA/visão computacional**.  
3. **Transformar as informações em dados estruturados** (ex.: marca, produto, esporte, frequência, local).  
4. **Oferecer uma camada de entrega** — em definição — podendo assumir forma de **dashboard, API ou dataset**.

O objetivo não é recriar o marketplace B2C completo, mas **construir o núcleo de inteligência de dados** que permitirá à Midiaz atuar como **infraestrutura de insights visuais para o setor esportivo**.

---

## ⚙️ Lacunas e Incertezas (a serem descobertas)

Este projeto será guiado por **descoberta e definição incremental**, ou seja, várias decisões ainda serão tomadas durante o desenvolvimento.  
Entre os pontos em aberto estão:

- As **tecnologias exatas** para cada componente da arquitetura.  
- A **forma final de entrega** (dash, API, relatório ou dataset).  
- O **modelo de dados estruturado** para representar marcas e contextos esportivos.  
- O **nível de automação** e a **infraestrutura cloud** ideal (AWS, Vercel, etc.).  
- As **métricas de validação** para medir acurácia dos modelos de IA.  

Essas decisões serão registradas e documentadas à medida que evoluírem, garantindo transparência e rastreabilidade técnica.

---

## 🧱 Engenharia e Arquitetura de Software

O desenvolvimento seguirá **boas práticas de engenharia de software, versionamento e documentação**, conforme as diretrizes do **RFP da disciplina IF1006**.

### 🔧 Boas práticas:
- Uso de **Git/GitHub** com histórico limpo e colaborativo.  
- **Documentação viva**, com arquivos `README.md`, `CONTRIBUTING.md` e `BUILD.md`.  
- **Arquitetura documentada via Modelo C4** (níveis Contexto, Contêiner e Componente).  
- **Incrementalidade e checkpoints** definidos conforme o cronograma da disciplina.  
- **Código modular e testável**, com foco em clareza e manutenção.  
- **Implantação em ambiente cloud** (AWS, Vercel, Netlify, Heroku, etc.).  
- **Diagramas técnicos e de domínio** usando Markdown e Mermaid.

### 🧰 Stack recomendada (ainda em validação):
| Camada | Tecnologia sugerida | Observações |
|--------|---------------------|--------------|
| **Backend** | FastAPI (Python) | API leve e modular para processamento e integração com IA. |
| **Frontend (opcional)** | Next.js (React) | Apenas se o formato final envolver um dashboard. |
| **Banco de Dados** | PostgreSQL ou DynamoDB | Estrutura relacional ou NoSQL conforme volume. |
| **Infraestrutura** | AWS (S3, Lambda, EventBridge, RDS) | Nuvem escalável e compatível com pipelines serverless. |
| **CI/CD** | GitHub Actions | Automatização de testes e deploy. |

---

## 🧭 Metodologia Sinfonia (RFP - IF1006)

O projeto seguirá a metodologia **Sinfonia**, conforme descrito no RFP da disciplina, passando pelas seguintes etapas:

1. **Imersão**  
   - Compreensão do problema e do domínio B2B da Midiaz.  
   - Mapeamento de stakeholders e objetivos de negócio.  

2. **Ideação**  
   - Desenvolvimento de soluções IA-driven e canvases de ideação.  
   - Estruturação de prompts e fluxos de IA (Design de Prompts).  

3. **Produção**  
   - Desenvolvimento incremental com versionamento Git.  
   - Criação dos diagramas arquiteturais (C4) e documentação técnica.  
   - Implantação de protótipo funcional hospedado.  

4. **Validação**  
   - Testes e análises de escalabilidade.  
   - Reflexão ética e social sobre uso de dados visuais.  
   - Registro das lições aprendidas e iterações.

---

## ✅ Entregáveis Esperados

Ao final do projeto, deverão estar disponíveis:

- **Protótipo funcional do Midiaz B2B**, hospedado em produção.  
- **Código versionado e documentado**, com commits semânticos.  
- **Artefatos da metodologia Sinfonia** anexados ao repositório.  
- **Documentação arquitetural (C4)** e **técnica (Markdown)**.  
- **Canvas de Testes, Validação e Feedback Ético.**  
- **Registro das decisões e descobertas técnicas.**

---

## 🔍 Diretrizes para o Cursor

Durante o desenvolvimento, o **Cursor** deve:

1. Aplicar **boas práticas de engenharia de software** (Clean Code, modularização, SOLID).  
2. Manter **estrutura de repositório organizada e navegável**.  
3. Incentivar **versionamento incremental e colaborativo**.  
4. Sugerir **melhorias técnicas e arquiteturais** continuamente.  
5. Garantir **alinhamento com o RFP e a metodologia Sinfonia**.  
6. Respeitar e explorar as **lacunas abertas**, incentivando descoberta e aprendizado.  

---

## 🎯 Síntese Final

O **Midiaz B2B** é um projeto acadêmico que une **IA, visão computacional e engenharia de software** para criar uma **plataforma de inteligência visual esportiva**.  

Mais do que um protótipo técnico, é uma **exploração prática de transformação digital**, que busca traduzir imagens em dados e dados em estratégia — passo a passo, construindo a base para o **futuro da inteligência esportiva no Brasil**.

---

> **Referência:**  
> RFP — IF1006: *Transformação Digital com IA*, Prof. Vinicius Garcia, CIn/UFPE.  
> Base metodológica: *Sinfonia Framework*.
