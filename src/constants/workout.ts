import { UserGoal } from '@/@types/enums'
import { type Exercise, ExerciseType, MuscleGroup, type WorkoutTemplate } from '@/@types/workout'

export const WORKOUT_LOGS_KEY = '@fitaura:workout_logs'
export const CUSTOM_TEMPLATES_KEY = '@fitaura:custom_templates'
export const CUSTOM_EXERCISES_KEY = '@fitaura:custom_exercises'

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'supino-reto',
    name: 'Supino reto',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Chest,
  },
  {
    id: 'supino-inclinado',
    name: 'Supino inclinado',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Chest,
  },
  {
    id: 'supino-declinado',
    name: 'Supino declinado',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Chest,
  },
  {
    id: 'crucifixo',
    name: 'Crucifixo',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Chest,
  },
  {
    id: 'crossover',
    name: 'Crossover',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Chest,
  },
  {
    id: 'paralelas-peito',
    name: 'Paralelas (peito)',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Chest,
  },
  {
    id: 'flexao',
    name: 'Flexão de braço',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Chest,
  },
  {
    id: 'puxada-barra',
    name: 'Puxada na barra',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Back,
  },
  {
    id: 'remada-baixa',
    name: 'Remada baixa',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Back,
  },
  {
    id: 'remada-unilateral',
    name: 'Remada unilateral',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Back,
  },
  {
    id: 'remada-curvada',
    name: 'Remada curvada',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Back,
  },
  {
    id: 'pull-down',
    name: 'Pull down',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Back,
  },
  {
    id: 'levantamento-terra',
    name: 'Levantamento terra',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Back,
  },
  {
    id: 'hiperextensao',
    name: 'Hiperextensão',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Back,
  },
  {
    id: 'agachamento',
    name: 'Agachamento livre',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Legs,
  },
  {
    id: 'agachamento-hack',
    name: 'Agachamento hack',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Legs,
  },
  {
    id: 'leg-press',
    name: 'Leg press',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Legs,
  },
  {
    id: 'cadeira-extensora',
    name: 'Cadeira extensora',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Legs,
  },
  {
    id: 'cadeira-flexora',
    name: 'Cadeira flexora',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Legs,
  },
  { id: 'stiff', name: 'Stiff', type: ExerciseType.Strength, muscleGroup: MuscleGroup.Legs },
  {
    id: 'afundo',
    name: 'Avanço/Afundo',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Legs,
  },
  {
    id: 'panturrilha',
    name: 'Panturrilha',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Legs,
  },
  { id: 'abdutora', name: 'Abdutora', type: ExerciseType.Strength, muscleGroup: MuscleGroup.Legs },
  { id: 'adutora', name: 'Adutora', type: ExerciseType.Strength, muscleGroup: MuscleGroup.Legs },
  {
    id: 'desenvolvimento',
    name: 'Desenvolvimento',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Shoulders,
  },
  {
    id: 'elevacao-lateral',
    name: 'Elevação lateral',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Shoulders,
  },
  {
    id: 'elevacao-frontal',
    name: 'Elevação frontal',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Shoulders,
  },
  {
    id: 'remada-alta',
    name: 'Remada alta',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Shoulders,
  },
  {
    id: 'encolhimento',
    name: 'Encolhimento',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Shoulders,
  },
  {
    id: 'rosca-direta',
    name: 'Rosca direta',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Biceps,
  },
  {
    id: 'rosca-alternada',
    name: 'Rosca alternada',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Biceps,
  },
  {
    id: 'rosca-martelo',
    name: 'Rosca martelo',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Biceps,
  },
  {
    id: 'rosca-concentrada',
    name: 'Rosca concentrada',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Biceps,
  },
  {
    id: 'rosca-scott',
    name: 'Rosca scott',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Biceps,
  },
  {
    id: 'triceps-corda',
    name: 'Tríceps corda',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Triceps,
  },
  {
    id: 'triceps-testa',
    name: 'Tríceps testa',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Triceps,
  },
  {
    id: 'triceps-pulley',
    name: 'Tríceps pulley',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Triceps,
  },
  {
    id: 'triceps-frances',
    name: 'Tríceps francês',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Triceps,
  },
  {
    id: 'mergulho-triceps',
    name: 'Mergulho (tríceps)',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Triceps,
  },
  {
    id: 'abdominal',
    name: 'Abdominal',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Core,
  },
  { id: 'prancha', name: 'Prancha', type: ExerciseType.Strength, muscleGroup: MuscleGroup.Core },
  {
    id: 'abdominal-obliquo',
    name: 'Abdominal oblíquo',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Core,
  },
  {
    id: 'elevacao-pernas',
    name: 'Elevação de pernas',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Core,
  },
  {
    id: 'abdominal-infra',
    name: 'Abdominal infra',
    type: ExerciseType.Strength,
    muscleGroup: MuscleGroup.Core,
  },
  { id: 'corrida', name: 'Corrida', type: ExerciseType.Cardio, muscleGroup: MuscleGroup.Cardio },
  {
    id: 'bike',
    name: 'Bicicleta/Bike',
    type: ExerciseType.Cardio,
    muscleGroup: MuscleGroup.Cardio,
  },
  { id: 'hiit', name: 'HIIT', type: ExerciseType.Cardio, muscleGroup: MuscleGroup.Cardio },
  {
    id: 'pular-corda',
    name: 'Pular corda',
    type: ExerciseType.Cardio,
    muscleGroup: MuscleGroup.Cardio,
  },
  { id: 'eliptico', name: 'Elíptico', type: ExerciseType.Cardio, muscleGroup: MuscleGroup.Cardio },
  {
    id: 'remo-ergometrico',
    name: 'Remo ergométrico',
    type: ExerciseType.Cardio,
    muscleGroup: MuscleGroup.Cardio,
  },
  { id: 'esteira', name: 'Esteira', type: ExerciseType.Cardio, muscleGroup: MuscleGroup.Cardio },
  {
    id: 'caminhada',
    name: 'Caminhada',
    type: ExerciseType.Aerobic,
    muscleGroup: MuscleGroup.Aerobic,
  },
  { id: 'natacao', name: 'Natação', type: ExerciseType.Aerobic, muscleGroup: MuscleGroup.Aerobic },
  { id: 'yoga', name: 'Yoga', type: ExerciseType.Aerobic, muscleGroup: MuscleGroup.Aerobic },
  {
    id: 'alongamento',
    name: 'Alongamento',
    type: ExerciseType.Aerobic,
    muscleGroup: MuscleGroup.Aerobic,
  },
  { id: 'pilates', name: 'Pilates', type: ExerciseType.Aerobic, muscleGroup: MuscleGroup.Aerobic },
  { id: 'jump', name: 'Jump', type: ExerciseType.Aerobic, muscleGroup: MuscleGroup.Aerobic },
]

