# Nexus Dashboard — Especificação da extensão Chrome

**Status:** proposta para MVP  
**Plataforma:** somente Google Chrome, Manifest V3  
**Modo de operação:** local-first, sem backend obrigatório  
**Idioma inicial:** português do Brasil  
**Objetivo:** centralizar agendas, sistemas de trabalho e acessos favoritos em uma dashboard rápida, elegante e futurista.

## 1. Visão do produto

O Nexus Dashboard será uma extensão de uso pessoal para abrir uma nova aba produtiva e reunir, em um único espaço:

- compromissos próximos do Google Calendar;
- atalhos para sistemas de trabalho, começando por Jira;
- sites e ferramentas favoritos, organizados por grupos;
- visão resumida do dia, com foco no que precisa de atenção;
- personalização visual sem depender de conta ou servidor externo;
- tema escuro como experiência visual única do MVP.

A experiência deve parecer um **command center pessoal**: visual escuro, hierarquia clara, cartões compactos, animações discretas e acesso rápido às ações mais frequentes.

O Nexus também terá um espaço de notícias personalizável, para que o usuário acompanhe temas relevantes sem transformar a dashboard em um portal de notícias genérico.

## 2. Objetivos e não objetivos

### 2.1 Objetivos do MVP

1. Permitir configurar a extensão sem cadastro.
2. Salvar dados localmente no navegador.
3. Exibir uma dashboard em uma nova aba.
4. Vincular o Google Calendar usando OAuth.
5. Vincular um projeto ou instância Jira por meio de configuração segura.
6. Criar, editar, excluir e reordenar acessos favoritos.
7. Oferecer busca global por favoritos, integrações e ações.
8. Degradar de forma elegante quando uma integração estiver offline ou não configurada.
9. Manter as permissões do Chrome no menor escopo possível.
10. Permitir acompanhar notícias por temas configurados pelo usuário.

### 2.2 Fora do escopo inicial

- sincronização entre dispositivos;
- criação ou edição de eventos em agendas;
- criação, edição ou movimentação de issues no Jira;
- armazenamento de senhas;
- automação de login;
- integração com múltiplos provedores além dos definidos no MVP;
- backend próprio ou telemetria obrigatória;
- colaboração e compartilhamento de dashboards.
- recomendação algorítmica baseada em perfil ou comportamento;
- publicação, comentário ou interação social com notícias;
- coleta de notícias por scraping de sites que não ofereçam fonte pública.

## 3. Personas e casos de uso

### Persona principal

Profissional que alterna diariamente entre calendário, Jira, documentação, chats, ferramentas internas e sistemas SaaS.

### Casos de uso

1. **Começar o dia:** abrir uma nova aba e visualizar próximos compromissos, atalhos e pendências importantes.
2. **Acessar um sistema:** clicar em um card favorito e abrir o site em nova aba.
3. **Consultar a agenda:** ver os próximos eventos sem abrir o calendário completo.
4. **Consultar trabalho:** visualizar resumo de issues atribuídas ou acompanhadas no Jira.
5. **Encontrar rapidamente:** usar a busca para localizar um site, integração ou ação.
6. **Personalizar:** reorganizar grupos, destacar favoritos e escolher um tema visual.
7. **Trabalhar offline:** continuar vendo favoritos e os últimos dados sincronizados localmente.

## 4. Experiência e navegação

### 4.1 Entradas da extensão

- **Nova aba:** experiência principal da dashboard.
- **Popup da barra do Chrome:** visão compacta com favoritos, ações rápidas e criação de novos acessos.
- **Página de opções/configurações:** gerenciamento de integrações, grupos, aparência e dados.

### 4.2 Layout da nova aba

#### Cabeçalho

- saudação contextual e data atual;
- campo de busca global;
- indicador de status das integrações;
- botão de configurações;
- menu de exportação/importação.

#### Área principal

1. **Hero do dia**
   - saudação;
   - hora atual;
   - próximo compromisso;
   - ação primária para abrir a agenda.

