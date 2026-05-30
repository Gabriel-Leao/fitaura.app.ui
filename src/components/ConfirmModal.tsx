import { Modal, Text, TouchableOpacity, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import { cva, type VariantProps } from 'class-variance-authority'

import { COLORS } from '@/constants/colors'

const confirmButton = cva('items-center rounded-xl py-3', {
  variants: {
    variant: {
      primary: 'bg-primary',
      danger: 'bg-danger',
      ghost: 'bg-white/10',
      success: 'bg-success',
    },
  },
  defaultVariants: { variant: 'primary' },
})

const confirmButtonText = cva('font-bold text-white')

const ICON: Record<string, { name: string; color: string; bg: string } | undefined> = {
  success: { name: 'check', color: COLORS.success, bg: 'bg-success/20' },
  danger: { name: 'exclamation-triangle', color: COLORS.danger, bg: 'bg-danger/20' },
}

type ConfirmModalProps = VariantProps<typeof confirmButton> & {
  visible: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  showCancel?: boolean
  onConfirm: () => void
  onCancel?: () => void
}

const ConfirmModal = ({
  visible,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  showCancel = true,
  variant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const icon = ICON[variant as string]

  return (
    <Modal
      visible={visible}
      animationType='fade'
      transparent>
      <View className='flex-1 items-center justify-center bg-black/60 px-6'>
        <View className='w-full items-center rounded-2xl bg-background p-6'>
          {icon && (
            <View className={`mb-4 h-16 w-16 items-center justify-center rounded-full ${icon.bg}`}>
              <FontAwesome5
                name={icon.name}
                size={28}
                color={icon.color}
              />
            </View>
          )}

          <Text className='mb-2 text-lg font-bold text-white'>{title}</Text>
          <Text className='mb-6 text-center text-sm text-gray-400'>{description}</Text>

          <View className='w-full flex-row gap-3'>
            {showCancel && (
              <TouchableOpacity
                onPress={onCancel}
                className={confirmButton({ variant: 'ghost' }) + ' flex-1'}>
                <Text className={confirmButtonText()}>{cancelLabel}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={onConfirm}
              className={confirmButton({ variant }) + (showCancel ? ' flex-1' : ' w-full')}>
              <Text className={confirmButtonText()}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmModal
