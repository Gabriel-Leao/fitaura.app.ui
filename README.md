# Fitaura App

Aplicativo mobile focado em auxiliar na organização de rotina fitness, permitindo o gerenciamento de **usuários**, **visualização de treinos**, **acompanhamento alimentar** e uma **loja** com produtos relacionados ao estilo de vida saudável.

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

- **Criar usuário** com validações de nome, e-mail, idade, altura, sexo e objetivo
- **Login e Logout** com autenticação local
- **Excluir usuário**
- **Senhas armazenadas com hash SHA-256** via `expo-crypto`
- **Persistência local com AsyncStorage** — sessão e usuários sobrevivem ao fechamento do app
- **Tela Home** com saudação dinâmica por horário e refeições com totais nutricionais
- **Tela de Treinos** com exercícios organizados por grupo muscular e acordeão interativo
- **Tela de Loja** com produtos simulados por categoria
- **Tela de Perfil** com dados do usuário, logout e exclusão de conta
- Interface estilizada com **NativeWind** (Tailwind CSS para React Native)
- Formulários com feedback de erro por campo e estado de loading nas ações assíncronas

---

## Estrutura do Projeto

```
src/
├── @types/
│   ├── enums.ts          # Enums: UserGoal e UserSex
│   ├── forms.ts          # Tipos dos formulários: SignInFormData e SignUpFormData
│   └── user.tsx          # Tipo User
├── app/
│   ├── _layout.tsx       # Root layout com UserProvider
│   ├── (auth)/
│   │   ├── _layout.tsx   # Redireciona para home se logado
│   │   ├── sign-in.tsx   # Tela de login
│   │   └── sign-up.tsx   # Tela de cadastro
│   └── (tabs)/
│       ├── _layout.tsx   # Tab navigator com guard de autenticação
│       ├── index.tsx     # Home — refeições e saudação
│       ├── workout.tsx   # Treinos
│       ├── shop.tsx      # Loja
│       └── profile.tsx   # Perfil do usuário
├── assets/
│   └── images/           # Imagens dos produtos da loja
├── components/
│   ├── context/
│   │   ├── UserProvider.tsx     # Contexto global de autenticação
│   │   └── useUserContext.ts    # Hook para consumir o contexto
│   ├── CustomButton.tsx
│   ├── CustomInput.tsx          # Input com react-hook-form e validação
│   ├── CustomPicker.tsx         # Picker cross-platform (iOS/Android)
│   ├── FormWrapper.tsx          # KeyboardAvoidingView wrapper
│   ├── ScreenPageContainer.tsx
│   └── ScreenPageTitle.tsx
├── constants/
│   ├── enums.ts          # (ver @types)
│   ├── routes.ts         # Rotas tipadas com Href
│   ├── store.ts          # Dados mockados da loja
│   └── usersKey.ts       # Chaves do AsyncStorage
└── lib/
    └── utils/
        └── cn.ts         # Utilitário clsx + twMerge
```

---

## Telas Principais

| Tela         | Descrição                                                      |
| ------------ | -------------------------------------------------------------- |
| **Login**    | Formulário com validação de e-mail e senha                     |
| **Cadastro** | Nome, e-mail, senha, idade, altura, sexo e objetivo            |
| **Home**     | Saudação por horário + refeições do dia com macros             |
| **Treinos**  | Acordeão com 3 treinos e seus exercícios (séries, reps, carga) |
| **Loja**     | Produtos por categoria (Whey, Creatina, Hipercalórico)         |
| **Perfil**   | Dados do usuário + botões de sair e apagar conta               |

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

```bash
npm run dev
```

---

## Como Executar o Projeto

### Pré-requisitos

- Node.js 24+
- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### 1. Clonar o repositório

​`bash
git clone https://github.com/Gabriel-Leao/fitaura.app.ui.git
cd fitaura.app.ui
​`

### 2. Instalar dependências

​`bash
npm install
​`

### 3. Iniciar o projeto

Na mesma rede Wi-Fi que o celular:

​`bash
npm run dev
​`

Se estiver em redes diferentes (dados móveis, VPN, etc.):

​`bash
npm run dev-tunnel
​`

> O `dev-tunnel` usa ngrok internamente. Se aparecer erro de tunnel, instale globalmente:
>
> ```bash
> npm install -g @expo/ngrok@^4.0.1
> ```

---

## Tecnologias Utilizadas

| Tecnologia          | Uso                           |
| ------------------- | ----------------------------- |
| React Native + Expo | Base do app                   |
| Expo Router         | Navegação baseada em arquivos |
| TypeScript          | Tipagem estática              |
| NativeWind          | Estilização com Tailwind CSS  |
| React Hook Form     | Formulários e validações      |
| AsyncStorage        | Persistência local            |
| expo-crypto         | Hash SHA-256 de senhas        |
| expo-router         | Navegação e redirecionamentos |

---

## Licença

Projeto desenvolvido para fins acadêmicos — Licença MIT.
