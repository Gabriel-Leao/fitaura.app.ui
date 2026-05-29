import { Text, TouchableOpacity } from 'react-native'

type CustomButtonProps = {
  onPress: () => void
  label: string
  disabled?: boolean
}

const CustomButton = ({ onPress, label, disabled = false }: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className='w-4/5 rounded-xl bg-primary px-6 py-3 disabled:bg-primary-muted'
      onPress={onPress}
      disabled={disabled}>
      <Text className='text-center font-bold text-white disabled:text-muted'>{label}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton
