# Canvas de Ideação de Soluções — Midiaz B2B

## 1. Problema a Ser Resolvido
O mercado de fotografia esportiva gera milhões de imagens com alto potencial informativo, mas que **não são utilizadas como fonte de dados estruturados**.  
As marcas esportivas **não sabem quando, onde e por quem seus produtos são usados**, o que gera:

- Falta de visibilidade sobre presença de marca em eventos e treinos;  
- Dificuldade em mensurar o ROI de patrocínios;  
- Dependência de dados de terceiros e pesquisas declarativas imprecisas.  

---
## 2. Ideias de Solução (Brainstorming)

| ID | Ideia de Solução | Descrição |
|----|-------------------|------------|
| A | **Sistema de detecção de marcas e produtos esportivos em fotos** | Utiliza visão computacional para identificar logotipos e tipos de produtos (tênis, camisetas, acessórios) nas imagens. |
| B | **Dashboard analítico com métricas de presença de marca** | Exibe relatórios e insights visuais sobre frequência de uso, eventos e categorias esportivas. |
| C | **API de dados esportivos visuais** | Permite integração direta com marcas e agências via licenciamento de dados. |
| D | **Relatórios automatizados com LLM** | Gera relatórios de performance e presença de marca em linguagem natural a partir das análises visuais. |
| E | **Sistema de classificação de contextos esportivos** | Identifica automaticamente o tipo de esporte (corrida, beach tennis, ciclismo etc.) e contexto do evento. |
| F | **Módulo de mensuração de ROI de patrocínios** | Estima o retorno de ações e patrocínios com base em volume e frequência de uso visual de marca. |

---

## 3. Matriz de Priorização (Impacto × Esforço)

| Impacto / Esforço | Baixo Esforço | Alto Esforço |
|--------------------|----------------|---------------|
| Alto Impacto  | 🟩 A. Detecção de marcas e produtos  /  🟩 B. Dashboard de métricas | 🟨 D. Relatórios automatizados (LLM)  /  🟨 F. Mensuração de ROI |
| Baixo Impacto | 🟦 E. Classificação de contextos esportivos | 🟥 C. API de dados esportivos (alta complexidade, baixo retorno) |

**Legenda:**  
🟩 Foco principal (vitórias rápidas)  
🟨 Projetos estratégicos (fases futuras)  
🟦 Complementares  
🟥 Evitar no MVP
---

## 4. Solução Priorizada para Prototipagem

**Solução escolhida:**  
> **Sistema de detecção de marcas e produtos esportivos + Dashboard analítico com métricas de presença de marca**

### 🎯 Justificativa:
- Alto impacto para validação da proposta de valor do Midiaz B2B;  
- Base para todos os produtos futuros (API, relatórios e mensuração de ROI);  
- Menor esforço técnico comparado às soluções com LLM;  
- Permite entregar resultados tangíveis rapidamente às marcas esportivas.  

### 🧭 Próximos Passos:
1. Prototipar o pipeline de detecção (usando AWS Rekognition ou OpenAI Vision).  
2. Estruturar a base de dados visual e métricas de presença.  
3. Desenvolver o dashboard interativo para visualização dos insights.  
4. Testar com um grupo piloto de eventos e marcas parceiras.  

---
# Registro de Design de Prompt 
---
## 1. 🗂️ Metadados

**Propósito:**  
Gerar relatórios automatizados e insights de presença de marca a partir de dados visuais processados por visão computacional.  
O prompt transforma os resultados das detecções de marcas e produtos esportivos em **texto analítico natural**, oferecendo um resumo claro sobre a performance da marca em eventos esportivos.

**Modelo(s) Alvo:**  
OpenAI GPT-5 (modo avançado com capacidade de raciocínio analítico e geração em linguagem natural).

## 2. 🧩 Estrutura do Prompt

**Contexto de Entrada Necessário:**  
O prompt requer as seguintes informações para gerar o relatório:  
- Lista estruturada das marcas detectadas nas imagens;  
- Frequência e quantidade de aparições por evento;  
- Tipo de evento esportivo (corrida, triatlo, beach tennis etc.);  
- Local, data e período do evento;  
- Informações adicionais como total de atletas e fotos processadas.

**Template do Prompt (com variáveis):**

