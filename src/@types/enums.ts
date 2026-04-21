export enum UserGoal {
  LoseWeight = 'Perder peso',
  GainWeight = 'Ganhar peso',
  MaintainWeight = 'Manter peso',
}

export enum UserSex {
  Male = 'Masculino',
  Female = 'Feminino',
}

export enum ActivityLevel {
  Sedentary = 'sedentary',
  Light = 'light',
  Moderate = 'moderate',
  Active = 'active',
  VeryActive = 'very_active',
}

export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  [ActivityLevel.Sedentary]: 'Sedentário',
  [ActivityLevel.Light]: 'Levemente ativo (1–3x/semana)',
  [ActivityLevel.Moderate]: 'Moderadamente ativo (3–5x/semana)',
  [ActivityLevel.Active]: 'Muito ativo (6–7x/semana)',
  [ActivityLevel.VeryActive]: 'Extremamente ativo (atleta)',
}

export const ACTIVITY_LEVEL_MULTIPLIER: Record<ActivityLevel, number> = {
  [ActivityLevel.Sedentary]: 1.2,
  [ActivityLevel.Light]: 1.375,
  [ActivityLevel.Moderate]: 1.55,
  [ActivityLevel.Active]: 1.725,
  [ActivityLevel.VeryActive]: 1.9,
}
