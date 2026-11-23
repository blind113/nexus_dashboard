# Nexus Dashboard — Plano de implementação

**Base:** [EXTENSION-SPEC.md](./EXTENSION-SPEC.md)  
**Alvo:** somente Google Chrome  
**Formato:** extensão Manifest V3, local-first  
**Ordem:** fundação → experiência principal → persistência → integrações → endurecimento

## Status atual

**Atualizado em:** 23/11/2026  
**Marco atual:** fundação visual e favoritos locais implementados  
**Build:** aprovado com `npm run build`  
**Próximo marco:** widget de notícias com cache local

### Concluído

- scaffold TypeScript, Vite e Manifest V3;
- nova aba, popup e página de opções apontando para a aplicação inicial;
- dashboard escura com layout responsivo;
- componentes iniciais de cards, inputs, botões e estados vazios;
- favoritos locais com criação, busca, fixar/desafixar e remoção;
- grupos iniciais;
- persistência via `chrome.storage.local`, com fallback local para desenvolvimento;
- validação de URLs HTTP e HTTPS;
- build de produção gerado em `dist/`.

### Em andamento

- validação manual da extensão carregada no Chrome;
- refinamento do fluxo de grupos;
- testes automatizados;
- definição e implementação do widget de notícias.

### Ainda não iniciado

- Google Calendar;
- investigação de autenticação segura do Jira;
- sincronização com `chrome.alarms`;
- importação/exportação JSON;
- auditoria final de permissões e acessibilidade.

## 1. Resultado esperado

Entregar uma extensão Chrome instalável localmente que substitua a nova aba por uma dashboard pessoal com:

- favoritos e grupos persistidos localmente;
- popup para abrir e adicionar favoritos;
- tema visual escuro;
- widgets com até 5 itens por padrão;
- notícias configuráveis por temas, usando feeds RSS/Atom;
- Google Calendar via OAuth;
- integração Jira somente após validação de segurança;
- estados claros de carregamento, vazio, offline e erro.

## 2. Princípios de implementação

1. **Local-first:** favoritos, preferências e cache funcionam sem backend.
2. **Permissões mínimas:** nenhuma permissão será adicionada sem uma funcionalidade que a exija.
3. **Integrações isoladas:** cada provedor possui adaptador, tipos normalizados e tratamento de erro próprio.
4. **Segurança antes de conveniência:** não persistir ou embutir segredos sem um mecanismo aprovado.
5. **Estados explícitos:** toda chamada externa precisa representar carregando, sucesso, vazio, offline e erro.
6. **Testabilidade:** lógica de domínio não deve depender diretamente de APIs do Chrome ou de componentes visuais.
7. **Progressão incremental:** cada fase termina com um incremento instalável e verificável.

## 3. Stack proposta

### Obrigatória

- TypeScript;
- Manifest V3;
- `chrome.storage.local`;
- `chrome.storage.session`;
- `chrome.identity`;
- `chrome.alarms`;
- API Web padrão para `fetch`, URL e datas.

### Recomendação para a UI

- React;
- Vite;
- CSS Modules ou CSS organizado por componentes;
- biblioteca de ícones empacotada localmente, sem CDN;
- Vitest para testes unitários;
- Playwright ou ferramenta equivalente para testes de fluxo no Chrome.

A escolha final de React e Vite deve ser confirmada no scaffold inicial. A decisão não deve bloquear a modelagem de domínio, os adaptadores ou os contratos de armazenamento.

## Convenções de lint, formatação e testes

### Lint

- ESLint com configuração flat em `eslint.config.js`.
- TypeScript verificado pelo ESLint usando `typescript-eslint`.
- Regras recomendadas do ESLint e TypeScript habilitadas.
- Regras de hooks do React habilitadas.
- Componentes React devem exportar apenas componentes ou constantes relacionadas quando a regra de refresh exigir.
- Variáveis não utilizadas geram erro; argumentos deliberadamente não utilizados devem começar com `_`.
- `dist/` e `node_modules/` ficam fora da análise.
- Comando oficial: `npm run lint`.

