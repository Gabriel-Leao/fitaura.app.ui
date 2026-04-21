import { useState } from 'react'
import { Alert, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { type Food, FOOD_QUICK_AMOUNTS, MEAL_LABELS, type MealId } from '@/@types/diet'
import { useDietContext } from '@/components/context/diet/useDietContext'

import { AddFoodForm } from './AddFoodForm'
import { FoodListItem } from './FoodListItem'
import { MacroPreview } from './MacroPreview'
import { QuantitySelector } from './QuantitySelector'

type AddEntryModalProps = {
  visible: boolean
  mealId: MealId
  date: string
  onClose: () => void
}

export const AddEntryModal = ({ visible, mealId, date, onClose }: AddEntryModalProps) => {
  const { allFoods, addEntry } = useDietContext()
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [quantity, setQuantity] = useState<string>('100')
  const [search, setSearch] = useState<string>('')
  const [showAddFood, setShowAddFood] = useState<boolean>(false)

  const filteredFoods = allFoods.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))

  const parsedQty = Math.min(1000, Math.max(1, parseInt(quantity) || 1))

  const preview = selectedFood
    ? {
        calories: Math.round(selectedFood.caloriesPer1Unit * parsedQty),
        protein: Math.round(selectedFood.proteinPer1Unit * parsedQty * 10) / 10,
        carbs: Math.round(selectedFood.carbsPer1Unit * parsedQty * 10) / 10,
        fat: Math.round(selectedFood.fatPer1Unit * parsedQty * 10) / 10,
      }
    : null

  const handleAdd = async () => {
    if (!selectedFood) return
    await addEntry(date, mealId, selectedFood, parsedQty)
    resetAndClose()
  }

  const handleFoodSelect = (food: Food) => {
    setSelectedFood(food)
    setQuantity(String(FOOD_QUICK_AMOUNTS[food.type][1]))
  }

  const resetAndClose = () => {
    setSelectedFood(null)
    setQuantity('100')
    setSearch('')
    setShowAddFood(false)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent>
      <View className='flex-1 justify-end bg-black/60'>
        <View className='max-h-[90%] rounded-t-3xl bg-[#021123] p-6'>
          <View className='mb-4 flex-row items-center justify-between'>
            <Text className='text-lg font-bold text-white'>
              {showAddFood ? 'Novo alimento' : `Adicionar em ${MEAL_LABELS[mealId]}`}
            </Text>
            <TouchableOpacity onPress={resetAndClose}>
              <FontAwesome5
                name='times'
                size={18}
                color='white'
              />
            </TouchableOpacity>
          </View>

          {showAddFood ? (
            <AddFoodForm
              onBack={() => setShowAddFood(false)}
              onSaved={(name) => {
                Alert.alert('Sucesso', `${name} adicionado à sua lista.`)
                setShowAddFood(false)
              }}
            />
          ) : (
            <>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder='Buscar alimento...'
                placeholderTextColor='#666'
                className='mb-3 rounded-xl bg-white/10 px-4 py-3 text-white'
              />

              <FlatList
                data={filteredFoods}
                keyExtractor={(item) => item.id}
                style={{ maxHeight: 180 }}
                renderItem={({ item }) => (
                  <FoodListItem
                    food={item}
                    selected={selectedFood?.id === item.id}
                    onPress={() => handleFoodSelect(item)}
                  />
                )}
                ListEmptyComponent={
                  <Text className='py-4 text-center text-gray-500'>Nenhum alimento encontrado</Text>
                }
              />

              <TouchableOpacity
                onPress={() => setShowAddFood(true)}
                className='mb-3 flex-row items-center gap-2 py-2'>
                <FontAwesome5
                  name='plus-circle'
                  size={14}
                  color='#B872FF'
                />
                <Text className='text-sm text-[#B872FF]'>Cadastrar novo alimento</Text>
              </TouchableOpacity>

              {selectedFood && (
                <View className='gap-4 border-t border-white/10 pt-4'>
                  <QuantitySelector
                    foodType={selectedFood.type}
                    quantity={quantity}
                    onChange={setQuantity}
                  />

                  {preview && <MacroPreview {...preview} />}

                  <TouchableOpacity
                    onPress={handleAdd}
                    className='items-center rounded-xl bg-[#B872FF] py-3'>
                    <Text className='font-bold text-white'>Adicionar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  )
}
