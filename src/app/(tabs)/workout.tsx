import { useCallback, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useFocusEffect } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { ExerciseType, type WorkoutLog } from '@/@types/workout'
import { useWorkoutContext } from '@/components/context/workout/useWorkoutContext'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import { LogWorkoutModal } from '@/components/workout/LogWorkoutModal'
import { TemplatesModal } from '@/components/workout/TemplatesModal'
import { formatWeekRange } from '@/lib/utils/workout'

const toDateString = (date: Date): string => date.toISOString().split('T')[0]

const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function Workout() {
  const { getDayLogs, getWeeklyStats, removeLog } = useWorkoutContext()

  const [currentDate, setCurrentDate] = useState<string>(toDateString(new Date()))
  const [openLogs, setOpenLogs] = useState<string[]>([])
  const [showLogModal, setShowLogModal] = useState<boolean>(false)
  const [showTemplatesModal, setShowTemplatesModal] = useState<boolean>(false)
  const [editingLog, setEditingLog] = useState<WorkoutLog | null>(null)

  useFocusEffect(
    useCallback(() => {
      setCurrentDate(toDateString(new Date()))
    }, []),
  )

  const today = toDateString(new Date())
  const dayLogs = getDayLogs(currentDate)
  const weeklyStats = getWeeklyStats(currentDate)
  const weekRange = formatWeekRange(currentDate)
  const isToday = currentDate === today

  const goBack = () => {
    const [y, m, d] = currentDate.split('-').map(Number)
    setCurrentDate(toDateString(new Date(y, m - 1, d - 1)))
  }

  const goForward = () => {
    const [y, m, d] = currentDate.split('-').map(Number)
    const nextStr = toDateString(new Date(y, m - 1, d + 1))
    if (nextStr <= today) setCurrentDate(nextStr)
  }

  const toggleLog = (id: string) =>
    setOpenLogs((prev) => (prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]))

  return (
    <ScreenPageContainer className='py-20'>
      <ScrollView
        className='px-5'
        showsVerticalScrollIndicator={false}>
        <Text className='mb-6 text-center text-2xl font-bold text-white'>Seus treinos</Text>

        <View className='mb-6 rounded-2xl border border-[#B872FF]/40 bg-[#B872FF]/20 p-4'>
          <Text className='mb-1 text-center text-xs text-gray-400'>Semana {weekRange}</Text>
          <Text className='text-center text-3xl font-bold text-white'>
            {weeklyStats.totalWorkouts}{' '}
            <Text className='text-xl font-normal text-gray-300'>
              treino{weeklyStats.totalWorkouts !== 1 ? 's' : ''}
            </Text>
          </Text>

          <View className='mt-3 flex-row justify-around border-t border-white/10 pt-3'>
            <View className='items-center'>
              <Text className='text-xs text-gray-400'>Calorias</Text>
              <Text className='font-semibold text-white'>{weeklyStats.totalCalories}</Text>
              <Text className='text-xs text-gray-500'>kcal</Text>
            </View>
            <View className='items-center'>
              <Text className='text-xs text-gray-400'>Peso total</Text>
              <Text className='font-semibold text-white'>
                {weeklyStats.totalWeightLifted.toLocaleString('pt-BR')}
              </Text>
              <Text className='text-xs text-gray-500'>kg</Text>
            </View>
            <View className='items-center'>
              <Text className='text-xs text-gray-400'>Distância</Text>
              <Text className='font-semibold text-white'>{weeklyStats.totalDistanceKm}</Text>
              <Text className='text-xs text-gray-500'>km</Text>
            </View>
            <View className='items-center'>
              <Text className='text-xs text-gray-400'>Tempo</Text>
              <Text className='font-semibold text-white'>{weeklyStats.totalDurationMinutes}</Text>
              <Text className='text-xs text-gray-500'>min</Text>
            </View>
          </View>
        </View>

        <View className='mb-4 flex-row items-center justify-between'>
          <TouchableOpacity
            onPress={goBack}
            className='p-2'>
            <FontAwesome5
              name='chevron-left'
              size={16}
              color='white'
            />
          </TouchableOpacity>
          <Text className='font-semibold capitalize text-white'>
            {isToday ? 'Hoje' : formatDate(currentDate)}
          </Text>
          <TouchableOpacity
            onPress={goForward}
            disabled={isToday}
            className='p-2'>
            <FontAwesome5
              name='chevron-right'
              size={16}
              color={isToday ? '#444' : 'white'}
            />
          </TouchableOpacity>
        </View>

        <View className='mb-4 flex-row gap-3'>
          <TouchableOpacity
            onPress={() => setShowLogModal(true)}
            className='flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-[#B872FF] py-3'>
            <FontAwesome5
              name='plus'
              size={14}
              color='white'
            />
            <Text className='font-semibold text-white'>Registrar treino</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowTemplatesModal(true)}
            className='flex-row items-center gap-2 rounded-xl bg-white/10 px-4 py-3'>
            <FontAwesome5
              name='list'
              size={14}
              color='#B872FF'
            />
            <Text className='text-sm text-[#B872FF]'>Templates</Text>
          </TouchableOpacity>
        </View>

        {dayLogs.length === 0 ? (
          <View className='items-center py-10'>
            <FontAwesome5
              name='dumbbell'
              size={32}
              color='#444'
            />
            <Text className='mt-3 text-center text-gray-500'>
              Nenhum treino registrado {isToday ? 'hoje' : 'neste dia'}.
            </Text>
          </View>
        ) : (
          dayLogs.map((log) => {
            const isOpen = openLogs.includes(log.id)
            return (
              <View
                key={log.id}
                className='mb-4 overflow-hidden rounded-2xl border border-white/10'>
                <TouchableOpacity
                  onPress={() => toggleLog(log.id)}
                  className='flex-row items-center justify-between p-4'>
                  <View className='flex-1'>
                    <Text className='font-semibold text-white'>{log.templateName}</Text>
                    <Text className='mt-0.5 text-xs text-gray-400'>
                      {log.exercises.length} exercício(s) • {log.totalCalories} kcal •{' '}
                      {log.totalDurationMinutes} min
                    </Text>
                  </View>
                  <View className='flex-row items-center gap-3'>
                    <TouchableOpacity
                      onPress={() => setEditingLog(log)}
                      className='p-1'>
                      <FontAwesome5
                        name='edit'
                        size={13}
                        color='#B872FF'
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeLog(log.id)}
                      className='p-1'>
                      <FontAwesome5
                        name='trash-alt'
                        size={12}
                        color='#ef4444'
                      />
                    </TouchableOpacity>
                    <FontAwesome5
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color='white'
                    />
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View className='px-4 pb-4'>
                    {log.exercises.map((exercise) => (
                      <View
                        key={exercise.id}
                        className='border-b border-white/5 py-2'>
                        <Text className='text-sm text-white'>{exercise.exerciseName}</Text>
                        <Text className='text-xs text-gray-400'>
                          {exercise.type === ExerciseType.Strength
                            ? `${exercise.sets} séries × ${exercise.reps} reps${exercise.weightKg > 0 ? ` @ ${exercise.weightKg}kg` : ''}`
                            : `${exercise.durationMinutes} min${exercise.distanceKm > 0 ? ` • ${exercise.distanceKm}km` : ''}`}
                          {' • '}
                          {exercise.caloriesBurned} kcal
                        </Text>
                      </View>
                    ))}
                    {log.totalWeightLifted > 0 && (
                      <Text className='mt-2 text-xs text-gray-500'>
                        Peso total levantado: {log.totalWeightLifted.toLocaleString('pt-BR')} kg
                      </Text>
                    )}
                  </View>
                )}
              </View>
            )
          })
        )}
      </ScrollView>

      <LogWorkoutModal
        visible={showLogModal}
        date={currentDate}
        onClose={() => setShowLogModal(false)}
      />

      {editingLog && (
        <LogWorkoutModal
          visible={!!editingLog}
          date={currentDate}
          editLog={editingLog}
          onClose={() => setEditingLog(null)}
        />
      )}

      <TemplatesModal
        visible={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
      />
    </ScreenPageContainer>
  )
}
