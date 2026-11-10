# PLANO DE NEGÓCIO E ESPECIFICAÇÃO TÉCNICA
## Sistema "Câmara Inteligente" – Gestão Legislativa de Nova Geração

---

## 1. SUMÁRIO EXECUTIVO

### 1.1. Visão Geral do Produto
O **Câmara Inteligente** é uma plataforma SaaS (Software as a Service) de gestão legislativa e administrativa desenvolvida para modernizar, simplificar e acelerar os trabalhos das Câmaras Municipais. Nascido para solucionar a alta complexidade, burocracia excessiva e baixa usabilidade dos sistemas legados (como Legisoft e SAPL), o Câmara Inteligente une **Inteligência Artificial**, **design intuitivo (UX em 3 cliques)** e **assinatura digital nativa via Gov.br**.

### 1.2. Proposta de Valor Única (UVP)
* **Para o Vereador e Assessores:** Elaboração de proposições em segundos com IA, acompanhamento visual por Kanban (estilo Trello) e votação em 1 clique no celular.
* **Para a Secretaria Legislativa:** Automação na montagem de pautas, geração de atas em tempo real por transcrição de voz (IA) e protocolo em lote sem erros.
* **Para o Cidadão:** Transparência ativa com linguagem simples, mapa de demandas do município e portal responsivo e acessível.
* **Para a Gestão Financeira da Câmara:** Redução de até 80% nos custos de impressão e redução do tempo de tramitação de 15 para 2 dias.

---

## 2. ANÁLISE DE MERCADO E CONCORRÊNCIA

### 2.1. Cenário Atual das Câmaras Municipais no Brasil
No Brasil existem **5.568 Câmaras Municipais**. A grande maioria enfrenta um dos dois cenários:
1. **Sistemas Gratuitos Legados (ex: SAPL - Interlegis):** Gratuitos, porém antigos, de difícil manutenção local, sem suporte dedicado e com interface ultrapassada.
2. **Sistemas Comerciais Tradicionais (ex: Legisoft):** Soluções completas sob o ponto de vista legal, mas burocráticas, complexas para a maioria dos vereadores, focadas no desktop e dependentes de certificados ICP-Brasil com tokens físicos que vivem apresentando falhas.

### 2.2. Matriz Comparativa de Concorrência

| Funcionalidade / Atributo | SAPL (Interlegis) | Legisoft | **Câmara Inteligente (Nossa Solução)** |
| :--- | :---: | :---: | :---: |
| **Interface / Usabilidade** | Ultrapassada (década de 2000) | Complexa / Densa | **Ultra-Moderna (Mobile-First / 3 Cliques)** |
| **Redação de Matérias** | Editor de texto básico | Editor com modelos | **Gerador por IA (Prompt em linguagem natural)** |
| **Acompanhamento de Status** | Listas de tabelas genéricas | Códigos de trâmite técnico | **Kanban Visual com Notificação WhatsApp** |
| **Assinatura Digital** | Manual / Externa | ICP-Brasil (Token A3/A1) | **Gov.br Gratuito + Biometria + ICP-Brasil** |
| **Montagem da Ata da Sessão** | Manual | Semi-automática | **Transcrição Automática por Áudio/IA** |
| **Implantação & Treinamento** | Autônoma / Sem suporte | Treinamento longo | **Self-onboarding em 48h + Suporte VIP** |

---

## 3. MAPEAMENTO DE LAYOUT E ESTRUTURA DE PÁGINAS (TELAGEM)

O sistema é estruturado em **5 Visões Personalizadas por Perfil de Usuário**, garantindo que cada ator veja apenas o que precisa para executar sua função sem poluição visual.

