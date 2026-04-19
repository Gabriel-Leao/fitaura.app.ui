import { useState } from 'react'
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { type ExerciseEntryInput, type WorkoutTemplate } from '@/@types/workout'
import { useUserContext } from '@/components/context/user/useUserContext'
import { useWorkoutContext } from '@/components/context/workout/useWorkoutContext'
import { SUGGESTED_TEMPLATES } from '@/constants/workout'

import { ExerciseEntryItem } from './ExerciseEntryItem'
import { ExercisePicker } from './ExercisePicker'

type LogWorkoutModalProps = {
  visible: boolean
  date: string
  onClose: () => void
}

type Step = 'select' | 'review'

export const LogWorkoutModal = ({ visible, date, onClose }: LogWorkoutModalProps) => {
  const { currentUser } = useUserContext()
  const { customTemplates, logWorkout, addCustomTemplate } = useWorkoutContext()

  const [step, setStep] = useState<Step>('select')
  const [workoutName, setWorkoutName] = useState<string>('')
  const [entries, setEntries] = useState<ExerciseEntryInput[]>([])
  const [showPicker, setShowPicker] = useState<boolean>(false)
  const [saveAsTemplate, setSaveAsTemplate] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<'suggested' | 'custom'>('suggested')

  const suggestedForUser = SUGGESTED_TEMPLATES.filter(
    (t) => !currentUser?.goal || t.goalTag === currentUser.goal,
  )

  const handleSelectTemplate = (template: WorkoutTemplate) => {
    setWorkoutName(template.name)
    setEntries(template.exercises.map((e) => ({ ...e })))
    setStep('review')
  }

  const handleFromScratch = () => {
    setWorkoutName('Meu treino')
    setEntries([])
    setStep('review')
  }

  const handleConfirm = async () => {
    if (entries.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um exercício.')
      return
    }
    if (saveAsTemplate) {
      await addCustomTemplate({ name: workoutName, exercises: entries })
    }
    await logWorkout(date, workoutName, entries, currentUser?.weight ?? 70)
    resetAndClose()
  }

  const resetAndClose = () => {
    setStep('select')
    setWorkoutName('')
    setEntries([])
    setShowPicker(false)
    setSaveAsTemplate(false)
    setActiveTab('suggested')
    onClose()
  }

  const updateEntry = (index: number, updated: ExerciseEntryInput) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? updated : e)))
  }

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index))
  }

  const TemplateCard = ({ template }: { template: WorkoutTemplate }) => (
    <TouchableOpacity
      onPress={() => handleSelectTemplate(template)}
      className='mb-2 rounded-xl border border-white/10 p-3'>
      <Text className='font-semibold text-white'>{template.name}</Text>
      <Text className='mt-0.5 text-xs text-gray-400'>{template.exercises.length} exercício(s)</Text>
    </TouchableOpacity>
  )

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent>
      <View className='flex-1 justify-end bg-black/60'>
        <View className='max-h-[92%] rounded-t-3xl bg-[#021123] p-6'>
          <View className='mb-4 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-3'>
              {step === 'review' && (
                <TouchableOpacity onPress={() => setStep('select')}>
                  <FontAwesome5
                    name='arrow-left'
                    size={16}
                    color='white'
                  />
                </TouchableOpacity>
              )}
              <Text className='text-lg font-bold text-white'>
                {step === 'select' ? 'Registrar treino' : 'Revisar treino'}
              </Text>
            </View>
            <TouchableOpacity onPress={resetAndClose}>
              <FontAwesome5
                name='times'
                size={18}
                color='white'
              />
            </TouchableOpacity>
          </View>

          {step === 'select' ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className='mb-4 flex-row gap-2'>
                {(['suggested', 'custom'] as const).map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`flex-1 items-center rounded-xl py-2 ${activeTab === tab ? 'bg-[#B872FF]' : 'bg-white/10'}`}>
                    <Text className='text-sm text-white'>
                      {tab === 'suggested' ? 'Sugerido' : 'Meus templates'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {activeTab === 'suggested' ? (
                suggestedForUser.length > 0 ? (
                  suggestedForUser.map((t) => (
                    <TemplateCard
                      key={t.id}
                      template={t}
                    />
                  ))
                ) : (
                  <Text className='py-4 text-center text-gray-500'>
                    Nenhum treino sugerido para seu objetivo.
                  </Text>
                )
              ) : customTemplates.length > 0 ? (
                customTemplates.map((t) => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                  />
                ))
              ) : (
                <Text className='py-4 text-center text-gray-500'>
                  Nenhum template criado ainda.
                </Text>
              )}

              <TouchableOpacity
                onPress={handleFromScratch}
                className='mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-[#B872FF]/40 py-3'>
                <FontAwesome5
                  name='plus'
                  size={14}
                  color='#B872FF'
                />
                <Text className='text-sm text-[#B872FF]'>Começar do zero</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className='mb-1 text-sm text-gray-400'>Nome do treino</Text>
              <TextInput
                value={workoutName}
                onChangeText={setWorkoutName}
                className='mb-4 rounded-xl bg-white/10 px-4 py-3 text-white'
              />

              {showPicker ? (
                <ExercisePicker
                  onSelect={(entry) => setEntries((prev) => [...prev, entry])}
                  onClose={() => setShowPicker(false)}
                />
              ) : (
                <>
                  {entries.map((entry, i) => (
                    <ExerciseEntryItem
                      key={i}
                      entry={entry}
                      onChange={(updated) => updateEntry(i, updated)}
                      onRemove={() => removeEntry(i)}
                    />
                  ))}

                  <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    className='mb-4 flex-row items-center gap-2 py-2'>
                    <FontAwesome5
                      name='plus-circle'
                      size={14}
                      color='#B872FF'
                    />
                    <Text className='text-sm text-[#B872FF]'>Adicionar exercício</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSaveAsTemplate(!saveAsTemplate)}
                    className='mb-4 flex-row items-center gap-3 rounded-xl bg-white/5 px-4 py-3'>
                    <View
                      className={`h-5 w-5 items-center justify-center rounded ${saveAsTemplate ? 'bg-[#B872FF]' : 'border border-gray-500'}`}>
                      {saveAsTemplate && (
                        <FontAwesome5
                          name='check'
                          size={10}
                          color='white'
                        />
                      )}
                    </View>
                    <Text className='text-sm text-white'>Salvar como template</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleConfirm}
                    className='items-center rounded-xl bg-[#B872FF] py-3'>
                    <Text className='font-bold text-white'>Confirmar treino</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  )
}