2. **Agenda**
   - próximos 5 eventos por padrão;
   - horário, título, calendário e duração;
   - estado vazio orientando a vincular uma agenda;
   - estado de erro sem bloquear o restante da dashboard.

3. **Trabalho / Jira**
   - contadores de issues abertas, atribuídas e atrasadas;
   - lista de até 5 itens prioritários por padrão;
   - link para abrir o Jira;
   - estado não configurado com CTA para vincular.

4. **Acessos favoritos**
   - cards com ícone, nome, domínio e grupo;
   - ação de abrir;
   - ação de editar/remover disponível por menu contextual;
   - opção de fixar itens na primeira posição.

5. **Notícias**
   - lista compacta de até 5 notícias por padrão, relacionadas aos temas escolhidos;
   - título, fonte, data de publicação e imagem opcional;
   - filtro rápido por tema;
   - ação para abrir a notícia em nova aba;
   - botão para atualizar;
   - indicação da última atualização;
   - estado vazio orientando a configurar um tema;
   - estado offline usando os últimos itens armazenados localmente.

6. **Atividade rápida**
   - ações recentes, como “abriu Jira” ou “acessou documentação”;
   - opcional no MVP, sem registrar conteúdo sensível.

### 4.3 Direção visual

- tema escuro como única opção visual do MVP;
- fundo com gradientes sutis e textura discreta;
- superfícies translúcidas com contraste suficiente;
- cor de destaque configurável, inicialmente azul elétrico ou violeta;
- tipografia sem serifa, legível e com boa densidade;
- bordas suaves, sombras moderadas e animações curtas;
- foco em acessibilidade, não em efeitos decorativos.

## 5. Funcionalidades

### 5.1 Favoritos e acessos

Cada acesso deve possuir:

- `id` local;
- nome;
- URL HTTPS ou HTTP explicitamente informada pelo usuário;
- domínio calculado para exibição;
- ícone/fallback de iniciais;
- grupo opcional;
- cor opcional;
- posição;
- status de fixado;
- data de criação e atualização.

Operações:

- adicionar pelo botão “Novo acesso”;
- editar nome, URL, grupo, cor e ícone;
- remover com confirmação;
- duplicar;
- reordenar por arrastar e soltar;
- filtrar por grupo;
- importar/exportar JSON;
- abrir em nova aba por padrão.

O MVP não deve buscar automaticamente ícones de terceiros. O primeiro fallback deve ser o favicon acessível pela própria URL, seguido por iniciais do nome.

### 5.2 Notícias personalizáveis

O usuário poderá configurar um ou mais temas de interesse, por exemplo:

- inteligência artificial;
- tecnologia;
- mercado financeiro;
- programação;
- um termo livre definido pelo usuário.

#### Configuração

- adicionar, editar, remover e reordenar temas;
- definir um tema principal;
- ativar ou desativar o widget;
- escolher a quantidade máxima de notícias exibidas;
- escolher a frequência de atualização;
- selecionar fontes disponíveis;
- restaurar a configuração padrão.

#### Fontes

A primeira versão deve priorizar fontes públicas em RSS ou Atom. A arquitetura deve separar:

- **provedor de fonte:** busca e interpreta o feed;
- **normalizador:** converte entradas para o modelo interno;
- **filtro de tema:** seleciona itens relacionados à configuração do usuário;
- **cache:** mantém os últimos resultados válidos.

Não deve haver scraping arbitrário de páginas. Quando uma fonte não oferecer feed público ou falhar, ela deve ser marcada como indisponível e não bloquear as demais fontes.

#### Comportamento

- combinar notícias de todas as fontes habilitadas;
- remover duplicatas por URL ou identificador da fonte;
- ordenar por data de publicação, da mais recente para a mais antiga;
- mostrar no máximo o limite configurado;
- abrir a notícia em nova aba;
- armazenar somente metadados necessários para exibição offline;
- não marcar automaticamente uma notícia como lida sem ação do usuário;
- permitir atualizar manualmente sem recarregar a página inteira.

