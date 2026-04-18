import { Text, TouchableOpacity } from 'react-native'

type CustomButtonProps = {
  onPress: () => void
  label: string
  disabled?: boolean
}

const CustomButton = ({ onPress, label, disabled = false }: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className='w-4/5 rounded-xl bg-[#B872FF] px-6 py-3 disabled:bg-[#B872FF60]'
      onPress={onPress}
      disabled={disabled}>
      <Text className='text-center font-bold text-[#fff] disabled:text-[#98A0A8]'>{label}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton
