import { useState } from 'react'
import { Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { type ExerciseEntryInput, type WorkoutTemplate } from '@/@types/workout'
import { useWorkoutContext } from '@/components/context/workout/useWorkoutContext'

import { ExerciseEntryItem } from './ExerciseEntryItem'
import { ExercisePicker } from './ExercisePicker'

type TemplatesModalProps = {
  visible: boolean
  onClose: () => void
}

type TemplateView = 'list' | 'editing'

export const TemplatesModal = ({ visible, onClose }: TemplatesModalProps) => {
  const { customTemplates, addCustomTemplate, updateCustomTemplate, deleteCustomTemplate } =
    useWorkoutContext()

  const [view, setView] = useState<TemplateView>('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [templateName, setTemplateName] = useState<string>('')
  const [entries, setEntries] = useState<ExerciseEntryInput[]>([])
  const [showPicker, setShowPicker] = useState<boolean>(false)

  const openNew = () => {
    setEditingId(null)
    setTemplateName('Novo template')
    setEntries([])
    setView('editing')
  }

  const openEdit = (template: WorkoutTemplate) => {
    setEditingId(template.id)
    setTemplateName(template.name)
    setEntries(template.exercises.map((e) => ({ ...e })))
    setView('editing')
  }

  const handleDelete = (id: string) => {
    Alert.alert('Excluir template', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteCustomTemplate(id) },
    ])
  }

  const handleSave = async () => {
    if (!templateName.trim()) {
      Alert.alert('Erro', 'Informe o nome do template.')
      return
    }
    if (editingId) {
      await updateCustomTemplate(editingId, { name: templateName, exercises: entries })
    } else {
      await addCustomTemplate({ name: templateName, exercises: entries })
    }
    setView('list')
  }

  const resetAndClose = () => {
    setView('list')
    setEditingId(null)
    setTemplateName('')
    setEntries([])
    setShowPicker(false)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent>
      <View className='flex-1 justify-end bg-black/60'>
        <View className='max-h-[92%] rounded-t-3xl bg-[#021123] p-6'>
          <View className='mb-4 flex-row items-center justify-between'>
            <View className='flex-row items-center gap-3'>
              {view === 'editing' && (
                <TouchableOpacity onPress={() => setView('list')}>
                  <FontAwesome5
                    name='arrow-left'
                    size={16}
                    color='white'
                  />
                </TouchableOpacity>
              )}
              <Text className='text-lg font-bold text-white'>
                {view === 'list'
                  ? 'Meus templates'
                  : editingId
                    ? 'Editar template'
                    : 'Novo template'}
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

          {view === 'list' ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {customTemplates.length === 0 ? (
                <Text className='py-6 text-center text-gray-500'>
                  Nenhum template criado ainda.
                </Text>
              ) : (
                customTemplates.map((t) => (
                  <View
                    key={t.id}
                    className='mb-2 flex-row items-center justify-between rounded-xl border border-white/10 px-4 py-3'>
                    <View className='flex-1'>
                      <Text className='font-semibold text-white'>{t.name}</Text>
                      <Text className='text-xs text-gray-400'>
                        {t.exercises.length} exercício(s)
                      </Text>
                    </View>
                    <View className='flex-row gap-3'>
                      <TouchableOpacity onPress={() => openEdit(t)}>
                        <FontAwesome5
                          name='edit'
                          size={14}
                          color='#B872FF'
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(t.id)}>
                        <FontAwesome5
                          name='trash-alt'
                          size={14}
                          color='#ef4444'
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
              <TouchableOpacity
                onPress={openNew}
                className='mt-3 flex-row items-center justify-center gap-2 rounded-xl border border-[#B872FF]/40 py-3'>
                <FontAwesome5
                  name='plus'
                  size={14}
                  color='#B872FF'
                />
                <Text className='text-sm text-[#B872FF]'>Novo template</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className='mb-1 text-sm text-gray-400'>Nome do template</Text>
              <TextInput
                value={templateName}
                onChangeText={setTemplateName}
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
                      onChange={(updated) =>
                        setEntries((prev) => prev.map((e, idx) => (idx === i ? updated : e)))
                      }
                      onRemove={() => setEntries((prev) => prev.filter((_, idx) => idx !== i))}
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
                    onPress={handleSave}
                    className='items-center rounded-xl bg-[#B872FF] py-3'>
                    <Text className='font-bold text-white'>Salvar template</Text>
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