### Formatação

- Prettier é a fonte única de formatação.
- Largura máxima: 120 colunas.
- Strings com aspas simples.
- Ponto e vírgula obrigatório.
- Vírgula final em estruturas multilinha.
- Comandos oficiais:
  - `npm run format`: aplica a formatação;
  - `npm run format:check`: valida sem alterar arquivos.
- Não fazer ajustes manuais que contrariem o resultado do Prettier.

### Testes

- Vitest é o runner unitário oficial.
- Testes ficam próximos do código testado, com sufixo `.test.ts` ou `.test.tsx`.
- Testes de domínio e adaptadores devem ser determinísticos e não depender da rede.
- APIs do Chrome devem ser isoladas atrás de adaptadores e mockadas nos testes.
- Casos de erro, vazio, offline e entrada inválida devem ser cobertos junto do caminho feliz.
- Testes unitários devem rodar com `npm test`.
- Testes em modo watch ficam disponíveis com `npm run test:watch`.
- Testes E2E do Chrome serão adicionados separadamente quando a dashboard e as integrações estiverem prontas.

### Sequência local mínima

Antes de considerar uma alteração pronta:

1. `npm run format:check`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`

## 4. Estrutura de projeto proposta

```text
src/
  background/
    service-worker.ts
    alarms.ts
    message-router.ts
  components/
    common/
    dashboard/
    favorites/
    integrations/
    news/
  pages/
    new-tab/
    popup/
    options/
  domain/
    favorites/
    groups/
    integrations/
    news/
  adapters/
    chrome/
    calendar/
    jira/
    news/
  storage/
    keys.ts
    migrations.ts
    repositories/
  styles/
  types/
  utils/
tests/
  unit/
  integration/
  e2e/
public/
  manifest.json
```

O nome e a divisão exatos podem mudar durante o scaffold, mas as responsabilidades devem permanecer separadas.

## 5. Fases e entregáveis

## Fase 0 — Preparação e decisões técnicas

### Objetivo

Remover decisões que poderiam gerar retrabalho ou risco de segurança.

### Tarefas

- [x] Confirmar Node.js, gerenciador de pacotes e versão mínima do Chrome.
- [x] Definir React/Vite ou alternativa equivalente.
- [x] Definir convenções de lint, formatação e testes.
- [x] Definir esquema inicial de chaves do `chrome.storage`.
- [ ] Definir política de migrações para mudanças de dados.
- [x] Documentar permissões iniciais do Manifest V3.
- [ ] Fazer spike de autenticação do Google Calendar.
- [ ] Fazer spike de autenticação do Jira Cloud.

### Spike obrigatório do Jira

Comparar tecnicamente:

1. OAuth 2.0 3LO compatível com extensão local;
2. eventual uso de PKCE, quando suportado pelo fluxo escolhido;
3. necessidade de `client_secret` no exchange;
4. uso de API token como fallback;
5. impacto de CORS, host permissions, revogação e renovação;
6. risco de armazenar credencial em `chrome.storage.local`.

### Regra de decisão

- Preferir OAuth sem segredo embutido na extensão.
- Não colocar `client_secret` no bundle.
- Não persistir API token do Jira antes de uma aprovação explícita de segurança.
- Se não houver fluxo seguro compatível com uma extensão local, manter Jira fora do primeiro release funcional e documentar o bloqueio.

### Saída

- repositório com scaffold mínimo;
- decisão de stack;
- matriz de permissões;
- decisão documentada sobre o Jira;
- pipeline local de lint, type-check e testes.

## Fase 1 — Fundação da extensão

### Objetivo

Criar uma extensão instalável com as três superfícies principais.

### Tarefas

- [x] Criar `manifest.json` Manifest V3.
- [x] Configurar `chrome_url_overrides.newtab`.
- [x] Configurar popup.
- [x] Configurar página de opções.
- [ ] Configurar service worker.
- [x] Criar build de desenvolvimento e produção.
- [x] Adicionar CSP compatível com Manifest V3.
- [ ] Adicionar roteamento de mensagens tipado entre UI e service worker.
- [x] Criar shell visual escuro da dashboard.
- [x] Criar sistema básico de estados e notificações.
- [ ] Validar carregamento da extensão em `chrome://extensions`.

