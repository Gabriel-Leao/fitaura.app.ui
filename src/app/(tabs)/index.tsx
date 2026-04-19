import { useCallback, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import { useFocusEffect } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { MEAL_LABELS, type MealId } from '@/@types/diet'
import { useDietContext } from '@/components/context/diet/useDietContext'
import { useUserContext } from '@/components/context/user/useUserContext'
import { AddEntryModal } from '@/components/diet/AddEntryModal'
import ScreenPageContainer from '@/components/ScreenPageContainer'

const toDateString = (date: Date): string => date.toISOString().split('T')[0]

const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12)
    return { greeting: 'Bom dia', subtitle: 'Hoje é um ótimo dia para se cuidar.' }
  if (hour >= 12 && hour < 18)
    return { greeting: 'Boa tarde', subtitle: 'Continue firme, você está no caminho certo.' }
  return { greeting: 'Boa noite', subtitle: 'Feche o dia com leveza e equilíbrio.' }
}

export default function Index() {
  const { currentUser } = useUserContext()
  const { getDayDiet, removeEntry, getDayTotalCalories, getDayTotalMacros } = useDietContext()
  const { greeting, subtitle } = getGreeting()

  const [currentDate, setCurrentDate] = useState<string>(toDateString(new Date()))
  const [openMeals, setOpenMeals] = useState<MealId[]>([])
  const [modalMeal, setModalMeal] = useState<MealId | null>(null)

  useFocusEffect(
    useCallback(() => {
      setCurrentDate(toDateString(new Date()))
    }, []),
  )

  const today = toDateString(new Date())
  const dayDiet = getDayDiet(currentDate)
  const totalCalories = getDayTotalCalories(currentDate)
  const totalMacros = getDayTotalMacros(currentDate)

  const goBack = () => {
    const [y, m, d] = currentDate.split('-').map(Number)
    setCurrentDate(toDateString(new Date(y, m - 1, d - 1)))
  }

  const goForward = () => {
    const [y, m, d] = currentDate.split('-').map(Number)
    const nextStr = toDateString(new Date(y, m - 1, d + 1))
    if (nextStr <= today) setCurrentDate(nextStr)
  }

  const toggleMeal = (id: MealId) => {
    setOpenMeals((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]))
  }

  const isToday = currentDate === today

  return (
    <ScreenPageContainer className='py-20'>
      <ScrollView
        className='px-5'
        showsVerticalScrollIndicator={false}>
        <Text className='text-center text-2xl font-bold text-white'>
          {greeting} {currentUser?.name?.split(' ')[0]}
        </Text>
        <Text className='mb-6 mt-1 text-center text-base text-white'>{subtitle}</Text>

        <View className='mb-2 flex-row items-center justify-between'>
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

        <View className='mb-6 rounded-2xl border border-[#B872FF]/40 bg-[#B872FF]/20 p-4'>
          <Text className='mb-1 text-center text-sm text-gray-400'>Total consumido</Text>
          <Text className='text-center text-3xl font-bold text-white'>{totalCalories} kcal</Text>
          <View className='mt-3 flex-row justify-around border-t border-white/10 pt-3'>
            <View className='items-center'>
              <Text className='text-xs text-gray-400'>Proteína</Text>
              <Text className='font-semibold text-white'>{totalMacros.protein}g</Text>
            </View>
            <View className='items-center'>
              <Text className='text-xs text-gray-400'>Carboidrato</Text>
              <Text className='font-semibold text-white'>{totalMacros.carbs}g</Text>
            </View>
            <View className='items-center'>
              <Text className='text-xs text-gray-400'>Gordura</Text>
              <Text className='font-semibold text-white'>{totalMacros.fat}g</Text>
            </View>
          </View>
        </View>

        {dayDiet.meals.map((meal) => {
          const isOpen = openMeals.includes(meal.id)
          const mealTotal = meal.entries.reduce((s, e) => s + e.calories, 0)

          return (
            <View
              key={meal.id}
              className='mb-4 overflow-hidden rounded-2xl border border-white/10'>
              <TouchableOpacity
                onPress={() => toggleMeal(meal.id)}
                className='flex-row items-center justify-between p-4'>
                <View>
                  <Text className='font-semibold text-white'>{MEAL_LABELS[meal.id]}</Text>
                  <Text className='mt-0.5 text-xs text-gray-400'>
                    {meal.entries.length === 0
                      ? 'Nenhum alimento'
                      : `${meal.entries.length} item(s) • ${mealTotal} kcal`}
                  </Text>
                </View>
                <FontAwesome5
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color='white'
                />
              </TouchableOpacity>

              {isOpen && (
                <View className='px-4 pb-4'>
                  {meal.entries.length === 0 ? (
                    <Text className='py-2 text-sm text-gray-500'>Nenhum alimento adicionado.</Text>
                  ) : (
                    meal.entries.map((entry) => (
                      <View
                        key={entry.id}
                        className='flex-row items-center justify-between border-b border-white/5 py-2'>
                        <View className='flex-1'>
                          <Text className='text-sm text-white'>{entry.foodName}</Text>
                          <Text className='text-xs text-gray-400'>
                            {entry.quantity}
                            {entry.unit} • {entry.calories} kcal
                          </Text>
                          <Text className='text-xs text-gray-500'>
                            P: {entry.protein}g • C: {entry.carbs}g • G: {entry.fat}g
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => removeEntry(currentDate, meal.id, entry.id)}
                          className='p-2'>
                          <FontAwesome5
                            name='trash-alt'
                            size={12}
                            color='#ef4444'
                          />
                        </TouchableOpacity>
                      </View>
                    ))
                  )}

                  <TouchableOpacity
                    onPress={() => setModalMeal(meal.id)}
                    className='mt-3 flex-row items-center gap-2'>
                    <FontAwesome5
                      name='plus-circle'
                      size={14}
                      color='#B872FF'
                    />
                    <Text className='text-sm text-[#B872FF]'>Adicionar alimento</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>

      {modalMeal && (
        <AddEntryModal
          visible={true}
          mealId={modalMeal}
          date={currentDate}
          onClose={() => setModalMeal(null)}
        />
      )}
    </ScreenPageContainer>
  )
}