```
                                  +---------------------------------------+
                                  |     PORTAL CÂMARA INTELIGENTE         |
                                  +-------------------+-------------------+
                                                      |
      +----------------------+------------------------+------------------------+----------------------+
      |                      |                        |                        |                      |
+-----v------+        +------v-----+           +------v-----+           +------v-----+         +------v-----+
|   VISÃO    |        |   VISÃO    |           |   VISÃO    |           |   VISÃO    |         |   VISÃO    |
| VEREADOR / |        | SECRETARIA |           | PLENÁRIO & |           |  CIDADÃO & |         | EXEC. MUN. |
| ASSESSOR   |        | LEGISLATIVA|           | TRANSMISSÃO|           | TRANSPAR.  |         | (PREFEITURA|
+------------+        +------------+           +------------+           +------------+         +------------+
```

### 3.1. Visão Perfil: Vereador e Assessor de Gabinete

Esta visão tem foco total na **agilidade de criação**, **visualização limpa** e **facilidade de uso em celulares e tablets**.

#### Páginas da Visão Vereador:
1. **`V-01` - Dashboard do Gabinete (Home):**
   * Indicadores do gabinete (total de indicações no mês, taxa de atendimento pela Prefeitura, reuniões agendadas).
   * Atalhos de ação rápida: *"Nova Indicação com IA"*, *"Assinar Matérias Pendentes"*, *"Entrar na Sessão"*.
   * Feed de notificações do município e últimas atualizações no WhatsApp.
2. **`V-02` - Gerador de Proposições com IA:**
   * Campo simplificado para digitar ou ditar o pedido (ex: *"Solicitar operação tapa-buraco na Av. Brasil com foto anexa"*).
   * Seletor de tipo (Indicação, Requerimento, Moção, Projeto de Lei).
   * Pré-visualização em tempo real do documento oficial formatado segundo o Regimento Interno.
   * Botão *"Gerar e Enviar para Assinatura"*.
3. **`V-03` - Gestão de Proposições (Kanban & Lista):**
   * Quadro visual no estilo Kanban com colunas: **Rascunho** | **Aguardando Assinatura** | **Em Análise nas Comissões** | **Na Pauta da Sessão** | **Enviado ao Executivo** | **Concluído**.
   * Filtros por bairro, tema (Saúde, Educação, Obras) e período.
4. **`V-04` - Central de Assinatura Digital (Gov.br):**
   * Lista de documentos pendentes de assinatura do vereador.
   * Botão de assinatura em lote via **Gov.br** com verificação por código SMS/Aplicativo ou Biometria Facial.
5. **`V-05` - Painel do Vereador na Sessão (Votação Mobile/Tablet):**
   * Tela dedicada para uso durante as Sessões Plenárias.
   * Botão de confirmação de presença (Quórum).
   * Leitura do Projeto/Matéria que está em votação no momento.
   * Botões de Votação em Destaque: **[ Votaria SIM - Verde ]**, **[ Votaria NÃO - Vermelho ]**, **[ ABSTENÇÃO - Amarelo ]**.
   * Inscrição para uso da palavra ("Pedir a palavra").

---

### 3.2. Visão Perfil: Secretaria Legislativa & Mesa Diretora

Foco em **rigor regimental**, **controle de prazos**, **gestão de tramitação** e **montagem de sessões**.

#### Páginas da Visão Secretaria:
1. **`S-01` - Painel de Controle Legislativo:**
   * Mapeamento de todos os processos em andamento na Câmara.
   * Alertas de prazos críticos (ex: *Projeto de Lei X vence o prazo de parecer em 48h*).
2. **`S-02` - Central de Protocolo Geral (Interno e Externo):**
   * Triagem de documentos recebidos da população, vereadores e Prefeitura.
   * Gerador de etiquetas com QR Code e recibos de protocolo em PDF.
   * Ação de distribuição em lote para gabinete ou comissão.
3. **`S-03` - Gestão de Comissões Permanentes:**
   * Cadastro de comissões (CCJ, Finanças, Obras, etc.).
   * Distribuição de processos aos relatores.
   * Emissão e juntada de Pareceres das Comissões.
4. **`S-04` - Montador de Pauta da Sessão:**
   * Ferramenta de "Arrastar e Soltar" (Drag & Drop) para organizar o Expediente e a Ordem do Dia.
   * Trava de segurança regimental (só permite incluir na pauta matérias com pareceres válidos ou regime de urgência).
   * Publicação da pauta no Portal da Transparência em 1 clique.