### Critérios de saída

- a extensão instala sem erro;
- nova aba, popup e opções abrem;
- não há chamadas externas ou permissões desnecessárias;
- erros de inicialização são exibidos de forma acionável.

## Fase 2 — Design system e dashboard

### Objetivo

Implementar a estrutura visual sem depender de integrações reais.

### Tarefas

- [x] Criar tokens de cor, tipografia, espaçamento e bordas.
- [x] Criar componentes de card, botão e input.
- [ ] Criar componentes de modal, menu e tooltip.
- [x] Criar cabeçalho com data, busca e configurações.
- [x] Criar hero do dia.
- [x] Criar grid responsivo de widgets.
- [x] Criar estados loading e empty.
- [ ] Criar estados offline e error para integrações.
- [ ] Implementar navegação por teclado e foco visível.
- [ ] Respeitar `prefers-reduced-motion`.
- [ ] Garantir contraste WCAG AA.
- [x] Aplicar limite padrão de 5 itens aos widgets de lista.

### Critérios de saída

- dashboard utilizável sem integrações;
- tema claro não aparece;
- todos os componentes principais têm estados vazios e de erro;
- fluxo de teclado básico funciona.

## Fase 3 — Persistência, favoritos e grupos

### Objetivo

Entregar a primeira funcionalidade completa e útil offline.

### Tarefas

- [x] Criar tipos `Favorite` e `FavoriteGroup`.
- [x] Criar repositórios para favoritos e grupos.
- [x] Implementar validação de URL e bloqueio de esquemas perigosos.
- [x] Implementar adicionar e remover favorito.
- [x] Implementar fixar/desafixar favoritos.
- [ ] Implementar editar, duplicar e reordenar favoritos.
- [ ] Implementar CRUD completo de grupos.
- [ ] Mover favoritos para “Sem grupo” ao excluir um grupo.
- [x] Implementar popup com lista de favoritos.
- [x] Implementar adição rápida pelo popup.
- [x] Abrir favoritos em nova aba.
- [x] Implementar busca por nome e domínio.
- [ ] Implementar busca por grupo.
- [ ] Implementar importação e exportação JSON validada.
- [ ] Criar migração de versão do armazenamento.

### Testes

- [ ] Persistência após reiniciar a extensão.
- [ ] Reordenação e posições únicas.
- [ ] Exclusão de grupo sem perda de favoritos.
- [ ] Rejeição de `javascript:`, `data:` e URLs inválidas.
- [ ] Importação de JSON inválido sem sobrescrever dados atuais.
- [ ] Exportação sem credenciais.

### Critérios de saída

- favoritos e grupos funcionam sem rede;
- popup e dashboard mostram os mesmos dados;
- dados inválidos geram mensagens claras;
- testes de domínio e persistência passam.

## Fase 4 — Widget de notícias

### Objetivo

Permitir acompanhamento de temas configuráveis usando fontes públicas.

### Tarefas

- [ ] Criar tipos `NewsTopic`, `NewsSource` e `NewsItem`.
- [ ] Criar configuração inicial de fontes RSS/Atom.
- [ ] Implementar parser de RSS e Atom.
- [ ] Normalizar título, URL, fonte, data, resumo e imagem.
- [ ] Validar URL de feed, notícia e imagem.
- [ ] Implementar correspondência de temas por título, resumo e categorias.
- [ ] Implementar deduplicação por URL ou identificador da fonte.
- [ ] Implementar ordenação por data.
- [ ] Limitar a 5 itens por padrão.
- [ ] Implementar filtro rápido por tema.
- [ ] Implementar atualização manual.
- [ ] Implementar atualização periódica respeitando limites.
- [ ] Implementar cache local descartável.
- [ ] Preservar cache válido em falha ou offline.
- [ ] Sanitizar todo conteúdo antes de renderizar.
- [ ] Exibir fonte indisponível sem bloquear as demais.

