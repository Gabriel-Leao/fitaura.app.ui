# Fitaura App

Aplicativo mobile focado em auxiliar na organização de rotina fitness, permitindo o gerenciamento de **usuários**, **acompanhamento alimentar**, **registro de treinos** e uma **loja** com produtos relacionados ao estilo de vida saudável.

---

## Demonstração

## [![Assistir no YouTube](https://img.shields.io/badge/YouTube-Assistir%20vídeo-red?logo=youtube)](https://youtu.be/1lH7rLDA05w)

## Membros do Grupo

| Nome                                  | RM     |
| ------------------------------------- | ------ |
| **Gabriel Leão da Silva**             | 552642 |
| **Matheus Farias de Lima**            | 554254 |
| **Miguel Mauricio Parrado Patarroyo** | 554007 |
| **Pedro Henrique Nardaci Chaves**     | 553988 |
| **Vitor Pinheiro Nascimento**         | 553693 |

---

## Funcionalidades

- Autenticação local com cadastro, login, logout e exclusão de conta
- Senhas armazenadas com hash SHA-256 e persistência local via AsyncStorage
- Acompanhamento alimentar diário com cálculo de calorias e macros
- Meta calórica personalizada calculada via fórmula de Mifflin-St Jeor
- Registro e histórico de treinos com templates sugeridos por objetivo
- Foto de perfil via câmera ou galeria
- Edição de perfil inline
- Loja com carrinho, estoque em tempo real e rastreamento de pedidos via Socket.IO
- Sensor IoT simulado exibindo temperatura e umidade do armazém

---

## Estrutura do Projeto

```
fitaura.app.ui/
├── server.mjs              # Servidor Socket.IO para rastreamento de pedidos em tempo real
├── src/
│   ├── @types/
│   │   ├── diet.ts         # Tipos e enums da dieta (FoodType, MealId, Food, MealEntry, etc.)
│   │   ├── enums.ts        # Enums globais: UserGoal, UserSex, ActivityLevel
│   │   ├── forms.ts        # Tipos dos formulários: SignInFormData e SignUpFormData
│   │   ├── shop.ts         # Tipos da loja (CartItem, Order, OrderStatus, IoTReading)
│   │   ├── user.ts         # Tipo User
│   │   └── workout.ts      # Tipos e enums de treino (ExerciseType, WorkoutTemplate, WorkoutLog, etc.)
│   ├── app/
│   │   ├── _layout.tsx     # Root layout com UserProvider, DietProvider e WorkoutProvider
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx # Redireciona para home se logado
│   │   │   ├── sign-in.tsx # Tela de login
│   │   │   └── sign-up.tsx # Tela de cadastro
│   │   └── (tabs)/
│   │       ├── _layout.tsx # Tab navigator com guard de autenticação
│   │       ├── index.tsx   # Home — refeições do dia, macros e meta calórica
│   │       ├── workout.tsx # Treinos — registro, templates e recap semanal
│   │       ├── shop.tsx    # Loja
│   │       ├── orders.tsx  # Histórico completo de pedidos
│   │       └── profile.tsx # Perfil do usuário com edição inline
│   ├── assets/
│   │   └── images/         # Imagens dos produtos da loja
│   ├── components/
│   │   ├── context/
│   │   │   ├── diet/
│   │   │   │   ├── DietProvider.tsx     # Contexto global de dieta e alimentos
│   │   │   │   └── useDietContext.ts    # Hook para consumir o contexto de dieta
│   │   │   ├── shop/
│   │   │   │   ├── ShopProvider.tsx     # Contexto global da loja, carrinho, pedidos e socket
│   │   │   │   └── useShopContext.ts    # Hook para consumir o contexto da loja
│   │   │   ├── user/
│   │   │   │   ├── UserProvider.tsx     # Contexto global de autenticação
│   │   │   │   └── useUserContext.ts    # Hook para consumir o contexto de usuário
│   │   │   └── workout/
│   │   │       ├── WorkoutProvider.tsx  # Contexto global de treinos e templates
│   │   │       └── useWorkoutContext.ts # Hook para consumir o contexto de treino
│   │   ├── diet/
│   │   │   ├── AddEntryModal.tsx        # Modal de adicionar alimento à refeição
│   │   │   ├── AddFoodForm.tsx          # Formulário de cadastro de alimento customizado
│   │   │   ├── FoodListItem.tsx         # Item da lista de alimentos
│   │   │   ├── MacroPreview.tsx         # Card de preview de calorias e macros
│   │   │   └── QuantitySelector.tsx     # Seletor de quantidade com atalhos e +/-
│   │   ├── shop/
│   │   │   ├── IotSensorBanner.tsx      # Banner com leitura do sensor IoT (temperatura e umidade)
│   │   │   ├── ShopCart.tsx             # Carrinho de compras
│   │   │   ├── ShopConnectionError.tsx  # Indicador de erro de conexão com o servidor
│   │   │   ├── ShopHeader.tsx           # Cabeçalho da loja com contador do carrinho
│   │   │   ├── ShopOrderHistory.tsx     # Últimos 3 pedidos com link para histórico completo
│   │   │   ├── ShopProductCard.tsx      # Card de produto com estoque em tempo real
│   │   │   └── ShopProductSection.tsx   # Seção de produtos por categoria
│   │   ├── workout/
│   │   │   ├── ExerciseEntryItem.tsx    # Item de exercício com campos editáveis e reordenação
│   │   │   ├── ExercisePicker.tsx       # Seletor de exercício com busca e filtro por tipo
│   │   │   ├── LogWorkoutModal.tsx      # Modal de registrar/editar treino
│   │   │   └── TemplatesModal.tsx       # Modal de gerenciar templates customizados
│   │   ├── CustomButton.tsx
│   │   ├── CustomInput.tsx              # Input com react-hook-form e validação
│   │   ├── CustomPicker.tsx             # Picker cross-platform (iOS/Android)
│   │   ├── FormWrapper.tsx              # KeyboardAvoidingView wrapper
│   │   ├── ScreenPageContainer.tsx
│   │   └── ScreenPageTitle.tsx
│   ├── constants/
│   │   ├── diet.ts            # Chaves do AsyncStorage e lista padrão de alimentos
│   │   ├── pickerOptions.ts   # Opções reutilizáveis para os pickers de sexo, objetivo e nível de atividade
│   │   ├── routes.ts          # Rotas tipadas com Href
│   │   ├── shop.ts            # Chaves do AsyncStorage da loja
│   │   ├── store.ts           # Dados mockados dos produtos
│   │   ├── usersKey.ts        # Chaves do AsyncStorage de usuários
│   │   ├── validations.ts     # Validação dos forms
│   │   └── workout.ts         # Chaves do AsyncStorage, exercícios padrão e templates sugeridos
│   └── lib/
│       └── utils/
│           ├── cn.ts        # Utilitário clsx + twMerge
│           ├── nutrition.ts # Cálculo de meta calórica (Mifflin-St Jeor) e macros
│           └── workout.ts   # Cálculo de calorias por exercício (MET), range semanal
```