const str = (
  exerciseId: string,
  exerciseName: string,
  sets: number,
  reps: number,
  weightKg: number,
): ExerciseEntryInput => ({
  exerciseId,
  exerciseName,
  type: ExerciseType.Strength,
  sets,
  reps,
  weightKg,
  durationMinutes: 0,
  distanceKm: 0,
})

const crd = (
  exerciseId: string,
  exerciseName: string,
  durationMinutes: number,
  distanceKm = 0,
): ExerciseEntryInput => ({
  exerciseId,
  exerciseName,
  type: ExerciseType.Cardio,
  sets: 0,
  reps: 0,
  weightKg: 0,
  durationMinutes,
  distanceKm,
})

const aer = (
  exerciseId: string,
  exerciseName: string,
  durationMinutes: number,
): ExerciseEntryInput => ({
  exerciseId,
  exerciseName,
  type: ExerciseType.Aerobic,
  sets: 0,
  reps: 0,
  weightKg: 0,
  durationMinutes,
  distanceKm: 0,
})

type ExerciseEntryInput = {
  exerciseId: string
  exerciseName: string
  type: ExerciseType
  sets: number
  reps: number
  weightKg: number
  durationMinutes: number
  distanceKm: number
}

export const SUGGESTED_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'sugg-hiit-core',
    name: 'HIIT + Core',
    goalTag: UserGoal.LoseWeight,
    isSuggested: true,
    exercises: [
      crd('hiit', 'HIIT', 30),
      str('abdominal', 'Abdominal', 4, 20, 0),
      str('prancha', 'Prancha', 3, 60, 0),
      str('elevacao-pernas', 'Elevação de pernas', 3, 15, 0),
    ],
  },
  {
    id: 'sugg-corrida',
    name: 'Corrida + Alongamento',
    goalTag: UserGoal.LoseWeight,
    isSuggested: true,
    exercises: [crd('corrida', 'Corrida', 40, 5), aer('alongamento', 'Alongamento', 15)],
  },
  {
    id: 'sugg-circuito',
    name: 'Circuito Full Body',
    goalTag: UserGoal.LoseWeight,
    isSuggested: true,
    exercises: [
      str('agachamento', 'Agachamento livre', 3, 15, 20),
      str('supino-reto', 'Supino reto', 3, 15, 30),
      str('remada-baixa', 'Remada baixa', 3, 15, 30),
      crd('pular-corda', 'Pular corda', 10),
    ],
  },
  {
    id: 'sugg-push',
    name: 'Push — Peito + Tríceps',
    goalTag: UserGoal.GainWeight,
    isSuggested: true,
    exercises: [
      str('supino-reto', 'Supino reto', 4, 10, 50),
      str('supino-inclinado', 'Supino inclinado', 3, 12, 40),
      str('crossover', 'Crossover', 3, 12, 15),
      str('triceps-corda', 'Tríceps corda', 4, 12, 25),
      str('triceps-testa', 'Tríceps testa', 3, 12, 15),
    ],
  },
  {
    id: 'sugg-pull',
    name: 'Pull — Costas + Bíceps',
    goalTag: UserGoal.GainWeight,
    isSuggested: true,
    exercises: [
      str('puxada-barra', 'Puxada na barra', 4, 8, 0),
      str('remada-baixa', 'Remada baixa', 4, 10, 55),
      str('pull-down', 'Pull down', 3, 12, 35),
      str('rosca-direta', 'Rosca direta', 3, 12, 12),
      str('rosca-alternada', 'Rosca alternada', 3, 12, 10),
    ],
  },
  {
    id: 'sugg-legs',
    name: 'Legs + Ombros',
    goalTag: UserGoal.GainWeight,
    isSuggested: true,
    exercises: [
      str('agachamento', 'Agachamento livre', 4, 8, 80),
      str('leg-press', 'Leg press', 4, 12, 150),
      str('cadeira-extensora', 'Cadeira extensora', 3, 15, 45),
      str('desenvolvimento', 'Desenvolvimento', 4, 10, 35),
      str('elevacao-lateral', 'Elevação lateral', 4, 12, 8),
    ],
  },
  {
    id: 'sugg-upper',
    name: 'Membros Superiores',
    goalTag: UserGoal.MaintainWeight,
    isSuggested: true,
    exercises: [
      str('supino-reto', 'Supino reto', 3, 12, 40),
      str('remada-baixa', 'Remada baixa', 3, 12, 40),
      str('desenvolvimento', 'Desenvolvimento', 3, 12, 25),
      str('rosca-direta', 'Rosca direta', 3, 12, 10),
      str('triceps-corda', 'Tríceps corda', 3, 12, 20),
    ],
  },
  {
    id: 'sugg-lower',
    name: 'Membros Inferiores',
    goalTag: UserGoal.MaintainWeight,
    isSuggested: true,
    exercises: [
      str('agachamento', 'Agachamento livre', 3, 12, 60),
      str('leg-press', 'Leg press', 3, 12, 100),
      str('cadeira-flexora', 'Cadeira flexora', 3, 12, 35),
      str('stiff', 'Stiff', 3, 12, 40),
      str('panturrilha', 'Panturrilha', 4, 20, 30),
    ],
  },
  {
    id: 'sugg-cardio-core',
    name: 'Cardio + Core',
    goalTag: UserGoal.MaintainWeight,
    isSuggested: true,
    exercises: [
      crd('corrida', 'Corrida', 30, 4),
      str('abdominal', 'Abdominal', 3, 20, 0),
      str('prancha', 'Prancha', 3, 60, 0),
    ],
  },
]