```text
Você é um analista de marketing esportivo da plataforma Midiaz.

Com base nas seguintes informações visuais, gere um relatório executivo sobre a presença de marca.

Dados:
- Evento: {nome_evento}
- Local: {local_evento}
- Data: {data_evento}
- Total de atletas identificados: {total_atletas}
- Total de imagens analisadas: {total_imagens}
- Marcas detectadas e frequência:
{lista_marcas}

Instruções:
1. Resuma os principais destaques sobre a presença de marca.
2. Destaque a marca mais recorrente e o tipo de produto mais identificado.
3. Contextualize brevemente o tipo de evento esportivo.
4. A saída deve estar em linguagem natural, formal e voltada para gestores de marketing esportivo.
5. Finalize o relatório com um insight estratégico curto (1 frase) sobre como a marca pode otimizar seu desempenho futuro.

3. 🧾 Estrutura da Resposta

Intenção da Resposta:
Gerar um relatório textual em português, no formato de parágrafo(s), interpretando dados visuais em linguagem executiva e estratégica.
O objetivo é facilitar a leitura de dados de visão computacional para profissionais de marketing e patrocínio.

Exemplo de Saída Ideal:
📊 Relatório de Presença de Marca — Corrida das Pontes 2025

Durante o evento Corrida das Pontes, realizado no Recife em 12 de maio de 2025, foram analisadas 14.532 imagens e identificados 8.920 atletas únicos.
As marcas mais recorrentes foram: Adidas (32%), Nike (25%), Mizuno (18%) e Track&Field (10%).
Os produtos mais detectados foram tênis de corrida (64%) e camisetas técnicas (28%).

A Adidas apresentou maior presença visual, especialmente entre os atletas de elite e nos primeiros blocos da competição, indicando forte associação à performance.

💡 Insight Estratégico:
A marca pode ampliar sua presença regional reforçando ativações em provas de média distância, onde o share visual ainda é reduzido.

## 4. Teste e Qualidade

**Critérios de aceite / métricas de qualidade**
1. O relatório deve conter entre **100 e 200 palavras**.
2. Deve mencionar **pelo menos três marcas** e **dois tipos de produto**.
3. Deve contextualizar **tipo de evento** e **data**.
4. Deve incluir **um insight estratégico final**.
5. O texto deve ser **claro, formal** e **sem jargões técnicos de IA**.
6. Não deve apresentar **alucinações** (informações não presentes na entrada).

**Procedimento de teste**
- **Entrada mínima viável**: ≥ 100 imagens analisadas, metadados de evento (nome, local, data) e lista de marcas com contagens.
- **Casos de teste**:
  - Evento com **1 marca dominante**.
  - Evento com **3+ marcas** em distribuição equilibrada.
  - Evento com **poucos dados** (limite inferior): o texto deve sinalizar limitação de amostra.
- **Validação**:
  - Verificar se todos os campos exigidos apareceram (marcas, produtos, evento, data, insight).
  - Checar consistência numérica quando números forem incluídos (se aplicável).

---

## 5. Notas Adicionais

**Instruções e observações**
- Executar o prompt **após** o pipeline de visão computacional (ex.: AWS Rekognition ou OpenAI Vision) e o **enriquecimento de metadados** (tipo de evento, local, data, categorias esportivas).
- Entrada recomendada:
  - `evento`, `local`, `data`, `total_atletas`, `total_imagens`.
  - Tabela/JSON com `marca`, `produto`, `frequencia` (por evento).
- Se `total_imagens < 100`, ajustar a linguagem para evitar inferências fortes (ex.: “amostra limitada, resultados indicativos”).

**Boas práticas**
- Normalizar nomes de marcas e produtos (evitar duplicatas por variações).
- Remover detecções de baixa confiança conforme limiar acordado (ex.: score < 0.6).
- Manter histórico de versões do prompt e dos parâmetros no repositório.

**Lições aprendidas**
- Modelos podem gerar afirmações não suportadas se a entrada estiver incompleta; **validar sempre** as variáveis obrigatórias.
- Quanto mais rico o contexto (tipo de esporte, distância da prova, perfil do atleta), **melhor** a qualidade do insight.
- Separar os modos:
  - **Automático (API)** para relatórios por evento.
  - **Interativo (chat)** para perguntas ad hoc de gestores.

**Exemplo de checklist antes da geração**
- [ ] Variáveis obrigatórias presentes (`evento`, `local`, `data`, `lista_marcas`).
- [ ] Amostra suficiente (`total_imagens` e `total_atletas` informados).
- [ ] Nomes normalizados (marcas/produtos).
- [ ] Limiar de confiança aplicado nas detecções.

