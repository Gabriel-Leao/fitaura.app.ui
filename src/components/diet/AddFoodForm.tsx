import { useState } from 'react'
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { FOOD_UNIT_LABEL, FoodType as FoodTypeEnum } from '@/@types/diet'
import { useDietContext } from '@/components/context/diet/useDietContext'

import { MacroPreview } from './MacroPreview'

const FOOD_TYPE_OPTIONS: { type: FoodTypeEnum; label: string }[] = [
  { type: FoodTypeEnum.Solid, label: 'Gramas (g)' },
  { type: FoodTypeEnum.Countable, label: 'Unidade (un)' },
  { type: FoodTypeEnum.Liquid, label: 'Mililitros (ml)' },
]

const BASE_OPTIONS: Record<FoodTypeEnum, number[]> = {
  [FoodTypeEnum.Solid]: [1, 10, 100],
  [FoodTypeEnum.Countable]: [1, 6, 12],
  [FoodTypeEnum.Liquid]: [1, 100, 250],
}

type AddFoodFormProps = {
  onBack: () => void
  onSaved: (name: string) => void
}

export const AddFoodForm = ({ onBack, onSaved }: AddFoodFormProps) => {
  const { addCustomFood } = useDietContext()
  const [name, setName] = useState<string>('')
  const [foodType, setFoodType] = useState<FoodTypeEnum>(FoodTypeEnum.Solid)
  const [base, setBase] = useState<number>(100)
  const [calories, setCalories] = useState<string>('')
  const [protein, setProtein] = useState<string>('')
  const [carbs, setCarbs] = useState<string>('')
  const [fat, setFat] = useState<string>('')

  const parsedBase = base
  const unitLabel = FOOD_UNIT_LABEL[foodType]

  const preview =
    calories && protein && carbs && fat
      ? {
          calories: parseFloat(calories),
          protein: parseFloat(protein),
          carbs: parseFloat(carbs),
          fat: parseFloat(fat),
        }
      : null

  const handleTypeChange = (type: FoodTypeEnum) => {
    setFoodType(type)
    setBase(BASE_OPTIONS[type][0])
  }

  const handleSave = async () => {
    if (!name.trim() || !calories || !protein || !carbs || !fat) {
      Alert.alert('Erro', 'Preencha todos os campos nutricionais.')
      return
    }
    await addCustomFood({
      name: name.trim(),
      type: foodType,
      caloriesPer1Unit: parseFloat(calories) / parsedBase,
      proteinPer1Unit: parseFloat(protein) / parsedBase,
      carbsPer1Unit: parseFloat(carbs) / parsedBase,
      fatPer1Unit: parseFloat(fat) / parsedBase,
    })
    onSaved(name.trim())
    setName('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
    setBase(100)
    setFoodType(FoodTypeEnum.Solid)
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text className='mb-1 text-sm text-gray-400'>Nome do alimento</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder='Ex: Pão francês'
        placeholderTextColor='#666'
        className='mb-4 rounded-xl bg-white/10 px-4 py-3 text-white'
      />

      <Text className='mb-2 text-sm text-gray-400'>Tipo</Text>
      <View className='mb-4 flex-row gap-2'>
        {FOOD_TYPE_OPTIONS.map(({ type, label }) => (
          <TouchableOpacity
            key={type}
            onPress={() => handleTypeChange(type)}
            className={`flex-1 items-center rounded-xl py-2 ${foodType === type ? 'bg-[#B872FF]' : 'bg-white/10'}`}>
            <Text className='text-center text-xs text-white'>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className='mb-2 text-sm text-gray-400'>Valores nutricionais por:</Text>
      <View className='mb-4 flex-row gap-2'>
        {BASE_OPTIONS[foodType].map((b) => (
          <TouchableOpacity
            key={b}
            onPress={() => setBase(b)}
            className={`flex-1 items-center rounded-xl py-2 ${base === b ? 'bg-[#B872FF]' : 'bg-white/10'}`}>
            <Text className='text-sm text-white'>
              {b}
              {unitLabel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {[
        { label: `Calorias (kcal) em ${base}${unitLabel}`, value: calories, set: setCalories },
        { label: `Proteína (g) em ${base}${unitLabel}`, value: protein, set: setProtein },
        { label: `Carboidrato (g) em ${base}${unitLabel}`, value: carbs, set: setCarbs },
        { label: `Gordura (g) em ${base}${unitLabel}`, value: fat, set: setFat },
      ].map(({ label, value, set }) => (
        <View key={label}>
          <Text className='mb-1 text-sm text-gray-400'>{label}</Text>
          <TextInput
            value={value}
            onChangeText={set}
            placeholderTextColor='#666'
            keyboardType='numeric'
            className='mb-3 rounded-xl bg-white/10 px-4 py-3 text-white'
          />
        </View>
      ))}

      {preview && (
        <View className='mb-4'>
          <MacroPreview {...preview} />
        </View>
      )}

      <TouchableOpacity
        onPress={handleSave}
        className='mb-3 mt-2 items-center rounded-xl bg-[#B872FF] py-3'>
        <Text className='font-bold text-white'>Salvar alimento</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onBack}
        className='items-center py-2'>
        <Text className='text-gray-400'>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