### Critérios de saída

- usuário consegue criar, editar, ativar, desativar e reordenar temas;
- notícias podem ser abertas em nova aba;
- uma fonte quebrada não derruba o widget inteiro;
- o limite padrão é 5;
- nenhum HTML externo é renderizado diretamente.

## Fase 5 — Google Calendar

### Objetivo

Adicionar agenda real usando somente Google Calendar.

### Tarefas

- [ ] Registrar/configurar o cliente OAuth conforme as exigências do Google.
- [ ] Definir escopos mínimos de leitura.
- [ ] Implementar fluxo de vinculação com `chrome.identity`.
- [ ] Implementar renovação ou nova obtenção de token.
- [ ] Implementar desconexão e revogação.
- [ ] Buscar próximos eventos.
- [ ] Permitir selecionar calendários visíveis.
- [ ] Aplicar janela de consulta configurável.
- [ ] Normalizar eventos para `CalendarEvent`.
- [ ] Exibir 5 eventos por padrão.
- [ ] Implementar cache local do último resultado válido.
- [ ] Diferenciar autenticação expirada, rede indisponível e resposta inválida.
- [ ] Não implementar criação ou alteração de eventos.

### Testes

- [ ] primeiro vínculo;
- [ ] cancelamento do OAuth;
- [ ] token expirado;
- [ ] conta sem calendários;
- [ ] calendário sem eventos;
- [ ] múltiplos calendários;
- [ ] offline com cache;
- [ ] desconexão removendo dados associados.

### Critérios de saída

- somente escopos de leitura necessários são solicitados;
- tokens não aparecem na UI, logs ou exportação;
- falhas não apagam o último cache válido;
- a dashboard mostra claramente o status da agenda.

## Fase 6 — Jira condicionado à validação de segurança

### Objetivo

Implementar Jira somente se o fluxo aprovado na Fase 0 for seguro e compatível com extensão local.

### Tarefas condicionais

- [ ] Criar adaptador Jira conforme o fluxo aprovado.
- [ ] Configurar somente host permissions específicas.
- [ ] Normalizar issues para `JiraIssue`.
- [ ] Implementar teste de conexão.
- [ ] Implementar configuração de projeto e filtro JQL.
- [ ] Exibir até 5 issues prioritárias por padrão.
- [ ] Implementar revogação/desconexão.
- [ ] Remover cache e configuração associados ao desconectar.
- [ ] Garantir que JQL seja tratado como entrada de texto validada.
- [ ] Testar respostas 401, 403, 429 e 5xx.

### Bloqueios explícitos

- não embutir segredo de cliente;
- não salvar API token sem aprovação;
- não usar `all_urls`;
- não registrar tokens em logs;
- não transformar falha de autenticação em estado de sucesso vazio.

Se a validação reprovar o desenho, entregar a extensão sem Jira e manter um estado “integração indisponível por configuração de segurança”, com documentação do motivo.

## Fase 7 — Service worker, sincronização e integração entre superfícies

### Objetivo

Centralizar sincronização e manter dashboard, popup e opções consistentes.

### Tarefas

- [ ] Criar roteador de mensagens tipado.
- [ ] Centralizar leitura e escrita nos repositórios.
- [ ] Configurar `chrome.alarms` apenas para integrações ativas.
- [ ] Implementar lock ou deduplicação de sincronizações simultâneas.
- [ ] Atualizar timestamps e status por provedor.
- [ ] Propagar mudanças para as telas abertas.
- [ ] Evitar polling agressivo.
- [ ] Tratar service worker reiniciado sem perder estado persistido.