5. **`S-05` - Central de Sessão Plenária & Transcrição por IA:**
   * Controle da sessão em tempo real (abertura de quórum, abertura de votação, cronômetro de discurso).
   * **Módulo Transcritor:** Captura o áudio do sistema de som/microfone da Câmara e gera a transcrição em texto identificando cada vereador.
   * Gerador automático da minuta da **Ata da Sessão**.
6. **`S-06` - Publicação & Diário Oficial:**
   * Módulo de autógrafos de lei, sanções e promulgações.
   * Exportação dos atos oficiais aprovados para o Diário Oficial Eletrônico.

---

### 3.3. Visão Perfil: Plenário & Transmissão (Telão da Câmara)

Interface otimizada para **displays de alta resolução (TVs, Projetores e Transmissão no YouTube)**.

#### Páginas da Visão Plenário:
1. **`P-01` - Painel do Telão da Sessão (Modo TV):**
   * Placar eletrônico em tempo real exibindo a presença dos vereadores.
   * Cronômetro regressivo de fala do vereador na tribuna.
   * Exibição da matéria em votação e resultado gráfico imediato dos votos (Sim, Não, Abstenção).
2. **`P-02` - Central de Integração de Transmissão:**
   * Sincronização do placar eletrônico com a transmissão ao vivo oficial da Câmara (YouTube/Facebook).

---

### 3.4. Visão Perfil: Portal do Cidadão & Transparência

Interface pública moderna, responsiva, rápida e focada em engajamento social.

#### Páginas do Portal do Cidadão:
1. **`C-01` - Home do Portal da Câmara:**
   * Campo de busca global estilo "Google" para encontrar Leis, Projetos, Vereadores ou Sessões.
   * Notícias e destaques das aprovações recentes na Câmara.
2. **`C-02` - Repositório de Legislação Municipal (Leis Compiladas):**
   * Busca de Leis Orgânicas, Códigos de Postura, Decretos e Leis Ordinárias com histórico de alterações em texto puro.
3. **`C-03` - Perfil do Vereador & Prestação de Contas:**
   * Página individual de cada vereador exibindo: histórico de indicações, presença em sessões, gastos do gabinete e canais de contato.
4. **`C-04` - Transmissão ao Vivo e Acervo de Sessões:**
   * Player de vídeo da sessão com índice de tempo clicável por pauta (ex: *clique para ir direto à votação do Projeto X*).
5. **`C-05` - Central do Cidadão (Ouvidoria, e-SIC e Mapa de Demandas):**
   * Formulário simples para o munícipe registrar problemas do seu bairro.
   * Mapa interativo da cidade mostrando as melhorias solicitadas pelos cidadãos e atendidas pelos vereadores.

---

### 3.5. Visão Perfil: Integração Poder Executivo (Prefeitura)

Portal dedicado para a equipe da Prefeitura interagir com a Câmara de forma ágil e segura.

#### Páginas do Executivo:
1. **`E-01` - Portal de Envio de Matérias do Executivo:**
   * Envio de Projetos de Lei do Executivo, Pedidos de Urgência e Vetos com assinatura do Prefeito.
2. **`E-02` - Central de Resposta às Indicações:**
   * Painel onde as secretarias municipais (Obras, Saúde, Educação) informam o status de atendimento de cada indicação feita pelos vereadores.

---

## 4. ARQUITETURA DE MÓDULOS DO SISTEMA

```
+-----------------------------------------------------------------------------------+
|                            CÂMARA INTELIGENTE CORE                                |
+-----------------------------------------------------------------------------------+
|  [Módulo 1] IA Assistente Legislativo & Redação Inteligente                       |
|  [Módulo 2] Processo Legislativo, Protocolo Eletrônico & Gestão Documental        |
|  [Módulo 3] Painel de Plenário, Votação Eletrônica & Transcrição da Ata           |
|  [Módulo 4] Motor de Assinatura Eletrônica (Gov.br + Biometria + ICP-Brasil)       |
|  [Módulo 5] Transparência Ativa, Ouvidoria & Participação Cidadã                  |
|  [Módulo 6] Barramento de Integração Prefeitura-Câmara & API Externa              |
+-----------------------------------------------------------------------------------+
```