---

## Telas Principais

| Tela         | Descrição                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Login**    | Formulário com validação de e-mail e senha                                                                                     |
| **Cadastro** | Nome, e-mail, senha, idade, altura, peso, sexo, objetivo e nível de atividade                                                  |
| **Home**     | Saudação por horário, navegação por data, 5 refeições com cálculo de calorias e macros, meta diária com indicador de progresso |
| **Treinos**  | Registro de treinos com templates sugeridos por objetivo, templates customizados, recap semanal e navegação por data           |
| **Loja**     | Produtos com estoque em tempo real, carrinho, finalização de pedido e sensor IoT do armazém                                    |
| **Pedidos**  | Histórico completo de pedidos com rastreamento de status em tempo real via Socket.IO                                           |
| **Perfil**   | Foto de perfil, dados do usuário, edição inline e botões de sair e apagar conta                                                |

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js 24+
- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### 1. Clonar o repositório

```bash
git clone https://github.com/Gabriel-Leao/fitaura.app.ui.git
cd fitaura.app.ui
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Iniciar o servidor Socket.IO

Em um terminal separado, na raiz do projeto:

```bash
npm run server
```

### 4. Iniciar o projeto

Na mesma rede Wi-Fi que o celular:

```bash
npm run dev
```

Se estiver em redes diferentes (dados móveis, VPN, etc.):

```bash
npm run dev-tunnel
```

> O `dev-tunnel` usa ngrok internamente. Se aparecer erro de tunnel, instale globalmente:
>
> ```bash
> npm i -g @expo/ngrok
> ```

### 5. Abrir no celular

1. Baixe o **Expo Go** no seu aparelho
2. Escaneie o **QR Code** exibido no terminal
3. O app abre automaticamente

> **Atenção:** ao testar no celular físico, substitua `localhost` pelo IP da sua máquina na rede local no arquivo `src/components/context/shop/ShopProvider.tsx` (ex: `http://192.168.1.100:3001`).

---

## Rodar no Emulador Android

1. Instale o [Android Studio](https://developer.android.com/studio)
2. Abra o Android Studio, vá em **Virtual Device Manager** e crie um dispositivo virtual (AVD)
3. Inicie o AVD pelo botão de play no Virtual Device Manager
4. Com o emulador aberto, rode na raiz do projeto:

```bash
npm run server
npm run dev
```

5. No terminal do Expo, pressione `a`

---

## Rodar no Simulador iOS (somente macOS)

1. Instale o [Xcode](https://apps.apple.com/br/app/xcode/id497799835) pela App Store
2. Após instalar, abra o Xcode pelo menos uma vez para concluir a instalação dos componentes adicionais
3. Instale o simulador iOS: no Xcode, vá em **Settings → Platforms** e baixe a versão do iOS desejada
4. Com o Xcode instalado, rode na raiz do projeto:

```bash
npm run server
npm run dev
```

5. No terminal do Expo, pressione `i`

---

## Tecnologias Utilizadas

| Tecnologia          | Uso                                       |
| ------------------- | ----------------------------------------- |
| React Native + Expo | Base do app                               |
| Expo Router         | Navegação baseada em arquivos             |
| TypeScript          | Tipagem estática                          |
| NativeWind          | Estilização com Tailwind CSS              |
| React Hook Form     | Formulários e validações                  |
| AsyncStorage        | Persistência local                        |
| expo-crypto         | Hash SHA-256 de senhas e geração de UUIDs |
| expo-image-picker   | Câmera e galeria para foto de perfil      |
| Socket.IO           | Servidor de comunicação em tempo real     |
| socket.io-client    | Cliente Socket.IO no app React Native     |

---

## Licença

Projeto desenvolvido para fins acadêmicos — Licença MIT.