#### Modelo de dados

```ts
type NewsTopic = {
  id: string;
  name: string;
  query: string;
  enabled: boolean;
  position: number;
};

type NewsSource = {
  id: string;
  name: string;
  feedUrl: string;
  enabled: boolean;
  topics: string[];
};

type NewsItem = {
  id: string;
  title: string;
  url: string;
  sourceName: string;
  publishedAt?: string;
  summary?: string;
  imageUrl?: string;
  topicIds: string[];
  fetchedAt: string;
};
```

O campo `query` deve ser tratado como texto de busca, nunca executado como código. A versão inicial pode relacionar um item ao tema por correspondência de termos no título, resumo e categorias fornecidas pelo feed.

O limite padrão do widget de notícias será de 5 itens. O usuário poderá alterar esse limite nas configurações.

### 5.3 Grupos

Grupos padrão sugeridos:

- Trabalho;
- Desenvolvimento;
- Comunicação;
- Pessoal;
- Outros.

O usuário pode criar, renomear, reordenar e excluir grupos. A exclusão de um grupo deve mover os acessos para “Sem grupo”, nunca apagá-los automaticamente.

### 5.4 Integração com agendas

#### MVP recomendado

Começar com Google Calendar por OAuth, usando o fluxo padrão compatível com extensão Chrome.

Configuração:

- vincular conta;
- selecionar calendários visíveis;
- escolher janela de consulta;
- escolher se eventos de dia inteiro aparecem no topo;
- desconectar conta;
- atualizar dados manualmente.

Comportamento:

- mostrar eventos futuros em ordem cronológica;
- cache local do último resultado bem-sucedido;
- exibir horário da última atualização;
- indicar erro de autenticação ou indisponibilidade sem apagar o cache;
- não criar ou alterar eventos no MVP.

O MVP terá somente Google Calendar. A camada de integração deve continuar isolada para permitir outros provedores em versões futuras, mas nenhuma outra agenda será implementada agora.

### 5.5 Integração com Jira

#### Validação obrigatória antes da implementação

A integração será exclusivamente com Jira Cloud no MVP. Antes de escrever o adaptador, deve ser feita uma validação técnica e de segurança entre:

1. **OAuth 2.0 3LO**, preferencialmente com fluxo compatível com cliente público e sem segredo embutido na extensão;
2. **API token**, somente como fallback explicitamente opt-in, caso o fluxo OAuth não seja viável para uma extensão local.

O fluxo escolhido deve:

- não embutir `client_secret` no pacote da extensão;
- limitar o acesso aos escopos necessários;
- permitir revogar/desconectar o acesso;
- não enviar credenciais para um backend próprio;
- ser compatível com as restrições do Manifest V3 e CORS;
- ser documentado junto das permissões solicitadas.

Se a validação concluir que o OAuth exige um segredo que não pode ser protegido em uma extensão local, a integração Jira deve permanecer desativada até existir uma arquitetura segura com backend. Nesse cenário, não será implementado um atalho inseguro.

#### Configuração provisória

Configuração:

- URL da instância;
- método de autenticação aprovado na validação de segurança;
- projeto(s) monitorado(s);
- filtro JQL opcional;
- limite de issues exibidas;
- botão de testar conexão;
- desconectar e remover credenciais locais.

Dados exibidos:

- identificador da issue;
- resumo;
- status;
- prioridade;
- responsável;
- prazo, quando disponível;
- link para abrir a issue no Jira.

Nenhum segredo deve ser exibido após o salvamento. A interface deve permitir substituir, revogar e remover a autorização ou credencial. Segredos não podem ser exportados, registrados em logs ou enviados em mensagens de erro.

### 5.6 Busca global e comandos

A busca deve localizar:

- favoritos por nome, domínio e grupo;
- integrações configuradas;
- ações como “adicionar acesso” e “abrir configurações”.

