import { useState } from 'react'
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import {
  type Exercise,
  EXERCISE_TYPE_COLORS,
  EXERCISE_TYPE_LABELS,
  type ExerciseEntryInput,
  ExerciseType,
  MuscleGroup,
} from '@/@types/workout'
import { useWorkoutContext } from '@/components/context/workout/useWorkoutContext'

type ExercisePickerProps = {
  onSelect: (entry: ExerciseEntryInput) => void
  onClose: () => void
}

const TYPE_FILTERS = [
  { label: 'Todos', value: null },
  { label: 'Musculação', value: ExerciseType.Strength },
  { label: 'Cardio', value: ExerciseType.Cardio },
  { label: 'Aeróbico', value: ExerciseType.Aerobic },
] as const

const DEFAULT_ENTRY: Record<
  ExerciseType,
  Omit<ExerciseEntryInput, 'exerciseId' | 'exerciseName' | 'type'>
> = {
  [ExerciseType.Strength]: { sets: 3, reps: 12, weightKg: 0, durationMinutes: 0, distanceKm: 0 },
  [ExerciseType.Cardio]: { sets: 0, reps: 0, weightKg: 0, durationMinutes: 30, distanceKm: 0 },
  [ExerciseType.Aerobic]: { sets: 0, reps: 0, weightKg: 0, durationMinutes: 30, distanceKm: 0 },
}

export const ExercisePicker = ({ onSelect, onClose }: ExercisePickerProps) => {
  const { allExercises, addCustomExercise } = useWorkoutContext()
  const [search, setSearch] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<ExerciseType | null>(null)
  const [showNew, setShowNew] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>('')
  const [newType, setNewType] = useState<ExerciseType>(ExerciseType.Strength)
  const [newMuscle, setNewMuscle] = useState<MuscleGroup>(MuscleGroup.Chest)

  const filtered = allExercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter ? e.type === typeFilter : true
    return matchSearch && matchType
  })

  const handleSelect = (exercise: Exercise) => {
    onSelect({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      type: exercise.type,
      ...DEFAULT_ENTRY[exercise.type],
    })
    onClose()
  }

  const handleSaveNew = async () => {
    if (!newName.trim()) {
      Alert.alert('Erro', 'Informe o nome do exercício.')
      return
    }
    await addCustomExercise({ name: newName.trim(), type: newType, muscleGroup: newMuscle })
    setShowNew(false)
    setNewName('')
  }

  const muscleOptions = Object.values(MuscleGroup)

  return (
    <View className='flex-1'>
      {showNew ? (
        <View className='gap-3'>
          <Text className='mb-1 text-sm text-gray-400'>Nome do exercício</Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder='Ex: Rosca inversa'
            placeholderTextColor='#666'
            className='rounded-xl bg-white/10 px-4 py-3 text-white'
          />
          <Text className='text-sm text-gray-400'>Tipo</Text>
          <View className='flex-row gap-2'>
            {Object.values(ExerciseType).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setNewType(t)}
                className={`flex-1 items-center rounded-xl py-2 ${newType === t ? 'bg-[#B872FF]' : 'bg-white/10'}`}>
                <Text className='text-xs text-white'>{EXERCISE_TYPE_LABELS[t]}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text className='text-sm text-gray-400'>Grupo muscular</Text>
          <View className='flex-row flex-wrap gap-2'>
            {muscleOptions.map((m) => (
              <TouchableOpacity
                key={m}
                onPress={() => setNewMuscle(m)}
                className={`rounded-xl px-3 py-1.5 ${newMuscle === m ? 'bg-[#B872FF]' : 'bg-white/10'}`}>
                <Text className='text-xs text-white'>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={handleSaveNew}
            className='mt-2 items-center rounded-xl bg-[#B872FF] py-3'>
            <Text className='font-bold text-white'>Salvar exercício</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowNew(false)}
            className='items-center py-2'>
            <Text className='text-gray-400'>Voltar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder='Buscar exercício...'
            placeholderTextColor='#666'
            className='mb-3 rounded-xl bg-white/10 px-4 py-3 text-white'
          />
          <View className='mb-3 flex-row gap-2'>
            {TYPE_FILTERS.map(({ label, value }) => (
              <TouchableOpacity
                key={label}
                onPress={() => setTypeFilter(value)}
                className={`flex-1 items-center rounded-xl py-1.5 ${typeFilter === value ? 'bg-[#B872FF]' : 'bg-white/10'}`}>
                <Text className='text-xs text-white'>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            style={{ maxHeight: 200 }}
            renderItem={({ item }) => {
              const color = EXERCISE_TYPE_COLORS[item.type]
              return (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  className='mb-1 flex-row items-center justify-between rounded-xl bg-white/10 px-4 py-3'>
                  <Text className='flex-1 text-white'>{item.name}</Text>
                  <View className='flex-row items-center gap-2'>
                    <Text className='text-xs text-gray-400'>{item.muscleGroup}</Text>
                    {item.isCustom && (
                      <Text
                        style={{ color }}
                        className='text-xs'>
                        ★
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )
            }}
            ListEmptyComponent={
              <Text className='py-4 text-center text-gray-500'>Nenhum exercício encontrado</Text>
            }
          />
          <TouchableOpacity
            onPress={() => setShowNew(true)}
            className='mt-3 flex-row items-center gap-2 py-2'>
            <FontAwesome5
              name='plus-circle'
              size={14}
              color='#B872FF'
            />
            <Text className='text-sm text-[#B872FF]'>Cadastrar novo exercício</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}
