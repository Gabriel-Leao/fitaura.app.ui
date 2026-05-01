import { Text, View } from 'react-native'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5'

import type { IoTReading } from '@/@types/shop'

type IotSensorBannerProps = {
  reading: IoTReading
}

export const IotSensorBanner = ({ reading }: IotSensorBannerProps) => (
  <View className='mx-4 mb-3 flex-row items-center gap-3 rounded-xl bg-blue-950/70 px-4 py-3'>
    <FontAwesome5
      name='microchip'
      size={14}
      color='#60a5fa'
    />
    <View className='flex-1'>
      <Text className='text-[11px] font-semibold uppercase tracking-wider text-blue-400'>
        Sensor do armazém (IoT)
      </Text>
      <Text className='text-xs text-blue-200'>
        🌡 {reading.temperature}°C · 💧 {reading.humidity}% umidade · {reading.timestamp}
      </Text>
    </View>
    <View className='h-2 w-2 rounded-full bg-green-400' />
  </View>
)
