import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import ScreenPageContainer from '@/components/ScreenPageContainer'
import ScreenPageTitle from '@/components/ScreenPageTitle'

const workouts = [
  {
    title: 'Treino A — Peito / Tríceps',
    exercises: [
      { name: 'Supino reto', sets: 4, reps: '8-12', load: '50kg' },
      { name: 'Supino inclinado', sets: 3, reps: '10-12', load: '40kg' },
      { name: 'Crossover', sets: 3, reps: '12-15' },
      { name: 'Paralelas', sets: 3, reps: 'Até falhar' },
      { name: 'Tríceps corda', sets: 3, reps: '12-15', load: '25kg' },
    ],
  },
  {
    title: 'Treino B — Costas / Bíceps',
    exercises: [
      { name: 'Puxada na barra', sets: 4, reps: '6-10' },
      { name: 'Remada baixa', sets: 4, reps: '8-12', load: '55kg' },
      { name: 'Pull down', sets: 3, reps: '10-12', load: '35kg' },
      { name: 'Rosca direta', sets: 3, reps: '10-12', load: '12kg' },
      { name: 'Rosca alternada', sets: 3, reps: '12-15', load: '10kg' },
    ],
  },
  {
    title: 'Treino C — Pernas / Ombro',
    exercises: [
      { name: 'Agachamento livre', sets: 4, reps: '6-10', load: '80kg' },
      { name: 'Leg press', sets: 4, reps: '10-12', load: '150kg' },
      { name: 'Cadeira extensora', sets: 3, reps: '12-15', load: '45kg' },
      { name: 'Elevação lateral', sets: 4, reps: '12-15', load: '8kg' },
      { name: 'Desenvolvimento', sets: 3, reps: '8-12', load: '35kg' },
    ],
  },
]

const Workout = () => {
  const [openSections, setOpenSections] = useState<number[]>([])

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    )
  }

  return (
    <ScreenPageContainer className='py-20'>
      <ScrollView className='px-5 pb-10'>
        <ScreenPageTitle>Seus treinos</ScreenPageTitle>

        <Text className='mb-6 mt-1 text-center text-base text-white'>
          Toque em um treino para ver os exercícios.
        </Text>

        {workouts.map((workout, i) => {
          const isOpen = openSections.includes(i)

          return (
            <View
              key={i}
              className='mb-6 rounded-2xl border border-gray-700 p-4'>
              <TouchableOpacity
                className='flex flex-row items-center justify-between'
                onPress={() => toggleSection(i)}>
                <Text className='text-lg font-semibold text-white'>{workout.title}</Text>

                <FontAwesome5
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color='white'
                />
              </TouchableOpacity>

              {isOpen && (
                <View className='mt-4'>
                  {workout.exercises.map((ex, j) => (
                    <View
                      key={j}
                      className='border-b border-gray-800 py-2'>
                      <Text className='text-base text-white'>{ex.name}</Text>

                      <Text className='mt-1 text-sm text-gray-400'>
                        {ex.sets} séries — {ex.reps}
                        {ex.load ? ` • carga: ${ex.load}` : ''}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>
    </ScreenPageContainer>
  )
}

export default Workout