Atalhos sugeridos:

- `/` ou `Cmd/Ctrl + K`: focar busca;
- `Esc`: fechar busca/modal;
- `Enter`: abrir o resultado selecionado;
- `N`: novo acesso quando nenhum campo estiver focado.

## 6. Arquitetura técnica

### 6.1 Estrutura proposta

- **Manifest V3**
  - `chrome_url_overrides.newtab`: dashboard;
  - `action.default_popup`: popup compacto;
  - `options_page` ou `options_ui`: configurações;
  - `background.service_worker`: sincronização, alarmes e mensagens;
  - `permissions` somente as necessárias;
  - `host_permissions` configuradas por integração.

- **UI**
  - aplicação web empacotada na extensão;
  - componentes reutilizáveis para cards, modais, listas e estados;
  - estado global pequeno e previsível;
  - suporte a teclado e leitores de tela.

- **Domínio**
  - tipos de favoritos, grupos, integrações e eventos;
  - adaptadores por provedor;
  - normalização das respostas externas;
  - tratamento explícito de carregando, sucesso, vazio, offline e erro.

- **Persistência**
  - `chrome.storage.local` para preferências, favoritos, grupos e cache;
  - `chrome.storage.session` para dados efêmeros da sessão;
  - tokens OAuth devem ser obtidos por `chrome.identity` e mantidos somente pelo menor tempo necessário;
  - API tokens não devem ser persistidos até que a validação de segurança aprove explicitamente o mecanismo;
  - nenhum segredo em código-fonte, logs ou exportação por padrão.

### 6.2 Modelo de dados inicial

```ts
type Favorite = {
  id: string;
  name: string;
  url: string;
  groupId?: string;
  color?: string;
  icon?: string;
  pinned: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
};

type FavoriteGroup = {
  id: string;
  name: string;
  color: string;
  position: number;
};

type IntegrationConfig = {
  id: string;
  provider: 'google-calendar' | 'jira';
  enabled: boolean;
  displayName: string;
  settings: Record<string, string | number | boolean | string[]>;
  lastSyncAt?: string;
  lastError?: string;
};

type CalendarEvent = {
  id: string;
  provider: string;
  title: string;
  startAt: string;
  endAt?: string;
  allDay: boolean;
  calendarName?: string;
  url?: string;
};

type JiraIssue = {
  id: string;
  key: string;
  summary: string;
  status: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
  url: string;
};
```

Os dados de notícias devem ser tratados como cache descartável: a remoção do cache não pode afetar favoritos, grupos ou configurações de integrações.

### 6.3 Sincronização

- sincronização sob demanda no primeiro carregamento;
- atualização periódica via `chrome.alarms` quando houver integração ativa;
- cache com timestamp e validade por provedor;
- atualização das fontes de notícias em intervalo configurável, respeitando limites razoáveis;
- falha em uma fonte de notícias não deve impedir a exibição das demais;
- falhas não devem destruir dados válidos anteriores;
- mensagens entre dashboard, popup e service worker devem ser tipadas;
- evitar polling agressivo e respeitar limites das APIs.

## 7. Privacidade e segurança

- coleta mínima e somente local por padrão;
- sem analytics no MVP;
- explicar claramente quais dados cada integração acessa;
- solicitar permissões apenas durante a ativação da integração;
- validar URLs e impedir esquemas perigosos como `javascript:`;
- sanitizar títulos e textos vindos das APIs antes de renderizar;
- sanitizar títulos e resumos provenientes de feeds antes da renderização;
- validar URLs de notícias e imagens antes de disponibilizá-las para abertura ou carregamento;
- não usar `innerHTML` com dados externos;
- não incluir tokens em mensagens de erro;
- botão de “Apagar todos os dados” com confirmação explícita;
- exportação deve avisar que o arquivo pode conter configurações sensíveis;
- política de Content Security Policy compatível com Manifest V3.

## 8. Permissões previstas

Permissões devem ser adicionadas somente quando necessárias:

- `storage`: favoritos, configurações e cache;
- `alarms`: atualização periódica;
- `identity`: OAuth de provedores compatíveis;
- `notifications`: somente se lembretes forem aprovados em uma versão futura.

As permissões de host para APIs externas devem ser específicas por provedor, evitando `<all_urls>`. A implementação deve revisar o fluxo de autenticação antes de definir a lista final.

## 9. Estados e acessibilidade

Todos os módulos precisam tratar:

- carregando;
- vazio;
- não configurado;
- sucesso;
- offline com cache;
- erro recuperável;
- erro que exige nova autenticação.

Requisitos mínimos:

- contraste WCAG AA;
- navegação completa por teclado;
- foco visível;
- `aria-label` em ações apenas com ícone;
- sem informação transmitida exclusivamente por cor;
- respeitar `prefers-reduced-motion`;
- layout responsivo para diferentes larguras de nova aba;
- textos de erro acionáveis e em português.

## 10. Critérios de aceite do MVP

1. Ao instalar a extensão, a nova aba exibe uma dashboard funcional mesmo sem integrações.
2. O usuário consegue criar, editar, excluir, fixar e reordenar um acesso.
3. Os favoritos persistem após reiniciar o Chrome.
4. O usuário consegue criar e gerenciar grupos.
5. A busca encontra favoritos por nome e domínio.
6. A dashboard informa claramente quando uma agenda ou Jira ainda não está vinculado.
7. Dados válidos em cache continuam disponíveis quando uma integração falha.
8. O fluxo de desconexão remove a configuração e os dados associados ao provedor.
9. Nenhuma credencial aparece em texto aberto na interface após o salvamento.
10. A extensão não solicita acesso a todas as páginas sem necessidade.
11. A dashboard é navegável por teclado e mantém foco visível.
12. A extensão pode exportar e importar favoritos e grupos em JSON validado.
13. O usuário consegue adicionar, editar, remover, ativar e reordenar temas de notícias.
14. O widget de notícias exibe título, fonte, data e link para cada item disponível.
15. Notícias repetidas são consolidadas e a falha de uma fonte não remove notícias válidas de outras fontes.
16. O widget mantém os últimos resultados válidos quando a atualização falha ou o navegador está offline.

## 11. Roadmap

### Fase 1 — Fundação

- scaffold Manifest V3;
- dashboard, popup e opções;
- design system visual;
- armazenamento local;
- favoritos e grupos;
- importação/exportação.

### Fase 2 — Integrações

- Google Calendar;
- Jira Cloud;
- notícias por feeds RSS/Atom;
- cache, status e sincronização;
- tratamento de autenticação e desconexão.

### Fase 3 — Refinamento

- busca global com comandos;
- atalhos de teclado;
- métricas locais opcionais;
- melhorias de acessibilidade e performance.

### Futuro

- sincronização opcional entre dispositivos;
- Microsoft Calendar;
- múltiplos layouts;
- widgets configuráveis;
- lembretes;
- edição limitada de eventos e issues, somente após revisão de permissões e segurança.

## 12. Decisões em aberto para a implementação

Decisões já tomadas:

1. o único provedor de agenda do MVP será o Google Calendar;
2. o tema visual será escuro, sem tema claro no MVP;
3. o popup permitirá adicionar favoritos diretamente;
4. widgets baseados em listas exibirão 5 itens por padrão;
5. o navegador-alvo será somente Google Chrome.

Validações obrigatórias antes do desenvolvimento:

6. validar a estratégia mais segura de autenticação do Jira Cloud, priorizando OAuth 2.0 3LO sem segredo embutido na extensão;
7. validar como tokens OAuth serão obtidos, renovados e revogados usando as APIs do Chrome;
8. não implementar armazenamento persistente de API token do Jira enquanto não houver mecanismo aprovado e justificativa de segurança;
9. confirmar os escopos finais de OAuth e as permissões/host permissions do Manifest V3.
