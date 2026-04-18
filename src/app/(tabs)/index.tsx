import { ScrollView, Text, View } from 'react-native'

import { useUserContext } from '@/components/context/useUserContext'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import ScreenPageTitle from '@/components/ScreenPageTitle'

const meals = [
  {
    title: 'Café da Manhã',
    foods: [
      { name: 'Aveia (50g)', calories: 200, protein: 7, carbs: 33, fat: 4 },
      { name: 'Banana', calories: 90, protein: 1, carbs: 23, fat: 0 },
      { name: 'Café sem açúcar', calories: 5, protein: 0, carbs: 1, fat: 0 },
    ],
  },
  {
    title: 'Almoço',
    foods: [
      { name: 'Arroz (150g)', calories: 210, protein: 4, carbs: 45, fat: 1 },
      { name: 'Feijão (100g)', calories: 90, protein: 5, carbs: 16, fat: 1 },
      { name: 'Frango (200g)', calories: 330, protein: 62, carbs: 0, fat: 7 },
    ],
  },
  {
    title: 'Lanche da Tarde',
    foods: [
      { name: 'Maçã', calories: 70, protein: 0, carbs: 19, fat: 0 },
      {
        name: 'Iogurte natural (170g)',
        calories: 120,
        protein: 9,
        carbs: 12,
        fat: 4,
      },
    ],
  },
  {
    title: 'Janta',
    foods: [
      {
        name: 'Batata doce (150g)',
        calories: 140,
        protein: 2,
        carbs: 33,
        fat: 0,
      },
      {
        name: 'Carne moída (200g)',
        calories: 300,
        protein: 41,
        carbs: 0,
        fat: 14,
      },
    ],
  },
]

const getGreetingAndSubtitle = () => {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Bom dia',
      subtitle: 'Hoje é um ótimo dia para se cuidar.',
    }
  }

  if (hour >= 12 && hour < 18) {
    return {
      greeting: 'Boa tarde',
      subtitle: 'Continue firme, você está no caminho certo.',
    }
  }

  return {
    greeting: 'Boa noite',
    subtitle: 'Feche o dia com leveza e equilíbrio.',
  }
}

const Index = () => {
  const { currentUser } = useUserContext()
  const { greeting, subtitle } = getGreetingAndSubtitle()

  return (
    <ScreenPageContainer className='py-20'>
      <ScrollView className='px-5 pb-10'>
        <ScreenPageTitle className='text-2xl'>
          {greeting} {currentUser?.name?.split(' ')[0]}
        </ScreenPageTitle>
        <Text className='text-center text-lg font-medium text-white'>{subtitle}</Text>

        <Text className='mb-3 mt-8 text-lg font-semibold text-white'>Refeições de hoje</Text>

        {meals.map((meal, index) => {
          const total = meal.foods.reduce(
            (acc, f) => ({
              calories: acc.calories + f.calories,
              protein: acc.protein + f.protein,
              carbs: acc.carbs + f.carbs,
              fat: acc.fat + f.fat,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 },
          )

          return (
            <View
              key={index}
              className='mb-5 rounded-xl border border-white/10 p-4'>
              <Text className='text-base font-semibold text-white'>{meal.title}</Text>

              <Text className='mb-3 mt-1 text-sm text-gray-400'>
                {total.calories} kcal • {total.protein}P • {total.carbs}C • {total.fat}G
              </Text>

              {meal.foods.map((food, i) => (
                <View
                  key={i}
                  className='flex-row justify-between py-1'>
                  <Text className='text-gray-300'>{food.name}</Text>

                  <Text className='text-gray-400'>
                    {food.calories} kcal • {food.protein}P • {food.carbs}C • {food.fat}G
                  </Text>
                </View>
              ))}
            </View>
          )
        })}
      </ScrollView>
    </ScreenPageContainer>
  )
}

export default Index
