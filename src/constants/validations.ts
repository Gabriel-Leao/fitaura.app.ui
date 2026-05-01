export const VALIDATIONS = {
  name: {
    required: 'Nome é obrigatório',
    pattern: {
      value: /^[A-Za-zÀ-ÖØ-öø-ÿ]{3,}(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]{2,})+$/,
      message: 'Nome inválido',
    },
  },

  email: {
    required: 'E-mail é obrigatório',
    pattern: {
      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      message: 'E-mail inválido',
    },
  },

  password: {
    required: 'Senha é obrigatória',
    minLength: {
      value: 8,
      message: 'A senha deve ter no mínimo 8 caracteres',
    },
  },

  age: {
    required: 'Idade é obrigatória',
    min: {
      value: 18,
      message: 'Mínimo 18 anos',
    },
    max: {
      value: 120,
      message: 'Idade muito alta',
    },
    pattern: {
      value: /^[0-9]+$/,
      message: 'Apenas números inteiros',
    },
  },

  height: {
    required: 'Altura é obrigatória',
    min: {
      value: 120,
      message: 'Mínima 120 cm',
    },
    max: {
      value: 250,
      message: 'Máxima 250 cm',
    },
    pattern: {
      value: /^[0-9]+$/,
      message: 'Use apenas números (ex: 175)',
    },
  },

  weight: {
    required: 'Peso é obrigatório',
    min: {
      value: 30,
      message: 'Peso mínimo é 30 kg',
    },
    max: {
      value: 300,
      message: 'Peso máximo é 300 kg',
    },
    pattern: {
      value: /^[0-9]+$/,
      message: 'Use apenas números (ex: 75)',
    },
  },
}
