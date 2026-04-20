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

type ViewMode = 'list' | 'editing'

export const TemplatesModal = ({ visible, onClose }: TemplatesModalProps) => {
  const {
    customTemplates,
    addCustomTemplate,
    updateCustomTemplate,
    deleteCustomTemplate,
    removeLogsByTemplateName,
  } = useWorkoutContext()

  const [view, setView] = useState<ViewMode>('list')
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

  const handleDelete = (template: WorkoutTemplate) => {
    Alert.alert('Excluir template', `Deseja excluir "${template.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir e remover treinos',
        style: 'destructive',
        onPress: async () => {
          await removeLogsByTemplateName(template.name)
          await deleteCustomTemplate(template.id)
        },
      },
      {
        text: 'Só o template',
        style: 'destructive',
        onPress: () => deleteCustomTemplate(template.id),
      },
    ])
  }

  const handleSave = async () => {
    if (!templateName.trim()) {
      Alert.alert('Erro', 'Informe o nome do template.')
      return
    }
    const nameExists = customTemplates.some(
      (t) => t.name.toLowerCase() === templateName.trim().toLowerCase() && t.id !== editingId,
    )
    if (nameExists) {
      Alert.alert('Nome em uso', 'Já existe um template com esse nome. Escolha outro.')
      return
    }
    if (editingId) {
      await updateCustomTemplate(editingId, { name: templateName.trim(), exercises: entries })
    } else {
      await addCustomTemplate({ name: templateName.trim(), exercises: entries })
    }
    setView('list')
  }

  const moveEntry = (index: number, direction: 'up' | 'down') => {
    setEntries((prev) => {
      const next = [...prev]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
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
                      <TouchableOpacity onPress={() => handleDelete(t)}>
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
                  onSelect={(entry) => {
                    setEntries((prev) => [...prev, entry])
                    setShowPicker(false)
                  }}
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
                      onMoveUp={() => moveEntry(i, 'up')}
                      onMoveDown={() => moveEntry(i, 'down')}
                      isFirst={i === 0}
                      isLast={i === entries.length - 1}
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
