import { Text, TextInput, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import {
  EXERCISE_TYPE_COLORS,
  EXERCISE_TYPE_LABELS,
  type ExerciseEntryInput,
  ExerciseType,
} from '@/@types/workout'

type FieldProps = {
  label: string
  value: number
  step: number
  min: number
  onInc: () => void
  onDec: () => void
  onChange: (v: number) => void
  suffix?: string
  decimal?: boolean
}

const Field = ({ label, value, min, onInc, onDec, onChange, suffix, decimal }: FieldProps) => (
  <View className='items-center gap-1'>
    <Text className='text-xs text-gray-400'>{label}</Text>
    <View className='flex-row items-center gap-1'>
      <TouchableOpacity
        onPress={onDec}
        className='h-8 w-8 items-center justify-center rounded-lg bg-white/10'>
        <FontAwesome5
          name='minus'
          size={9}
          color='white'
        />
      </TouchableOpacity>
      <TextInput
        value={decimal ? value.toFixed(1) : String(value)}
        onChangeText={(v) => {
          const parsed = decimal ? parseFloat(v) : parseInt(v)
          onChange(isNaN(parsed) ? min : Math.max(min, parsed))
        }}
        keyboardType={decimal ? 'decimal-pad' : 'numeric'}
        className='w-14 rounded-lg bg-white/10 py-1.5 text-center text-sm text-white'
      />
      <TouchableOpacity
        onPress={onInc}
        className='h-8 w-8 items-center justify-center rounded-lg bg-white/10'>
        <FontAwesome5
          name='plus'
          size={9}
          color='white'
        />
      </TouchableOpacity>
    </View>
    {suffix && <Text className='text-xs text-gray-500'>{suffix}</Text>}
  </View>
)

type ExerciseEntryItemProps = {
  entry: ExerciseEntryInput
  onChange: (updated: ExerciseEntryInput) => void
  onRemove: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  isFirst?: boolean
  isLast?: boolean
}

export const ExerciseEntryItem = ({
  entry,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: ExerciseEntryItemProps) => {
  const u = (field: Partial<ExerciseEntryInput>) => onChange({ ...entry, ...field })
  const color = EXERCISE_TYPE_COLORS[entry.type]

  return (
    <View className='mb-3 rounded-xl border border-white/10 p-3'>
      <View className='mb-3 flex-row items-center justify-between'>
        <View className='flex-1 flex-row items-center gap-2'>
          <View
            style={{ backgroundColor: color + '25', borderColor: color }}
            className='rounded-full border px-2 py-0.5'>
            <Text
              style={{ color }}
              className='text-xs font-semibold'>
              {EXERCISE_TYPE_LABELS[entry.type]}
            </Text>
          </View>
          <Text className='flex-1 text-sm font-semibold text-white'>{entry.exerciseName}</Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <View className='flex-col gap-0.5'>
            <TouchableOpacity
              onPress={onMoveUp}
              disabled={isFirst}
              className='h-6 w-6 items-center justify-center rounded-md bg-white/10 disabled:opacity-30'>
              <FontAwesome5
                name='chevron-up'
                size={9}
                color='white'
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onMoveDown}
              disabled={isLast}
              className='h-6 w-6 items-center justify-center rounded-md bg-white/10 disabled:opacity-30'>
              <FontAwesome5
                name='chevron-down'
                size={9}
                color='white'
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={onRemove}
            className='p-1'>
            <FontAwesome5
              name='trash-alt'
              size={12}
              color='#ef4444'
            />
          </TouchableOpacity>
        </View>
      </View>

      {entry.type === ExerciseType.Strength ? (
        <View className='flex-row justify-around'>
          <Field
            label='Séries'
            value={entry.sets}
            step={1}
            min={1}
            suffix='x'
            onInc={() => u({ sets: entry.sets + 1 })}
            onDec={() => u({ sets: Math.max(1, entry.sets - 1) })}
            onChange={(v) => u({ sets: v })}
          />
          <Field
            label='Reps'
            value={entry.reps}
            step={1}
            min={1}
            suffix='un'
            onInc={() => u({ reps: entry.reps + 1 })}
            onDec={() => u({ reps: Math.max(1, entry.reps - 1) })}
            onChange={(v) => u({ reps: v })}
          />
          <Field
            label='Carga'
            value={entry.weightKg}
            step={5}
            min={0}
            suffix='kg'
            onInc={() => u({ weightKg: entry.weightKg + 5 })}
            onDec={() => u({ weightKg: Math.max(0, entry.weightKg - 5) })}
            onChange={(v) => u({ weightKg: v })}
          />
        </View>
      ) : (
        <View className='flex-row justify-around'>
          <Field
            label='Duração'
            value={entry.durationMinutes}
            step={5}
            min={1}
            suffix='min'
            onInc={() => u({ durationMinutes: entry.durationMinutes + 5 })}
            onDec={() => u({ durationMinutes: Math.max(1, entry.durationMinutes - 5) })}
            onChange={(v) => u({ durationMinutes: v })}
          />
          {entry.type === ExerciseType.Cardio && (
            <Field
              label='Distância'
              value={entry.distanceKm}
              step={0.5}
              min={0}
              suffix='km'
              decimal
              onInc={() => u({ distanceKm: Math.round((entry.distanceKm + 0.5) * 10) / 10 })}
              onDec={() =>
                u({ distanceKm: Math.max(0, Math.round((entry.distanceKm - 0.5) * 10) / 10) })
              }
              onChange={(v) => u({ distanceKm: v })}
            />
          )}
        </View>
      )}
    </View>
  )
}