### Módulo 1: IA Assistente Legislativo
* **Motor LLM Especializado:** Treinado com o Regimento Interno da Câmara e Constituição Federal/Estadual.
* **Formatador de Normas:** Garante que o documento saia rigorosamente formatado na técnica legislativa (Lei Complementar 95/1998).
* **Análise de Duplicidade:** Alerta se já existe uma indicação idêntica aprovada nos últimos 6 meses para o mesmo local.

### Módulo 2: Processo Legislativo & Protocolo Digital
* **Numeração Automática:** Impossibilita rasura ou duplicidade de números de protocolo.
* **Trâmite Configurável:** Workflow visual que arrasta o processo entre setores.
* **Certificação Temporal:** Carimbo de tempo garantindo quando o documento deu entrada.

### Módulo 3: Plenário, Votação & Ata Automática
* **Motor de Transcrição Speech-to-Text:** Converte o áudio da sessão em texto dividindo por interlocutor (speaker diarization).
* **Criptografia de Voto:** Garante que votos secretos permaneçam inalteráveis e auditáveis.

### Módulo 4: Motor de Assinatura Eletrônica
* **Integração Gov.br:** Autenticação via OAuth2 com o serviço oficial do Governo Federal (nível Prata/Ouro).
* **Suporte ICP-Brasil:** Para câmaras que exigem certificado A1/A3 nos atos da Mesa Diretora.

---

## 5. FASES DO PROJETO & CRONOGRAMA DE DESENVOLVIMENTO

O projeto será executado em **5 Fases sequenciais**, utilizando metodologia ágil (Scrum) em Sprints de 2 semanas:

```
FASE 1 (Mês 1)    : Arquitetura, UX/UI & Protótipo Interativo
FASE 2 (Mês 2-3)  : Núcleo do Processo Legislativo, Protocolo & IA
FASE 3 (Mês 4)    : Plenário, Votação Eletrônica & Transcrição da Ata
FASE 4 (Mês 5)    : Portal da Transparência & Integração Executivo
FASE 5 (Mês 6)    : Testes de Carga, Pilotagem em Câmara Parceira & Lançamento
```

### Detalhamento das Fases:

#### **FASE 1: Arquitetura, UX/UI e Protótipo Interativo (Sprints 1 e 2 - 30 Dias)**
* Definição da stack tecnológica (Frontend React/Vite/Tailwind, Backend Node.js/Python, Banco PostgreSQL).
* Construção do protótipo navegável em alta fidelidade de todas as 5 visões e 21 páginas.
* Validação do protótipo com vereadores e servidores da secretaria.

#### **FASE 2: Núcleo do Processo Legislativo, Protocolo e IA (Sprints 3 a 6 - 60 Dias)**
* Desenvolvimento da engine de protocolo digital e numeração automática.
* Integração do Motor de IA para geração de indicações e projetos de lei.
* Módulo de Gestão de Gabinete (Kanban) e Central de Assinaturas (Gov.br).
* Gestão de Comissões e Emissão de Pareceres.

#### **FASE 3: Plenário, Votação Eletrônica e Transcrição da Ata (Sprints 7 a 9 - 45 Dias)**
* Desenvolvimento do aplicativo de votação para tablets/smartphones dos vereadores.
* Desenvolvimento do Painel do Telão (Modo TV) e Tarjas para Transmissão.
* Implementação do sistema de áudio para texto (Speech-to-Text) com gerador automático de Atas.