## Fase 8 — Segurança, acessibilidade e qualidade

### Tarefas

- [ ] Auditar permissões do Manifest V3.
- [ ] Auditar host permissions.
- [ ] Revisar CSP.
- [ ] Buscar usos de `innerHTML` e conteúdo não sanitizado.
- [ ] Revisar abertura de URLs externas.
- [ ] Garantir que segredos não entram em exportação, logs ou erros.
- [ ] Testar teclado, foco e leitores de tela.
- [ ] Testar zoom e diferentes larguras.
- [ ] Respeitar redução de movimento.
- [ ] Rodar lint, type-check, testes unitários, integração e E2E.
- [ ] Testar instalação limpa e atualização de versão.
- [ ] Testar migrações do armazenamento.

## 6. Dependências entre fases

| Fase                | Depende de                | Motivo                                                |
| ------------------- | ------------------------- | ----------------------------------------------------- |
| 1 — Fundação        | Fase 0                    | Manifest e ferramentas dependem das decisões iniciais |
| 2 — Dashboard       | Fase 1                    | Requer superfícies instaláveis                        |
| 3 — Favoritos       | Fases 1 e 2               | Usa shell, componentes e storage                      |
| 4 — Notícias        | Fases 1 e 2               | Usa service worker, estados e cache                   |
| 5 — Google Calendar | Fases 1, 2 e 7            | Requer OAuth, UI e sincronização                      |
| 6 — Jira            | Fase 0 e 7                | Só pode iniciar após decisão de segurança             |
| 7 — Sincronização   | Fase 1                    | Centraliza mensagens e alarmes                        |
| 8 — Qualidade       | Todas as fases funcionais | Audita o resultado completo                           |

## 7. Estratégia de testes

### Unitários

- validação e normalização de URLs;
- ordenação e deduplicação;
- filtro de temas;
- parser RSS/Atom;
- migrações de storage;
- regras de grupos e posições;
- transformação de respostas de provedores.

### Integração

- repositórios sobre `chrome.storage` mockado;
- roteador de mensagens;
- sincronização e cache;
- tratamento de respostas externas;
- desconexão e limpeza de dados.

### E2E

- instalação e abertura da nova aba no Chrome;
- criação de favorito pelo popup;
- edição e reordenação na dashboard;
- importação/exportação;
- configuração de tema de notícias;
- atualização offline;
- Google Calendar com ambiente de teste;
- Jira somente se o fluxo for aprovado.

## 8. Definition of Done

Uma fase só pode ser considerada concluída quando:

- funcionalidade prevista está implementada;
- estados de sucesso, vazio, carregando e erro foram tratados;
- testes relevantes passam;
- nenhum segredo ou permissão desnecessária foi introduzido;
- comportamento offline foi validado quando aplicável;
- documentação da decisão técnica foi atualizada;
- a extensão continua instalável no Chrome.

### Validação já executada

- [x] `npm install` concluído sem vulnerabilidades reportadas.
- [x] `npm run build` concluído com sucesso.
- [x] `npm run typecheck` executado como comando isolado.
- [x] testes unitários executados.
- [ ] testes de integração executados.
- [ ] teste manual da extensão carregada no Chrome executado.

## 9. Ordem recomendada de execução

1. Fase 0 — decisões e spikes de segurança.
2. Fase 1 — scaffold Manifest V3.
3. Fase 2 — dashboard e design system.
4. Fase 3 — favoritos, grupos e popup.
5. Fase 4 — notícias.
6. Fase 5 — Google Calendar.
7. Fase 7 — sincronização consolidada.
8. Fase 6 — Jira, somente se aprovado.
9. Fase 8 — auditoria e release local.

O primeiro marco demonstrável deve ser a Fase 3: uma nova aba elegante, com favoritos persistidos, grupos e criação rápida pelo popup, funcionando completamente sem rede.
