# Decisões Técnicas — FitAura

## 1. Arquitetura de telas e navegação

Optamos pelo **Expo Router** com navegação baseada em arquivos, organizando as rotas em dois grupos:

- `(auth)/` — telas públicas: login e cadastro. O layout desse grupo verifica se já existe um usuário logado e redireciona automaticamente para a home, impedindo acesso às telas de autenticação quando já autenticado.
- `(tabs)/` — telas protegidas: Home, Treinos, Loja, Pedidos e Perfil. O layout desse grupo faz o papel inverso: se `currentUser` for `null`, redireciona para o login. Essa lógica de guarda centralizada nos layouts elimina a necessidade de checar autenticação em cada tela individualmente.

A navegação entre grupos é gerenciada pelos próprios layouts via `<Redirect>`, sem necessidade de lógica imperativa com `router.push` fora de ações explícitas do usuário.

## 2. Consumo de dados e tipagem

A fonte de dados da loja é gerenciada pelo `ShopProvider`, que se conecta a um servidor **Socket.IO** local (`server.mjs`) para receber atualizações de estoque, status de pedidos e leituras do sensor IoT em tempo real. A conexão é estabelecida na montagem do provider e encerrada na desmontagem.

Os dados de dieta e treino são carregados do **AsyncStorage** na montagem de cada provider e persistidos automaticamente via `useEffect` sempre que o estado muda. Toda a lógica de acesso à rede e ao armazenamento fica fora dos componentes de UI, dentro dos providers em `components/context/`.

Todos os modelos de dados são definidos em `src/@types/` com `interface`, `type` e `enum`. Funções de serviço e utilitários têm parâmetros e retornos explicitamente tipados. O projeto compila sem erros com `tsc --noEmit` e sem uso de `any`.

## 3. Persistência local

Utilizamos **AsyncStorage** com chaves namespaceadas por funcionalidade e por `userId` (ex: `@fitaura:diet:{id}`, `@fitaura:workout_logs:{id}`), de forma que dados de usuários diferentes não se misturam. O acesso ao AsyncStorage é sempre feito através dos wrappers genéricos `storageGet`, `storageSet` e `storageRemove` definidos em `services/storage.ts`, centralizando o tratamento de erros e a serialização JSON.

Persistimos: lista de usuários cadastrados, usuário logado atualmente, refeições do dia por usuário, alimentos customizados, logs de treino, templates customizados, carrinho e histórico de pedidos.

Senhas são armazenadas como hash **SHA-256** via `expo-crypto`, nunca em texto puro.

## 4. Autenticação local

A autenticação é inteiramente local. O `UserProvider` expõe `register`, `login`, `loginDirectly`, `logout` e `deleteUser`. O fluxo de cadastro foi desacoplado do login automático: `register` apenas cria e persiste o usuário; o login só ocorre após o usuário confirmar o modal de boas-vindas, chamando `loginDirectly`. Isso garante que o modal seja exibido antes de qualquer redirecionamento de rota.

## 5. Funcionalidades avançadas

- **Tempo real (Socket.IO):** estoque de produtos, status de pedidos e leitura do sensor IoT de temperatura e umidade do armazém são atualizados via eventos do servidor sem necessidade de polling.
- **Câmera e galeria:** foto de perfil via `expo-image-picker`, com solicitação de permissão em tempo de execução e recorte 1:1.
- **Cálculo nutricional:** meta calórica diária calculada pela fórmula de Mifflin-St Jeor com base nos dados do perfil (sexo, idade, altura, peso e nível de atividade). Macros distribuídos proporcionalmente ao objetivo do usuário.
- **Cálculo de carga de treino:** estimativa de calorias queimadas por exercício usando equivalente metabólico (MET), com recap semanal de volume e frequência.