#### **FASE 4: Portal da Transparência e Integração Executivo (Sprints 10 e 11 - 30 Dias)**
* Desenvolvimento do Portal Público responsivo com busca de leis e perfil dos vereadores.
* Implementação do portal da Prefeitura (envio de matérias e respostas a indicações).
* Adequação rigorosa às normas da LAI (Lei de Acesso à Informação) e acessibilidade (eMAG).

#### **FASE 5: Homologação, Pilotagem e Lançamento (Sprint 12 - 15 Dias)**
* Implantação piloto em uma Câmara Municipal parceira.
* Testes de segurança, penetração (pentest) e carga.
* Treinamento presencial/EAD dos vereadores e equipe técnica.
* Lançamento oficial do produto no mercado.

---

## 6. MODELO DE NEGÓCIO E PLANO FINANCEIRO

### 6.1. Modelo de Receita (SaaS por Porte de Câmara)
A cobrança será feita por **assinatura mensal recorrente (SaaS)**, variando de acordo com o número de vereadores / habitantes do município.

| Porte da Câmara | Habitantes / N.º de Vereadores | Valor Mensal Estimado | Serviços Inclusos |
| :--- | :---: | :---: | :--- |
| **Porte P (Pequeno)** | Até 9 Vereadores (Até 25k hab.) | R$ 1.800 / mês | Sistema completo, IA, Gov.br, Suporte Remoto. |
| **Porte M (Médio)** | 10 a 15 Vereadores (25k a 100k hab.) | R$ 3.500 / mês | Sistema completo, IA, Votação Plenário, Transcrição Ata. |
| **Porte G (Grande)** | 16 a 23 Vereadores (100k a 500k hab.) | R$ 6.800 / mês | Sistema completo, Customizações, Gerente de Conta VIP. |
| **Porte Especial** | Acima de 24 Vereadores (Metrópoles) | Sob Consulta | Infraestrutura dedicada e SLA de 99,99%. |

### 6.2. Estratégia de Venda no Setor Público (Go-To-Market)
1. **Dispensa de Licitação por Valor / Piloto (Art. 75 da Lei 14.133/2021):** Para câmaras de pequeno e médio porte, contrato inicial simplificado por dispensa de licitação para validação do sistema.
2. **Pregão Eletrônico por Menor Preço e Melhor Técnica:** Apresentação de Atestados de Capacidade Técnica destacando a inovação da IA e integração Gov.br.
3. **Parcerias com Associações de Câmaras (AVEP, UVP, etc.):** Demonstração em congressos estaduais de vereadores com foco em UX e facilidade no celular.

---

## 7. MATRIZ DE RISCOS E ESTRATÉGIA DE MITIGAÇÃO

| Risco Mapeado | Impacto | Probabilidade | Estratégia de Mitigação |
| :--- | :---: | :---: | :--- |
| **Resistência cultural de vereadores mais velhos** | Alto | Média | Interface "Modo Sênior" com botões gigantes e criação 100% por comando de voz no celular. |
| **Instabilidade de internet na Câmara durante a sessão** | Alto | Baixa | Módulo de Votação em Plenário com funcionamento **Offline-First** via rede local Wi-Fi da Câmara. |
| **Questionamento legal sobre Assinatura Gov.br** | Médio | Baixa | Respaldado pela Lei Federal 14.063/2020 e Decreto 10.543/2020 (validade jurídica plena). |
| **Falha na transcrição de voz por ruído no plenário** | Médio | Média | Treinamento do modelo de IA com cancelamento de ruído e áudio multicanal individual por microfone. |

---

## 8. CONCLUSÃO E PRÓXIMOS PASSOS

O **Câmara Inteligente** resolve diretamente a frustração dos vereadores com sistemas arcaicos como o Legisoft. Ao transformar burocracia em um fluxo visual de 3 cliques amparado por IA e celular, o produto possui alto potencial de tração e substituição imediata no mercado municipal brasileiro.

### Ações Imediatas:
1. Aprovação deste Plano de Negócios.
2. Início do desenvolvimento da **Fase 1 (UX/UI e Protótipo Visual)**.
3. Apresentação do protótipo funcional para o vereador solicitante para validação prática.
