# Fitaura App

Aplicativo mobile focado em auxiliar na organização de rotina fitness, permitindo o gerenciamento de **usuários**, **acompanhamento alimentar**, **registro de treinos** e uma **loja** com produtos relacionados ao estilo de vida saudável.

---

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

---

## Estrutura do Projeto

```
src/
├── @types/
│   ├── diet.ts           # Tipos e enums da dieta (FoodType, MealId, Food, MealEntry, etc.)
│   ├── enums.ts          # Enums globais: UserGoal, UserSex, ActivityLevel
│   ├── forms.ts          # Tipos dos formulários: SignInFormData e SignUpFormData
│   ├── user.tsx          # Tipo User
│   └── workout.ts        # Tipos e enums de treino (ExerciseType, WorkoutTemplate, WorkoutLog, etc.)
├── app/
│   ├── _layout.tsx       # Root layout com UserProvider, DietProvider e WorkoutProvider
│   ├── (auth)/
│   │   ├── _layout.tsx   # Redireciona para home se logado
│   │   ├── sign-in.tsx   # Tela de login
│   │   └── sign-up.tsx   # Tela de cadastro
│   └── (tabs)/
│       ├── _layout.tsx   # Tab navigator com guard de autenticação
│       ├── index.tsx     # Home — refeições do dia, macros e meta calórica
│       ├── workout.tsx   # Treinos — registro, templates e recap semanal
│       ├── shop.tsx      # Loja
│       └── profile.tsx   # Perfil do usuário com edição inline
├── assets/
│   └── images/           # Imagens dos produtos da loja
├── components/
│   ├── context/
│   │   ├── diet/
│   │   │   ├── DietProvider.tsx      # Contexto global de dieta e alimentos
│   │   │   └── useDietContext.ts     # Hook para consumir o contexto de dieta
│   │   ├── user/
│   │   │   ├── UserProvider.tsx      # Contexto global de autenticação
│   │   │   └── useUserContext.ts     # Hook para consumir o contexto de usuário
│   │   └── workout/
│   │       ├── WorkoutProvider.tsx   # Contexto global de treinos e templates
│   │       └── useWorkoutContext.ts  # Hook para consumir o contexto de treino
│   ├── diet/
│   │   ├── AddEntryModal.tsx         # Modal de adicionar alimento à refeição
│   │   ├── AddFoodForm.tsx           # Formulário de cadastro de alimento customizado
│   │   ├── FoodListItem.tsx          # Item da lista de alimentos
│   │   ├── MacroPreview.tsx          # Card de preview de calorias e macros
│   │   └── QuantitySelector.tsx      # Seletor de quantidade com atalhos e +/-
│   ├── workout/
│   │   ├── ExerciseEntryItem.tsx     # Item de exercício com campos editáveis e reordenação
│   │   ├── ExercisePicker.tsx        # Seletor de exercício com busca e filtro por tipo
│   │   ├── LogWorkoutModal.tsx       # Modal de registrar/editar treino
│   │   └── TemplatesModal.tsx        # Modal de gerenciar templates customizados
│   ├── CustomButton.tsx
│   ├── CustomInput.tsx               # Input com react-hook-form e validação
│   ├── CustomPicker.tsx              # Picker cross-platform (iOS/Android)
│   ├── FormWrapper.tsx               # KeyboardAvoidingView wrapper
│   ├── ScreenPageContainer.tsx
│   └── ScreenPageTitle.tsx
├── constants/
│   ├── diet.ts           # Chaves do AsyncStorage e lista padrão de alimentos
│   ├── routes.ts         # Rotas tipadas com Href
│   ├── store.ts          # Dados mockados da loja
│   ├── usersKey.ts       # Chaves do AsyncStorage de usuários
│   └── workout.ts        # Chaves do AsyncStorage, exercícios padrão e templates sugeridos
└── lib/
    └── utils/
        ├── cn.ts          # Utilitário clsx + twMerge
        ├── nutrition.ts   # Cálculo de meta calórica (Mifflin-St Jeor) e macros
        └── workout.ts     # Cálculo de calorias por exercício (MET), range semanal
```

---

## Telas Principais

| Tela         | Descrição                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Login**    | Formulário com validação de e-mail e senha                                                                                     |
| **Cadastro** | Nome, e-mail, senha, idade, altura, peso, sexo, objetivo e nível de atividade                                                  |
| **Home**     | Saudação por horário, navegação por data, 5 refeições com cálculo de calorias e macros, meta diária com indicador de progresso |
| **Treinos**  | Registro de treinos com templates sugeridos por objetivo, templates customizados, recap semanal e navegação por data           |
| **Loja**     | Produtos por categoria (Whey, Creatina, Hipercalórico)                                                                         |
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

### 3. Iniciar o projeto

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

### 4. Abrir no celular

1. Baixe o **Expo Go** no seu aparelho
2. Escaneie o **QR Code** exibido no terminal
3. O app abre automaticamente

---

## Rodar no Emulador Android

1. Instale o **Android Studio** e configure um dispositivo virtual (AVD)
2. Rode `npm run dev`
3. Pressione `a` no terminal do Expo

## Rodar no Simulador iOS (somente macOS)

1. Instale o **Xcode** pela App Store
2. Rode `npm run dev`
3. Pressione `i` no terminal do Expo

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

---

## Licença

Projeto desenvolvido para fins acadêmicos — Licença MIT.
